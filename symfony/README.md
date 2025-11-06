# Symfony Project with Webpack Encore and stimulus-sheet

This is a Symfony 7.1 project with Webpack Encore configured for asset management. It includes the stimulus-sheet component for creating slide-in panels.

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- npm

## Installation

The project is already set up with all necessary dependencies. If you need to reinstall:

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

## Building Assets

To build assets for development:

```bash
npm run dev
```

To watch for changes and rebuild automatically:

```bash
npm run watch
```

To build for production:

```bash
npm run build
```

## Running the Application

Start the Symfony development server:

```bash
# Using Symfony CLI (if installed)
symfony serve

# Or using PHP built-in server
php -S localhost:8000 -t public/
```

Then open your browser at `http://localhost:8000`

## Features

### Webpack Encore

- Configured for processing JavaScript and CSS
- Babel transpilation for ES6+ support
- CSS extraction and minification
- Source maps for development

### Stimulus Integration

- Symfony UX Stimulus Bridge for automatic controller registration
- stimulus-sheet controllers pre-registered:
  - `sheet`: Individual sheet controller
  - `sheet-list`: Container controller for managing multiple sheets

### Turbo

- Symfony UX Turbo for fast page transitions
- Ready for async content loading in sheets

## Usage

### Basic Sheet Example

The default controller at `/` demonstrates opening a sheet with JavaScript:

```javascript
const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
const sheetList = app.getControllerForElementAndIdentifier(sheetListElement, 'sheet-list');
sheetList.addSheet('<div class="sheet-content">Your content here</div>');
```

### Using the Sheet Opener Controller

A custom `sheet-opener` controller is included for easier integration:

```html
<button 
    data-controller="sheet-opener"
    data-action="click->sheet-opener#open"
    data-sheet-opener-url-value="{{ path('app_sheet_example') }}">
    Open Sheet
</button>
```

This will load the content from the specified URL into a sheet.

## Project Structure

```
symfony/
├── assets/
│   ├── bootstrap.js           # Stimulus initialization
│   ├── app.js                 # Main entry point
│   ├── controllers/           # Stimulus controllers
│   │   └── sheet_opener_controller.js
│   └── styles/
│       └── app.css            # Main stylesheet with stimulus-sheet CSS
├── config/                    # Symfony configuration
├── public/
│   ├── build/                 # Compiled assets (generated)
│   └── index.php              # Front controller
├── src/
│   └── Controller/
│       └── DefaultController.php
├── templates/
│   ├── base.html.twig         # Base template with sheet-holder
│   └── default/
│       ├── index.html.twig
│       └── sheet_example.html.twig
├── webpack.config.js          # Webpack Encore configuration
└── package.json               # Node.js dependencies
```

## Stimulus Sheet

The stimulus-sheet component is installed from the parent directory (`file:..`). This allows you to test the latest version of the component.

### Features:
- Slide-in panels from the right
- Stack multiple sheets
- Smooth animations
- Close on overlay click or button
- Load content from URLs asynchronously

## Documentation

For more information about using stimulus-sheet with Symfony:

- [Symfony Integration Guide](../docs/SYMFONY_INTEGRATION.md)
- [stimulus-sheet Documentation](../README.md)

## Development

### Adding New Controllers

Create new controllers in `assets/controllers/`:

```bash
# Create a new controller manually
touch assets/controllers/my_controller.js
```

Or use Symfony Maker:

```bash
php bin/console make:controller MyController
```

### Styling

Add your styles to `assets/styles/app.css` or create new CSS files and import them in `app.js`.

### Building the Parent Package

If you make changes to the stimulus-sheet package in the parent directory, rebuild it:

```bash
cd ..
npm run build
cd symfony
npm run build
```

## Troubleshooting

### Assets not loading

Make sure you've built the assets:

```bash
npm run dev
```

### Stimulus controllers not registered

Check that the webpack build completed successfully and that `public/build/` contains the compiled files.

### Sheet not opening

1. Check browser console for errors
2. Ensure the sheet-holder element is in base.html.twig
3. Verify assets are built and loaded
4. Check that stimulus-sheet is properly imported in bootstrap.js

## License

This Symfony application is UNLICENSED (private project).
The stimulus-sheet component is licensed under MIT.
