import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração mínima para CI/CD - apenas testes críticos
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/basic-smoke.spec.js'],
  fullyParallel: false,
  forbidOnly: true,
  retries: 0, // Sem retries para ser mais rápido
  workers: 1,
  reporter: 'html',
  timeout: 15000, // Timeout bem menor
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'off', // Desabilita trace para performance
    screenshot: 'off', // Desabilita screenshots para performance
    video: 'off', // Desabilita vídeo para performance
    navigationTimeout: 10000,
    actionTimeout: 5000,
  },
  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'vite preview --port=5174',
    port: 5174,
    reuseExistingServer: true,
    timeout: 30000,
  },
});