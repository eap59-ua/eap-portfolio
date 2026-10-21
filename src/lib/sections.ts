import { useEffect, useState } from 'react'

// The page's chapters, in order. Ids are stable (Spanish) so anchors shared
// on LinkedIn keep working whatever language the visitor reads in.
export const SECTIONS = [
  { id: 'inicio', key: 'st.home' },
  { id: 'proyectos', key: 'st.projects' },
  { id: 'trayectoria', key: 'st.journey' },
  { id: 'sobre-mi', key: 'st.about' },
  { id: 'stack', key: 'st.stack' },
  { id: 'contacto', key: 'st.contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** which chapter is under the reading line (40% from the top), plus overall progress */
export function useCurrentSection() {
  const [current, setCurrent] = useState<SectionId>('inicio')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let found: SectionId = 'inicio'
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) found = s.id
      }
      setCurrent((prev) => (prev === found ? prev : found))
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // sections mount lazily: re-check once the DOM changes
    const mo = new MutationObserver(onScroll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mo.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { current, progress }
}
