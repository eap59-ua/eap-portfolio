import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

type LenisLike = { scrollTo: (target: HTMLElement, opts?: { offset?: number }) => void }
let lenisInstance: LenisLike | null = null

// Scroll to a section by hash once it's on the page. Used by nav/logo/"back"
// links that route to the home page first — react-router doesn't scroll to a
// hash on its own, and lazily-mounted sections (Skills) may not exist yet.
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '')
  if (!id) return
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      if (lenisInstance) lenisInstance.scrollTo(el, { offset: -72 })
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (tries++ < 60) requestAnimationFrame(tick)
  }
  // try right away (section already mounted), then retry on rAF if it isn't yet
  tick()
}

export function SmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    let cancelled = false
    let frame = 0
    let destroy: (() => void) | null = null

    // Lenis isn't needed for first paint — load it lazily so it stays off the
    // eager vendor chunk / critical path.
    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      lenisInstance = lenis
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)

      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null
        const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
        if (!anchor) return
        const hash = anchor.getAttribute('href')
        if (!hash || hash === '#') return
        const el = document.querySelector(hash)
        if (el) {
          event.preventDefault()
          lenis.scrollTo(el as HTMLElement, { offset: -72 })
        }
      }

      document.addEventListener('click', onClick)
      destroy = () => {
        cancelAnimationFrame(frame)
        lenis.destroy()
        lenisInstance = null
        document.removeEventListener('click', onClick)
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      destroy?.()
    }
  }, [reduce])

  return null
}
