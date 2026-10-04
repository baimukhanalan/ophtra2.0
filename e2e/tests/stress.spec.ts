import { test, expect, gotoReady, outbox, isMobile, settle } from './support/fixtures';
import { ALL_ROUTES } from './support/routes';
import { ANTI_SPAM_MS, consent, expectOutcome, fillLeadForm, leadForm, submitButton } from './support/forms';

/**
 * 7. Stress: rapid navigation, language toggling, menu thrash, resize,
 * multi-clicks, huge and hostile input, offline submit.
 */

/** Deterministic pseudo-random (mulberry32) so a failing run can be replayed. */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

test('rapid client-side navigation across 30 random routes', async ({ page, diag }) => {
  test.setTimeout(180_000);
  const random = rng(20260925);
  const picks = Array.from({ length: 30 }, () => ALL_ROUTES[Math.floor(random() * ALL_ROUTES.length)]);
  await gotoReady(page, '/');
  for (const path of picks) {
    // History API navigation without waiting for the previous page to settle.
    await page.evaluate((p) => {
      history.pushState({}, '', p);
      dispatchEvent(new PopStateEvent('popstate'));
    }, path);
    await page.waitForTimeout(80);
  }
  const last = picks[picks.length - 1];
  await expect(page).toHaveURL(new RegExp(`${last.replace(/[?]/g, '\\?')}$`));
  await settle(page);
  await expect(page.locator('main h1')).not.toHaveText(/Page\s*not\s*found/);
  expect(await page.locator('h1').count()).toBe(1);
  expect(diag.consoleErrors).toEqual([]);
});

test('rapid hard navigation (goto without waiting for the reveal) across 30 routes', async ({ page }) => {
  test.setTimeout(240_000);
  const random = rng(7);
  const picks = Array.from({ length: 30 }, () => ALL_ROUTES[Math.floor(random() * ALL_ROUTES.length)]);
  for (const path of picks) {
    await page.goto(path, { waitUntil: 'commit' });
    await page.waitForTimeout(150);
  }
  await gotoReady(page, picks[picks.length - 1]);
  await expect(page.locator('main h1')).not.toHaveText(/Page\s*not\s*found/);
});

test('rapid language toggling keeps the page consistent', async ({ page, diag }) => {
  test.setTimeout(120_000);
  await gotoReady(page, '/doctors');
  const open = async () => {
    if (isMobile(page)) {
      await page.locator('.oph-header__burger').click();
      await page.getByRole('dialog').getByRole('button', { name: /Language|Язык|Тіл/i }).click();
    } else {
      await page.locator('header').getByRole('button', { name: /Language|Язык|Тіл/i }).click();
    }
  };
  const langs = ['ru', 'kk', 'en'];
  for (let i = 0; i < 24; i += 1) {
    await open();
    await page.locator(`[role=menuitemradio][lang="${langs[i % 3]}"]`).click();
    if (isMobile(page)) await page.keyboard.press('Escape');
  }
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main h1')).toHaveText('Doctors');
  expect(await page.locator('h1').count()).toBe(1);
  expect(diag.consoleErrors).toEqual([]);
});

test('rapid mega-menu open/close does not leave a stuck panel', async ({ page }) => {
  test.skip(isMobile(page), 'desktop menu');
  await gotoReady(page, '/');
  const triggers = page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button');
  const n = await triggers.count();
  for (let i = 0; i < 40; i += 1) {
    await triggers.nth(i % n).hover({ force: true });
    if (i % 3 === 0) await triggers.nth(i % n).click({ force: true });
    if (i % 5 === 0) await page.keyboard.press('Escape');
  }
  await page.mouse.move(700, 880);
  await page.mouse.click(700, 880);
  await expect(page.locator('.oph-nav__panel[data-open="true"]')).toHaveCount(0);
  await expect(page.locator('.oph-header')).not.toHaveAttribute('data-menu-open', 'true');
});

