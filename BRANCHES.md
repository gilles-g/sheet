# Branch Structure

This repository has been refactored from Angular to Stimulus. The branch structure is as follows:

## Branches

### `copilot/refactor-project-to-stimulus` (current, to become `main`)
This branch contains the new Stimulus-based implementation (v2.x). This is the active development branch and represents the future of the project.

**Features:**
- Stimulus framework
- Modern ES modules
- No jQuery dependency
- Smaller bundle size
- Framework-agnostic

### `legacy` (to be created from old main)
The legacy branch will contain the Angular-based implementation (v1.x). This branch is maintained for reference but will not receive new features.

**Features:**
- Angular 4+ framework
- RxJS observables
- jQuery animations
- Angular-specific implementation

## Branch Strategy

1. **Current State**: All new Stimulus code is in `copilot/refactor-project-to-stimulus`
2. **Next Steps** (requires repository maintainer action):
   - Create a `legacy` branch from the original main/master branch
   - Merge `copilot/refactor-project-to-stimulus` into `main`
   - Set `main` as the default branch

## Version Strategy

- **v1.x** (legacy branch): Angular-based, maintenance mode
- **v2.x+** (main branch): Stimulus-based, active development

## NPM Publishing

- `ng2-sheet@1.x` - Legacy Angular version
- `stimulus-sheet@2.x` - New Stimulus version (recommended)

### Installing from GitHub

This package is distributed via GitHub releases. To install it in your project:

```bash
npm install github:gilles-g/sheet
```

Or to use a specific version/tag:

```bash
npm install github:gilles-g/sheet#v2.0.0
```

Add to your `package.json`:

```json
{
  "dependencies": {
    "stimulus-sheet": "github:gilles-g/sheet"
  }
}
```

### Creating Releases

To create a new release:

1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. Push the tag to GitHub:
   ```bash
   git push --follow-tags
   ```

3. The GitHub Actions workflow will automatically:
   - Build the package
   - Create a GitHub release with release notes

Users can then install the package using:
```bash
npm install github:gilles-g/sheet#v2.0.1  # specific version
npm install github:gilles-g/sheet         # latest from main branch
```

## For Repository Maintainers

To complete the branch restructure:

```bash
# Assuming you're on the old main branch
git checkout main  # or master
git branch legacy  # Create legacy branch
git push origin legacy

# Switch to the refactor branch
git checkout copilot/refactor-project-to-stimulus
git branch -m main  # Rename local branch to main
git push origin main  # Push new main
git push origin --delete copilot/refactor-project-to-stimulus  # Delete old branch

# Update default branch on GitHub to 'main' via repository settings
```

Alternatively, you can:
1. Go to GitHub repository settings
2. Set `copilot/refactor-project-to-stimulus` as the default branch
3. Rename it to `main` via the GitHub UI
4. Create a `legacy` branch from the old code

## Documentation

- See [MIGRATION.md](MIGRATION.md) for migration guide from v1.x to v2.x
- See [README.md](README.md) for current (Stimulus) usage
