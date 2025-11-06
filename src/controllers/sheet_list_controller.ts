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

  addSheet(contentHtml: string) {
    const sheetElement = this.createSheetElement(contentHtml);
    this.containerTarget.appendChild(sheetElement);
    this.sheets.push(sheetElement);

    // Listen for close events
    sheetElement.addEventListener("sheet:closed", () => {
      this.removeSheet(sheetElement);
    });
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
