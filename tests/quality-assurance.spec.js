const { expect, test } = require('@playwright/test');

// Testes rigorosos de qualidade máxima
test.describe('Quality Assurance Tests - Maximum Coverage', () => {
  
  test.describe('Core Functionality', () => {
    test('Application loads with correct metadata and SEO', async ({ page }) => {
      await page.goto('/');
      
      // Verifica título e meta tags essenciais
      await expect(page).toHaveTitle(/CatButler/);
      
      // Verifica meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.*organize.*casa.*IA.*/i);
      
      // Verifica viewport
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveAttribute('content', /width=device-width/);
      
      // Verifica charset
      const charset = page.locator('meta[charset]');
      await expect(charset).toHaveAttribute('charset', 'UTF-8');
    });

    test('Navigation menu is complete and functional', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Lista de todas as páginas principais que devem existir
      const expectedRoutes = ['tarefas', 'agenda', 'cozinha', 'mercado', 'faxina', 'sobre', 'login'];
      
      for (const route of expectedRoutes) {
        const link = page.locator(`a[href*="${route}"], a:has-text("${route}")`, { timeout: 5000 }).first();
        await expect(link).toBeVisible({ timeout: 10000 });
        
        // Testa navegação
        await link.click();
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await expect(page).toHaveURL(new RegExp(route, 'i'), { timeout: 10000 });
        
        // Verifica se a página carregou conteúdo
        await expect(page.locator('body')).not.toBeEmpty();
        
        // Volta para home
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    });

    test('All main pages load without errors', async ({ page }) => {
      const routes = ['/', '/tarefas', '/agenda', '/cozinha', '/mercado', '/faxina', '/assistente', '/sobre', '/login'];
      
      for (const route of routes) {
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        
        // Verifica se não há erros JavaScript
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        
        await page.waitForLoadState('domcontentloaded');
        expect(errors.length).toBe(0);
      }
    });
  });

  test.describe('User Interface Quality', () => {
    test('Dark/Light theme functionality works', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Procura pelo botão de tema
      const themeButton = page.locator('button[aria-label*="tema"], button[title*="tema"], [data-testid="theme-toggle"], .theme-toggle').first();
      
      if (await themeButton.count() > 0) {
        // Testa alternância de tema
        await themeButton.click();
        await page.waitForTimeout(500);
        
        // Verifica mudança visual (classe dark ou atributo data-theme)
        const body = page.locator('body');
        const html = page.locator('html');
        
        const hasDarkClass = await body.getAttribute('class').then(classes => 
          classes?.includes('dark') || false
        ).catch(() => false);
        
        const hasDataTheme = await html.getAttribute('data-theme').then(theme => 
          theme === 'dark'
        ).catch(() => false);
        
        expect(hasDarkClass || hasDataTheme).toBeTruthy();
      }
    });

    test('Responsive design works on mobile viewport', async ({ page }) => {
      // Testa viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verifica se o conteúdo não extrapola
      const body = page.locator('body');
      const bodyWidth = await body.boundingBox();
      expect(bodyWidth?.width).toBeLessThanOrEqual(375);
      
      // Verifica se elementos essenciais estão visíveis
      await expect(page.locator('h1').first()).toBeVisible();
      
      // Testa viewport tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      await expect(page.locator('h1').first()).toBeVisible();
      
      // Volta para desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Loading states and interactions work properly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Testa clique em botões que podem ter loading
      const buttons = page.locator('button:not([disabled])');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        await firstButton.click();
        await page.waitForTimeout(1000);
        
        // Verifica se houve alguma reação visual
        const isVisible = await firstButton.isVisible();
        expect(isVisible).toBeTruthy();
      }
    });
  });

  test.describe('Performance and Security', () => {
    test('Page loads within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Página deve carregar em menos de 5 segundos
      expect(loadTime).toBeLessThan(5000);
      
      // Verifica métricas de performance
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        };
      });
      
      expect(performanceMetrics.domContentLoaded).toBeLessThan(3000);
    });

    test('No console errors or warnings', async ({ page }) => {
      const errors = [];
      const warnings = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        } else if (msg.type() === 'warning') {
          warnings.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navega por algumas páginas para verificar erros
      const routes = ['/tarefas', '/sobre', '/login'];
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
      }
      
      // Não deve haver erros críticos
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        !error.includes('NetworkError') &&
        !error.includes('AbortError')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('External resources load correctly', async ({ page }) => {
      const failedRequests = [];
      
      page.on('response', response => {
        if (response.status() >= 400 && response.url().includes('cdnjs.cloudflare.com')) {
          failedRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // FontAwesome deve carregar
      const fontAwesome = page.locator('i[class*="fa-"]').first();
      if (await fontAwesome.count() > 0) {
        await expect(fontAwesome).toBeVisible();
      }
      
      // Não deve haver falhas críticas no CDN
      expect(failedRequests.length).toBe(0);
    });
  });
});