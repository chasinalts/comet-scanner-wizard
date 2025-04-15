/**
 * Netlify build script
 *
 * This script is used by Netlify to build the application.
 * It provides more control over the build process and helps troubleshoot issues.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load Netlify configuration
let netlifyConfig;
try {
  netlifyConfig = require('../netlify.config.js');
  console.log('Loaded Netlify configuration');
} catch (error) {
  console.warn('Failed to load Netlify configuration:', error.message);
  netlifyConfig = {};
}

// Configuration
const config = {
  // Whether to enable verbose logging
  verbose: true,

  // Commands to run
  commands: {
    // Install dependencies
    install: 'npm install',

    // Build the application
    build: netlifyConfig.build?.command || 'npm run build',

    // Verify the build
    verify: `ls -la ${netlifyConfig.build?.outputDir || 'dist'}`
  },

  // Environment variables
  env: netlifyConfig.build?.env || {
    NODE_ENV: 'production'
  }
};

// Helper function to run a command and log the output
function runCommand(command, label) {
  console.log(`\n📋 ${label}:\n`);
  console.log(`$ ${command}\n`);

  try {
    // Set environment variables for the command
    const env = { ...process.env };

    // Add custom environment variables
    Object.entries(config.env).forEach(([key, value]) => {
      env[key] = value;
    });

    const output = execSync(command, { stdio: 'pipe', env }).toString();
    console.log(output);
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    console.error(error.message);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    return { success: false, error };
  }
}

// Log environment information
function logEnvironmentInfo() {
  console.log('\n🔍 Environment Information:');

  // Node.js and npm versions
  runCommand('node --version', 'Node.js version');
  runCommand('npm --version', 'npm version');

  // Operating system
  console.log(`\n📋 Operating System:`);
  console.log(process.platform, process.arch);

  // Current directory
  console.log(`\n📋 Current Directory:`);
  console.log(process.cwd());

  // List files in current directory
  runCommand('ls -la', 'Files in current directory');

  // Check if package.json exists
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  console.log(`\n📋 package.json exists: ${fs.existsSync(packageJsonPath)}`);

  if (fs.existsSync(packageJsonPath)) {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Log dependencies
    console.log('\n📋 Dependencies:');
    console.log(JSON.stringify(packageJson.dependencies, null, 2));

    // Log scripts
    console.log('\n📋 Scripts:');
    console.log(JSON.stringify(packageJson.scripts, null, 2));
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Netlify build script...');

  // Log environment information
  if (config.verbose) {
    logEnvironmentInfo();
  }

  // Install dependencies
  const installResult = runCommand(config.commands.install, 'Installing dependencies');
  if (!installResult.success) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }

  // Build the application
  const buildResult = runCommand(config.commands.build, 'Building application');
  if (!buildResult.success) {
    console.error('❌ Failed to build application');
    process.exit(1);
  }

  // Verify the build
  const verifyResult = runCommand(config.commands.verify, 'Verifying build');
  if (!verifyResult.success) {
    console.error('❌ Failed to verify build');
    process.exit(1);
  }

  console.log('\n✅ Build completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
