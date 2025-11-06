# Migration Guide: ng2-sheet to stimulus-sheet

This guide will help you migrate from the Angular-based ng2-sheet (v1.x) to the Stimulus-based stimulus-sheet (v2.x).

## Overview of Changes

The v2.0 release is a complete rewrite of the sheet component using Stimulus instead of Angular. This makes the component framework-agnostic and easier to integrate into any web application.

### Key Differences

| Feature | ng2-sheet (v1.x) | stimulus-sheet (v2.x) |
|---------|------------------|----------------------|
| Framework | Angular 4+ | Stimulus 3+ |
| Dependencies | Angular, RxJS, jQuery | Stimulus only |
| Size | ~500KB+ | ~5KB |
| Integration | Angular module | Stimulus controllers |
| API | Service-based | Data attributes |

## Breaking Changes

### 1. Framework Dependency

**Before (Angular):**
```typescript
import { NgModule } from '@angular/core';
import { SheetModule } from 'ng2-sheet';

@NgModule({
  imports: [SheetModule]
})
export class AppModule { }
```

**After (Stimulus):**
```javascript
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";

const application = Application.start();
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);
```

### 2. HTML Template

**Before (Angular):**
```html
<ng-template #sheetListContainer></ng-template>
```

**After (Stimulus):**
```html
<div class="sheet-holder" data-controller="sheet-list">
  <div data-sheet-list-target="container"></div>
</div>
```

### 3. Opening Sheets

**Before (Angular with Service):**
```typescript
export class MyComponent {
  sheetList: SheetListComponent;
  
  constructor(private sheetListService: SheetListService) {
    this.sheetList = this.sheetListService.getComponent();
  }
  
  openSheet() {
    this.sheetList.addSheet(TestComponent, 'TestComponent', {
      model: this.model
    });
  }
}
```

**After (Stimulus):**
```javascript
function openSheet() {
  const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
  const controller = application.getControllerForElementAndIdentifier(
    sheetListElement, 
    "sheet-list"
  );
  
  const content = `
    <div class="sheet-content">
      <h2>My Sheet</h2>
      <button data-action="click->sheet#close">Close</button>
    </div>
  `;
  
  controller.addSheet(content);
}
```

### 4. Component Interaction

**Before (Angular with RxJS):**
```typescript
this.sheetList.onComponentCreated.subscribe((params) => {
  const component = params.cmp;
  component.instance.someValues$.subscribe(value => {
    // Handle value
  });
});
```

**After (Stimulus with Events):**
```javascript
// Use custom events or Stimulus actions
document.addEventListener('sheet:closed', (event) => {
  // Handle sheet closed
});
```

## Step-by-Step Migration

### Step 1: Update Dependencies

Remove Angular dependencies:
```bash
npm uninstall ng2-sheet @angular/core @angular/common
```

Install Stimulus and stimulus-sheet:
```bash
npm install stimulus-sheet @hotwired/stimulus
```

### Step 2: Update CSS Import

Replace the Angular component styles with the new CSS file:

```css
/* Remove any ng2-sheet imports */
/* Add new import */
@import 'stimulus-sheet/dist/sheet.css';
```

### Step 3: Initialize Stimulus

Create or update your Stimulus application setup:

```javascript
// app.js or main.js
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";

const application = Application.start();
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);

export { application };
```

### Step 4: Update HTML

Replace Angular templates with Stimulus data attributes:

```html
<!-- Remove old template -->
<!-- <ng-template #sheetListContainer></ng-template> -->

<!-- Add new Stimulus markup -->
<div class="sheet-holder" data-controller="sheet-list">
  <div data-sheet-list-target="container"></div>
</div>
```

### Step 5: Update Sheet Opening Logic

Convert service-based sheet opening to direct controller access:

```javascript
// Helper function to open sheets
export function openSheet(contentHtml) {
  const element = document.querySelector('[data-controller="sheet-list"]');
  if (element) {
    const controller = application.getControllerForElementAndIdentifier(
      element,
      "sheet-list"
    );
    controller.addSheet(contentHtml);
  }
}

// Usage
openSheet(`
  <div class="sheet-content">
    <h2>My Content</h2>
    <button data-action="click->sheet#close">Close</button>
  </div>
`);
```

### Step 6: Replace Component-Based Content with HTML

Instead of passing Angular components, you now pass HTML strings. You can use template literals or template engines:

```javascript
// Create content dynamically
function createUserSheet(user) {
  return `
    <div class="sheet-content">
      <h2>${user.name}</h2>
      <p>Email: ${user.email}</p>
      <button data-action="click->sheet#close">Close</button>
    </div>
  `;
}

openSheet(createUserSheet({ name: 'John', email: 'john@example.com' }));
```

## Migration Checklist

- [ ] Remove ng2-sheet and Angular dependencies
- [ ] Install stimulus-sheet and @hotwired/stimulus
- [ ] Set up Stimulus application
- [ ] Register sheet controllers
- [ ] Update HTML templates from Angular to Stimulus
- [ ] Convert service-based sheet opening to controller-based
- [ ] Replace component passing with HTML content
- [ ] Update event handling from RxJS to DOM events
- [ ] Test all sheet functionality
- [ ] Update CSS imports

## Benefits of Migration

1. **Smaller Bundle Size**: Stimulus is much lighter than Angular
2. **Framework Agnostic**: Works with any frontend framework or vanilla JS
3. **Simpler API**: Direct DOM manipulation with data attributes
4. **No jQuery**: Pure CSS animations instead of jQuery
5. **Better Performance**: Less overhead, faster initialization
6. **Easier Testing**: Standard DOM testing instead of Angular testing utilities

## Need Help?

If you encounter issues during migration:

1. Check the example.html file for working examples
2. Review the README.md for API documentation
3. Open an issue on GitHub with your migration question

## Legacy Support

The Angular version (v1.x) is still available on the `legacy` branch and npm with the package name `ng2-sheet`. However, it will no longer receive updates. We recommend migrating to v2.x for continued support and improvements.
