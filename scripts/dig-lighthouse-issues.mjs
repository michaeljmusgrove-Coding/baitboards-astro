import fs from 'node:fs';

const r = JSON.parse(fs.readFileSync('../pre-launch-baseline/lighthouse-dev-mobile.report.json', 'utf8'));

console.log('=== Contrast issues ===');
const contrast = r.audits['color-contrast'];
if (contrast && contrast.details && contrast.details.items) {
  for (const item of contrast.details.items) {
    const node = item.node;
    console.log(`  • ${node?.snippet?.slice(0, 200) || '?'}`);
    console.log(`    selector: ${node?.selector?.slice(0, 200) || '?'}`);
    console.log(`    explain:  ${node?.explanation?.slice(0, 200) || ''}`);
    console.log('');
  }
}

console.log('\n=== Touch target issues ===');
const tap = r.audits['target-size'];
if (tap && tap.details && tap.details.items) {
  for (const item of tap.details.items.slice(0, 12)) {
    const node = item.node;
    console.log(`  • ${node?.snippet?.slice(0, 100) || '?'}`);
    console.log(`    size:     ${item.size || '?'}`);
    console.log(`    selector: ${node?.selector?.slice(0, 100) || '?'}`);
    console.log('');
  }
}

console.log('\n=== Best Practices failures ===');
const bp = r.categories['best-practices'];
const bpIds = new Set((bp.auditRefs || []).map(x => x.id));
const bpFailed = Object.values(r.audits).filter(a => bpIds.has(a.id) && a.score !== null && a.score < 1);
for (const a of bpFailed) {
  console.log(`  • ${a.title} (score ${a.score})`);
  if (a.details && a.details.items && a.details.items.length) {
    for (const item of a.details.items.slice(0, 3)) {
      const txt = item.url || item.source?.url || item.statistic || JSON.stringify(item).slice(0, 200);
      console.log(`    - ${typeof txt === 'string' ? txt.slice(0, 200) : txt}`);
    }
  }
}
