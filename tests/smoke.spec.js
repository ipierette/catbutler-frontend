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
    
    // Verifica se pelo menos um dos elementos principais está presente
    const h1Element = page.locator('h1').first();
    await expect(h1Element).toBeVisible({ timeout: 10000 });
    
    const text = await h1Element.textContent();
    // Baseado no conteúdo real da página Home - procura por saudações ou "visitante"
    const expectedTexts = ['Bom dia', 'Boa tarde', 'Boa noite', 'visitante'];
    const hasExpectedText = expectedTexts.some(expectedText => 
      text?.toLowerCase().includes(expectedText.toLowerCase())
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
    
    // Verifica se a página carregou (pode ter qualquer elemento visível)
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible({ timeout: 10000 });
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
    
    // Baseado no conteúdo real da página Sobre
    // O nome "Izadora Pierette" aparece em um h3
    const nameElement = page.locator('h3:has-text("Izadora Pierette")');
    await expect(nameElement).toBeVisible({ timeout: 10000 });
    
    // Verificação alternativa se a primeira falhar
    const altNameElement = page.locator('text=Izadora Pierette');
    await expect(altNameElement.first()).toBeVisible({ timeout: 5000 });
  });
});
