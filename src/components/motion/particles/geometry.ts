// Pure geometry for the night backgrounds (no DOM): octilinear routing, rounded
// metro bends, arc-length sampling and a train's speed profile. Unit-tested.

export type Pt = { x: number; y: number }

/** the 8 metro directions (E, SE, S, SW, W, NW, N, NE) as unit steps on the grid */
export const DIRS: readonly Pt[] = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
]

/**
 * Octilinear route between two points: one straight run plus one 45° run, the
 * way a schematic map draws a link. The straight run goes first, so the bend
 * slides continuously as the points move (no flip when |dx| ≈ |dy|).
 * Returns [a, bend, b].
 */
export function octiRoute(a: Pt, b: Pt): [Pt, Pt, Pt] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  const sx = Math.sign(dx)
  const sy = Math.sign(dy)
  const bend = ax >= ay ? { x: a.x + sx * (ax - ay), y: a.y } : { x: a.x, y: a.y + sy * (ay - ax) }
  return [a, bend, b]
}

/** a polyline flattened with rounded bends, ready to draw and to ride along */
export type Track = { pts: Pt[]; cum: number[]; length: number; corners: number[] }

/**
 * Rounds each interior vertex with a quadratic arc of radius ≈ r (clamped to
 * half the shorter neighbouring segment) and flattens it into short segments.
 * `corners` holds the arc-length position of each bend, so stations can keep clear.
 */
export function roundedTrack(raw: Pt[], r: number, steps = 6): Track {
  const pts: Pt[] = [raw[0]]
  const cornerPts: Pt[] = []
  for (let i = 1; i < raw.length - 1; i++) {
    const p = raw[i]
    const a = raw[i - 1]
    const b = raw[i + 1]
    const la = Math.hypot(p.x - a.x, p.y - a.y)
    const lb = Math.hypot(b.x - p.x, b.y - p.y)
    const t = Math.min(r, la / 2, lb / 2)
    const p0 = { x: p.x + ((a.x - p.x) / la) * t, y: p.y + ((a.y - p.y) / la) * t }
    const p2 = { x: p.x + ((b.x - p.x) / lb) * t, y: p.y + ((b.y - p.y) / lb) * t }
    for (let k = 0; k <= steps; k++) {
      const u = k / steps
      const v = 1 - u
      pts.push({ x: v * v * p0.x + 2 * v * u * p.x + u * u * p2.x, y: v * v * p0.y + 2 * v * u * p.y + u * u * p2.y })
    }
    cornerPts.push(pts[pts.length - 1 - Math.floor(steps / 2)])
  }
  pts.push(raw[raw.length - 1])
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  const corners = cornerPts.map((c) => cum[pts.indexOf(c)])
  return { pts, cum, length: cum[cum.length - 1], corners }
}

/** point at arc length s (clamped to the track) */
export function pointAt(tr: Track, s: number, out: Pt = { x: 0, y: 0 }): Pt {
  const { pts, cum } = tr
  if (s <= 0) return Object.assign(out, pts[0])
  if (s >= tr.length) return Object.assign(out, pts[pts.length - 1])
  // binary search: tracks hold a few hundred points at most
  let lo = 0
  let hi = cum.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (cum[mid] <= s) lo = mid
    else hi = mid
  }
  const seg = cum[hi] - cum[lo] || 1
  const u = (s - cum[lo]) / seg
  out.x = pts[lo].x + (pts[hi].x - pts[lo].x) * u
  out.y = pts[lo].y + (pts[hi].y - pts[lo].y) * u
  return out
}

/**
 * A train between two stations: accelerate, cruise, brake (trapezoidal speed),
 * the way a real one moves. Short hops become a triangle (no cruise).
 */
export function trapezoid(dist: number, vmax: number, accel: number) {
  let ta = vmax / accel
  let v = vmax
  let da = 0.5 * accel * ta * ta
  let tc: number
  if (2 * da > dist) {
    ta = Math.sqrt(dist / accel)
    v = accel * ta
    da = dist / 2
    tc = 0
  } else tc = (dist - 2 * da) / v
  const T = 2 * ta + tc
  return {
    T,
    pos(t: number) {
      if (t <= 0) return 0
      if (t >= T) return dist
      if (t < ta) return 0.5 * accel * t * t
      if (t < ta + tc) return da + v * (t - ta)
      const r = T - t
      return dist - 0.5 * accel * r * r
    },
    speed(t: number) {
      if (t <= 0 || t >= T) return 0
      if (t < ta) return accel * t
      if (t < ta + tc) return v
      return accel * (T - t)
    },
  }
}
