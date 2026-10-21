import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUp, Download, Mail, MapPin } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { Magnetic } from '../motion/Magnetic'
import { PROJECT_LINE } from '../../data/lines'
import { SITE } from '../../lib/site'

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

function Card({ icon, label, value, note, children }: { icon: ReactNode; label: string; value: string; note?: string; children?: ReactNode }) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-rule bg-paper text-ink">{icon}</span>
      <span className="mt-4 block font-sign text-[22px] font-bold leading-none text-ink">{label}</span>
      <span className="mt-1.5 block break-all font-mono text-[13px] text-ink-2">{value}</span>
      {note && <span className="mt-1 block font-mono text-[12px] text-ink-3">{note}</span>}
      {children}
    </>
  )
}

export function Terminus() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  const [copied, setCopied] = useState(false)
  const cardCls = 'card glow-card block p-5 text-left transition-colors duration-200'

  const copy = () => {
    navigator.clipboard?.writeText(SITE.email).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      },
      () => {},
    )
  }

  return (
    <>
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

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <button type="button" onClick={copy} data-glow data-cursor="link" className={`${cardCls} w-full hover:border-ink-3`} style={l1} aria-label={`${t('contact.copy')}: ${SITE.email}`}>
                <Card icon={<Mail className="h-5 w-5" aria-hidden="true" />} label="Email" value={SITE.email} note={copied ? t('contact.copied') : t('contact.copy_hint')} />
              </button>
              <span className="sr-only" role="status">
                {copied && t('contact.copied')}
              </span>
            </li>
            <li>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" data-glow data-cursor="link" className={`${cardCls} hover:border-ink-3`} style={l1}>
                <Card icon={<GitHubIcon className="h-5 w-5" />} label="GitHub" value="github.com/eap59-ua" />
              </a>
            </li>
            <li>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" data-glow data-cursor="link" className={`${cardCls} hover:border-ink-3`} style={l1}>
                <Card icon={<LinkedInIcon className="h-5 w-5" />} label="LinkedIn" value="in/erardo-aldana" />
              </a>
            </li>
            <li>
              <div data-glow className={cardCls} style={l1}>
                <Card icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label={t('contact.location')} value={t('contact.location_value')} note={t('contact.relocate_value')} />
              </div>
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
              {/* one control, two languages: the active language comes first */}
              <div className="inline-flex h-12 items-stretch overflow-hidden rounded-lg border-2 border-ink">
                <span className="flex items-center gap-1.5 px-3.5 font-semibold text-ink">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  CV
                </span>
                {(lang === 'en' ? (['en', 'es'] as const) : (['es', 'en'] as const)).map((l) => (
                  <a
                    key={l}
                    href={CV[l]}
                    download
                    aria-label={t(`contact.cv_${l}`)}
                    data-cursor="link"
                    className={`flex items-center border-l-2 border-ink px-3.5 font-sign text-[16px] font-bold uppercase transition-colors duration-200 ${
                      l === lang ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-2'
                    }`}
                  >
                    {l}
                  </a>
                ))}
              </div>
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

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-7 font-mono text-[12.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-16">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {t('footer.end')}
          </p>
          <p>
            <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
              {t('footer.built')}
            </a>
          </p>
          <a href="#inicio" className="inline-flex items-center gap-1.5 hover:text-ink">
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            {t('footer.top')}
          </a>
        </div>
      </footer>
    </>
  )
}
