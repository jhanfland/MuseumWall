import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.csv'],
    test: {
    globals: true,
    setupFiles: './tests/setupTests.js',
    include: ['tests/**/*.{test,spec}.{js,jsx}'],
    css: true,
  },
})
