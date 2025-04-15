/**
 * Netlify deployment script
 * 
 * This script deploys the application to Netlify.
 * Usage: node scripts/deploy-netlify.js [environment]
 * 
 * Requirements:
 * - Netlify CLI: npm install -g netlify-cli
 * - Netlify account and site setup
 */

const { execSync } = require('child_process');
const deployConfig = require('../deploy.config');

// Get environment from command line args or default to production
const environment = process.argv[2] || 'production';
const config = deployConfig[environment];

if (!config) {
  console.error(`Unknown environment: ${environment}`);
  process.exit(1);
}

console.log(`Deploying to Netlify (${environment})...`);

try {
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to Netlify
  console.log('Deploying to Netlify...');
  const netlifyCommand = `netlify deploy ${environment === 'production' ? '--prod' : ''} --dir=dist --site=${config.deployment.netlify.siteName}`;
  
  execSync(netlifyCommand, { stdio: 'inherit' });
  
  console.log('Deployment complete!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
