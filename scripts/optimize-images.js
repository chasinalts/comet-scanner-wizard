/**
 * Image optimization script
 * 
 * This script optimizes images in the public directory.
 * Run with: node scripts/optimize-images.js
 * 
 * Note: You'll need to install these dependencies:
 * npm install sharp imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo glob --save-dev
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const glob = require('glob');

// Configuration
const config = {
  // Source directories to scan for images
  sourceDirs: ['public', 'src/assets'],
  
  // Output directory for optimized images
  outputDir: 'public/optimized',
  
  // Image formats to process
  formats: ['jpg', 'jpeg', 'png', 'svg'],
  
  // Resize configurations for responsive images
  sizes: [
    { width: 640, suffix: 'sm' },
    { width: 1024, suffix: 'md' },
    { width: 1920, suffix: 'lg' }
  ],
  
  // JPEG compression quality (0-100)
  jpegQuality: 80,
  
  // PNG compression quality (0-1)
  pngQuality: [0.7, 0.9]
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Find all images in source directories
const findImages = () => {
  let images = [];
  
  config.sourceDirs.forEach(dir => {
    config.formats.forEach(format => {
      const pattern = `${dir}/**/*.${format}`;
      const found = glob.sync(pattern);
      images = [...images, ...found];
    });
  });
  
  return images;
};

// Process an image
const processImage = async (imagePath) => {
  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const basename = path.basename(imagePath, ext);
  
  console.log(`Processing: ${imagePath}`);
  
  try {
    // For SVG files, just optimize with SVGO
    if (ext === '.svg') {
      await imagemin([imagePath], {
        destination: config.outputDir,
        plugins: [
          imageminSvgo({
            plugins: [
              { name: 'removeViewBox', active: false },
              { name: 'cleanupIDs', active: false }
            ]
          })
        ]
      });
      console.log(`  Optimized SVG: ${filename}`);
      return;
    }
    
    // For raster images, resize and optimize
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Create responsive versions
    for (const size of config.sizes) {
      // Skip if original is smaller than target size
      if (metadata.width <= size.width) continue;
      
      const resizedFilename = `${basename}-${size.suffix}${ext}`;
      const outputPath = path.join(config.outputDir, resizedFilename);
      
      await image
        .resize(size.width)
        .toFile(outputPath);
      
      // Optimize the resized image
      await imagemin([outputPath], {
        destination: config.outputDir,
        plugins: [
          imageminMozjpeg({ quality: config.jpegQuality }),
          imageminPngquant({ quality: config.pngQuality })
        ]
      });
      
      console.log(`  Created: ${resizedFilename}`);
    }
    
    // Optimize the original image
    await imagemin([imagePath], {
      destination: config.outputDir,
      plugins: [
        imageminMozjpeg({ quality: config.jpegQuality }),
        imageminPngquant({ quality: config.pngQuality })
      ]
    });
    
    console.log(`  Optimized: ${filename}`);
  } catch (error) {
    console.error(`  Error processing ${filename}:`, error);
  }
};

// Main function
const main = async () => {
  console.log('Starting image optimization...');
  
  const images = findImages();
  console.log(`Found ${images.length} images to process`);
  
  for (const image of images) {
    await processImage(image);
  }
  
  console.log('Image optimization complete!');
};

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
