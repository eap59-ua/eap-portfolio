import { useRef } from 'react'
import { Film, Play } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MediaFrameProps {
  src?: string
  poster?: string
  label?: string
  hoverPlay?: boolean
  className?: string
}

export function MediaFrame({
  src,
  poster,
  label = 'Demo en vídeo · próximamente',
  hoverPlay,
  className,
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  if (src && hoverPlay) {
    return (
      <div
        className="group relative"
        onMouseEnter={() => {
          videoRef.current?.play().catch(() => {})
        }}
        onMouseLeave={() => {
          const v = videoRef.current
          if (v) {
            v.pause()
            v.currentTime = 0
          }
        }}
      >
        <video
          ref={videoRef}
          className={cn('aspect-video w-full rounded-xl border border-line bg-ink-950 object-cover', className)}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="flex items-center gap-2 rounded-full border border-line-strong bg-ink-900/70 px-4 py-2 font-mono text-xs font-medium text-white backdrop-blur-sm">
            <Play className="h-3.5 w-3.5 fill-accent text-accent" />
            demo
          </span>
        </div>
      </div>
    )
  }

  if (src) {
    return (
      <video
        ref={videoRef}
        className={cn('aspect-video w-full rounded-xl border border-line bg-ink-950 object-cover', className)}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
      />
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-ink-900 text-accent">
          <Film className="h-5 w-5" />
        </span>
        <span className="font-mono text-xs text-slate-400">{label}</span>
      </div>
    </div>
  )
}
