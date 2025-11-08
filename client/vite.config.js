import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure assets resolve correctly when hosted under a subpath on GitHub Pages
  base: '/exp8-Alumni-Association-Networking-Platform-/',
})
