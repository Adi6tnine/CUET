import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Memory optimization settings
  server: {
    hmr: {
      overlay: false
    }
  },
  
  build: {
    // Memory-safe build settings
    minify: 'esbuild', // Faster and less memory-intensive than terser
    sourcemap: false,
    target: 'esnext',
    
    // Chunk splitting for better memory management
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'animation': ['framer-motion'],
          'icons': ['lucide-react'],
          
          // Split utility files
          'utils': [
            './src/utils/database.js',
            './src/utils/syncManager.js',
            './src/utils/systemController.js'
          ]
        },
        
        // Limit chunk size to prevent memory issues
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return '[name]-[hash].js'
          }
          return 'chunk-[hash].js'
        }
      }
    },
    
    // Increase memory limits
    chunkSizeWarningLimit: 1000
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
    exclude: []
  },
  
  // Base path for deployment
  base: './'
})