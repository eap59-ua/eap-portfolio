import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/motion'

// The author's custom cursor (design-rationale §2.1), redesigned for the metro:
// a small train that RIDES ALONGSIDE the system cursor (option A — the system
// cursor always stays visible). States:
//   rest     → train capsule trailing the pointer, turning with the movement
//   link     → ring in the element's line colour, centred on the pointer
//   station  → snaps to the station's centre on the map
//   text     → fades out (the I-beam is the system's job)
//   keyboard → hidden until the mouse moves again
const LINK = 'a, button, [role="button"], summary, [data-cursor="link"]'
const TEXT = 'p, h1, h2, h3, h4, li, blockquote, input, textarea, [contenteditable]'

export function TrainCursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine || reduce) return
    const node = el.current
    if (!node) return
    const pos = { x: -100, y: -100 }
    const target = { x: -100, y: -100 }
    let angle = 0
    let mode: 'rest' | 'link' | 'station' | 'text' | 'hidden' = 'hidden'
    let color = 'var(--l1)'
    let raf = 0
    let last = { x: 0, y: 0 }

    const render = () => {
      // firm spring: the eye reads >80 ms of lag as a fault
      const k = mode === 'station' ? 0.32 : 0.38
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      const dx = target.x - last.x
      const dy = target.y - last.y
      if (mode === 'rest' && Math.hypot(dx, dy) > 1.5) {
        const a = (Math.atan2(dy, dx) * 180) / Math.PI
        // shortest turn, eased
        let d = a - angle
        d = ((d + 540) % 360) - 180
        angle += d * 0.25
      }
      last = { ...target }
      node.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) rotate(${mode === 'rest' ? angle.toFixed(1) : 0}deg)`
      if (Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3) raf = requestAnimationFrame(render)
      else raf = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    const setMode = (next: typeof mode, c = color) => {
      if (next === mode && c === color) return
      mode = next
      color = c
      node.dataset.mode = next
      node.style.setProperty('--cc', c)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const t = e.target as HTMLElement | null
      const station = t?.closest<HTMLElement>('[data-cursor="station"]')
      const link = t?.closest<HTMLElement>(LINK)
      const lineEl = t?.closest<HTMLElement>('[data-line]')
      const c = lineEl ? `var(--${lineEl.dataset.line})` : 'var(--l1)'
      if (station) {
        const r = station.getBoundingClientRect()
        target.x = r.left + r.width / 2
        target.y = r.top + r.height / 2
        setMode('station', c)
      } else if (link) {
        target.x = e.clientX
        target.y = e.clientY
        setMode('link', c)
      } else if (t?.closest(TEXT)) {
        target.x = e.clientX + 16
        target.y = e.clientY + 18
        setMode('text', c)
      } else {
        target.x = e.clientX + 16
        target.y = e.clientY + 18
        setMode('rest', c)
      }
      if (pos.x < 0) {
        pos.x = target.x
        pos.y = target.y
      }
      kick()
    }
    const hide = () => setMode('hidden')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') hide()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('keydown', onKey)
    window.addEventListener('blur', hide)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('blur', hide)
    }
  }, [fine, reduce])

  if (!fine || reduce) return null
  return (
    <div ref={el} className="train-cursor" data-mode="hidden" aria-hidden="true">
      <span />
    </div>
  )
}
