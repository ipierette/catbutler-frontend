import { test, expect } from '@playwright/test';

test.describe('Simple Responsive Test', () => {
  
  test('Mobile iPhone SE - Basic responsive check', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 1. Check if page loads without errors
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // 2. Check for horizontal overflow (most critical)
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 375;
    
    console.log(`Body scroll width: ${bodyScrollWidth}, Viewport: ${viewportWidth}`);
    
    if (bodyScrollWidth > viewportWidth + 10) { // 10px tolerance
      console.log('❌ HORIZONTAL OVERFLOW DETECTED');
      
      // Find elements causing overflow
      const overflowElements = await page.evaluate((vw) => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements
          .filter(el => el.getBoundingClientRect().right > vw)
          .map(el => ({
            tag: el.tagName,
            class: el.className,
            width: el.getBoundingClientRect().width,
            right: el.getBoundingClientRect().right
          }))
          .slice(0, 5); // First 5 problematic elements
      }, viewportWidth);
      
      console.log('Problematic elements:', overflowElements);
    } else {
      console.log('✅ No horizontal overflow');
    }
    
    // 3. Check if mobile menu button exists and is properly sized
    const menuButton = page.locator('button[aria-expanded]').first();
    if (await menuButton.isVisible()) {
      const menuBox = await menuButton.boundingBox();
      console.log(`Menu button size: ${menuBox.width}x${menuBox.height}`);
      
      if (menuBox.width >= 44 && menuBox.height >= 44) {
        console.log('✅ Menu button is touch-friendly');
      } else {
        console.log('❌ Menu button too small for touch');
      }
    }
    
    // 4. Check main content is visible
    const main = page.locator('main');
    const isMainVisible = await main.isVisible();
    console.log(`Main content visible: ${isMainVisible ? '✅' : '❌'}`);
    
    // 5. Take screenshot for manual review
    await page.screenshot({ 
      path: `tests/screenshots/mobile-iphone-se-simple.png`,
      fullPage: true 
    });
    
    // Only fail on critical issues
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 10);
    await expect(main).toBeVisible();
  });
  
  test('Desktop - Basic layout check', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 1. Check if sidebar is visible on desktop
    const sidebar = page.locator('.spa-sidebar, [class*="sidebar"]').first();
    const sidebarVisible = await sidebar.isVisible();
    console.log(`Sidebar visible on desktop: ${sidebarVisible ? '✅' : '❌'}`);
    
    // 2. Check if mobile menu is hidden
    const menuButton = page.locator('button[aria-expanded]').first();
    const menuVisible = await menuButton.isVisible();
    console.log(`Mobile menu hidden on desktop: ${!menuVisible ? '✅' : '❌'}`);
    
    // 3. Take screenshot
    await page.screenshot({ 
      path: `tests/screenshots/desktop-simple.png`,
      fullPage: true 
    });
    
    // Sidebar should be visible on desktop
    await expect(sidebar).toBeVisible();
  });
  
  test('Tablet iPad - Layout adaptation', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if layout adapts properly
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    console.log(`iPad scroll width: ${bodyScrollWidth}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: `tests/screenshots/tablet-ipad-simple.png`,
      fullPage: true 
    });
    
    // No horizontal overflow on tablet
    expect(bodyScrollWidth).toBeLessThanOrEqual(768 + 10);
  });
});
