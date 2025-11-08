# Local Installation Guide

This guide explains how to install the stimulus-sheet library from a local zip file in your Symfony (or any other) project.

## Why Use a Local Zip?

Using a local zip file allows you to:
- Install the library without internet access
- Use a specific version without relying on GitHub
- Test local modifications before publishing
- Have better control over dependencies in corporate environments

## Step 1: Create the Distributable Zip

In the stimulus-sheet repository, run:

```bash
npm run create-zip
```

This will create a file named `stimulus-sheet-2.0.0.zip` (version number may vary) in the root directory.

## Step 2: Copy and Extract in Your Project

Copy the zip file to your Symfony project and extract it:

```bash
# Copy the zip to your Symfony project
cp stimulus-sheet-2.0.0.zip /path/to/your/symfony/project/

# Navigate to your project
cd /path/to/your/symfony/project/

# Extract the zip
unzip stimulus-sheet-2.0.0.zip
```

This will create a `package` directory containing the library.

## Step 3: Update package.json

In your Symfony project's `package.json`, add or update the dependency:

```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.20",
    "stimulus-sheet": "file:./package"
  }
}
```

**Note:** Replace `"git+https://github.com/gilles-g/sheet.git"` with `"file:./package"` if you were previously using the GitHub installation method.

## Step 4: Install Dependencies

Run npm install:

```bash
npm install
```

This will install the local package just like any other dependency.

## Step 5: Build Your Assets

Build your Symfony assets as usual:

```bash
npm run build
# or
npm run watch
# or
npm run dev
```

## Alternative: Custom Package Directory

If you want to place the package in a different directory:

```bash
# Extract to a custom location
mkdir -p vendor/stimulus-sheet
unzip stimulus-sheet-2.0.0.zip -d vendor/stimulus-sheet/

# Update package.json
{
  "dependencies": {
    "stimulus-sheet": "file:./vendor/stimulus-sheet/package"
  }
}
```

## Updating to a New Version

When a new version is released:

1. Create a new zip: `npm run create-zip`
2. Extract the new zip to replace the old package directory
3. Run `npm install` to update the dependencies
4. Rebuild your assets

## Troubleshooting

### Cache Issues

If you're having issues after updating, try clearing the npm cache:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Wrong Files

Make sure the extracted `package` directory contains:
- `dist/` folder with JS and CSS files
- `package.json`
- `README.md`
- Documentation files

### Build Errors

If you encounter build errors, ensure your Webpack Encore or Vite configuration properly handles the ES modules from the package.

## Example: Symfony Project Structure

After installation, your Symfony project structure should look like:

```
your-symfony-project/
├── assets/
│   ├── bootstrap.js
│   ├── controllers/
│   └── styles/
├── package/                    # ← Extracted stimulus-sheet
│   ├── dist/
│   │   ├── index.js
│   │   ├── index.esm.js
│   │   ├── sheet.css
│   │   └── ...
│   ├── package.json
│   └── README.md
├── package.json                # ← Updated with "file:./package"
├── composer.json
└── ...
```

## CI/CD Considerations

For CI/CD pipelines, you can:

1. **Include the package directory in your repository** (add `package/` to git)
2. **Store the zip in a shared location** and download it during build
3. **Use a private npm registry** (more advanced setup)

The simplest approach for small teams is to commit the `package/` directory to your repository.

## See Also

- [Symfony Integration Guide](../docs/SYMFONY_INTEGRATION.md)
- [Main README](../README.md)
- [Symfony Example](../examples/symfony/)
