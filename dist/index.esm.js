import { Controller } from '@hotwired/stimulus';

class SheetController extends Controller {
    connect() {
        this.updateSheetWidth();
        this.showSheet();
    }
    disconnect() {
        // Cleanup when controller is disconnected
    }
    close() {
        this.closeSheet();
    }
    closeSheet() {
        this.overlayTarget.style.opacity = "0";
        const docWidth = document.documentElement.clientWidth;
        this.sheetTarget.style.transform = `translate(${docWidth}px, 0px)`;
        setTimeout(() => {
            this.element.remove();
            this.dispatch("closed", { detail: {} });
        }, 500);
    }
    showSheet() {
        this.calculateWidth();
        // Initial state - sheet is off-screen
        const docWidth = document.documentElement.clientWidth;
        this.sheetTarget.style.transform = `translate(${docWidth}px, 0px)`;
        // Show overlay
        this.overlayTarget.style.opacity = "0.12";
        this.overlayTarget.style.visibility = "visible";
        // Animate sheet in
        setTimeout(() => {
            this.sheetTarget.style.transform = `translate(${this.widthValue}px, 0px)`;
        }, 100);
    }
    updateSheetWidth() {
        this.calculateWidth();
        this.sheetTarget.style.maxWidth = `${this.maxWidthValue}px`;
    }
    calculateWidth() {
        const width = document.documentElement.clientWidth;
        let padding = 0;
        if (width >= 1160) {
            padding = Math.floor((width - 960) / 2);
        }
        else if (width >= 768) {
            padding = Math.floor((width - 768) / 2);
        }
        this.maxWidthValue = width - padding;
        this.widthValue = padding;
    }
}
SheetController.targets = ["overlay", "sheet", "content"];
SheetController.values = {
    width: Number,
    maxWidth: Number
};

class SheetListController extends Controller {
    constructor() {
        super(...arguments);
        this.sheets = [];
    }
    connect() {
        // Initialize sheet list
    }
    disconnect() {
        // Cleanup
    }
    /**
     * Add a new sheet with the provided HTML content.
     *
     * SECURITY WARNING: This method accepts raw HTML and inserts it into the DOM.
     * Ensure the content is from a trusted source or properly sanitized before calling this method.
     * For user-generated content, use a sanitization library like DOMPurify.
     *
     * @param contentHtml - Trusted HTML content to display in the sheet
     */
    addSheet(contentHtml) {
        const sheetElement = this.createSheetElement(contentHtml);
        this.containerTarget.appendChild(sheetElement);
        this.sheets.push(sheetElement);
        // Listen for close events
        sheetElement.addEventListener("sheet:closed", () => {
            this.removeSheet(sheetElement);
        });
    }
    /**
     * Add a sheet by loading content from a URL (safe alternative to addSheet).
     * This is the recommended approach when loading dynamic content.
     *
     * @param url - URL to fetch content from
     */
    async addSheetFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.addSheet(html);
        }
        catch (error) {
            console.error('Failed to load sheet content:', error);
            throw error;
        }
    }
    createSheetElement(contentHtml) {
        const sheetContainer = document.createElement("div");
        sheetContainer.className = "sheet-container";
        sheetContainer.setAttribute("data-controller", "sheet");
        sheetContainer.innerHTML = `
      <div class="sheet-overlay" data-sheet-target="overlay" data-action="click->sheet#close"></div>
      <div class="sheet" data-sheet-target="sheet">
        <div class="sheet-content" data-sheet-target="content">
          ${contentHtml}
        </div>
      </div>
    `;
        return sheetContainer;
    }
    removeSheet(sheetElement) {
        const index = this.sheets.indexOf(sheetElement);
        if (index > -1) {
            this.sheets.splice(index, 1);
        }
        // Adjust visibility of previous sheet if any
        if (this.sheets.length > 0) {
            const previousSheet = this.sheets[this.sheets.length - 1];
            // Reset transform on previous sheet
            const sheetDiv = previousSheet.querySelector(".sheet");
            if (sheetDiv) {
                sheetDiv.style.transform = "translate(0px, 0px)";
            }
        }
    }
}
SheetListController.targets = ["container"];

export { SheetController, SheetListController };
//# sourceMappingURL=index.esm.js.map
