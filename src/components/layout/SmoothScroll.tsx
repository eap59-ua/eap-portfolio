import { useEffect } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/motion'

type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void }
let lenisInstance: LenisLike | null = null

// An anchor can point at something only one layout renders (e.g. a project's
// accordion row, hidden on desktop): then land on the visible stand-in the section
// marks with data-anchor-fallback (the desktop board), or on the section itself.
function anchorTarget(el: HTMLElement): HTMLElement {
  if (el.getClientRects().length) return el
  const section = el.closest('section') as HTMLElement | null
  const standIn = [...(section?.querySelectorAll<HTMLElement>('[data-anchor-fallback]') ?? [])].find((s) => s.getClientRects().length)
  return standIn ?? section ?? el
}

function scrollToEl(el: HTMLElement) {
  const target = anchorTarget(el)
  if (lenisInstance) lenisInstance.scrollTo(target, { offset: -72 })
  else target.scrollIntoView({ block: 'start' }) // reduced motion: jump (scroll-padding-top covers the bar)
}

/** absolute page offset (scroll-linked scenes: the journey's prev/next stations) */
export function scrollToY(y: number) {
  if (lenisInstance) lenisInstance.scrollTo(y)
  else window.scrollTo({ top: y })
}

// Scroll to a section by hash once it's on the page. Used by nav/logo/"back"
// links that route to the home page first — react-router doesn't scroll to a
// hash on its own, and lazily-mounted sections (Skills) may not exist yet.
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '')
  if (!id) return
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) return scrollToEl(el)
    if (tries++ < 60) requestAnimationFrame(tick)
  }
  // try right away (section already mounted), then retry on rAF if it isn't yet
  tick()
}

export function SmoothScroll() {
  const reduce = useReducedMotion()
  // touch scrolling is already smooth and native: Lenis only for wheel/trackpad
  const fine = useFinePointer()

  // Resizing reflows the page (and swaps the journey between pinned and vertical),
  // which defeats the browser's scroll anchoring: keep the reader in the same
  // section, at the same offset, once the resize settles.
  useEffect(() => {
    let anchor: { el: HTMLElement; top: number } | null = null
    let settling = 0
    let raf = 0
    const remember = () => {
      raf = 0
      if (settling) return
      let pick: HTMLElement | null = null
      for (const el of document.querySelectorAll<HTMLElement>('main section[id]')) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.3) pick = el
      }
      anchor = pick ? { el: pick, top: pick.getBoundingClientRect().top } : null
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(remember)
    }
    const onResize = () => {
      window.clearTimeout(settling)
      settling = window.setTimeout(() => {
        settling = 0
        if (anchor?.el.isConnected && window.scrollY > 0) {
          const y = window.scrollY + anchor.el.getBoundingClientRect().top - anchor.top
          // native, not Lenis: its limits still hold the old page height (it syncs on this scroll)
          window.scrollTo({ top: y, behavior: 'instant' })
        }
        remember()
      }, 200)
    }
    remember()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(settling)
      cancelAnimationFrame(raf)
    }
  }, [])

  // in-page anchors: Lenis when it's running, a plain jump otherwise
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const anchor = (event.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      const hash = anchor?.getAttribute('href')
      if (!hash || hash === '#') return
      const el = document.getElementById(hash.slice(1))
      if (!el) return
      event.preventDefault()
      history.replaceState(null, '', hash)
      scrollToEl(el)
      // keep what native anchors do for keyboard users: Tab continues from the target
      const target = anchorTarget(el)
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (reduce || !fine) return

    let cancelled = false
    let frame = 0
    let destroy: (() => void) | null = null

    // Lenis isn't needed for first paint — load it lazily so it stays off the
    // eager vendor chunk / critical path.
    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      lenisInstance = lenis
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)

      destroy = () => {
        cancelAnimationFrame(frame)
        lenis.destroy()
        lenisInstance = null
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      destroy?.()
    }
  }, [reduce, fine])

  return null
}
