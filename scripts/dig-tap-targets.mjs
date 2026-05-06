import { chromium } from 'playwright';

const BASE = 'http://localhost:4322';

async function digRoute(page, route) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  return await page.evaluate(() => {
    const tappables = Array.from(document.querySelectorAll('a, button, [role=button], input[type=submit]'));
    const small = [];
    for (const el of tappables) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < 30 || r.height < 30) {
        const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
        const aria = el.getAttribute('aria-label') || '';
        const cls = (el.className || '').toString().slice(0, 50);
        small.push({
          tag: el.tagName,
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: text || `[no text]`,
          aria,
          cls,
          y: Math.round(r.y),
        });
      }
    }
    return small;
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  for (const route of ['/services/ad-conversion/', '/about/', '/contact/']) {
    console.log(`\n=== ${route} ===`);
    const small = await digRoute(page, route);
    for (const s of small) {
      console.log(`  ${s.w}x${s.h}px @y=${s.y}  <${s.tag}>  "${s.text}"  aria="${s.aria}"  cls="${s.cls}"`);
    }
  }
  await browser.close();
})();
