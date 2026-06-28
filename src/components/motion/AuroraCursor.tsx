import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function AuroraCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    if (!el) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    const loop = () => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      el.style.transform = `translate3d(${current.x - 190}px, ${current.y - 190}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[380px] w-[380px] will-change-transform"
    >
      <div
        className="h-full w-full animate-spin-slow rounded-full opacity-40 blur-[72px]"
        style={{
          background: 'conic-gradient(from 0deg, #6366f1, #a78bfa, #f0abfc, #22d3ee, #34d399, #6366f1)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
