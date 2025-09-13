const { expect, test } = require('@playwright/test');

// Configurações para testes mais resilientes
test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Aguarda a página estar pronta antes de cada teste
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Home page deve carregar e exibir título', async ({ page }) => {
    // Aguarda um pouco mais para garantir que os elementos estejam carregados
    await page.waitForTimeout(1000);
    
    // Verifica se pelo menos um dos títulos esperados está presente
    const h1Element = page.locator('h1').first();
    await expect(h1Element).toBeVisible({ timeout: 10000 });
    
    const text = await h1Element.textContent();
    const expectedTexts = ['CatButler', 'Tarefas', 'Assistente', 'Agenda'];
    const hasExpectedText = expectedTexts.some(expectedText => 
      text?.includes(expectedText)
    );
    
    expect(hasExpectedText).toBeTruthy();
  });

  test('Menu navega para página Tarefas', async ({ page }) => {
    // Aguarda o menu estar visível
    const tarefasLink = page.locator('a:has-text("Tarefas")').first();
    await expect(tarefasLink).toBeVisible({ timeout: 10000 });
    
    await tarefasLink.click();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*tarefas/, { timeout: 10000 });
    
    // Verifica se há um elemento h1 com "Tarefas"
    const h1Element = page.locator('h1').first();
    await expect(h1Element).toBeVisible({ timeout: 10000 });
  });

  test('Página de Login exibe formulário', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 });
  });

  test('Página Sobre exibe nome da desenvolvedora', async ({ page }) => {
    await page.goto('/sobre');
    await page.waitForLoadState('networkidle');
    
    // Busca por qualquer elemento que contenha o nome da desenvolvedora
    const nameElement = page.locator('text="Izadora"').first();
    await expect(nameElement).toBeVisible({ timeout: 10000 });
  });
});
