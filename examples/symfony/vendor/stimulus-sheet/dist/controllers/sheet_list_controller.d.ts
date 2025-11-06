import { Controller } from "@hotwired/stimulus";
export default class SheetListController extends Controller {
    static targets: string[];
    readonly containerTarget: HTMLElement;
    private sheets;
    connect(): void;
    disconnect(): void;
    /**
     * Add a new sheet with the provided HTML content.
     *
     * SECURITY WARNING: This method accepts raw HTML and inserts it into the DOM.
     * Ensure the content is from a trusted source or properly sanitized before calling this method.
     * For user-generated content, use a sanitization library like DOMPurify.
     *
     * @param contentHtml - Trusted HTML content to display in the sheet
     */
    addSheet(contentHtml: string): void;
    /**
     * Add a sheet by loading content from a URL (safe alternative to addSheet).
     * This is the recommended approach when loading dynamic content.
     *
     * @param url - URL to fetch content from
     */
    addSheetFromUrl(url: string): Promise<void>;
    private createSheetElement;
    private removeSheet;
}
