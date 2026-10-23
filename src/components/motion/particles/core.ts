// Shared plumbing for the night backgrounds: canvas sizing (capped DPR), a
// frame loop that only runs while it is allowed to (visible tab, not paused,
// motion welcome), pointer tracking, and the palette read from the CSS tokens.
// No library: two canvases and requestAnimationFrame.

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

export type Pointer = { x: number; y: number; active: boolean }

export interface Scene {
  /** (re)build the geometry for a viewport, then paint the static layer */
  build(w: number, h: number, dpr: number): void
  /** optional: a layer painted once per build (scenes where everything moves omit it: one canvas less) */
  paintStatic?(ctx: CanvasRenderingContext2D): void
  /** advance the simulation by dt seconds */
  update(dt: number, pointer: Pointer): void
  paintDynamic(ctx: CanvasRenderingContext2D, pointer: Pointer): void
  /** a single frame with no movement (prefers-reduced-motion) */
  paintStill(ctx: CanvasRenderingContext2D): void
  /** optional: page scroll delta in CSS px (for depth) */
  scrolled?(dy: number): void
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

/**
 * Mounts the scene on two stacked canvases inside `host`: a static layer painted
 * once per build and a dynamic layer redrawn each frame. The loop stops when the
 * tab is hidden, when the visitor pauses motion, and never starts with
 * prefers-reduced-motion (one still frame instead).
 */
export function run(host: HTMLElement, scene: Scene, opts: SceneOpts & { still: boolean; paused: boolean; onFirstPaint?: () => void }): Runner {
  const stat = scene.paintStatic ? document.createElement('canvas') : null
  const dyn = document.createElement('canvas')
  const layers = stat ? [stat, dyn] : [dyn]
  for (const c of layers) {
    c.setAttribute('aria-hidden', 'true')
    c.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none'
    host.appendChild(c)
  }
  const sctx = stat?.getContext('2d') ?? null
  const dctx = dyn.getContext('2d')!

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
  const pointer: Pointer = { x: -9999, y: -9999, active: false }

  const size = () => {
    const nw = window.innerWidth
    const nh = window.innerHeight
    // phones: the URL bar resizing the viewport isn't worth a rebuild — keep the taller canvas
    if (opts.lite && nw === w && nh <= h && h - nh < 200) return false
    w = nw
    h = nh
    dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    for (const c of layers) {
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      c.style.width = `${w}px`
      c.style.height = `${h}px`
    }
    scene.build(w, h, dpr)
    if (stat && sctx && scene.paintStatic) {
      sctx.setTransform(1, 0, 0, 1, 0, 0)
      sctx.clearRect(0, 0, stat.width, stat.height)
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene.paintStatic(sctx)
    }
    return true
  }

  const clearDyn = () => {
    dctx.setTransform(1, 0, 0, 1, 0, 0)
    dctx.clearRect(0, 0, dyn.width, dyn.height)
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const firstPaint = () => {
    if (painted) return
    painted = true
    opts.onFirstPaint?.()
  }

  const paintStill = () => {
    clearDyn()
    scene.paintStill(dctx)
    firstPaint()
  }

  let running = false
  const frame = (now: number) => {
    raf = 0
    const dt = Math.min(now - last, 64) / 1000 // a long gap never makes things jump
    last = now
    scene.update(dt, pointer)
    clearDyn()
    scene.paintDynamic(dctx, pointer)
    firstPaint()
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

  // resize: debounced, then rebuild (the still frame is repainted too)
  let resizeT = 0
  const onResize = () => {
    clearTimeout(resizeT)
    resizeT = window.setTimeout(() => {
      if (!size()) return
      if (opts.still) paintStill()
      else if (!running) {
        // paused or hidden: repaint the new geometry once, without advancing time
        scene.update(0, pointer)
        clearDyn()
        scene.paintDynamic(dctx, pointer)
      }
    }, 180)
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.active = true
  }
  const onLeave = () => {
    pointer.active = false
  }
  let lastY = window.scrollY
  const onScroll = () => {
    const y = window.scrollY
    if (running) scene.scrolled?.(y - lastY) // paused: the mesh stays put, no jump on resume
    lastY = y
  }

  size()
  if (opts.still) paintStill()
  else {
    // the first frame paints right away, even if the loop is paused
    scene.update(0, pointer)
    clearDyn()
    scene.paintDynamic(dctx, pointer)
    firstPaint()
  }

  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', sync)
  if (!opts.still) {
    if (scene.scrolled) window.addEventListener('scroll', onScroll, { passive: true })
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
      if (p) pointer.active = false
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
      // release the backing stores right away (GPU memory) instead of waiting for GC
      for (const c of layers) {
        c.width = c.height = 0
        c.remove()
      }
    },
  }
}
