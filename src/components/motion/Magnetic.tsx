import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce, strength])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
    >
      {children}
    </span>
  )
}
