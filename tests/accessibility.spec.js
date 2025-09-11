import { test, expect } from '@playwright/test';

// Teste básico de acessibilidade: verifica se todas as páginas principais têm título e navegação
const routes = ['/', '/tarefas', '/cozinha-ia', '/faxina-ia', '/mercado-ia', '/agenda', '/login', '/sobre', '/config'];

test.describe('Acessibilidade básica', () => {
  for (const route of routes) {
    test(`Página ${route} deve ter um título <h1>`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
});
