const { expect, test } = require('@playwright/test');

const routes = ['/', '/tarefas', '/cozinha', '/faxina', '/mercado', '/agenda', '/login', '/sobre', '/config'];

routes.forEach(route => {
  test(`Página ${route} deve ter um título h1`, async ({ page }) => {
    await page.goto(route);
    const h1 = await page.locator('h1');
    await expect(h1).toBeVisible();
  });
});
