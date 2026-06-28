import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

const PROXIMITY = 150

export function GlowBorders() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    let last: PointerEvent | null = null

    const update = () => {
      raf = 0
      const e = last
      if (!e) return
      const cards = document.querySelectorAll<HTMLElement>('[data-glow]')
      cards.forEach((card) => {
        const r = card.getBoundingClientRect()
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right)
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom)
        const dist = Math.hypot(dx, dy)
        if (dist > PROXIMITY) {
          card.style.setProperty('--glow', '0')
          return
        }
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        let angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI
        if (angle < 0) angle += 360
        card.style.setProperty('--glow', String(1 - dist / PROXIMITY))
        card.style.setProperty('--start', String(angle + 90))
        card.style.setProperty('--gx', `${e.clientX - r.left}px`)
        card.style.setProperty('--gy', `${e.clientY - r.top}px`)
      })
    }

    const onMove = (e: PointerEvent) => {
      last = e
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return null
}
