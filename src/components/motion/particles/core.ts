// Plumbing for the night background: canvas sizing (capped DPR), a frame loop
// that only runs while it is allowed to (visible tab, not paused, motion
// welcome), pointer and scroll tracking, and the palette read from the CSS
// tokens. No library: a few canvases and requestAnimationFrame.

export type RGB = readonly [number, number, number]
export type Palette = {
  paper: RGB
  ink: RGB
  /** the project lines, L1 (the trunk) first */
  lines: RGB[]
}

export type SceneOpts = {
  /** coarse pointer / small screen: fewer elements, lower DPR, 30 fps */
  lite: boolean
  /** a real mouse: the cursor may light the network */
  interactive: boolean
}

/** what the scene reacts to: the mouse (fine pointers only) and the page scroll */
export type Input = { x: number; y: number; active: boolean; scrollY: number }

/**
 * A cached layer of the scene: painted once per build on its own canvas, then
 * only moved (a compositor transform), never repainted per frame.
 */
export type Plane = {
  canvas: HTMLCanvasElement
  /** CSS box relative to the viewport, before the offset */
  left: number
  top: number
  width: number
  height: number
  /** current offset in CSS px, written by the scene in update() */
  dx: number
  dy: number
}

export interface Scene {
  /** (re)build for a viewport; returns the planes, back to front, already painted */
  build(w: number, h: number, dpr: number): Plane[]
  /** advance the simulation by dt seconds (0: just settle the planes) */
  update(dt: number, input: Input): void
  /** the moving part, redrawn every frame over the planes */
  paintDynamic(ctx: CanvasRenderingContext2D): void
  /** a single frame with no movement (prefers-reduced-motion) */
  paintStill(ctx: CanvasRenderingContext2D): void
}

export const LINE_TOKENS = ['--l1', '--eco', '--hydro', '--donation', '--studysync', '--easycab', '--chaos'] as const

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement)
  const probe = document.createElement('canvas').getContext('2d')!
  const rgb = (token: string, fallback: string): RGB => {
    // let canvas normalise whatever the token holds (hex, rgb(), named) into #rrggbb
    probe.fillStyle = fallback
    probe.fillStyle = cs.getPropertyValue(token).trim() || fallback
    const hex = String(probe.fillStyle)
    if (hex.startsWith('#') && hex.length === 7) return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    const m = hex.match(/[\d.]+/g)
    return m ? [+m[0], +m[1], +m[2]] : [139, 135, 245]
  }
  return {
    paper: rgb('--paper', '#0e1320'),
    ink: rgb('--ink', '#ece8dc'),
    lines: LINE_TOKENS.map((t) => rgb(t, '#8b87f5')),
  }
}

