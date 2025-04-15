/**
 * Performance testing script
 * 
 * This script measures the performance of the application before and after optimizations.
 * Run with: node scripts/performance-test.js
 * 
 * Note: You'll need to install these dependencies:
 * npm install lighthouse puppeteer --save-dev
 */

const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // URL to test
  url: 'http://localhost:3000',
  
  // Output directory for reports
  outputDir: 'performance-reports',
  
  // Lighthouse options
  lighthouseOptions: {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: 9222,
  },
  
  // Chrome flags
  chromeFlags: [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
  ],
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Run Lighthouse audit
async function runLighthouse(url) {
  // Launch Chrome using Puppeteer
  const browser = await puppeteer.launch({
    args: config.chromeFlags,
    headless: true,
  });
  
  // Get Chrome debugging port
  const pages = await browser.pages();
  const page = pages[0];
  
  // Navigate to the URL and wait for network idle
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Run Lighthouse audit
  const { lhr } = await lighthouse(url, {
    ...config.lighthouseOptions,
    port: (new URL(browser.wsEndpoint())).port,
  });
  
  // Close browser
  await browser.close();
  
  return lhr;
}

// Save report to file
function saveReport(report, filename) {
  const filePath = path.join(config.outputDir, filename);
  fs.writeFileSync(filePath, report);
  console.log(`Report saved to ${filePath}`);
}

// Format results for console output
function formatResults(lhr) {
  const results = {
    performance: lhr.categories.performance.score * 100,
    accessibility: lhr.categories.accessibility.score * 100,
    bestPractices: lhr.categories['best-practices'].score * 100,
    seo: lhr.categories.seo.score * 100,
    metrics: {
      firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
      timeToInteractive: lhr.audits['interactive'].displayValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue,
    },
  };
  
  return results;
}

// Main function
async function main() {
  console.log('Starting performance test...');
  console.log(`Testing URL: ${config.url}`);
  
  try {
    // Run Lighthouse audit
    console.log('Running Lighthouse audit...');
    const lhr = await runLighthouse(config.url);
    
    // Save HTML report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveReport(lhr.report, `lighthouse-report-${timestamp}.html`);
    
    // Save JSON results
    const results = formatResults(lhr);
    saveReport(JSON.stringify(results, null, 2), `lighthouse-results-${timestamp}.json`);
    
    // Print results to console
    console.log('\nPerformance Test Results:');
    console.log('------------------------');
    console.log(`Performance Score: ${results.performance.toFixed(1)}%`);
    console.log(`Accessibility Score: ${results.accessibility.toFixed(1)}%`);
    console.log(`Best Practices Score: ${results.bestPractices.toFixed(1)}%`);
    console.log(`SEO Score: ${results.seo.toFixed(1)}%`);
    console.log('\nKey Metrics:');
    console.log(`First Contentful Paint: ${results.metrics.firstContentfulPaint}`);
    console.log(`Largest Contentful Paint: ${results.metrics.largestContentfulPaint}`);
    console.log(`Time to Interactive: ${results.metrics.timeToInteractive}`);
    console.log(`Total Blocking Time: ${results.metrics.totalBlockingTime}`);
    console.log(`Cumulative Layout Shift: ${results.metrics.cumulativeLayoutShift}`);
    
    console.log('\nPerformance test completed successfully!');
  } catch (error) {
    console.error('Error running performance test:', error);
    process.exit(1);
  }
}

// Run the script
main();
