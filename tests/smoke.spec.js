import { test, expect } from '@playwright/test';

// Testa se a home carrega e tem o título correto
// Adapte o seletor/título conforme seu site

test('Home page deve carregar e exibir título', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(['CatButler', 'Tarefas', 'Assistente', 'Agenda']);
});

test('Menu navega para página Tarefas', async ({ page }) => {
  await page.goto('/');
  await page.click('a:has-text("Tarefas")');
  await expect(page).toHaveURL(/.*tarefas/);
  await expect(page.locator('h1')).toContainText(['Tarefas']);
});

test('Página de Login exibe formulário', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('Página Sobre exibe nome da desenvolvedora', async ({ page }) => {
  await page.goto('/sobre');
  await expect(page.locator('h3')).toContainText(['Izadora Pierette']);
});
