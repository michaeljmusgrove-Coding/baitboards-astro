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

const get = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

const files = walk('dist').sort();
const issues = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = '/' + path.relative('dist', f).replace(/\\/g, '/').replace(/\/index\.html$/, '/').replace(/^\/index\.html$/, '/');

  const title = get(html, /<title[^>]*>([^<]+)<\/title>/);
  const desc = get(html, /<meta\s+name="description"\s+content="([^"]+)"/);
  const canon = get(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  const ogLocale = get(html, /<meta\s+property="og:locale"\s+content="([^"]+)"/);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const robotsMeta = get(html, /<meta\s+name="robots"\s+content="([^"]+)"/);

  const row = { rel, title, desc, canon, ogLocale, h1Count, robotsMeta };

  if (!title) issues.push(`${rel} ❌ missing <title>`);
  if (!desc) issues.push(`${rel} ❌ missing meta description`);
  if (!canon) issues.push(`${rel} ❌ missing canonical`);
  if (canon && !canon.startsWith('https://ozcowilliams.com.au')) issues.push(`${rel} ❌ canonical not absolute prod URL: ${canon}`);
  if (canon && canon.includes('//home/')) issues.push(`${rel} ❌ canonical regression to /home/`);
  if (h1Count === 0) issues.push(`${rel} ⚠️ 0 h1 tags`);
  if (h1Count > 1) issues.push(`${rel} ⚠️ ${h1Count} h1 tags (should be 1)`);
  if (ogLocale && ogLocale !== 'en_AU') issues.push(`${rel} ⚠️ og:locale=${ogLocale} (should be en_AU)`);
  if (title && title.length > 65) issues.push(`${rel} ⚠️ title ${title.length} chars`);
  if (desc && (desc.length < 120 || desc.length > 165)) issues.push(`${rel} ⚠️ desc ${desc.length} chars`);

  console.log(rel.padEnd(50), `h1:${h1Count}`, `t:${title?.length ?? '-'}`, `d:${desc?.length ?? '-'}`, `loc:${ogLocale ?? '-'}`, `r:${robotsMeta ?? '-'}`);
}

console.log('\n=== Issues ===');
if (issues.length === 0) console.log('none');
else for (const i of issues) console.log(i);
console.log(`\n${files.length} pages, ${issues.length} issues`);
