#!/usr/bin/env node
/**
 * Submit the full sitemap to IndexNow on deploy.
 *
 * Usage:  node scripts/indexnow-ping.js
 * Run from .github/workflows/deploy-prod.yml.
 *
 * Requires environment vars (or hardcode after key generation):
 *   INDEXNOW_KEY (the 32-char hex string also published at /public/{KEY}.txt)
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = 'ozcowilliams.com.au';
const SITE = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || '__TODO__: generate via https://www.bing.com/indexnow/getstarted';

async function fetchSitemap() {
  const res = await fetch(`${SITE}/sitemap-index.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  // Naive but adequate XML scrape — recursively expand sitemap-index → urlset
  const childSitemaps = [...xml.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const sm of childSitemaps) {
    const sub = await fetch(sm).then((r) => r.text());
    for (const m of sub.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!m[1].endsWith('.xml')) urls.push(m[1]);
    }
  }
  return urls;
}

async function ping(urls) {
  if (KEY.startsWith('__TODO__')) {
    console.warn('IndexNow key not configured — skipping ping.');
    return;
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow → ${res.status} for ${urls.length} URLs`);
}

async function main() {
  const urls = await fetchSitemap();
  console.log(`Discovered ${urls.length} indexable URLs`);
  await ping(urls);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
