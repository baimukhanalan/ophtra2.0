// Full pass: every route at 390×844 and 1440×900 — console errors, horizontal overflow, screenshots.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../e2e/node_modules/playwright');
const BASE = process.env.BASE ?? 'http://localhost:4174';
const only = process.argv[2];
const ROUTES = [
  '/', '/about', '/dr-kulmaganbetov', '/doctors', '/doctors/aigul-akhmetova', '/services', '/services/oct',
  '/international-patients', '/second-opinion', '/online-consultation', '/booking', '/knowledge-base',
  '/knowledge-base/glaucoma-early-signs', '/science', '/global-experts', '/reviews', '/faq', '/contacts', '/account', '/nope-404',
].filter((r) => !only || r === only);
const SIZES = [
  { name: 'm', width: 390, height: 844, mobile: true },
  { name: 'd', width: 1440, height: 900, mobile: false },
];
fs.mkdirSync('_shots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const report = [];
for (const s of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, isMobile: s.mobile, hasTouch: s.mobile, deviceScaleFactor: s.mobile ? 2 : 1 });
  for (const r of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + r, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2600);
    const slug = (r === '/' ? 'home' : r.slice(1).replace(/\//g, '_')) + '-' + s.name;
    await page.screenshot({ path: `_shots/${slug}-0.png` });
    // scroll through the page in steps to trigger reveals and check overflow on the way
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    let overflow = 0;
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(((h - s.height) * i) / steps));
      await page.waitForTimeout(450);
      overflow = Math.max(overflow, await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
      if (i === 2 || i === 4) await page.screenshot({ path: `_shots/${slug}-${i}.png` });
    }
    report.push({ route: r, size: s.name, height: h, overflow, errors: errors.slice(0, 3) });
    console.log(s.name, r, 'h=' + h, 'overflow=' + overflow, errors.length ? 'ERR ' + errors.slice(0, 2).join(' | ') : 'ok');
    await page.close();
  }
  await ctx.close();
}
fs.writeFileSync('_shots/report.json', JSON.stringify(report, null, 1));
await browser.close();
