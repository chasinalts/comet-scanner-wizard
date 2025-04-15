/**
 * Netlify configuration
 * 
 * This file contains configuration specific to Netlify deployments.
 */

module.exports = {
  // Build settings
  build: {
    // Base directory
    base: '.',
    
    // Build command
    command: 'npm run build',
    
    // Output directory
    outputDir: 'dist',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      VITE_APP_ENV: 'production'
    }
  },
  
  // Deployment settings
  deploy: {
    // Production branch
    productionBranch: 'main',
    
    // Headers
    headers: [
      {
        for: '/*',
        values: {
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer-when-downgrade'
        }
      },
      {
        for: '/*.js',
        values: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      },
      {
        for: '/*.css',
        values: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      }
    ],
    
    // Redirects
    redirects: [
      {
        from: '/*',
        to: '/index.html',
        status: 200
      }
    ]
  }
};
