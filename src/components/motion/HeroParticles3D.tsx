import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

const PALETTE = ['#818cf8', '#a78bfa', '#f0abfc', '#22d3ee', '#34d399'].map((c) => new THREE.Color(c))

function makeSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.3, 'rgba(255,255,255,0.7)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

const SPRITE = makeSprite()

function Field() {
  const { viewport } = useThree()

  const data = useMemo(() => {
    const count = 4600
    const spreadX = (viewport.width || 14) * 0.62
    const spreadY = (viewport.height || 9) * 0.62
    const positions = new Float32Array(count * 3)
    const home = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * spreadX
      const y = (Math.random() * 2 - 1) * spreadY
      const z = (Math.random() * 2 - 1) * 2.4
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      home[i * 3] = x
      home[i * 3 + 1] = y
      home[i * 3 + 2] = z
      const col = PALETTE[(Math.random() * PALETTE.length) | 0]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
      phase[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.13,
      map: SPRITE,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      opacity: 0.95,
    })
    const pts = new THREE.Points(geo, mat)
    return { pts, home, vel, phase, count }
  }, [viewport.width, viewport.height])

  useFrame((state) => {
    const { pts, home, vel, phase, count } = data
    const pos = pts.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    const mx = state.pointer.x * (viewport.width / 2)
    const my = state.pointer.y * (viewport.height / 2)
    const R = 1.7
    const R2 = R * R

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = ix + 1
      const hx = home[ix] + Math.sin(t * 0.5 + phase[i]) * 0.18
      const hy = home[iy] + Math.cos(t * 0.42 + phase[i]) * 0.18

      const dx = pos[ix] - mx
      const dy = pos[iy] - my
      const d2 = dx * dx + dy * dy
      if (d2 < R2 && d2 > 0.0001) {
        const d = Math.sqrt(d2)
        const f = (1 - d / R) * 0.075
        vel[ix] += (dx / d) * f
        vel[iy] += (dy / d) * f
      }

      vel[ix] += (hx - pos[ix]) * 0.02
      vel[iy] += (hy - pos[iy]) * 0.02
      vel[ix] *= 0.9
      vel[iy] *= 0.9
      pos[ix] += vel[ix]
      pos[iy] += vel[iy]
    }

    pts.geometry.attributes.position.needsUpdate = true
    pts.rotation.z = Math.sin(t * 0.08) * 0.06
    pts.rotation.x += (-state.pointer.y * 0.12 - pts.rotation.x) * 0.04
    pts.rotation.y += (state.pointer.x * 0.12 - pts.rotation.y) * 0.04
  })

  useEffect(() => {
    const current = data
    return () => {
      current.pts.geometry.dispose()
      ;(current.pts.material as THREE.Material).dispose()
    }
  }, [data])

  return <primitive object={data.pts} />
}

export function HeroParticles3D() {
  useEffect(() => {
    const ids = [60, 180, 400, 800].map((delay) =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), delay),
    )
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [])

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Field />
      </Canvas>
    </div>
  )
}
