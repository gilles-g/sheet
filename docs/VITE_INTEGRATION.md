# Vite Integration Guide

This guide shows how to integrate `stimulus-sheet` with Vite and Turbo for modern web applications.

## Installation

```bash
npm install stimulus-sheet @hotwired/stimulus @hotwired/turbo
```

## Basic Setup

### 1. Create your Vite project

```bash
npm create vite@latest my-app
cd my-app
npm install
```

### 2. Install dependencies

```bash
npm install stimulus-sheet @hotwired/stimulus @hotwired/turbo
```

### 3. Setup Stimulus Application

Create `src/application.js`:

```javascript
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";
import * as Turbo from "@hotwired/turbo";

// Start Stimulus
const application = Application.start();

// Register sheet controllers
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);

// Export for use in other modules
export { application };
```

### 4. Import CSS

In your `src/main.js` or `src/main.ts`:

```javascript
import './style.css';
import 'stimulus-sheet/dist/sheet.css';
import './application.js';
```

### 5. Add HTML structure

In your `index.html` or main template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <div id="app">
    <!-- Your app content -->
    <button data-action="click->demo#openSheet">Open Sheet</button>
    
    <!-- Sheet container -->
    <div class="sheet-holder" data-controller="sheet-list">
      <div data-sheet-list-target="container"></div>
    </div>
  </div>
  
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

## Using with Turbo Frames and Streams

### Loading Content Asynchronously

Create a Stimulus controller to handle sheet opening with Turbo:

```javascript
// src/controllers/demo_controller.js
import { Controller } from "@hotwired/stimulus";
import { application } from "../application";

export default class extends Controller {
  openSheet(event) {
    event.preventDefault();
    
    // Get sheet list controller
    const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
    const sheetList = application.getControllerForElementAndIdentifier(
      sheetListElement,
      "sheet-list"
    );
    
    // Load content from URL using fetch
    const url = event.currentTarget.dataset.sheetUrl || '/sheets/example';
    sheetList.addSheetFromUrl(url);
  }
}

// Register the controller
application.register("demo", DemoController);
```

### Complete Example with Vite

```javascript
// src/main.js
import './style.css';
import 'stimulus-sheet/dist/sheet.css';
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";
import * as Turbo from "@hotwired/turbo";
import { Controller } from "@hotwired/stimulus";

// Initialize Stimulus
const application = Application.start();
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);

// Demo controller
class DemoController extends Controller {
  async openSheet(event) {
    event.preventDefault();
    
    const url = event.currentTarget.dataset.url;
    
    const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
    const sheetList = application.getControllerForElementAndIdentifier(
      sheetListElement,
      "sheet-list"
    );
    
    try {
      await sheetList.addSheetFromUrl(url);
    } catch (error) {
      console.error('Failed to open sheet:', error);
      alert('Failed to load content');
    }
  }
}

application.register("demo", DemoController);
```

## Development & Build

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

See [SYMFONY_INTEGRATION.md](SYMFONY_INTEGRATION.md) for Symfony-specific examples.
