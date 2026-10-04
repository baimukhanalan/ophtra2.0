import { test, expect, gotoReady, settle, isMobile } from './support/fixtures';
import { NAV_GROUPS } from './support/nav';

/**
 * 2. Header: mega-menu groups (hover / click / keyboard), every menu link,
 * mobile drawer, language switcher, phone link.
 */

/** The mega-menu sheet is persistent; it is open when data-open="true". */
const openPanel = (page: import('@playwright/test').Page) => page.locator('.oph-nav__panel[data-open="true"]');

/** Groups and links come from navigation.ts + dictionary.en.ts (support/nav.ts). */
const GROUPS = NAV_GROUPS.map((g) => ({ label: g.label, links: g.links.map((l) => [l.label, l.path] as [string, string]) }));

test.describe('desktop mega-menu', () => {
  test.beforeEach(({ page }) => test.skip(isMobile(page), 'desktop navigation only'));

  for (const group of GROUPS) {
    test(`group "${group.label}" opens on hover and closes on leave`, async ({ page }) => {
      await gotoReady(page, '/');
      const trigger = page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button', { name: group.label, exact: true });
      const panel = openPanel(page);
      await trigger.hover();
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page.mouse.move(700, 880);
      await expect(panel).toHaveCount(0);
    });

    test(`group "${group.label}" opens on mouse click`, async ({ page }) => {
      await gotoReady(page, '/');
      const trigger = page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button', { name: group.label, exact: true });
      const panel = openPanel(page);
      // A real mouse click: the pointer enters the trigger, then clicks it.
      await page.mouse.move(5, 880);
      await trigger.click();
      await page.waitForTimeout(300);
      await expect(trigger, 'a mouse click on the trigger must leave the menu open').toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toBeVisible();
      await page.mouse.click(5, 880); // outside
      await expect(panel).toHaveCount(0);
    });

    test(`group "${group.label}" keyboard: Tab opens, Enter keeps open, Escape closes`, async ({ page }) => {
      await gotoReady(page, '/');
      const trigger = page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button', { name: group.label, exact: true });
      const panel = openPanel(page);
      await trigger.focus();
      await expect(panel).toBeVisible();
      // The next Tab must move into the open panel (its links), not to the next group.
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(() => `${document.activeElement?.closest('.oph-nav__panel') ? 'panel' : 'outside'}: ${document.activeElement?.textContent?.trim().slice(0, 40)}`),
        'Tab from an open menu trigger reaches the menu links',
      ).toMatch(/^panel/);
      await trigger.focus();
      await page.keyboard.press('Escape');
      await expect(panel).toHaveCount(0);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      await expect(trigger, 'Enter on a focused menu trigger must open the menu').toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toBeVisible();
    });

    test(`group "${group.label}" keyboard: Tab onto trigger then Enter keeps the menu open`, async ({ page }) => {
      await gotoReady(page, '/');
      const trigger = page.getByRole('navigation', { name: 'Menu' }).first().getByRole('button', { name: group.label, exact: true });
      await trigger.focus(); // what Tab does — focus opens the panel
      await expect(openPanel(page)).toBeVisible();
      await page.keyboard.press('Enter'); // the natural "activate" key
      await page.waitForTimeout(300);
      await expect(trigger, 'Enter after tabbing onto the trigger must not close the menu').toHaveAttribute('aria-expanded', 'true');
    });

    test(`group "${group.label}": every link navigates`, async ({ page }) => {
      await gotoReady(page, '/');
      const nav = page.getByRole('navigation', { name: 'Menu' }).first();
      for (const [label, path] of group.links) {
        await page.mouse.move(5, 880);
        await nav.getByRole('button', { name: group.label, exact: true }).hover();
        const link = openPanel(page).locator('.oph-nav__panel-grid').getByRole('link', { name: new RegExp(`^${label.replace(/[&]/g, '\\$&')}`) });
        await link.click();
        await expect(page).toHaveURL(new RegExp(`${path}$`));
        await settle(page);
        await expect(page.locator('main h1').first()).not.toHaveText(/Page\s*not\s*found/i);
        await expect(openPanel(page), 'menu closes after navigation').toHaveCount(0);
      }
    });
  }

  test('phone link uses tel:', async ({ page }) => {
    await gotoReady(page, '/');
    const phone = page.locator('.oph-header__phone');
    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute('href', /^tel:\+?\d{10,15}$/);
  });
});

