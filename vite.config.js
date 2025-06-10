import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Set '@' to point to the 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.csv'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setupTests.js',
    include: ['**/*.{test,spec}.{js,jsx}'],
    css: true,
  },
})