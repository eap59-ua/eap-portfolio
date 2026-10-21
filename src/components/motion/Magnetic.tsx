import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/motion'

interface MagneticProps {
  children: ReactNode
  /** fraction of the pointer offset the content follows */
  strength?: number
  /** hard cap, in px */
  max?: number
  className?: string
}

// The author's magnetic buttons (kept, design-rationale §2.1), rebuilt cheaper:
// the hit area never moves (only the inner content does), the rect is read once
// on pointerenter, and the pull eases with a short spring so it has weight.
export function Magnetic({ children, strength = 0.3, max = 10, className }: MagneticProps) {
  const outer = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    if (reduce || !fine) return
    const o = outer.current
    const el = inner.current
    if (!o || !el) return
    let rect: DOMRect | null = null
    let raf = 0
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }

    const tick = () => {
      // critically-damped-ish approach: fast to start, settles without wobble
      cur.x += (target.x - cur.x) * 0.25
      cur.y += (target.y - cur.y) * 0.25
      el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`
      if (Math.abs(target.x - cur.x) > 0.05 || Math.abs(target.y - cur.y) > 0.05) raf = requestAnimationFrame(tick)
      else {
        raf = 0
        if (!target.x && !target.y) el.style.willChange = ''
      }
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const enter = () => {
      rect = o.getBoundingClientRect()
      el.style.willChange = 'transform'
    }
    const move = (e: PointerEvent) => {
      if (!rect) rect = o.getBoundingClientRect()
      const clamp = (v: number) => Math.max(-max, Math.min(max, v))
      target.x = clamp((e.clientX - (rect.left + rect.width / 2)) * strength)
      target.y = clamp((e.clientY - (rect.top + rect.height / 2)) * strength)
      kick()
    }
    const leave = () => {
      rect = null
      target.x = 0
      target.y = 0
      kick()
    }
    o.addEventListener('pointerenter', enter)
    o.addEventListener('pointermove', move)
    o.addEventListener('pointerleave', leave)
    return () => {
      o.removeEventListener('pointerenter', enter)
      o.removeEventListener('pointermove', move)
      o.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [reduce, fine, strength, max])

  return (
    <span ref={outer} className={`inline-block ${className ?? ''}`}>
      <span ref={inner} className="inline-block">
        {children}
      </span>
    </span>
  )
}
