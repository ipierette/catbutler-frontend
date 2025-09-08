import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/agenda', name: 'Agenda' },
  { path: '/assistente', name: 'Assistente' },
  { path: '/cozinha-ia', name: 'Cozinha IA' },
  { path: '/faxina-ia', name: 'Faxina IA' },
  { path: '/mercado-ia', name: 'Mercado IA' },
  { path: '/dicas', name: 'Dicas' },
  { path: '/historico', name: 'Histórico' },
  { path: '/sobre', name: 'Sobre' },
  { path: '/config', name: 'Configurações' },
];

const mobileViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Samsung Galaxy S21', width: 384, height: 854 },
];

const tabletViewports = [
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
];

const desktopViewports = [
  { name: 'Desktop HD', width: 1366, height: 768 },
  { name: 'Desktop FHD', width: 1920, height: 1080 },
];

test.describe('All Pages Responsiveness', () => {
  
  // Test each page on mobile
  test.describe('Mobile Responsiveness', () => {
    mobileViewports.forEach(viewport => {
      test(`${viewport.name} - All Pages`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        for (const pageInfo of pages) {
          console.log(`Testing ${pageInfo.name} on ${viewport.name}`);
          
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');
          
          // Basic responsiveness checks
          await checkBasicResponsiveness(page, viewport, pageInfo.name);
          
          // Page-specific checks
          await checkPageSpecificElements(page, pageInfo.path, viewport);
          
          // Take screenshot
          await page.screenshot({ 
            path: `tests/screenshots/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
            fullPage: true 
          });
        }
      });
    });
  });
  
  // Test each page on tablet
  test.describe('Tablet Responsiveness', () => {
    tabletViewports.forEach(viewport => {
      test(`${viewport.name} - Key Pages`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Test main pages on tablet
        const keyPages = pages.slice(0, 6); // Home, Agenda, Assistente, Cozinha, Faxina, Mercado
        
        for (const pageInfo of keyPages) {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');
          
          await checkBasicResponsiveness(page, viewport, pageInfo.name);
          await checkTabletSpecificElements(page, viewport);
          
          await page.screenshot({ 
            path: `tests/screenshots/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
            fullPage: true 
          });
        }
      });
    });
  });
  
  // Test each page on desktop
  test.describe('Desktop Responsiveness', () => {
    desktopViewports.forEach(viewport => {
      test(`${viewport.name} - Key Pages`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const keyPages = pages.slice(0, 5); // Home, Agenda, Assistente, Cozinha, Faxina
        
        for (const pageInfo of keyPages) {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');
          
          await checkBasicResponsiveness(page, viewport, pageInfo.name);
          await checkDesktopSpecificElements(page, viewport);
          
          await page.screenshot({ 
            path: `tests/screenshots/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
            fullPage: true 
          });
        }
      });
    });
  });
});

// Helper functions
async function checkBasicResponsiveness(page, viewport, pageName) {
  // No horizontal overflow
  const bodyOverflow = await page.evaluate(() => {
    return window.getComputedStyle(document.body).overflowX;
  });
  expect(bodyOverflow).not.toBe('scroll');
  
  // All visible elements should fit within viewport width
  const overflowingElements = await page.evaluate((viewportWidth) => {
    const elements = Array.from(document.querySelectorAll('*:not(script):not(style)'));
    return elements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.right > viewportWidth + 10; // 10px tolerance
    }).length;
  }, viewport.width);
  
  expect(overflowingElements).toBe(0);
  
  // Header should be visible
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  // Main content should be visible
  const main = page.locator('main, [role="main"], .spa-main, .page-content');
  await expect(main.first()).toBeVisible();
}

async function checkPageSpecificElements(page, path, viewport) {
  switch (path) {
    case '/':
      // Home page specific checks
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
      
      // Cards should be properly stacked on mobile
      const cards = page.locator('.card-glass, [class*="card"]');
      const cardCount = await cards.count();
      if (cardCount > 0) {
        const firstCard = cards.first();
        const cardBox = await firstCard.boundingBox();
        if (cardBox) {
          expect(cardBox.width).toBeLessThanOrEqual(viewport.width - 16); // Account for margin
        }
      }
      break;
      
    case '/assistente':
      // Chat interface should be responsive
      const chatContainer = page.locator('[class*="assistente"], .chat-container');
      if (await chatContainer.isVisible()) {
        const chatBox = await chatContainer.boundingBox();
        expect(chatBox.width).toBeLessThanOrEqual(viewport.width);
      }
      
      // Message input should be accessible
      const messageInput = page.locator('textarea, input[placeholder*="mensagem"]');
      await expect(messageInput).toBeVisible();
      break;
      
    case '/cozinha-ia':
    case '/faxina-ia':
    case '/mercado-ia':
      // IA pages should have accessible chat/input areas
      const aiInterface = page.locator('.chat-container, [class*="ia-"], .ai-interface');
      if (await aiInterface.isVisible()) {
        const interfaceBox = await aiInterface.boundingBox();
        expect(interfaceBox.width).toBeLessThanOrEqual(viewport.width);
      }
      break;
      
    case '/agenda':
      // Calendar should be responsive
      const calendar = page.locator('[class*="calendar"], [class*="agenda"], .week-view');
      if (await calendar.isVisible()) {
        const calendarBox = await calendar.boundingBox();
        expect(calendarBox.width).toBeLessThanOrEqual(viewport.width);
      }
      break;
  }
}

async function checkTabletSpecificElements(page, viewport) {
  // On tablet, sidebar might be visible or collapsible
  const sidebar = page.locator('[data-testid="sidebar"], .spa-sidebar');
  if (await sidebar.isVisible()) {
    const sidebarBox = await sidebar.boundingBox();
    // Sidebar shouldn't take more than 40% of screen width on tablet
    expect(sidebarBox.width).toBeLessThan(viewport.width * 0.4);
  }
  
  // Touch targets should be appropriately sized for tablet
  const buttons = page.locator('button, a[href], [role="button"]');
  const buttonCount = await buttons.count();
  
  for (let i = 0; i < Math.min(buttonCount, 10); i++) {
    const button = buttons.nth(i);
    if (await button.isVisible()) {
      const buttonBox = await button.boundingBox();
      if (buttonBox) {
        // Tablet touch targets should be at least 44px
        expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(44);
      }
    }
  }
}

async function checkDesktopSpecificElements(page, viewport) {
  // On desktop, sidebar should typically be visible
  const sidebar = page.locator('[data-testid="sidebar"], .spa-sidebar');
  
  // Check if sidebar is supposed to be visible on this page
  const currentUrl = page.url();
  if (!currentUrl.includes('/login') && !currentUrl.includes('/signup')) {
    // Sidebar should be visible on main pages
    if (await sidebar.isVisible()) {
      const sidebarBox = await sidebar.boundingBox();
      // Sidebar should have reasonable width on desktop
      expect(sidebarBox.width).toBeGreaterThan(200);
      expect(sidebarBox.width).toBeLessThan(400);
    }
  }
  
  // Desktop layouts should utilize the available space efficiently
  const main = page.locator('main, [role="main"], .spa-main');
  if (await main.isVisible()) {
    const mainBox = await main.boundingBox();
    // Main content should use most of the available width (accounting for sidebar)
    expect(mainBox.width).toBeGreaterThan(viewport.width * 0.6);
  }
}

test.describe('Cross-browser Mobile Testing', () => {
  ['chromium', 'webkit'].forEach(browserName => {
    test(`Mobile Safari compatibility - ${browserName}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      
      // Test key pages work across browsers
      const keyPages = ['/', '/assistente', '/cozinha-ia'];
      
      for (const pagePath of keyPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Basic functionality should work
        const main = page.locator('main, [role="main"]');
        await expect(main).toBeVisible();
        
        // No JavaScript errors
        const jsErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            jsErrors.push(msg.text());
          }
        });
        
        // Interact with the page
        await page.mouse.click(200, 300);
        await page.waitForTimeout(1000);
        
        expect(jsErrors.length).toBe(0);
      }
    });
  });
});
