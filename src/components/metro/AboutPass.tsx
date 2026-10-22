import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Code2, Mail, QrCode, RotateCw } from 'lucide-react'
import { RichText } from '../ui/RichText'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { Magnetic } from '../motion/Magnetic'
import { SITE } from '../../lib/site'
import { useFinePointer, useReducedMotion } from '../../lib/motion'
import './abono.css'

const nb = (s: string) => s.replace(/Full-Stack/g, 'Full‑Stack')
const lc = (v: string) => ({ ['--lc' as string]: v }) as CSSProperties

const MAX_TILT = 7 // degrees
const K = 240 // spring stiffness (1/s²)
const D = 21 // damping (1/s): ratio ≈ 0.68, a small overshoot when it springs back

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <dt className="sign-label text-[11.5px] text-ink-3">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">{children}</dd>
    </div>
  )
}

/** the strip at the top of both faces, with the punched lanyard slot */
function Band({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex items-center justify-between gap-3 bg-l1 px-5 pb-3 pt-[26px] text-paper" aria-hidden="true">
      <span className="abono-slot" />
      {children}
    </div>
  )
}

function Capsule() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-paper px-2.5 py-0.5 font-sign text-[14px] font-bold tracking-[0.06em]">
      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
      EAP
      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
    </span>
  )
}

