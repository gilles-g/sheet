# Quick Start: Using the Zip in Symfony

This is a quick reference for using the stimulus-sheet zip distribution in a Symfony project.

## 1. Generate and Extract

```bash
# In the stimulus-sheet repository
npm run create-zip

# Copy to your Symfony project
cp stimulus-sheet-2.0.0.zip ~/my-symfony-project/

# Navigate and extract
cd ~/my-symfony-project/
unzip stimulus-sheet-2.0.0.zip
```

## 2. Update package.json

**Before:**
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "stimulus-sheet": "git+https://github.com/gilles-g/sheet.git"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "stimulus-sheet": "file:./package"
  }
}
```

## 3. Install and Build

```bash
npm install
npm run build
```

That's it! The library is now installed from the local package.

## Directory Structure

```
my-symfony-project/
├── assets/
│   ├── bootstrap.js          # Import and register here
│   └── styles/
│       └── app.css           # Import CSS here
├── package/                   # ← Extracted from zip
│   ├── dist/
│   │   ├── index.js
│   │   ├── index.esm.js
│   │   └── sheet.css
│   └── package.json
├── package.json               # ← Updated to use file:./package
└── ...
```

## Usage in bootstrap.js

```javascript
import { Application } from "@hotwired/stimulus";
import { SheetController, SheetListController } from "stimulus-sheet";

const app = Application.start();
app.register("sheet", SheetController);
app.register("sheet-list", SheetListController);
```

## Import CSS in app.css

```css
@import 'stimulus-sheet/dist/sheet.css';
```

## Benefits

✅ **Offline Installation** - No internet required  
✅ **Version Control** - Lock to specific version  
✅ **Faster CI/CD** - No GitHub download needed  
✅ **Corporate Friendly** - Works behind firewalls  

## See Full Documentation

- [Local Installation Guide](LOCAL_INSTALLATION.md) - Complete guide
- [Symfony Integration](SYMFONY_INTEGRATION.md) - Detailed Symfony setup
- [Main README](../README.md) - Library documentation
