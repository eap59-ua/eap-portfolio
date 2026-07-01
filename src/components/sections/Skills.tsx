import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sprout } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { TechLogo } from '../../data/techIcons'
import { SKILL_GROUPS, ROADMAP, TECH_MARQUEE } from '../../data/skills'
import { cn } from '../../lib/utils'

export function Skills() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  // stagger the tech chips into view as the grid scrolls in
  useEffect(() => {
    if (reduce) return
    const root = gridRef.current
    if (!root) return
    let killed = false
    let io: IntersectionObserver | null = null
    void (async () => {
      const mod = await import('gsap')
      if (killed) return
      const gsap = mod.gsap ?? mod.default
      const chips = root.querySelectorAll('.skill-chip')
      gsap.set(chips, { opacity: 0, y: 10, scale: 0.9 })
      io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          io?.disconnect()
          gsap.to(chips, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.015,
            ease: 'power2.out',
            clearProps: 'transform',
          })
        },
        { threshold: 0.1 },
      )
      io.observe(root)
    })()
    return () => {
      killed = true
      if (io) io.disconnect()
    }
  }, [reduce])

  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow={t('skills.eyebrow')} title={t('skills.title')} />
        <Reveal className="mt-5 text-center">
          <RichText html={t('skills.legend')} className="mx-auto max-w-xl text-sm text-slate-400" />
        </Reveal>

        <div ref={gridRef} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group, index) => {
            const Icon = group.icon
            return (
              <Reveal key={group.titleKey} delay={(index % 4) * 0.06}>
                <div data-glow className="card-surface card-hover glow-card h-full p-6">
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
                          'skill-chip inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
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

        <Reveal className="mt-6">
          <div data-glow className="card-surface card-hover glow-card p-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">
              <Sprout className="h-4 w-4" />
              {t('skills.roadmap')}
            </div>
            <p className="mb-4 mt-1 text-sm text-slate-400">{t('skills.roadmap_sub')}</p>
            <div className="flex flex-wrap gap-2">
              {ROADMAP.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-white/[0.02] px-2.5 py-1.5 text-xs font-medium text-slate-300"
                >
                  <TechLogo label={label} className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            // stack en producción
          </p>
          <div aria-hidden="true" className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
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
