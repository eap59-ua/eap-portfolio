import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Segments } from '../ui/Segments'
import { ArrowUpRight, Code2, Mail, RotateCw } from 'lucide-react'
import { RichText } from '../ui/RichText'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { Magnetic } from '../motion/Magnetic'
import { SITE } from '../../lib/site'
import { useFinePointer, useReducedMotion } from '../../lib/motion'
import './abono.css'

const nb = (s: string) => s.replace(/Full-Stack/g, 'Full‑Stack')
const lc = (v: string) => ({ ['--lc' as string]: v }) as CSSProperties
const linkedinShort = SITE.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

const MAX_TILT = 8 // degrees
const K = 240 // spring stiffness (1/s²)
const D = 21 // damping (1/s): ratio ≈ 0.68, a small overshoot when it springs back
const TURN_MS = 700
// the photo box: 386px from sm up (420 pass − 2×16 padding − 2 border); below,
// the pass is min(330px, 100vw − 40px) wide, so the photo is that minus 34px
const PHOTO_SIZES = '(min-width: 640px) 386px, min(296px, calc(100vw - 74px))'

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : 'min-w-0'}>
      <dt className="sign-label text-[11px] leading-[13px] text-ink-3">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold leading-[1.25] text-ink">{children}</dd>
    </div>
  )
}

/** the strip at the top of both faces, with the punched lanyard slot; the
 *  right end is left free for the flip button that sits above both faces */
function Band({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-[64px] shrink-0 items-center gap-3 bg-l1 pl-5 pr-[66px] pt-[16px] text-paper" aria-hidden="true">
      <span className="abono-slot" />
      {children}
    </div>
  )
}

function Capsule() {
  return (
    <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-paper px-2.5 py-0.5 font-sign text-[14px] font-bold tracking-[0.06em]">
      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
      EAP
      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
    </span>
  )
}

/** an EMV-like contact chip (material colour: gold in both themes) */
function Chip() {
  return (
    <svg viewBox="0 0 46 36" width="44" height="34" aria-hidden="true" className="block drop-shadow-[0_1px_0_rgb(0_0_0/0.18)]">
      <defs>
        <linearGradient id="abono-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d88f" />
          <stop offset="0.45" stopColor="#d5b25e" />
          <stop offset="0.55" stopColor="#f6e2a6" />
          <stop offset="1" stopColor="#b48c3a" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="45" height="35" rx="7" fill="url(#abono-chip)" stroke="#9a7630" strokeOpacity="0.6" />
      <g fill="none" stroke="#8a6a28" strokeOpacity="0.75" strokeWidth="1.1">
        <path d="M0.5 12h12M0.5 24h12M33.5 12h12M33.5 24h12M23 0.5v8M23 27.5v8" />
        <rect x="12.5" y="8.5" width="21" height="19" rx="4" />
      </g>
    </svg>
  )
}

function Contactless() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="block text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7.5 8.5a5 5 0 0 1 0 7M11 6a9 9 0 0 1 0 12M14.5 3.5a13 13 0 0 1 0 17" />
    </svg>
  )
}

function Stamp({ title, sub }: { title: string; sub: string }) {
  return (
    <svg viewBox="0 0 120 120" className="abono-stamp" aria-hidden="true">
      <defs>
        <path id="abono-stamp-arc" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1 -82 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="12" letterSpacing="1.5">
        <textPath href="#abono-stamp-arc" startOffset="0" textLength="254" lengthAdjust="spacing">
          {`${sub.toUpperCase()} · L1 · EAP · `}
        </textPath>
      </text>
      <rect x="10" y="46" width="100" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="60" y="67.5" textAnchor="middle" fill="currentColor" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="21" letterSpacing="1.5" textLength={title.length > 8 ? 86 : undefined} lengthAdjust="spacingAndGlyphs">
        {title.toUpperCase()}
      </text>
    </svg>
  )
}