export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`

/** small deterministic PRNG: the same viewport always gets the same network */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** frame-rate independent approach: 1 − e^(−dt/τ) */
export const approach = (cur: number, target: number, dt: number, tau: number) => cur + (target - cur) * (1 - Math.exp(-dt / tau))

/** a soft round light, pre-rendered once so frames never pay for shadowBlur */
export function glowSprite(c: RGB, radius: number, dpr: number, alpha = 1) {
  const s = Math.ceil(radius * 2 * dpr)
  const cv = document.createElement('canvas')
  cv.width = cv.height = s
  const g = cv.getContext('2d')!
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, rgba(c, alpha))
  grad.addColorStop(0.35, rgba(c, alpha * 0.35))
  grad.addColorStop(1, rgba(c, 0))
  g.fillStyle = grad
  g.fillRect(0, 0, s, s)
  return cv
}

export type Runner = {
  setPaused(p: boolean): void
  destroy(): void
}

const transform = (p: Plane) => `translate3d(${p.dx}px,${p.dy}px,0)`

/**
 * Mounts the scene inside `host`: its cached planes (one canvas each, moved
 * with compositor transforms) under one dynamic canvas redrawn each frame.
 * The loop stops when the tab is hidden, when the visitor pauses motion, and
 * never starts with prefers-reduced-motion (one still frame instead).
 */
export function run(host: HTMLElement, scene: Scene, opts: SceneOpts & { still: boolean; paused: boolean; onFirstPaint?: () => void }): Runner {
  const dyn = document.createElement('canvas')
  const dctx = dyn.getContext('2d')!
  let planes: Plane[] = []
  const mount = (c: HTMLCanvasElement, css: string) => {
    c.setAttribute('aria-hidden', 'true')
    c.style.cssText = `position:absolute;pointer-events:none;${css}`
  }
  mount(dyn, 'left:0;top:0')
  host.appendChild(dyn)

  const dprCap = opts.lite ? 1.5 : 2
  // phones: 30 fps, scheduled with a timer so the page isn't woken up on every vsync
  const frameGap = opts.lite ? 1000 / 30 : 0
  let w = 0
  let h = 0
  let dpr = 1
  let raf = 0
  let timer = 0
  let last = 0
  let paused = opts.paused
  let destroyed = false
  let painted = false
  const input: Input = { x: -9999, y: -9999, active: false, scrollY: window.scrollY }

  const release = (c: HTMLCanvasElement) => {
    // free the backing store right away (GPU memory) instead of waiting for GC
    c.width = c.height = 0
    c.remove()
  }

  const size = () => {
    const nw = window.innerWidth
    const nh = window.innerHeight
    // phones: the URL bar resizing the viewport isn't worth a rebuild — keep the taller canvas
    if (opts.lite && nw === w && nh <= h && h - nh < 200) return false
    w = nw
    h = nh
    dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    dyn.width = Math.round(w * dpr)
    dyn.height = Math.round(h * dpr)
    dyn.style.width = `${w}px`
    dyn.style.height = `${h}px`
    planes.forEach((p) => release(p.canvas))
    planes = scene.build(w, h, dpr)
    placed = []
    for (const p of planes) {
      mount(p.canvas, `left:${p.left}px;top:${p.top}px;width:${p.width}px;height:${p.height}px;will-change:transform`)
      host.insertBefore(p.canvas, dyn)
    }
    return true
  }

  // the planes only move: a transform per plane per frame, written when it changed
  let placed: string[] = []
  const place = () => {
    planes.forEach((p, i) => {
      const t = transform(p)
      if (placed[i] !== t) p.canvas.style.transform = placed[i] = t
    })
  }

  const paint = (still: boolean) => {
    dctx.setTransform(1, 0, 0, 1, 0, 0)
    dctx.clearRect(0, 0, dyn.width, dyn.height)
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (still) scene.paintStill(dctx)
    else scene.paintDynamic(dctx)
    place()
    if (!painted) {
      painted = true
      opts.onFirstPaint?.()
    }
  }

  let running = false
  const frame = (now: number) => {
    raf = 0
    const dt = Math.min(now - last, 64) / 1000 // a long gap never makes things jump
    last = now
    scene.update(dt, input)
    paint(false)
    if (!running) return
    if (frameGap) timer = window.setTimeout(() => (raf = requestAnimationFrame(frame)), frameGap - (performance.now() - now) - 2)
    else raf = requestAnimationFrame(frame)
  }

  const canRun = () => !opts.still && !paused && !document.hidden && !destroyed
  const start = () => {
    if (running || !canRun()) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
    clearTimeout(timer)
    raf = 0
  }
  const sync = () => (canRun() ? start() : stop())

  // a frame without advancing time: the first one, and after a rebuild while stopped
  const settle = () => {
    if (opts.still) return paint(true)
    scene.update(0, input)
    paint(false)
  }

  // resize: debounced, then rebuild and repaint once
  let resizeT = 0
  const onResize = () => {
    clearTimeout(resizeT)
    resizeT = window.setTimeout(() => {
      if (size() && !running) settle()
    }, 180)
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    input.x = e.clientX
    input.y = e.clientY
    input.active = true
  }
  const onLeave = () => {
    input.active = false
  }
  const onScroll = () => {
    input.scrollY = window.scrollY
  }

  size()
  settle()

  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', sync)
  if (!opts.still) {
    // stopped (paused, hidden), the planes stay put and glide to the new scroll on resume
    window.addEventListener('scroll', onScroll, { passive: true })
    if (opts.interactive) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      window.addEventListener('blur', onLeave)
    }
  }
  sync()

  return {
    setPaused(p) {
      paused = p
      if (p) input.active = false
      sync()
    },
    destroy() {
      destroyed = true
      stop()
      clearTimeout(resizeT)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      planes.forEach((p) => release(p.canvas))
      planes = []
      release(dyn)
    },
  }
}
