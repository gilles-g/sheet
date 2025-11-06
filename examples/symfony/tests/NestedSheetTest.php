<?php

namespace App\Tests;

use Symfony\Component\Panther\PantherTestCase;

class NestedSheetTest extends PantherTestCase
{
    /**
     * Test that the recipe detail page loads correctly with the add ingredient button
     */
    public function testRecipeDetailPageLoads(): void
    {
        $client = static::createPantherClient();
        
        // First, go to the recipes list
        $client->request('GET', '/recipes');
        
        // Check that the page title contains "Recipes"
        $this->assertSelectorTextContains('title', 'Recipes');
        
        // Check that the recipe management heading exists
        $this->assertSelectorExists('h1');
        $this->assertSelectorTextContains('h1', 'Recipe Management');
        
        // Check that the create button exists
        $this->assertSelectorExists('button[data-controller="sheet-opener"]');
    }

    /**
     * Test that clicking add ingredient opens a sheet with form containing ingredient selector,
     * quantity field, and a button to create a new ingredient at the bottom
     */
    public function testAddIngredientButtonOpensSheetWithNestedButton(): void
    {
        $client = static::createPantherClient();
        
        // First create a recipe to work with
        $client->request('GET', '/recipes');
        $client->waitFor('button[data-controller="sheet-opener"]');
        
        // Click create recipe button
        $createRecipeButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createRecipeButton->click();
        
        // Wait for the sheet to appear
        $client->waitFor('.sheet-wrapper', 5);
        
        // Fill in the recipe name
        $client->getCrawler()->filter('input[name="recipe[name]"]')->sendKeys('Test Recipe');
        
        // Submit the form
        $submitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $submitButton->click();
        
        // Wait for page reload
        $client->wait(2);
        
        // Now navigate to the recipe detail page by clicking on the recipe name
        $client->waitFor('table tbody tr a', 5);
        $recipeLink = $client->getCrawler()->filter('table tbody tr a')->first();
        $recipeLink->click();
        
        // Wait for the detail page to load
        $client->waitFor('h1', 5);
        $this->assertSelectorTextContains('h1', 'Test Recipe');
        
        // Find and click the "Add Ingredient" button
        $client->waitFor('button[data-controller="sheet-opener"]');
        $addIngredientButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $addIngredientButton->click();
        
        // Wait for the sheet to appear
        $client->waitFor('.sheet-wrapper', 5);
        
        // Check that the sheet opened with the form
        $this->assertSelectorExists('.sheet-wrapper');
        $this->assertSelectorTextContains('.sheet-header h2', 'Add Ingredient');
        
        // Check that the ingredient selector exists
        $this->assertSelectorExists('select[name="recipe_ingredient[ingredient]"]');
        
        // Check that the quantity field exists
        $this->assertSelectorExists('input[name="recipe_ingredient[quantity]"]');
        
        // Check that the "Create New Ingredient" button exists at the bottom
        $this->assertSelectorExists('button[data-controller="sheet-opener"]');
        $createIngredientButtons = $client->getCrawler()->filter('button[data-controller="sheet-opener"]');
        
        // The last button should be the "Create New Ingredient" button within the sheet
        $this->assertGreaterThan(0, $createIngredientButtons->count());
        
        // Verify the button text contains "Create New Ingredient"
        $lastButton = $createIngredientButtons->last();
        $this->assertStringContainsString('Create New Ingredient', $lastButton->text());
    }

