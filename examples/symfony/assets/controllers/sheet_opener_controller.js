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
            
            // Show error notification using Bootstrap toast-like alert
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            errorDiv.style.zIndex = '9999';
            errorDiv.innerHTML = `
                <strong>Error:</strong> Failed to load form. ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(errorDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }
}
