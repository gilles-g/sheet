# CodePen Demo

You can try out stimulus-sheet directly on CodePen with these ready-to-use examples.

## Option 1: Quick Demo Link

🎨 **[Open CodePen Demo](https://codepen.io/pen/)** (Copy the code below into a new pen)

## Option 2: Create Your Own

Follow these steps to create a CodePen demo:

### HTML (Paste in HTML panel)

```html
<div class="demo-container">
  <h1>Stimulus Sheet Demo</h1>
  <p>Click buttons to open sheets from the right</p>
  
  <div class="button-group">
    <button onclick="openSimpleSheet()">Simple Sheet</button>
    <button onclick="openFormSheet()">Form Sheet</button>
    <button onclick="openNestedSheet()">Nested Sheets</button>
  </div>
</div>

<!-- Sheet Container -->
<div class="sheet-holder" data-controller="sheet-list">
  <div data-sheet-list-target="container"></div>
</div>
```

### CSS (Paste in CSS panel)

```css
/* Base styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}

.demo-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  margin: 0 0 10px 0;
  color: #333;
}

p {
  color: #666;
  margin: 0 0 20px 0;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

button:hover {
  background: #0056b3;
}

.btn-close {
  background: #dc3545;
}

.btn-close:hover {
  background: #c82333;
}

/* Sheet Styles */
.sheet-holder {
  position: relative;
}

.sheet-holder .sheet-container:nth-last-of-type(1) .sheet-overlay {
  opacity: 0;
  visibility: hidden;
}

.sheet-holder .sheet-container:nth-last-of-type(2) .sheet-overlay {
  opacity: 0.12;
  visibility: visible;
}

.sheet-holder .sheet-container:nth-last-of-type(3) .sheet-overlay {
  opacity: 0.12;
  visibility: visible;
}

.sheet-holder .sheet-container:last-of-type .sheet {
  transition-delay: 0s, 0.4s, 0.4s;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s, box-shadow 0s, opacity 0s;
}

.sheet-holder .sheet-container:nth-last-of-type(2) .sheet {
  box-shadow: 0 0 10px -5px rgba(0, 0, 0, 0.2), 
              0 0 24px 2px rgba(0, 0, 0, 0.14), 
              0 0 30px 5px rgba(0, 0, 0, 0.12);
}

.sheet-overlay {
  opacity: 0.12;
  transition: all 0.4s;
  background: black;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  visibility: hidden;
  z-index: 2002;
}

.sheet {
  transition: transform 0.4s;
  background: #f3f3f4;
  bottom: 0;
  left: 0;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2002;
  flex-direction: column;
  display: flex;
  flex-wrap: nowrap;
}

.sheet .sheet-content {
  flex: 1 1 auto;
  order: 3;
  overflow-y: auto;
  position: relative;
  margin: 0 auto;
  padding: 24px;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .sheet .sheet-content {
    max-width: 768px;
  }
}

@media (min-width: 1160px) {
  .sheet .sheet-content {
    max-width: 960px;
  }
}

/* Form Styles */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.sheet-header {
  background: white;
  padding: 20px 24px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sheet-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}
```

### JavaScript (Paste in JS panel)

Add these external scripts in Settings > JavaScript:
- `https://unpkg.com/@hotwired/stimulus@3.2.1/dist/stimulus.js` (External Script)

Then add this code:

```javascript
// Import Stimulus from CDN (already loaded as external script)
const { Application, Controller } = Stimulus;

// Sheet Controller
class SheetController extends Controller {
  static targets = ["overlay", "sheet", "content"];
  
  connect() {
    this.updateSheetWidth();
    this.showSheet();
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
    
    const docWidth = document.documentElement.clientWidth;
    this.sheetTarget.style.transform = `translate(${docWidth}px, 0px)`;
    
    this.overlayTarget.style.opacity = "0.12";
    this.overlayTarget.style.visibility = "visible";
    
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
    } else if (width >= 768) {
      padding = Math.floor((width - 768) / 2);
    }
    
    this.maxWidthValue = width - padding;
    this.widthValue = padding;
  }
}

// Sheet List Controller
class SheetListController extends Controller {
  static targets = ["container"];
  
  connect() {
    this.sheets = [];
    window.sheetListController = this;
  }
  
  addSheet(contentHtml) {
    const sheetElement = this.createSheetElement(contentHtml);
    this.containerTarget.appendChild(sheetElement);
    this.sheets.push(sheetElement);
    
    sheetElement.addEventListener("sheet:closed", () => {
      this.removeSheet(sheetElement);
    });
  }
  
  createSheetElement(contentHtml) {
    const sheetContainer = document.createElement("div");
    sheetContainer.className = "sheet-container";
    sheetContainer.setAttribute("data-controller", "sheet");
    
    sheetContainer.innerHTML = `
      <div class="sheet-overlay" 
           data-sheet-target="overlay" 
           data-action="click->sheet#close"></div>
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
    
    if (this.sheets.length > 0) {
      const previousSheet = this.sheets[this.sheets.length - 1];
      const sheetDiv = previousSheet.querySelector(".sheet");
      if (sheetDiv) {
        sheetDiv.style.transform = "translate(0px, 0px)";
      }
    }
  }
}

