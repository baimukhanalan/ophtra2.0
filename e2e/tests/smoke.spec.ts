import { test, expect } from '@playwright/test';
test('home loads after logo reveal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#oph-preloader')).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator('h1')).toBeVisible();
});
