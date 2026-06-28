import { useTranslation } from 'react-i18next'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { TechLogo } from '../../data/techIcons'
import { SKILL_GROUPS, TECH_MARQUEE } from '../../data/skills'
import { cn } from '../../lib/utils'

export function Skills() {
  const { t } = useTranslation()

  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow={t('skills.eyebrow')} title={t('skills.title')} />
        <Reveal className="mt-5 text-center">
          <RichText html={t('skills.legend')} className="mx-auto max-w-xl text-sm text-slate-400" />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group, index) => {
            const Icon = group.icon
            return (
              <Reveal key={group.titleKey} delay={index * 0.07}>
                <div className="card-surface card-hover h-full p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br',
                        group.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-white">{t(group.titleKey)}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.chips.map((chip) => (
                      <span
                        key={chip.label}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
                          chip.star
                            ? 'border-accent/40 bg-accent/10 text-white'
                            : 'border-line bg-white/[0.03] text-slate-300',
                        )}
                      >
                        <TechLogo label={chip.label} className="h-3.5 w-3.5" />
                        {chip.label}
                        {chip.star && <span className="text-[10px] text-accent">★</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-16">
          <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
            // stack en producción
          </p>
          <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white/[0.03] px-5 py-3 transition-colors hover:border-line-strong"
                >
                  <TechLogo label={tech} className="h-6 w-6" />
                  <span className="font-mono text-sm text-slate-200">{tech}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
