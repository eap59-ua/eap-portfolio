import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
}

// theme palette as rgb triplets: indigo, violet, pink, cyan, emerald
const PALETTE = ['129,140,248', '167,139,250', '240,171,252', '34,211,238', '52,211,153']
const LINK = 130 // max px distance to draw a connecting line
const CURSOR = 165 // max px distance to thread a particle to the cursor
const ORBIT = 0.34 // how far the cursor rotates the cloud (radians)
const AUTO = 0.12 // idle auto-orbit amplitude (radians)
const CAM = 3.2 // camera distance — higher means a flatter perspective
const SPREAD = 0.52 // fraction of the viewport the cloud fills

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // on phones: fewer particles and skip the O(n²) line-linking (biggest per-frame cost)
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let raf = 0
    let running = false
    let time = 0
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    const mouse = { x: -9999, y: -9999 }
    const particles: Particle[] = []
    let sx: number[] = []
    let sy: number[] = []
    let pr: number[] = []
    let order: number[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      cx = width / 2
      cy = height / 2
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      const count = isMobile
        ? Math.min(44, Math.max(24, Math.floor(width / 22)))
        : Math.min(95, Math.max(42, Math.floor(width / 14)))
      particles.length = 0
      for (let i = 0; i < count; i++) {
        // particles live in a normalized 3D cube: x, y, z in [-1, 1]
        particles.push({
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          z: Math.random() * 2 - 1,
          vx: (Math.random() - 0.5) * 0.0016,
          vy: (Math.random() - 0.5) * 0.0016,
          vz: (Math.random() - 0.5) * 0.0011,
          size: 1.2 + Math.random() * 1.6,
          color: PALETTE[(Math.random() * PALETTE.length) | 0],
        })
      }
      sx = new Array(count)
      sy = new Array(count)
      pr = new Array(count)
      order = particles.map((_, i) => i)
    }

    // normalize the perspective scale (~0.74..1.52) into a 0..1 depth cue
    const dn = (per: number) => {
      const n = (per - 0.74) / 0.78
      return n < 0 ? 0 : n > 1 ? 1 : n
    }

    // rotate the whole cloud through a perspective camera, then paint a frame
    const paint = (yaw: number, pitch: number) => {
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const cosX = Math.cos(pitch)
      const sinX = Math.sin(pitch)
      const sw = width * SPREAD
      const sh = height * SPREAD

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const x1 = p.x * cosY + p.z * sinY // yaw around the Y axis
        const z1 = -p.x * sinY + p.z * cosY
        const y1 = p.y * cosX - z1 * sinX // pitch around the X axis
        const z2 = p.y * sinX + z1 * cosX
        const per = CAM / (CAM + z2) // perspective divide: near is bigger
        sx[i] = cx + x1 * sw * per
        sy[i] = cy + y1 * sh * per
        pr[i] = per
      }

      // draw far particles first so near ones overlay them
      order.sort((a, b) => pr[a] - pr[b])

      ctx.clearRect(0, 0, width, height)

      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const ax = sx[i]
        const ay = sy[i]
        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = ax - sx[j]
            const dy = ay - sy[j]
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < LINK) {
              const depth = 0.5 + ((dn(pr[i]) + dn(pr[j])) / 2) * 0.5
              ctx.strokeStyle = `rgba(129,140,248,${0.16 * depth * (1 - dist / LINK)})`
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(sx[j], sy[j])
              ctx.stroke()
            }
          }
        }

        const md = Math.sqrt((ax - mouse.x) * (ax - mouse.x) + (ay - mouse.y) * (ay - mouse.y))
        if (md < CURSOR) {
          // links that thread to the cursor: a touch brighter/thicker — the cursor "pulls"
          const pull = 1 - md / CURSOR
          ctx.lineWidth = 1.35
          ctx.strokeStyle = `rgba(196,181,253,${0.16 + 0.42 * pull})`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
          ctx.lineWidth = 1
        }
      }

      for (let k = 0; k < order.length; k++) {
        const i = order[k]
        const p = particles[i]
        const dx = sx[i] - mouse.x
        const dy = sy[i] - mouse.y
        const near = Math.sqrt(dx * dx + dy * dy) < CURSOR
        const alpha = near ? 0.95 : 0.3 + dn(pr[i]) * 0.6
        const radius = p.size * (0.45 + pr[i] * 0.85) + (near ? 0.6 : 0)
        ctx.fillStyle = `rgba(${near ? '180,160,255' : p.color},${alpha})`
        ctx.beginPath()
        ctx.arc(sx[i], sy[i], radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const draw = () => {
      time += 0.016
      px += (tx - px) * 0.05
      py += (ty - py) * 0.05
      const autoX = Math.sin(time * 0.18)
      const autoY = Math.cos(time * 0.15)
      const yaw = px * ORBIT + autoX * AUTO
      const pitch = -(py * ORBIT * 0.7) - autoY * AUTO * 0.7

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
        if (p.x < -1 || p.x > 1) p.vx *= -1
        if (p.y < -1 || p.y > 1) p.vy *= -1
        if (p.z < -1 || p.z > 1) p.vz *= -1
      }

      paint(yaw, pitch)
      raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // reduced motion: render a single frame with a gentle fixed tilt — depth, no motion
    if (reduce) {
      const onResizeStatic = () => {
        resize()
        seed()
        paint(0.18, 0.09)
      }
      onResizeStatic()
      window.addEventListener('resize', onResizeStatic)
      return () => window.removeEventListener('resize', onResizeStatic)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2))
      ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2))
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      tx = 0
      ty = 0
    }
    const onResize = () => {
      resize()
      seed()
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    resize()
    seed()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !document.hidden) start()
        else stop()
      }
    })

    // don't let the animation loop compete with first paint / LCP — kick it off on idle
    const ric = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let disposed = false
    let kick = 0
    const kickoff = () => {
      if (!disposed) io.observe(canvas)
    }
    if (ric.requestIdleCallback) {
      kick = ric.requestIdleCallback(kickoff, { timeout: 800 })
    } else {
      kick = window.setTimeout(kickoff, 300)
    }

    return () => {
      disposed = true
      if (ric.cancelIdleCallback) ric.cancelIdleCallback(kick)
      else clearTimeout(kick)
      stop()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
    }
  }, [reduce])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
