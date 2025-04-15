/**
 * AWS S3 deployment script
 * 
 * This script deploys the application to AWS S3 and invalidates CloudFront cache.
 * Usage: node scripts/deploy-aws-s3.js [environment]
 * 
 * Requirements:
 * - AWS CLI installed and configured
 * - AWS S3 bucket created
 * - CloudFront distribution set up (optional)
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

console.log(`Deploying to AWS S3 (${environment})...`);

try {
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to S3
  console.log('Uploading to S3...');
  const s3SyncCommand = `aws s3 sync dist s3://${config.deployment.awsS3.bucket} --delete --region ${config.deployment.awsS3.region}`;
  execSync(s3SyncCommand, { stdio: 'inherit' });
  
  // Invalidate CloudFront cache if distribution ID is provided
  if (config.deployment.awsS3.cloudfrontDistribution) {
    console.log('Invalidating CloudFront cache...');
    const cloudfrontCommand = `aws cloudfront create-invalidation --distribution-id ${config.deployment.awsS3.cloudfrontDistribution} --paths "/*"`;
    execSync(cloudfrontCommand, { stdio: 'inherit' });
  }
  
  console.log('Deployment complete!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
