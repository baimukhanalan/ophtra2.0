import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, gotoReady, scrollThrough, isMobile } from './support/fixtures';
import { STATIC_ROUTES } from './support/routes';

/**
 * 8. axe-core on every static route (desktop). Every violation is written to
 * results/axe/<route>.json for the report; the test fails on critical/serious.
 */

const OUT = path.resolve('results/axe');

for (const route of STATIC_ROUTES) {
  test(`axe ${route}`, async ({ page }) => {
    test.skip(isMobile(page), 'axe runs on desktop');
    await gotoReady(page, route);
    // Reveal everything so axe sees final colours/opacity, then return to top.
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
      summary: v.nodes[0]?.failureSummary?.split('\n').slice(0, 3).join(' '),
    }));
    mkdirSync(OUT, { recursive: true });
    writeFileSync(path.join(OUT, `${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}.json`), JSON.stringify(violations, null, 2));

    const severe = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(severe.map((v) => `${v.impact} ${v.id} ×${v.nodes}: ${v.targets.slice(0, 2).join(' | ')}`), 'critical/serious axe violations').toEqual([]);
  });
}
