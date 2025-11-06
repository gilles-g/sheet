import { Controller } from '@hotwired/stimulus';
import { app } from '../bootstrap.js';

export default class extends Controller {
    static values = {
        url: String
    }
    
    async open(event) {
        event.preventDefault();
        
        const button = event.currentTarget;
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = 'Loading...';
        
        try {
            // Get the sheet list controller
            const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
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
            alert('Failed to load form: ' + error.message);
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }
}
