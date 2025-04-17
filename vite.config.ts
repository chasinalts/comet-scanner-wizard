import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // This ensures environment variables are available
  loadEnv(mode, process.cwd(), '');

  // Configure based on mode

  return {
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    // Disable sourcemaps in production for better performance
    sourcemap: mode === 'development',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // CSS optimization
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    rollupOptions: {
      output: {
        // Ensure assets are in predictable locations
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Manual chunk configuration
        manualChunks: (id) => {
          // Create separate chunks for major dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            // Group other UI libraries
            if (id.includes('@headlessui') || id.includes('@heroicons')) {
              return 'vendor-ui';
            }
            // Group monaco editor separately
            if (id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            return 'vendor-other';
          }
        }
      }
    }
  },

  // Development server configuration
  server: {
    watch: {
      ignored: ['**/public/**', '**/node_modules/**']
    },
    // Enable HMR
    hmr: true,
    // Optimize for development
    host: 'localhost',
    port: 3000,
    open: false, // Disable auto-opening browser
    // Reduce console noise
    cors: true,
    // Improve performance
    fs: {
      strict: true,
    },
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: false, // Disable auto-opening browser
  },

  // Optimize Node.js options
  optimizeDeps: {
    // Force inclusion of these dependencies
    include: ['react', 'react-dom', 'framer-motion'],
  },

  // Reduce memory usage
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'es2020',
    // Reduce memory usage
    treeShaking: true,
  }
  };
});