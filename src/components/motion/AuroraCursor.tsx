import { useEffect, useRef } from 'react'
import { useFinePointer, useMotionPaused, useReducedMotion } from '../../lib/motion'

// Night only (design-rationale §2.2): ambient light over the lit-up map that
// follows the cursor. No permanent loop: the rAF runs while it is catching up
// with the pointer and stops as soon as it arrives.
export function AuroraCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  const off = !fine || reduce || paused

  useEffect(() => {
    const el = ref.current
    if (!el || off) return
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const cur = { ...target }
    let raf = 0
    const step = () => {
      cur.x += (target.x - cur.x) * 0.08
      cur.y += (target.y - cur.y) * 0.08
      el.style.transform = `translate3d(${cur.x - 170}px, ${cur.y - 170}px, 0)`
      raf = Math.hypot(target.x - cur.x, target.y - cur.y) > 0.5 ? requestAnimationFrame(step) : 0
    }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!raf) raf = requestAnimationFrame(step)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [off])

  if (off) return null
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 -z-10 h-[340px] w-[340px] will-change-transform">
      <div
        className="h-full w-full rounded-full opacity-[0.16] blur-[70px]"
        style={{ background: 'conic-gradient(from 0deg, var(--l1), var(--studysync), var(--donation), var(--hydro), var(--eco), var(--l1))' }}
      />
    </div>
  )
}
