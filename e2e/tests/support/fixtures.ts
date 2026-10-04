import { test as base, expect, type Page, type Locator } from '@playwright/test';

/**
 * Shared fixtures.
 *
 * - `lang` / `consent`: seeded into localStorage once per tab (first document
 *   only), so language switches made by a test survive later navigations.
 * - `diag`: collects uncaught page errors and console errors. Console errors
 *   caused by the intentionally-absent API (`/api/*` answering 500) are counted
 *   separately as environment noise, not as defects.
 * - Uncaught page errors fail the test at teardown unless `allowPageErrors`.
 */

export interface Diag {
  pageErrors: string[];
  consoleErrors: string[];
  apiErrors: string[];
  badImages: string[];
}

type Fixtures = {
  lang: 'ru' | 'kk' | 'en' | null;
  consent: 'granted' | 'denied' | null;
  allowPageErrors: boolean;
  diag: Diag;
};

export const test = base.extend<Fixtures>({
  lang: ['en', { option: true }],
  consent: ['denied', { option: true }],
  allowPageErrors: [false, { option: true }],

  diag: async ({}, use) => {
    await use({ pageErrors: [], consoleErrors: [], apiErrors: [], badImages: [] });
  },

  page: async ({ page, lang, consent, diag, allowPageErrors }, use, testInfo) => {
    await page.addInitScript(
      ([lang, consent]) => {
        try {
          if (sessionStorage.getItem('e2e.seeded')) return;
          sessionStorage.setItem('e2e.seeded', '1');
          if (lang) localStorage.setItem('ophtra.lang', lang);
          if (consent) localStorage.setItem('ophtra.consent.analytics', consent);
        } catch {
          /* opaque origin (about:blank) */
        }
      },
      [lang, consent] as const,
    );

    page.on('pageerror', (error) => diag.pageErrors.push(`${page.url()} :: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const url = message.location().url ?? '';
      const text = `${message.text()} @ ${url}`;
      if (url.includes('/api/') || /\/api\//.test(message.text())) diag.apiErrors.push(text);
      else diag.consoleErrors.push(`${page.url()} :: ${text}`);
    });
    page.on('response', (response) => {
      const req = response.request();
      if (req.resourceType() === 'image' && response.status() >= 400)
        diag.badImages.push(`${response.status()} ${response.url()}`);
    });
    page.on('requestfailed', (req) => {
      if (req.resourceType() === 'image' && !/ERR_ABORTED/.test(req.failure()?.errorText ?? ''))
        diag.badImages.push(`failed ${req.url()} ${req.failure()?.errorText}`);
    });

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus || testInfo.errors.length) {
      const file = testInfo.outputPath('failure.png');
      await page
        .screenshot({ path: file, timeout: 5_000, animations: 'disabled', caret: 'initial' })
        .then(() => testInfo.attachments.push({ name: 'screenshot', path: file, contentType: 'image/png' }))
        .catch(() => undefined);
    }

    if (diag.pageErrors.length || diag.consoleErrors.length) {
      await testInfo.attach('diagnostics.json', {
        body: JSON.stringify(diag, null, 2),
        contentType: 'application/json',
      });
    }
    if (!allowPageErrors) {
      expect(diag.pageErrors, 'uncaught page errors during the test').toEqual([]);
    }
  },
});

export { expect };

export const PRELOADER = '#oph-preloader';

/** Waits for the logo-reveal overlay to be removed from the DOM. */
export const waitForReveal = async (page: Page) => {
  await expect(page.locator(PRELOADER)).toHaveCount(0, { timeout: 12_000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-loading', /.*/, { timeout: 5_000 });
};

/** Hard navigation + wait for the logo reveal and the lazy route chunk. */
export const gotoReady = async (page: Page, path: string) => {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  await waitForReveal(page);
  await expect(page.locator('main h1').first()).toBeAttached({ timeout: 15_000 });
  return response;
};

/** Client-side navigation settle: new h1 rendered. */
export const settle = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('main h1').first()).toBeAttached({ timeout: 15_000 });
};

/**
 * Scrolls to the bottom in viewport steps so IntersectionObserver reveals and
 * lazy images fire; bounded because pinned sections change scroll height.
 */
export const scrollThrough = async (page: Page, maxSteps = 80) => {
  for (let i = 0; i < maxSteps; i += 1) {
    const done = await page.evaluate(() => {
      const el = document.scrollingElement!;
      window.scrollBy(0, Math.round(window.innerHeight * 0.85));
      return el.scrollTop + window.innerHeight >= el.scrollHeight - 2;
    });
    await page.waitForTimeout(120);
    if (done) break;
  }
  await page.waitForTimeout(600);
};

export const outbox = async (page: Page): Promise<Array<{ lead: Record<string, string>; queuedAt: string }>> =>
  page.evaluate(() => JSON.parse(localStorage.getItem('ophtra.outbox.leads') ?? '[]'));

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

/** Clicks with a fallback for elements animated by the "magnetic" hover effect. */
export const safeClick = async (locator: Locator) => {
  await locator.scrollIntoViewIfNeeded();
  await locator.click({ timeout: 10_000 });
};
