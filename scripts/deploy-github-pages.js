/**
 * GitHub Pages deployment script
 * 
 * This script deploys the application to GitHub Pages.
 * Usage: node scripts/deploy-github-pages.js
 * 
 * Requirements:
 * - gh-pages: npm install gh-pages --save-dev
 */

const ghpages = require('gh-pages');
const path = require('path');
const deployConfig = require('../deploy.config');

// Use production config for GitHub Pages
const config = deployConfig.production;

console.log('Deploying to GitHub Pages...');

// Deploy to GitHub Pages
ghpages.publish(
  path.resolve(__dirname, '../dist'),
  {
    branch: config.deployment.githubPages.branch,
    repo: `https://github.com/${config.deployment.githubPages.repository}.git`,
    message: 'Auto-deploy from deployment script',
    dotfiles: true, // Include .nojekyll file
  },
  (err) => {
    if (err) {
      console.error('Deployment failed:', err);
      process.exit(1);
    } else {
      console.log('Deployment complete!');
    }
  }
);
