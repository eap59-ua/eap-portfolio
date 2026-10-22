import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight, Check, Copy, Download, X } from 'lucide-react'
import { GitHubMark, GmailMark, LinkedInMark, MapsPin } from '../ui/brandIcons'
import { Magnetic } from '../motion/Magnetic'
import { PROJECT_LINE } from '../../data/lines'
import { SITE } from '../../lib/site'
import './contact.css'

const CV = { es: '/Erardo-Aldana-Pessoa-CV-ES.pdf', en: '/Erardo-Aldana-Pessoa-CV-EN.pdf' }
const l1 = { ['--lc' as string]: 'var(--l1)' } as CSSProperties

// every project line arrives at the terminus at 45°, the L1 straight in the middle
const ARRIVALS = [30, 46, 62, 98, 114, 130]
const LINES = Object.values(PROJECT_LINE)

function ArrivalMap() {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setDrawn(true)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} viewBox="0 0 660 160" className={`terminus-map h-auto w-full ${drawn ? 'is-drawn' : ''}`} aria-hidden="true">
      {ARRIVALS.map((y, i) => {
        const L = LINES[i]
        return (
          <path
            key={y}
            d={`M0 ${y} H${590 - Math.abs(y - 80)} L590 80`}
            pathLength={1}
            fill="none"
            stroke={`var(--${L.line})`}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeDasharray={L.dashed ? '0.03 0.015' : undefined}
            style={{ animationDelay: `${120 + i * 70}ms` }}
          />
        )
      })}
      <path d="M0 80 H590" pathLength={1} fill="none" stroke="var(--l1)" strokeWidth={11} strokeLinecap="round" />
      <circle cx={616} cy={80} r={36} fill="var(--l1)" opacity={0.18} className="terminus-halo" />
      <circle cx={616} cy={80} r={24} fill="var(--l1)" stroke="var(--paper)" strokeWidth={4} />
    </svg>
  )
}

// Google Maps URLs (documented, no key): the search for the first of the two bases
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Gand%C3%ADa%2C%20Valencia'

/** big cards must not swim: a light pull, capped at a few px */
function CardMagnet({ children }: { children: ReactNode }) {
  return (
    <Magnetic strength={0.05} max={4} className="cc-mag">
      {children}
    </Magnetic>
  )
}

/** label · value · note, the same in every card */
function Body({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <span className="cc-body">
      <span className="cc-label">{label}</span>
      <span className="cc-value">{value}</span>
      {note && <span className="cc-note">{note}</span>}
    </span>
  )
}

function Action({ text }: { text: string }) {
  const { t } = useTranslation()
  return (
    <span className="cc-act">
      <span className="cc-act-text">{text}</span>
      <span className="sr-only"> {t('contact.new_tab')}</span>
      <ArrowUpRight className="cc-arrow" aria-hidden="true" />
    </span>
  )
}

/** envelope flap: a V traced in Gmail's four colours */
function Flap() {
  const id = useId()
  return (
    <svg className="cc-flap" viewBox="0 0 300 84" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="300" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4285F4" />
          <stop offset=".25" stopColor="#4285F4" />
          <stop offset=".25" stopColor="#EA4335" />
          <stop offset=".5" stopColor="#EA4335" />
          <stop offset=".5" stopColor="#FBBC05" />
          <stop offset=".75" stopColor="#FBBC05" />
          <stop offset=".75" stopColor="#34A853" />
          <stop offset="1" stopColor="#34A853" />
        </linearGradient>
      </defs>
      <path d="M0 0 L150 38 L300 0 Z" fill="var(--flap)" />
      <path d="M0 0 L150 38 L300 0" fill="none" stroke={`url(#${id})`} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** a stylised map tile: land, streets, a park, the main road and the sea to the east */
function MapTile() {
  return (
    <svg className="cc-tile" viewBox="0 0 300 84" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="300" height="84" fill="var(--m-land)" />
      <rect x="96" y="8" width="62" height="30" rx="5" fill="var(--m-park)" />
      <rect x="18" y="8" width="58" height="26" rx="3" fill="var(--m-park)" opacity=".55" />
      <g stroke="var(--m-road)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M0 46 H236" />
        <path d="M86 0 V84" />
        <path d="M170 0 V84" />
        <path d="M0 18 H86" />
        <path d="M120 46 V84" />
        <path d="M170 66 H226" />
      </g>
      <path d="M232 0 C222 18 242 34 230 50 S238 74 226 84 H300 V0 Z" fill="var(--m-water)" />
      <path d="M-4 80 C70 70 110 54 160 34 S220 8 234 2" fill="none" stroke="var(--m-hwy-edge)" strokeWidth="7" strokeLinecap="round" />
      <path d="M-4 80 C70 70 110 54 160 34 S220 8 234 2" fill="none" stroke="var(--m-hwy)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  )
}

/** the pin drops in once when the card comes into view (static on the server and with reduced motion) */
function MapHead() {
  const ref = useRef<HTMLSpanElement>(null)
  const [drop, setDrop] = useState<'wait' | 'go'>()
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect()
          setDrop('go')
        } else setDrop((d) => d ?? 'wait')
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <span ref={ref} className="cc-head" data-drop={drop} aria-hidden="true">
      <MapTile />
      <span className="cc-mark">
        <span className="cc-pin">
          <MapsPin />
        </span>
      </span>
    </span>
  )
}

type CopyState = 'idle' | 'done' | 'fail'

function EmailCard() {
  const { t } = useTranslation()
  const [state, setState] = useState<CopyState>('idle')
  const btn = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const flash = (s: CopyState) => {
    setState(s)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }
  // insecure origins (LAN previews) have no async clipboard: fall back to the old copy command
  const legacyCopy = () => {
    const ta = document.createElement('textarea')
    ta.value = SITE.email
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    btn.current?.focus()
    return ok
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      flash('done')
    } catch {
      flash(legacyCopy() ? 'done' : 'fail')
    }
  }

  const words: Record<CopyState, string> = { idle: t('contact.copy'), done: t('contact.copied'), fail: t('contact.copy_fail') }
  // the three words share one cell, so the swap never shifts the layout
  const swap = (named: boolean) => (
    <span className="cc-swap is-text">
      {(Object.keys(words) as CopyState[]).map((k) => (
        <span key={k} className={state === k ? 'is-on' : ''} aria-hidden={named ? state !== k : undefined}>
          {words[k]}
        </span>
      ))}
    </span>
  )
  return (
    <CardMagnet>
      <div data-glow className="card glow-card cc cc--mail">
        <button ref={btn} type="button" onClick={copy} data-cursor="link" data-state={state} className="cc-main cc-hit">
          <span className="cc-head" aria-hidden="true">
            <Flap />
            <span className="cc-mark">
              <GmailMark />
            </span>
          </span>
          <span className="cc-body">
            <span className="cc-label">Email</span>
            <span className="cc-value">{SITE.email}</span>
            {/* phones: the words live under the address (the chip is just the icon) */}
            <span className="cc-note cc-tapnote" aria-hidden="true">
              {swap(false)}
            </span>
          </span>
          <span className="cc-chip">
            <span className="cc-swap" aria-hidden="true">
              <Copy className={state === 'idle' ? 'is-on' : ''} />
              <Check className={state === 'done' ? 'is-on' : ''} />
              <X className={state === 'fail' ? 'is-on' : ''} />
            </span>
            <span className="cc-chip-text">{swap(true)}</span>
          </span>
        </button>
        <a href={`mailto:${SITE.email}`} className="cc-alt" data-cursor="link">
          <span>{t('contact.mail_open')}</span>
          <ArrowUpRight className="cc-arrow" aria-hidden="true" />
        </a>
        <span className="sr-only" role="status">
          {state === 'done' ? t('contact.copied') : state === 'fail' ? t('contact.copy_fail') : ''}
        </span>
      </div>
    </CardMagnet>
  )
}

