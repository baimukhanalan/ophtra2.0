// Interaction pass: page transition frames, booking flow, reduced motion, menu.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../e2e/node_modules/playwright');
const BASE = process.env.BASE || 'http://localhost:4391';
const out = new URL('../_shots/', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome', args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const errors = [];
const watch = (p) => {
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  p.on('pageerror', (e) => errors.push(String(e)));
};

// 1. transition frames: home -> science (orbit -> field), science -> doctors
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  watch(p);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3800);
  await p.click('.hdr__links a[href="/science"]');
  let prev = 0;
  for (const t of [250, 700, 1200, 1900, 3000]) {
    await p.waitForTimeout(t - prev);
    prev = t;
    await p.screenshot({ path: `${out}transition-home-science-${t}.png` });
  }
  await p.click('.hdr__links a[href="/doctors"]');
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}transition-science-doctors-1400.png` });
  await p.waitForTimeout(1800);
  // menu
  await p.click('.menu-btn');
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}menu-desk.png` });
  await p.keyboard.press('Escape');
  await ctx.close();
}

// 2. booking flow on mobile
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  watch(p);
  await p.goto(BASE + '/booking', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  await p.getByRole('radio', { name: /Отделение лазерной коррекции/ }).click();
  await p.getByRole('button', { name: 'Далее' }).click();
  await p.getByText('SMILE', { exact: true }).click();
  await p.getByRole('button', { name: 'Далее' }).click();
  await p.getByText('Любой свободный врач').click();
  await p.getByRole('button', { name: 'Далее' }).click();
  // pick the 2nd day and first free slot
  const days = p.locator('input[name="day"]');
  await days.nth(2).check({ force: true });
  const free = p.locator('input[name="time"]:not([disabled])');
  await free.first().check({ force: true });
  await p.screenshot({ path: `${out}booking-mob-slots.png` });
  await p.getByRole('button', { name: 'Далее' }).click();
  // submit empty to see validation
  await p.getByRole('button', { name: 'Далее' }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}booking-mob-errors.png` });
  await p.getByLabel('Имя и фамилия').fill('Тест Тестов');
  await p.getByLabel('Телефон').fill('+7 700 000 00 00');
  await p.locator('input[name="consent"]').check();
  await p.getByRole('button', { name: 'Далее' }).click();
  await p.getByRole('button', { name: 'Подтвердить запись' }).click();
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${out}booking-mob-done.png` });
  const ok = await p.getByText('Запись подтверждена').count();
  console.log('booking confirmed:', ok > 0);
  await ctx.close();
}

// 3. reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  watch(p);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}reduced-home.png` });
  await p.evaluate(() => window.scrollTo(0, 5200));
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}reduced-home-2.png` });
  await ctx.close();
}
await browser.close();
console.log('errors:', errors.length ? errors : 0);
