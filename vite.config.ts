import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Note: You'll need to install this plugin with: npm install vite-plugin-imagemin --save-dev
// import imagemin from 'vite-plugin-imagemin'

export default defineConfig({
  // Base path - comment this out for Netlify deployment
  // base: '/comet-scanner-wizard/',
  plugins: [
    react(),
    // Uncomment after installing the plugin
    // imagemin({
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false,
    //   },
    //   optipng: {
    //     optimizationLevel: 7,
    //   },
    //   mozjpeg: {
    //     quality: 80,
    //   },
    //   pngquant: {
    //     quality: [0.8, 0.9],
    //     speed: 4,
    //   },
    //   svgo: {
    //     plugins: [
    //       {
    //         name: 'removeViewBox',
    //       },
    //       {
    //         name: 'removeEmptyAttrs',
    //         active: false,
    //       },
    //     ],
    //   },
    // }),
  ],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', '@headlessui/react', '@heroicons/react'],
          'vendor-monaco': ['@monaco-editor/react']
        }
      }
    },
    // Enable source map for debugging in production
    sourcemap: false,
    // Minify the output
    minify: 'esbuild',
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000
  },
  // Add cache headers to assets
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000' // 1 year for static assets
    }
  }
})