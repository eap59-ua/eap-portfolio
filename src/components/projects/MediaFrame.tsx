import { Film } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MediaFrameProps {
  src?: string
  poster?: string
  label?: string
  className?: string
}

export function MediaFrame({ src, poster, label = 'Demo en vídeo · próximamente', className }: MediaFrameProps) {
  if (src) {
    return (
      <video
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
