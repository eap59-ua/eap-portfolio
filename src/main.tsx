import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/config'
import './index.css'
import App from './App.tsx'

// Night mode is built (tokens only) but not switched on for visitors yet:
// preview it with ?theme=night (docs/plan/fase-2b.md §4.1).
if (new URLSearchParams(location.search).get('theme') === 'night') document.documentElement.dataset.theme = 'night'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
