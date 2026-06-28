import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Send, PlaneTakeoff } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { SITE } from '../../lib/site'

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="container max-w-5xl">
        <SectionHeading
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard href={`mailto:${SITE.email}`} icon={<Mail className="h-5 w-5" />} label="Email" value={SITE.email} external={false} />
          <ContactCard href={SITE.github} icon={<GitHubIcon className="h-5 w-5" />} label="GitHub" value="github.com/eap59-ua" />
          <ContactCard href={SITE.linkedin} icon={<LinkedInIcon className="h-5 w-5" />} label="LinkedIn" value="in/erardo-aldana" />
          <ContactCard icon={<MapPin className="h-5 w-5" />} label={t('contact.location')} value={t('contact.location_value')} />
        </div>

        <Reveal delay={0.1}>
          <div className="card-surface mt-6 flex flex-col items-center justify-between gap-5 p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <div>
                <div className="font-semibold text-white">{t('contact.avail')}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                  <span>{t('contact.time')}</span>
                  <span className="hidden text-slate-600 sm:inline">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <PlaneTakeoff className="h-3.5 w-3.5 text-accent" />
                    {t('contact.relocate_value')}
                  </span>
                </div>
              </div>
            </div>
            <Button href={`mailto:${SITE.email}`} variant="primary" size="lg" className="w-full sm:w-auto">
              <Send className="h-4 w-4" />
              {t('contact.cta')}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ContactCard({
  href,
  icon,
  label,
  value,
  external = true,
}: {
  href?: string
  icon: ReactNode
  label: string
  value: string
  external?: boolean
}) {
  const inner = (
    <>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/[0.03] text-accent">
        {icon}
      </span>
      <div className="font-semibold text-white">{label}</div>
      <div className="mt-0.5 break-all font-mono text-xs text-slate-400">{value}</div>
    </>
  )

  const className =
    'card-surface card-hover glow-card flex flex-col items-start p-5'

  if (!href) {
    return (
      <div data-glow className={className}>
        {inner}
      </div>
    )
  }

  return (
    <a
      data-glow
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
    >
      {inner}
    </a>
  )
}
