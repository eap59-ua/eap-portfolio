import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  ox: number
  oy: number
  vx: number
  vy: number
  phase: number
}

const REPEL = 150
const LINK = 134

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
    const mouse = { x: -9999, y: -9999 }
    const particles: Particle[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      const count = Math.min(120, Math.max(50, Math.floor(width / 11)))
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        particles.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 })
      }
    }

    const draw = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        const homeX = p.ox + Math.cos(time * 0.5 + p.phase) * 7
        const homeY = p.oy + Math.sin(time * 0.45 + p.phase) * 7

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < REPEL * REPEL && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const force = (1 - d / REPEL) * 2.4
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }

        p.vx += (homeX - p.x) * 0.022
        p.vy += (homeY - p.y) * 0.022
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(129,140,248,${0.22 * (1 - dist / LINK)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        const near = md < REPEL
        ctx.fillStyle = near ? 'rgba(180,160,255,1)' : 'rgba(160,172,196,0.6)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, near ? 2.2 : 1.5, 0, Math.PI * 2)
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
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
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
