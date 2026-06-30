import { useEffect, useRef, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'framer-motion'
import { Award, Languages, Sparkles } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { DEGREE, FP_ITEMS } from '../../data/education'
import { cn } from '../../lib/utils'

// inverted-pyramid layout: each tier narrower than the one above, centered.
// width + subtle background emphasis encode the academic level.
const FP_LAYOUT = [
  // DAW & DAM (CFGS) — deep space-navy identity
  { width: 'md:w-[86%]', overlay: 'from-blue-500/[0.08] to-transparent', glow: { a: '#60a5fa', b: '#1e40af', shadow: 'rgba(37,99,235,0.4)' } },
  { width: 'md:w-[86%]', overlay: 'from-blue-500/[0.08] to-transparent', glow: { a: '#60a5fa', b: '#1e40af', shadow: 'rgba(37,99,235,0.4)' } },
  // SMR (CFGM) — distinct teal tone
  { width: 'md:w-[68%]', overlay: 'from-teal-500/[0.08] to-transparent', glow: { a: '#2dd4bf', b: '#0d9488', shadow: 'rgba(20,184,166,0.38)' } },
]

export function Education() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const degreeRef = useRef<HTMLDivElement>(null)
  const b2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const root = rootRef.current
    if (!root) return

    let killed = false
    let io: IntersectionObserver | null = null
    let tl: { kill: () => void } | null = null

    void (async () => {
      const mod = await import('gsap')
      if (killed) return
      const gsap = mod.gsap ?? mod.default
      const cards = root.querySelectorAll('.edu-fp')
      const hidden = { opacity: 0, y: 64, scale: 0.86, rotateX: 14, transformPerspective: 900, transformOrigin: 'center bottom' }

      // pre-hide off-screen so there's no flash when the section scrolls in
      if (degreeRef.current) gsap.set(degreeRef.current, { opacity: 0, y: 40, scale: 0.97 })
      gsap.set(cards, hidden)
      if (b2Ref.current) gsap.set(b2Ref.current, { opacity: 0, y: 28 })

      io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          io?.disconnect()
          const t2 = gsap.timeline({ defaults: { ease: 'power3.out' } })
          if (degreeRef.current) {
            t2.to(degreeRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.7, clearProps: 'transform' })
          }
          t2.to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.75,
              stagger: 0.16,
              ease: 'back.out(1.5)',
              clearProps: 'transform',
            },
            '-=0.3',
          )
          if (b2Ref.current) {
            t2.to(b2Ref.current, { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform' }, '-=0.2')
          }
          tl = t2
        },
        { threshold: 0.12 },
      )
      io.observe(root)
    })()

    return () => {
      killed = true
      if (io) io.disconnect()
      if (tl) tl.kill()
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

        <div ref={rootRef} className="mx-auto mt-16 max-w-5xl [perspective:1200px]">
          {/* Tier 0 — Degree (widest, accent emphasis) */}
          <div
            ref={degreeRef}
            data-glow
            className="card-surface card-hover glow-card relative overflow-hidden border-accent/20 p-7 shadow-[0_0_50px_-20px_rgba(129,140,248,0.5)] sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.12] via-transparent to-accent-violet/[0.06]"
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white p-2.5 shadow-sm">
                <img
                  src="/universidad-de-alicante-1-logo-png-transparent.png"
                  alt="Universidad de Alicante"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
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

          {/* Tiers 1-2 — FP, narrowing toward the base */}
          <div className="mt-5 flex flex-col items-center gap-5">
            {FP_ITEMS.map((item, index) => {
              const Icon = item.icon
              const layout = FP_LAYOUT[index]
              return (
                <div
                  key={item.titleKey}
                  data-glow
                  style={
                    {
                      '--glow-a': layout.glow.a,
                      '--glow-b': layout.glow.b,
                      '--glow-shadow': layout.glow.shadow,
                    } as CSSProperties
                  }
                  className={cn(
                    'edu-fp card-surface card-hover glow-card relative w-full overflow-hidden p-5 sm:p-6',
                    layout.width,
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', layout.overlay)}
                  />
                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <span
                      className={cn(
                        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.05]',
                        item.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-mono text-[11px] text-slate-400">{item.period}</span>
                        {item.grade && (
                          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                            {t('edu.grade')} {item.grade}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 text-base font-bold leading-snug text-white">{t(item.titleKey)}</h4>
                      <p className="mt-0.5 text-xs text-slate-400">{item.org}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:max-w-[46%] sm:justify-end">
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
                </div>
              )
            })}
          </div>

          {/* Certification — full width, like the degree */}
          <div
            ref={b2Ref}
            data-glow
            style={
              {
                '--glow-a': '#fbbf24',
                '--glow-b': '#f59e0b',
                '--glow-shadow': 'rgba(245,158,11,0.45)',
              } as CSSProperties
            }
            className="card-surface card-hover glow-card relative mt-6 overflow-hidden px-5 py-3.5"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.12] via-transparent to-amber-700/[0.05]"
            />
            <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                <Languages className="h-4 w-4 text-amber-300" />
                {t('edu.cert')}
              </span>
              <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />
              <span className="text-xs text-slate-400">{t('edu.fct')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
