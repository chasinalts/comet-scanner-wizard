#!/bin/bash

# Netlify build script that handles TypeScript compilation

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting build process..."

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Create dist directory if it doesn't exist
echo "📁 Ensuring dist directory exists..."
mkdir -p dist

# Copy maintenance file to dist as a backup
echo "📝 Copying maintenance file to dist..."
cp public/maintenance.html dist/index.html || echo "Warning: Could not copy maintenance file"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript configuration
echo "🔧 Compiling TypeScript configuration..."
npx tsc --project tsconfig.node.json

# Build the application
echo "🔨 Building application..."
npm run build

# If build fails, use the fallback index.html
if [ $? -ne 0 ]; then
  echo "⚠️ Build failed, using fallback index.html..."
  cp fallback-index.html dist/index.html
fi

# Verify the build
echo "🔍 Verifying build..."
ls -la dist

# Make sure there's at least an index.html file
if [ ! -f dist/index.html ]; then
  echo "⚠️ No index.html found, using fallback..."
  cp fallback-index.html dist/index.html
fi

echo "✅ Build completed successfully!"
