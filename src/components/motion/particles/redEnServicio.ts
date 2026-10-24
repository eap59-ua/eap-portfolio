// "Red en servicio": a schematic metro network laid faintly across the night
// background — octilinear lines (0°/45°/90°) in the project colours, rounded
// bends, stations, interchanges — with small trains that accelerate, cruise,
// brake and dwell at each station.
//
// Depth: the network is drawn on two or three planes (far → near). The far ones
// are smaller, thinner, hazier and blurred, their trains dimmer and slower; each
// plane is painted once to its own canvas and only moved afterwards (scroll and
// mouse parallax, the far ones less). Per frame only the trains, their bloom and
// the lit stations are redrawn. On a real mouse the cursor works like a
// control-room lamp over the near plane.
import type { Input, Palette, Plane, RGB, Scene, SceneOpts } from './core'
import { approach, glowSprite, mulberry32, rgba } from './core'
import type { Depth } from './depth'
import { planeMargins, planeOffset, planesFor } from './depth'
import type { Grid, Pt, Rect, Track } from './geometry'
import { pointAt, roundedTrack, routeAcross, routeDown, routeTrunk, trapezoid } from './geometry'

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
type Layer = { d: Depth; plane: Plane; lines: Line[]; stations: Station[]; trains: Train[]; col: string[] }
type RouteSpec = { c: number; kind: 'across' | 'down'; at: number }

// tuned by eye on the night palette: the network must stay a texture behind the text
const LINE_A = 0.1
const STATION_A = 0.22
const TORCH_R = 210
const LIT_R = 170
const GLOW_R = 9
const HALO_R = 30

// the planes behind the near one: where their lines run (fractions of the plane) and in which colours
const MID_ROUTES: RouteSpec[] = [
  { c: 2, kind: 'across', at: 0.1 },
  { c: 5, kind: 'down', at: 0.32 },
  { c: 0, kind: 'across', at: 0.4 },
  { c: 6, kind: 'down', at: 0.68 },
  { c: 3, kind: 'across', at: 0.7 },
]
const FAR_ROUTES: RouteSpec[] = [
  { c: 4, kind: 'across', at: 0.06 },
  { c: 1, kind: 'down', at: 0.08 },
  { c: 6, kind: 'across', at: 0.3 },
  { c: 0, kind: 'down', at: 0.44 },
  { c: 3, kind: 'across', at: 0.56 },
  { c: 5, kind: 'down', at: 0.8 },
  { c: 2, kind: 'across', at: 0.84 },
]

