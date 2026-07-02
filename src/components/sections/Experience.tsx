import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { EXPERIENCE } from '../../data/experience'
import { cn } from '../../lib/utils'

export function Experience() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Draw the timeline spine in sync with scroll, and "switch on" each node
  // (icon + card, via .xp-on) once the drawn edge reaches it. Scrolling back
  // up removes the class again, so the activation is fully reversible.
  useEffect(() => {
    const line = lineRef.current
    const wrap = wrapRef.current
    if (!line || !wrap) return
    const items = Array.from(wrap.querySelectorAll<HTMLElement>('.xp-item'))
    if (reduce) {
      line.style.transform = 'scaleY(1)'
      items.forEach((item) => item.classList.add('xp-on'))
      return
    }
    const section = sectionRef.current
    if (!section) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const start = vh * 0.8
      const end = vh * 0.4
      const total = rect.height + (start - end)
      const p = Math.max(0, Math.min(1, (start - rect.top) / total))
      line.style.transform = `scaleY(${p})`

      // offsetTop-based marks are immune to entrance/scale transforms
      const drawn = p * line.offsetHeight
      for (const item of items) {
        const dot = item.querySelector<HTMLElement>('.xp-dot')
        const mark = item.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 0) - line.offsetTop
        item.classList.toggle('xp-on', drawn >= mark)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <section ref={sectionRef} id="experience" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow={t('experience.eyebrow')}
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
        />

        <div ref={wrapRef} className="relative mx-auto mt-16 max-w-3xl">
          <div
            ref={lineRef}
            aria-hidden="true"
            style={{ transformOrigin: 'top', transform: 'scaleY(0)' }}
            className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent via-accent-violet/70 to-transparent sm:left-5"
          />

          <div className="space-y-6">
            {EXPERIENCE.map((exp, index) => {
              const Icon = exp.icon
              return (
                <Reveal key={exp.company} delay={index * 0.08} className="xp-item relative pl-12 sm:pl-16">
                  <span className="xp-dot absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-ink-850 sm:h-11 sm:w-11">
                    <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', exp.accent)} />
                  </span>

                  <div data-glow className="xp-card card-surface card-hover glow-card p-6">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <div className={cn('text-sm font-medium', exp.accent)}>{t(exp.roleKey)}</div>
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs text-slate-400">
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
