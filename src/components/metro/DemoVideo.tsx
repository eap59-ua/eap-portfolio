import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { MEDIA } from '../../data/media'
import { useMotionPaused, useReducedMotion } from '../../lib/motion'

/** plays muted while on screen; never with reduced motion or the pause button (WCAG 2.2.2): poster + controls instead.
 *  fit: no fixed width — the parent sizes the frame (desktop project board, see board.css); it gets the clip's ratio as --mw/--mh */
export function DemoVideo({ slug, title, fit }: { slug: string; title: string; fit?: boolean }) {
  const m = MEDIA[slug]
  const lang = useTranslation().i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  const still = reduce || paused
  // poster + description track only once the video is near (hidden accordion rows never are)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '300px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (still) {
      v.pause()
      return
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [still])
  if (!m) return null
  const video = (
    <video
      ref={ref}
      className={m.portrait ? 'h-full w-full rounded-[22px] object-cover' : 'h-auto w-full rounded-xl'}
      src={m.src}
      poster={near ? m.poster : undefined}
      muted
      loop
      playsInline
      preload="none"
      controls={still}
      aria-label={title}
      width={m.w}
      height={m.h}
    >
      {near && m.captions && <track key={lang} kind="descriptions" srcLang={lang} src={`${m.captions}.${lang}.vtt`} />}
    </video>
  )
  if (fit)
    return (
      <div
        className={m.portrait ? 'demo-fit demo-fit--portrait aspect-[230/480] rounded-[30px] bg-ink p-[9px] shadow-[0_18px_40px_-24px_rgba(22,24,29,.6)]' : 'demo-fit rounded-2xl bg-ink p-2'}
        style={{ ['--mw' as string]: m.w, ['--mh' as string]: m.h } as CSSProperties}
      >
        {video}
      </div>
    )
  return m.portrait ? (
    <div className="mx-auto aspect-[230/480] w-[min(160px,44vw)] rounded-[30px] bg-ink p-[9px] shadow-[0_18px_40px_-24px_rgba(22,24,29,.6)] md:w-[210px]">{video}</div>
  ) : (
    <div className="rounded-2xl bg-ink p-2 md:w-[340px]">{video}</div>
  )
}