/** can this browser blur on a 2D canvas? (if not, blurred planes are drawn at lower resolution instead) */
function canvasBlur() {
  const g = document.createElement('canvas').getContext('2d')
  if (!g) return false
  g.filter = 'blur(1px)'
  return g.filter === 'blur(1px)'
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const css = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`

export function createScene(opts: SceneOpts, pal: Palette): Scene {
  const { lite, interactive } = opts
  const paperStr = rgba(pal.paper, 1)
  const inkStr = css(pal.ink)
  const blurs = canvasBlur()
  let layers: Layer[] = []
  let near: Layer | null = null
  let glows: HTMLCanvasElement[] = []
  let halos: HTMLCanvasElement[] = []
  let torch: HTMLCanvasElement | null = null
  let tctx: CanvasRenderingContext2D | null = null
  let torchMask: HTMLCanvasElement | null = null
  let w = 0
  let h = 0
  let dpr = 1
  let fresh = true
  // smoothed inputs: the cursor in [-1, 1] and the scroll position
  const look = { x: 0, y: 0 }
  let follow = 0
  const hub = { x: -9999, y: -9999, a: 0 }
  const tmp: Pt = { x: 0, y: 0 }
  const tail: Pt = { x: 0, y: 0 }

  // ── geometry ──
  function network(d: Depth, rect: Rect, seed: number) {
    const G = (lite ? 46 : 54) * d.scale
    const rnd = mulberry32(seed)
    const g: Grid = { G, ox: ((w / 2) % G) - G, oy: ((h / 2) % G) - G, rnd }
    const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1))
    const jitter = () => (rnd() - 0.5) * 0.08
    const X = (f: number) => rect.x0 + (rect.x1 - rect.x0) * f
    const Y = (f: number) => rect.y0 + (rect.y1 - rect.y0) * f
    const route = (r: RouteSpec) => ({ c: r.c, pts: r.kind === 'across' ? routeAcross(Y(r.at + jitter()), rect, g) : routeDown(X(r.at + jitter()), rect, g) })

    let routes: { c: number; pts: Pt[] }[]
    if (d.name === 'near') {
      // the trunk (L1, "Línea Backend"): from the lower left of the screen, one long 45° climb, out east
      const trunk = { c: 0, pts: routeTrunk(h * 0.84, Math.max(2, Math.min(Math.floor((h * 0.6) / G), Math.floor((w * 0.45) / G))), rect, g) }
      const spec: RouteSpec[] = lite
        ? [
            { c: 1, kind: 'down', at: 0.22 },
            { c: 3, kind: 'down', at: 0.74 },
            { c: 2, kind: 'across', at: 0.28 },
          ]
        : [
            { c: 1, kind: 'down', at: 0.16 },
            { c: 2, kind: 'across', at: 0.18 },
            { c: 3, kind: 'down', at: 0.52 },
            { c: 4, kind: 'across', at: 0.46 },
            { c: 5, kind: 'down', at: 0.84 },
            { c: 6, kind: 'across', at: 0.78 },
          ]
      routes = [trunk, ...spec.map(route)]
    } else {
      const spec = d.name === 'mid' ? MID_ROUTES : FAR_ROUTES
      routes = (lite ? spec.filter((_, i) => i % 2 === 0) : spec).map(route)
    }

    const stations: Station[] = []
    const edge = 14 * d.scale
    const lines = routes.map(({ c, pts }, li) => {
      const track = roundedTrack(pts, G * 0.45) // ~24 px bends on the near plane, like the hero map
      const path = new Path2D()
      track.pts.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)))
      const line: Line = { c, track, path, stations: [] }
      for (let s = G * (1 + rnd() * 1.5); s < track.length; s += G * int(2, 3)) {
        if (track.corners.some((k) => Math.abs(k - s) < G * 0.75)) continue
        const p = pointAt(track, s)
        if (p.x < rect.x0 + edge || p.y < rect.y0 + edge || p.x > rect.x1 - edge || p.y > rect.y1 - edge) continue
        const st: Station = { x: p.x, y: p.y, s, line: li, ix: false, hidden: false, lit: 0, arrive: 0 }
        line.stations.push(st)
        stations.push(st)
      }
      return line
    })
    // stations of two lines that (nearly) coincide become one interchange
    const close = 16 * d.scale
    for (let i = 0; i < stations.length; i++)
      for (let j = i + 1; j < stations.length; j++) {
        const a = stations[i]
        const b = stations[j]
        if (a.line !== b.line && Math.abs(a.x - b.x) < close && Math.abs(a.y - b.y) < close) {
          a.ix = b.ix = true
          if (!a.hidden) b.hidden = true
        }
      }

    // one train per line; on the near plane two on the long ones (desktop)
    const trains: Train[] = []
    for (const line of lines) {
      if (line.stations.length < 2) continue
      const n = !lite && d.name === 'near' && line.track.length > 1700 ? 2 : 1
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
    return { lines, stations, trains }
  }

  // ── the cached planes ──
  function station(ctx: CanvasRenderingContext2D, st: Station, stroke: string, alpha: number, grow: number, scale: number) {
    ctx.beginPath()
    ctx.arc(st.x, st.y, ((st.ix ? 3.6 : 2.4) + grow) * scale, 0, Math.PI * 2)
    ctx.fillStyle = paperStr
    ctx.globalAlpha = 1
    ctx.fill()
    ctx.strokeStyle = st.ix ? inkStr : stroke
    ctx.globalAlpha = alpha
    ctx.stroke()
  }

  function paintPlane(L: Layer, rect: Rect) {
    const { d, plane } = L
    // blurred planes don't need retina pixels; without canvas blur, fewer pixels are the blur
    const res = Math.min(dpr, d.res) * (d.blur && !blurs ? 0.6 : 1)
    const cw = Math.ceil(plane.width * res)
    const ch = Math.ceil(plane.height * res)
    const out = plane.canvas
    out.width = cw
    out.height = ch
    const blur = d.blur > 0 && blurs
    const src = blur ? document.createElement('canvas') : out
    if (blur) {
      src.width = cw
      src.height = ch
    }
    const g = src.getContext('2d')!
    g.setTransform(res, 0, 0, res, -rect.x0 * res, -rect.y0 * res)
    g.lineCap = 'round'
    g.lineJoin = 'round'
    g.lineWidth = (lite ? 1.6 : 2) * Math.max(d.scale, 0.55)
    g.globalAlpha = LINE_A * d.alpha
    for (const ln of L.lines) {
      g.strokeStyle = L.col[ln.c]
      g.stroke(ln.path)
    }
    g.lineWidth = 1.3 * Math.max(d.scale, 0.6)
    for (const st of L.stations) if (!st.hidden) station(g, st, L.col[L.lines[st.line].c], (st.ix ? STATION_A * 0.8 : STATION_A) * d.alpha, 0, d.scale)
    if (blur) {
      // the one blur this plane ever gets: here, once, never per frame
      const o = out.getContext('2d')!
      o.filter = `blur(${(d.blur * res).toFixed(2)}px)`
      o.drawImage(src, 0, 0)
      src.width = src.height = 0
    }
  }

  function build(vw: number, vh: number, ratio: number): Plane[] {
    w = vw
    h = vh
    dpr = ratio
    fresh = true
    const seedBase = 1987 + Math.round(w / 40) * 31 + Math.round(h / 40)
    const haze = pal.lines[0] // distance turns every line towards the night's own indigo
    layers = planesFor(lite).map((d, k) => {
      const m = planeMargins(d, h, interactive)
      const rect: Rect = { x0: -m.x, y0: -m.top, x1: w + m.x, y1: h + m.bottom }
      const plane: Plane = { canvas: document.createElement('canvas'), left: rect.x0, top: rect.y0, width: rect.x1 - rect.x0, height: rect.y1 - rect.y0, dx: 0, dy: 0 }
      const col = pal.lines.map((c) => css(mix(c, haze, d.haze)))
      const L: Layer = { d, plane, col, ...network(d, rect, seedBase + k * 7919) }
      paintPlane(L, rect)
      return L
    })
    near = layers[layers.length - 1]

    glows = pal.lines.map((c) => glowSprite(c, GLOW_R, dpr))
    halos = pal.lines.map((c) => glowSprite(c, HALO_R, dpr, 0.5))
    if (interactive) {
      const S = Math.ceil(TORCH_R * 2 * dpr)
      torch = document.createElement('canvas')
      torch.width = torch.height = S
      tctx = torch.getContext('2d')
      // the lamp's falloff, drawn once; its strength is set per frame with globalAlpha
      torchMask = document.createElement('canvas')
      torchMask.width = torchMask.height = S
      const mctx = torchMask.getContext('2d')!
      const grad = mctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.45, 'rgba(0,0,0,0.55)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      mctx.fillStyle = grad
      mctx.fillRect(0, 0, S, S)
    }
    return layers.map((L) => L.plane)
  }

  // ── simulation ──
  function updateTrains(L: Layer, dt: number) {
    const k = L.d.speed * L.d.scale
    for (const tr of L.trains) {
      const sts = tr.line.stations
      tr.t += dt
      if (!tr.run) {
        if (tr.t < tr.dwell) continue
        if (tr.i + tr.dir < 0 || tr.i + tr.dir >= sts.length) tr.dir = tr.dir === 1 ? -1 : 1 // terminus: change ends
        const next = sts[tr.i + tr.dir]
        tr.s0 = sts[tr.i].s
        tr.prof = trapezoid(Math.abs(next.s - tr.s0), (lite ? 58 : 68) * k, (lite ? 46 : 52) * k)
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
  }

  function update(dt: number, p: Input) {
    const on = interactive && p.active
    // parallax inputs, frame-rate independent: a slow, heavy follow reads as distance
    const tx = on ? Math.max(-1, Math.min(1, (p.x / w) * 2 - 1)) : 0
    const ty = on ? Math.max(-1, Math.min(1, (p.y / h) * 2 - 1)) : 0
    if (fresh) {
      follow = p.scrollY
      fresh = false
    }
    look.x = approach(look.x, tx, dt, 0.6)
    look.y = approach(look.y, ty, dt, 0.6)
    follow = approach(follow, p.scrollY, dt, 0.25)
    for (const L of layers) {
      const o = planeOffset(L.d, h, look.x, look.y, follow, p.scrollY)
      // whole device pixels: the near plane stays crisp and the trains sit exactly on their lines
      L.plane.dx = Math.round(o.dx * dpr) / dpr
      L.plane.dy = Math.round(o.dy * dpr) / dpr
      updateTrains(L, dt)
      for (const st of L.stations) st.arrive = approach(st.arrive, 0, dt, 0.7)
    }

    if (!near) return
    // the lamp lives on the near plane: the cursor in that plane's coordinates
    const hx = p.x - near.plane.dx
    const hy = p.y - near.plane.dy
    if (on) {
      if (hub.a < 0.01) {
        hub.x = hx
        hub.y = hy
      }
      hub.x = approach(hub.x, hx, dt, 0.07)
      hub.y = approach(hub.y, hy, dt, 0.07)
    }
    // fast where the system answers the hand, slow to let go
    hub.a = approach(hub.a, on ? 1 : 0, dt, on ? 0.18 : 0.5)
    for (const st of near.stations) {
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

  // ── per-frame painting (only what moves) ──
  function paintTorch(ctx: CanvasRenderingContext2D) {
    if (!near || !torch || !tctx || !torchMask || hub.a < 0.01) return
    const R = TORCH_R
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.globalCompositeOperation = 'source-over'
    tctx.globalAlpha = 1
    tctx.clearRect(0, 0, torch.width, torch.height)
    tctx.setTransform(dpr, 0, 0, dpr, (R - hub.x) * dpr, (R - hub.y) * dpr)
    tctx.lineCap = 'round'
    tctx.lineJoin = 'round'
    tctx.lineWidth = 2
    tctx.globalAlpha = 0.34
    for (const ln of near.lines) {
      tctx.strokeStyle = near.col[ln.c]
      tctx.stroke(ln.path)
    }
    tctx.setTransform(1, 0, 0, 1, 0, 0)
    tctx.globalCompositeOperation = 'destination-in'
    tctx.globalAlpha = hub.a
    tctx.drawImage(torchMask, 0, 0)
    ctx.drawImage(torch, hub.x - R, hub.y - R, R * 2, R * 2)
  }

  function paintStations(ctx: CanvasRenderingContext2D, L: Layer) {
    const { d } = L
    const r = 12 * d.scale
    ctx.lineWidth = 1.4 * Math.max(d.scale, 0.6)
    for (const st of L.stations) {
      if (st.hidden) continue
      const glow = Math.max(st.lit, st.arrive * 0.75) * d.lights
      if (glow < 0.02) continue
      const c = L.lines[st.line].c
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = glow * 0.55
      ctx.drawImage(glows[c], st.x - r, st.y - r, r * 2, r * 2)
      ctx.globalCompositeOperation = 'source-over'
      // only the near plane redraws the disc: on a deeper plane it would cover the lines in front
      if (L === near) station(ctx, st, L.col[c], STATION_A + glow * 0.6, glow * 1.2, d.scale)
    }
    ctx.globalAlpha = 1
  }

  function paintTrains(ctx: CanvasRenderingContext2D, L: Layer, moving: boolean) {
    const { d } = L
    const s = d.scale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const tr of L.trains) {
      const c = tr.line.c
      const head = pointAt(tr.line.track, tr.s, tmp)
      // the trail is motion, not decoration: it grows with speed and vanishes at a stop
      const len = moving ? Math.min((lite ? 30 : 44) * s, tr.v * 0.6) : 0
      if (len > 2) {
        const n = 8
        ctx.beginPath()
        for (let k = n; k >= 0; k--) {
          const q = pointAt(tr.line.track, tr.s - (tr.dir * (len * k)) / n, tail)
          if (k === n) ctx.moveTo(q.x, q.y)
          else ctx.lineTo(q.x, q.y)
        }
        const t0 = pointAt(tr.line.track, tr.s - tr.dir * len, tail)
        const g = ctx.createLinearGradient(t0.x, t0.y, head.x, head.y)
        g.addColorStop(0, rgba(pal.lines[c], 0))
        g.addColorStop(1, rgba(pal.lines[c], 0.5 * d.lights))
        ctx.strokeStyle = g
        ctx.lineWidth = 2 * Math.max(s, 0.6)
        ctx.globalAlpha = 1
        ctx.stroke()
      }
      // bloom: a wide halo and a tight glow, pre-rendered, added light on light
      ctx.globalCompositeOperation = 'lighter'
      const hr = HALO_R * s
      ctx.globalAlpha = 0.2 * d.lights
      ctx.drawImage(halos[c], head.x - hr, head.y - hr, hr * 2, hr * 2)
      const gr = GLOW_R * s
      ctx.globalAlpha = 0.6 * d.lights
      ctx.drawImage(glows[c], head.x - gr, head.y - gr, gr * 2, gr * 2)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.75 * d.lights
      ctx.fillStyle = L.col[c]
      ctx.beginPath()
      ctx.arc(head.x, head.y, 1.8 * Math.max(s, 0.6), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  return {
    build,
    update,
    paintDynamic(ctx) {
      // back to front, each plane's lights drawn where that plane currently sits
      for (const L of layers) {
        ctx.setTransform(dpr, 0, 0, dpr, L.plane.dx * dpr, L.plane.dy * dpr)
        if (L === near) paintTorch(ctx)
        paintStations(ctx, L)
        paintTrains(ctx, L, true)
      }
    },
    paintStill(ctx) {
      // trains parked at their platforms: the network reads as "in service", nothing moves
      for (const L of layers) paintTrains(ctx, L, false)
    },
  }
}
