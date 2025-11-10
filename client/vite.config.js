import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use subpath only for production (GitHub Pages). In dev, serve at '/'
  base: process.env.NODE_ENV === 'production'
    ? '/exp8-Alumni-Association-Networking-Platform-/'
    : '/',
})
