import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:4322';

const ROUTES = [
  '/',
  '/about/',
  '/blog/',
  '/blog/where-did-all-the-aussies-go/',
  '/case-studies/',
  '/case-studies/von-bibra-automotive/',
  '/clients/',
  '/contact/',
  '/industries/',
  '/industries/car-dealerships/',
  '/industries/real-estate/',
  '/industries/retail/',
  '/industries/schools/',
  '/locations/',
  '/locations/brisbane/',
  '/locations/gold-coast/',
  '/locations/regional-queensland/',
  '/locations/sunshine-coast/',
  '/pricing/',
  '/privacy-policy/',
  '/resources/',
  '/resources/cinema-advertising-cost-guide-2026/',
  '/resources/cinema-vs-youtube/',
  '/resources/what-is-cinema-advertising/',
  '/services/',
  '/services/ad-conversion/',
  '/services/cinema-advertising/',
  '/services/video-production/',
  '/thank-you/',
  '/non-existent-page/',
];

const VIEWPORTS = [
  { label: 'mobile', width: 360, height: 640 },
  { label: 'tablet', width: 768, height: 1024 },
];

async function main() {
  const browser = await chromium.launch();
  const allRows = [];
  const failures = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.label === 'mobile',
      hasTouch: true,
    });

    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const consoleErrors = [];
      const networkErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200));
      });
      page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message.slice(0, 200)}`));
      page.on('requestfailed', (req) => {
        const url = req.url();
        if (!url.startsWith(BASE)) return;
        if (url.endsWith('favicon.ico')) return;
        networkErrors.push(`${req.failure()?.errorText} ${url.replace(BASE, '')}`);
      });

      let status = 0;
      try {
        const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
        status = resp ? resp.status() : 0;
      } catch (e) {
        consoleErrors.push(`goto: ${e.message.slice(0, 200)}`);
      }

      await page.waitForTimeout(400);

      const metrics = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const horizOverflow = docW > winW + 1 ? docW - winW : 0;

        const tappables = Array.from(document.querySelectorAll('a, button, [role=button], input[type=submit], input[type=button]'));
        const smallList = [];
        for (const el of tappables) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.width < 30 || r.height < 30) {
            const aria = el.getAttribute('aria-label') || '';
            const text = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30);
            smallList.push(`${Math.round(r.width)}x${Math.round(r.height)}|${aria || text || el.className.toString().slice(0, 30)}`);
          }
        }
        const totalTappables = tappables.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }).length;
        const tooSmall = smallList.length;

        const ftWord = document.body.innerText.replace(/\s+/g, ' ').slice(0, 80);

        return {
          docW,
          winW,
          horizOverflow,
          tooSmall,
          totalTappables,
          ftWord,
          smallList,
        };
      });

      allRows.push({
        vp: vp.label,
        route,
        status,
        ...metrics,
        consoleErrors,
        networkErrors,
      });

      if (consoleErrors.length || networkErrors.length || metrics.horizOverflow > 0 || metrics.tooSmall > 0 || (status !== 0 && status >= 400 && route !== '/non-existent-page/')) {
        failures.push({ vp: vp.label, route, status, ...metrics, consoleErrors, networkErrors });
      }

      await page.close();
    }
    await ctx.close();
  }

  await browser.close();

  console.log('\n=== Mobile/Tablet QA Summary ===\n');
  console.log('vp     | route                                              | status | overflow | tap<30 | total | err');
  console.log('-------+----------------------------------------------------+--------+----------+--------+-------+----');
  for (const r of allRows) {
    const overflow = r.horizOverflow > 0 ? `+${r.horizOverflow}px` : 'ok';
    const errs = (r.consoleErrors?.length || 0) + (r.networkErrors?.length || 0);
    console.log(
      `${r.vp.padEnd(6)} | ${r.route.padEnd(50)} | ${String(r.status).padEnd(6)} | ${overflow.padEnd(8)} | ${String(r.tooSmall).padEnd(6)} | ${String(r.totalTappables).padEnd(5)} | ${errs}`
    );
  }

  if (failures.length) {
    console.log('\n=== Failures ===\n');
    for (const f of failures) {
      console.log(`[${f.vp}] ${f.route} status=${f.status} overflow=${f.horizOverflow} tap<30=${f.tooSmall}`);
      (f.smallList || []).slice(0, 6).forEach((e) => console.log(`   small: ${e}`));
      f.consoleErrors.slice(0, 3).forEach((e) => console.log(`   console: ${e}`));
      f.networkErrors.slice(0, 3).forEach((e) => console.log(`   network: ${e}`));
    }
  }

  fs.writeFileSync('mobile-qa-results.json', JSON.stringify(allRows, null, 2));
  console.log(`\nResults written to site/mobile-qa-results.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
