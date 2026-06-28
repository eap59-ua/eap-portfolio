import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

export function SmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let frame = 0
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
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      document.removeEventListener('click', onClick)
    }
  }, [reduce])

  return null
}
