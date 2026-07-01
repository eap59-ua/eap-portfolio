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
            // react-icons is only used by the lazy Skills section — do NOT force it
            // into its own chunk (that gets hoisted into the initial modulepreload).
            // Left unassigned, it folds into the async Skills chunk and loads with it.
            if (id.includes('react-icons')) return
            // lenis is dynamically imported (smooth scroll isn't needed for first paint)
            // — keep it out of the eager vendor chunk so it loads as its own async chunk.
            if (id.includes('node_modules/lenis')) return
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
