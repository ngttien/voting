import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill Buffer for browser
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Polyfill Node.js built-in modules
      protocolImports: true,
    }),
  ],
  define: {
    // Make Buffer available globally
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})

