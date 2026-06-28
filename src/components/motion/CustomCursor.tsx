import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-custom-cursor')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pointer }
    let scale = 1
    let hovering = false
    let visible = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('a, button, [role="button"], summary')
      hovering = !!el
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const loop = () => {
      ringPos.x += (pointer.x - ringPos.x) * 0.18
      ringPos.y += (pointer.y - ringPos.y) * 0.18
      scale += ((hovering ? 1.9 : 1) - scale) * 0.2
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [reduce])

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="custom-cursor-ring" style={{ opacity: 0 }} />
      <div ref={dotRef} aria-hidden="true" className="custom-cursor-dot" style={{ opacity: 0 }} />
    </>
  )
}
