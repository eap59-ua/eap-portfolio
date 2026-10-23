import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX, X, ZoomIn } from 'lucide-react'
import type { DemoMedia } from '../../data/media'
import { useMotionPaused, useReducedMotion } from '../../lib/motion'
import './player.css'

// Case-study player: poster first, the visitor starts it. The board keeps its little muted loops (DemoVideo).

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }
type FsBox = HTMLDivElement & { webkitRequestFullscreen?: () => void }
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void }

interface Props {
  media: DemoMedia
  /** project title */
  title: string
  /** what this clip shows, when the data has a caption for it */
  label?: string
  /** the project's line colour, e.g. var(--eco) */
  accent: string
  /** light line colour (EasyCab yellow): dark icons on it */
  dark?: boolean
}

export function VideoPlayer({ media, title, label, accent, dark }: Props) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const enlargeRef = useRef<HTMLButtonElement>(null)
  const inlineVideo = useRef<HTMLVideoElement>(null)
  const viewerVideo = useRef<HTMLVideoElement>(null)
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [startAt, setStartAt] = useState(0)
  const name = `${title} — ${label ?? 'demo'}`

  const openViewer = () => {
    const v = inlineVideo.current
    if (v) {
      setStartAt(v.ended ? 0 : v.currentTime)
      v.pause()
    }
    setOpen(true)
  }
  useEffect(() => {
    const d = dialogRef.current
    if (open && d && !d.open) d.showModal()
  }, [open])
  const onClose = () => {
    // hand the position back to the inline player, paused
    const from = viewerVideo.current
    const to = inlineVideo.current
    if (from && to && from.currentTime > 0) to.currentTime = from.currentTime
    setOpen(false)
    enlargeRef.current?.focus({ preventScroll: true })
  }
  const onBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) dialogRef.current?.close()
  }

  const style = { ['--vp-accent' as string]: accent, ['--vp-on-accent' as string]: dark ? '#16181d' : 'var(--on-line)' } as CSSProperties
  const hd = media.hd ? { ...media, src: media.hd.src } : media

  return (
    <>
      <Core media={media} name={name} style={style} videoRef={inlineVideo} enlargeRef={enlargeRef} onEnlarge={openViewer} />
      {/* top layer: Escape, inert page and focus return come with showModal */}
      <dialog ref={dialogRef} className="vp-viewer" aria-labelledby={titleId} onClose={onClose} onClick={onBackdrop} data-lenis-prevent style={style}>
        {open && (
          <div className="vp-viewer-inner">
            <div className="vp-viewer-head">
              <p id={titleId} className="vp-viewer-title">
                <span className="vp-viewer-name">{title}</span>
                {label && <span className="vp-viewer-label"> · {label}</span>}
                <span className="vp-viewer-dur tnum"> ({fmt(media.dur)})</span>
              </p>
              <button type="button" className="vp-close" aria-label={t('player.close')} onClick={() => dialogRef.current?.close()}>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="vp-viewer-body" onClick={onBackdrop}>
              <Core media={hd} name={name} style={style} videoRef={viewerVideo} viewer startAt={startAt} />
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

interface CoreProps {
  media: DemoMedia
  name: string
  style: CSSProperties
  videoRef: RefObject<HTMLVideoElement | null>
  viewer?: boolean
  startAt?: number
  enlargeRef?: RefObject<HTMLButtonElement | null>
  onEnlarge?: () => void
}

function Core({ media, name, style, videoRef, viewer, startAt = 0, enlargeRef, onEnlarge }: CoreProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const boxRef = useRef<FsBox>(null)
  const keysId = useId()
  const reduce = useReducedMotion()
  const motionPaused = useMotionPaused()
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [cur, setCur] = useState(startAt)
  const [dur, setDur] = useState(media.dur)
  const [muted, setMuted] = useState(!media.audio)
  const [fs, setFs] = useState(false)
  const [tip, setTip] = useState(false)

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.ended) v.currentTime = 0
    v.play().catch(() => {})
  }, [videoRef])
  const toggle = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused || v.ended) play()
    else v.pause()
  }, [play, videoRef])
  const seek = (to: number) => {
    const v = videoRef.current
    const x = Math.min(Math.max(to, 0), dur)
    if (v) v.currentTime = x
    setCur(x)
    if (x < dur) setEnded(false)
  }
  const seekBy = (d: number) => seek((videoRef.current?.currentTime ?? cur) + d)
  const flashTip = () => {
    setTip(true)
    window.setTimeout(() => setTip(false), 2200)
  }
  const mute = () => {
    if (!media.audio) return flashTip()
    const v = videoRef.current
    if (v) v.muted = !v.muted
    setMuted((m) => !m)
  }
  const fullscreen = () => {
    const d = document as FsDoc
    const box = boxRef.current
    const v = videoRef.current as FsVideo | null
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      if (d.exitFullscreen) void d.exitFullscreen().catch(() => {})
      else d.webkitExitFullscreen?.()
      return
    }
    if (box && document.fullscreenEnabled && box.requestFullscreen) void box.requestFullscreen().catch(() => {})
    else if (box?.webkitRequestFullscreen) box.webkitRequestFullscreen()
    // iPhone Safari: only the video element itself can go full screen (native controls there)
    else v?.webkitEnterFullscreen?.()
  }

  // the pause-all switch (WCAG 2.2.2) stops this video too
  useEffect(() => {
    if (motionPaused) videoRef.current?.pause()
  }, [motionPaused, videoRef])

  // viewer: pick up where the inline player was; it starts on its own only if motion is welcome
  useEffect(() => {
    if (!viewer) return
    const v = videoRef.current
    if (!v) return
    if (startAt > 0) v.currentTime = startAt
    // read the query directly: useReducedMotion() is still false on this first (hydration-safe) render
    const still = reduce || motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!still) play()
    // once, on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const d = document as FsDoc
    const on = () => setFs(!!boxRef.current && (d.fullscreenElement ?? d.webkitFullscreenElement) === boxRef.current)
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => {
      document.removeEventListener('fullscreenchange', on)
      document.removeEventListener('webkitfullscreenchange', on)
    }
  }, [])

  // smooth progress while playing (timeupdate only fires ~4×/s)
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      const v = videoRef.current
      if (v) setCur(v.currentTime)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, videoRef])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const el = e.target as HTMLElement
    const onButton = el.tagName === 'BUTTON'
    const onSeek = el.classList.contains('vp-seek')
    const k = e.key
    if ((k === ' ' && !onButton) || k === 'k' || k === 'K') toggle()
    else if (k === 'ArrowLeft' || (onSeek && k === 'ArrowDown')) seekBy(-5)
    else if (k === 'ArrowRight' || (onSeek && k === 'ArrowUp')) seekBy(5)
    else if (k === 'f' || k === 'F') fullscreen()
    else if (k === 'm' || k === 'M') mute()
    else return
    e.preventDefault()
  }

  const onStage = () => {
    toggle()
    boxRef.current?.focus({ preventScroll: true }) // so the shortcuts work after a click
  }

  const portrait = !!media.portrait
  const playLabel = playing ? t('player.pause') : ended ? t('player.replay') : t('player.play')
  const PlayIcon = playing ? Pause : ended ? RotateCcw : Play
  const pct = dur ? (cur / dur) * 100 : 0
  const big = !playing && (!started || ended)

  const stage = (
    <div className="vp-stage" onClick={onStage}>
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        width={media.w}
        height={media.h}
        preload={viewer ? 'metadata' : 'none'}
        playsInline
        muted={muted}
        aria-label={name}
        onPlay={() => {
          setPlaying(true)
          setStarted(true)
          setEnded(false)
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setEnded(true)
        }}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)}
      >
        {media.captions && <track key={lang} kind="descriptions" srcLang={lang} src={`${media.captions}.${lang}.vtt`} />}
      </video>
      <span className="vp-big" data-show={big || undefined} aria-hidden="true">
        {ended ? <RotateCcw className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" fill="currentColor" />}
      </span>
    </div>
  )

  const bar = (
    <div className="vp-barwrap">
      <div className="vp-bar">
        <Btn className="vp-play" label={playLabel} onClick={toggle}>
          <PlayIcon className="h-5 w-5" fill={playing || ended ? 'none' : 'currentColor'} aria-hidden="true" />
        </Btn>
        <span className="vp-time tnum">
          {fmt(cur)} <span className="vp-time-sep">/</span> {fmt(dur)}
        </span>
        <input
          className="vp-seek"
          type="range"
          min={0}
          max={dur}
          step="any"
          value={Math.min(cur, dur)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label={t('player.seek')}
          aria-valuetext={t('player.timeOf', { cur: fmt(cur), dur: fmt(dur) })}
          style={{ ['--p' as string]: `${pct}%` } as CSSProperties}
        />
        <span className="vp-tools">
          {media.audio ? (
            <Btn label={t('player.mute')} pressed={muted} onClick={mute}>
              {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
            </Btn>
          ) : (
            // honest state: no sound track to toggle (ffprobe), so no fake switch
            <Btn label={t('player.noAudio')} disabled showTip={tip} onClick={flashTip}>
              <VolumeX className="h-5 w-5" aria-hidden="true" />
            </Btn>
          )}
          {onEnlarge && (
            <Btn btnRef={enlargeRef} className="vp-enlarge" label={t('player.enlarge')} text={t('player.enlarge')} onClick={onEnlarge}>
              <ZoomIn className="h-5 w-5" aria-hidden="true" />
            </Btn>
          )}
          <Btn className="vp-fs" label={t('player.fullscreen')} text={t('player.fullscreen')} pressed={fs} onClick={fullscreen}>
            {fs ? <Minimize className="h-5 w-5" aria-hidden="true" /> : <Maximize className="h-5 w-5" aria-hidden="true" />}
          </Btn>
        </span>
      </div>
    </div>
  )

  return (
    <div
      ref={boxRef}
      className="vp"
      data-variant={portrait ? 'phone' : 'wide'}
      data-viewer={viewer || undefined}
      role="group"
      aria-label={t('player.region', { title: name })}
      aria-describedby={keysId}
      tabIndex={-1}
      onKeyDown={onKey}
      style={{ ...style, ['--ar' as string]: `${media.w} / ${media.h}`, ['--arn' as string]: media.w / media.h } as CSSProperties}
    >
      {/* phone: the bar is the handset's chin, inside the same body */}
      {portrait ? (
        <div className="vp-device">
          {stage}
          {bar}
        </div>
      ) : (
        <>
          {stage}
          {bar}
        </>
      )}
      <p id={keysId} className="sr-only">
        {t('player.keys')}
      </p>
    </div>
  )
}

/** keep a tooltip centred over its button, but 8 px inside the player's frame */
function placeTip(btn: HTMLElement) {
  const tip = btn.querySelector<HTMLElement>('.vp-tip')
  const frame = btn.closest<HTMLElement>('.vp-device, .vp')
  if (!tip || !frame) return
  tip.style.setProperty('--dx', '0px')
  const r = tip.getBoundingClientRect()
  const f = frame.getBoundingClientRect()
  let dx = 0
  if (r.left < f.left + 8) dx = f.left + 8 - r.left
  else if (r.right > f.right - 8) dx = f.right - 8 - r.right
  tip.style.setProperty('--dx', `${Math.round(dx)}px`)
}

function Btn({
  label,
  text,
  pressed,
  disabled,
  showTip,
  className = '',
  btnRef,
  onClick,
  children,
}: {
  label: string
  text?: string
  pressed?: boolean
  disabled?: boolean
  showTip?: boolean
  className?: string
  btnRef?: RefObject<HTMLButtonElement | null>
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      className={`vp-btn ${className}`}
      // aria-disabled, not disabled: it stays focusable and tappable, so it can explain itself
      aria-disabled={disabled || undefined}
      aria-pressed={pressed}
      aria-label={label}
      data-show={showTip || undefined}
      data-text={text ? '' : undefined}
      onPointerEnter={(e) => placeTip(e.currentTarget)}
      onFocus={(e) => placeTip(e.currentTarget)}
      onClick={(e) => {
        placeTip(e.currentTarget)
        onClick()
      }}
    >
      {children}
      {text && (
        <span className="vp-btn-text" aria-hidden="true">
          {text}
        </span>
      )}
      <span className="vp-tip" aria-hidden="true">
        {label}
      </span>
    </button>
  )
}
