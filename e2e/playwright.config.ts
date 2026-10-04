import { defineConfig, devices } from '@playwright/test';

/**
 * E2E against the production preview (vite preview on :4173).
 * The API backend is intentionally NOT running: the suite checks the
 * graceful-degradation paths (outbox, demo modes).
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './results/artifacts',
  globalSetup: './tests/support/global-setup.ts',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: Number(process.env.WORKERS ?? 4),
  // One retry: the preview server is occasionally rebuilt mid-run. A test that
  // only passes on retry is reported as flaky, never as a site defect.
  retries: Number(process.env.RETRIES ?? 1),
  reporter: [['list'], ['json', { outputFile: 'results/report.json' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4173',
    channel: 'chrome',
    trace: 'retain-on-failure',
    // Built-in failure screenshots hang on this site (~75 s); the page fixture
    // takes its own bounded screenshot instead (tests/support/fixtures.ts).
    screenshot: 'off',
    acceptDownloads: true,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
});
