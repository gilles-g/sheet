#!/bin/bash

# Script to create a distributable zip file of the stimulus-sheet library
# This zip can be used for local installation in projects via package.json

set -e

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
ZIP_NAME="stimulus-sheet-${VERSION}.zip"
TEMP_DIR=$(mktemp -d)

echo "Creating distributable zip: ${ZIP_NAME}"

# Create package directory structure
PACKAGE_DIR="${TEMP_DIR}/package"
mkdir -p "${PACKAGE_DIR}"

# Copy necessary files
echo "Copying files..."
cp -r dist "${PACKAGE_DIR}/"
cp package.json "${PACKAGE_DIR}/"
cp README.md "${PACKAGE_DIR}/"
cp MIGRATION.md "${PACKAGE_DIR}/"
cp BRANCHES.md "${PACKAGE_DIR}/"
cp SECURITY.md "${PACKAGE_DIR}/"

# Copy docs directory if it exists
if [ -d "docs" ]; then
  cp -r docs "${PACKAGE_DIR}/"
fi

# Create the zip file
echo "Creating zip archive..."
cd "${TEMP_DIR}"
zip -r "${ZIP_NAME}" package/ -q

# Move zip to project root
mv "${ZIP_NAME}" "${OLDPWD}/"

# Cleanup
cd "${OLDPWD}"
rm -rf "${TEMP_DIR}"

echo "✓ Created ${ZIP_NAME}"
echo ""
echo "To install in your Symfony project:"
echo "  1. Copy ${ZIP_NAME} to your Symfony project root"
echo "  2. Extract: unzip ${ZIP_NAME}"
echo "  3. Add to package.json dependencies:"
echo "     \"stimulus-sheet\": \"file:./package\""
echo "  4. Run: npm install"
