import { lazy, Suspense, useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SmoothScroll, scrollToHash } from './components/layout/SmoothScroll'
import { TopBar, MiniPlan } from './components/metro/TopBar'
import { GlowField } from './components/motion/GlowField'
import { useTheme } from './lib/theme'
import { SiteFooter } from './components/metro/SiteFooter'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { loadCaseStudy, loadedCaseStudy } from './lib/caseStudyChunk'

const LazyCaseStudy = lazy(() => loadCaseStudy().then((c) => ({ default: c })))
/** straight to the page once its chunk is in (see lib/caseStudyChunk.ts), lazy before that */
function CaseStudy() {
  const Page = loadedCaseStudy()
  return Page ? <Page /> : <LazyCaseStudy />
}
// pointer-only companion cursor: off the critical path, self-disables on touch
// night only: ambient light over the lit-up map
const AuroraCursor = lazy(() => import('./components/motion/AuroraCursor').then((m) => ({ default: m.AuroraCursor })))
// night only: the living network behind the content (?bg=a|b|off)
const NightParticles = lazy(() => import('./components/motion/NightParticles').then((m) => ({ default: m.NightParticles })))
const TrainCursor = lazy(() => import('./components/metro/TrainCursor').then((m) => ({ default: m.TrainCursor })))

// After navigating to the home route with a hash (nav links, logo, "back to
// projects"), scroll to that section — react-router doesn't do it on its own.
function HashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (pathname === '/' && hash) scrollToHash(hash)
  }, [pathname, hash])
  return null
}

// Client-only extras mount after hydration: the prerendered HTML never contains
// them (lazy chunks can't render on the server) nor depends on the theme.
function ClientOnly({ night, children }: { night?: boolean; children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const theme = useTheme()
  useEffect(() => setMounted(true), [])
  return mounted && (!night || theme === 'night') ? <Suspense fallback={null}>{children}</Suspense> : null
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-rule border-t-l1" />
    </div>
  )
}

/** the whole site, under whichever router renders it (browser, or the prerender's static one) */
/** caseStudy: the prerender passes the page itself (not lazy), so its HTML comes out complete
 *  in place; in the browser it stays a lazy chunk that hydrates that markup once loaded. */
export function AppShell({ caseStudy: CaseStudyPage = CaseStudy }: { caseStudy?: ComponentType } = {}) {
  return (
    <>
      <HashScroll />
      <SmoothScroll />
      <TopBar />
      <MiniPlan />
      <GlowField />
      <ClientOnly>
        <TrainCursor />
      </ClientOnly>
      <ClientOnly night>
        <NightParticles />
        <AuroraCursor />
      </ClientOnly>
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
      <Analytics />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