/** an EMV-like contact chip (material colour: gold in both themes) */
function Chip() {
  return (
    <svg viewBox="0 0 46 36" width="46" height="36" aria-hidden="true" className="block drop-shadow-[0_1px_0_rgb(0_0_0/0.18)]">
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

// The pass itself: a physical object. Pointer effects (tilt, holo sheen, glare)
// only with a fine pointer and motion allowed; rAF runs only while the pointer
// moves or the spring is settling, and the only layout read is the wrapper's
// rect on pointerenter (the wrapper never transforms, so it stays valid).
function Abono() {
  const { t } = useTranslation()
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const flippedRef = useRef(false)
  const wrap = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const sheen = useRef<HTMLSpanElement>(null)
  const glareF = useRef<HTMLSpanElement>(null)
  const glareB = useRef<HTMLSpanElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  const toggle = () => {
    const next = !flippedRef.current
    // never strand focus inside the face that is about to become inert
    const leaving = next ? front.current : back.current
    if (leaving && leaving.contains(document.activeElement)) btn.current?.focus()
    flippedRef.current = next
    setFlipped(next)
  }
  const onFaceClick = (e: ReactMouseEvent) => {
    if ((e.target as Element).closest('a, button')) return
    toggle()
  }

  useEffect(() => {
    if (!fine || reduce) return
    const w = wrap.current
    const tl = tilt.current
    const sh = sheen.current
    const gF = glareF.current
    const gB = glareB.current
    if (!w || !tl || !sh || !gF || !gB) return
    let rect: DOMRect | null = null
    let raf = 0
    let last = 0
    let hover = false
    const tgt = { x: 0.5, y: 0.5 }
    const cur = { x: 0.5, y: 0.5 }
    const vel = { x: 0, y: 0 }
    let gx = 0
    let gy = 0

    const frame = (now: number) => {
      const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60
      last = now
      for (const k of ['x', 'y'] as const) {
        vel[k] += (K * (tgt[k] - cur[k]) - D * vel[k]) * dt
        cur[k] += vel[k] * dt
      }
      const settled = Math.abs(tgt.x - cur.x) < 0.0008 && Math.abs(tgt.y - cur.y) < 0.0008 && Math.abs(vel.x) < 0.004 && Math.abs(vel.y) < 0.004
      if (settled) {
        cur.x = tgt.x
        cur.y = tgt.y
        vel.x = vel.y = 0
      }
      // writes only
      const ry = (cur.x - 0.5) * 2 * MAX_TILT
      const rx = -(cur.y - 0.5) * 2 * MAX_TILT
      tl.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)${hover ? ' translateZ(14px)' : ''}`
      sh.style.transform = `translate3d(${(-cur.x * 66.666).toFixed(2)}%, 0, 0)`
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
      sh.style.transform = ''
    }
  }, [fine, reduce])

  const micro = `${t('about.stamp_sub')} · EAP · L1 · `.repeat(4)
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <div className="mx-auto w-full max-w-[420px] lg:mx-0">
      <h2 className="sr-only">{t('about.pass')}</h2>
      <div ref={wrap} id="abono" className="abono" {...(flipped ? { 'data-flipped': '' } : {})}>
        <div ref={tilt} className="abono-tilt">
          <div className="abono-flip">
            {/* ── front: the photo and the facts ── */}
            <div
              ref={front}
              data-glow
              className="abono-face abono-front card glow-card"
              style={lc('var(--l1)')}
              onClick={onFaceClick}
              inert={flipped}
              aria-hidden={flipped || undefined}
            >
              <Band>
                <span className="sign-label text-[17px] leading-none">{t('about.pass')}</span>
                <Capsule />
              </Band>
              <div className="px-4 pt-4">
                <div className="abono-photo aspect-square w-full">
                  <picture>
                    <source srcSet="/profile.webp" type="image/webp" />
                    <img src="/profile.jpg" alt={t('about.photo')} loading="lazy" decoding="async" width={800} height={1000} />
                  </picture>
                  <Stamp title={t('about.stamp')} sub={t('about.stamp_sub')} />
                </div>
              </div>
              <div className="abono-holo mt-4" aria-hidden="true">
                <span ref={sheen} className="abono-holo-sheen" />
                <span className="abono-holo-text">{micro}</span>
              </div>
              <div className="abono-guilloche relative flex-1 px-5 pb-4 pt-3.5">
                <div className="absolute right-5 top-4 flex items-center gap-1.5">
                  <Contactless />
                  <Chip />
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <div className="col-span-2 pr-[84px]">
                    <dt className="sign-label text-[11.5px] text-ink-3">{t('about.f_holder')}</dt>
                    <dd className="sign-type mt-1 text-[26px] leading-[1] text-ink">{SITE.name}</dd>
                  </div>
                  <Field label={t('about.f_profile')} wide>
                    {nb(t('hero.role'))}
                  </Field>
                  <Field label={t('about.f_degree')} wide>
                    {t('about.degree')}
                  </Field>
                  <Field label={t('about.f_zone')}>{t('about.zone')}</Field>
                  <Field label={t('about.f_langs')}>{t('about.langs')}</Field>
                </dl>
              </div>
              <div className="abono-perf" aria-hidden="true" />
              <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 pb-3.5 pt-2 font-mono text-[11.5px] text-ink-3">
                <span>{t('about.valid_from')}</span>
                <span className="tnum">{t('about.pass_no')}</span>
              </p>
              <span ref={glareF} className="abono-glare" aria-hidden="true" />
            </div>

            {/* ── back: one big QR to LinkedIn ── */}
            <div
              ref={back}
              data-glow
              className="abono-face abono-back card glow-card"
              style={lc('var(--l1)')}
              onClick={onFaceClick}
              inert={!flipped}
              aria-hidden={!flipped || undefined}
            >
              <Band>
                <span className="sign-label inline-flex items-center gap-2 text-[17px] leading-none">
                  <LinkedInIcon className="h-4 w-4" />
                  {t('about.qr_title')}
                </span>
                <Capsule />
              </Band>
              <div className="abono-guilloche flex flex-1 flex-col items-center justify-center gap-5 px-5 py-6 text-center">
                <h3 className="sr-only">{t('about.qr_title')}</h3>
                <div className="abono-qr w-full max-w-[280px] sm:max-w-[320px]">
                  <img src="/abono/qr-linkedin.svg" alt={t('about.qr_alt')} width={320} height={320} loading="lazy" decoding="async" />
                </div>
                <p className="max-w-[30ch] font-mono text-[12.5px] leading-relaxed text-ink-2">{t('about.qr_caption')}</p>
                <a
                  href={SITE.linkedin}
                  {...ext}
                  data-cursor="link"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-[15.5px] font-semibold text-l1 underline decoration-2 underline-offset-4 hover:decoration-[3px]"
                >
                  {t('about.qr_link')}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t('about.new_tab')}</span>
                </a>
              </div>
              <div className="abono-perf" aria-hidden="true" />
              <p className="flex items-center justify-between gap-4 px-5 pb-3.5 pt-2 font-mono text-[11.5px] text-ink-3" aria-hidden="true">
                <span>{t('about.pass')}</span>
                <span className="tnum">{t('about.pass_no')}</span>
              </p>
              <span ref={glareB} className="abono-glare" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Magnetic strength={0.25} max={7}>
          <button
            ref={btn}
            type="button"
            onClick={toggle}
            aria-controls="abono"
            data-cursor="link"
            {...(flipped ? { 'data-flipped': '' } : {})}
            className="abono-flip-btn inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[16px] font-semibold"
          >
            {flipped ? <RotateCw className="h-[18px] w-[18px]" aria-hidden="true" /> : <QrCode className="h-[18px] w-[18px]" aria-hidden="true" />}
            {flipped ? t('about.flip_back') : t('about.flip_qr')}
          </button>
        </Magnetic>
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
    <section id="sobre-mi" className="relative py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] items-start gap-12 px-5 sm:px-6 lg:grid-cols-[420px_1fr] lg:gap-16 lg:px-16 xl:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--bar-h)+32px)]">
          <Abono />
        </div>

        <div className="max-w-[680px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-card px-3 py-1 font-mono text-[12px] font-medium tracking-wide text-eco">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-eco loop-anim" aria-hidden="true" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eco" />
            </span>
            {t('about.status')}
          </p>
          <h3 ref={greet} className="sign-type mt-4 text-[clamp(2.6rem,5vw,4rem)]">
            {t('about.greeting')}{' '}
            <span className={`inline-block ${wave ? 'hand-wave' : ''}`} aria-hidden="true">
              👋
            </span>
          </h3>
          <div className="mt-5 space-y-4 text-[17px] leading-[1.7] text-ink-2">
            <RichText html={t('about.p1')} />
            <RichText html={t('about.p2')} />
            <RichText html={t('about.p3')} />
          </div>
          <p className="mt-6 flex gap-3 border-l-[3px] border-dashed border-cer pl-4 text-[15.5px] italic leading-relaxed text-ink-2">{t('about.grit')}</p>
          <ul className="mt-9 flex flex-wrap gap-x-3 gap-y-4">
            {pills.map((p, i) => (
              <li key={p.href} className={settled ? '' : 'pill-float loop-anim'} style={{ animationDelay: `${i * 0.45}s` }}>
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
                    {p.external !== false && (
                      <>
                        <ArrowUpRight className="pill-arrow -ml-1 h-4 w-4 text-ink-3" aria-hidden="true" />
                        <span className="sr-only">{t('about.new_tab')}</span>
                      </>
                    )}
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