// The pass itself: a physical object. Pointer effects (tilt, moving shadow,
// holo sheen + hue, specular light) only with a fine pointer and motion
// allowed; rAF runs only while the pointer moves or the spring is settling,
// and the only layout read is the wrapper's rect on pointerenter (the wrapper
// never transforms, so it stays valid until a scroll/resize).
function Abono() {
  const { t } = useTranslation()
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const [turning, setTurning] = useState(false)
  const flippedRef = useRef(false)
  const wrap = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const shadow = useRef<HTMLSpanElement>(null)
  const sheen = useRef<HTMLSpanElement>(null)
  const glareF = useRef<HTMLSpanElement>(null)
  const glareB = useRef<HTMLSpanElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const turnTimer = useRef(0)

  const toggle = () => {
    const next = !flippedRef.current
    // the button lives outside both faces, so focus never lands in an inert face;
    // still, if a click came from inside the leaving face, park focus on the button
    const face = wrap.current?.querySelector(next ? '.abono-front' : '.abono-back')
    if (face?.contains(document.activeElement)) btn.current?.focus()
    flippedRef.current = next
    setFlipped(next)
    if (!reduce) {
      setTurning(true)
      window.clearTimeout(turnTimer.current)
      turnTimer.current = window.setTimeout(() => setTurning(false), TURN_MS)
    }
  }
  const onFaceClick = (e: ReactMouseEvent) => {
    if ((e.target as Element).closest('a, button')) return
    toggle()
  }
  useEffect(() => () => window.clearTimeout(turnTimer.current), [])

  useEffect(() => {
    if (!fine || reduce) return
    const w = wrap.current
    const tl = tilt.current
    const sd = shadow.current
    const sh = sheen.current
    const gF = glareF.current
    const gB = glareB.current
    if (!w || !tl || !sd || !sh || !gF || !gB) return
    let rect: DOMRect | null = null
    let raf = 0
    let last = 0
    let hover = false
    const tgt = { x: 0.5, y: 0.5 }
    const cur = { x: 0.5, y: 0.5 }
    const vel = { x: 0, y: 0 }
    let gx = 0
    let gy = 0
    // the lift (0 at rest, 1 under the pointer) rides the same spring, so the
    // card rises and settles instead of popping on enter/leave
    let lift = 0
    let liftV = 0

    const frame = (now: number) => {
      const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60
      last = now
      for (const k of ['x', 'y'] as const) {
        vel[k] += (K * (tgt[k] - cur[k]) - D * vel[k]) * dt
        cur[k] += vel[k] * dt
      }
      const liftT = hover ? 1 : 0
      liftV += (K * (liftT - lift) - D * liftV) * dt
      lift += liftV * dt
      const settled =
        Math.abs(tgt.x - cur.x) < 0.0008 &&
        Math.abs(tgt.y - cur.y) < 0.0008 &&
        Math.abs(vel.x) < 0.004 &&
        Math.abs(vel.y) < 0.004 &&
        Math.abs(liftT - lift) < 0.002 &&
        Math.abs(liftV) < 0.01
      if (settled) {
        cur.x = tgt.x
        cur.y = tgt.y
        vel.x = vel.y = 0
        lift = liftT
        liftV = 0
      }
      // writes only
      const ry = (cur.x - 0.5) * 2 * MAX_TILT
      const rx = -(cur.y - 0.5) * 2 * MAX_TILT
      tl.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(${(14 * Math.max(0, lift)).toFixed(2)}px)`
      // the shadow falls away from the raised edge: opposite to the tilt
      sd.style.transform = `translate3d(${(-ry * 2.2).toFixed(1)}px, ${(rx * 2.2).toFixed(1)}px, 0) scale(${(1 + 0.03 * Math.max(0, lift)).toFixed(4)})`
      // the foil slides against the pointer and shifts hue with the angle
      sh.style.transform = `translate3d(${(-cur.x * 66.666).toFixed(2)}%, 0, 0)`
      sh.style.filter = `hue-rotate(${((Math.abs(rx) + Math.abs(ry)) * 2.5).toFixed(0)}deg)`
      if (rect) {
        gF.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`
        // the back face is mirrored inside the flip
        gB.style.transform = `translate3d(${(rect.width - gx).toFixed(1)}px, ${gy.toFixed(1)}px, 0)`
      }
      if (settled) {
        raf = 0
        last = 0
        if (!hover) {
          tl.style.transform = ''
          tl.style.willChange = ''
          sd.style.transform = ''
          sh.style.filter = ''
        }
      } else raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const point = (e: PointerEvent) => {
      if (!rect) rect = w.getBoundingClientRect() // once per hover (or after a scroll)
      gx = e.clientX - rect.left
      gy = e.clientY - rect.top
      tgt.x = Math.min(1, Math.max(0, gx / rect.width))
      tgt.y = Math.min(1, Math.max(0, gy / rect.height))
    }
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      hover = true
      rect = w.getBoundingClientRect()
      tl.style.willChange = 'transform'
      w.dataset.hover = ''
      point(e)
      kick()
    }
    const move = (e: PointerEvent) => {
      if (!hover) return
      point(e)
      kick()
    }
    const leave = () => {
      if (!hover) return
      hover = false
      tgt.x = 0.5
      tgt.y = 0.5
      delete w.dataset.hover
      kick()
    }
    const invalidate = () => {
      rect = null
    }
    w.addEventListener('pointerenter', enter)
    w.addEventListener('pointermove', move)
    w.addEventListener('pointerleave', leave)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)
    return () => {
      w.removeEventListener('pointerenter', enter)
      w.removeEventListener('pointermove', move)
      w.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
      cancelAnimationFrame(raf)
      delete w.dataset.hover
      tl.style.transform = ''
      tl.style.willChange = ''
      sd.style.transform = ''
      sh.style.transform = ''
      sh.style.filter = ''
    }
  }, [fine, reduce])

  const micro = `${t('about.stamp_sub')} · EAP · L1 · `.repeat(4)
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <div
      ref={wrap}
      id="abono"
      className="abono mx-auto w-full max-w-[330px] sm:max-w-[420px] lg:mx-0"
      {...(flipped ? { 'data-flipped': '' } : {})}
      {...(turning ? { 'data-turning': '' } : {})}
    >
      <span ref={shadow} className="abono-drop" aria-hidden="true" />
      <div ref={tilt} className="abono-tilt">
        <div className="abono-flip">
          {/* ── front: the photo and the facts ── */}
          <div
            data-glow
            className="abono-face abono-front card glow-card"
            style={lc('var(--l1)')}
            onClick={onFaceClick}
            inert={flipped}
            aria-hidden={flipped || undefined}
          >
            <Band>
              <span className="sign-label truncate text-[16px] leading-none">{t('about.pass')}</span>
              <Capsule />
            </Band>
            <div className="relative px-4 pt-4">
              {/* 4:5, the same ratio as the exported crop (full width of the
                  original, headroom to the waist, crossed arms whole) */}
              <div className="abono-photo aspect-[4/5] w-full">
                <picture>
                  <source srcSet="/abono/foto-800.webp 800w, /abono/foto-1200.webp 1200w" sizes={PHOTO_SIZES} type="image/webp" />
                  <img src="/abono/foto-800.jpg" alt={t('about.photo')} loading="lazy" decoding="async" width={800} height={1000} />
                </picture>
              </div>
              <Stamp title={t('about.stamp')} sub={t('about.stamp_sub')} />
            </div>
            <div className="abono-holo mt-2.5" aria-hidden="true">
              <span ref={sheen} className="abono-holo-sheen" />
              <span className="abono-holo-text">{micro}</span>
            </div>
            <div className="abono-guilloche relative flex-1 px-5 pb-2 pt-2">
              <div className="absolute right-5 top-3 flex items-center gap-1.5">
                <Contactless />
                <Chip />
              </div>
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5">
                <div className="col-span-2 pr-[80px]">
                  <dt className="sign-label text-[11px] leading-[13px] text-ink-3">{t('about.f_holder')}</dt>
                  <dd className="sign-type mt-1 text-[25px] leading-[1] text-ink">{SITE.name}</dd>
                </div>
                <Field label={t('about.f_profile')} wide>
                  {nb(t('hero.role'))}
                </Field>
                <Field label={t('about.f_degree')} wide>
                  {t('about.degree')}
                </Field>
                <Field label={t('about.f_zone')}>{t('about.zone')}</Field>
                <Field label={t('about.f_langs')}>{t('about.langs').replace(/ (B2|C1|C2)\b/g, ' $1')}</Field>
              </dl>
            </div>
            <div className="abono-perf" aria-hidden="true" />
            <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-5 pb-2 pt-0.5 font-mono text-[11px] text-ink-3">
              <span>{t('about.valid_from')}</span>
              <span className="tnum ml-auto">{t('about.pass_no')}</span>
            </p>
            <span ref={glareF} className="abono-glare" aria-hidden="true" />
          </div>

          {/* ── back: magnetic stripe + one big QR to LinkedIn ── */}
          <div
            data-glow
            className="abono-face abono-back card glow-card"
            style={lc('var(--l1)')}
            onClick={onFaceClick}
            inert={!flipped}
            aria-hidden={!flipped || undefined}
          >
            <Band>
              <span className="sign-label inline-flex min-w-0 items-center gap-2 text-[16px] leading-none">
                <LinkedInIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t('about.qr_title')}</span>
              </span>
            </Band>
            <div className="abono-stripe" aria-hidden="true" />
            <div className="abono-guilloche flex flex-1 flex-col items-center justify-center px-5 pb-3 pt-5 text-center">
              <h3 className="sr-only">{t('about.qr_title')}</h3>
              <div className="abono-qr w-full max-w-[280px] sm:max-w-[320px]">
                <img src="/abono/qr-linkedin.svg" alt={t('about.qr_alt')} width={290} height={290} loading="lazy" decoding="async" />
              </div>
              <p className="mt-3.5 text-[14px] font-semibold leading-snug text-ink-2">{t('about.qr_caption')}</p>
              <p className="mt-1.5 font-mono text-[12px] text-ink-3">{linkedinShort}</p>
              <a
                href={SITE.linkedin}
                {...ext}
                data-cursor="link"
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-[15px] font-semibold text-l1 underline decoration-2 underline-offset-4 hover:decoration-[3px]"
              >
                {t('about.qr_link')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{t('about.new_tab')}</span>
              </a>
            </div>
            <div className="abono-perf" aria-hidden="true" />
            <p className="flex items-center justify-between gap-4 px-5 pb-2 pt-0.5 font-mono text-[11px] text-ink-3" aria-hidden="true">
              <span>{t('about.pass')}</span>
              <span className="tnum">{t('about.pass_no')}</span>
            </p>
            <span ref={glareB} className="abono-glare" aria-hidden="true" />
          </div>
        </div>

        {/* the flip control: one real button above both faces, so it is never
            inert and focus stays on it; its visible tag is part of its name */}
        <button
          ref={btn}
          type="button"
          onClick={toggle}
          aria-controls="abono"
          data-cursor="link"
          className="abono-turn"
        >
          <span className="abono-turn-ring">
            <RotateCw className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={2.4} />
          </span>
          <span className="abono-turn-tag">
            {flipped ? t('about.flip_back') : t('about.flip_qr')}
            {!flipped && <span className="sr-only">{t('about.flip_qr_sr')}</span>}
          </span>
        </button>
      </div>
    </div>
  )
}

