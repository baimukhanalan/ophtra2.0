// Visual + sanity pass: node scripts/shots.mjs [routeFilter] [--quick]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../e2e/node_modules/playwright');

const BASE = process.env.BASE || 'http://localhost:4391';
const ROUTES = ['/', '/about', '/founder', '/doctors', '/doctors/aigul-akhmetova', '/services', '/services/femto-lasik', '/international', '/second-opinion', '/consultation', '/booking', '/knowledge', '/knowledge/glaucoma-early-signs', '/science', '/experts', '/reviews', '/faq', '/contacts', '/account', '/nowhere'];
const filter = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const quick = process.argv.includes('--quick');
const ALL_SIZES = [
  { name: 'desk', width: 1440, height: 900 },
  { name: 'mob', width: 390, height: 844, isMobile: true, hasTouch: true },
];
const SIZES = process.argv.includes('--desk') ? ALL_SIZES.slice(0, 1) : process.argv.includes('--mob') ? ALL_SIZES.slice(1) : ALL_SIZES;
const out = new URL('../_shots/', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome', args: ['--ignore-gpu-blocklist', '--enable-webgl', '--use-angle=metal'] });
let problems = 0;
for (const size of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, isMobile: size.isMobile, hasTouch: size.hasTouch, deviceScaleFactor: 1 });
  for (const r of ROUTES.filter((x) => !filter || (filter === 'home' ? x === '/' : x.includes(filter)))) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3800);
    const slug = (r === '/' ? 'home' : r.slice(1).replace(/\//g, '_')) + '-' + size.name;
    await page.screenshot({ path: `${out}${slug}-0.png` });
    const info = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, h: document.documentElement.scrollHeight, h1: document.querySelectorAll('h1').length, world: document.querySelector('.world')?.className }));
    if (!quick) {
      const stops = [0.18, 0.4, 0.62, 0.85];
      for (let i = 0; i < stops.length; i++) {
        await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), stops[i]);
        await page.waitForTimeout(1600);
        await page.screenshot({ path: `${out}${slug}-${i + 1}.png` });
      }
    }
    const overflow = info.sw > info.iw || info.iw !== size.width;
    if (errors.length || overflow || info.h1 !== 1) problems++;
    console.log(`${size.name} ${r} h=${info.h} h1=${info.h1} overflow=${overflow} world=${info.world} errors=${errors.length ? JSON.stringify(errors.slice(0, 3)) : 0}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(problems ? `PROBLEMS: ${problems}` : 'ALL OK');
