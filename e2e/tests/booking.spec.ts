import type { Page } from '@playwright/test';
import { test, expect, gotoReady, outbox } from './support/fixtures';

/**
 * 4. Booking wizard /appointment — full flow with the API down, stepper,
 * back/next, pills, query prefill, validation, double submit.
 */

const wizard = (page: Page) => page.locator('.bk');
const next = (page: Page) => page.locator('.bk-nav--footer').getByRole('button', { name: /^Next/ });
const back = (page: Page) => page.locator('.bk-nav--footer').getByRole('button', { name: /Back/ });
const activePill = (page: Page) => page.locator('.bk-pill[aria-current=step]');
const choices = (page: Page) => page.locator('.bk-stage .bk-choice');

const pickFirst = async (page: Page, name?: RegExp) => {
  const target = name ? choices(page).filter({ hasText: name }).first() : choices(page).first();
  await target.click();
  await expect(target).toHaveAttribute('aria-pressed', 'true');
};

/** Picks the first day that has open slots and the first slot on it. */
const pickSlot = async (page: Page) => {
  const days = page.locator('.bk-day');
  const count = await days.count();
  expect(count, 'date strip offers days').toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    await days.nth(i).click();
    const slot = page.locator('.bk-slot').first();
    const none = page.getByText('No slots available on the selected date');
    await expect(slot.or(none)).toBeVisible();
    if (await slot.isVisible()) {
      await slot.click();
      await expect(slot).toHaveAttribute('aria-pressed', 'true');
      return;
    }
  }
  throw new Error('no day in the strip has an open slot');
};

/** The clinic step only exists when there is more than one clinic. */
const maybeClinic = async (page: Page) => {
  if (/Clinic/.test(await activePill(page).innerText())) {
    await pickFirst(page);
    await next(page).click();
  }
};

const walkToConfirm = async (page: Page) => {
  await pickFirst(page, /Doctor appointment/);
  await next(page).click();
  await maybeClinic(page);
  await pickFirst(page); // department
  await next(page).click();
  await pickFirst(page); // service
  await next(page).click();
  await pickFirst(page, /Any available doctor/);
  await next(page).click();
  await pickSlot(page);
  await next(page).click();
  await expect(activePill(page)).toContainText('Confirmation');
};

const fillPatient = async (page: Page) => {
  const form = page.locator('.bk-form');
  await form.getByLabel('Full name').fill('E2E Patient');
  await form.getByLabel('Phone').fill('+7 701 234 56 78');
  await form.getByLabel('Email').fill('e2e.patient@example.com');
  await form.getByRole('checkbox', { name: /processing of my personal data/ }).check();
};

