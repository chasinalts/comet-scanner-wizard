/**
 * Simple Netlify build script
 * 
 * This is a simplified version of the build script that uses ES modules.
 */

import { execSync } from 'child_process';

console.log('🚀 Starting Netlify build...');

try {
  // Log Node.js and npm versions
  console.log('Node version:', process.version);
  console.log('NPM version:', execSync('npm --version').toString().trim());
  
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the application
  console.log('\n🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify the build
  console.log('\n🔍 Verifying build...');
  execSync('ls -la dist', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