// "Sobre mí" as a travel pass: the photo and the facts a recruiter scans,
// the story told next to it in plain text (the metaphor never hides content).
export function AboutPass() {
  const { t } = useTranslation()
  const greet = useRef<HTMLHeadingElement>(null)
  const [wave, setWave] = useState(false)
  const [settled, setSettled] = useState(false) // pills stop floating after the first hover

  useEffect(() => {
    const el = greet.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setWave(true)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const ico = 'h-5 w-5'
  const pills: { href: string; label: string; icon: ReactNode; external?: boolean }[] = [
    { href: SITE.linkedin, label: 'LinkedIn', icon: <LinkedInIcon className={ico} /> },
    { href: SITE.github, label: 'GitHub', icon: <GitHubIcon className={ico} /> },
    { href: `mailto:${SITE.email}`, label: 'Email', icon: <Mail className={ico} aria-hidden="true" />, external: false },
    { href: SITE.repo, label: t('about.source'), icon: <Code2 className={ico} aria-hidden="true" /> },
  ]

  return (
    <section id="sobre-mi" className="relative scroll-mt-3 py-20 lg:py-28">
      <h2 className="sr-only">{t('about.pass')}</h2>
      {/* mobile: greeting → pass → story; desktop: pass (sticky) | greeting + story */}
      <div className="mx-auto grid max-w-[1440px] items-start gap-y-10 px-5 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-16 xl:gap-x-20">
        <div className="max-w-[680px] lg:col-start-2 lg:row-start-1">
          <p className="inline-flex items-center gap-2 rounded-xl border border-rule bg-paper-card px-3 py-1 font-mono text-[12px] font-medium tracking-wide text-eco sm:rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-eco loop-anim" aria-hidden="true" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eco" />
            </span>
            <span>
              <Segments text={t('about.status')} />
            </span>
          </p>
          <h3 ref={greet} className="sign-type mt-4 text-[clamp(2.6rem,5vw,4rem)]">
            {t('about.greeting')}{' '}
            <span className={`inline-block ${wave ? 'hand-wave' : ''}`} aria-hidden="true">
              👋
            </span>
          </h3>
        </div>

        <div className="self-start lg:sticky lg:top-[calc(var(--bar-h)+28px)] lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <Abono />
        </div>

        <div className="max-w-[680px] lg:col-start-2 lg:row-start-2 lg:mt-5">
          <div className="space-y-4 text-[17px] leading-[1.7] text-ink-2">
            <RichText html={t('about.p1')} />
            <RichText html={t('about.p2')} />
            <RichText html={t('about.p3')} />
          </div>
          <p className="mt-6 flex gap-3 border-l-[3px] border-dashed border-cer pl-4 text-[15.5px] italic leading-relaxed text-ink-2">{t('about.grit')}</p>
          <ul className={`mt-9 flex flex-wrap gap-x-3 gap-y-4 ${settled ? '' : 'pill-float-sync loop-anim'}`}>
            {pills.map((p) => (
              <li key={p.href}>
                <Magnetic strength={0.22} max={6}>
                  <a
                    href={p.href}
                    {...(p.external === false ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    onPointerEnter={() => setSettled(true)}
                    data-cursor="link"
                    data-glow
                    style={lc('var(--l1)')}
                    className="card glow-card pill-social inline-flex h-14 items-center gap-2.5 pl-2 pr-4 text-[16px] font-semibold text-ink"
                  >
                    <span className="pill-ico grid h-10 w-10 place-items-center rounded-full">{p.icon}</span>
                    {p.label}
                    <ArrowUpRight className="pill-arrow -ml-1 h-4 w-4 text-ink-3" aria-hidden="true" />
                    {p.external !== false && <span className="sr-only">{t('about.new_tab')}</span>}
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
