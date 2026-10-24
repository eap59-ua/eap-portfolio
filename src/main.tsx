import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './i18n/config'
import './index.css'
import App from './App.tsx'
import { isPrerendered } from './lib/ssr'
import { loadCaseStudy } from './lib/caseStudyChunk'

// landing on a case study: fetch its lazy chunk alongside hydration, not after it
if (location.pathname.startsWith('/projects/')) void loadCaseStudy()

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Hydrate only markup prerendered for this very URL (see lib/ssr.ts); otherwise render.
if (isPrerendered()) {
  // prerendered page (Spanish): hydrate as-is; the page restores the visitor's language after
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
