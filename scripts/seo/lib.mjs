// Shared helpers for the SEO update scripts.
// All scripts read credentials from ../../.dev.vars (gitignored).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHOP = "baitboardsdirect.myshopify.com";
const API_VERSION = "2024-10";

export const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SCRIPT_DIR = join(PROJECT_ROOT, "scripts", "seo");

export function loadEnv() {
  const envPath = join(PROJECT_ROOT, ".dev.vars");
  const text = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z_0-9]*)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

let _token = null;
export async function getAdminToken() {
  if (_token) return _token;
  const env = loadEnv();
  const id = env.SHOPIFY_ADMIN_CLIENT_ID;
  const secret = env.SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!id || !secret) throw new Error("SHOPIFY_ADMIN_CLIENT_ID / SHOPIFY_ADMIN_CLIENT_SECRET not set in .dev.vars");

  const resp = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: id, client_secret: secret, grant_type: "client_credentials" }),
  });
  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    throw new Error(`Token exchange failed: ${resp.status} ${JSON.stringify(data)}`);
  }
  _token = data.access_token;
  console.log(`[auth] minted admin token (expires in ${data.expires_in}s, scopes: ${data.scope})`);
  return _token;
}

export async function adminFetch(path, init = {}) {
  const token = await getAdminToken();
  const url = path.startsWith("http")
    ? path
    : `https://${SHOP}/admin/api/${API_VERSION}${path}`;
  const resp = await fetch(url, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  // Shopify rate-limit handling: respect 429, sleep, retry once.
  if (resp.status === 429) {
    const retry = parseInt(resp.headers.get("retry-after") || "2", 10) * 1000;
    await new Promise((r) => setTimeout(r, retry));
    return adminFetch(path, init);
  }
  return resp;
}

export async function fetchAllProducts() {
  // Paginated fetch. Shopify caps page size at 250.
  const all = [];
  let pageInfo = null;
  let page = 1;
  while (true) {
    const params = pageInfo
      ? `?page_info=${encodeURIComponent(pageInfo)}&limit=250`
      : "?limit=250&fields=id,title,handle,body_html,vendor,product_type,tags,status,images,variants";
    const resp = await adminFetch(`/products.json${params}`);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`fetchAllProducts page ${page} failed: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    all.push(...data.products);
    const link = resp.headers.get("link") || "";
    const match = link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/);
    if (!match) break;
    pageInfo = match[1];
    page++;
  }
  return all;
}

export async function fetchProductMetafields(productId) {
  const resp = await adminFetch(`/products/${productId}/metafields.json`);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`metafields ${productId} failed: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  return data.metafields || [];
}

export function saveJSON(filename, data) {
  if (!existsSync(SCRIPT_DIR)) mkdirSync(SCRIPT_DIR, { recursive: true });
  const path = join(SCRIPT_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
  return path;
}

export function saveText(filename, text) {
  if (!existsSync(SCRIPT_DIR)) mkdirSync(SCRIPT_DIR, { recursive: true });
  const path = join(SCRIPT_DIR, filename);
  writeFileSync(path, text, "utf8");
  return path;
}

export function timestamp() {
  return new Date().toISOString().slice(0, 10);
}

// Polite throttling for sequential operations.
export async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
