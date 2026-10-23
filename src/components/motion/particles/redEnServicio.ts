// Option A · "Red en servicio": a schematic metro network laid faintly across
// the night background — octilinear lines (0°/45°/90°) in the project colours,
// rounded bends, stations, interchanges — with small trains that accelerate,
// cruise, brake and dwell at each station. On a real mouse the cursor works
// like a control-room lamp: the stretch of network under it lights up and
// nearby stations come on.
import type { Palette, Pointer, RGB, Scene, SceneOpts } from './core'
import { approach, glowSprite, mulberry32, rgba } from './core'
import type { Pt, Track } from './geometry'
import { pointAt, roundedTrack, trapezoid } from './geometry'

type Station = { x: number; y: number; s: number; line: number; ix: boolean; hidden: boolean; lit: number; arrive: number }
type Line = { c: number; track: Track; path: Path2D; stations: Station[] }
type Train = {
  line: Line
  i: number
  dir: 1 | -1
  run: boolean
  t: number
  dwell: number
  s0: number
  s: number
  v: number
  prof: ReturnType<typeof trapezoid> | null
}

// tuned by eye on the night palette: the network must stay a texture behind the text
const LINE_A = 0.1
const STATION_A = 0.22
const TORCH_R = 210
const LIT_R = 170

export function createScene(opts: SceneOpts, pal: Palette): Scene {
  const { lite, interactive } = opts
  const colStr = pal.lines.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`)
  const paperStr = rgba(pal.paper, 1)
  const inkStr = `rgb(${pal.ink[0]},${pal.ink[1]},${pal.ink[2]})`
  let lines: Line[] = []
  let stations: Station[] = []
  let trains: Train[] = []
  let sprites: HTMLCanvasElement[] = []
  let torch: HTMLCanvasElement | null = null
  let tctx: CanvasRenderingContext2D | null = null
  let dpr = 1
  const hub = { x: -9999, y: -9999, a: 0 }
  const tmp: Pt = { x: 0, y: 0 }
  const tail: Pt = { x: 0, y: 0 }

  function build(w: number, h: number, ratio: number) {
    dpr = ratio
    const G = lite ? 46 : 54
    const rnd = mulberry32(1987 + Math.round(w / 40) * 31 + Math.round(h / 40))
    const ox = ((w / 2) % G) - G
    const oy = ((h / 2) % G) - G
    const sx = (v: number) => Math.round((v - ox) / G) * G + ox
    const sy = (v: number) => Math.round((v - oy) / G) * G + oy
    const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1))

    // ── routes on the grid ──
    // across: enters left, runs east with 45° kinks that keep it near its band
    const across = (band: number) => {
      let x = sx(-2 * G)
      let y = sy(band)
      const pts: Pt[] = [{ x, y }]
      while (x < w + 2 * G) {
        x += int(3, 6) * G
        pts.push({ x, y })
        if (x >= w + 2 * G) break
        const k = int(1, 2)
        const dy = y > band + G ? -1 : y < band - G ? 1 : rnd() < 0.5 ? -1 : 1
        const ny = Math.min(h - G, Math.max(G, y + dy * k * G))
        if (ny === y) continue
        x += Math.abs(ny - y)
        y = ny
        pts.push({ x, y })
      }
      return pts
    }
    // down: enters top, runs south with 45° kinks
    const down = (band: number) => {
      let x = sx(band)
      let y = sy(-2 * G)
      const pts: Pt[] = [{ x, y }]
      while (y < h + 2 * G) {
        y += int(3, 6) * G
        pts.push({ x, y })
        if (y >= h + 2 * G) break
        const k = int(1, 2)
        const dx = x > band + G ? -1 : x < band - G ? 1 : rnd() < 0.5 ? -1 : 1
        const nx = Math.min(w - G, Math.max(G, x + dx * k * G))
        if (nx === x) continue
        y += Math.abs(nx - x)
        x = nx
        pts.push({ x, y })
      }
      return pts
    }
    // the trunk (L1, "Línea Backend"): from the lower left, one long 45° climb, out east
    const trunk = () => {
      let x = sx(-2 * G)
      let y = sy(h * 0.84)
      const pts: Pt[] = [{ x, y }]
      x += int(3, 4) * G
      pts.push({ x, y })
      const cells = Math.max(2, Math.min(Math.floor((h * 0.6) / G), Math.floor((w * 0.45) / G)))
      x += cells * G
      y -= cells * G
      pts.push({ x, y })
      x = sx(w + 2 * G)
      pts.push({ x, y })
      return pts
    }

    const jitter = () => (rnd() - 0.5) * 0.08
    const routes: { c: number; pts: Pt[] }[] = lite
      ? [
          { c: 0, pts: trunk() },
          { c: 1, pts: down(w * (0.22 + jitter())) },
          { c: 3, pts: down(w * (0.74 + jitter())) },
          { c: 2, pts: across(h * (0.3 + jitter())) },
        ]
      : [
          { c: 0, pts: trunk() },
          { c: 1, pts: down(w * (0.16 + jitter())) },
          { c: 2, pts: across(h * (0.2 + jitter())) },
          { c: 3, pts: down(w * (0.52 + jitter())) },
          { c: 4, pts: across(h * (0.5 + jitter())) },
          { c: 5, pts: down(w * (0.84 + jitter())) },
          { c: 6, pts: across(h * (0.86 + jitter())) },
        ]

    // ── tracks, stations ──
    stations = []
    lines = routes.map(({ c, pts }, li) => {
      const track = roundedTrack(pts, G * 0.7)
      const path = new Path2D()
      track.pts.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)))
      const line: Line = { c, track, path, stations: [] }
      for (let s = G * (1 + rnd() * 1.5); s < track.length; s += G * int(2, 3)) {
        if (track.corners.some((k) => Math.abs(k - s) < G * 0.75)) continue
        const p = pointAt(track, s)
        if (p.x < 14 || p.y < 14 || p.x > w - 14 || p.y > h - 14) continue
        const st: Station = { x: p.x, y: p.y, s, line: li, ix: false, hidden: false, lit: 0, arrive: 0 }
        line.stations.push(st)
        stations.push(st)
      }
      return line
    })
    // stations of two lines that (nearly) coincide become one interchange
    for (let i = 0; i < stations.length; i++)
      for (let j = i + 1; j < stations.length; j++) {
        const a = stations[i]
        const b = stations[j]
        if (a.line !== b.line && Math.abs(a.x - b.x) < 16 && Math.abs(a.y - b.y) < 16) {
          a.ix = b.ix = true
          if (!a.hidden) b.hidden = true
        }
      }

    // ── trains: one per line, two on the long ones (desktop) ──
    trains = []
    for (const line of lines) {
      if (line.stations.length < 2) continue
      const n = !lite && line.track.length > 1700 ? 2 : 1
      for (let k = 0; k < n; k++) {
        const i = Math.floor(((k + 0.5) / n) * line.stations.length)
        trains.push({
          line,
          i,
          dir: Math.random() < 0.5 ? 1 : -1,
          run: false,
          t: 0,
          dwell: 0.3 + Math.random() * 2.2, // desync the first departures
          s0: line.stations[i].s,
          s: line.stations[i].s,
          v: 0,
          prof: null,
        })
      }
    }

    sprites = pal.lines.map((c) => glowSprite(c, 12, dpr))
    if (interactive) {
      torch = document.createElement('canvas')
      torch.width = torch.height = Math.ceil(TORCH_R * 2 * dpr)
      tctx = torch.getContext('2d')
    }
  }

  function station(ctx: CanvasRenderingContext2D, st: Station, c: RGB, alpha: number, grow: number) {
    ctx.beginPath()
    ctx.arc(st.x, st.y, (st.ix ? 3.6 : 2.4) + grow, 0, Math.PI * 2)
    ctx.fillStyle = paperStr
    ctx.globalAlpha = 1
    ctx.fill()
    ctx.strokeStyle = st.ix ? inkStr : `rgb(${c[0]},${c[1]},${c[2]})`
    ctx.globalAlpha = alpha
    ctx.stroke()
  }

  function paintStatic(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = lite ? 1.6 : 2
    for (const ln of lines) {
      ctx.strokeStyle = colStr[ln.c]
      ctx.globalAlpha = LINE_A
      ctx.stroke(ln.path)
    }
    ctx.lineWidth = 1.3
    for (const st of stations) if (!st.hidden) station(ctx, st, pal.lines[lines[st.line].c], st.ix ? STATION_A * 0.8 : STATION_A, 0)
    ctx.globalAlpha = 1
  }

  function update(dt: number, p: Pointer) {
    for (const tr of trains) {
      const sts = tr.line.stations
      tr.t += dt
      if (!tr.run) {
        if (tr.t < tr.dwell) continue
        if (tr.i + tr.dir < 0 || tr.i + tr.dir >= sts.length) tr.dir = tr.dir === 1 ? -1 : 1 // terminus: change ends
        const next = sts[tr.i + tr.dir]
        tr.s0 = sts[tr.i].s
        tr.prof = trapezoid(Math.abs(next.s - tr.s0), lite ? 58 : 68, lite ? 46 : 52)
        tr.run = true
        tr.t = 0
      }
      if (tr.run && tr.prof) {
        tr.s = tr.s0 + tr.dir * tr.prof.pos(tr.t)
        tr.v = tr.prof.speed(tr.t)
        if (tr.t >= tr.prof.T) {
          tr.i += tr.dir
          const st = sts[tr.i]
          tr.s = st.s
          tr.v = 0
          tr.run = false
          tr.t = 0
          const terminus = tr.i === 0 || tr.i === sts.length - 1
          tr.dwell = terminus ? 2.6 : st.ix ? 1.8 : 0.9 + Math.random() * 0.7
          st.arrive = 1
        }
      }
    }

    const on = interactive && p.active
    if (on) {
      if (hub.a < 0.01) {
        hub.x = p.x
        hub.y = p.y
      }
      hub.x = approach(hub.x, p.x, dt, 0.07)
      hub.y = approach(hub.y, p.y, dt, 0.07)
    }
    // fast where the system answers the hand, slow to let go
    hub.a = approach(hub.a, on ? 1 : 0, dt, on ? 0.18 : 0.5)
    for (const st of stations) {
      st.arrive = approach(st.arrive, 0, dt, 0.7)
      let target = 0
      if (hub.a > 0.01) {
        const d = Math.hypot(st.x - hub.x, st.y - hub.y)
        if (d < LIT_R) {
          const u = 1 - d / LIT_R
          target = u * u * (3 - 2 * u) * hub.a
        }
      }
      st.lit = approach(st.lit, target, dt, target > st.lit ? 0.12 : 0.45)
    }
  }

  function paintTorch(ctx: CanvasRenderingContext2D) {
    if (!torch || !tctx || hub.a < 0.01) return
    const R = TORCH_R
    const S = torch.width
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.globalCompositeOperation = 'source-over'
    tctx.clearRect(0, 0, S, S)
    tctx.setTransform(dpr, 0, 0, dpr, (R - hub.x) * dpr, (R - hub.y) * dpr)
    tctx.lineCap = 'round'
    tctx.lineJoin = 'round'
    tctx.lineWidth = 2
    tctx.globalAlpha = 0.34
    for (const ln of lines) {
      tctx.strokeStyle = colStr[ln.c]
      tctx.stroke(ln.path)
    }
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.globalAlpha = 1
    tctx.globalCompositeOperation = 'destination-in'
    const g = tctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    g.addColorStop(0, `rgba(0,0,0,${hub.a.toFixed(3)})`)
    g.addColorStop(0.45, `rgba(0,0,0,${(hub.a * 0.55).toFixed(3)})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    tctx.fillStyle = g
    tctx.fillRect(0, 0, S, S)
    tctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(torch, hub.x - R, hub.y - R, R * 2, R * 2)
  }

  function paintStations(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1.4
    for (const st of stations) {
      if (st.hidden) continue
      const glow = Math.max(st.lit, st.arrive * 0.75)
      if (glow < 0.02) continue
      const c = pal.lines[lines[st.line].c]
      ctx.globalAlpha = glow * 0.55
      ctx.drawImage(sprites[lines[st.line].c], st.x - 12, st.y - 12, 24, 24)
      station(ctx, st, c, STATION_A + glow * 0.6, glow * 1.2)
    }
    ctx.globalAlpha = 1
  }

  function paintTrains(ctx: CanvasRenderingContext2D, moving: boolean) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const tr of trains) {
      const c = pal.lines[tr.line.c]
      const head = pointAt(tr.line.track, tr.s, tmp)
      // the trail is motion, not decoration: it grows with speed and vanishes at a stop
      const len = moving ? Math.min(lite ? 30 : 44, tr.v * 0.6) : 0
      if (len > 2) {
        const n = 8
        ctx.beginPath()
        for (let k = n; k >= 0; k--) {
          const q = pointAt(tr.line.track, tr.s - tr.dir * (len * k) / n, tail)
          if (k === n) ctx.moveTo(q.x, q.y)
          else ctx.lineTo(q.x, q.y)
        }
        const t0 = pointAt(tr.line.track, tr.s - tr.dir * len, tail)
        const g = ctx.createLinearGradient(t0.x, t0.y, head.x, head.y)
        g.addColorStop(0, rgba(c, 0))
        g.addColorStop(1, rgba(c, 0.5))
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.globalAlpha = 1
        ctx.stroke()
      }
      ctx.globalAlpha = 0.5
      ctx.drawImage(sprites[tr.line.c], head.x - 10, head.y - 10, 20, 20)
      ctx.globalAlpha = 0.72
      ctx.fillStyle = colStr[tr.line.c]
      ctx.beginPath()
      ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  return {
    build,
    paintStatic,
    update,
    paintDynamic(ctx) {
      paintTorch(ctx)
      paintStations(ctx)
      paintTrains(ctx, true)
    },
    paintStill(ctx) {
      // trains parked at their platforms: the network reads as "in service", nothing moves
      paintTrains(ctx, false)
    },
  }
}
