// link-check.mjs — sitemap-based crawl + outbound/internal link health check.
//
// Substitute for the on-page-crawler signal we'd otherwise get from an Ahrefs
// UI Site Audit project. Per user policy 2026-05-20: no Ahrefs UI projects;
// everything centralised in this repo + gsc-monitor via CLI/API. This script
// fills the specific gap of detecting OUTGOING broken/redirected links, which
// the Ahrefs API on Standard plan does not expose.
//
// Usage:
//   node scripts/seo/link-check.mjs                  # uses live prod
//   node scripts/seo/link-check.mjs https://example/ # custom origin
//
// Writes a markdown report to scripts/seo/whitepaper/audit-links-<date>.md.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ORIGIN = process.argv[2] || 'https://baitboardsdirect.com';
const SITEMAP_URL = `${ORIGIN}/sitemap-index.xml`;
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;
const UA = 'BaitBoardsDirect-LinkCheck/1.0 (+ops; sitemap-based outbound link health)';

const REPORT_DATE = new Date().toISOString().slice(0, 10);
const __filename = fileURLToPath(import.meta.url);
const REPORT_PATH = path.join(path.dirname(__filename), 'whitepaper', `audit-links-${REPORT_DATE}.md`);

// ─── helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, headers: { 'User-Agent': UA, ...(opts.headers || {}) } });
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(url) {
  const res = await fetchWithTimeout(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function parseLocs(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function extractLinks(html, pageUrl) {
  const links = new Set();
  const re = /<a\s+[^>]*href=["']([^"']+)["']/gi;
  let m;
  const pageOrigin = new URL(pageUrl).origin;
  while ((m = re.exec(html))) {
    let href = m[1].trim();
    if (!href) continue;
    if (href.startsWith('#')) continue;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    // resolve relative -> absolute
    try {
      const abs = new URL(href, pageUrl).toString().split('#')[0];
      links.add(abs);
      // tag whether internal or external (we'll re-derive later, just collect)
    } catch {
      // skip malformed
    }
  }
  return Array.from(links);
}

// Follow redirects manually so we can count chain length and report final URL.
async function checkLink(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    try {
      const res = await fetchWithTimeout(current, { method: 'HEAD', redirect: 'manual' });
      let status = res.status;
      // Some hosts return 405 / 403 on HEAD; retry with GET
      if (status === 405 || status === 403 || status === 501) {
        const getRes = await fetchWithTimeout(current, { method: 'GET', redirect: 'manual' });
        status = getRes.status;
        chain.push({ url: current, status });
        if (status >= 300 && status < 400) {
          const loc = getRes.headers.get('location');
          if (!loc) return { ok: false, finalStatus: status, finalUrl: current, chain, reason: 'redirect without location' };
          current = new URL(loc, current).toString();
          continue;
        }
        return { ok: status < 400, finalStatus: status, finalUrl: current, chain };
      }
      chain.push({ url: current, status });
      if (status >= 300 && status < 400) {
        const loc = res.headers.get('location');
        if (!loc) return { ok: false, finalStatus: status, finalUrl: current, chain, reason: 'redirect without location' };
        current = new URL(loc, current).toString();
        continue;
      }
      return { ok: status < 400, finalStatus: status, finalUrl: current, chain };
    } catch (err) {
      chain.push({ url: current, status: 0, error: err.name === 'AbortError' ? 'timeout' : (err.message || String(err)) });
      return { ok: false, finalStatus: 0, finalUrl: current, chain, reason: err.name === 'AbortError' ? 'timeout' : (err.message || String(err)) };
    }
  }
  return { ok: false, finalStatus: 0, finalUrl: current, chain, reason: 'too many redirects' };
}

async function pool(items, worker, concurrency) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array(Math.min(concurrency, items.length)).fill(0).map(async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch (err) {
        results[idx] = { error: err.message || String(err) };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// ─── main ───────────────────────────────────────────────────────────────────

console.log(`[link-check] origin = ${ORIGIN}`);
console.log(`[link-check] sitemap = ${SITEMAP_URL}`);

// 1. fetch sitemap index, expand to all URLs
const sitemapXml = await fetchText(SITEMAP_URL);
let allPageUrls = [];
const sitemapLocs = parseLocs(sitemapXml);

if (sitemapLocs.some((l) => l.includes('.xml'))) {
  // it's a sitemap index — fetch nested
  for (const subXml of sitemapLocs) {
    if (!subXml.endsWith('.xml')) continue;
    try {
      const xml = await fetchText(subXml);
      allPageUrls.push(...parseLocs(xml));
    } catch (e) {
      console.warn(`[link-check] failed sitemap fetch ${subXml}: ${e.message}`);
    }
  }
} else {
  allPageUrls = sitemapLocs;
}

allPageUrls = Array.from(new Set(allPageUrls));
console.log(`[link-check] discovered ${allPageUrls.length} page URLs from sitemap`);

// 2. for each page, fetch HTML and extract all links
const linkSources = new Map(); // linkUrl -> Set<sourcePageUrl>
const pageFetchFails = [];
let pageIdx = 0;
for (const pageUrl of allPageUrls) {
  pageIdx++;
  try {
    const html = await fetchText(pageUrl);
    const links = extractLinks(html, pageUrl);
    for (const l of links) {
      if (!linkSources.has(l)) linkSources.set(l, new Set());
      linkSources.get(l).add(pageUrl);
    }
    if (pageIdx % 10 === 0) console.log(`[link-check] page-extract ${pageIdx}/${allPageUrls.length}`);
  } catch (e) {
    pageFetchFails.push({ url: pageUrl, error: e.message });
  }
}
console.log(`[link-check] extracted ${linkSources.size} unique links from ${allPageUrls.length - pageFetchFails.length} pages`);

// 3. check each unique link in parallel (capped)
const uniqueLinks = Array.from(linkSources.keys());
console.log(`[link-check] checking ${uniqueLinks.length} links with concurrency=${CONCURRENCY}`);

let checked = 0;
const checks = await pool(uniqueLinks, async (url) => {
  const result = await checkLink(url);
  checked++;
  if (checked % 25 === 0) console.log(`[link-check] checked ${checked}/${uniqueLinks.length}`);
  return { url, ...result };
}, CONCURRENCY);

// 4. classify
const internalOrigin = new URL(ORIGIN).origin;
const buckets = {
  ok: [],
  redirectChain: [],
  broken4xx: [],
  broken5xx: [],
  network: [],
};
for (const c of checks) {
  const sources = Array.from(linkSources.get(c.url) || []);
  const internal = c.url.startsWith(internalOrigin);
  const row = { ...c, sources, internal };
  if (!c.ok && c.finalStatus === 0) buckets.network.push(row);
  else if (!c.ok && c.finalStatus >= 500) buckets.broken5xx.push(row);
  else if (!c.ok && c.finalStatus >= 400) buckets.broken4xx.push(row);
  else if (c.chain && c.chain.length > 1) buckets.redirectChain.push(row);
  else buckets.ok.push(row);
}

// 5. write markdown report
const lines = [];
lines.push(`# Outbound + internal link health audit — baitboardsdirect.com`);
lines.push('');
lines.push(`**Run date:** ${REPORT_DATE}`);
lines.push(`**Origin:** ${ORIGIN}`);
lines.push(`**Sitemap:** ${SITEMAP_URL}`);
lines.push(`**Tool:** \`scripts/seo/link-check.mjs\` — built in-house per user policy 2026-05-20 (no Ahrefs UI Site Audit project; centralise SEO tooling in this repo).`);
lines.push('');
lines.push('---');
lines.push('');
lines.push('## TL;DR');
lines.push('');
const total = uniqueLinks.length;
lines.push(`- **Pages crawled:** ${allPageUrls.length} (from sitemap)`);
lines.push(`- **Unique links checked:** ${total}`);
lines.push(`- **Healthy (2xx):** ${buckets.ok.length}`);
lines.push(`- **Redirect chains (>1 hop):** ${buckets.redirectChain.length}`);
lines.push(`- **4xx (broken / forbidden):** ${buckets.broken4xx.length}`);
lines.push(`- **5xx (server error):** ${buckets.broken5xx.length}`);
lines.push(`- **Network errors / timeouts:** ${buckets.network.length}`);
lines.push(`- **Page-fetch failures:** ${pageFetchFails.length}`);
lines.push('');
lines.push('---');
lines.push('');

function tableRow(b) {
  const src = b.sources.slice(0, 3).map((s) => s.replace(internalOrigin, '')).join(', ') + (b.sources.length > 3 ? `, +${b.sources.length - 3} more` : '');
  const chain = b.chain ? b.chain.map((c) => c.status || 'ERR').join(' → ') : '';
  const internal = b.internal ? 'int' : 'ext';
  return `| ${b.url} | ${internal} | ${b.finalStatus || 'ERR'} | ${chain} | ${b.reason || ''} | ${src} |`;
}

function section(title, bucket, note) {
  lines.push(`## ${title}`);
  lines.push('');
  if (note) lines.push(note);
  lines.push('');
  if (bucket.length === 0) {
    lines.push('_None found._');
    lines.push('');
    return;
  }
  lines.push('| URL | int/ext | Final | Chain | Reason | Source pages |');
  lines.push('|---|---|---|---|---|---|');
  for (const b of bucket) lines.push(tableRow(b));
  lines.push('');
}

section('🔴 4xx — broken links', buckets.broken4xx, 'Links from one of our pages that return a 4xx status. Top action item — fix or remove.');
section('🔴 5xx — server errors', buckets.broken5xx, 'Target servers errored. Often transient but worth a recheck.');
section('🟡 Network errors / timeouts', buckets.network, 'Target host unreachable, DNS fail, or >15s timeout. Often the host is alive but slow — worth manual confirmation.');
section('🟡 Redirect chains (>1 hop)', buckets.redirectChain, 'Costs crawl budget. Ideal: link directly to final destination. We control all internal redirects via `worker.js` + `redirects.js`; external chains we can only re-anchor at the link source.');

if (pageFetchFails.length) {
  lines.push('## Page-fetch failures');
  lines.push('');
  lines.push('Pages from the sitemap that failed to fetch (no links could be extracted from them):');
  lines.push('');
  for (const f of pageFetchFails) lines.push(`- \`${f.url}\` — ${f.error}`);
  lines.push('');
}

lines.push('---');
lines.push('');
lines.push('## Method notes');
lines.push('');
lines.push('- Sitemap-index fetch → expand nested sitemaps → dedupe URLs.');
lines.push('- HTML extracted via regex on `<a href=...>` — sufficient for static Astro output. No JS evaluation (matches Googlebot static-fetch pass).');
lines.push('- Each unique linked URL HEAD-checked first; if HEAD returns 405/403/501, retried as GET.');
lines.push('- Redirects followed manually (max 6 hops) so chain length + each hop status is recorded.');
lines.push(`- Concurrency capped at ${CONCURRENCY}. Timeout ${TIMEOUT_MS}ms per fetch.`);
lines.push('- This audit substitutes for the Ahrefs UI Site Audit outgoing-broken-link signal. Per CLAUDE.md §5: all SEO tooling stays in this repo + gsc-monitor.');
lines.push('');

writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
console.log(`[link-check] report written to ${REPORT_PATH}`);
console.log(`[link-check] summary: ${buckets.ok.length} ok, ${buckets.redirectChain.length} chained, ${buckets.broken4xx.length} 4xx, ${buckets.broken5xx.length} 5xx, ${buckets.network.length} net-err`);
