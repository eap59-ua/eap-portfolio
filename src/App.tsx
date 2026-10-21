import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SmoothScroll, scrollToHash } from './components/layout/SmoothScroll'
import { TopBar, MiniPlan } from './components/metro/TopBar'
import { GlowField } from './components/motion/GlowField'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const CaseStudy = lazy(() => import('./pages/CaseStudy').then((m) => ({ default: m.CaseStudy })))
// pointer-only companion cursor: off the critical path, self-disables on touch
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

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-rule border-t-l1" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <HashScroll />
      <SmoothScroll />
      <TopBar />
      <MiniPlan />
      <GlowField />
      <Suspense fallback={null}>
        <TrainCursor />
      </Suspense>
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<CaseStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