// Initialize Stimulus
const application = Application.start();
application.register("sheet", SheetController);
application.register("sheet-list", SheetListController);

// Helper functions for demo
function openSimpleSheet() {
  const content = `
    <div class="sheet-header">
      <h2>Simple Sheet</h2>
      <button data-action="click->sheet#close" class="btn-close">Close</button>
    </div>
    <p>This is a simple sheet with some content.</p>
    <p>Click the overlay or the close button to dismiss it.</p>
  `;
  window.sheetListController.addSheet(content);
}

function openFormSheet() {
  const content = `
    <div class="sheet-header">
      <h2>Form Sheet</h2>
      <button data-action="click->sheet#close" class="btn-close">Close</button>
    </div>
    <form onsubmit="handleSubmit(event)">
      <div class="form-group">
        <label>Name:</label>
        <input type="text" placeholder="Enter your name" required>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" required>
      </div>
      <div class="form-group">
        <label>Message:</label>
        <textarea placeholder="Enter your message" required></textarea>
      </div>
      <button type="submit">Submit</button>
      <button type="button" data-action="click->sheet#close">Cancel</button>
    </form>
  `;
  window.sheetListController.addSheet(content);
}

function openNestedSheet() {
  const content = `
    <div class="sheet-header">
      <h2>Nested Sheet Demo</h2>
      <button data-action="click->sheet#close" class="btn-close">Close</button>
    </div>
    <p>You can open multiple sheets on top of each other.</p>
    <p>Click the button below to open another sheet:</p>
    <button onclick="openSimpleSheet()">Open Another Sheet</button>
  `;
  window.sheetListController.addSheet(content);
}

function handleSubmit(event) {
  event.preventDefault();
  alert('Form submitted! (This is a demo)');
}
```

## CodePen Settings

1. **HTML Preprocessor**: None
2. **CSS Preprocessor**: None  
3. **JS Preprocessor**: None (using ES6)
4. **External Scripts**: 
   - `https://unpkg.com/@hotwired/stimulus@3.2.1/dist/stimulus.js`

## Features Demonstrated

✅ Opening sheets from the right  
✅ Multiple sheet types (simple, form, nested)  
✅ Stacking multiple sheets  
✅ Click overlay to close  
✅ Smooth animations  
✅ Responsive design  

## Try It Yourself

1. Go to [codepen.io/pen](https://codepen.io/pen/)
2. Copy the HTML, CSS, and JavaScript above into their respective panels
3. Add the external script in Settings
4. Click "Save" and share your pen!

## Customization Ideas

- Add different animation speeds
- Change colors and styling
- Add validation to the form
- Integrate with your own API
- Add loading states
- Create custom sheet templates

## Full Implementation

For a production-ready implementation with TypeScript, build tools, and more features, install the npm package:

```bash
npm install stimulus-sheet @hotwired/stimulus
```

See the main README for full documentation.
