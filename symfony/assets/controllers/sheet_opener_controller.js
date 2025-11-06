import { Controller } from '@hotwired/stimulus';
import { app } from '../bootstrap';

/**
 * Custom controller to help open sheets from URLs
 * 
 * Usage:
 * <button 
 *   data-controller="sheet-opener"
 *   data-action="click->sheet-opener#open"
 *   data-sheet-opener-url-value="/path/to/content">
 *   Open Sheet
 * </button>
 */
export default class extends Controller {
    static values = {
        url: String
    }
    
    async open(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        const originalText = button.textContent;
        
        // Show loading state
        button.disabled = true;
        button.textContent = 'Loading...';
        
        try {
            // Get the sheet list controller
            const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
            if (!sheetListElement) {
                throw new Error('Sheet list element not found');
            }
            
            const sheetList = app.getControllerForElementAndIdentifier(
                sheetListElement,
                'sheet-list'
            );
            
            if (!sheetList) {
                throw new Error('Sheet list controller not found');
            }
            
            // Load content from the URL
            await sheetList.addSheetFromUrl(this.urlValue);
            
        } catch (error) {
            console.error('Failed to open sheet:', error);
            alert('Failed to load content: ' + error.message);
        } finally {
            // Restore button state
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}
