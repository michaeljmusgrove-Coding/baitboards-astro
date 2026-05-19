/**
 * Post-build bundle-size budget assertion.
 * Calibrated to the 2026-05-01 baseline + headroom — purpose is to catch
 * accidental ballooning, NOT to right-size the legacy WordPress media set.
 *
 * Baseline:
 *   total: 144 MB  (115 MB videos + 27 MB images + 924 KB HTML + 38 KB CSS)
 *   js:      0 KB  (Astro zero-JS by default)
 *   css:    38 KB
 *   image:  27.6 MB (multi-resolution WP image set: 100w / 300w / 705w / etc.)
 *   html:   924 KB
 *   video: ~115 MB (14 client .mp4 — kept for OA-13 case-study addition; not yet rendered on pages)
 *
 * Budgets are 25-40% above baseline so adding new pages/images doesn't trip
 * the alarm but a 2x media balloon does.
 */

import fs from 'node:fs';
import path from 'node:path';

const BUDGETS = {
  total: 200 * 1024 * 1024,
  js: 250 * 1024,
  css: 150 * 1024,
  image: 35 * 1024 * 1024,
  // Critical CSS inlining adds ~25 KB per page × 35 pages ≈ 850 KB extra HTML.
  html: 3 * 1024 * 1024,
};

const totals = { total: 0, js: 0, css: 0, image: 0, html: 0, font: 0, other: 0 };

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip Pagefind index — it's regenerated each build, not part of the budget
      if (entry.name === 'pagefind') continue;
      walk(full);
      continue;
    }
    const size = fs.statSync(full).size;
    totals.total += size;
    const ext = path.extname(entry.name).toLowerCase();
    if (ext === '.js' || ext === '.mjs') totals.js += size;
    else if (ext === '.css') totals.css += size;
    else if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico'].includes(ext)) totals.image += size;
    else if (ext === '.html') totals.html += size;
    else if (['.woff', '.woff2', '.ttf'].includes(ext)) totals.font += size;
    else totals.other += size;
  }
}

walk('dist');

const fmt = (n) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(2) + ' MB' : (n / 1024).toFixed(1) + ' KB');

console.log('\n=== Bundle size budget ===');
const failed = [];
for (const [k, budget] of Object.entries(BUDGETS)) {
  const actual = totals[k];
  const pct = ((actual / budget) * 100).toFixed(0);
  const tag = actual > budget ? 'FAIL' : actual > budget * 0.85 ? 'WARN' : 'OK  ';
  console.log(`  ${tag} ${k.padEnd(7)} ${fmt(actual).padStart(10)} / ${fmt(budget).padStart(10)} (${pct}%)`);
  if (actual > budget) failed.push(`${k}: ${fmt(actual)} > ${fmt(budget)}`);
}
console.log(`\n  Untracked: font ${fmt(totals.font)}, other ${fmt(totals.other)}`);

if (failed.length) {
  console.error('\nBudget violations:');
  for (const f of failed) console.error('  ✘', f);
  process.exit(1);
}
console.log('\n  All budgets within limits.');
