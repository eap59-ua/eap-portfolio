import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { LineId } from '../../data/lines'
import { useFinePointer, useReducedMotion } from '../../lib/motion'

// A project's stack drawn as stations on its line. On a mouse, a small train
// follows the pointer along the track and snaps to the nearest technology
// (interruptible CSS transition, no keyframes). Otherwise it waits at the start.
export function StationTrack({ stops, line, dashed }: { stops: string[]; line: LineId; dashed?: boolean }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)
  const n = stops.length
  const at = (i: number) => (n === 1 ? 50 : 3 + (i * 94) / (n - 1))
  // under ~100px per stop the labels alternate above/below the line
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width / n < 100))
    ro.observe(el)
    return () => ro.disconnect()
  }, [n])
  const T = narrow ? 42 : 14 // y of the line (room above for two-line labels)
  const H = narrow ? 96 : 60

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const p = ((e.clientX - r.left) / r.width) * 100
    let best = 0
    for (let i = 1; i < n; i++) if (Math.abs(at(i) - p) < Math.abs(at(best) - p)) best = i
    setActive(best)
  }

  const trainAt = active < 0 ? at(0) : at(active)
  return (
    <div
      ref={ref}
      className="relative select-none"
      style={{ height: H, ['--lc' as string]: `var(--${line})`, containerType: 'inline-size' } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(-1)}
      aria-hidden="true"
    >
      <span
        className="absolute inset-x-0 h-[7px] rounded-full"
        style={
          dashed
            ? { top: T, backgroundImage: `repeating-linear-gradient(90deg, var(--${line}) 0 14px, transparent 14px 23px)` }
            : { top: T, background: `var(--${line})` }
        }
      />
      {stops.map((s, i) => (
        <span key={s}>
          <span
            className="absolute h-[17px] w-[17px] rounded-full border-4 bg-paper-card transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ top: T - 5, left: `calc(${at(i)}% - 8.5px)`, borderColor: i === active ? 'var(--ink)' : `var(--${line})`, transform: i === active ? 'scale(1.25)' : 'none' }}
          />
          <span
            className={`absolute w-[90px] ${i === 0 ? '-translate-x-[9px] text-left' : i === n - 1 ? '-translate-x-[81px] text-right' : '-translate-x-1/2 text-center'} font-sign text-[14px] font-semibold leading-tight transition-colors duration-200 ${
              i === active ? 'text-ink' : 'text-ink-2'
            }`}
            style={narrow && i % 2 ? { bottom: H - T + 8, left: `${at(i)}%` } : { top: T + 18, left: `${at(i)}%` }}
          >
            {s}
          </span>
        </span>
      ))}
      {!reduce && (
        <span
          className="absolute h-[15px] w-[28px] rounded-[5px] bg-ink shadow-[0_0_0_3px_var(--card)] transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ top: T - 4, transform: `translateX(calc(${trainAt}cqw - 14px))` }}
        />
      )}
    </div>
  )
}