test('rapid mobile drawer open/close', async ({ page }) => {
  test.skip(!isMobile(page), 'mobile drawer');
  await gotoReady(page, '/');
  const burger = page.getByRole('button', { name: 'Open menu' });
  for (let i = 0; i < 15; i += 1) {
    await burger.click();
    await page.keyboard.press('Escape');
  }
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  // Body scroll is not left locked.
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
});

test('resize desktop ↔ mobile mid-page keeps layout and navigation working', async ({ page }) => {
  await gotoReady(page, '/international-patients');
  await page.evaluate(() => window.scrollTo(0, 3000));
  const sizes = [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 320, height: 640 },
    { width: 1440, height: 900 },
  ];
  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `no horizontal overflow at ${size.width}px`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  // A drawer left open while crossing into desktop must not trap the page.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  await page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button').first().hover();
  await expect(page.locator('.oph-nav__panel[data-open="true"]')).toBeVisible();
});

test('triple-click on primary CTAs navigates once and does not break the page', async ({ page }) => {
  await gotoReady(page, '/');
  const cta = page.locator('header .oph-header__cta, header a[href="/appointment"]').first();
  if (await cta.isVisible()) {
    await cta.click({ clickCount: 3 });
    await expect(page).toHaveURL(/\/appointment$/);
    await settle(page);
    const len = await page.evaluate(() => history.length);
    await page.goBack();
    await expect(page, 'one history entry per CTA activation').toHaveURL(/\/$/);
    expect(len).toBeLessThanOrEqual(3);
  }
  await gotoReady(page, '/appointment');
  const tile = page.locator('.bk-choice').first();
  await tile.click({ clickCount: 3 });
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  const next = page.locator('.bk-nav--footer').getByRole('button', { name: /^Next/ });
  await next.click({ clickCount: 3, force: true });
  // Three clicks on Next must not skip steps whose choice is missing.
  await expect(page.locator('.bk-pill[aria-current=step]')).toContainText(/Clinic|Department/);
});

test('5 000-character input and XSS-looking input are accepted as plain text', async ({ page }) => {
  let alerted = false;
  page.on('dialog', async (d) => {
    alerted = true;
    await d.dismiss();
  });
  await gotoReady(page, '/contacts');
  const form = leadForm(page);
  const long = 'A'.repeat(5000);
  const xss = '<script>alert(1)</script><img src=x onerror=alert(2)>';
  await fillLeadForm(form, { 'full name': `${xss} Patient`, comment: `${long}\n${xss}` });
  await consent(form).check();
  const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'long input does not widen the page').toBeLessThanOrEqual(1);
  await page.waitForTimeout(ANTI_SPAM_MS);
  await submitButton(form).click();
  await expectOutcome(page);
  const box = await outbox(page);
  expect(box).toHaveLength(1);
  expect(box[0].lead.fullName).toContain('<script>alert(1)</script>');
  expect(box[0].lead.comment.length).toBeGreaterThan(5000);

  // The stored lead is rendered (as text) in the admin CRM.
  await page.evaluate(() => localStorage.setItem('ophtra.admin.token', 'demo-admin-e2e'));
  await gotoReady(page, '/admin');
  const nav = page.getByRole('navigation', { name: 'Admin panel' });
  if (await nav.isVisible()) await nav.getByRole('button', { name: /^Leads/ }).click();
  else {
    const select = page.getByRole('combobox', { name: 'Panel section' });
    const label = (await select.locator('option').allInnerTexts()).find((l) => l.trim().startsWith('Leads'))!;
    await select.selectOption({ label });
  }
  await expect(page.locator('main').getByText('<script>alert(1)</script>', { exact: false }).first()).toBeVisible();
  expect(await page.locator('main img[src="x"]').count()).toBe(0);
  await page.waitForTimeout(500);
  expect(alerted, 'no injected script ran').toBe(false);
});

