# stimulus-sheet

A Stimulus-based sheet/drawer component that slides in from the right side of the screen.

## Features

- Open a nice sheet from the right
- Stack multiple sheets on top of each other
- Smooth animations using CSS transitions
- Responsive design
- Works with any HTML content

## Installation

### NPM
```bash
npm install stimulus-sheet @hotwired/stimulus
```

### Yarn
```bash
yarn add stimulus-sheet @hotwired/stimulus
```

## Setup

First, import the CSS in your application:

```css
@import 'stimulus-sheet/dist/sheet.css';
```

Then register the controllers with your Stimulus application:

```javascript
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";

const application = Application.start();
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);
```

## Usage

### Basic Setup

Add the sheet list container to your HTML:

```html
<div class="sheet-holder" data-controller="sheet-list">
  <div data-sheet-list-target="container"></div>
</div>
```

### Opening a Sheet

To open a sheet with custom content, use JavaScript:

```javascript
// Get the sheet list controller
const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
const sheetList = this.application.getControllerForElementAndIdentifier(
  sheetListElement, 
  "sheet-list"
);

// Add a sheet with your content
const content = `
  <div class="sheet-header">
    <h2>My Sheet Title</h2>
    <button data-action="click->sheet#close">Close</button>
  </div>
  <div class="sheet-scrollpane">
    <div class="sheet-content">
      <p>Your content here...</p>
    </div>
  </div>
`;

sheetList.addSheet(content);
```

### Simplified API

For easier access, you can create a helper function:

```javascript
export function openSheet(content) {
  const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
  if (sheetListElement && sheetListElement.dataset.sheetListController) {
    const controller = sheetListElement.dataset.sheetListController;
    controller.addSheet(content);
  }
}

// Usage
openSheet('<div class="sheet-content"><h1>Hello!</h1></div>');
```

### Closing a Sheet

Sheets can be closed by:
1. Clicking the overlay
2. Calling the close action: `data-action="click->sheet#close"`
3. Programmatically via the controller

```html
<button data-action="click->sheet#close">Close</button>
```

### Stacking Multiple Sheets

You can open multiple sheets on top of each other. Each new sheet will slide in from the right and stack on top of the previous one.

## Styling

The component comes with default styles, but you can customize them by overriding the CSS variables or classes:

```css
.sheet {
  background: #ffffff; /* Change background color */
}

.sheet-overlay {
  background: rgba(0, 0, 0, 0.5); /* Change overlay opacity */
}
```

## Browser Support

This component works in all modern browsers that support:
- CSS Transitions
- ES2017
- Stimulus 3.x

## Migration from ng2-sheet

If you're migrating from the Angular version (ng2-sheet), the main concepts remain the same but the implementation is simpler:

- No need for dependency injection or services
- Use standard HTML data attributes instead of Angular directives
- Controllers are automatically instantiated by Stimulus
- Events are handled through Stimulus actions

## License

MIT
