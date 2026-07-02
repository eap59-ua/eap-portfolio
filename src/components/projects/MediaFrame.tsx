import { useEffect, useRef } from 'react'
import { Film } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MediaFrameProps {
  src?: string
  poster?: string
  captions?: string
  label?: string
  autoplay?: boolean
  className?: string
}

export function MediaFrame({
  src,
  poster,
  captions,
  label = 'Demo en vídeo · próximamente',
  autoplay,
  className,
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const inViewPlay = Boolean(src) && Boolean(autoplay) && !reduce

  useEffect(() => {
    if (!inViewPlay) return
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [inViewPlay])

  if (src) {
    const videoClass = cn(
      'aspect-video w-full rounded-xl border border-line bg-ink-950 object-cover',
      className,
    )
    const track = captions ? (
      <track kind="captions" src={captions} srcLang="es" label="Español" />
    ) : null

    if (inViewPlay) {
      return (
        <video
          ref={videoRef}
          className={videoClass}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Vídeo de demostración del proyecto"
        >
          {track}
        </video>
      )
    }

    return (
      <video
        ref={videoRef}
        className={videoClass}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        aria-label="Vídeo de demostración del proyecto"
      >
        {track}
      </video>
    )
  }

  return (
    <div
      className={cn(
        'relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-line bg-ink-850',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-dark bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-accent-strong/10 to-accent-violet/[0.06]" />
      <div className="relative flex flex-col items-center gap-2.5 text-center">
        <span className="relative flex h-12 w-12 items-center justify-center">
          {/* soft sonar ring so "coming soon" reads as alive, not broken */}
          <span
            aria-hidden="true"
            className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full border border-accent/50 motion-reduce:animate-none"
          />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-ink-900 text-accent">
            <Film className="h-5 w-5" />
          </span>
        </span>
        <span className="font-mono text-xs text-slate-400">{label}</span>
      </div>
    </div>
  )
}
