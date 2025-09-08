import { test, expect } from '@playwright/test';

test.describe('Quick Mobile Responsiveness Check', () => {
  
  test('iPhone SE - Home page basic checks', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');
    
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 5); // 5px tolerance
    
    // Header should be visible and fit
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox.width).toBeLessThanOrEqual(375);
    
    // Mobile menu button should be visible and properly sized
    const menuButton = page.locator('button[aria-label*="menu"]');
    await expect(menuButton).toBeVisible();
    const menuBox = await menuButton.boundingBox();
    expect(menuBox.width).toBeGreaterThanOrEqual(44);
    expect(menuBox.height).toBeGreaterThanOrEqual(44);
    
    // Cat image should be visible and properly sized
    const catImage = page.locator('img[alt*="Mascote"]');
    await expect(catImage).toBeVisible();
    const catBox = await catImage.boundingBox();
    expect(catBox.width).toBeLessThanOrEqual(375 - 32); // Account for padding
    
    // Cards should stack properly
    const cards = page.locator('.card-glass, [class*="card"]');
    const cardCount = await cards.count();
    if (cardCount > 0) {
      const firstCard = cards.first();
      const cardBox = await firstCard.boundingBox();
      expect(cardBox.width).toBeLessThanOrEqual(375 - 16);
    }
    
    // Test mobile menu functionality
    await menuButton.click();
    await page.waitForTimeout(300);
    
    // Menu should be visible (specifically the menu content, not overlay)
    const menu = page.locator('.mobile-menu nav');
    await expect(menu).toBeVisible();
    
    // Menu items should be accessible
    const menuItems = menu.locator('a');
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(5); // Should have multiple menu items
    
    // Take screenshot
    await page.screenshot({ 
      path: `tests/screenshots/quick-mobile-test-iphone-se.png`,
      fullPage: true 
    });
  });
  
  test('iPad - Layout adaptation', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');
    
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768 + 5);
    
    // Header should adapt
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    expect(headerBox.width).toBeLessThanOrEqual(768);
    
    // Cat image should be larger on tablet
    const catImage = page.locator('img[alt*="Mascote"]');
    const catBox = await catImage.boundingBox();
    expect(catBox.width).toBeGreaterThan(200); // Should be bigger than mobile
    
    // Grid should show 2 columns
    const quickActions = page.locator('section').nth(1); // Assuming it's the second section
    const gridItems = quickActions.locator('> article, > div');
    const itemCount = await gridItems.count();
    
    if (itemCount >= 2) {
      const firstItem = gridItems.first();
      const secondItem = gridItems.nth(1);
      
      const firstBox = await firstItem.boundingBox();
      const secondBox = await secondItem.boundingBox();
      
      // On tablet, items should be side by side (approximately same Y position)
      expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(50);
    }
    
    await page.screenshot({ 
      path: `tests/screenshots/quick-mobile-test-ipad.png`,
      fullPage: true 
    });
  });
  
  test('Desktop - Full layout', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');
    
    // Sidebar should be visible on desktop
    const sidebar = page.locator('.spa-sidebar, [class*="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Mobile menu should be hidden
    const menuButton = page.locator('button[aria-label*="menu"]');
    await expect(menuButton).not.toBeVisible();
    
    // Grid should show 3 columns
    const quickActions = page.locator('section').nth(1);
    const gridItems = quickActions.locator('> article, > div');
    const itemCount = await gridItems.count();
    
    if (itemCount >= 3) {
      const items = [];
      for (let i = 0; i < 3; i++) {
        const item = gridItems.nth(i);
        const box = await item.boundingBox();
        items.push(box);
      }
      
      // Items should be in a row (similar Y positions)
      expect(Math.abs(items[0].y - items[1].y)).toBeLessThan(20);
      expect(Math.abs(items[1].y - items[2].y)).toBeLessThan(20);
    }
    
    await page.screenshot({ 
      path: `tests/screenshots/quick-mobile-test-desktop.png`,
      fullPage: true 
    });
  });
});
