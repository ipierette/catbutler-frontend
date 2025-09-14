const { expect, test } = require('@playwright/test');

// Testa se o menu navega corretamente entre as páginas principais
const menuLinks = [
  { text: 'Tarefas', url: '/tarefas' },
  { text: 'Cozinha', url: '/cozinha' },
  { text: 'Faxina', url: '/faxina' },
  { text: 'Mercado', url: '/mercado' },
  { text: 'Agenda', url: '/agenda' },
  { text: 'Assistente', url: '/assistente' },
  { text: 'Dicas', url: '/dicas' },
  { text: 'Histórico', url: '/historico' },
  { text: 'Sobre', url: '/sobre' },
  { text: 'Configurações', url: '/config' },
];

menuLinks.forEach(link => {
  test(`Menu navega para ${link.text}`, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Detectar se é mobile e abrir menu se necessário
    const isMobile = await page.evaluate(() => window.innerWidth < 1024);
    
    if (isMobile) {
      // Abrir menu mobile primeiro - seletor mais específico
      const menuButton = page.locator('button[aria-label*="menu"], button[title="Menu"], button.lg\\:hidden');
      if (await menuButton.count() > 0) {
        await menuButton.first().click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Tentar clicar no link
    const linkSelector = `a:has-text("${link.text}")`;
    await page.waitForSelector(linkSelector, { state: 'visible', timeout: 5000 });
    await page.click(linkSelector);
    
    await expect(page).toHaveURL(new RegExp(link.url.replace('/', '.*')));
  });
});
