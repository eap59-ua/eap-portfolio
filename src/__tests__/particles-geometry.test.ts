import { describe, expect, it } from 'vitest'
import { octiRoute, pointAt, roundedTrack, trapezoid } from '../components/motion/particles/geometry'

describe('night background geometry', () => {
  it('routes links octilinearly (straight run + 45° run)', () => {
    for (const [a, b] of [
      [{ x: 0, y: 0 }, { x: 100, y: 30 }],
      [{ x: 0, y: 0 }, { x: -20, y: 90 }],
      [{ x: 10, y: 10 }, { x: -50, y: -50 }],
    ]) {
      const [, bend, end] = octiRoute(a, b)
      expect(end).toEqual(b)
      // first leg is axis-aligned, second leg is exactly 45°
      expect(bend.x === a.x || bend.y === a.y).toBe(true)
      expect(Math.abs(Math.abs(b.x - bend.x) - Math.abs(b.y - bend.y))).toBeLessThan(1e-9)
    }
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
