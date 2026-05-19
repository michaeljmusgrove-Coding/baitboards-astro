/**
 * Heading hierarchy audit — walks dist HTML pages and reports:
 * - pages with 0 or >1 H1
 * - heading-level skips (e.g. H2 → H4 with no H3 between)
 * - empty heading text
 *
 * Run after `npm run build`.
 */

import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const issues = [];

for (const file of walk('dist').sort()) {
  const html = fs.readFileSync(file, 'utf8');
  // Strip script + style
  const cleaned = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const headings = [...cleaned.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)];
  const levels = headings.map((m) => ({
    tag: m[1].toLowerCase(),
    level: parseInt(m[1].slice(1), 10),
    text: m[2].replace(/<[^>]+>/g, '').trim(),
  }));

  const rel = '/' + path.relative('dist', file).replace(/\\/g, '/');
  const h1Count = levels.filter((l) => l.level === 1).length;

  if (h1Count === 0) issues.push(`${rel} — 0 H1 tags`);
  if (h1Count > 1) issues.push(`${rel} — ${h1Count} H1 tags`);

  // Check for skips (e.g. h2 -> h4 without h3)
  let prev = 0;
  for (const h of levels) {
    if (prev > 0 && h.level > prev + 1) {
      issues.push(`${rel} — heading skip: <${headings[levels.indexOf(h) - 1] && levels[levels.indexOf(h) - 1].tag}> "${levels[levels.indexOf(h) - 1].text.slice(0, 50)}" → <${h.tag}> "${h.text.slice(0, 50)}"`);
    }
    prev = h.level;
  }

  // Empty headings
  for (const h of levels) {
    if (!h.text) issues.push(`${rel} — empty <${h.tag}> heading`);
  }
}

console.log(`Scanned ${walk('dist').filter((f) => f.endsWith('.html')).length} HTML pages`);
if (issues.length === 0) {
  console.log('  ✓ No heading hierarchy issues');
} else {
  console.log(`  ${issues.length} issue(s):`);
  for (const i of issues) console.log('   •', i);
}
