import { test, expect } from '@playwright/test';

const mobileViewport = { width: 375, height: 667 };
const tabletViewport = { width: 768, height: 1024 };
const desktopViewport = { width: 1366, height: 768 };

test.describe('Component Responsiveness', () => {
  
  test.describe('Header Component', () => {
    [mobileViewport, tabletViewport, desktopViewport].forEach(viewport => {
      test(`Header on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        const headerBox = await header.boundingBox();
        
        // Header should not exceed viewport width
        expect(headerBox.width).toBeLessThanOrEqual(viewport.width);
        
        // Header should have reasonable height
        expect(headerBox.height).toBeGreaterThan(40);
        expect(headerBox.height).toBeLessThan(120);
        
        // Logo should be visible
        const logo = page.locator('img[alt*="CatButler"], .logo');
        await expect(logo).toBeVisible();
        
        if (viewport.width < 768) {
          // Mobile: Check for hamburger menu or mobile navigation
          const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu-button, button[aria-label*="menu"]');
          const nav = page.locator('nav');
          
          // Either should have mobile menu button OR navigation should be hidden/collapsed
          const hasMenu = await mobileMenu.isVisible();
          const hasVisibleNav = await nav.isVisible();
          
          if (!hasMenu && hasVisibleNav) {
            // If nav is visible, it shouldn't take full width
            const navBox = await nav.boundingBox();
            expect(navBox.width).toBeLessThan(viewport.width * 0.9);
          }
        } else {
          // Desktop/Tablet: Navigation should be visible
          const nav = page.locator('nav');
          await expect(nav).toBeVisible();
        }
      });
    });
  });
  
  test.describe('Sidebar Component', () => {
    [mobileViewport, tabletViewport, desktopViewport].forEach(viewport => {
      test(`Sidebar on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const sidebar = page.locator('[data-testid="sidebar"], .spa-sidebar, .sidebar');
        
        if (viewport.width >= 1024) {
          // Desktop: Sidebar should be visible
          await expect(sidebar).toBeVisible();
          
          const sidebarBox = await sidebar.boundingBox();
          
          // Sidebar should have reasonable width
          expect(sidebarBox.width).toBeGreaterThan(200);
          expect(sidebarBox.width).toBeLessThan(400);
          
          // Should contain navigation links
          const navLinks = sidebar.locator('a, button');
          const linkCount = await navLinks.count();
          expect(linkCount).toBeGreaterThan(0);
          
        } else if (viewport.width >= 768) {
          // Tablet: Sidebar might be visible or collapsible
          const isVisible = await sidebar.isVisible();
          
          if (isVisible) {
            const sidebarBox = await sidebar.boundingBox();
            // On tablet, sidebar shouldn't take more than 40% of width
            expect(sidebarBox.width).toBeLessThan(viewport.width * 0.4);
          }
          
        } else {
          // Mobile: Sidebar should be hidden or behind a toggle
          const isVisible = await sidebar.isVisible();
          
          if (isVisible) {
            // If visible, check if it's an overlay or takes reasonable space
            const sidebarBox = await sidebar.boundingBox();
            const isOverlay = await sidebar.evaluate(el => {
              return window.getComputedStyle(el).position === 'fixed' || 
                     window.getComputedStyle(el).position === 'absolute';
            });
            
            if (!isOverlay) {
              // If not overlay, shouldn't take full width
              expect(sidebarBox.width).toBeLessThan(viewport.width * 0.8);
            }
          }
        }
      });
    });
  });
  
  test.describe('Footer Component', () => {
    [mobileViewport, tabletViewport, desktopViewport].forEach(viewport => {
      test(`Footer on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
        
        const footerBox = await footer.boundingBox();
        
        // Footer should not exceed viewport width
        expect(footerBox.width).toBeLessThanOrEqual(viewport.width);
        
        // Footer content should be accessible
        const footerLinks = footer.locator('a, button');
        const linkCount = await footerLinks.count();
        
        if (linkCount > 0) {
          // Check that links are properly sized for touch on mobile
          if (viewport.width < 768) {
            const firstLink = footerLinks.first();
            const linkBox = await firstLink.boundingBox();
            if (linkBox) {
              expect(Math.min(linkBox.width, linkBox.height)).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });
    });
  });
  
  test.describe('Modal Components', () => {
    test('Modal responsiveness', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/cozinha-ia');
      await page.waitForLoadState('networkidle');
      
      // Try to open a modal (chat modal)
      const chatButton = page.locator('button:has-text("Chat"), button[aria-label*="chat"], .chat-button');
      
      if (await chatButton.isVisible()) {
        await chatButton.click();
        
        // Modal should appear
        const modal = page.locator('.modal, [role="dialog"], .fixed');
        
        if (await modal.isVisible()) {
          const modalBox = await modal.boundingBox();
          
          // Modal should not exceed viewport
          expect(modalBox.width).toBeLessThanOrEqual(mobileViewport.width);
          expect(modalBox.height).toBeLessThanOrEqual(mobileViewport.height);
          
          // Modal should be properly centered or positioned
          expect(modalBox.x).toBeGreaterThanOrEqual(0);
          expect(modalBox.y).toBeGreaterThanOrEqual(0);
          
          // Close button should be accessible
          const closeButton = modal.locator('button:has-text("×"), button[aria-label*="close"], .close-button');
          if (await closeButton.isVisible()) {
            const closeBox = await closeButton.boundingBox();
            expect(Math.min(closeBox.width, closeBox.height)).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });
  
  test.describe('Form Components', () => {
    test('Form responsiveness on mobile', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/config');
      await page.waitForLoadState('networkidle');
      
      // Find form inputs
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        
        if (await input.isVisible()) {
          const inputBox = await input.boundingBox();
          
          // Input should not exceed container width
          expect(inputBox.width).toBeLessThanOrEqual(mobileViewport.width - 32); // Account for padding
          
          // Input should have minimum height for mobile
          expect(inputBox.height).toBeGreaterThanOrEqual(44);
          
          // Test input focus (should not cause horizontal scroll)
          await input.focus();
          await page.waitForTimeout(500);
          
          const scrollX = await page.evaluate(() => window.scrollX);
          expect(scrollX).toBe(0);
        }
      }
    });
  });
  
  test.describe('Cards and Grid Components', () => {
    test('Card layouts responsiveness', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('.card-glass, [class*="card"], .grid > div');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        // On mobile, cards should stack vertically or be properly sized
        for (let i = 0; i < Math.min(cardCount, 5); i++) {
          const card = cards.nth(i);
          
          if (await card.isVisible()) {
            const cardBox = await card.boundingBox();
            
            // Card should fit within viewport
            expect(cardBox.width).toBeLessThanOrEqual(mobileViewport.width - 16);
            
            // Cards should not overlap horizontally in a problematic way
            expect(cardBox.x).toBeGreaterThanOrEqual(-5); // Small tolerance
            expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(mobileViewport.width + 5);
          }
        }
        
        // Test on tablet
        await page.setViewportSize(tabletViewport);
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Cards might be in a grid on tablet
        const tabletCards = page.locator('.card-glass, [class*="card"], .grid > div');
        const tabletCardCount = await tabletCards.count();
        
        if (tabletCardCount > 0) {
          const firstCard = tabletCards.first();
          const cardBox = await firstCard.boundingBox();
          
          // Cards should utilize available space better on tablet
          expect(cardBox.width).toBeGreaterThan(200); // Should be wider than mobile
          expect(cardBox.width).toBeLessThanOrEqual(tabletViewport.width / 2); // But not too wide
        }
      }
    });
  });
  
  test.describe('Text and Typography', () => {
    [mobileViewport, tabletViewport].forEach(viewport => {
      test(`Typography readability on ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check various text elements
        const textElements = page.locator('h1, h2, h3, p, span:not(:empty)');
        const textCount = await textElements.count();
        
        for (let i = 0; i < Math.min(textCount, 10); i++) {
          const element = textElements.nth(i);
          
          if (await element.isVisible()) {
            const fontSize = await element.evaluate(el => {
              return window.getComputedStyle(el).fontSize;
            });
            
            const lineHeight = await element.evaluate(el => {
              return window.getComputedStyle(el).lineHeight;
            });
            
            const fontSizeNum = parseFloat(fontSize);
            
            // Text should be readable
            if (viewport.width < 768) {
              // Mobile: minimum 14px for body text
              expect(fontSizeNum).toBeGreaterThanOrEqual(14);
            } else {
              // Tablet: minimum 12px
              expect(fontSizeNum).toBeGreaterThanOrEqual(12);
            }
            
            // Line height should be reasonable
            if (lineHeight !== 'normal') {
              const lineHeightNum = parseFloat(lineHeight);
              expect(lineHeightNum).toBeGreaterThanOrEqual(fontSizeNum * 1.2);
            }
          }
        }
      });
    });
  });
});
