# Quick Start Guide

Get the Symfony + stimulus-sheet demo running in 3 simple steps!

## 1. Install Dependencies

```bash
cd symfony

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

## 2. Build Assets

```bash
# Build for development
npm run dev

# Or watch for changes
npm run watch
```

## 3. Start the Server

```bash
# Using PHP built-in server
php -S localhost:8000 -t public/

# Or using Symfony CLI (if installed)
symfony serve
```

Then open your browser at **http://localhost:8000**

## What You'll See

- A demo homepage with information about the setup
- A button to "Open Example Sheet" that demonstrates the stimulus-sheet component
- Working examples of forms and content that can be loaded in sheets

## Next Steps

1. Check out the [README.md](README.md) for detailed documentation
2. Explore the example controller at `src/Controller/DefaultController.php`
3. See the templates in `templates/default/`
4. Read the [Symfony Integration Guide](../docs/SYMFONY_INTEGRATION.md) for advanced usage

## Customization

### Add Your Own Controllers

```bash
# Using Symfony Maker (if you have it installed)
php bin/console make:controller MyController
```

### Add More Stimulus Controllers

Create new controllers in `assets/controllers/` and they'll be automatically registered.

### Modify Styles

Edit `assets/styles/app.css` to customize the appearance.

## Troubleshooting

**Assets not loading?**
- Make sure you ran `npm run build` or `npm run dev`
- Check that `public/build/` directory exists and contains files

**Sheet not working?**
- Check browser console for JavaScript errors
- Ensure assets are properly built
- Verify that `window.Stimulus` is available in the browser console

## Need Help?

- Read the [full README](README.md)
- Check the [parent project documentation](../README.md)
- Review the [Symfony Integration Guide](../docs/SYMFONY_INTEGRATION.md)
