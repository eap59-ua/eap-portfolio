import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { TechLogo } from '../../data/techIcons'
import { BEST, ROADMAP, SKILL_GROUPS, TECH_MARQUEE, TECH_PROJECTS } from '../../data/skills'
import { PROJECTS } from '../../data/projects'
import { PROJECT_LINE, lineVar } from '../../data/lines'
import { LineBadge } from './buttons'
import './stack.css'

// The brand logos are ~70 % of this section's HTML (≈35 KB gzip of inline SVG paths) and
// sit far below the fold: the prerender ships the names with a same-size empty slot, and
// the logos are drawn once the section comes within ~1.5 screens. Same box, so no shift.
const IconsOn = createContext(false)
function Logo(props: { label: string; className?: string; mono?: boolean }) {
  return useContext(IconsOn) ? <TechLogo {...props} /> : <span className={`inline-block ${props.className ?? ''}`} aria-hidden="true" />
}

const ZONES = 'ABCDEFGH'
// zones are neutral on purpose: colour on this page means "a project line"
const neutral = { ['--lc' as string]: 'var(--ink-3)' } as CSSProperties

// the six project lines, in line order (L2…L7)
const LINES = PROJECTS.filter((p) => PROJECT_LINE[p.slug]).sort((a, b) => PROJECT_LINE[a.slug].n - PROJECT_LINE[b.slug].n)
const starred = new Set(SKILL_GROUPS.flatMap((g) => g.chips.filter((c) => c.star).map((c) => c.label)))

type Bind = (label: string) => {
  onPointerEnter: (e: PointerEvent) => void
  onPointerLeave: (e: PointerEvent) => void
  onFocus: (e: FocusEvent<HTMLButtonElement>) => void
  onBlur: () => void
  onClick: () => void
  'aria-pressed': boolean
}

