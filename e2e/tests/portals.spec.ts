import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { test, expect, gotoReady, outbox } from './support/fixtures';
import { ANTI_SPAM_MS, consent, expectOutcome, fillLeadForm, leadForm, submitButton } from './support/forms';

/**
 * 5b. Portals: patient account (demo OTP) and the admin panel in demo mode.
 */

/* ================================================================ ACCOUNT */

test.describe('patient account (demo mode)', () => {
  test('phone → code 0000 → dashboard with every tab; sign out', async ({ page }) => {
    await gotoReady(page, '/account');
    await page.getByRole('button', { name: 'Get the code' }).click();
    await expect(page.getByText(/valid phone|required/i).first(), 'empty phone is rejected').toBeVisible();

    await page.getByLabel('Phone').fill('+7 701 234 56 78');
    await page.getByRole('button', { name: 'Get the code' }).click();
    const code = page.getByLabel('Code from the message');
    await expect(code).toBeVisible();
    await code.fill('1234');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText(/code|invalid|incorrect/i).first(), 'a wrong code is rejected').toBeVisible();
    await code.fill('0000');
    await page.getByRole('button', { name: 'Confirm' }).click();

    const tabs = page.getByRole('navigation', { name: 'Account sections' }).getByRole('button');
    await expect(tabs.first()).toBeVisible({ timeout: 15_000 });
    const n = await tabs.count();
    expect(n).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < n; i += 1) {
      const tab = tabs.nth(i);
      const name = (await tab.innerText()).trim();
      await tab.click();
      await expect(tab, `tab "${name}" becomes current`).toHaveAttribute('aria-current', /page|true/);
      const panel = page.locator('main [role=region][aria-label="Patient account"], main section').first();
      await expect(panel).not.toContainText(/NaN|undefined|Invalid Date/);
    }
    await page.getByRole('button', { name: 'Sign out' }).first().click();
    await expect(page.getByRole('button', { name: 'Get the code' })).toBeVisible();
  });

  test('"Upcoming" appointments are in the future and statuses read as states', async ({ page }) => {
    await gotoReady(page, '/account');
    await page.getByLabel('Phone').fill('+7 701 234 56 78');
    await page.getByRole('button', { name: 'Get the code' }).click();
    await page.getByLabel('Code from the message').fill('0000');
    await page.getByRole('button', { name: 'Confirm' }).click();
    const upcoming = page.getByRole('table', { name: 'Upcoming' });
    await expect(upcoming).toBeVisible({ timeout: 15_000 });
    const rows = upcoming.locator('tbody tr');
    const today = new Date(new Date().toDateString());
    for (const text of await rows.allInnerTexts()) {
      const m = text.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
      if (m) expect(new Date(m[1]).getTime(), `upcoming row "${text.split('\n')[0]}" is not in the past`).toBeGreaterThanOrEqual(today.getTime());
      expect(text, 'status column shows a state, not an action verb').not.toMatch(/\bConfirm\b(?!ed)/);
    }
  });

  test('cancel an upcoming appointment asks for confirmation and updates the list', async ({ page }) => {
    await gotoReady(page, '/account');
    await page.getByLabel('Phone').fill('+7 701 234 56 78');
    await page.getByRole('button', { name: 'Get the code' }).click();
    await page.getByLabel('Code from the message').fill('0000');
    await page.getByRole('button', { name: 'Confirm' }).click();
    const upcoming = page.getByRole('table', { name: 'Upcoming' });
    await expect(upcoming).toBeVisible({ timeout: 15_000 });
    const before = await upcoming.locator('tbody tr').count();
    page.once('dialog', (d) => d.accept());
    await upcoming.getByRole('button', { name: 'Cancel' }).first().click();
    const dialog = page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) await dialog.getByRole('button', { name: /Cancel appointment|Confirm|Yes/i }).last().click();
    await expect.poll(() => upcoming.locator('tbody tr').count()).toBeLessThan(before);
  });
});

/* ================================================================== ADMIN */

const signIn = async (page: Page) => {
  await gotoReady(page, '/admin');
  await page.getByLabel('Login').fill('admin');
  await page.getByLabel('Password').fill('ophtra');
  await page.getByRole('button', { name: 'Administrator sign-in' }).click();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible({ timeout: 15_000 });
};

