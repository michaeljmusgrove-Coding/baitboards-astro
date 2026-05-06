import fs from 'node:fs';

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function summarize(label, r) {
  const cat = r.categories;
  const audits = r.audits;
  const cwv = (k) => {
    const a = audits[k];
    return a ? `${a.displayValue || '?'} (${a.score === null ? 'n/a' : a.score})` : 'n/a';
  };
  return {
    label,
    perf: cat.performance ? Math.round(cat.performance.score * 100) : '?',
    a11y: cat.accessibility ? Math.round(cat.accessibility.score * 100) : '?',
    bestp: cat['best-practices'] ? Math.round(cat['best-practices'].score * 100) : '?',
    seo: cat.seo ? Math.round(cat.seo.score * 100) : '?',
    fcp: cwv('first-contentful-paint'),
    lcp: cwv('largest-contentful-paint'),
    tbt: cwv('total-blocking-time'),
    cls: cwv('cumulative-layout-shift'),
    si: cwv('speed-index'),
  };
}

const live = load('../pre-launch-baseline/lighthouse-baseline-mobile.report.json');
const devM = load('../pre-launch-baseline/lighthouse-dev-mobile.report.json');
const devD = load('../pre-launch-baseline/lighthouse-dev-desktop.report.json');

const liveSum = summarize('LIVE mobile', live);
const devMSum = summarize('DEV mobile', devM);
const devDSum = summarize('DEV desktop', devD);

console.log('\n=== Lighthouse Comparison ===\n');
const cols = ['liveSum', 'devMSum', 'devDSum'];
const sums = { liveSum, devMSum, devDSum };
const head = ['LIVE mobile', 'DEV mobile', 'DEV desktop'];
console.log('Metric           | ' + head.map(h => h.padStart(15)).join(' | '));
console.log('-'.repeat(72));
const row = (label, key) => {
  const vals = cols.map(c => String(sums[c][key]).padStart(15));
  console.log(`${label.padEnd(17)}| ${vals.join(' | ')}`);
};
row('Performance', 'perf');
row('Accessibility', 'a11y');
row('Best Practices', 'bestp');
row('SEO', 'seo');
row('FCP', 'fcp');
row('LCP', 'lcp');
row('TBT', 'tbt');
row('CLS', 'cls');
row('Speed Index', 'si');
console.log('\nNote: dev runs against localhost — CWV times are artificially fast. Use scores as the real signal.');

const dev = devM;

console.log('\n=== Dev: Top Performance Opportunities ===\n');
const opp = Object.values(dev.audits).filter(a => a.details && a.details.type === 'opportunity' && a.numericValue > 0);
opp.sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0));
for (const a of opp.slice(0, 8)) {
  console.log(`  • ${a.title}: ${a.displayValue || ''} (saves ${Math.round(a.numericValue)}ms)`);
}

console.log('\n=== Dev: Top A11y Issues ===\n');
const a11yIssues = Object.values(dev.audits).filter(a => a.scoreDisplayMode !== 'notApplicable' && a.score !== null && a.score < 1 && a.id && a.title);
const a11yCat = dev.categories.accessibility;
const a11yIds = new Set((a11yCat.auditRefs || []).map(r => r.id));
const a11yReal = a11yIssues.filter(a => a11yIds.has(a.id));
for (const a of a11yReal.slice(0, 8)) {
  console.log(`  • ${a.title}`);
}

console.log('\n=== Dev: Top SEO Issues ===\n');
const seoCat = dev.categories.seo;
const seoIds = new Set((seoCat.auditRefs || []).map(r => r.id));
const seoIssues = Object.values(dev.audits).filter(a => seoIds.has(a.id) && a.score !== null && a.score < 1);
for (const a of seoIssues) {
  console.log(`  • ${a.title}`);
}
