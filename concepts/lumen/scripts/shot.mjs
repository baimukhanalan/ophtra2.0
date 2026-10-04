// Quick screenshot helper: node scripts/shot.mjs <path> <w> <h> <scrollY|selector> <out>
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../e2e/node_modules/playwright');
const [, , path = '/', w = '1440', h = '900', scroll = '0', out = '_shots/tmp.png', wait = '2500'] = process.argv;
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, isMobile: +w < 600, hasTouch: +w < 600 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://localhost:4174' + path, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(+wait);
if (/^\d+$/.test(scroll)) {
  await page.evaluate((y) => window.scrollTo(0, y), +scroll);
} else {
  await page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); }, scroll);
}
await page.waitForTimeout(1600);
await page.screenshot({ path: out });
console.log('errors:', errors.slice(0, 5));
await browser.close();
