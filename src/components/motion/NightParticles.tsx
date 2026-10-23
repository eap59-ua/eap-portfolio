import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useMotionPaused, useReducedMotion } from '../../lib/motion'
import type { Runner } from './particles/core'

// Night only: a living network behind the content (design-rationale, night map).
//   ?bg=a → "Red en servicio": faint octilinear lines with trains that stop at stations
//   ?bg=b → "Malla de estaciones": drifting stations that link up octilinearly
//   ?bg=off → none
// The choice sticks for the session so it survives in-app navigation.
// Cost model: mounted after hydration (ClientOnly), engine fetched on idle as its own
// chunk, a fixed pointer-events:none canvas pair (no layout, CLS 0), the loop stops
// in hidden tabs and with the pause button; reduced motion gets one still frame.
type Variant = 'a' | 'b'
const DEFAULT: Variant = 'a'
const KEY = 'night-bg'

function pickVariant(): Variant | null {
  try {
    const q = new URLSearchParams(window.location.search).get('bg')
    if (q === 'a' || q === 'b' || q === 'off') sessionStorage.setItem(KEY, q)
    const v = q ?? sessionStorage.getItem(KEY)
    if (v === 'off') return null
    if (v === 'a' || v === 'b') return v
  } catch {
    /* storage blocked: fall through to the default */
  }
  return DEFAULT
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export function NightParticles() {
  const host = useRef<HTMLDivElement>(null)
  const runner = useRef<Runner | null>(null)
  const pausedRef = useRef(false)
  const [variant] = useState(pickVariant)
  const [shown, setShown] = useState(false)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const paused = useMotionPaused()

  useEffect(() => {
    pausedRef.current = paused
    runner.current?.setPaused(paused)
  }, [paused])

  useEffect(() => {
    const el = host.current
    if (!el || !variant) return
    let cancelled = false
    const lite = !fine // touch / pen: fewer elements, DPR ≤ 1.5, 30 fps, no cursor
    const go = async () => {
      const [core, mod] = await Promise.all([
        import('./particles/core'),
        variant === 'a' ? import('./particles/redEnServicio') : import('./particles/mallaEstaciones'),
      ])
      if (cancelled) return
      const interactive = fine && !reduce
      const scene = mod.createScene({ lite, interactive }, core.readPalette())
      runner.current = core.run(el, scene, {
        lite,
        interactive,
        still: reduce,
        paused: pausedRef.current,
        onFirstPaint: () => requestAnimationFrame(() => setShown(true)),
      })
    }
    // wait for the browser to be idle: the background must never compete with the first paint
    const w = window as IdleWindow
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => void go(), { timeout: 1500 }) : window.setTimeout(() => void go(), 400)
    return () => {
      cancelled = true
      if (w.cancelIdleCallback) w.cancelIdleCallback(id)
      else clearTimeout(id)
      runner.current?.destroy()
      runner.current = null
      setShown(false)
    }
  }, [variant, fine, reduce])

  if (!variant) return null
  return (
    <div
      ref={host}
      aria-hidden="true"
      data-night-bg={variant}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: shown ? 1 : 0, transition: 'opacity 900ms var(--ease-out)' }}
    />
  )
}
