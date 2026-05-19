// Post-build: rewrite dist/_headers to pin CSP hashes for every inline script
// Extracts all inline <script> bodies from dist/*.html, hashes them, and
// replaces the {{SCRIPT_HASHES}} placeholder in dist/_headers with the hash list.
// Keeps CSP strict (no 'unsafe-inline') while surviving cache-busted script changes.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';
const HEADERS_FILE = join(DIST, '_headers');
const PLACEHOLDER = '{{SCRIPT_HASHES}}';

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const hashes = new Set();
// Match <script ...>body</script> where the opening tag has NO `src=` attribute.
// Exclude JSON-LD (exempt per CSP spec — browsers don't enforce script-src on it).
const re = /<script((?:(?!src=)[^>])*?)>([\s\S]*?)<\/script>/g;

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const body = m[2];
    if (/type=["']application\/ld\+json["']/i.test(attrs)) continue;
    if (body.trim() === '') continue;
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }
}

const hashList = [...hashes].sort().join(' ');

const headers = readFileSync(HEADERS_FILE, 'utf8');
if (!headers.includes(PLACEHOLDER)) {
  console.warn(`[postbuild-csp] ${PLACEHOLDER} not found in ${HEADERS_FILE} — skipping`);
  process.exit(0);
}
let updated = headers.replace(PLACEHOLDER, hashList);

// Staging: inject X-Robots-Tag: noindex, nofollow into the /* block.
// Workers Static Assets applies _headers AFTER the Worker and discards Worker-
// set headers on known-asset 200 responses, so this is the only place that can
// reliably attach the noindex directive for the workers.dev preview URL.
if (process.env.DEPLOY_ENV === 'staging') {
  // Insert immediately after the "/*\n" line; placed first inside the block so
  // it's obvious in the file that this is the staging-only addition.
  updated = updated.replace(/^\/\*\n/m, '/*\n  X-Robots-Tag: noindex, nofollow\n');
  console.log('[postbuild-csp] DEPLOY_ENV=staging — injected X-Robots-Tag: noindex, nofollow into /* block');
}

writeFileSync(HEADERS_FILE, updated);

console.log(`[postbuild-csp] pinned ${hashes.size} inline script hash(es) in ${HEADERS_FILE}`);
for (const h of hashes) console.log(`  ${h}`);
