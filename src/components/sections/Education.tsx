import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'framer-motion'
import { GraduationCap, Award, Languages, Sparkles } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { DEGREE, FP_ITEMS } from '../../data/education'
import { cn } from '../../lib/utils'

export function Education() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const degreeRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const root = rootRef.current
    if (!root) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    void (async () => {
      const gsapMod = await import('gsap')
      const stMod = await import('gsap/ScrollTrigger')
      if (cancelled) return
      const gsap = gsapMod.gsap ?? gsapMod.default
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (degreeRef.current) {
          gsap.from(degreeRef.current, {
            opacity: 0,
            y: 40,
            scale: 0.97,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 75%' },
          })
        }
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              transformOrigin: 'left center',
              scrollTrigger: { trigger: root, start: 'top 68%', end: 'center 62%', scrub: true },
            },
          )
        }
        gsap.from('.edu-fp', {
          opacity: 0,
          y: 52,
          rotateX: 8,
          transformPerspective: 800,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.edu-fp-grid', start: 'top 82%' },
        })
      }, root)
      // recalc trigger positions now that the lazy chunk + Lenis are live
      ScrollTrigger.refresh()
    })()

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [reduce])

  return (
    <section id="education" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow={t('education.eyebrow')}
          title={t('education.title')}
          subtitle={t('education.subtitle')}
        />

        <div ref={rootRef} className="mx-auto mt-16 max-w-5xl">
          <div ref={degreeRef} data-glow className="card-surface card-hover glow-card p-7 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-accent-violet/10 text-accent">
                <GraduationCap className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{t(DEGREE.titleKey)}</h3>
                  <span className="whitespace-nowrap font-mono text-xs text-slate-400">
                    {DEGREE.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{DEGREE.org}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                    <Award className="h-3.5 w-3.5" />
                    {t(DEGREE.badgeKey)}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{t(DEGREE.descKey)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {DEGREE.activities.map((activity) => (
                    <span
                      key={activity}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-slate-300"
                    >
                      <Sparkles className="h-3 w-3 text-accent" />
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 h-px w-full overflow-hidden" aria-hidden="true">
            <div
              ref={lineRef}
              className="h-full w-full origin-left bg-gradient-to-r from-accent via-accent-violet to-transparent"
            />
          </div>

          <div className="edu-fp-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FP_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.titleKey}
                  data-glow
                  className="edu-fp card-surface card-hover glow-card flex h-full flex-col p-6"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]',
                        item.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.grade && (
                      <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        {t('edu.grade')} {item.grade}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{item.period}</span>
                  <h4 className="mt-1 text-sm font-bold leading-snug text-white">{t(item.titleKey)}</h4>
                  <p className="mt-1 text-xs text-slate-400">{item.org}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-white/[0.02] px-5 py-3.5">
            <span className="inline-flex items-center gap-2 text-sm text-slate-200">
              <Languages className="h-4 w-4 text-accent" />
              {t('edu.cert')}
            </span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="text-xs text-slate-400">{t('edu.fct')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
