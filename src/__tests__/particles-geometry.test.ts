import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../components/motion/particles/core'
import { FAR, MID, NEAR, parallaxRange, planeMargins, planeOffset, planesFor } from '../components/motion/particles/depth'
import type { Grid, Pt, Rect } from '../components/motion/particles/geometry'
import { pointAt, roundedTrack, routeAcross, routeDown, routeTrunk, trapezoid } from '../components/motion/particles/geometry'

const octilinear = (pts: Pt[]) =>
  pts.slice(1).every((b, i) => {
    const dx = Math.abs(b.x - pts[i].x)
    const dy = Math.abs(b.y - pts[i].y)
    return dx === 0 || dy === 0 || Math.abs(dx - dy) < 1e-9
  })

describe('night background geometry', () => {
  const rect: Rect = { x0: -20, y0: -30, x1: 1460, y1: 1100 }
  const grid = (G: number, seed: number): Grid => ({ G, ox: ((1440 / 2) % G) - G, oy: ((900 / 2) % G) - G, rnd: mulberry32(seed) })

  it('lays routes octilinearly (0°, 45°, 90° only) across the whole plane', () => {
    for (const seed of [1, 2, 3, 42, 1987]) {
      for (const G of [54, 54 * MID.scale, 54 * FAR.scale]) {
        const a = routeAcross(500, rect, grid(G, seed))
        expect(octilinear(a)).toBe(true)
        expect(a[0].x).toBeLessThan(rect.x0)
        expect(a[a.length - 1].x).toBeGreaterThanOrEqual(rect.x1)
        // the kinks stay inside the plane
        for (const p of a) expect(p.y > rect.y0 && p.y < rect.y1).toBe(true)

        const d = routeDown(700, rect, grid(G, seed))
        expect(octilinear(d)).toBe(true)
        expect(d[0].y).toBeLessThan(rect.y0)
        expect(d[d.length - 1].y).toBeGreaterThanOrEqual(rect.y1)
        for (const p of d) expect(p.x > rect.x0 && p.x < rect.x1).toBe(true)
      }
    }
    const t = routeTrunk(756, 9, rect, grid(54, 7))
    expect(octilinear(t)).toBe(true)
    expect(t[1].y - t[2].y).toBe(9 * 54) // one long 45° climb
  })

  it('rounds bends and samples by arc length', () => {
    const tr = roundedTrack(
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 200, y: 100 },
      ],
      20,
    )
    expect(tr.corners).toHaveLength(1)
    // rounding shortens the path a little, never lengthens it
    expect(tr.length).toBeLessThan(100 + Math.SQRT2 * 100)
    expect(tr.length).toBeGreaterThan(100 + Math.SQRT2 * 100 - 5)
    expect(pointAt(tr, 0)).toEqual({ x: 0, y: 0 })
    expect(pointAt(tr, 1e6)).toEqual({ x: 200, y: 100 })
    expect(pointAt(tr, 50)).toEqual({ x: 50, y: 0 })
  })

  it('moves trains with a trapezoidal speed profile', () => {
    const long = trapezoid(200, 60, 50)
    expect(long.pos(long.T)).toBeCloseTo(200)
    expect(long.speed(long.T / 2)).toBeCloseTo(60)
    expect(long.speed(0)).toBe(0)
    const hop = trapezoid(20, 60, 50) // too short to reach cruise speed
    expect(hop.pos(hop.T)).toBeCloseTo(20)
    expect(hop.speed(hop.T / 2)).toBeLessThan(60)
  })
})

describe('night background depth', () => {
  const h = 900

  it('orders planes far → near, two on phones', () => {
    expect(planesFor(false)).toEqual([FAR, MID, NEAR])
    expect(planesFor(true)).toEqual([FAR, NEAR])
    // farther planes are smaller, hazier, blurrier, slower, dimmer and move less
    for (const [a, b] of [
      [FAR, MID],
      [MID, NEAR],
    ]) {
      expect(a.scale).toBeLessThan(b.scale)
      expect(a.haze).toBeGreaterThan(b.haze)
      expect(a.blur).toBeGreaterThan(b.blur)
      expect(a.speed).toBeLessThan(b.speed)
      expect(a.lights).toBeLessThan(b.lights)
      expect(a.scrollK).toBeLessThan(b.scrollK)
      expect(a.sway).toBeLessThan(b.sway)
    }
    expect(NEAR.blur).toBe(0)
  })

  it('never drifts a plane past its margins', () => {
    for (const d of [FAR, MID, NEAR]) {
      const m = planeMargins(d, h, true)
      for (const mx of [-1, 0, 1])
        for (const my of [-1, 0, 1])
          for (const [follow, y] of [
            [0, 0],
            [0, 5000], // a fling down
            [5000, 0], // a fling up
            [parallaxRange(h), parallaxRange(h)],
            [20000, 20000],
          ]) {
            const o = planeOffset(d, h, mx, my, follow, y)
            expect(Math.abs(o.dx)).toBeLessThanOrEqual(m.x)
            expect(o.dy).toBeLessThanOrEqual(m.top) // moved down: the top edge stays above the viewport
            expect(-o.dy).toBeLessThanOrEqual(m.bottom) // moved up: the bottom edge stays below it
          }
    }
  })

  it('without a mouse the planes only follow the scroll', () => {
    const m = planeMargins(NEAR, h, false)
    expect(m.x).toBeLessThan(planeMargins(NEAR, h, true).x)
    const top = planeOffset(NEAR, h, 0, 0, 0, 0)
    expect(top.dx).toBeCloseTo(0)
    expect(top.dy).toBeCloseTo(0)
    // at rest, deep in the page, the drift is bounded by the parallax range
    expect(planeOffset(NEAR, h, 0, 0, 1e5, 1e5).dy).toBeCloseTo(-NEAR.scrollK * parallaxRange(h))
  })
})
