import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './i18n/config'
import './index.css'
import App from './App.tsx'

// Night mode is built (tokens only) but not switched on for visitors yet:
// preview it with ?theme=night (docs/plan/fase-2b.md §4.1).
if (new URLSearchParams(location.search).get('theme') === 'night') document.documentElement.dataset.theme = 'night'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Only "/" is prerendered with markup. Unknown routes are served the same
// index.html by the host's SPA fallback, so there the home markup is dropped.
if (root.hasChildNodes() && location.pathname === '/') {
  // prerendered home (Spanish): hydrate as-is; Home restores the visitor's language after
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
