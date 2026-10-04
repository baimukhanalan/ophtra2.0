// Route verification + screenshots: node scripts/verify.mjs [baseUrl]
// Checks every route at 390×844 and 1440×900: renders an <h1>, no console
// errors, no horizontal overflow at several scroll depths. Saves shots in _shots/.
import { chromium } from '../../../e2e/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const base = process.argv[2] || 'http://localhost:5178';
const only = process.argv[3];
const routes = [
  ['home', '/'], ['about', '/about'], ['founder', '/dr-kulmaganbetov'], ['doctors', '/doctors'],
  ['doctor', '/doctors/aigul-akhmetova'], ['services', '/services'], ['service', '/services/oct'],
  ['international', '/international-patients'], ['second-opinion', '/second-opinion'],
  ['consultation', '/online-consultation'], ['booking', '/appointment'], ['knowledge', '/knowledge-base'],
  ['article', '/knowledge-base/glaucoma-early-signs'], ['science', '/science'], ['experts', '/global-experts'],
  ['reviews', '/reviews'], ['faq', '/faq'], ['contacts', '/contacts'], ['account', '/account'], ['404', '/no-such-layer'],
].filter(([n]) => !only || only.split(',').includes(n));
const sizes = [['m', 390, 844], ['d', 1440, 900]];
const out = new URL('../_shots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
let failures = 0;
for (const [tag, w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
  for (const [name, path] of routes) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    const h1 = await page.locator('h1').count();
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    let overflow = false;
    const marks = [0, 0.18, 0.4, 0.62, 0.85];
    for (const f of marks) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * f));
      await page.waitForTimeout(f === 0 ? 300 : 1500);
      overflow ||= await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (f === 0 || f === 0.4) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * f));
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${out}${tag}-${name}-${f === 0 ? 'a' : 'b'}.jpg`, quality: 72, type: 'jpeg' });
      }
    }
    const ok = h1 > 0 && !overflow && errs.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${tag} ${path} h1=${h1} overflow=${overflow} errors=${errs.length}${errs.length ? ' → ' + errs.slice(0, 2).join(' | ') : ''}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(failures ? `${failures} failures` : 'ALL OK');