test('full booking flow with the API down ends in an honest "request saved" state', async ({ page }) => {
  await gotoReady(page, '/appointment');
  await expect(activePill(page)).toContainText('Visit type');
  await walkToConfirm(page);

  // Summary shows what was chosen.
  const summary = page.locator('.bk-summary');
  await expect(summary).toContainText('Clinic');
  await expect(summary).toContainText('Service');
  await expect(summary).toContainText(/₸/);

  await fillPatient(page);
  await page.getByRole('button', { name: 'Confirm appointment' }).click();

  const done = page.locator('.bk--done');
  await expect(done).toBeVisible({ timeout: 15_000 });
  const ref = (await done.locator('.bk-ticket__ref').innerText()).trim();
  expect(ref, 'a reference is shown').not.toBe('');
  const state = done.locator('.oph-state');
  await expect(state, 'API down → must not claim the slot is booked').toHaveClass(/warning/);
  await expect(state).not.toContainText('Appointment confirmed');
  await expect(done.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', new RegExp(`wa\\.me/\\d+\\?text=.*${encodeURIComponent(ref).replace(/[-]/g, '\\-')}`));

  // The request must not be lost: it is queued for the CRM.
  await expect.poll(async () => (await outbox(page)).length, { message: 'booking queued in the outbox' }).toBe(1);
  const lead = (await outbox(page))[0].lead;
  expect(lead.comment).toContain(ref);

  // "New appointment" restarts the wizard.
  await page.getByRole('button', { name: 'New appointment' }).click();
  await expect(activePill(page)).toContainText('Visit type');
});

test('Next without a choice warns and stays; Back is disabled on step 1', async ({ page }) => {
  await gotoReady(page, '/appointment');
  await expect(back(page)).toBeDisabled();
  await expect(next(page)).toHaveAttribute('aria-disabled', 'true');
  // aria-disabled (not disabled): a real click still reaches it; Playwright's
  // actionability treats aria-disabled as disabled, hence force.
  await next(page).click({ force: true });
  await expect(page.getByText('Choose an option first')).toBeVisible();
  await expect(activePill(page)).toContainText('Visit type');
});

test('back/next and step pills navigate; future pills are disabled', async ({ page }) => {
  await gotoReady(page, '/appointment');
  await pickFirst(page, /Doctor appointment/);
  await next(page).click();
  await maybeClinic(page);
  await expect(activePill(page)).toContainText('Department');
  await pickFirst(page);
  await next(page).click();
  await expect(activePill(page)).toContainText('Service');

  const pills = page.locator('.bk-pill');
  const total = await pills.count();
  expect(total).toBeGreaterThanOrEqual(6);
  const current = await pills.evaluateAll((els) => els.findIndex((e) => e.getAttribute('aria-current') === 'step'));
  for (let i = current + 1; i < total; i += 1) await expect(pills.nth(i)).toBeDisabled();

  await back(page).click();
  await expect(activePill(page)).toContainText('Department');
  await expect(page.locator('.bk-choice[aria-pressed=true]'), 'department choice is remembered').toHaveCount(1);

  await pills.nth(0).click();
  await expect(activePill(page)).toContainText('Visit type');
  await expect(page.locator('.bk-choice[aria-pressed=true]'), 'earlier choice is remembered').toHaveCount(1);
  await expect(page.getByText(new RegExp(`Step 1 of ${total}`))).toBeVisible();
});

test('prefill /appointment?service=oct keeps the service through the flow', async ({ page }) => {
  await gotoReady(page, '/appointment?service=oct');
  // Visit type is still required.
  await pickFirst(page, /Diagnostics/);
  await next(page).click();
  await maybeClinic(page);
  // Department and service should already be answered.
  for (let i = 0; i < 2; i += 1) {
    await expect(page.locator('.bk-choice[aria-pressed=true]'), `prefilled choice kept at "${await activePill(page).innerText()}"`).toHaveCount(1);
    await next(page).click();
  }
  await expect(activePill(page)).toContainText('Doctor');
  await pickFirst(page, /Any available doctor/);
  await next(page).click();
  await pickSlot(page);
  await next(page).click();
  await expect(page.locator('.bk-summary')).toContainText(/Optical coherence tomography|OCT/);
});

test('prefill ?doctor=<slug> keeps the doctor through the flow', async ({ page }) => {
  await gotoReady(page, '/appointment?doctor=aigul-akhmetova');
  await pickFirst(page, /Doctor appointment/);
  await next(page).click();
  await maybeClinic(page);
  // Department is prefilled from the doctor.
  await expect(page.locator('.bk-choice[aria-pressed=true]'), 'department prefilled from the doctor').toHaveCount(1);
  await next(page).click();
  await pickFirst(page); // service
  await next(page).click();
  await expect(activePill(page)).toContainText('Doctor');
  await expect(page.locator('.bk-choice[aria-pressed=true]'), 'the linked doctor is preselected').toContainText('Akhmetova');
});

test('confirmation step validates the patient form', async ({ page }) => {
  await gotoReady(page, '/appointment');
  await walkToConfirm(page);
  await page.getByRole('button', { name: 'Confirm appointment' }).click();
  const errors = page.locator('.bk-form .oph-field__error');
  await expect(errors.first()).toBeVisible();
  expect((await errors.allInnerTexts()).join(' ')).toMatch(/required.*valid phone.*Consent/s);
  await page.locator('.bk-form').getByLabel('Phone').fill('abc');
  await page.locator('.bk-form').getByLabel('Email').fill('x@y');
  await page.getByRole('button', { name: 'Confirm appointment' }).click();
  await expect(page.getByText('Enter a valid email address')).toBeVisible();
  expect(await outbox(page)).toHaveLength(0);
});

test('double-clicking "Confirm appointment" creates one request', async ({ page }) => {
  await gotoReady(page, '/appointment');
  await walkToConfirm(page);
  await fillPatient(page);
  await page.getByRole('button', { name: 'Confirm appointment' }).dblclick();
  await expect(page.locator('.bk--done')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1000);
  expect(await outbox(page)).toHaveLength(1);
});

test('booking entry points: header CTA, service page CTA and doctor CTA open the wizard', async ({ page }) => {
  await gotoReady(page, '/services/oct');
  const cta = page.locator('main a[href*="/appointment?service=oct"]').filter({ visible: true }).first();
  await cta.click();
  await expect(page).toHaveURL(/\/appointment\?service=oct/);
  await expect(wizard(page)).toBeVisible();

  await gotoReady(page, '/doctors/aigul-akhmetova');
  const doctorCta = page.locator('main a[href*="/appointment?"][href*="doctor=aigul-akhmetova"]').filter({ visible: true }).first();
  await doctorCta.click();
  await expect(page).toHaveURL(/doctor=aigul-akhmetova/);
  await expect(wizard(page)).toBeVisible();
});
