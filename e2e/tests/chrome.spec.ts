import type { Page } from '@playwright/test';
import { test, expect, gotoReady, isMobile } from './support/fixtures';

/** Below 768 px the floating toggle is hidden; the drawer has the entry instead. */
const openA11y = async (page: Page) => {
  if (isMobile(page)) {
    await page.locator('.oph-header__burger').click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('button', { name: 'Accessibility settings' }).click();
  } else {
    await page.locator('.oph-a11y-toggle').click();
  }
  await expect(page.getByRole('dialog', { name: 'Accessibility' })).toBeVisible();
};

/**
 * 5c. Global chrome: cookie banner, accessibility panel, assistant widget.
 */

test.describe('cookie banner', () => {
  test.use({ consent: null });

  for (const [choice, button, stored] of [
    ['accept', 'Accept', 'granted'],
    ['essential only', /necessary|essential/i, 'denied'],
  ] as const) {
    test(`${choice} persists and the banner stays hidden`, async ({ page }) => {
      await gotoReady(page, '/');
      const banner = page.locator('.oph-consent');
      await expect(banner).toBeVisible({ timeout: 8_000 });
      await banner.getByRole('button', { name: button }).click();
      await expect(banner).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('ophtra.consent.analytics'))).toBe(stored);
      await expect(page.locator('html')).not.toHaveAttribute('data-consent-open', /.*/);
      await gotoReady(page, '/about');
      await page.waitForTimeout(2_000);
      await expect(banner).toHaveCount(0);
    });
  }

  test('no third-party requests before consent', async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      const url = new URL(r.url());
      if (url.origin !== new URL(baseURL!).origin && !/^(data|blob):/.test(r.url())) external.push(r.url());
    });
    await gotoReady(page, '/');
    await page.waitForTimeout(2_000);
    expect(external.filter((u) => !/fonts\.(googleapis|gstatic)\.com/.test(u))).toEqual([]);
  });

  test('banner does not cover the floating buttons', async ({ page }) => {
    await gotoReady(page, '/');
    const banner = page.locator('.oph-consent');
    await expect(banner).toBeVisible({ timeout: 8_000 });
    const b = await banner.boundingBox();
    for (const sel of ['.oph-a11y-toggle', '.oph-assistant-launcher']) {
      if (!(await page.locator(sel).isVisible())) continue;
      const box = await page.locator(sel).boundingBox();
      if (!b || !box) continue;
      const overlap = !(box.x + box.width <= b.x || b.x + b.width <= box.x || box.y + box.height <= b.y || b.y + b.height <= box.y);
      expect(overlap, `${sel} overlaps the cookie card`).toBe(false);
    }
  });
});

