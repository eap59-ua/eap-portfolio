import { useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetworkMapSpec, MapMarker } from '../../data/network'
import { useMotionPaused, useReducedMotion } from '../../lib/motion'
import './network-map.css'

type Pt = { x: number; y: number }

// Tiny parser for the absolute M/H/V/L paths the map uses → polyline points.
function polyline(d: string): Pt[] {
  const pts: Pt[] = []
  const re = /([MHVL])\s*([-\d.]+)(?:\s+([-\d.]+))?/g
  let m: RegExpExecArray | null
  let cur = { x: 0, y: 0 }
  while ((m = re.exec(d))) {
    const [, c, a, b] = m
    if (c === 'M' || c === 'L') cur = { x: +a, y: +b }
    else if (c === 'H') cur = { x: +a, y: cur.y }
    else if (c === 'V') cur = { x: cur.x, y: +a }
    pts.push({ ...cur })
  }
  return pts
}

/** fraction (0–1) along the polyline of the point closest to p */
function fractionOf(pts: Pt[], p: Pt) {
  let total = 0
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    const s = { a, b, len, start: total }
    total += len
    return s
  })
  let best = { d: Infinity, at: 0 }
  for (const s of segs) {
    const t = Math.max(0, Math.min(1, ((p.x - s.a.x) * (s.b.x - s.a.x) + (p.y - s.a.y) * (s.b.y - s.a.y)) / (s.len * s.len || 1)))
    const q = { x: s.a.x + t * (s.b.x - s.a.x), y: s.a.y + t * (s.b.y - s.a.y) }
    const d = Math.hypot(q.x - p.x, q.y - p.y)
    if (d < best.d) best = { d, at: (s.start + t * s.len) / total }
  }
  return { at: best.at, onPath: best.d < 3, total }
}

const DRAW_MS = 850

