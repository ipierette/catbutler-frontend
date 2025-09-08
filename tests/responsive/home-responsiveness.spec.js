import { test, expect } from '@playwright/test';

// Test configurations for different devices
const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop Small', width: 1280, height: 720 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
];

test.describe('Home Page Responsiveness', () => {
  
  devices.forEach(device => {
    test(`${device.name} (${device.width}x${device.height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: device.width, height: device.height });
      
      // Navigate to home page
      await page.goto('/');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Test 1: Page should load without horizontal scroll
      const bodyOverflow = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflowX;
      });
      expect(bodyOverflow).not.toBe('scroll');
      
      // Test 2: Header should be visible and properly sized
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      const headerBox = await header.boundingBox();
      expect(headerBox.width).toBeLessThanOrEqual(device.width);
      
      // Test 3: Logo should be visible (specific logo in header)
      const logo = page.locator('header img[alt*="Logo"], .logo img, img[alt="CatButler Logo"]').first();
      await expect(logo).toBeVisible();
      
      // Test 4: Main content should be accessible
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Test 5: Footer should be present
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Test 6: Sidebar behavior
      if (device.width >= 1024) {
        // Desktop: sidebar should be visible
        const sidebar = page.locator('[data-testid="sidebar"], .spa-sidebar');
        await expect(sidebar).toBeVisible();
      } else {
        // Mobile: sidebar should be hidden or behind a toggle
        const mobileToggle = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]');
        // Should either have a toggle button or sidebar is hidden
        const toggleVisible = await mobileToggle.isVisible();
        if (!toggleVisible) {
          // If no toggle, sidebar should be hidden
          const sidebar = page.locator('[data-testid="sidebar"], .spa-sidebar');
          const sidebarVisible = await sidebar.isVisible();
          if (sidebarVisible) {
            // If sidebar is visible, it shouldn't take full width on mobile
            const sidebarBox = await sidebar.boundingBox();
            expect(sidebarBox.width).toBeLessThan(device.width * 0.9);
          }
        }
      }
      
      // Test 7: Hero section responsiveness
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
      
      const heroBox = await heroSection.boundingBox();
      expect(heroBox.width).toBeLessThanOrEqual(device.width);
      
      // Test 8: Cards/buttons should be properly sized
      const cards = page.locator('.card-glass, [class*="card"]');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        for (let i = 0; i < Math.min(cardCount, 3); i++) {
          const card = cards.nth(i);
          const cardBox = await card.boundingBox();
          if (cardBox) {
            expect(cardBox.width).toBeLessThanOrEqual(device.width - 32); // Account for padding
          }
        }
      }
      
      // Test 9: Text should be readable (minimum size)
      const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6');
      const textCount = await textElements.count();
      
      if (textCount > 0) {
        const fontSize = await textElements.first().evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        const fontSizeNum = parseFloat(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(12); // Minimum readable size
      }
      
      // Test 10: Take screenshot for visual comparison
      await page.screenshot({ 
        path: `tests/screenshots/home-${device.name.toLowerCase().replace(/\s+/g, '-')}-${device.width}x${device.height}.png`,
        fullPage: true 
      });
      
      // Test 11: Check for specific mobile issues
      if (device.width < 768) {
        // Mobile specific tests
        
        // No elements should be cut off horizontally
        const allElements = page.locator('*:visible');
        const elementCount = await allElements.count();
        
        for (let i = 0; i < Math.min(elementCount, 20); i++) {
          const element = allElements.nth(i);
          const box = await element.boundingBox();
          if (box && box.width > 0) {
            expect(box.x + box.width).toBeLessThanOrEqual(device.width + 5); // 5px tolerance
          }
        }
        
        // Touch targets should be at least 44px
        const buttons = page.locator('button, a, [role="button"]');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          const buttonBox = await button.boundingBox();
          if (buttonBox) {
            expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });
  
  test('Mobile menu functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for mobile menu toggle
    const menuToggle = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"], .mobile-menu-button');
    
    if (await menuToggle.isVisible()) {
      // Test menu toggle functionality
      await menuToggle.click();
      
      // Menu should open
      const menu = page.locator('[data-testid="mobile-menu-content"], .mobile-menu-content, nav');
      await expect(menu).toBeVisible();
      
      // Close menu
      await menuToggle.click();
      
      // Menu should close
      await expect(menu).not.toBeVisible();
    }
  });
  
  test('Scroll behavior on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test vertical scrolling works
    await page.evaluate(() => window.scrollTo(0, 100));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
    
    // Test horizontal scroll doesn't exist
    await page.evaluate(() => window.scrollTo(100, 0));
    const scrollX = await page.evaluate(() => window.scrollX);
    expect(scrollX).toBe(0);
  });
});
