import { useTranslation } from 'react-i18next'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { EXPERIENCE } from '../../data/experience'
import { cn } from '../../lib/utils'

export function Experience() {
  const { t } = useTranslation()

  return (
    <section id="experience" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow={t('experience.eyebrow')}
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-line-strong to-transparent sm:left-5"
          />

          <div className="space-y-6">
            {EXPERIENCE.map((exp, index) => {
              const Icon = exp.icon
              return (
                <Reveal key={exp.company} delay={index * 0.08} className="relative pl-12 sm:pl-16">
                  <span className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-ink-850 sm:h-11 sm:w-11">
                    <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', exp.accent)} />
                  </span>

                  <div className="card-surface card-hover p-6">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <div className={cn('text-sm font-medium', exp.accent)}>{t(exp.roleKey)}</div>
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs text-slate-500">
                        {t(exp.periodKey)}
                      </span>
                    </div>

                    <RichText html={t(exp.descKey)} className="text-sm leading-relaxed text-slate-300" />

                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
