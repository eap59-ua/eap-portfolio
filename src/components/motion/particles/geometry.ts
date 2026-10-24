// Pure geometry for the night background (no DOM): octilinear routes on a grid,
// rounded metro bends, arc-length sampling and a train's speed profile. Unit-tested.

export type Pt = { x: number; y: number }

/** the area a network covers (a plane is a bit larger than the viewport) */
export type Rect = { x0: number; y0: number; x1: number; y1: number }

/** a square grid of pitch G anchored at (ox, oy), with the seeded random it draws from */
export type Grid = { G: number; ox: number; oy: number; rnd: () => number }

const snap = (v: number, o: number, G: number) => Math.round((v - o) / G) * G + o
const randInt = (g: Grid, a: number, b: number) => a + Math.floor(g.rnd() * (b - a + 1))

/**
 * A line crossing the area west → east around a horizontal band: straight runs
 * of 3–6 cells joined by 45° kinks of 1–2 cells that keep it near its band and
 * inside the area. Every segment is 0° or 45°.
 */
export function routeAcross(band: number, r: Rect, g: Grid): Pt[] {
  const { G } = g
  const lo = snap(r.y0 + G, g.oy, G)
  const hi = snap(r.y1 - G, g.oy, G)
  let x = snap(r.x0 - 2 * G, g.ox, G)
  let y = Math.min(hi, Math.max(lo, snap(band, g.oy, G)))
  const pts: Pt[] = [{ x, y }]
  while (x < r.x1 + 2 * G) {
    x += randInt(g, 3, 6) * G
    pts.push({ x, y })
    if (x >= r.x1 + 2 * G) break
    const k = randInt(g, 1, 2)
    const dy = y > band + G ? -1 : y < band - G ? 1 : g.rnd() < 0.5 ? -1 : 1
    const ny = Math.min(hi, Math.max(lo, y + dy * k * G))
    if (ny === y) continue
    x += Math.abs(ny - y)
    y = ny
    pts.push({ x, y })
  }
  return pts
}

/** the same, north → south around a vertical band: 90° runs and 45° kinks */
export function routeDown(band: number, r: Rect, g: Grid): Pt[] {
  // a down route is an across route with the axes swapped
  const t = routeAcross(band, { x0: r.y0, y0: r.x0, x1: r.y1, y1: r.x1 }, { G: g.G, ox: g.oy, oy: g.ox, rnd: g.rnd })
  return t.map((p) => ({ x: p.y, y: p.x }))
}

/**
 * The trunk (L1): enters from the west at `fromY`, runs east, climbs one long
 * 45° diagonal of `cells` cells and leaves to the east.
 */
export function routeTrunk(fromY: number, cells: number, r: Rect, g: Grid): Pt[] {
  const { G } = g
  let x = snap(r.x0 - 2 * G, g.ox, G)
  let y = snap(fromY, g.oy, G)
  const pts: Pt[] = [{ x, y }]
  x += randInt(g, 3, 4) * G
  pts.push({ x, y })
  x += cells * G
  y -= cells * G
  pts.push({ x, y })
  pts.push({ x: snap(r.x1 + 2 * G, g.ox, G), y })
  return pts
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
