import { Controller } from "@hotwired/stimulus";
export default class SheetController extends Controller {
    static targets: string[];
    static values: {
        width: NumberConstructor;
        maxWidth: NumberConstructor;
    };
    readonly overlayTarget: HTMLElement;
    readonly sheetTarget: HTMLElement;
    readonly contentTarget: HTMLElement;
    widthValue: number;
    maxWidthValue: number;
    connect(): void;
    disconnect(): void;
    close(): void;
    closeSheet(): void;
    showSheet(): void;
    updateSheetWidth(): void;
    private calculateWidth;
}
