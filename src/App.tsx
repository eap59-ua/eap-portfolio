import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { SmoothScroll } from './components/layout/SmoothScroll'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const CaseStudy = lazy(() =>
  import('./pages/CaseStudy').then((m) => ({ default: m.CaseStudy })),
)

// Desktop-only pointer FX — they self-disable on touch, so keep their JS off the
// initial/mobile critical path and let them load after first paint.
const AuroraCursor = lazy(() =>
  import('./components/motion/AuroraCursor').then((m) => ({ default: m.AuroraCursor })),
)
const CustomCursor = lazy(() =>
  import('./components/motion/CustomCursor').then((m) => ({ default: m.CustomCursor })),
)
const GlowBorders = lazy(() =>
  import('./components/motion/GlowBorders').then((m) => ({ default: m.GlowBorders })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <ScrollProgress />
      <Suspense fallback={null}>
        <AuroraCursor />
        <CustomCursor />
        <GlowBorders />
      </Suspense>
      <Navbar />
      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<CaseStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Analytics />
    </BrowserRouter>
  )
}

export default App
