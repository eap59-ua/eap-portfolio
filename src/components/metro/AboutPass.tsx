import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Code2, Mail } from 'lucide-react'
import { RichText } from '../ui/RichText'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { SITE } from '../../lib/site'

const nb = (s: string) => s.replace(/Full-Stack/g, 'Full‑Stack')

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="sign-label text-[11.5px] text-ink-3">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">{children}</dd>
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

  const pills: { href: string; label: string; icon: ReactNode; external?: boolean }[] = [
    { href: SITE.linkedin, label: 'LinkedIn', icon: <LinkedInIcon className="h-4 w-4" /> },
    { href: SITE.github, label: 'GitHub', icon: <GitHubIcon className="h-4 w-4" /> },
    { href: `mailto:${SITE.email}`, label: 'Email', icon: <Mail className="h-4 w-4" aria-hidden="true" />, external: false },
    { href: SITE.repo, label: t('about.source'), icon: <Code2 className="h-4 w-4" aria-hidden="true" /> },
  ]

  return (
    <section id="sobre-mi" className="relative py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 sm:px-6 lg:grid-cols-[500px_1fr] lg:gap-16 lg:px-16">
        <div
          data-glow
          data-line="l1"
          className="card glow-card mx-auto w-full max-w-[500px] overflow-hidden"
          style={{ ['--lc' as string]: 'var(--l1)' } as CSSProperties}
        >
          <div className="flex items-center justify-between bg-l1 px-5 py-3.5 text-paper sm:px-6">
            <h2 className="sign-label text-[17px] text-paper sm:text-[19px]">{t('about.pass')}</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-paper px-2.5 py-0.5 font-sign text-[14px] font-bold" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-paper" />
              EAP
              <span className="h-1.5 w-1.5 rounded-full bg-paper" />
            </span>
          </div>
          <div className="grid grid-cols-[minmax(0,150px)_1fr] gap-5 p-5 sm:grid-cols-[190px_1fr] sm:p-6">
            <picture>
              <source srcSet="/profile.webp" type="image/webp" />
              <img src="/profile.jpg" alt={t('about.photo')} loading="lazy" decoding="async" width={800} height={1000} className="aspect-[4/5] w-full rounded-xl object-cover" />
            </picture>
            <dl className="flex flex-col gap-2.5">
              <Field label={t('about.f_holder')}>{SITE.name}</Field>
              <Field label={t('about.f_profile')}>{nb(t('hero.role'))}</Field>
              <Field label={t('about.f_zone')}>{t('about.zone')}</Field>
              <Field label={t('about.f_since')}>{t('about.since')}</Field>
              <Field label={t('about.f_langs')}>{t('about.langs')}</Field>
            </dl>
          </div>
          <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-dashed border-rule px-5 py-3 font-mono text-[12px] text-ink-3 sm:px-6">
            <span>{t('about.valid')}</span>
            <span>n.º 2016-2026</span>
          </p>
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
          <ul className="mt-8 flex flex-wrap gap-3">
            {pills.map((p, i) => (
              <li key={p.href} className={settled ? '' : 'pill-float loop-anim'} style={{ animationDelay: `${i * 0.45}s` }}>
                <a
                  href={p.href}
                  {...(p.external === false ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  onPointerEnter={() => setSettled(true)}
                  data-cursor="link"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-rule bg-paper-card px-4 text-[15px] font-semibold text-ink transition-colors duration-200 hover:border-l1 hover:text-l1"
                >
                  {p.icon}
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