/** Desktop: sidebar buttons. Narrow screens: the "Panel section" select. */
const adminNav = (page: Page) => page.getByRole('navigation', { name: 'Admin panel' });
const sectionNames = async (page: Page): Promise<string[]> => {
  const clean = (t: string) => t.split(/[\n:(]/)[0].replace(/\s*\d+$/, '').trim();
  if (await adminNav(page).isVisible()) return (await adminNav(page).getByRole('button').allInnerTexts()).map(clean);
  return (await page.getByRole('combobox', { name: 'Panel section' }).locator('option').allInnerTexts()).map(clean);
};
const openSection = async (page: Page, name: string) => {
  if (await adminNav(page).isVisible()) {
    await adminNav(page).getByRole('button', { name: new RegExp(`^${name}`) }).click();
  } else {
    const select = page.getByRole('combobox', { name: 'Panel section' });
    const labels = await select.locator('option').allInnerTexts();
    const label = labels.find((l) => l.trim().startsWith(name));
    expect(label, `section "${name}" offered`).toBeTruthy();
    await select.selectOption({ label: label! });
  }
  await expect(page.locator('main h1')).toHaveText(new RegExp(`^${name}`));
};

test.describe('admin panel (demo mode)', () => {
  test('sign-in rejects empty and wrong credentials, accepts admin/ophtra, signs out', async ({ page }) => {
    await gotoReady(page, '/admin');
    const submit = page.getByRole('button', { name: 'Administrator sign-in' });
    await submit.click();
    await expect(page.locator('main .oph-field__error')).toBeVisible();
    await page.getByLabel('Login').fill('admin');
    await page.getByLabel('Password').fill('wrong');
    await submit.click();
    await expect(page.locator('main .oph-field__error')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0);
    await page.getByLabel('Password').fill('ophtra');
    await submit.click();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('button', { name: 'Administrator sign-in' })).toBeVisible();
  });

  test('every section renders without errors', async ({ page }) => {
    await signIn(page);
    const names = await sectionNames(page);
    expect(names.length).toBeGreaterThanOrEqual(12);
    for (const name of names) {
      await openSection(page, name);
      const main = page.locator('main');
      await expect(main).not.toContainText(/NaN|undefined|\[object Object\]|Invalid Date/);
    }
  });

  test('articles: create draft → publish → edit → delete', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Articles');
    await page.getByRole('button', { name: 'New article' }).click();
    const title = `E2E article ${Date.now()}`;
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('URL slug').fill('e2e-article');
    await page.getByLabel('Category').selectOption({ index: 1 });
    await page.getByLabel('Author').selectOption({ index: 1 });
    await page.getByLabel('Tags').fill('glaucoma, prevention');
    await page.getByLabel('Excerpt').fill('Short excerpt.');
    await page.getByLabel('Article body').fill('Body paragraph one.\n\nBody paragraph two.');
    await page.getByLabel('Status').selectOption({ label: 'Draft' });
    await page.getByRole('button', { name: 'Create' }).click();

    const row = page.getByRole('row').filter({ hasText: title });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('Draft');
    await row.getByRole('button', { name: 'Publish' }).click();
    await expect(row).toContainText('Published');

    await row.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Title').fill(`${title} (edited)`);
    await page.getByRole('button', { name: /^Save/ }).click();
    await expect(page.getByRole('row').filter({ hasText: `${title} (edited)` })).toHaveCount(1);

    // Persisted locally across a reload of the panel.
    await gotoReady(page, '/admin');
    await openSection(page, 'Articles');
    const edited = page.getByRole('row').filter({ hasText: `${title} (edited)` });
    await expect(edited).toHaveCount(1);

    page.once('dialog', (d) => d.accept());
    await edited.getByRole('button', { name: /^Delete/ }).click();
    await expect(page.getByRole('row').filter({ hasText: title })).toHaveCount(0);
  });

  test('pages: create → edit → unpublish/publish → delete', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Pages');
    await page.getByRole('button', { name: 'New page' }).click();
    const title = `E2E page ${Date.now()}`;
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('URL slug').fill('e2e-landing');
    await page.getByLabel('Meta description').fill('Meta for the e2e page.');
    await page.getByLabel('Section heading 1').fill('Heading');
    await page.getByLabel('Section text 1').fill('Text');
    await page.getByRole('button', { name: 'Add section' }).click();
    await expect(page.getByLabel('Section heading 2')).toBeVisible();
    await page.getByRole('button', { name: 'Remove section: 2' }).click();
    await page.getByLabel('Status').selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Create' }).click();

    const row = page.getByRole('row').filter({ hasText: title });
    await expect(row).toHaveCount(1);
    await row.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Title').fill(`${title} v2`);
    await page.getByRole('button', { name: /^Save/ }).click();
    const row2 = page.getByRole('row').filter({ hasText: `${title} v2` });
    await expect(row2).toHaveCount(1);

    const toggle = row2.getByRole('button', { name: /^(Unpublish|Publish)$/ });
    const before = await toggle.innerText();
    await toggle.click();
    await expect(row2.getByRole('button', { name: /^(Unpublish|Publish)$/ })).not.toHaveText(before);

    page.once('dialog', (d) => d.accept());
    await row2.getByRole('button', { name: /^Delete/ }).click();
    await expect(page.getByRole('row').filter({ hasText: title })).toHaveCount(0);
  });

  test('leads: stage change moves the card; CSV export downloads', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Leads');
    const stage = page.getByRole('combobox', { name: /^Stage: / }).first();
    const who = (await stage.getAttribute('aria-label'))!.replace('Stage: ', '');
    await stage.selectOption({ label: 'Closed' });
    const closedColumn = page.locator('main').getByRole('region').filter({ has: page.getByRole('heading', { level: 3, name: 'Closed' }) });
    await expect(closedColumn.getByRole('combobox', { name: `Stage: ${who}` })).toHaveValue(/closed/i);

    // Survives reload (persisted override).
    await gotoReady(page, '/admin');
    await openSection(page, 'Leads');
    await expect(page.getByRole('combobox', { name: `Stage: ${who}` })).toHaveValue(/closed/i);

    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export CSV' }).click()]);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
    const csv = await readFile((await download.path())!, 'utf8');
    const lines = csv.trim().split(/\r?\n/);
    expect(lines.length, 'header + rows').toBeGreaterThan(2);
    expect(csv).not.toMatch(/undefined|NaN|\[object Object\]/);

    // Table view.
    await page.getByRole('button', { name: 'Table', exact: true }).click();
    await expect(page.locator('main table')).toBeVisible();
  });

  test('a lead queued from a public form shows up in the admin CRM', async ({ page }) => {
    await gotoReady(page, '/contacts');
    const form = leadForm(page);
    await fillLeadForm(form, { 'full name': 'Queued Visitor E2E' });
    await consent(form).check();
    await page.waitForTimeout(ANTI_SPAM_MS);
    await submitButton(form).click();
    await expectOutcome(page);
    expect(await outbox(page)).toHaveLength(1);
    await signIn(page);
    await openSection(page, 'Leads');
    await expect(page.locator('main').getByText('Queued Visitor E2E').first()).toBeVisible();
  });

  test('forms toggle disables the public LeadForm and re-enables it', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Forms');
    const toggle = page.getByRole('switch', { name: 'Form: Contacts' });
    await expect(toggle).toBeChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();

    await gotoReady(page, '/contacts');
    await expect(page.getByText('Online requests through this form are paused')).toBeVisible();
    await expect(page.locator('form.oph-leadform')).toHaveCount(0);
    await expect(page.locator('main a[href^="tel:"]').first()).toBeVisible();

    await gotoReady(page, '/admin');
    await openSection(page, 'Forms');
    await page.getByRole('switch', { name: 'Form: Contacts' }).click();
    await gotoReady(page, '/contacts');
    await expect(page.locator('form.oph-leadform')).toBeVisible();
  });

  test('analytics renders charts with numbers', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Analytics');
    for (const heading of ['Traffic, last 30 days', 'Leads by country', 'Booking funnel', 'Leads by source']) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    expect(await page.locator('main svg').count()).toBeGreaterThan(2);
    await expect(page.locator('main')).not.toContainText(/NaN|Infinity|undefined/);
  });

  test('settings: automation switch and integration field persist after reload', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Automation');
    const sw = page.getByRole('switch', { name: 'Request confirmation' });
    await sw.click();
    await expect(sw).not.toBeChecked();
    await page.getByRole('button', { name: 'Save scenarios' }).click();

    await openSection(page, 'Integrations');
    await page.getByLabel('Google Analytics 4').fill('G-E2ETEST01');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await gotoReady(page, '/admin');
    await openSection(page, 'Automation');
    await expect(page.getByRole('switch', { name: 'Request confirmation' })).not.toBeChecked();
    await openSection(page, 'Integrations');
    await expect(page.getByLabel('Google Analytics 4')).toHaveValue('G-E2ETEST01');

    await openSection(page, 'Security');
    const perm = page.getByRole('checkbox', { name: 'Editor — Leads' });
    await perm.click();
    await expect(perm).toBeChecked();
  });

  test('prices: editing a price updates the formatted column', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Prices');
    const input = page.locator('main input[type=number]').first();
    await input.fill('12345');
    await input.blur();
    await expect(page.locator('main').getByText(/12[\s ,.]?345/).first()).toBeVisible();
    await input.fill('-5');
    await input.blur();
    await expect(input).not.toHaveValue('-5');
  });

  test('doctors: add doctor modal validates and adds a row', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Doctors');
    const rows = page.locator('main tbody tr');
    const before = await rows.count();
    await page.locator('main').getByRole('button', { name: 'Add' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /^(Add|Save|Create)$/ }).click();
    await expect(dialog, 'empty form must not close the modal').toBeVisible();
    const textboxes = dialog.getByRole('textbox');
    await textboxes.nth(0).fill('Dr E2E Test');
    if ((await textboxes.count()) > 1) await textboxes.nth(1).fill('Ophthalmologist');
    const number = dialog.locator('input[type=number]');
    if (await number.count()) await number.fill('7');
    const select = dialog.locator('select');
    if (await select.count()) await select.first().selectOption({ index: 1 });
    await dialog.getByRole('button', { name: /^(Add|Save|Create)$/ }).click();
    await expect(rows).toHaveCount(before + 1);
  });

  test('photos: uploads images and rejects non-images', async ({ page }) => {
    await signIn(page);
    await openSection(page, 'Photos');
    const input = page.locator('main input[type=file]');
    await input.setInputFiles({
      name: 'clinic.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'),
    });
    await expect(page.locator('main img[src^="blob:"]')).toHaveCount(1);
    await input.setInputFiles({ name: 'x.txt', mimeType: 'text/plain', buffer: Buffer.from('x') });
    await expect(page.locator('main img[src^="blob:"]')).toHaveCount(1);
  });
});
