import { lazy, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SmoothScroll, scrollToHash } from './components/layout/SmoothScroll'
import { TopBar, MiniPlan } from './components/metro/TopBar'
import { GlowField } from './components/motion/GlowField'
import { useTheme } from './lib/theme'
import { SiteFooter } from './components/metro/SiteFooter'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const CaseStudy = lazy(() => import('./pages/CaseStudy').then((m) => ({ default: m.CaseStudy })))
// pointer-only companion cursor: off the critical path, self-disables on touch
// night only: ambient light over the lit-up map
const AuroraCursor = lazy(() => import('./components/motion/AuroraCursor').then((m) => ({ default: m.AuroraCursor })))
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
export function AppShell() {
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
        <AuroraCursor />
      </ClientOnly>
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<CaseStudy />} />
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
