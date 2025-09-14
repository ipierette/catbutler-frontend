const { expect, test } = require('@playwright/test');

// Testes de acessibilidade WCAG 2.1 AA compliance
test.describe('Accessibility Tests - WCAG 2.1 AA Compliance', () => {
  
  test.describe('Keyboard Navigation', () => {
    test('All interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Lista todos os elementos interativos
      const interactiveElements = await page.locator('a, button, input, select, textarea, [tabindex], [role="button"], [role="link"]').all();
      
      for (const element of interactiveElements) {
        // Verifica se o elemento é focável
        await element.focus();
        const isFocused = await element.evaluate(el => document.activeElement === el);
        expect(isFocused).toBeTruthy();
        
        // Verifica se há indicação visual de foco
        const focusStyles = await element.evaluate(el => {
          const styles = window.getComputedStyle(el, ':focus');
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow,
            border: styles.border
          };
        });
        
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.border.includes('px');
        
        expect(hasFocusIndicator).toBeTruthy();
      }
    });

    test('Tab navigation follows logical order', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const tabOrder = [];
      
      // Navega por TAB e registra a ordem
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            textContent: el.textContent?.trim().substring(0, 50),
            offsetTop: el.offsetTop,
            offsetLeft: el.offsetLeft
          };
        });
        
        tabOrder.push(focusedElement);
      }
      
      // Verifica se a ordem é logicamente consistente (top-to-bottom, left-to-right)
      for (let i = 1; i < tabOrder.length; i++) {
        const prev = tabOrder[i - 1];
        const curr = tabOrder[i];
        
        // Elementos devem seguir uma ordem visual lógica
        const isLogicalOrder = 
          curr.offsetTop >= prev.offsetTop || 
          (curr.offsetTop === prev.offsetTop && curr.offsetLeft >= prev.offsetLeft);
        
        // Permite algumas exceções para elementos que podem estar fora da ordem visual
        const isSkipLink = curr.textContent?.toLowerCase().includes('skip') || 
                          prev.textContent?.toLowerCase().includes('skip');
        
        expect(isLogicalOrder || isSkipLink).toBeTruthy();
      }
    });

    test('Form elements have proper labels', async ({ page }) => {
      const routes = ['/', '/login', '/signup', '/tarefas', '/cozinha'];
      
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        
        const formInputs = await page.locator('input, select, textarea').all();
        
        for (const input of formInputs) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');
          const placeholder = await input.getAttribute('placeholder');
          
          // Busca por label associado
          let hasLabel = false;
          if (id) {
            const label = await page.locator(`label[for="${id}"]`).count();
            hasLabel = label > 0;
          }
          
          // Verifica se tem alguma forma de label
          const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby || placeholder;
          expect(hasAccessibleName).toBeTruthy();
          
          // Se tem aria-labelledby, verifica se o elemento referenciado existe
          if (ariaLabelledby) {
            const referencedElement = await page.locator(`#${ariaLabelledby}`).count();
            expect(referencedElement).toBeGreaterThan(0);
          }
        }
      }
    });

    test('All images have appropriate alt text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verifica todas as imagens
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        const isDecorative = await img.getAttribute('role') === 'presentation' || 
                           await img.getAttribute('aria-hidden') === 'true';
        
        if (isDecorative) {
          // Imagens decorativas devem ter alt="" ou role="presentation"
          expect(alt === '' || alt === null).toBeTruthy();
        } else {
          // Imagens informativas devem ter alt text descritivo
          expect(alt).toBeTruthy();
          expect(alt.length).toBeGreaterThan(0);
          expect(alt.length).toBeLessThan(150); // Alt text não deve ser muito longo
          
          // Alt text não deve ser redundante com o nome do arquivo
          const fileName = src?.split('/').pop()?.split('.')[0];
          if (fileName) {
            expect(alt.toLowerCase()).not.toBe(fileName.toLowerCase());
          }
        }
      }
    });

    test('Color is not the only way to convey information', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Procura por elementos que possam usar apenas cor para informação
      const colorDependentElements = await page.locator('.error, .success, .warning, .info, .alert').all();
      
      for (const element of colorDependentElements) {
        const hasIcon = await element.locator('i, svg, [class*="icon"]').count() > 0;
        const hasText = await element.evaluate(el => {
          const text = el.textContent?.trim();
          return text && text.length > 0;
        });
        const hasAriaLabel = await element.getAttribute('aria-label') !== null;
        
        // Deve ter ícone, texto descritivo ou aria-label além da cor
        expect(hasIcon || hasText || hasAriaLabel).toBeTruthy();
      }
    });
  });
});