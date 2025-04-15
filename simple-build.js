/**
 * Simple build script for Netlify
 *
 * This script creates a minimal dist directory with an index.html file
 * to ensure that the Netlify deployment succeeds even if the main build fails.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const distDir = path.join(__dirname, 'dist');
const fallbackHtmlPath = path.join(__dirname, 'fallback-index.html');
const fallbackCssPath = path.join(__dirname, 'fallback-styles.css');
const indexHtmlPath = path.join(distDir, 'index.html');
const cssOutputPath = path.join(distDir, 'styles.css');

// Create dist directory if it doesn't exist
console.log('📁 Creating dist directory...');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a simple index.html if fallback doesn't exist
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>COMET Scanner Wizard</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>COMET Scanner Wizard</h1>
  <p>We're currently performing maintenance on our site. Please check back soon.</p>
</body>
</html>
`;

// Use fallback HTML if it exists
if (fs.existsSync(fallbackHtmlPath)) {
  console.log('📄 Using fallback HTML...');
  htmlContent = fs.readFileSync(fallbackHtmlPath, 'utf8');
}

// Write index.html to dist directory
console.log('📝 Writing index.html...');
fs.writeFileSync(indexHtmlPath, htmlContent);

// Copy CSS file if it exists
if (fs.existsSync(fallbackCssPath)) {
  console.log('📝 Copying CSS file...');
  fs.copyFileSync(fallbackCssPath, cssOutputPath);
}

// Create assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('📁 Creating assets directory...');
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('✅ Simple build completed successfully!');
console.log('📂 Files in dist directory:');
console.log(fs.readdirSync(distDir));