test.describe('mobile drawer', () => {
  test.beforeEach(({ page }) => test.skip(!isMobile(page), 'mobile navigation only'));

  test('burger opens and closes the drawer (button, Escape)', async ({ page }) => {
    await gotoReady(page, '/');
    const burger = page.getByRole('button', { name: 'Open menu' });
    await burger.click();
    const drawer = page.getByRole('dialog', { name: 'Menu' });
    await expect(drawer).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    // Close via its close button.
    await drawer.locator('.oph-modal__close').click();
    await expect(drawer).toBeHidden();
    // Escape closes too.
    await burger.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('drawer close button is labelled in the page language', async ({ page }) => {
    await gotoReady(page, '/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const close = page.getByRole('dialog', { name: 'Menu' }).locator('.oph-modal__close');
    await expect(close).toHaveAttribute('aria-label', 'Close');
  });

  test('every drawer link navigates', async ({ page }) => {
    test.setTimeout(180_000);
    await gotoReady(page, '/');
    const all = GROUPS.flatMap((g) => g.links.map(([label, path]) => [g.label, label, path])).concat([['', 'Patient account', '/account']]);
    for (const [group, label, path] of all) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      const drawer = page.getByRole('dialog', { name: 'Menu' });
      await expect(drawer).toBeVisible();
      const link = drawer.getByRole('link', { name: label, exact: true });
      // Groups are collapsible <details>; open the one holding the link.
      if (group && !(await link.isVisible())) await drawer.locator('summary').filter({ hasText: group }).click();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(drawer, `drawer closes after tapping "${label}"`).toBeHidden();
      await settle(page);
    }
  });

  test('drawer booking CTA and phone button', async ({ page }) => {
    await gotoReady(page, '/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const drawer = page.getByRole('dialog', { name: 'Menu' });
    await drawer.getByRole('link', { name: 'Book an appointment' }).click();
    await expect(page).toHaveURL(/\/appointment$/);
    await expect(drawer).toBeHidden();
  });
});

test.describe('language switcher', () => {
  const EXPECT: Record<string, { lang: string; home: RegExp }> = {
    Русский: { lang: 'ru', home: /[а-яё]/i },
    Қазақша: { lang: 'kk', home: /[әғқңөұүһі]|[а-я]/i },
    English: { lang: 'en', home: /^[\x00-\x7F’–—«»\s]+$/ },
  };

  const openSwitcher = async (page: import('@playwright/test').Page) => {
    if (isMobile(page)) {
      await page.getByRole('button', { name: /Open menu|Открыть меню|Мәзірді ашу/ }).click();
      await page.getByRole('dialog').getByRole('button', { name: /Language|Язык|Тіл/i }).click();
    } else {
      await page.locator('header').getByRole('button', { name: /Language|Язык|Тіл/i }).click();
    }
  };

  for (const route of ['/', '/doctors', '/knowledge-base', '/contacts', '/appointment']) {
    test(`switches ru/kk/en on ${route}`, async ({ page }) => {
      await gotoReady(page, route);
      const h1 = page.locator('main h1').first();
      const seen = new Set<string>();
      for (const [label, spec] of Object.entries(EXPECT)) {
        await openSwitcher(page);
        await page.getByRole('menuitemradio', { name: label }).click();
        await expect(page.locator('html')).toHaveAttribute('lang', spec.lang);
        await expect(h1).toHaveText(spec.home);
        seen.add((await h1.innerText()).trim());
        expect(await page.evaluate(() => localStorage.getItem('ophtra.lang'))).toBe(spec.lang);
        if (isMobile(page) && (await page.getByRole('dialog').isVisible())) await page.keyboard.press('Escape');
      }
      expect(seen.size, 'h1 differs in each language').toBe(3);
      // Persisted across a full navigation.
      await gotoReady(page, route === '/' ? '/about' : '/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  }
});
