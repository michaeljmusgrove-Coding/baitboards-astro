import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

async function main() {
  const browser = await chromium.launch();
  for (const [name, path] of [
    ['home', '/'],
    ['about', '/about/'],
    ['clients', '/clients/'],
    ['contact', '/contact/'],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    await mkdir('../reference/dev-screenshots', { recursive: true });
    await page.screenshot({ path: `../reference/dev-screenshots/${name}-desktop.png`, fullPage: true });
    await ctx.close();
    const m = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
    const mp = await m.newPage();
    await mp.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await mp.waitForTimeout(1500);
    await mp.screenshot({ path: `../reference/dev-screenshots/${name}-mobile.png`, fullPage: true });
    await m.close();
    console.log('OK', name);
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
