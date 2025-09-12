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
    await page.click(`a:has-text("${link.text}")`);
    await expect(page).toHaveURL(new RegExp(link.url.replace('/', '.*')));
  });
});