function LinkCard({ kind, href, head, label, value, note, action }: { kind: string; href: string; head: ReactNode; label: string; value: string; note?: string; action: string }) {
  return (
    <CardMagnet>
      <a href={href} target="_blank" rel="noopener noreferrer" data-glow data-cursor="link" className={`card glow-card cc cc-main cc--${kind}`}>
        {head}
        <Body label={label} value={value} note={note} />
        <Action text={action} />
      </a>
    </CardMagnet>
  )
}

export function Terminus() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  return (
    <section id="contacto" className="relative overflow-x-clip pb-16 pt-20 lg:pt-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="-ml-5 sm:-ml-6 lg:-ml-16">
            <ArrivalMap />
          </div>
          <div>
            <p className="inline-block rounded-lg bg-ink px-5 py-2.5 font-sign text-[clamp(2.2rem,4vw,3.4rem)] font-bold uppercase leading-none tracking-[0.04em] text-paper">
              {t('contact.terminus')}
            </p>
            <p className="mt-3 font-sign text-[17px] font-semibold text-ink-2">{t('contact.terminus_sub')}</p>
          </div>
        </div>

        <h2 className="sign-type mt-12 text-[clamp(3.2rem,7vw,4.8rem)]">{t('contact.title')}</h2>
        <p className="mt-3 max-w-[620px] text-[17px] leading-relaxed text-ink-2">{t('contact.subtitle')}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <li>
            <EmailCard />
          </li>
          <li>
            <LinkCard
              kind="gh"
              href={SITE.github}
              label="GitHub"
              value="github.com/eap59-ua"
              action={t('contact.profile')}
              head={
                <>
                  <span className="cc-tex" aria-hidden="true" />
                  <span className="cc-head" aria-hidden="true">
                    <span className="cc-mark">
                      <GitHubMark />
                    </span>
                  </span>
                </>
              }
            />
          </li>
          <li>
            <LinkCard
              kind="li"
              href={SITE.linkedin}
              label="LinkedIn"
              value="in/erardo-aldana"
              action={t('contact.profile')}
              head={
                <span className="cc-head" aria-hidden="true">
                  <span className="cc-mark">
                    <LinkedInMark />
                  </span>
                </span>
              }
            />
          </li>
          <li>
            <LinkCard
              kind="map"
              href={MAPS}
              label={t('contact.location')}
              value={t('contact.location_value')}
              note={t('contact.relocate_value')}
              action={t('contact.map_cta')}
              head={<MapHead />}
            />
          </li>
        </ul>

        <div data-glow className="card glow-card mt-4 flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between" style={l1}>
          <div className="flex items-start gap-3.5">
            <span className="relative mt-1.5 flex h-2.5 w-2.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-eco loop-anim" aria-hidden="true" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-eco" />
            </span>
            <div>
              <p className="font-semibold text-ink">{t('contact.avail')}</p>
              <p className="mt-0.5 text-[14.5px] text-ink-2">{t('contact.time')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* two plain downloads (never mistaken for the language switch): the active language first */}
            {(lang === 'en' ? (['en', 'es'] as const) : (['es', 'en'] as const)).map((l) => (
              <a key={l} href={CV[l]} download data-cursor="link" className="btn btn-ghost h-12" title={t(`contact.cv_${l}`)}>
                <Download className="h-4 w-4" aria-hidden="true" />
                CV ({l.toUpperCase()})<span className="sr-only"> — {t(`contact.cv_${l}`)}</span>
              </a>
            ))}
            <Magnetic>
              <a href={`mailto:${SITE.email}`} className="btn btn-primary" data-cursor="link">
                {t('contact.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
