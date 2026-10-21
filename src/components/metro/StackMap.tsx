import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { TechLogo } from '../../data/techIcons'
import { ROADMAP, SKILL_GROUPS, TECH_MARQUEE } from '../../data/skills'

const ZONES = 'ABCDEFGH'
// zones are neutral on purpose: colour on this page means "a project line"
const neutral = { ['--lc' as string]: 'var(--ink-3)' } as CSSProperties

export function StackMap() {
  const { t } = useTranslation()
  return (
    <section id="stack" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="sign-type text-[clamp(3.2rem,7vw,4.8rem)]">{t('stack.title')}</h2>
          <p className="max-w-[460px] text-[17px] leading-relaxed text-ink-2">{t('stack.sub')}</p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SKILL_GROUPS.map((g, i) => (
            <li key={g.titleKey} data-glow className="card glow-card p-5" style={neutral}>
              <h3 className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-ink font-sign text-[15px] font-bold text-paper" aria-hidden="true">
                  {ZONES[i]}
                </span>
                <span className="sr-only">
                  {t('stack.zone')} {ZONES[i]}:
                </span>
                <span className="font-sign text-[22px] font-bold leading-none">{t(g.titleKey)}</span>
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.chips.map((c) => (
                  <li
                    key={c.label}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full bg-paper-card px-3 text-[14px] ${
                      c.star ? 'border-2 border-ink font-bold text-ink' : 'border border-rule font-medium text-ink-2'
                    }`}
                  >
                    <TechLogo label={c.label} mono className="h-3.5 w-3.5 flex-shrink-0" />
                    {c.label}
                    {c.star && (
                      <>
                        <span aria-hidden="true" className="text-[11px]">
                          ★
                        </span>
                        <span className="sr-only">({t('stack.star')})</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div data-glow className="card glow-card mt-4 border-dashed p-5" style={neutral}>
          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-sign text-[22px] font-bold">{t('stack.works')}</span>
            <span className="font-mono text-[13px] text-ink-3">{t('stack.works_sub')}</span>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ROADMAP.map((r) => (
              <li key={r.label} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-ink-3 px-3 text-[14px] font-medium text-ink-2">
                <TechLogo label={r.label} mono className="h-3.5 w-3.5" />
                {r.labelKey ? t(r.labelKey) : r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* decorative: everything in it is already listed above */}
      <div className="mx-auto mt-10 flex max-w-[1440px] items-center gap-6 px-5 sm:px-6 lg:px-16" aria-hidden="true">
        <p className="hidden flex-shrink-0 font-mono text-[13px] text-ink-3 md:block">{t('skills.marquee')}</p>
        <div className="group min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 loop-anim group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((x, i) => (
              <span key={`${x}-${i}`} className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-rule bg-paper-card px-4 font-sign text-[18px] font-bold text-ink">
                <TechLogo label={x} mono className="h-4 w-4 text-ink-2" />
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
