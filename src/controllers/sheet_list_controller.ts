import { Controller } from "@hotwired/stimulus";

export default class SheetListController extends Controller {
  static targets = ["container"];

  declare readonly containerTarget: HTMLElement;
  private sheets: HTMLElement[] = [];

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
  addSheet(contentHtml: string) {
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
  async addSheetFromUrl(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      this.addSheet(html);
    } catch (error) {
      console.error('Failed to load sheet content:', error);
      throw error;
    }
  }

  private createSheetElement(contentHtml: string): HTMLElement {
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

  private removeSheet(sheetElement: HTMLElement) {
    const index = this.sheets.indexOf(sheetElement);
    if (index > -1) {
      this.sheets.splice(index, 1);
    }
    
    // Adjust visibility of previous sheet if any
    if (this.sheets.length > 0) {
      const previousSheet = this.sheets[this.sheets.length - 1];
      // Reset transform on previous sheet
      const sheetDiv = previousSheet.querySelector(".sheet") as HTMLElement;
      if (sheetDiv) {
        sheetDiv.style.transform = "translate(0px, 0px)";
      }
    }
  }
}
