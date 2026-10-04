import type { Locator, Page } from '@playwright/test';
import { test, expect, gotoReady } from './support/fixtures';

/**
 * 5. Public interactive widgets: cost estimator, knowledge-base filters,
 * doctors / pricing / services / FAQ / publications filters, media tabs,
 * experts map, video facades.
 */

const NAN = /NaN|undefined|Infinity|null/;
const qp = (page: Page, key: string) => new URL(page.url()).searchParams.get(key);

test.describe('international cost estimator', () => {
  const total = (page: Page) => page.locator('.oph-pt-est__total');
  const usd = (page: Page) => page.locator('.oph-pt-est__usd');

  const expectChanged = async (page: Page, before: string, what: string) => {
    await expect.poll(async () => (await total(page).innerText()).trim(), { message: `total updates after ${what}` }).not.toBe(before);
    const now = (await total(page).innerText()).trim();
    expect(now, `${what}: total is a number`).not.toMatch(NAN);
    expect(now).toMatch(/\d/);
    expect((await usd(page).innerText()).trim()).not.toMatch(NAN);
    return now;
  };

  test('every control updates the total without NaN', async ({ page }) => {
    await gotoReady(page, '/international-patients');
    const section = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Get a feel for the budget' }) }).first();
    await section.scrollIntoViewIfNeeded();
    let current = (await total(page).innerText()).trim();
    expect(current).toMatch(/\d/);
    expect(current).not.toMatch(NAN);

    // Every service checkbox toggles the medical part.
    const boxes = section.getByRole('checkbox', { name: /₸/ });
    const n = await boxes.count();
    expect(n, 'services offered').toBeGreaterThan(2);
    for (let i = 0; i < n; i += 1) {
      const box = boxes.nth(i);
      const label = (await box.evaluate((el: HTMLInputElement) => el.labels?.[0]?.textContent ?? '')).trim();
      await box.click();
      current = await expectChanged(page, current, `toggling "${label}"`);
    }

    // Hotel and transfer choices (aria-pressed buttons).
    for (const name of ['Business', 'Premium', 'I’ll arrange it', 'Comfort', 'Airport + appointments', 'Not needed', 'Airport ⇄ hotel', 'Airport + appointments']) {
      const button = section.getByRole('button', { name, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      current = await expectChanged(page, current, `choosing "${name}"`);
    }

    // Sliders: keyboard steps and extremes.
    for (const name of ['Nights in Astana', 'Days with clinic visits']) {
      const slider = section.getByRole('slider', { name });
      await slider.focus();
      // Nights must move the budget; clinic days may only matter for some
      // transfer options, so for them only a sane number is required.
      const strict = name === 'Nights in Astana';
      for (const key of ['ArrowRight', 'End', 'Home', 'ArrowRight']) {
        const before = await slider.inputValue();
        await page.keyboard.press(key);
        // The days slider is clamped by nights + 1, so it may legitimately not move.
        if (strict && (await slider.inputValue()) !== before) current = await expectChanged(page, current, `${name} ${key}`);
        else {
          current = (await total(page).innerText()).trim();
          expect(current).not.toMatch(NAN);
        }
      }
    }

    await section.getByRole('checkbox', { name: 'Interpreter at appointments' }).click();
    await expectChanged(page, current, 'interpreter');
  });

  test('"Add this estimate to my request" carries the estimate into the form', async ({ page }) => {
    await gotoReady(page, '/international-patients');
    const totalText = (await total(page).innerText()).trim();
    const handoff = page.getByRole('button', { name: /Add this estimate to my request/ });
    test.skip((await handoff.count()) === 0, 'hand-off button not present in this build');
    await handoff.click();
    const form = page.locator('form.oph-leadform');
    await expect(form).toBeInViewport({ timeout: 5_000 });
    const values = await form.locator('textarea, input').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value).join(' | '));
    const digits = totalText.replace(/\D/g, '');
    expect(values.replace(/\D/g, ''), `form carries the estimate ${totalText}`).toContain(digits);
  });
});

