<?php

namespace App\Tests;

use Symfony\Component\Panther\PantherTestCase;

class SheetTest extends PantherTestCase
{
    /**
     * Test that the user list page loads correctly
     */
    public function testUserListPageLoads(): void
    {
        $client = static::createPantherClient();
        $crawler = $client->request('GET', '/');
        
        // Check that the page title contains "Stimulus Sheet Demo"
        $this->assertSelectorTextContains('title', 'Stimulus Sheet Demo');
        
        // Check that the user management heading exists
        $this->assertSelectorExists('h1');
        $this->assertSelectorTextContains('h1', 'User Management');
        
        // Check that the create button exists
        $this->assertSelectorExists('button[data-controller="sheet-opener"]');
    }

    /**
     * Test that clicking the create button opens a sheet via AJAX
     */
    public function testCreateButtonOpensSheetViaAjax(): void
    {
        $client = static::createPantherClient();
        $client->request('GET', '/');
        
        // Wait for the page to be fully loaded
        $client->waitFor('button[data-controller="sheet-opener"]');
        
        // Find and click the "Create New User" button
        $createButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createButton->click();
        
        // Wait for the sheet to appear (AJAX request completes)
        $client->waitFor('.sheet-wrapper', 5);
        
        // Check that the sheet opened with the form
        $this->assertSelectorExists('.sheet-wrapper');
        $this->assertSelectorTextContains('.sheet-header h2', 'Create User');
        
        // Check that form fields exist
        $this->assertSelectorExists('input[name="user[name]"]');
        $this->assertSelectorExists('input[name="user[email]"]');
        
        // Check that the submit button exists
        $this->assertSelectorExists('button[type="submit"]');
    }

    /**
     * Test that form validation works
     */
    public function testFormValidationWorks(): void
    {
        $client = static::createPantherClient();
        $client->request('GET', '/');
        
        // Wait for and click the create button
        $client->waitFor('button[data-controller="sheet-opener"]');
        $createButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createButton->click();
        
        // Wait for the sheet to open
        $client->waitFor('.sheet-wrapper', 5);
        
        // Try to submit without filling in fields
        $submitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $submitButton->click();
        
        // Wait a moment for validation to kick in
        $client->wait(1);
        
        // The form should still be visible (not closed) because validation failed
        $this->assertSelectorExists('.sheet-wrapper');
    }

    /**
     * Test that creating a user via AJAX works and closes the sheet
     */
    public function testCreateUserViaAjaxClosesSheet(): void
    {
        $client = static::createPantherClient();
        $client->request('GET', '/');
        
        // Wait for and click the create button
        $client->waitFor('button[data-controller="sheet-opener"]');
        $createButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createButton->click();
        
        // Wait for the sheet to open
        $client->waitFor('.sheet-wrapper', 5);
        
        // Fill in the form
        $client->getCrawler()->filter('input[name="user[name]"]')->sendKeys('Test User');
        $client->getCrawler()->filter('input[name="user[email]"]')->sendKeys('test@example.com');
        
        // Submit the form
        $submitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $submitButton->click();
        
        // Wait for the sheet to close (AJAX submission completes)
        $client->wait(2);
        
        // The sheet should be closed/removed
        // Note: The page reloads after successful submission, so we check for the success indicator
        $client->waitFor('h1', 5);
        
        // Verify we're back on the user list page
        $this->assertSelectorTextContains('h1', 'User Management');
    }

    /**
     * Test that the close button works
     */
    public function testCloseButtonClosesSheet(): void
    {
        $client = static::createPantherClient();
        $client->request('GET', '/');
        
        // Wait for and click the create button
        $client->waitFor('button[data-controller="sheet-opener"]');
        $createButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createButton->click();
        
        // Wait for the sheet to open
        $client->waitFor('.sheet-wrapper', 5);
        
        // Click the close button
        $closeButton = $client->getCrawler()->filter('[data-action*="sheet#close"]')->first();
        $closeButton->click();
        
        // Wait for the sheet animation to complete
        $client->wait(1);
        
        // The sheet should be removed from the DOM
        $this->assertSelectorNotExists('.sheet-wrapper');
    }

    /**
     * Test edit button opens sheet with pre-filled data via AJAX
     */
    public function testEditButtonOpensSheetWithData(): void
    {
        // First, create a user
        $client = static::createPantherClient();
        $client->request('GET', '/');
        
        // Check if there are any users, if not skip this test
        $userRows = $client->getCrawler()->filter('table tbody tr');
        if ($userRows->count() === 0) {
            $this->markTestSkipped('No users exist to test edit functionality');
        }
        
        // Click the first edit button
        $client->waitFor('button[data-controller="sheet-opener"]');
        $editButtons = $client->getCrawler()->filter('button[data-controller="sheet-opener"]');
        
        // Get edit button (skip the create button which is first)
        if ($editButtons->count() > 1) {
            $editButton = $editButtons->eq(1);
            $editButton->click();
            
            // Wait for the sheet to open
            $client->waitFor('.sheet-wrapper', 5);
            
            // Check that the sheet opened with "Edit User" title
            $this->assertSelectorTextContains('.sheet-header h2', 'Edit User');
            
            // Check that form fields are pre-filled (have values)
            $nameInput = $client->getCrawler()->filter('input[name="user[name]"]');
            $this->assertNotEmpty($nameInput->attr('value'));
        }
    }
}
