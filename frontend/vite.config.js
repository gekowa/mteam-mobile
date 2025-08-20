import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  server: {
    host: '0.0.0.0'
  },
  // Configure for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/mteam-mobile/' : '/'
})
