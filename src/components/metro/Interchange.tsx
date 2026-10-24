import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../lib/motion'

type Props = {
  /** colour token of the chapter we leave / enter */
  from: string
  to: string
  fromLabel: string
  toLabel: string
  kicker: string
}

const D = 1000 // timeline length; currentTime is driven by scroll (0..D)

// "Correspondencia": the signature chapter change, used three times only.
// Scroll-linked and reversible (never time-based, so menu jumps just pass through):
// the outgoing line retracts into the knot, the new one leaves at 45°, a disc of the
// next chapter's colour opens from the knot and the sign switches lines.
export function Interchange({ from, to, fromLabel, toLabel, kicker }: Props) {
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || reduce) return
    const q = (s: string) => el.querySelector(s) as HTMLElement
    const opts: KeyframeAnimationOptions = { duration: D, fill: 'both', easing: 'linear' }
    // the scroll stays linear; within each keyframe span the part accelerates and settles
    const io2 = 'cubic-bezier(0.65, 0, 0.35, 1)'
    const easing = ['linear', io2, 'linear']
    const anims = [
      q('.ix-disc').animate({ transform: ['scale(0)', 'scale(0)', 'scale(1)', 'scale(1)'], offset: [0, 0.3, 0.75, 1], easing }, opts),
      q('.ix-out').animate({ transform: ['scaleX(1)', 'scaleX(1)', 'scaleX(0)', 'scaleX(0)'], offset: [0, 0.1, 0.5, 1], easing }, opts),
      q('.ix-in').animate({ transform: ['rotate(45deg) scaleX(0)', 'rotate(45deg) scaleX(0)', 'rotate(45deg) scaleX(1)', 'rotate(45deg) scaleX(1)'], offset: [0, 0.4, 0.85, 1], easing }, opts),
      q('.ix-from').animate({ opacity: [1, 1, 0, 0], transform: ['none', 'none', 'translateY(-8px)', 'translateY(-8px)'], offset: [0, 0.36, 0.47, 1], easing }, opts),
      q('.ix-to').animate({ opacity: [0, 0, 1, 1], transform: ['translateY(8px)', 'translateY(8px)', 'none', 'none'], offset: [0, 0.5, 0.62, 1], easing }, opts),
    ]
    anims.forEach((a) => a.pause())

    let raf = 0
    let last = -1
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the band enters at the bottom, 1 when it has risen to the top third
      const p = Math.min(Math.max((vh - r.top) / (vh * 0.75 + r.height * 0.25), 0), 1)
      const t = Math.round(p * D)
      if (t === last) return
      last = t
      for (const a of anims) a.currentTime = t
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // only listen while it's near the screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true })
        update()
      } else window.removeEventListener('scroll', onScroll)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      anims.forEach((a) => a.cancel())
    }
  }, [reduce])

  const vars = { ['--ix-from' as string]: `var(--${from})`, ['--ix-to' as string]: `var(--${to})` } as CSSProperties
  return (
    <div ref={root} className={`interchange relative h-[166px] overflow-hidden lg:h-[240px] ${reduce ? 'is-static' : ''}`} style={vars} aria-hidden="true">
      {/* the knot "lights up": a defined disc of the next chapter's colour */}
      <span className="ix-disc absolute left-1/2 top-1/2 -ml-[102px] -mt-[102px] h-[204px] w-[204px] rounded-full lg:-ml-[120px] lg:-mt-[120px] lg:h-[240px] lg:w-[240px]" />
      <span className="ix-out absolute left-0 top-1/2 h-[10px] w-1/2 origin-right rounded-r-full" style={{ marginTop: -5 }} />
      <span className="ix-in absolute left-1/2 top-1/2 h-[10px] w-[200px] origin-left rounded-full lg:w-[280px]" style={{ marginTop: -5 }} />
      <span className="absolute left-1/2 top-1/2 h-[28px] w-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-paper-card" />
      {/* the sign sits by the knot, above the line that leaves */}
      <div className="absolute bottom-1/2 left-5 mb-6 sm:left-6 lg:left-1/2 lg:ml-14">
        <p className="sign-label text-[12px] text-ink-3">{kicker}</p>
        <div className="relative mt-1 h-[38px]">
          <p className="ix-from absolute whitespace-nowrap font-sign text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-none text-ink">{fromLabel}</p>
          <p className="ix-to absolute whitespace-nowrap font-sign text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-none text-ink">→ {toLabel}</p>
        </div>
      </div>
    </div>
  )
}
