import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CERCANIAS, JOURNEY, type JourneyStation } from '../../data/journey'
import { PROJECT_LINE } from '../../data/lines'
import { useMedia, useReducedMotion } from '../../lib/motion'
import { scrollToY } from '../layout/SmoothScroll'

const N = JOURNEY.length
const GAP = 320 // px between stations on the pinned line
const BAR = 72 // --bar-h

function useLang() {
  const { t, i18n } = useTranslation()
  return { t, lang: i18n.language?.startsWith('en') ? ('en' as const) : ('es' as const) }
}

/** station marker: circle = education, square = work, capsule = interchange, bar = terminus */
function Marker({ s, passed, size = 18 }: { s: JourneyStation; passed: boolean; size?: number }) {
  const fill = passed ? 'var(--l1)' : 'var(--card)'
  const base: CSSProperties = { borderColor: 'var(--l1)', background: fill, transition: 'background-color .2s ease' }
  if (s.kind === 'interchange')
    return <span className="block rounded-full border-[3px]" style={{ ...base, width: size + 16, height: size, borderColor: 'var(--ink)', background: passed ? 'var(--ink)' : 'var(--card)' }} />
  if (s.kind === 'work') return <span className="block rounded-[3px] border-4" style={{ ...base, width: size - 2, height: size - 2 }} />
  if (s.kind === 'next') return <span className="block rounded-sm" style={{ width: 8, height: size + 14, background: 'var(--ink)' }} />
  return <span className="block rounded-full border-4" style={{ ...base, width: size, height: size, ...(s.kind === 'milestone' ? { width: size - 4, height: size - 4 } : null) }} />
}

