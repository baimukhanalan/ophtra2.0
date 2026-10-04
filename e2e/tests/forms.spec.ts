import { test, expect, gotoReady, outbox } from './support/fixtures';
import { ANTI_SPAM_MS, FILES, LEAD_FORMS, consent, expectOutcome, fillLeadForm, leadForm, submitButton } from './support/forms';

/**
 * 3. Every LeadForm: validation, valid submission with the API down (queued
 * state + outbox entry), honeypot, double submit. File rules on the forms
 * that accept attachments.
 */

for (const spec of LEAD_FORMS) {
  test.describe(`LeadForm "${spec.source}" on ${spec.path}`, () => {
    test('empty submit shows validation errors', async ({ page }) => {
      await gotoReady(page, spec.path);
      const form = leadForm(page);
      await form.scrollIntoViewIfNeeded();
      await page.waitForTimeout(ANTI_SPAM_MS);
      await submitButton(form).click();
      const errors = form.locator('.oph-field__error');
      await expect(errors.first()).toBeVisible();
      const texts = await errors.allInnerTexts();
      expect(texts.join(' | ')).toMatch(/required/i);
      expect(texts.join(' | ')).toMatch(/valid phone/i);
      expect(texts.join(' | ')).toMatch(/Consent/i);
      // Invalid fields are flagged for assistive tech.
      expect(await form.locator('[aria-invalid="true"]').count()).toBeGreaterThan(0);
      expect(await outbox(page)).toHaveLength(0);
    });

    test('invalid phone and e-mail are rejected', async ({ page }) => {
      await gotoReady(page, spec.path);
      const form = leadForm(page);
      await fillLeadForm(form, { phone: '12ab', 'e-mail': 'not-an-email' });
      await consent(form).check();
      await page.waitForTimeout(ANTI_SPAM_MS);
      await submitButton(form).click();
      await expect(form.getByText('Enter a valid phone number')).toBeVisible();
      await expect(form.getByText('Enter a valid email address')).toBeVisible();
      expect(await outbox(page)).toHaveLength(0);
    });

    test('valid submit → queued confirmation with OPH reference and outbox entry', async ({ page }) => {
      await gotoReady(page, spec.path);
      const form = leadForm(page);
      await fillLeadForm(form);
      await consent(form).check();
      await page.waitForTimeout(ANTI_SPAM_MS);
      await submitButton(form).click();
      const result = await expectOutcome(page);
      expect(result.queued, 'API is down → the warning (queued) state, not a false "sent"').toBe(true);
      const box = await outbox(page);
      expect(box).toHaveLength(1);
      expect(box[0].lead.source.split('|')[0]).toBe(spec.source);
      expect(box[0].lead.comment).toContain(result.ref);
      // "Send another" resets to an empty form.
      await page.getByRole('button', { name: 'Send another request' }).click();
      await expect(leadForm(page)).toBeVisible();
    });

    test('honeypot filled → silent drop, nothing queued', async ({ page }) => {
      await gotoReady(page, spec.path);
      const form = leadForm(page);
      await fillLeadForm(form);
      await consent(form).check();
      await form.locator('input[name=website]').evaluate((el: HTMLInputElement) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
        setter.call(el, 'http://spam.example');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForTimeout(ANTI_SPAM_MS);
      await submitButton(form).click();
      await expect(page.locator('.oph-state[role=status]')).toBeVisible();
      expect(await outbox(page)).toHaveLength(0);
    });

    test('double-click on submit creates exactly one lead', async ({ page }) => {
      await gotoReady(page, spec.path);
      const form = leadForm(page);
      await fillLeadForm(form);
      await consent(form).check();
      await page.waitForTimeout(ANTI_SPAM_MS);
      await submitButton(form).dblclick();
      await expectOutcome(page);
      await page.waitForTimeout(800);
      expect(await outbox(page)).toHaveLength(1);
    });
  });
}

test('submitting faster than 2.5 s after mount is dropped as spam (no outbox entry)', async ({ page }) => {
  await gotoReady(page, '/');
  // Client-side navigation so the form mounts "now".
  await page.evaluate(() => {
    history.pushState({}, '', '/contacts');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  const form = leadForm(page);
  await expect(form).toBeVisible();
  await fillLeadForm(form);
  await consent(form).check();
  await submitButton(form).click();
  await expect(page.locator('.oph-state[role=status]')).toBeVisible();
  expect(await outbox(page)).toHaveLength(0);
});

test.describe('file upload (second opinion)', () => {
  test('accepts PDF, JPG and PNG; rejects other types and > 10 MB', async ({ page }) => {
    await gotoReady(page, '/second-opinion');
    const form = leadForm(page);
    const input = form.locator('input[type=file]');
    await input.setInputFiles([FILES.pdf, FILES.jpg, FILES.png]);
    const list = form.locator('.oph-filelist li');
    await expect(list).toHaveCount(3);
    await expect(list.filter({ hasText: 'records.pdf' })).toBeVisible();
    await expect(form.getByRole('alert')).toHaveCount(0);

    for (const bad of [FILES.exe, FILES.txt, FILES.docx]) {
      await input.setInputFiles(bad);
      await expect(form.getByText('Only PDF, JPG and PNG are supported'), `${bad.name} rejected`).toBeVisible();
      await expect(list).toHaveCount(3);
    }

    await input.setInputFiles(FILES.big);
    await expect(form.getByText(/larger than 10 MB/)).toBeVisible();
    await expect(list).toHaveCount(3);

    // Remove one.
    await form.getByRole('button', { name: /Delete: scan\.jpg/ }).click();
    await expect(list).toHaveCount(2);

    // Submit with attachments → names recorded on the lead.
    await fillLeadForm(form);
    await consent(form).check();
    await page.waitForTimeout(ANTI_SPAM_MS);
    await submitButton(form).click();
    await expectOutcome(page);
    const box = await outbox(page);
    expect(box[0].lead.comment).toMatch(/Files: records\.pdf .*oct\.png/);
  });

  test('a spoofed extension with the wrong MIME type is rejected', async ({ page }) => {
    await gotoReady(page, '/second-opinion');
    const form = leadForm(page);
    await form.locator('input[type=file]').setInputFiles({ name: 'report.pdf', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') });
    await expect(form.getByText('Only PDF, JPG and PNG are supported')).toBeVisible();
  });

  test('more than 10 files are capped at 10', async ({ page }) => {
    await gotoReady(page, '/second-opinion');
    const form = leadForm(page);
    const many = Array.from({ length: 12 }, (_, i) => ({ ...FILES.png, name: `scan-${i + 1}.png` }));
    await form.locator('input[type=file]').setInputFiles(many);
    await expect(form.locator('.oph-filelist li')).toHaveCount(10);
  });
});
