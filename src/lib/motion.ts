import { useEffect, useState, useSyncExternalStore } from 'react'

// Motion preferences without pulling framer-motion into the initial bundle.

function useMedia(query: string) {
  // false on the first render everywhere, so the prerendered HTML and hydration agree
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
/** a real mouse/trackpad: the only place pointer effects make sense */
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')
export { useMedia }

/** per-frame follow factor tuned at 60 fps, made frame-rate independent:
 *  the same feel on a 120 Hz screen or when frames drop */
export function follow(k60: number, dtMs: number) {
  return 1 - Math.pow(1 - k60, Math.min(dtMs, 64) / (1000 / 60))
}

// ── user pause (WCAG 2.2.2): one switch that stops every decorative loop ──
const KEY = 'motion-paused'
const listeners = new Set<() => void>()
let paused = (() => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
})()
if (typeof document !== 'undefined' && paused) document.documentElement.dataset.motion = 'paused'

export function setMotionPaused(next: boolean) {
  paused = next
  try {
    sessionStorage.setItem(KEY, next ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (next) document.documentElement.dataset.motion = 'paused'
  else delete document.documentElement.dataset.motion
  listeners.forEach((l) => l())
}

export function useMotionPaused() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => paused,
    () => false,
  )
}