function StationCard({ s, active, compact }: { s: JourneyStation; active: boolean; compact?: boolean }) {
  const { t, lang } = useLang()
  return (
    <article
      data-glow
      data-line="l1"
      className={`card glow-card ${active ? 'is-active' : ''} ${compact ? 'p-5' : 'p-6 lg:p-7'}`}
      style={{ ['--lc' as string]: 'var(--l1)' } as CSSProperties}
    >
      <p className="flex flex-wrap items-center gap-2">
        {s.kind !== 'next' && <span className="sign-label text-[13px] text-ink-3">{t(`journey.kind.${s.kind}`)}</span>}
        <span className="rounded-full border border-rule px-2.5 py-0.5 text-[13px] font-medium text-ink-2">{s.when[lang]}</span>
        {s.grade && <span className="rounded-full bg-l1 px-2.5 py-0.5 text-[13px] font-semibold text-paper">{t('journey.grade', { g: s.grade })}</span>}
      </p>
      <h3 className={`sign-type mt-3 ${compact ? 'text-[26px]' : 'text-[clamp(1.9rem,2.6vw,2.4rem)]'}`}>{s.title[lang]}</h3>
      {s.org && <p className="mt-1 text-[14.5px] font-medium text-ink-2">{s.org[lang]}</p>}
      <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">{s.body[lang]}</p>
      {s.branches && (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
          {t('journey.branches')}
          {s.branches.map((b) => (
            <span key={b} className="line-badge h-[22px] min-w-[22px] text-[12px]" data-dark={PROJECT_LINE[b].dark ? '' : undefined} style={{ ['--lc' as string]: `var(--${PROJECT_LINE[b].line})` } as CSSProperties}>
              {PROJECT_LINE[b].n}
            </span>
          ))}
        </p>
      )}
      {s.tags && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {s.tags.map((x) => (
            <li key={x} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-rule bg-paper-card px-2.5 text-[13px] font-medium text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-l1" />
              {x}
            </li>
          ))}
        </ul>
      )}
      {s.kind === 'next' && (
        <a href="#contacto" className="btn btn-primary mt-5 h-11 text-[15px]" data-cursor="link">
          {t('journey.cta')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </article>
  )
}

/** where the train is along the line, with dwell: it stops at each station for ~40% of a segment */
function dwell(p: number) {
  const s = Math.min(Math.max(p, 0), 1) * (N - 1)
  const i = Math.min(Math.floor(s), N - 2)
  const f = Math.min(Math.max((s - i - 0.3) / 0.4, 0), 1)
  const e = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2
  return i + e
}

// ── Desktop: one pinned stretch. Scroll is linked, never hijacked. ──────────
function PinnedJourney() {
  const { t, lang } = useLang()
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const train = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [travel, setTravel] = useState(0)

  // scroll length: 1:1 with the horizontal distance, capped at 3 screens
  useLayoutEffect(() => {
    const measure = () => setTravel(Math.min((N - 1) * GAP, window.innerHeight * 3))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (!travel) return
    let raf = 0
    let last = -1
    const update = () => {
      raf = 0
      const top = wrap.current!.getBoundingClientRect().top // read
      const p = (BAR - top) / travel
      const pos = dwell(p)
      track.current!.style.transform = `translate3d(${-pos * GAP}px,0,0)` // write
      const i = Math.round(pos)
      if (i !== last) {
        last = i
        setActive(i)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [travel])

  const goTo = useCallback(
    (i: number) => {
      const k = Math.min(Math.max(i, 0), N - 1)
      const top = wrap.current!.getBoundingClientRect().top + window.scrollY - BAR
      scrollToY(top + (k / (N - 1)) * travel)
    },
    [travel],
  )
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input,textarea')) return
    if (e.key === 'ArrowRight') goTo(active + 1)
    else if (e.key === 'ArrowLeft') goTo(active - 1)
    else return
    e.preventDefault()
  }

  const cur = JOURNEY[active]
  return (
    <div ref={wrap} className="relative" style={{ height: `calc(100svh - ${BAR}px + ${travel}px)` }} onKeyDown={onKey}>
      {/* anchors at the scroll position of each station (map links, #estacion-*) */}
      {JOURNEY.map((s, i) => (
        <span key={s.id} id={`estacion-${s.id}`} className="pointer-events-none absolute left-0 block h-px w-px" style={{ top: (i / (N - 1)) * travel }} aria-hidden="true" />
      ))}
      <div className="sticky flex flex-col overflow-x-clip" style={{ top: BAR, height: `calc(100svh - ${BAR}px)` }}>
        <div className="mx-auto flex w-full max-w-[1440px] items-start justify-between px-16 pt-8">
          <h2 className="flex items-center gap-4">
            <span className="line-badge h-10 min-w-[40px] text-xl" style={{ ['--lc' as string]: 'var(--l1)' } as CSSProperties}>1</span>
            <span className="sign-type text-[clamp(3rem,5vw,4.4rem)]">{t('st.journey')}</span>
          </h2>
          <p className="text-right">
            <span className="block font-sign text-[clamp(1.6rem,2.2vw,2.1rem)] font-bold text-l1">
              {t('journey.counter', { n: active + 1, total: N })} · {cur.year}
            </span>
            <span className="font-mono text-[13px] text-ink-3">{t('journey.sub')}</span>
          </p>
        </div>

        {/* cards: the current station in the middle, its neighbours dimmed at the sides */}
        <div className="relative mx-auto mt-4 h-[clamp(240px,38svh,330px)] w-full max-w-[1440px]">
          {JOURNEY.map((s, i) => {
            const d = i - active
            const side = Math.abs(d) === 1
            const style: CSSProperties = {
              transform: `translate(-50%, -50%) translateX(${d * 30}vw) scale(${d === 0 ? 1 : 0.8})`,
              opacity: d === 0 ? 1 : side ? 0.45 : 0,
              pointerEvents: d === 0 ? 'auto' : 'none',
            }
            return (
              <div key={s.id} className="absolute left-1/2 top-1/2 w-[min(520px,38vw)] transition-[transform,opacity] duration-[450ms] ease-out" style={style} aria-hidden={d !== 0}>
                <StationCard s={s} active={d === 0} />
              </div>
            )
          })}
        </div>

        {/* the line: slides under a train that stays in the middle */}
        <div className="relative mt-auto h-[220px]">
          <span ref={train} className="absolute left-1/2 top-[22px] z-10 h-[24px] w-[52px] -translate-x-1/2 rounded-[7px] bg-ink shadow-[0_0_0_4px_var(--paper)]" aria-hidden="true" />
          <div ref={track} className="absolute left-1/2 top-0 h-full will-change-transform" style={{ width: (N - 1) * GAP }}>
            <span className="absolute left-0 top-[29px] h-[10px] rounded-full bg-l1" style={{ width: (N - 1) * GAP }} />
            {/* Cercanías: dashed, parallel the whole way, ends at today's job */}
            <span
              className="absolute left-[-40px] top-[132px] h-[6px]"
              style={{ width: (N - 1) * GAP + 40, backgroundImage: 'repeating-linear-gradient(90deg, var(--cer) 0 22px, transparent 22px 34px)' }}
            />
            <span className="absolute top-[124px] h-[22px] w-[22px] -translate-x-1/2 rounded-[4px] border-4 border-cer bg-paper-card" style={{ left: (N - 1) * GAP }} />
            <ol aria-label={t('journey.stations')}>
              {JOURNEY.map((s, i) => (
                <li key={s.id} className="absolute top-0 -translate-x-1/2" style={{ left: i * GAP }}>
                  <a
                    href={`#estacion-${s.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      goTo(i)
                    }}
                    onFocus={() => goTo(i)}
                    aria-current={i === active ? 'step' : undefined}
                    data-cursor="station"
                    data-line="l1"
                    className="group flex flex-col items-center rounded-lg px-2 pt-[20px] outline-offset-4"
                  >
                    <span className="flex h-[28px] items-center">
                      <Marker s={s} passed={i <= active} />
                    </span>
                    <span className={`mt-3 whitespace-nowrap font-sign text-[19px] font-bold transition-colors ${i === active ? 'text-ink' : 'text-ink-2'}`}>{s.short[lang]}</span>
                    <span className="whitespace-nowrap text-[13px] text-ink-3">{s.when[lang]}</span>
                  </a>
                  {/* interchange: the project lines leave from here */}
                  {s.branches?.map((b, k) => (
                    <span
                      key={b}
                      className="absolute left-1/2 top-[34px] h-[6px] origin-left rounded-full transition-transform duration-[450ms] ease-out"
                      style={{
                        width: 58,
                        background: `var(--${PROJECT_LINE[b].line})`,
                        transform: `translateX(${8 + k * 9}px) rotate(-45deg) scaleX(${i === active ? 1 : 0.35})`,
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </li>
              ))}
            </ol>
          </div>
          <p className="absolute left-0 right-0 top-[160px] mx-auto flex max-w-[1440px] items-center gap-2.5 px-16 font-sign text-[16px] font-semibold text-ink-2">
            <span className="line-badge h-[24px] min-w-[24px] text-[13px]" style={{ ['--lc' as string]: 'var(--cer)' } as CSSProperties}>C</span>
            {t('journey.cer')}: {CERCANIAS.jobs[lang].join(' · ')} → <b className="text-ink">{CERCANIAS.now[lang]}</b>
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-16 pb-7">
          <p className="font-mono text-[13px] text-ink-3">{t('journey.hint')}</p>
          <div className="flex gap-3">
            <button type="button" className="btn btn-ghost h-11 text-[15px] disabled:pointer-events-none disabled:opacity-35" onClick={() => goTo(active - 1)} disabled={active === 0}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('journey.prev')}
            </button>
            <button type="button" className="btn btn-primary h-11 text-[15px] disabled:pointer-events-none disabled:opacity-35" onClick={() => goTo(active + 1)} disabled={active === N - 1}>
              {t('journey.next')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <a href="#sobre-mi" className="font-sign text-[16px] font-semibold text-ink underline underline-offset-4">
            {t('journey.skip')}
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Phones, tablets, keyboard-only and reduced motion: a vertical spine ─────
function VerticalJourney() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [trainY, setTrainY] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  useLayoutEffect(() => {
    const el = items.current[active]
    if (el) setTrainY(el.offsetTop + 30)
  }, [active])

  return (
    <div className="mx-auto max-w-[760px] px-5 sm:px-6">
      <h2 className="flex items-center gap-3">
        <span className="line-badge h-9 min-w-[36px] text-lg" style={{ ['--lc' as string]: 'var(--l1)' } as CSSProperties}>1</span>
        <span className="sign-type text-[clamp(2.8rem,10vw,4rem)]">{t('st.journey')}</span>
      </h2>
      <p className="mt-2 font-mono text-[13px] text-ink-3">{t('journey.sub')}</p>

      <ol ref={list} className="relative mt-8 flex flex-col gap-4 pl-[52px]" aria-label={t('journey.stations')}>
        {/* L1 spine + Cercanías running alongside the whole way */}
        <span className="absolute bottom-6 left-[14px] top-6 w-[8px] rounded-full bg-l1" aria-hidden="true" />
        <span className="absolute bottom-0 left-[30px] top-6 w-[4px]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, var(--cer) 0 12px, transparent 12px 19px)' }} aria-hidden="true" />
        {!reduce && (
          <span
            className="absolute left-[6px] top-0 z-10 h-[38px] w-[24px] rounded-[7px] bg-ink shadow-[0_0_0_3px_var(--paper)] transition-transform duration-[450ms] ease-out"
            style={{ transform: `translateY(${trainY - 19}px)` }}
            aria-hidden="true"
          />
        )}
        {JOURNEY.map((s, i) => (
          <li key={s.id} id={`estacion-${s.id}`} data-i={i} ref={(el) => void (items.current[i] = el)} className="relative scroll-mt-[calc(var(--bar-h)+16px)]">
            <span className="absolute left-[-52px] top-[22px] flex w-[36px] justify-center" aria-hidden="true">
              <Marker s={s} passed={i <= active} size={16} />
            </span>
            <StationCard s={s} active={i === active} compact />
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Cercanías in full: today's job and the earlier ones (nothing from "Otra experiencia" is lost) */
function CercaniasCard() {
  const { t, lang } = useLang()
  return (
    <div className="mx-auto mt-8 max-w-[760px] px-5 sm:px-6 lg:max-w-[1440px] lg:px-16">
      <article data-glow className="card glow-card grid gap-5 border-dashed p-5 sm:p-6 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-8" style={{ ['--lc' as string]: 'var(--cer)' } as CSSProperties}>
        <h3 className="flex items-center gap-2.5">
          <span className="line-badge h-[28px] min-w-[28px] text-[14px]" style={{ ['--lc' as string]: 'var(--cer)' } as CSSProperties}>C</span>
          <span className="font-sign text-[22px] font-bold leading-tight">
            {t('experience.other')}
            <span className="block text-[14px] font-semibold text-ink-3">{t('journey.cer_note')}</span>
          </span>
        </h3>
        <div>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{CERCANIAS.leroy.role[lang]}</span>
            <span className="rounded-full border border-rule px-2.5 py-0.5 text-[13px] font-medium text-ink-2">{CERCANIAS.leroy.when[lang]}</span>
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{CERCANIAS.leroy.body[lang]}</p>
        </div>
        <div>
          <p className="font-semibold text-ink">{t('exp.prev.role')}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{CERCANIAS.earlier[lang]}</p>
        </div>
      </article>
    </div>
  )
}

export function Journey() {
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
  const pinned = wide && !reduce
  return (
    <section id="trayectoria" className={`relative ${pinned ? 'pt-6' : 'py-20'}`}>
      {pinned ? <PinnedJourney /> : <VerticalJourney />}
      <CercaniasCard />
    </section>
  )
}
