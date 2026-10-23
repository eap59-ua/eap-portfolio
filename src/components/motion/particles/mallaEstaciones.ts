// Option B · "Malla de estaciones": station nodes drift slowly along the eight
// metro directions and link up when they come close — never with a straight
// diagonal, always an octilinear route (a straight run + a 45° run, rounded
// bend), and never more than three links per station, so it reads as a
// network being planned rather than a particle web. On a real mouse the
// cursor is a hub: the nearest stations route to it and drift towards it.
import type { Palette, Pointer, Scene, SceneOpts } from './core'
import { approach, mulberry32, rgba } from './core'
import type { Pt } from './geometry'
import { DIRS, octiRoute } from './geometry'

type Node = { x: number; y: number; vx: number; vy: number; dir: number; speed: number; turn: number; c: number; ix: number; hub: number }

const LINK_A = 0.2
const NODE_A = 0.42
const HUB_R = 190
const HUB_RING = 74 // stations settle around the hub, not on it
const PARALLAX = 0.12 // the mesh scrolls slower than the page: it sits behind it

export function createScene(opts: SceneOpts, pal: Palette): Scene {
  const { lite, interactive } = opts
  const colStr = pal.lines.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`)
  const paperStr = rgba(pal.paper, 1)
  const inkStr = `rgb(${pal.ink[0]},${pal.ink[1]},${pal.ink[2]})`
  const D = lite ? 128 : 165 // link range
  const MAX_DEG = lite ? 2 : 3
  let nodes: Node[] = []
  let W = 0
  let H = 0
  let shift = 0
  const fades = new Map<number, number>() // link key → 0..1
  const chosen = new Set<number>()
  const deg: number[] = []
  const hub = { x: -9999, y: -9999, a: 0 }
  const cand: { a: number; b: number; d: number }[] = []

  function build(w: number, h: number) {
    const rnd = mulberry32(2026)
    const old = nodes
    const n = Math.round(Math.min(lite ? 22 : 64, Math.max(lite ? 12 : 30, (w * h) / (lite ? 20000 : 24000))))
    nodes = []
    for (let i = 0; i < n; i++) {
      const prev = old[i]
      const dir = Math.floor(rnd() * 8)
      const speed = (lite ? 4 : 5) + rnd() * (lite ? 4 : 6)
      const d = DIRS[dir]
      const k = speed / Math.hypot(d.x, d.y)
      // keep the existing stations through a resize (scaled), only add/remove the rest
      nodes.push({
        x: prev && W ? (prev.x / W) * w : rnd() * w,
        y: prev && H ? (prev.y / H) * h : rnd() * h,
        vx: d.x * k,
        vy: d.y * k,
        dir,
        speed,
        turn: 5 + rnd() * 10,
        c: rnd() < 0.3 ? 0 : 1 + Math.floor(rnd() * (pal.lines.length - 1)),
        ix: 0,
        hub: 0,
      })
    }
    W = w
    H = h
    fades.clear()
    select()
    fades.forEach((_, k) => fades.set(k, chosen.has(k) ? 1 : 0))
  }

  /** links: the closest pairs first, each station capped at MAX_DEG — a sparse metro graph */
  function select() {
    cand.length = 0
    for (let a = 0; a < nodes.length; a++)
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[b].x - nodes[a].x
        const dy = nodes[b].y - nodes[a].y
        if (Math.abs(dx) > D || Math.abs(dy) > D) continue
        const d = Math.hypot(dx, dy)
        if (d < D) cand.push({ a, b, d })
      }
    cand.sort((p, q) => p.d - q.d)
    chosen.clear()
    deg.length = nodes.length
    deg.fill(0)
    for (const { a, b } of cand) {
      if (deg[a] >= MAX_DEG || deg[b] >= MAX_DEG) continue
      deg[a]++
      deg[b]++
      const key = a * 4096 + b
      chosen.add(key)
      if (!fades.has(key)) fades.set(key, 0)
    }
  }

  function update(dt: number, p: Pointer) {
    const on = interactive && p.active
    if (on) {
      if (hub.a < 0.01) {
        hub.x = p.x
        hub.y = p.y
      }
      hub.x = approach(hub.x, p.x, dt, 0.08)
      hub.y = approach(hub.y, p.y, dt, 0.08)
    }
    hub.a = approach(hub.a, on ? 1 : 0, dt, on ? 0.2 : 0.6)

    const M = D * 0.5
    const dy = shift
    shift = 0
    // the 4 stations nearest the hub route to it
    const near: number[] = []
    if (hub.a > 0.01) {
      const ds = nodes.map((n, i) => [Math.hypot(n.x - hub.x, n.y - hub.y), i] as const).filter(([d]) => d < HUB_R)
      ds.sort((a, b) => a[0] - b[0])
      for (let k = 0; k < Math.min(4, ds.length); k++) near.push(ds[k][1])
    }
    nodes.forEach((n, i) => {
      n.turn -= dt
      if (n.turn <= 0) {
        // a gentle 45° change of heading every few seconds
        n.dir = (n.dir + (Math.random() < 0.5 ? 1 : 7)) % 8
        n.turn = 6 + Math.random() * 10
      }
      const d = DIRS[n.dir]
      const k = n.speed / Math.hypot(d.x, d.y)
      let tx = d.x * k
      let ty = d.y * k
      const isNear = near.includes(i)
      if (isNear) {
        // spring towards a ring around the hub
        const hx = hub.x - n.x
        const hy = hub.y - n.y
        const hd = Math.hypot(hx, hy) || 1
        const pull = ((hd - HUB_RING) / hd) * 0.55 * hub.a
        tx += hx * pull
        ty += hy * pull
      }
      n.vx = approach(n.vx, tx, dt, isNear ? 0.6 : 1.6)
      n.vy = approach(n.vy, ty, dt, isNear ? 0.6 : 1.6)
      n.x += n.vx * dt
      n.y += n.vy * dt - dy * PARALLAX
      // wrap off-screen, out of sight
      if (n.x < -M) n.x += W + 2 * M
      else if (n.x > W + M) n.x -= W + 2 * M
      if (n.y < -M) n.y += H + 2 * M
      else if (n.y > H + M) n.y -= H + 2 * M
      n.hub = approach(n.hub, isNear ? hub.a : 0, dt, isNear ? 0.2 : 0.45)
    })

    select()
    // links fade in and out: the graph re-routes, it never pops
    fades.forEach((f, key) => {
      const target = chosen.has(key) ? 1 : 0
      const nf = approach(f, target, dt, target ? 0.6 : 0.35)
      if (!target && nf < 0.01) fades.delete(key)
      else fades.set(key, nf)
    })
    nodes.forEach((n, i) => (n.ix = approach(n.ix, deg[i] >= 3 ? 1 : 0, dt, 0.5)))
  }

  function route(ctx: CanvasRenderingContext2D, a: Pt, b: Pt) {
    const [, bend] = octiRoute(a, b)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    const r = Math.min(10, Math.hypot(bend.x - a.x, bend.y - a.y) / 2, Math.hypot(b.x - bend.x, b.y - bend.y) / 2)
    if (r > 0.5) ctx.arcTo(bend.x, bend.y, b.x, b.y, r)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  const falloff = (d: number, R: number) => {
    const u = Math.min(1, Math.max(0, (d - R * 0.5) / (R * 0.5)))
    return 1 - u * u * (3 - 2 * u)
  }

  function paint(ctx: CanvasRenderingContext2D, still: boolean) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = lite ? 1.3 : 1.5
    fades.forEach((f, key) => {
      const a = nodes[Math.floor(key / 4096)]
      const b = nodes[key % 4096]
      if (!a || !b) return
      const alpha = LINK_A * (still ? (chosen.has(key) ? 1 : 0) : f) * falloff(Math.hypot(b.x - a.x, b.y - a.y), D)
      if (alpha < 0.004) return
      ctx.globalAlpha = alpha
      ctx.strokeStyle = colStr[a.c]
      route(ctx, a, b)
    })
    if (!still && hub.a > 0.01) {
      ctx.lineWidth = 1.6
      for (const n of nodes) {
        if (n.hub < 0.01) continue
        ctx.globalAlpha = 0.42 * n.hub * falloff(Math.hypot(n.x - hub.x, n.y - hub.y), HUB_R)
        ctx.strokeStyle = colStr[n.c]
        route(ctx, n, hub)
      }
      ctx.globalAlpha = 0.32 * hub.a
      ctx.strokeStyle = inkStr
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(hub.x, hub.y, 5, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.lineWidth = 1.3
    for (const n of nodes) {
      const r = 2.3 + n.ix * 1.3 + n.hub * 0.6
      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.globalAlpha = 1
      ctx.fillStyle = paperStr
      ctx.fill()
      ctx.globalAlpha = NODE_A + n.hub * 0.35
      // interchanges take the ink ring, like on the map
      ctx.strokeStyle = n.ix > 0.5 ? inkStr : colStr[n.c]
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  return {
    build, // everything moves: no static layer, a single canvas
    update,
    paintDynamic: (ctx) => paint(ctx, false),
    paintStill: (ctx) => {
      nodes.forEach((n, i) => (n.ix = deg[i] >= 3 ? 1 : 0))
      paint(ctx, true)
    },
    scrolled(d) {
      shift += d
    },
  }
}