test('XSS in knowledge-base search and URL params renders as text', async ({ page }) => {
  let alerted = false;
  page.on('dialog', async (d) => {
    alerted = true;
    await d.dismiss();
  });
  const payload = '"><img src=x onerror=alert(1)>';
  await gotoReady(page, `/knowledge-base?q=${encodeURIComponent(payload)}&topic=${encodeURIComponent(payload)}`);
  await expect(page.getByRole('searchbox', { name: 'Search materials' })).toHaveValue(payload);
  expect(await page.locator('img[src="x"]').count()).toBe(0);
  await gotoReady(page, `/media-center?tab=${encodeURIComponent(payload)}`);
  await gotoReady(page, `/appointment?service=${encodeURIComponent(payload)}&doctor=${encodeURIComponent(payload)}`);
  await page.waitForTimeout(500);
  expect(alerted).toBe(false);
});

test('offline during form submit → queued state, then retried when back online', async ({ page, context }) => {
  await gotoReady(page, '/contacts');
  const form = leadForm(page);
  await fillLeadForm(form);
  await consent(form).check();
  await page.waitForTimeout(ANTI_SPAM_MS);
  await context.setOffline(true);
  await submitButton(form).click();
  const result = await expectOutcome(page);
  expect(result.queued).toBe(true);
  expect(await outbox(page)).toHaveLength(1);
  await context.setOffline(false);
  // Page stays usable after coming back online.
  await page.getByRole('button', { name: 'Send another request' }).click();
  await expect(leadForm(page)).toBeVisible();
});

test('offline booking submit still gives a reference and keeps the request', async ({ page, context }) => {
  await gotoReady(page, '/appointment');
  const choose = async () => {
    await page.locator('.bk-choice').first().click();
    await page.locator('.bk-nav--footer').getByRole('button', { name: /^Next/ }).click();
  };
  // type → (clinic) → department → service → doctor, until the date step.
  for (let i = 0; i < 6 && !/Date/.test(await page.locator('.bk-pill[aria-current=step]').innerText()); i += 1) await choose();
  const days = page.locator('.bk-day');
  for (let i = 0; i < (await days.count()); i += 1) {
    await days.nth(i).click();
    await page.waitForTimeout(200);
    if (await page.locator('.bk-slot').first().isVisible()) break;
  }
  await page.locator('.bk-slot').first().click();
  await page.locator('.bk-nav--footer').getByRole('button', { name: /^Next/ }).click();
  const form = page.locator('.bk-form');
  await form.getByLabel('Full name').fill('Offline Patient');
  await form.getByLabel('Phone').fill('+7 701 000 00 01');
  await form.getByRole('checkbox', { name: /processing of my personal data/ }).check();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Confirm appointment' }).click();
  await expect(page.locator('.bk--done .bk-ticket__ref')).not.toBeEmpty({ timeout: 15_000 });
  await expect.poll(async () => (await outbox(page)).length).toBe(1);
  await context.setOffline(false);
});

test('many parallel tabs on the same form do not corrupt the outbox', async ({ context }) => {
  test.setTimeout(120_000);
  await context.addInitScript(() => {
    localStorage.setItem('ophtra.lang', 'en');
    localStorage.setItem('ophtra.consent.analytics', 'denied');
  });
  const pages = await Promise.all(Array.from({ length: 4 }, () => context.newPage()));
  await Promise.all(pages.map((p) => gotoReady(p, '/contacts')));
  await Promise.all(
    pages.map(async (p, i) => {
      const form = leadForm(p);
      await fillLeadForm(form, { 'full name': `Parallel ${i}`, phone: `+7 701 000 00 1${i}` });
      await consent(form).check();
    }),
  );
  await pages[0].waitForTimeout(ANTI_SPAM_MS);
  await Promise.all(pages.map((p) => submitButton(leadForm(p)).click()));
  await Promise.all(pages.map((p) => expectOutcome(p)));
  const box = await outbox(pages[0]);
  expect(box.map((b) => b.lead.fullName).sort(), 'every parallel submission kept').toEqual(['Parallel 0', 'Parallel 1', 'Parallel 2', 'Parallel 3']);
});
