import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  z: number
}

// theme palette as rgb triplets: indigo, violet, pink, cyan, emerald
const PALETTE = ['129,140,248', '167,139,250', '240,171,252', '34,211,238', '52,211,153']
const LINK = 130
const CURSOR = 165
const PARALLAX = 36

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let running = false
    let time = 0
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    const mouse = { x: -9999, y: -9999 }
    const particles: Particle[] = []
    let rx: number[] = []
    let ry: number[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      const count = Math.min(95, Math.max(42, Math.floor(width / 14)))
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          size: 1.2 + Math.random() * 1.6,
          color: PALETTE[(Math.random() * PALETTE.length) | 0],
          z: 0.15 + Math.random() * 0.85,
        })
      }
      // draw far particles first, near ones last (on top)
      particles.sort((a, b) => a.z - b.z)
      rx = new Array(count)
      ry = new Array(count)
    }

    const draw = () => {
      time += 0.016
      px += (tx - px) * 0.05
      py += (ty - py) * 0.05
      const autoX = Math.sin(time * 0.18) * 0.15
      const autoY = Math.cos(time * 0.15) * 0.12
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        rx[i] = p.x + (px + autoX) * p.z * PARALLAX
        ry[i] = p.y + (py + autoY) * p.z * PARALLAX
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const ax = rx[i]
        const ay = ry[i]
        for (let j = i + 1; j < particles.length; j++) {
          const dx = ax - rx[j]
          const dy = ay - ry[j]
          const dist = Math.hypot(dx, dy)
          if (dist < LINK) {
            const depth = 0.5 + ((p.z + particles[j].z) / 2) * 0.5
            ctx.strokeStyle = `rgba(129,140,248,${0.16 * depth * (1 - dist / LINK)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(rx[j], ry[j])
            ctx.stroke()
          }
        }

        const md = Math.hypot(ax - mouse.x, ay - mouse.y)
        const near = md < CURSOR
        if (near) {
          ctx.strokeStyle = `rgba(${p.color},${0.32 * (1 - md / CURSOR)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }

        const alpha = near ? 0.95 : 0.3 + p.z * 0.55
        const radius = p.size * (0.5 + p.z) + (near ? 0.6 : 0)
        ctx.fillStyle = `rgba(${near ? '180,160,255' : p.color},${alpha})`
        ctx.beginPath()
        ctx.arc(ax, ay, radius, 0, Math.PI * 2)
        ctx.fill()
      }

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
    io.observe(canvas)

    return () => {
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
