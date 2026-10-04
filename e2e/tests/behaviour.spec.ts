import { test, expect, gotoReady, scrollThrough, waitForReveal, PRELOADER, settle } from './support/fixtures';

/**
 * 6. Behaviour: logo reveal, reload → home, deep links, history, 404, long
 * scrolls, pinned sections.
 */

test('logo reveal shows on first load and is removed within 4.5 s', async ({ page }) => {
  const started = Date.now();
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator(PRELOADER)).toBeAttached();
  await expect(page.locator('html')).toHaveAttribute('data-loading', 'true');
  await waitForReveal(page);
  const took = Date.now() - started;
  expect(took, 'reveal lifted within the ceiling (+1.4 s exit)').toBeLessThan(4_500 + 1_400 + 1_500);
  await expect(page.locator('main h1')).toBeVisible();
});

test('logo reveal shows again on reload', async ({ page }) => {
  await gotoReady(page, '/');
  await page.reload({ waitUntil: 'commit' });
  await expect(page.locator(PRELOADER)).toBeAttached();
  await waitForReveal(page);
});

test('hard reload on /science lands on "/" at the top', async ({ page }) => {
  await gotoReady(page, '/science');
  await page.mouse.wheel(0, 2500);
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(500);
  await page.reload();
  await waitForReveal(page);
  expect(new URL(page.url()).pathname).toBe('/');
  await expect(page.locator('main h1')).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

for (const deep of ['/science', '/doctors/viktor-kim', '/knowledge-base/keratoconus-explained', '/appointment?service=oct']) {
  test(`direct deep link ${deep} stays on its URL`, async ({ page }) => {
    await gotoReady(page, deep);
    const url = new URL(page.url());
    expect(url.pathname + url.search).toBe(deep);
    await expect(page.locator('main h1')).not.toHaveText(/Page\s*not\s*found/);
  });
}

test('browser back/forward across client-side navigation', async ({ page }) => {
  await gotoReady(page, '/');
  const go = async (path: string) => {
    await page.locator(`a[href="${path}"]`).first().evaluate((a: HTMLAnchorElement) => a.click());
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await settle(page);
  };
  await go('/appointment');
  await gotoReady(page, '/doctors'); // hard nav adds a history entry too
  await go('/doctors/' + (await page.locator('main a[href^="/doctors/"]').first().getAttribute('href'))!.split('/').pop());
  const doctorUrl = page.url();
  await page.goBack();
  await expect(page).toHaveURL(/\/doctors$/);
  await settle(page);
  await expect(page.locator('main h1')).toHaveText(/Doctors/);
  await page.goForward();
  await expect(page).toHaveURL(doctorUrl);
  await settle(page);
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL(/\/appointment$/);
});

test('scroll position resets to the top on client-side navigation', async ({ page }) => {
  await gotoReady(page, '/about');
  await page.evaluate(() => window.scrollTo(0, document.scrollingElement!.scrollHeight));
  await page.waitForTimeout(500);
  await page.locator('footer a[href="/contacts"]').first().evaluate((a: HTMLAnchorElement) => a.click());
  await expect(page).toHaveURL(/\/contacts$/);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4_000 }).toBeLessThan(5);
});

for (const bad of ['/this-does-not-exist', '/doctors/nobody', '/services/nope', '/knowledge-base/nope', '/news/nope', '/authors/nope']) {
  test(`unknown route ${bad} renders the 404 page`, async ({ page }) => {
    await page.goto(bad);
    await waitForReveal(page);
    await expect(page.locator('main h1')).toHaveText(/not\s*found/i, { timeout: 15_000 });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('main a[href="/"]').filter({ visible: true }).first(), '404 offers a way home').toBeVisible();
  });
}

test('legacy /articles/:slug redirects into the knowledge base', async ({ page }) => {
  await gotoReady(page, '/articles/contact-lens-care');
  await expect(page).toHaveURL(/\/knowledge-base\/contact-lens-care$/);
  await gotoReady(page, '/articles');
  await expect(page).toHaveURL(/\/knowledge-base$/);
});

for (const path of ['/', '/dr-kulmaganbetov', '/international-patients', '/about', '/science', '/global-experts']) {
  test(`long page ${path}: scroll to bottom and back without errors or scroll traps`, async ({ page, diag }) => {
    await gotoReady(page, path);
    await scrollThrough(page, 150);
    const atBottom = await page.evaluate(() => {
      const el = document.scrollingElement!;
      return el.scrollTop + window.innerHeight >= el.scrollHeight - 4;
    });
    expect(atBottom, 'reached the bottom (no pinned section traps scrolling)').toBe(true);
    await expect(page.locator('footer')).toBeInViewport();

    // Wheel scrolling upward is not hijacked either.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(400, 400);
    for (let i = 0; i < 6; i += 1) await page.mouse.wheel(0, -600);
    await page.waitForTimeout(800);
    const after = await page.evaluate(() => window.scrollY);
    expect(after, 'wheel up moves the page up').toBeLessThan(before);

    // Revealed content is actually shown after passing it.
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-visible="false"]')].filter((n) => n.getBoundingClientRect().bottom < 0).length,
    );
    expect(hidden, 'reveal blocks above the viewport are visible').toBe(0);
    expect(diag.consoleErrors).toEqual([]);
  });
}

test('header hides on scroll down and returns on scroll up', async ({ page }, info) => {
  // On touch devices the header stays put by design (a hiding header made
  // sticky blocks jump); the behaviour applies to mouse devices only.
  test.skip(info.project.name === 'mobile', 'header is fixed on touch devices');
  await gotoReady(page, '/about');
  await page.mouse.move(400, 500);
  for (let i = 0; i < 5; i += 1) await page.mouse.wheel(0, 400);
  await expect(page.locator('.oph-header')).toHaveAttribute('data-hidden', 'true');
  for (let i = 0; i < 2; i += 1) await page.mouse.wheel(0, -300);
  await expect(page.locator('.oph-header')).toHaveAttribute('data-hidden', 'false');
});

test('skip link moves focus to main content', async ({ page }) => {
  await gotoReady(page, '/about');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)).toMatch(/main/i);
});
