import { useEffect } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/motion'

// only the card under the pointer lights up (a short run-up as the pointer approaches its edge)
const PROXIMITY = 40

// The author's proximity-lit card border (design-rationale §2.1: "on every
// card"), rebuilt so it never forces layout: one pointer listener + one rAF for
// the whole page, only cards currently on screen, all reads before all writes,
// and a style write only when the value actually changes.
export function GlowField() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!fine || reduce) return
    const visible = new Set<HTMLElement>()
    const lastGlow = new WeakMap<HTMLElement, string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) visible.add(el)
          else {
            visible.delete(el)
            if (lastGlow.get(el) !== '0') {
              el.style.setProperty('--glow', '0')
              lastGlow.set(el, '0')
            }
          }
        }
      },
      { rootMargin: '100px' },
    )
    const watch = () => document.querySelectorAll<HTMLElement>('[data-glow]').forEach((el) => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(document.body, { childList: true, subtree: true })

    let raf = 0
    let px = 0
    let py = 0
    const update = () => {
      raf = 0
      const cards = [...visible]
      const rects = cards.map((c) => c.getBoundingClientRect()) // reads
      const dists = rects.map((r) => Math.hypot(Math.max(r.left - px, 0, px - r.right), Math.max(r.top - py, 0, py - r.bottom)))
      // one card at a time: the nearest (the innermost if the pointer is inside nested cards)
      let pick = -1
      dists.forEach((d, i) => {
        if (d > PROXIMITY) return
        const area = rects[i].width * rects[i].height
        if (pick < 0 || d < dists[pick] || (d === dists[pick] && area < rects[pick].width * rects[pick].height)) pick = i
      })
      cards.forEach((card, i) => {
        // writes
        const r = rects[i]
        const dist = dists[i]
        const glow = i !== pick ? '0' : (1 - dist / PROXIMITY).toFixed(2)
        if (lastGlow.get(card) !== glow) {
          card.style.setProperty('--glow', glow)
          lastGlow.set(card, glow)
        }
        if (glow !== '0') {
          let a = (Math.atan2(py - (r.top + r.height / 2), px - (r.left + r.width / 2)) * 180) / Math.PI
          if (a < 0) a += 360
          card.style.setProperty('--start', String(Math.round(a + 90)))
        }
      })
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [fine, reduce])

  return null
}