test.describe('accessibility panel', () => {
  test('font scale, contrast and reduced motion apply to <html> and persist', async ({ page }) => {
    await gotoReady(page, '/');
    const html = page.locator('html');
    await openA11y(page);
    const panel = page.getByRole('dialog', { name: 'Accessibility' });

    const fontBefore = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
    await panel.getByRole('radio', { name: 'Large' }).or(panel.getByRole('button', { name: 'Large', exact: true })).first().click();
    await expect(html).toHaveAttribute('data-font-scale', 'lg');
    await panel.getByRole('radio', { name: 'Extra large' }).or(panel.getByRole('button', { name: 'Extra large', exact: true })).first().click();
    await expect(html).toHaveAttribute('data-font-scale', 'xl');
    const fontAfter = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
    expect(fontAfter, 'text actually grows').toBeGreaterThan(fontBefore);

    await panel.getByRole('checkbox', { name: 'High contrast' }).check();
    await expect(html).toHaveAttribute('data-contrast', 'high');
    await panel.getByRole('checkbox', { name: 'Reduce motion' }).check();
    await expect(html).toHaveAttribute('data-reduced-motion', 'true');

    // Persisted and restored before first paint.
    await gotoReady(page, '/about');
    await expect(html).toHaveAttribute('data-font-scale', 'xl');
    await expect(html).toHaveAttribute('data-contrast', 'high');
    await expect(html).toHaveAttribute('data-reduced-motion', 'true');

    // Layout survives XL text without horizontal scrolling.
    const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'no horizontal overflow at XL font scale').toBeLessThanOrEqual(1);

    await openA11y(page);
    await page.getByRole('dialog', { name: 'Accessibility' }).getByRole('button', { name: 'Reset settings' }).click();
    await expect(html).not.toHaveAttribute('data-font-scale', /.*/);
    await expect(html).not.toHaveAttribute('data-contrast', /.*/);
    await expect(html).not.toHaveAttribute('data-reduced-motion', /.*/);
  });

  test('Escape and outside click close the panel; focus returns to the toggle', async ({ page }) => {
    test.skip(isMobile(page), 'floating toggle is desktop-only');
    await gotoReady(page, '/');
    const toggle = page.locator('.oph-a11y-toggle');
    await toggle.click();
    await expect(page.getByRole('dialog', { name: 'Accessibility' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Accessibility' })).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.mouse.click(700, 300);
    await expect(page.getByRole('dialog', { name: 'Accessibility' })).toHaveCount(0);
  });
});

test.describe('assistant widget', () => {
  test('opens, answers a message, renders user text as text, closes', async ({ page }) => {
    let alerted = false;
    page.on('dialog', async (d) => {
      alerted = true;
      await d.dismiss();
    });
    await gotoReady(page, '/');
    // On phones the launcher appears once the first screen has been scrolled past.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    const launcher = page.locator('.oph-assistant-launcher');
    await launcher.click();
    const dialog = page.getByRole('dialog', { name: 'Centre assistant' });
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole('textbox', { name: /Describe your question/ });
    const send = dialog.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();
    await input.fill('How much does cataract surgery cost?');
    await send.click();
    const bubbles = dialog.locator('.oph-msg');
    await expect(bubbles.filter({ hasText: 'How much does cataract surgery cost?' })).toHaveCount(1);
    await expect.poll(() => dialog.locator('.oph-msg--bot').count(), { timeout: 10_000 }).toBeGreaterThan(0);
    const reply = (await dialog.locator('.oph-msg--bot').last().innerText()).trim();
    expect(reply.length).toBeGreaterThan(10);
    expect(reply).not.toMatch(/undefined|NaN|\{|\}/);

    const xss = '<img src=x onerror=alert(1)><script>alert(1)</script>';
    await input.fill(xss);
    await input.press('Enter');
    await expect(dialog.locator('.oph-msg--user').filter({ hasText: '<script>alert(1)</script>' })).toHaveCount(1);
    await expect(dialog.locator('.oph-msg img')).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(alerted, 'no script executed from chat input').toBe(false);

    // Operator hand-off and reset.
    await dialog.getByRole('button', { name: 'Talk to an operator' }).click();
    await expect.poll(() => dialog.locator('.oph-msg--bot').count()).toBeGreaterThan(1);
    await dialog.getByRole('button', { name: 'Start over' }).click();
    await expect(dialog.locator('.oph-msg--user')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(launcher).toBeFocused();
  });

  test('close button closes; a booking intent can navigate to /appointment', async ({ page }) => {
    await gotoReady(page, '/about');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.locator('.oph-assistant-launcher').click();
    const dialog = page.getByRole('dialog', { name: 'Centre assistant' });
    await dialog.getByRole('textbox').fill('I want to book an appointment with an ophthalmologist');
    await dialog.getByRole('button', { name: 'Send' }).click();
    await expect.poll(() => dialog.locator('.oph-msg--bot').count(), { timeout: 10_000 }).toBeGreaterThan(0);
    // Either the assistant navigates, or offers a booking chip/link.
    await page.waitForTimeout(1500);
    const navigated = /\/appointment/.test(page.url());
    // The assistant may navigate, link to booking, or continue the dialogue with suggestion chips.
    const offers = await dialog.locator('.oph-assistant__chip:not(.oph-assistant__operator), a[href*="/appointment"]').count();
    expect(navigated || offers > 0, 'booking intent leads to booking or a follow-up choice').toBe(true);
    if (await dialog.isVisible()) {
      await dialog.getByRole('button', { name: 'Close' }).click();
      await expect(dialog).toHaveCount(0);
    }
  });
});
