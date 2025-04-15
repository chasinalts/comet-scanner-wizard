#!/bin/bash

# Netlify build script that handles TypeScript compilation

echo "🚀 Starting build process..."

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript configuration
echo "🔧 Compiling TypeScript configuration..."
npx tsc --project tsconfig.node.json

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build
echo "🔍 Verifying build..."
ls -la dist

echo "✅ Build completed successfully!"