test.describe('knowledge base', () => {
  const count = (page: Page) => page.locator('.oph-kb-search__count strong');
  const search = (page: Page) => page.getByRole('searchbox', { name: 'Search materials' });

  test('search, topic, tag and reset filter the list and persist in the URL', async ({ page }) => {
    await gotoReady(page, '/knowledge-base');
    const all = Number(await count(page).innerText());
    expect(all).toBeGreaterThan(5);

    await search(page).fill('glaucoma');
    await expect.poll(() => qp(page, 'q')).toBe('glaucoma');
    const afterSearch = Number(await count(page).innerText());
    expect(afterSearch).toBeGreaterThan(0);
    expect(afterSearch).toBeLessThan(all);

    await search(page).fill('zzzz-no-such-thing');
    await expect(count(page)).toHaveText('0');
    await expect(page.locator('main .oph-state, main [class*="empty"]').first(), 'an empty state is shown').toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).first().click();
    await expect(count(page)).toHaveText(String(all));
    await expect.poll(() => page.url()).not.toContain('?');
    await expect(search(page)).toHaveValue('');

    // Topic select.
    const topic = page.getByRole('combobox', { name: 'Topic' });
    const options = await topic.locator('option').evaluateAll((o) => o.map((x) => (x as HTMLOptionElement).value).filter(Boolean));
    expect(options.length).toBeGreaterThan(2);
    await topic.selectOption(options[0]);
    await expect.poll(() => qp(page, 'topic')).toBe(options[0]);
    expect(Number(await count(page).innerText())).toBeLessThan(all);

    // Tag chip on top of the topic.
    await page.getByRole('button', { name: 'Reset' }).first().click();
    const tag = page.getByRole('button', { name: /^#/ }).first();
    await tag.click();
    await expect(tag).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => qp(page, 'tag')).not.toBeNull();
    const tagCount = Number(await count(page).innerText());
    expect(tagCount).toBeGreaterThan(0);

    // URL state survives a reload-free deep link.
    const url = new URL(page.url());
    await gotoReady(page, `${url.pathname}${url.search}`);
    await expect(count(page)).toHaveText(String(tagCount));
    await expect(page.getByRole('button', { name: /^#/ }).and(page.locator('[aria-pressed=true]'))).toHaveCount(1);
  });

  test('unknown ?tag= / ?topic= in a shared link does not crash the page', async ({ page }) => {
    for (const q of ['tag=foo', 'topic=foo', 'tag=%22%3E%3Cimg%20src%3Dx%3E']) {
      await gotoReady(page, `/knowledge-base?${q}`);
      await expect(page.locator('main h1'), `?${q} renders the knowledge base`).toHaveText('Knowledge base');
      await expect(search(page)).toBeVisible();
    }
  });

  test('deep link ?q= prefills the search box', async ({ page }) => {
    await gotoReady(page, '/knowledge-base?q=cataract');
    await expect(search(page)).toHaveValue('cataract');
    expect(Number(await count(page).innerText())).toBeGreaterThan(0);
  });

  test('theme cards filter by topic; "All tags" and "Show more" expand', async ({ page }) => {
    await gotoReady(page, '/knowledge-base');
    await page.getByRole('button', { name: /^05 Glaucoma/ }).click();
    await expect.poll(() => qp(page, 'topic')).toBeTruthy();
    await expect(count(page)).toHaveText('2');

    await page.getByRole('button', { name: 'Reset' }).first().click();
    const tagsBefore = await page.getByRole('button', { name: /^#/ }).count();
    const allTags = page.getByRole('button', { name: /^All tags/ });
    if (await allTags.count()) {
      await allTags.click();
      expect(await page.getByRole('button', { name: /^#/ }).count()).toBeGreaterThan(tagsBefore);
    }
    const more = page.getByRole('button', { name: /^Show more/ });
    if (await more.count()) {
      const cards = page.locator('.oph-kb-search').locator('xpath=ancestor::section[1]').getByRole('heading', { level: 3 });
      const before = await cards.count();
      await more.click();
      await expect.poll(() => cards.count()).toBeGreaterThan(before);
    }
  });
});

test.describe('doctors directory', () => {
  const cards = (page: Page) => page.locator('main .ppl-dgrid a[href^="/doctors/"]');

  test('search and chips filter doctors; empty state resets', async ({ page }) => {
    await gotoReady(page, '/doctors');
    const all = await cards(page).count();
    expect(all).toBeGreaterThan(3);

    await page.getByRole('searchbox', { name: 'Search' }).fill('Kim');
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText('Kim');

    await page.getByRole('searchbox', { name: 'Search' }).fill('');
    await expect(cards(page)).toHaveCount(all);

    const chips = page.locator('main .oph-chips').first().getByRole('button');
    const chipCount = await chips.count();
    for (let i = 1; i < chipCount; i += 1) {
      await chips.nth(i).click();
      await expect(chips.nth(i)).toHaveAttribute('aria-pressed', 'true');
      const shown = await cards(page).count();
      expect(shown, `department chip ${await chips.nth(i).innerText()}`).toBeLessThanOrEqual(all);
    }
    await chips.nth(0).click();

    // Clinic chips exist only when there is more than one clinic.
    const clinicChips = page.locator('main .oph-chips').nth(1).getByRole('button');
    if ((await page.locator('main .oph-chips').count()) > 1) {
      await clinicChips.last().click();
      expect(await cards(page).count()).toBeLessThanOrEqual(all);
      await clinicChips.first().click();
    }

    await page.getByRole('searchbox', { name: 'Search' }).fill('qqqqqq');
    await expect(page.getByText('Nothing found')).toBeVisible();
    await page.getByRole('button', { name: 'Reset' }).last().click();
    await expect(cards(page)).toHaveCount(all);
  });

  test('doctor card opens the profile', async ({ page }) => {
    await gotoReady(page, '/doctors');
    const first = cards(page).first();
    const href = await first.getAttribute('href');
    await first.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator('main h1')).toBeVisible();
  });
});

test.describe('pricing', () => {
  test('search and department chips filter the price table', async ({ page }) => {
    await gotoReady(page, '/pricing');
    const rows = page.locator('.svc-pricetable tbody tr');
    const all = await rows.count();
    expect(all).toBeGreaterThan(10);
    await page.getByRole('searchbox', { name: 'Find a service' }).fill('laser');
    await expect.poll(() => rows.count()).toBeLessThan(all);
    expect(await rows.count()).toBeGreaterThan(0);
    for (const text of await rows.allInnerTexts()) expect(text).not.toMatch(NAN);
    await page.getByRole('searchbox', { name: 'Find a service' }).fill('');
    await expect(rows).toHaveCount(all);

    const chip = page.getByRole('button', { name: 'Cataract surgery department' });
    if (await chip.isVisible()) {
      // On phones the chip row scrolls horizontally (smooth + snap); bring the
      // chip in instantly so the click is not chasing a moving target.
      await chip.evaluate((el) => el.scrollIntoView({ inline: 'center', block: 'center', behavior: 'instant' }));
      await chip.click({ force: true });
      await expect.poll(() => rows.count()).toBeLessThan(all);
      await expect(page.locator('.svc-pricegroup__title')).toHaveText(['Cataract surgery department']);
    } else {
      const select = page.locator('main select').first();
      await select.selectOption({ label: 'Cataract surgery department' });
      await expect.poll(() => rows.count()).toBeLessThan(all);
    }
    await page.getByRole('searchbox', { name: 'Find a service' }).fill('zzzz');
    await expect(rows).toHaveCount(0);
  });
});

test.describe('services index', () => {
  test('department filter updates list and ?department=', async ({ page }) => {
    await gotoReady(page, '/services');
    const list = page.locator('main a[href^="/services/"]');
    const all = await list.count();
    await page.getByRole('button', { name: 'Laser correction department' }).click();
    await expect.poll(() => qp(page, 'department')).toBeTruthy();
    await expect.poll(() => list.count()).toBeLessThan(all);
    const dep = qp(page, 'department');
    await gotoReady(page, `/services?department=${dep}`);
    await expect(page.getByRole('button', { name: 'Laser correction department' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect.poll(() => qp(page, 'department')).toBeNull();
  });
});

test.describe('media centre', () => {
  test('tabs switch sections and persist in ?tab=', async ({ page }) => {
    await gotoReady(page, '/media-center');
    const tabbar = page.locator('.oph-kb-tabbar');
    const h2 = page.locator('main section h2:visible, main h2:visible');
    const allCount = await h2.count();
    for (const tab of ['News', 'Press releases', 'Interviews', 'Video', 'Podcasts', 'Events']) {
      const button = tabbar.getByRole('button', { name: tab, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => qp(page, 'tab'), { message: `?tab= set for ${tab}` }).toBeTruthy();
      await expect.poll(() => h2.count(), { message: `${tab} shows fewer sections than All` }).toBeLessThan(allCount);
    }
    await gotoReady(page, '/media-center?tab=podcasts');
    await expect(page.locator('.oph-kb-tabbar').getByRole('button', { name: 'Podcasts', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await gotoReady(page, '/media-center?tab=bogus');
    await expect(page.locator('.oph-kb-tabbar').getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('FAQ', () => {
  test('search, category chips and accordion', async ({ page }) => {
    await gotoReady(page, '/faq');
    const questions = page.locator('main .oph-accordion button[aria-expanded]');
    const all = await questions.count();
    expect(all).toBeGreaterThan(5);

    const q = questions.first();
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    const panelId = await q.getAttribute('aria-controls');
    if (panelId) await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'false');

    await page.getByRole('searchbox', { name: 'Find a question' }).fill('laser');
    await expect.poll(() => questions.count()).toBeLessThan(all);
    expect(await questions.count()).toBeGreaterThan(0);
    await page.getByRole('searchbox', { name: 'Find a question' }).fill('');
    await expect(questions).toHaveCount(all);

    await page.getByRole('button', { name: 'Payments', exact: true }).click();
    await expect.poll(() => questions.count()).toBeLessThan(all);
    await page.getByRole('searchbox', { name: 'Find a question' }).fill('zzzz');
    await expect(page.getByText(/Nothing found/).first()).toBeVisible();
  });
});

test.describe('founder publications', () => {
  test('search, type and topic chips filter publications', async ({ page }) => {
    await gotoReady(page, '/dr-kulmaganbetov');
    const pubs = page.locator('.ppl-publist .ppl-pub');
    await page.getByRole('searchbox', { name: 'Search publications' }).scrollIntoViewIfNeeded();
    const all = await pubs.count();
    expect(all).toBeGreaterThan(1);

    const kind = page.locator('[aria-labelledby="pub-kind-label"]');
    await kind.getByRole('button', { name: 'Paper' }).click();
    await expect(kind.getByRole('button', { name: 'Paper' })).toHaveAttribute('aria-pressed', 'true');
    const papers = await pubs.count();
    await kind.getByRole('button', { name: 'Media' }).click();
    const media = await pubs.count();
    expect(papers + media, 'Paper + Media partition the list').toBe(all);
    await kind.getByRole('button', { name: 'All' }).click();

    const topic = page.locator('[aria-labelledby="pub-topic-label"]');
    const topicButtons = topic.getByRole('button');
    for (let i = 1; i < (await topicButtons.count()); i += 1) {
      await topicButtons.nth(i).click();
      expect(await pubs.count()).toBeLessThanOrEqual(all);
    }
    await topicButtons.nth(0).click();

    await page.getByRole('searchbox', { name: 'Search publications' }).fill('Alzheimer');
    await expect(pubs).toHaveCount(1);
    await page.getByRole('searchbox', { name: 'Search publications' }).fill('zzzz');
    await expect(pubs).toHaveCount(0);
  });
});

test.describe('global experts map', () => {
  test('region buttons filter the expert profiles', async ({ page }) => {
    await gotoReady(page, '/global-experts');
    const experts = page.locator('.ppl-expert');
    await experts.first().scrollIntoViewIfNeeded();
    const all = await experts.count();
    expect(all).toBeGreaterThan(3);
    const regions = (await page.getByRole('button', { name: /^.+ \d+$/ }).allInnerTexts())
      .map((t) => t.replace(/\s*\d+$/, '').trim())
      .filter((t) => !/^All regions/.test(t));
    expect(regions.length).toBeGreaterThan(1);
    let sum = 0;
    for (const region of regions) {
      const button = page.getByRole('button', { name: new RegExp(`^${region} \\d+$`) });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await page.waitForTimeout(300);
      const n = await experts.count();
      expect(n, `${region} shows a subset`).toBeLessThanOrEqual(all);
      sum += n;
    }
    expect(sum, 'regions partition all experts').toBe(all);
    await page.getByRole('button', { name: /^All regions \d+$/ }).click();
    await expect(experts).toHaveCount(all);
  });
});

test.describe('video facades', () => {
  for (const path of ['/media-center', '/dr-kulmaganbetov']) {
    test(`click loads the YouTube iframe on ${path}`, async ({ page }) => {
      await gotoReady(page, path);
      await expect(page.locator('iframe'), 'no third-party iframe before play').toHaveCount(0);
      const play = page.getByRole('button', { name: /^Play video/ }).first();
      await play.scrollIntoViewIfNeeded();
      await play.click();
      const frame = page.locator('iframe[src*="youtube"]');
      await expect(frame).toHaveCount(1);
      await expect(frame).toHaveAttribute('src', /youtube(-nocookie)?\.com\/embed\/YOJAdl__43Q/);
      await expect(frame).toHaveAttribute('title', /.+/);
    });
  }
});

test.describe('accordions on content pages', () => {
  test('international FAQ accordion toggles', async ({ page }) => {
    await gotoReady(page, '/international-patients');
    const q = page.getByRole('button', { name: 'How do I pay for treatment?' });
    await q.scrollIntoViewIfNeeded();
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'false');
  });
});

export type { Locator };
