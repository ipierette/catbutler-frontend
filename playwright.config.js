import { defineConfig, devices } from '@playwright/test';

const { CI } = process.env;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
import { defineConfig, devices } from '@playwright/test';

const { CI } = process.env;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: CI ? [['html'], ['json', { outputFile: 'playwright-report/results.json' }]] : 'html',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    
    /* Mobile devices */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Start dev server before running tests */
  webServer: {
    command: CI ? 'npm run preview' : 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !CI,
    timeout: 120 * 1000,
  },
});
});
