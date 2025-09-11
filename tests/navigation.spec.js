import { test, expect } from '@playwright/test';

// Testa se o menu navega corretamente entre as páginas principais
const menuLinks = [
  { text: 'Tarefas', url: '/tarefas' },
  { text: 'Cozinha IA', url: '/cozinha-ia' },
  { text: 'Faxina IA', url: '/faxina-ia' },
  { text: 'Mercado IA', url: '/mercado-ia' },
  { text: 'Agenda', url: '/agenda' },
  { text: 'Assistente', url: '/assistente' },
  { text: 'Dicas', url: '/dicas' },
  { text: 'Histórico', url: '/historico' },
  { text: 'Sobre', url: '/sobre' },
  { text: 'Configurações', url: '/config' },
];

test.describe('Navegação principal', () => {
  for (const link of menuLinks) {
    test(`Menu navega para ${link.text}`, async ({ page }) => {
      await page.goto('/');
      await page.click(`a:has-text(\"${link.text}\")`);
      await expect(page).toHaveURL(new RegExp(link.url.replace('/', '.*')));
    });
  }
});
