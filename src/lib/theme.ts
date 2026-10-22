import { useSyncExternalStore } from 'react'

// Day (paper) or night (the lit-up map). Follows the system unless the visitor
// picked one with the toggle; that choice is remembered. index.html applies the
// same rule in an inline script before the first paint, so there's no flash.
export type Theme = 'day' | 'night'
const KEY = 'theme'
const DARK = '(prefers-color-scheme: dark)'
const COLOR: Record<Theme, string> = { day: '#f4f1e8', night: '#0e1320' }

const listeners = new Set<() => void>()

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'day' || v === 'night' ? v : null
  } catch {
    return null
  }
}

function system(): Theme {
  return window.matchMedia(DARK).matches ? 'night' : 'day'
}

function apply(theme: Theme) {
  const html = document.documentElement
  if (theme === 'night') html.dataset.theme = 'night'
  else delete html.dataset.theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR[theme])
  listeners.forEach((l) => l())
}

const current = (): Theme => (document.documentElement.dataset.theme === 'night' ? 'night' : 'day')

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
  apply(theme)
}

// keep following the system while the visitor hasn't chosen
if (typeof window !== 'undefined') {
  window.matchMedia(DARK).addEventListener('change', () => {
    if (!stored()) apply(system())
  })
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    current,
    () => 'day', // prerendered markup is the day theme; night is applied by attribute, not markup
  )
}
