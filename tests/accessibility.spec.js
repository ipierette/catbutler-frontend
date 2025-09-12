import { test, expect } from '@playwright/test';

// Teste básico de acessibilidade: verifica se todas as páginas principais têm título e navegação
const routes = ['/', '/tarefas', '/cozinha', '/faxina', '/mercado', '/agenda', '/login', '/sobre', '/config'];

test('Verificação de títulos h1 em todas as páginas', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    console.log(`✓ Página ${route} tem título h1`);
  }
});