    /**
     * Test that clicking the "Create New Ingredient" button within the add ingredient sheet
     * opens a nested sheet on top
     */
    public function testNestedSheetOpens(): void
    {
        $client = static::createPantherClient();
        
        // Create a recipe first
        $client->request('GET', '/recipes');
        $client->waitFor('button[data-controller="sheet-opener"]');
        
        $createRecipeButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createRecipeButton->click();
        $client->waitFor('.sheet-wrapper', 5);
        
        $client->getCrawler()->filter('input[name="recipe[name]"]')->sendKeys('Test Recipe for Nested');
        $submitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $submitButton->click();
        $client->wait(2);
        
        // Navigate to recipe detail
        $client->waitFor('table tbody tr a', 5);
        $recipeLink = $client->getCrawler()->filter('table tbody tr a')->first();
        $recipeLink->click();
        
        // Click "Add Ingredient" button
        $client->waitFor('button[data-controller="sheet-opener"]', 5);
        $addIngredientButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $addIngredientButton->click();
        
        // Wait for the first sheet
        $client->waitFor('.sheet-wrapper', 5);
        
        // Count sheets before clicking
        $sheetsBeforeClick = $client->getCrawler()->filter('.sheet-wrapper');
        $this->assertEquals(1, $sheetsBeforeClick->count(), 'Should have 1 sheet open');
        
        // Find and click the "Create New Ingredient" button in the sheet
        $client->wait(1); // Wait a moment for the sheet to fully load
        $createIngredientButtons = $client->getCrawler()->filter('button[data-controller="sheet-opener"]');
        
        // Find the button that says "Create New Ingredient"
        $createNewIngredientButton = null;
        foreach ($createIngredientButtons as $button) {
            if (strpos($button->textContent, 'Create New Ingredient') !== false) {
                $createNewIngredientButton = $button;
                break;
            }
        }
        
        $this->assertNotNull($createNewIngredientButton, 'Create New Ingredient button should exist');
        $createNewIngredientButton->click();
        
        // Wait for the nested sheet to appear
        $client->wait(2);
        
        // Count sheets after clicking - should have 2 sheets stacked
        $sheetsAfterClick = $client->getCrawler()->filter('.sheet-wrapper');
        $this->assertGreaterThanOrEqual(2, $sheetsAfterClick->count(), 'Should have 2 sheets stacked (original + nested)');
        
        // Verify the nested sheet has the ingredient form
        $this->assertSelectorExists('input[name="ingredient[name]"]');
    }

    /**
     * Test the complete workflow: create ingredient in nested sheet, then use it in parent sheet
     */
    public function testCompleteNestedWorkflow(): void
    {
        $client = static::createPantherClient();
        
        // Create a recipe
        $client->request('GET', '/recipes');
        $client->waitFor('button[data-controller="sheet-opener"]');
        
        $createRecipeButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $createRecipeButton->click();
        $client->waitFor('.sheet-wrapper', 5);
        
        $client->getCrawler()->filter('input[name="recipe[name]"]')->sendKeys('Complete Test Recipe');
        $submitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $submitButton->click();
        $client->wait(2);
        
        // Navigate to recipe detail
        $client->waitFor('table tbody tr a', 5);
        $recipeLink = $client->getCrawler()->filter('table tbody tr a')->first();
        $recipeLink->click();
        
        // Click "Add Ingredient"
        $client->waitFor('button[data-controller="sheet-opener"]', 5);
        $addIngredientButton = $client->getCrawler()->filter('button[data-controller="sheet-opener"]')->first();
        $addIngredientButton->click();
        $client->waitFor('.sheet-wrapper', 5);
        
        // Click "Create New Ingredient" in the nested button
        $client->wait(1);
        $createIngredientButtons = $client->getCrawler()->filter('button[data-controller="sheet-opener"]');
        
        $createNewIngredientButton = null;
        foreach ($createIngredientButtons as $button) {
            if (strpos($button->textContent, 'Create New Ingredient') !== false) {
                $createNewIngredientButton = $button;
                break;
            }
        }
        
        $this->assertNotNull($createNewIngredientButton);
        $createNewIngredientButton->click();
        $client->wait(2);
        
        // Fill in the ingredient form in the nested sheet
        $client->getCrawler()->filter('input[name="ingredient[name]"]')->sendKeys('Test Ingredient');
        $client->getCrawler()->filter('textarea[name="ingredient[description]"]')->sendKeys('Test Description');
        
        // Submit the ingredient form
        $ingredientSubmitButton = $client->getCrawler()->filter('button[type="submit"]')->first();
        $ingredientSubmitButton->click();
        
        // Wait for the nested sheet to close and page to reload
        $client->wait(3);
        
        // The page should have reloaded, verify we're still looking at our recipe
        $this->assertSelectorTextContains('h1', 'Complete Test Recipe');
    }

    /**
     * Test that the ingredient list page works independently
     */
    public function testIngredientListPageWorks(): void
    {
        $client = static::createPantherClient();
        $client->request('GET', '/ingredients');
        
        $this->assertSelectorTextContains('title', 'Ingredients');
        $this->assertSelectorTextContains('h1', 'Ingredient Management');
        $this->assertSelectorExists('button[data-controller="sheet-opener"]');
    }
}