export function StackMap() {
  const { t } = useTranslation()
  // the marquee repeats the list above: decorative, so it isn't prerendered (~100 KB of HTML)
  const [client, setClient] = useState(false)
  useEffect(() => setClient(true), [])
  const root = useRef<HTMLElement>(null)
  const [icons, setIcons] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setIcons(true)
        io.disconnect()
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // which station is lit: the hovered one, else the keyboard-focused one, else the tapped one
  const [hover, setHover] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const shown = hover ?? focus ?? pinned
  const lit = new Set(shown ? TECH_PROJECTS[shown] : [])

  // a tap elsewhere (or Esc) turns the tapped station off
  useEffect(() => {
    if (!pinned) return
    const off = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !(e.target as Element).closest?.('button.st')) setPinned(null)
    }
    document.addEventListener('pointerdown', off)
    document.addEventListener('keydown', off)
    return () => {
      document.removeEventListener('pointerdown', off)
      document.removeEventListener('keydown', off)
    }
  }, [pinned])

  const bind: Bind = (label) => ({
    onPointerEnter: (e) => e.pointerType === 'mouse' && setHover(label),
    onPointerLeave: (e) => e.pointerType === 'mouse' && setHover(null),
    // only keyboard focus lights it; a mouse click is handled by hover + pin
    onFocus: (e) => e.currentTarget.matches(':focus-visible') && setFocus(label),
    onBlur: () => setFocus(null),
    onClick: () => setPinned((p) => (p === label ? null : label)),
    'aria-pressed': pinned === label,
  })

  const projectName = (slug: string) => {
    const p = PROJECTS.find((x) => x.slug === slug)
    return p ? (p.titleKey ? t(p.titleKey) : p.title) : slug
  }
  const usedIn = (label: string) => (TECH_PROJECTS[label] ?? []).map(projectName)

  const station = (label: string, opts: { star?: boolean } = {}) => (
    <Station
      key={label}
      label={label}
      star={opts.star}
      on={shown === label}
      starText={t('stack.star')}
      usedInText={`${t('stack.used_in')} ${usedIn(label).join(', ')}`}
      bind={bind}
    />
  )

  return (
    <section ref={root} id="stack" className="relative py-20 lg:py-28">
      <IconsOn.Provider value={icons}>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="sign-type text-[clamp(3.2rem,7vw,4.8rem)]">{t('stack.title')}</h2>
          <p className="max-w-[460px] text-[17px] leading-relaxed text-ink-2">{t('stack.sub')}</p>
        </div>

        {/* the interchanges (★) first, on one line: what he handles best, at a glance */}
        <div className="mt-12">
          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-sign text-[28px] font-bold leading-none">{t('stack.best')}</span>
            <span className="text-[16px] font-medium text-ink-2">
              <span aria-hidden="true">★ </span>
              {t('stack.best_sub')}
            </span>
          </h3>
          <ul className="st-trunk mt-5 flex flex-wrap gap-x-4">
            {BEST.map((label) => (
              <li key={label} className="relative">
                {station(label, { star: true })}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          {/* platform: the six project lines; they light up for the station in use */}
          <div className="st-platform card px-3 py-3 sm:px-4" data-lit={shown ? '' : undefined}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h3 className="sign-label text-[14px] text-ink-2">{t('stack.lines')}</h3>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {LINES.map((p) => {
                  const L = PROJECT_LINE[p.slug]
                  const name = projectName(p.slug)
                  return (
                    <li key={p.slug} className="st-line" data-on={lit.has(p.slug) ? '' : undefined} style={{ ['--lc' as string]: lineVar(L.line) } as CSSProperties} title={name}>
                      <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} className="!h-7 !min-w-[2.25rem] !text-[15px]" />
                      <span className="hidden sm:inline">{name}</span>
                      <span className="sr-only sm:hidden">{name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <p className="mt-2 min-h-[2.6em] text-[14px] leading-snug text-ink-2 sm:min-h-0" aria-hidden="true">
              {shown ? (
                <>
                  <strong className="font-semibold">{t('stack.active', { tech: shown, count: lit.size, total: LINES.length })}</strong>
                  {lit.size > 0 && <span className="sm:hidden">: {usedIn(shown).join(', ')}</span>}
                </>
              ) : (
                // both rendered (the prerender can't know the pointer); CSS shows the one that fits
                <>
                  <span className="st-hint-mouse">{t('stack.hint')}</span>
                  <span className="st-hint-touch">{t('stack.hint_touch')}</span>
                </>
              )}
            </p>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                    <li key={c.label}>{station(c.label, { star: c.star })}</li>
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
                <li key={r.label} className="st" data-works="">
                  <Logo label={r.label} className="st-ic" />
                  {r.labelKey ? t(r.labelKey) : r.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* decorative: everything in it is already listed above */}
      {client ? (
      <div className="mx-auto mt-10 flex max-w-[1440px] items-center gap-6 px-5 sm:px-6 lg:px-16" aria-hidden="true">
        <p className="hidden flex-shrink-0 font-mono text-[13px] text-ink-3 md:block">{t('skills.marquee')}</p>
        <div className="group min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 loop-anim group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((x, i) => (
              <span key={`${x}-${i}`} className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-rule bg-paper-card px-4 font-sign text-[18px] font-bold text-ink">
                <Logo label={x} mono className="h-4 w-4 text-ink-2" />
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <div className="mt-10 h-11" aria-hidden="true" />
      )}
      </IconsOn.Provider>
    </section>
  )
}

/** one technology: a station. If it stops on project lines it is a button that lights them. */
function Station({
  label,
  star,
  on,
  starText,
  usedInText,
  bind,
}: {
  label: string
  star?: boolean
  on: boolean
  starText: string
  usedInText: string
  bind: Bind
}) {
  const slugs = TECH_PROJECTS[label] ?? []
  const isStar = star ?? starred.has(label)
  const body = (
    <>
      <Logo label={label} className="st-ic" />
      {label}
      {isStar && (
        <>
          <span aria-hidden="true" className="text-[0.8em]">
            ★
          </span>
          <span className="sr-only">({starText})</span>
        </>
      )}
      {slugs.length > 0 && (
        <>
          <span className="st-dots" aria-hidden="true">
            {slugs.map((s) => (
              <i key={s} data-dark={PROJECT_LINE[s]?.dark ? '' : undefined} style={{ ['--lc' as string]: lineVar(PROJECT_LINE[s].line) } as CSSProperties} />
            ))}
          </span>
          <span className="sr-only">. {usedInText}</span>
        </>
      )}
    </>
  )
  const common = { className: 'st', 'data-star': isStar ? '' : undefined, 'data-on': on ? '' : undefined }
  return slugs.length > 0 ? (
    <button type="button" {...common} {...bind(label)}>
      {body}
    </button>
  ) : (
    <span {...common}>{body}</span>
  )
}
