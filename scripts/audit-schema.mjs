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

const files = walk('dist').sort();
let errors = 0;

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b[1]);
      const arr = Array.isArray(j) ? j : [j];
      for (const item of arr) {
        if (item['@graph']) {
          types.push(...item['@graph'].map((g) => g['@type']));
        } else {
          types.push(item['@type'] || '?');
        }
      }
    } catch (e) {
      types.push('PARSE_ERR');
      errors++;
    }
  }
  const rel = path.relative('dist', f).replace(/\\/g, '/');
  console.log(rel.padEnd(60), '→', types.join(', '));
}

console.log(`\n${files.length} pages scanned, ${errors} JSON-LD parse errors`);
