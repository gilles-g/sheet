# Stimulus Sheet - Live Demo

This directory contains a live demo of the Stimulus Sheet component that can be hosted on GitHub Pages.

## View the Demo

You can view the live demo at: `https://gilles-g.github.io/sheet/`

## Local Development

To run the demo locally:

1. Start a local HTTP server from the repository root:
   ```bash
   python3 -m http.server 8080
   # or
   npx http-server -p 8080
   ```

2. Open your browser to: `http://localhost:8080/docs/index.html`

## How It Works

The demo uses:
- **Local Stimulus.js** - Copied from node_modules to `docs/vendor/stimulus.js`
- **Import maps** - To resolve the `@hotwired/stimulus` module specifier
- **Built library** - The compiled controllers from `../dist/index.esm.js`
- **CSS styles** - From `../dist/sheet.css`

## GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to your repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch (e.g., `main` or `master`)
4. Select the `/docs` folder
5. Click "Save"

GitHub Pages will automatically serve the `index.html` file from the `docs` folder.

## Features Demonstrated

The demo showcases:
- ✨ Simple sheet opening
- 📝 Form sheets with inputs
- 📚 Nested/stacked sheets
- ℹ️ Information panels
- 📄 Scrollable long content
- Smooth animations and transitions
- Overlay click-to-close
- Responsive design

## Updating the Demo

After making changes to the library:

1. Build the library: `npm run build`
2. The demo will automatically use the updated files from `dist/`
3. If Stimulus.js needs updating, copy it again:
   ```bash
   cp node_modules/@hotwired/stimulus/dist/stimulus.js docs/vendor/stimulus.js
   ```
