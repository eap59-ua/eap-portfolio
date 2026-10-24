// Build-time only (scripts/prerender.mjs): renders pages to HTML so the first paint
// doesn't wait for the JS bundle. The client then hydrates the same markup.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import i18n from './i18n/config'
import { AppShell } from './App'
import { CaseStudy } from './pages/CaseStudy'

export async function render(url: string) {
  await i18n.changeLanguage('es') // the prerendered page is the Spanish one (SEO in Spanish)
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell caseStudy={CaseStudy} />
      </StaticRouter>
    </StrictMode>,
  )
}

