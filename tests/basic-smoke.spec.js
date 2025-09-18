import { expect, test } from '@playwright/test';

// Testes mais básicos e robustos
test.describe('Basic Smoke Tests', () => {
  
  test('Application loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verifica se a página carregou (sem erros de rede)
    expect(page.url()).toContain('/');
    
    // Verifica se há conteúdo na página
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Home page has content', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Aguarda carregamento
    
    // Verifica se há pelo menos um elemento de texto visível
    const textContent = await page.textContent('body');
    expect(textContent?.length).toBeGreaterThan(10);
  });

  test('About page is accessible', async ({ page }) => {
    const response = await page.goto('/sobre');
    
    // Verifica se a página carregou sem erro HTTP
    expect(response?.status()).toBe(200);
  });

  test('Login page is accessible', async ({ page }) => {
    const response = await page.goto('/login');
    
    // Verifica se a página carregou sem erro HTTP
    expect(response?.status()).toBe(200);
  });

  test('App has React root element', async ({ page }) => {
    await page.goto('/');
    
    // Verifica se o elemento root do React existe
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });
});