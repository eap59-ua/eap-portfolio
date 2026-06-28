import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { SmoothScroll } from './components/layout/SmoothScroll'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const CaseStudy = lazy(() =>
  import('./pages/CaseStudy').then((m) => ({ default: m.CaseStudy })),
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
    </BrowserRouter>
  )
}

export default App
