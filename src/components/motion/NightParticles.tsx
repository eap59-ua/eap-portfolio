import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFinePointer, useMotionPaused, useReducedMotion } from '../../lib/motion'
import type { Runner } from './particles/core'

// Night only: "Red en servicio", a living metro network behind the content
// (design-rationale, night map), drawn in depth on two or three planes.
// Cost model: mounted after hydration (ClientOnly), engine fetched on idle as its own
// chunk, fixed pointer-events:none canvases (no layout, CLS 0), cached planes moved
// by compositor transforms, the loop stops in hidden tabs and with the pause button;
// reduced motion gets one still frame.

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export function NightParticles() {
  const host = useRef<HTMLDivElement>(null)
  const runner = useRef<Runner | null>(null)
  const pausedRef = useRef(false)
  const [shown, setShown] = useState(false)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  // full strength only behind the home hero; where people read (the rest of the home,
  // the case studies) the network steps back so it never runs through a paragraph
  const { pathname } = useLocation()
  const [pastHero, setPastHero] = useState(false)
  useEffect(() => {
    const on = () => setPastHero(window.scrollY > window.innerHeight * 0.55)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const dim = pathname !== '/' || pastHero

  useEffect(() => {
    pausedRef.current = paused
    runner.current?.setPaused(paused)
  }, [paused])

  useEffect(() => {
    const el = host.current
    if (!el) return
    let cancelled = false
    const lite = !fine // touch / pen: two planes, DPR ≤ 1.5, 30 fps, no cursor
    const go = async () => {
      const [core, red] = await Promise.all([import('./particles/core'), import('./particles/redEnServicio')])
      if (cancelled) return
      const interactive = fine && !reduce
      const scene = red.createScene({ lite, interactive }, core.readPalette())
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
  }, [fine, reduce])

  return (
    <div
      ref={host}
      aria-hidden="true"
      data-night-bg=""
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: shown ? (dim ? 0.42 : 1) : 0, transition: 'opacity 700ms var(--ease-out)' }}
    />
  )
}
