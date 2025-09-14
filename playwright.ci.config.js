import { defineConfig, devices } from '@playwright/test';

const { CI } = process.env;

/**
 * Configuração rigorosa para CI/CD - Testes de qualidade máxima
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: [
    '**/quality-assurance.spec.js',
    '**/integration.spec.js', 
    '**/performance.spec.js',
    '**/accessibility-wcag.spec.js'
  ], // Apenas testes rigorosos de alta qualidade
  /* Run tests in files in parallel */
  fullyParallel: false, // Desabilita paralelismo para testes rigorosos
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: 2, // Permite retries para testes rigorosos
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'], 
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }]
  ],
  timeout: 90000, // Timeout maior para testes rigorosos
  expect: {
    timeout: 20000, // Timeout maior para expects complexos
  },
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5174',
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Timeouts otimizados para testes rigorosos */
    navigationTimeout: 45000,
    actionTimeout: 20000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Configurações específicas para testes rigorosos
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Desktop Firefox', 
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  /* Start dev server before running tests */
  webServer: {
    command: 'vite preview --port=5174',
    port: 5174,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});