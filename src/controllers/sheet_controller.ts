import { Controller } from "@hotwired/stimulus";

export default class SheetController extends Controller {
  static targets = ["overlay", "sheet", "content"];
  static values = {
    width: Number,
    maxWidth: Number
  };

  declare readonly overlayTarget: HTMLElement;
  declare readonly sheetTarget: HTMLElement;
  declare readonly contentTarget: HTMLElement;
  declare widthValue: number;
  declare maxWidthValue: number;

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
    
    // Push previous sheets to the left to reveal them
    this.pushPreviousSheetsLeft();
    
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

  private pushPreviousSheetsLeft() {
    // Find all sheet containers
    const container = this.element.parentElement;
    if (!container) return;
    
    const allSheets = container.querySelectorAll('.sheet-container .sheet');
    // Push all existing sheets (except this one) to the left
    allSheets.forEach((sheet) => {
      if (sheet !== this.sheetTarget) {
        const htmlSheet = sheet as HTMLElement;
        htmlSheet.style.transform = 'translateX(-60px)';
      }
    });
  }

  updateSheetWidth() {
    this.calculateWidth();
    this.sheetTarget.style.maxWidth = `${this.maxWidthValue}px`;
  }

  private calculateWidth() {
    const width = document.documentElement.clientWidth;
    let padding = 0;

    if (width >= 1160) {
      padding = Math.floor((width - 960) / 2);
    } else if (width >= 768) {
      padding = Math.floor((width - 768) / 2);
    }

    this.maxWidthValue = width - padding;
    this.widthValue = padding;
  }
}
