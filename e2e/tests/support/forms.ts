import type { Locator, Page } from '@playwright/test';
import { expect } from './fixtures';

/** Every LeadForm on the site: CRM source tag → page that hosts it. */
export const LEAD_FORMS: Array<{ source: string; path: string; files?: boolean }> = [
  { source: 'contacts', path: '/contacts' },
  { source: 'international', path: '/international-patients', files: true },
  { source: 'second-opinion', path: '/second-opinion', files: true },
  { source: 'online-consultation', path: '/online-consultation', files: true },
  { source: 'service-consultation', path: '/services/oct', files: true },
  { source: 'partnership', path: '/partnerships' },
  { source: 'academy', path: '/academy' },
  { source: 'expert-network', path: '/global-experts' },
  { source: 'science-collaboration', path: '/science' },
  { source: 'careers', path: '/vacancies' },
];

export const leadForm = (page: Page) => page.locator('form.oph-leadform').first();

const isoDate = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
};

/**
 * Fills every visible field of a LeadForm with valid data. `overrides` maps a
 * label substring (case-insensitive) to the value to type instead.
 */
export const fillLeadForm = async (form: Locator, overrides: Record<string, string> = {}) => {
  await form.scrollIntoViewIfNeeded();
  const fields = form.locator(
    'input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([name=website]), textarea, select',
  );
  const count = await fields.count();
  for (let i = 0; i < count; i += 1) {
    const field = fields.nth(i);
    if (!(await field.isVisible())) continue;
    const meta = await field.evaluate((el) => {
      const input = el as HTMLInputElement;
      const label = input.labels?.[0]?.textContent ?? input.getAttribute('aria-label') ?? '';
      return { tag: el.tagName.toLowerCase(), type: input.type, label, min: input.min, max: input.max };
    });
    const override = Object.entries(overrides).find(([key]) => meta.label.toLowerCase().includes(key.toLowerCase()));
    if (meta.tag === 'select') {
      await field.selectOption({ index: 1 });
      continue;
    }
    let value: string;
    if (override) value = override[1];
    else if (meta.type === 'tel' || /phone/i.test(meta.label)) value = '+7 701 234 56 78';
    else if (meta.type === 'email') value = 'e2e.patient@example.com';
    else if (meta.type === 'date') value = meta.min && meta.min > isoDate(7) ? meta.min : isoDate(7);
    else if (/link|url|profile/i.test(meta.label)) value = 'https://example.com/profile';
    else value = `E2E ${meta.label.replace(/\*/g, '').trim().slice(0, 30)}`;
    await field.fill(value);
  }
};

export const consent = (form: Locator) => form.getByRole('checkbox', { name: /consent/i });
export const submitButton = (form: Locator) => form.locator('button[type=submit]');

/** LeadForm drops anything submitted < 2.5 s after mount. */
export const ANTI_SPAM_MS = 2_600;

export const expectOutcome = async (page: Page) => {
  const status = page.locator('.oph-state[role=status]').first();
  await expect(status).toBeVisible({ timeout: 15_000 });
  const text = await status.innerText();
  const ref = text.match(/OPH-[A-Z0-9]{3,}/)?.[0];
  expect(ref, `confirmation shows an OPH-… reference; got: ${text}`).toBeTruthy();
  const queued = (await status.getAttribute('class'))?.includes('warning') ?? false;
  return { ref: ref!, queued, text };
};

/** Minimal valid file payloads. */
export const FILES = {
  pdf: { name: 'records.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF') },
  jpg: { name: 'scan.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 0xff, 0xd9]) },
  png: {
    name: 'oct.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    ),
  },
  exe: { name: 'virus.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') },
  txt: { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
  docx: {
    name: 'letter.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    buffer: Buffer.from('PK'),
  },
  big: { name: 'huge.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10 * 1024 * 1024 + 10, 0x20) },
};
