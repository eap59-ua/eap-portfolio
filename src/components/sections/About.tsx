import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { GraduationCap, Mail, Code2 } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { EDUCATION } from '../../data/education'
import { SITE } from '../../lib/site'
import { cn } from '../../lib/utils'

export function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="card-surface relative mx-auto aspect-[4/5] max-w-sm overflow-hidden">
              <img
                src="/profile.jpg"
                alt={SITE.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink-900/60 via-transparent to-accent-strong/10" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="card-surface p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs font-semibold tracking-wide text-emerald-300">
                  {t('about.status')}
                </span>
              </div>

              <h3 className="mb-5 text-2xl font-bold text-white sm:text-3xl">
                {t('about.greeting')} <span className="inline-block">👋</span>
              </h3>

              <div className="space-y-4 leading-relaxed text-slate-300">
                <RichText html={t('about.p1')} />
                <RichText html={t('about.p2')} />
                <RichText html={t('about.p3')} />
              </div>

              <h4 className="mt-8 flex items-center gap-2 text-lg font-bold text-white">
                <GraduationCap className="h-5 w-5 text-accent" />
                {t('about.edu')}
              </h4>
              <ul className="mt-4 space-y-3">
                {EDUCATION.map((edu) => (
                  <li key={edu.titleKey} className="flex items-start gap-3">
                    <span className={cn('mt-2 h-2 w-2 flex-shrink-0 rounded-full', edu.dot)} />
                    <div>
                      <div className="font-medium text-white">{t(edu.titleKey)}</div>
                      <div className="text-sm text-slate-400">{t(edu.subKey)}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <SocialPill href={SITE.linkedin} label="LinkedIn">
                  <LinkedInIcon className="h-4 w-4" />
                </SocialPill>
                <SocialPill href={SITE.github} label="GitHub">
                  <GitHubIcon className="h-4 w-4" />
                </SocialPill>
                <SocialPill href={`mailto:${SITE.email}`} label="Email" external={false}>
                  <Mail className="h-4 w-4" />
                </SocialPill>
                <SocialPill href={SITE.repo} label={t('about.source')}>
                  <Code2 className="h-4 w-4" />
                </SocialPill>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SocialPill({
  href,
  label,
  children,
  external = true,
}: {
  href: string
  label: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200 transition-colors hover:border-accent hover:text-white"
    >
      {children}
      {label}
    </a>
  )
}
