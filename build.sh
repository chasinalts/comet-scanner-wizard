#!/bin/bash

# Simple build script for Netlify

echo "🚀 Starting build process..."

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build
echo "🔍 Verifying build..."
ls -la dist

echo "✅ Build completed successfully!"
