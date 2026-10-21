import { useEffect, useRef } from 'react'
import { MEDIA } from '../../data/media'
import { useReducedMotion } from '../../lib/motion'

/** plays muted while on screen; never with reduced motion (poster + controls instead) */
export function DemoVideo({ slug, title }: { slug: string; title: string }) {
  const m = MEDIA[slug]
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])
  if (!m) return null
  const video = (
    <video
      ref={ref}
      className={m.portrait ? 'h-full w-full rounded-[22px] object-cover' : 'aspect-video w-full rounded-xl object-cover'}
      src={m.src}
      poster={m.poster}
      muted
      loop
      playsInline
      preload="none"
      controls={reduce}
      aria-label={title}
      width={m.portrait ? 360 : 1280}
      height={m.portrait ? 754 : 720}
    >
      {m.captions && <track kind="descriptions" srcLang="es" src={m.captions} default />}
    </video>
  )
  return m.portrait ? (
    <div className="mx-auto aspect-[230/480] w-[min(190px,50vw)] rounded-[30px] bg-ink p-[9px] shadow-[0_18px_40px_-24px_rgba(22,24,29,.6)] md:w-[210px]">{video}</div>
  ) : (
    <div className="rounded-2xl bg-ink p-2 md:w-[340px]">{video}</div>
  )
}

/** compact: inside the mobile accordion, whose row already shows badge, title and context */
