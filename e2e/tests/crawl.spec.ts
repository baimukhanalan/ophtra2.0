import { test, expect, gotoReady, scrollThrough } from './support/fixtures';
import { ALL_ROUTES, isKnownRoute } from './support/routes';

/**
 * 1. Route crawl — every static and dynamic route on desktop and mobile.
 * Each check is a soft assertion so one run reports every problem on a page.
 */

for (const route of ALL_ROUTES) {
  test(`crawl ${route}`, async ({ page, diag, baseURL, request }) => {
    const response = await gotoReady(page, route);
    expect.soft(response?.status(), 'HTTP status').toBe(200);
    expect.soft(new URL(page.url()).pathname, 'direct deep link must stay on its URL').toBe(route);

    await scrollThrough(page);

    const facts = await page.evaluate(() => {
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          JSON.parse(s.textContent ?? '');
          return null;
        } catch (error) {
          return String(error).slice(0, 200);
        }
      });
      const brokenImgs = [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src))
        .map((img) => img.currentSrc || img.src);
      const el = document.scrollingElement!;
      const width = document.documentElement.clientWidth;
      const offenders =
        el.scrollWidth > width + 1
          ? [...document.querySelectorAll('body *')]
              .filter((n) => {
                const r = n.getBoundingClientRect();
                return r.right > width + 1 && r.width > 0 && getComputedStyle(n).position !== 'fixed';
              })
              .slice(0, 5)
              .map((n) => `${n.tagName.toLowerCase()}.${String((n as HTMLElement).className).split(' ')[0]} right=${Math.round(n.getBoundingClientRect().right)}`)
          : [];
      return {
        h1: document.querySelectorAll('h1').length,
        h1Text: document.querySelector('h1')?.textContent ?? '',
        title: document.title.trim(),
        description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '',
        ldCount: ld.length,
        ldErrors: ld.filter(Boolean),
        brokenImgs,
        scrollWidth: el.scrollWidth,
        innerWidth: window.innerWidth,
        clientWidth: width,
        offenders,
        links: [...document.querySelectorAll('a[href]')].map((a) => (a as HTMLAnchorElement).href),
      };
    });

    expect.soft(facts.h1Text, 'not the 404 page').not.toMatch(/Page\s*not\s*found|Страница\s*не\s*найдена/i);
    expect.soft(facts.h1, 'exactly one <h1>').toBe(1);
    expect.soft(facts.title, '<title> not empty').not.toBe('');
    expect.soft(facts.description, 'meta description not empty').not.toBe('');
    expect.soft(facts.ldCount, 'at least one JSON-LD block').toBeGreaterThan(0);
    expect.soft(facts.ldErrors, 'JSON-LD parses').toEqual([]);
    expect
      .soft(facts.scrollWidth, `no horizontal overflow (clientWidth ${facts.clientWidth}); offenders: ${facts.offenders.join(', ')}`)
      .toBeLessThanOrEqual(facts.clientWidth + 1);
    expect.soft(facts.brokenImgs, 'images decoded (naturalWidth > 0)').toEqual([]);
    expect.soft(diag.badImages, 'image requests succeed').toEqual([]);

    // Internal links resolve to a known route; linked files exist.
    const origin = new URL(baseURL!).origin;
    const unknown = new Set<string>();
    const files = new Set<string>();
    for (const href of facts.links) {
      const url = new URL(href);
      if (url.origin !== origin) continue;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) files.add(url.pathname);
      else if (!isKnownRoute(url.pathname)) unknown.add(url.pathname);
    }
    expect.soft([...unknown], 'internal links that hit the 404 route').toEqual([]);
    for (const file of files) {
      const res = await request.get(file);
      const type = res.headers()['content-type'] ?? '';
      expect.soft(res.ok() && !type.includes('text/html'), `linked file ${file} exists (got ${res.status()} ${type})`).toBe(true);
    }

    expect.soft(diag.consoleErrors, 'console errors (excluding absent-API 500s)').toEqual([]);
  });
}
