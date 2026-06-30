import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-icons')) return 'icons'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('react-router') || id.includes('react-dom')) return 'react'
            // gsap is imported dynamically (Education scroll FX) — keep it in its own
            // async chunk so it never weighs on the initial load / Lighthouse.
            if (id.includes('node_modules/gsap')) return
            return 'vendor'
          }
        },
      },
    },
  },
})
