// Captures the iris-aperture page transition: node scripts/transition.mjs [base]
import { chromium } from '../../../e2e/node_modules/playwright/index.mjs';
const base = process.argv[2] || 'http://localhost:5178';
const out = new URL('../_shots/', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.click('.menu-btn');
await p.waitForTimeout(1100);
await p.screenshot({ path: out + 'd-menu.jpg', type: 'jpeg', quality: 75 });
await p.click('#site-menu a[href="/dr-kulmaganbetov"]');
await p.waitForTimeout(480);
await p.screenshot({ path: out + 'd-transition-close.jpg', type: 'jpeg', quality: 75 });
await p.waitForTimeout(900);
await p.screenshot({ path: out + 'd-transition-open.jpg', type: 'jpeg', quality: 75 });
await p.waitForTimeout(2200);
await p.screenshot({ path: out + 'd-transition-arrived.jpg', type: 'jpeg', quality: 75 });
// Frozen frames of the aperture (the live one is too fast for headless screenshots)
for (const k of [0.55, 0.92]) {
  await p.evaluate((k) => {
    const ap = document.querySelector('.aperture');
    ap.classList.add('is-active');
    ap.querySelector('.aperture__label').textContent = 'Макула';
    ap.style.setProperty('--k', String(k));
    ap.style.setProperty('--r', `${(1 - k) * Math.hypot(innerWidth, innerHeight) * 0.62}px`);
  }, k);
  await p.waitForTimeout(300);
  await p.screenshot({ path: out + `d-aperture-${k}.jpg`, type: 'jpeg', quality: 75 });
}
console.log('url', p.url(), 'errors', errs.length, errs.join(' | '));
await b.close();
