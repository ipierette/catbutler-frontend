import { defineConfig, devices } from '@playwright/test';

const { CI } = process.env;

/**
 * Configuração específica para CI/CD
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  /* Run tests in files in parallel */
  fullyParallel: false, // Desabilita paralelismo total no CI
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5174',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Aumenta o timeout para navegação */
    navigationTimeout: 30000,
    /* Timeout para ações */
    actionTimeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    // Executa apenas Chrome no CI para ser mais rápido
  ],

  /* Start dev server before running tests */
  webServer: {
    command: 'vite preview --port=5174',
    port: 5174,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});