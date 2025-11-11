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

  test('stacked sheets reveal lower sheet on the left side', async ({ page }) => {
    // Open first sheet
    await page.getByRole('button', { name: /📚 Nested Sheets/ }).click();
    await page.waitForSelector('.sheet-container', { state: 'attached', timeout: 2000 });
    await page.waitForTimeout(600);
    
    // Open second sheet
    await page.getByRole('button', { name: 'Open Another Sheet' }).click();
    await page.waitForTimeout(600);
    
    // Verify both sheets exist
    const allSheets = page.locator('.sheet-container');
    await expect(allSheets).toHaveCount(2);
    
    // Get the first (lower) sheet
    const lowerSheetContainer = allSheets.first();
    const lowerSheet = lowerSheetContainer.locator('.sheet');
    
    // Verify lower sheet is shifted to the left (reveal effect)
    const transform = await lowerSheet.evaluate(el => window.getComputedStyle(el).transform);
    // Transform should include translateX with negative value (shifted left)
    expect(transform).toContain('matrix');
    
    // Verify lower sheet is dimmed
    const filter = await lowerSheet.evaluate(el => window.getComputedStyle(el).filter);
    expect(filter).toContain('brightness');
    
    // Verify lower sheet has pointer-events disabled
    const pointerEvents = await lowerSheet.evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');
    
    // Get the second (top) sheet
    const topSheetContainer = allSheets.nth(1);
    const topSheet = topSheetContainer.locator('.sheet');
    
    // Verify top sheet has pointer-events enabled
    const topPointerEvents = await topSheet.evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(topPointerEvents).not.toBe('none');
    
    // Verify top sheet is not dimmed
    const topFilter = await topSheet.evaluate(el => window.getComputedStyle(el).filter);
    expect(topFilter).toBe('none');
  });

  test('closing top sheet restores previous sheet to full view', async ({ page }) => {
    // Open first sheet
    await page.getByRole('button', { name: /📚 Nested Sheets/ }).click();
    await page.waitForSelector('.sheet-container', { state: 'attached', timeout: 2000 });
    await page.waitForTimeout(600);
    
    // Open second sheet
    await page.getByRole('button', { name: 'Open Another Sheet' }).click();
    await page.waitForTimeout(600);
    
    // Verify both sheets exist and first is dimmed
    const allSheetsBefore = page.locator('.sheet-container');
    await expect(allSheetsBefore).toHaveCount(2);
    
    const lowerSheetBefore = allSheetsBefore.first().locator('.sheet');
    const filterBefore = await lowerSheetBefore.evaluate(el => window.getComputedStyle(el).filter);
    expect(filterBefore).toContain('brightness');
    
    // Close the top sheet
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.waitForTimeout(600);
    
    // Verify only one sheet remains
    const allSheetsAfter = page.locator('.sheet-container');
    await expect(allSheetsAfter).toHaveCount(1);
    
    // Verify remaining sheet is no longer dimmed
    const remainingSheet = allSheetsAfter.first().locator('.sheet');
    const filterAfter = await remainingSheet.evaluate(el => window.getComputedStyle(el).filter);
    expect(filterAfter).toBe('none');
    
    // Verify remaining sheet has pointer-events enabled
    const pointerEventsAfter = await remainingSheet.evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(pointerEventsAfter).not.toBe('none');
  });

  test('single sheet has no reveal effect applied', async ({ page }) => {
    // Open a single sheet
    await page.getByRole('button', { name: /Simple Sheet/ }).click();
    await page.waitForSelector('.sheet-container', { state: 'attached', timeout: 2000 });
    await page.waitForTimeout(600);
    
    // Verify only one sheet exists
    const allSheets = page.locator('.sheet-container');
    await expect(allSheets).toHaveCount(1);
    
    // Get the sheet
    const sheet = allSheets.first().locator('.sheet');
    
    // Verify sheet is NOT dimmed
    const filter = await sheet.evaluate(el => window.getComputedStyle(el).filter);
    expect(filter).toBe('none');
    
    // Verify sheet has pointer-events enabled
    const pointerEvents = await sheet.evaluate(el => window.getComputedStyle(el).pointerEvents);
    expect(pointerEvents).not.toBe('none');
  });

  test('lower sheet is partially visible on the left when stacked', async ({ page }) => {
    // Open first sheet
    await page.getByRole('button', { name: /📚 Nested Sheets/ }).click();
    await page.waitForSelector('.sheet-container', { state: 'attached', timeout: 2000 });
    await page.waitForTimeout(600);
    
    // Get bounding box of first sheet before stacking
    const firstSheetBefore = page.locator('.sheet-container').first().locator('.sheet');
    const boundingBoxBefore = await firstSheetBefore.boundingBox();
    
    // Open second sheet
    await page.getByRole('button', { name: 'Open Another Sheet' }).click();
    await page.waitForTimeout(600);
    
    // Get bounding box of first sheet after stacking
    const firstSheetAfter = page.locator('.sheet-container').first().locator('.sheet');
    const boundingBoxAfter = await firstSheetAfter.boundingBox();
    
    // Verify the first sheet is now visible on the left side (shifted left)
    // The x position should be negative or less than before
    expect(boundingBoxAfter).toBeTruthy();
    expect(boundingBoxBefore).toBeTruthy();
    
    if (boundingBoxBefore && boundingBoxAfter) {
      // The sheet should be shifted to the left (negative x or smaller x value)
      expect(boundingBoxAfter.x).toBeLessThan(boundingBoxBefore.x);
    }
  });
});
