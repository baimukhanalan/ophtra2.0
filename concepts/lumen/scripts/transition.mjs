// Captures the lens page transition mid-flight.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../e2e/node_modules/playwright');
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto('http://localhost:4174/', { waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.click('.hdr__nav a[href="/services"]');
for (const t of [250, 550, 800, 1100, 2200]) {
  await page.waitForTimeout(t === 250 ? 250 : t - [250, 550, 800, 1100, 2200][[250, 550, 800, 1100, 2200].indexOf(t) - 1]);
  await page.screenshot({ path: `_shots/transition-${t}.png` });
}
console.log('url', page.url(), 'title', await page.title(), 'focused', await page.evaluate(() => document.activeElement?.tagName));
// booking flow smoke test
await page.goto('http://localhost:4174/booking', { waitUntil: 'load' });
await page.waitForTimeout(2500);
for (let i = 0; i < 8 && !(await page.$('.bk-day')); i++) {
  await page.click('.bk-opt >> nth=0');
  await page.waitForTimeout(900);
}
await page.screenshot({ path: '_shots/booking-step5.png' });
const days = await page.$$('.bk-day');
for (const d of days) {
  await d.click();
  await page.waitForTimeout(100);
  if (await page.$('.bk-time')) break;
}
await page.click('.bk-time >> nth=0');
await page.click('.bk-nav .btn:not(.btn--ghost)');
await page.waitForTimeout(700);
await page.click('button[form="bk-contacts"]');
await page.waitForTimeout(400);
await page.screenshot({ path: '_shots/booking-errors.png' });
await page.fill('input[autocomplete="name"]', 'Тест Тестов');
await page.fill('input[type="tel"]', '+7 700 123 45 67');
await page.check('input[type="checkbox"]');
await page.click('button[form="bk-contacts"]');
await page.waitForTimeout(900);
await page.screenshot({ path: '_shots/booking-confirm.png' });
await page.click('.bk-nav .btn:not(.btn--ghost)');
await page.waitForTimeout(1600);
await page.screenshot({ path: '_shots/booking-done.png' });
console.log('errors', errors);
await browser.close();
