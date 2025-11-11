import { test, expect } from '@playwright/test';

test.describe('Sheet Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/index.html');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle('Stimulus Sheet - Live Demo');
    await expect(page.locator('h1')).toContainText('Stimulus Sheet');
  });

  test('all demo buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Simple Sheet/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Form Sheet/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^📚 Nested Sheets$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Information Sheet/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Long Content Sheet/ })).toBeVisible();
  });

  test('simple sheet opens and displays content', async ({ page }) => {
    // Click the button to open the sheet
    await page.getByRole('button', { name: /Simple Sheet/ }).click();
    
    // Wait for the sheet to appear
    await page.waitForSelector('.sheet-demo-content', { timeout: 2000 });
    
    // Verify sheet content is visible
    const sheetContent = page.locator('.sheet-demo-content');
    await expect(sheetContent).toBeVisible();
    await expect(sheetContent.locator('h2')).toContainText('Simple Sheet');
    
    // Verify the sheet has correct opacity (should be visible, not 0)
    const sheet = page.locator('.sheet').first();
    const opacity = await sheet.evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('sheet can be closed with close button', async ({ page }) => {
    // Open the sheet
    await page.getByRole('button', { name: /Simple Sheet/ }).click();
    await page.waitForSelector('.sheet-demo-content', { timeout: 2000 });
    
    // Verify sheet is visible
    const sheetContent = page.locator('.sheet-demo-content');
    await expect(sheetContent).toBeVisible();
    
    // Click the close button
    await page.getByRole('button', { name: 'Close' }).click();
    
    // Wait for animation to complete
    await page.waitForTimeout(600);
    
    // Verify sheet is removed from DOM
    await expect(sheetContent).not.toBeAttached();
  });

  test('form sheet displays form elements', async ({ page }) => {
    // Open form sheet
    await page.getByRole('button', { name: /Form Sheet/ }).click();
    await page.waitForSelector('.sheet-demo-content', { timeout: 2000 });
    
    // Verify form elements are present
    await expect(page.getByLabel('Name:')).toBeVisible();
    await expect(page.getByLabel('Email:')).toBeVisible();
    await expect(page.getByLabel('Category:')).toBeVisible();
    await expect(page.getByLabel('Message:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('nested sheets can be opened and stacked', async ({ page }) => {
    // Open the first sheet
    await page.getByRole('button', { name: /^📚 Nested Sheets$/ }).click();
    
    // Wait for sheet content to be attached
    await page.waitForSelector('.sheet-container', { state: 'attached', timeout: 2000 });
    await page.waitForTimeout(600);
    
    // Verify first sheet exists
    const firstSheet = page.locator('.sheet-container').first();
    await expect(firstSheet).toBeAttached();
    await expect(firstSheet.locator('h2')).toContainText('Nested Sheet Example');
    
    // Open a second sheet from within the first
    await page.getByRole('button', { name: 'Open Another Sheet' }).click();
    await page.waitForTimeout(600);
    
    // Verify both sheets exist in DOM
    const allSheets = page.locator('.sheet-container');
    await expect(allSheets).toHaveCount(2);
    
    // Verify the second sheet is on top
    const secondSheet = allSheets.nth(1);
    await expect(secondSheet.locator('h2')).toContainText('Simple Sheet');
    
    // Check opacity of the second sheet (should be fully visible)
    const sheet = secondSheet.locator('.sheet');
    const opacity = await sheet.evaluate(el => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('CSS fix - sheet is not hidden by opacity: 0', async ({ page }) => {
    // This test specifically verifies the bug fix
    // The bug was that the last sheet had opacity: 0 in CSS
    
    // Open a sheet
    await page.getByRole('button', { name: /Simple Sheet/ }).click();
    await page.waitForSelector('.sheet', { timeout: 2000 });
    
    // Wait for animation to complete
    await page.waitForTimeout(500);
    
    // The sheet should be visible (opacity > 0.9)
    const sheet = page.locator('.sheet').first();
    const opacity = await sheet.evaluate(el => window.getComputedStyle(el).opacity);
    
    // Verify the sheet is NOT hidden (opacity should be 1 or close to 1)
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    
    // Verify pointer-events is not "none"
    const pointerEvents = await sheet.evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(pointerEvents).not.toBe('none');
  });
});
