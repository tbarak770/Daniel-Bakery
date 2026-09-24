import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' makes the build use relative asset paths so it works
// regardless of which GitHub Pages subpath the site is served from.
export default defineConfig({
  base: './',
  plugins: [react()],
})
