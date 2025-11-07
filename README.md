# stimulus-sheet

A Stimulus-based sheet/drawer component that slides in from the right side of the screen.

## Features

- Open a nice sheet from the right
- Stack multiple sheets on top of each other
- Smooth animations using CSS transitions
- Responsive design
- Works with any HTML content

## Installation

### NPM (from GitHub)
```bash
npm install github:gilles-g/sheet @hotwired/stimulus
```

To use a specific version:
```bash
npm install github:gilles-g/sheet#v2.0.0 @hotwired/stimulus
```

### Yarn (from GitHub)
```bash
yarn add github:gilles-g/sheet @hotwired/stimulus
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

### Loading Content Asynchronously

You can load content from a URL using the `addSheetFromUrl` method:

```javascript
const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
const sheetList = application.getControllerForElementAndIdentifier(
  sheetListElement, 
  "sheet-list"
);

// Load sheet content from a URL
await sheetList.addSheetFromUrl('/api/sheets/user-form');
```

This is especially useful when working with server-side rendering, Turbo, or API endpoints.

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

## Documentation

### 📚 Guides & Examples

- **[CodePen Demo](docs/CODEPEN_DEMO.md)** - Try it online with interactive examples
- **[Vite Integration](docs/VITE_INTEGRATION.md)** - Setup with Vite and Turbo
- **[Symfony Integration](docs/SYMFONY_INTEGRATION.md)** - Complete Symfony guide with forms, controllers, and Turbo Streams
- **[Symfony Docker Demo](examples/symfony/README.md)** - 🐳 Complete working Symfony app with Docker and MariaDB - clone and run!
- **[Migration Guide](MIGRATION.md)** - Migrate from ng2-sheet (Angular) to stimulus-sheet

### 🚀 Quick Start Examples

**Basic HTML:**
```html
<button onclick="openMySheet()">Open Sheet</button>

<script>
function openMySheet() {
  const sheetList = document.querySelector('[data-controller="sheet-list"]');
  const controller = application.getControllerForElementAndIdentifier(sheetList, 'sheet-list');
  controller.addSheet('<div class="sheet-content"><h1>Hello!</h1></div>');
}
</script>
```

**With Turbo (Async Loading):**
```javascript
// Load form from server
await sheetList.addSheetFromUrl('/forms/user-edit');

// Server responds with HTML that includes Turbo Frame
// Form submissions can use Turbo Streams to close the sheet
```

**Symfony Example:**
```php
// Controller
#[Route('/users/create-sheet')]
public function createSheet(Request $request): Response {
    $form = $this->createForm(UserType::class, new User());
    return $this->render('user/_form_sheet.html.twig', ['form' => $form]);
}
```

See the [docs](docs/) folder for complete examples.

## Migration from ng2-sheet

If you're migrating from the Angular version (ng2-sheet), see the detailed [Migration Guide](MIGRATION.md).

**Key differences:**
- Framework-agnostic (no Angular required)
- Smaller bundle size (~500KB → ~5KB)
- Simpler API with data attributes
- No jQuery dependency
- Works with Turbo, HTMX, or vanilla JS

## Security

**Important:** The `addSheet()` method accepts raw HTML. Ensure content is from a trusted source or properly sanitized. For dynamic content, use `addSheetFromUrl()` to load from your server.

For user-generated content, use a sanitization library like [DOMPurify](https://github.com/cure53/DOMPurify):

```javascript
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userContent);
sheetList.addSheet(clean);
```

## License

MIT
