import { test, expect } from '@playwright/test';

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

test('Navegação através do menu principal', async ({ page }) => {
  for (const link of menuLinks) {
    await page.goto('/');
    await page.click(`a:has-text("${link.text}")`);
    await expect(page).toHaveURL(new RegExp(link.url.replace('/', '.*')));
    console.log(`✓ Navegação para ${link.text} funcionou`);
  }
});
