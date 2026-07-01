import { lazy, Suspense } from 'react'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Education } from '../components/sections/Education'
import { Experience } from '../components/sections/Experience'
import { Projects } from '../components/sections/Projects'
import { Contact } from '../components/sections/Contact'

// Skills pulls in react-icons (~70KB) via TechLogo — it's the only consumer.
// Lazy-load it so that weight never sits on the initial/mobile critical path;
// it's the last content section before Contact, so it's always below the fold.
const Skills = lazy(() =>
  import('../components/sections/Skills').then((m) => ({ default: m.Skills })),
)

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Suspense fallback={<div className="min-h-[720px]" aria-hidden="true" />}>
        <Skills />
      </Suspense>
      <Contact />
    </>
  )
}