export function NetworkMap({ spec, className }: { spec: NetworkMapSpec; className?: string }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // stations the L1 train stops at, in order, with how long it dwells
  const journey = useMemo(() => {
    const pts = polyline(spec.trainPath)
    const stops = [
      ...spec.markers.filter((m) => (m.line === 'l1' || m.type === 'interchange' || m.type === 'next') && m.type !== 'badge'),
      { type: 'interchange' as const, x: spec.capsule.x + spec.capsule.w / 2, y: spec.capsule.y + spec.capsule.h / 2 },
    ]
      .map((m) => ({ m, ...fractionOf(pts, m) }))
      .filter((s) => s.onPath || s.m.type === 'next')
      .sort((a, b) => a.at - b.at)
    const total = fractionOf(pts, pts[0]).total
    return { stops, total }
  }, [spec])

  // SMIL timing: constant speed between stops, ease-in-out, dwell at each one
  const train = useMemo(() => {
    const speed = 210 // map units / s
    const dwell = (m: MapMarker | { type: string }) => (m.type === 'interchange' ? 1.1 : m.type === 'next' ? 0 : 0.45)
    const keyPoints: number[] = [0]
    const times: number[] = [0]
    let t = 0
    let at = 0
    for (const s of journey.stops) {
      const target = Math.max(at, Math.min(1, s.m.type === 'next' ? 1 : s.at))
      t += ((target - at) * journey.total) / speed
      keyPoints.push(target)
      times.push(t)
      at = target
      const dw = dwell(s.m)
      if (dw > 0) {
        t += dw
        keyPoints.push(target)
        times.push(t)
      }
    }
    if (at < 1) {
      t += ((1 - at) * journey.total) / speed
      keyPoints.push(1)
      times.push(t)
    }
    const dur = t
    const keyTimes = times.map((x) => +(x / dur).toFixed(4))
    keyTimes[keyTimes.length - 1] = 1
    const splines = keyPoints.slice(1).map((p, i) => (p === keyPoints[i] ? '0 0 1 1' : '0.45 0 0.55 1')).join(';')
    return { dur, keyPoints: keyPoints.map((p) => +p.toFixed(4)).join(';'), keyTimes: keyTimes.join(';'), splines }
  }, [journey])

  // pause SMIL off-screen, in hidden tabs and when the user pauses motion
  useEffect(() => {
    const svg = svgRef.current
    const wrap = wrapRef.current
    if (!svg || !wrap) return
    let visible = true
    const apply = () => {
      if (paused || !visible || document.hidden) svg.pauseAnimations()
      else svg.unpauseAnimations()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      apply()
    })
    io.observe(wrap)
    document.addEventListener('visibilitychange', apply)
    apply()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', apply)
    }
  }, [paused])

  const { w, h } = spec
  const pctX = (x: number) => `${(x / w) * 100}%`
  const pctY = (y: number) => `${(y / h) * 100}%`
  const l1Draw = (m: { x: number; y: number }) => Math.round(fractionOf(polyline(spec.trainPath), m).at * DRAW_MS)
  const markerDelay = (m: MapMarker) => {
    if (m.type === 'badge') return (spec.lines.find((l) => l.line === m.line)?.delay ?? 0) + 420
    if (m.line === 'cer') return 700
    if (m.type === 'next') return 1350
    return l1Draw(m)
  }

  return (
    <div ref={wrapRef} className={`net-map ${className ?? ''}`} style={{ aspectRatio: `${w} / ${h}`, ['--mw' as string]: w } as CSSProperties}>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} className="net-svg" aria-hidden="true" focusable="false">
        {spec.lines.map((ln) => (
          <path
            key={ln.id}
            id={`${ln.id}-${w}`}
            d={ln.d}
            pathLength={ln.kind ? undefined : 1}
            className={`net-line ${ln.kind ? `is-${ln.kind}` : 'is-solid'}`}
            style={{ stroke: `var(--${ln.line})`, ['--d' as string]: `${ln.delay}ms` } as CSSProperties}
          />
        ))}
        <rect
          x={spec.capsule.x}
          y={spec.capsule.y}
          width={spec.capsule.w}
          height={spec.capsule.h}
          rx={Math.min(spec.capsule.w, spec.capsule.h) / 2}
          className="net-capsule net-pop"
          style={{ ['--d' as string]: `${Math.round(0.47 * DRAW_MS)}ms` } as CSSProperties}
        />
        {spec.markers.map((m, i) => (
          <Marker key={i} m={m} delay={markerDelay(m)} />
        ))}
        {!reduce && (
          <g className="net-train">
            <rect x={-12} y={-6.5} width={24} height={13} rx={4} />
            <animateMotion
              dur={`${train.dur}s`}
              begin={`${DRAW_MS / 1000 + 0.3}s`}
              fill="freeze"
              rotate="auto"
              calcMode="spline"
              keyPoints={train.keyPoints}
              keyTimes={train.keyTimes}
              keySplines={train.splines}
              path={spec.trainPath}
            />
          </g>
        )}
      </svg>

      {/* labels: real text, positioned in map units */}
      <div className="net-labels" aria-hidden="true">
        {spec.labels.map((lb, i) => {
          const top = pctY(lb.y - (lb.big ? 19 : lb.name ? 14 : 11))
          const pos: CSSProperties =
            lb.anchor === 'end'
              ? { right: pctX(w - lb.x), textAlign: 'right', alignItems: 'flex-end' }
              : lb.anchor === 'middle'
                ? { left: pctX(lb.x), transform: 'translateX(-50%)', textAlign: 'center', alignItems: 'center' }
                : { left: pctX(lb.x) }
          return (
            <div key={i} className={`net-label${lb.big ? ' is-big' : ''}`} style={{ top, ...pos }}>
              {lb.name && <span className="nm">{lb.name[lang]}</span>}
              {lb.sub && <span className={`sb${lb.italic ? ' it' : ''}`}>{lb.sub[lang]}</span>}
            </div>
          )
        })}
        {spec.markers
          .filter((m) => m.type === 'badge')
          .map((m, i) => {
            const r = m.r ?? 12
            return (
              <span
                key={`n${i}`}
                className="net-num"
                style={{ left: pctX(m.x - r), top: pctY(m.y - r), width: pctX(r * 2), height: pctY(r * 2), color: m.dark ? '#16181d' : 'var(--on-line)' }}
              >
                {m.n}
              </span>
            )
          })}
        <span
          className={`net-capsule-label${spec.capsule.vertical ? ' is-vertical' : ''}`}
          style={
            spec.capsule.vertical
              ? { left: pctX(spec.capsule.x + spec.capsule.w + 10), top: pctY(spec.capsule.y + spec.capsule.h + 6) }
              : { left: pctX(spec.capsule.x), top: pctY(spec.capsule.y), width: pctX(spec.capsule.w), height: pctY(spec.capsule.h) }
          }
        >
          {spec.capsule.label[lang]}
        </span>
      </div>

      {/* every station is a real link (keyboard + screen readers) */}
      <nav className="net-hits" aria-label={lang === 'es' ? 'Estaciones del plano' : 'Map stations'}>
        {spec.markers
          .filter((m) => m.href && m.name)
          .map((m, i) => (
            <a
              key={i}
              href={m.href}
              className="net-hit"
              data-cursor="station"
              data-line={m.line ?? 'l1'}
              aria-label={m.name![lang]}
              style={{ left: pctX(m.x), top: pctY(m.y) }}
            />
          ))}
      </nav>
    </div>
  )
}

function Marker({ m, delay }: { m: MapMarker; delay: number }) {
  const style = { ['--d' as string]: `${delay}ms`, stroke: m.line ? `var(--${m.line})` : undefined } as CSSProperties
  const r = m.r ?? 7
  switch (m.type) {
    case 'study':
      return <circle cx={m.x} cy={m.y} r={r} className="net-st net-pop" style={style} />
    case 'work':
      return <rect x={m.x - 7} y={m.y - 7} width={14} height={14} rx={2} className="net-st net-pop" style={style} />
    case 'tick':
      return <rect x={m.x - 2} y={m.y - 10} width={4} height={10} className="net-pop" style={{ ...style, fill: `var(--${m.line})` }} />
    case 'interchange':
      return <circle cx={m.x} cy={m.y} r={11} className="net-xc net-pop" style={style} />
    case 'badge':
      return <circle cx={m.x} cy={m.y} r={m.r ?? 12} className="net-pop" style={{ ...style, fill: `var(--${m.line})`, stroke: 'none' }} />
    case 'next':
      return (
        <g className="net-pop" style={style}>
          <circle cx={m.x} cy={m.y} r={13} className="net-next-ring loop-anim" />
          <circle cx={m.x} cy={m.y} r={13} style={{ fill: 'var(--l1)' }} />
        </g>
      )
  }
}
