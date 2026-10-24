import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Award, ChevronDown } from 'lucide-react'
import { PROJECTS, type Project } from '../../data/projects'
import { EVIDENCE, PROJECT_LINE } from '../../data/lines'
import { RichText } from '../ui/RichText'
import { StationTrack } from './StationTrack'
import { CaseButton, CodeButton, LineBadge } from './buttons'
import { DemoVideo } from './DemoVideo'
import { MEDIA } from '../../data/media'
import './board.css'

function useT() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? ('en' as const) : ('es' as const)
  return { t, lang }
}

/** the platform's pieces, shared by the default layout and the ?board=a|b prototypes */
function Head({ p, compact }: { p: Project; compact?: boolean }) {
  const { t } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  return (
    <>
      <div className={`flex flex-wrap items-center gap-2.5 ${compact && !p.highlightKey ? 'hidden' : ''}`}>
        {!compact && <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} />}
        {!compact && <span className="sign-label text-[15px] text-ink-3">{t(p.contextKey)}</span>}
        {p.highlightKey && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e3c169] bg-[#fdf5df] px-2.5 py-0.5 text-[13px] font-semibold text-[#6f5300]">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            {t(p.highlightKey)}
          </span>
        )}
      </div>
      {!compact && (
        <h3 className="sign-type mt-3 text-[clamp(2.2rem,3.2vw,3rem)]" style={{ viewTransitionName: `vt-${p.slug}` } as CSSProperties}>
          {title}
        </h3>
      )}
    </>
  )
}

function Desc({ p }: { p: Project }) {
  const { t } = useT()
  return <RichText html={t(p.descKey)} className="mt-3 first:mt-0 max-w-[60ch] text-[16.5px] leading-relaxed text-ink-2" />
}

function Evidence({ p, className = 'mt-5' }: { p: Project; className?: string }) {
  const { t, lang } = useT()
  const L = PROJECT_LINE[p.slug]
  return (
    <div className={className}>
      <p className="sign-label text-sm text-ink-3">{t('projects.evidence')}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {(EVIDENCE[p.slug] ?? []).map((ev) => (
          <li key={ev.es} className="inline-flex h-8 items-center gap-2 rounded-full border border-rule bg-paper-card px-3 text-[14px] font-medium text-ink-2">
            <span className="h-2 w-2 rounded-full" style={{ background: `var(--${L.line})` }} />
            {ev[lang]}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Route({ p }: { p: Project }) {
  const { t } = useT()
  const L = PROJECT_LINE[p.slug]
  return (
    <>
      <p className="sign-label text-sm text-ink-3">{t('projects.route')}</p>
      <div className="mt-3 pr-2">
        <StationTrack stops={p.tags.map((x) => x.label)} line={L.line} dashed={L.dashed} />
        {/* the drawn track is decorative; the same stops, for screen readers */}
        <ul className="sr-only">
          {p.tags.map((x) => (
            <li key={x.label}>{x.label}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

function Actions({ p, className = 'mt-4' }: { p: Project; className?: string }) {
  const { t } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <CodeButton href={p.repo} line={L.line} label={`${t('projects.code')} — ${title} (GitHub)`}>
        {t('projects.code')}
      </CodeButton>
      {p.caseStudy !== false && (
        <CaseButton to={`/projects/${p.slug}`} line={L.line} dark={L.dark} label={`${t('projects.casestudy')} — ${title}`}>
          {t('projects.casestudy')}
        </CaseButton>
      )}
    </div>
  )
}

/** compact: inside the mobile accordion, whose row already shows badge, title and context */
function Platform({ p, compact }: { p: Project; compact?: boolean }) {
  const { t } = useT()
  const title = p.titleKey ? t(p.titleKey) : p.title
  const media = MEDIA[p.slug]
  return (
    // text left, media right (phone or 16:9); route + actions span the width below
    <div className="grid content-start gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto]">
      {media && (
        <div className={`order-2 md:order-none md:col-start-2 md:row-start-1 ${media?.portrait ? 'md:row-span-2' : ''}`}>
          <DemoVideo slug={p.slug} title={`${title} — demo`} />
        </div>
      )}
      <div className="order-1 min-w-0 md:order-none md:col-start-1 md:row-start-1">
        <Head p={p} compact={compact} />
        <Desc p={p} />
        <Evidence p={p} />
      </div>
      <div className={`order-3 min-w-0 md:order-none md:row-start-2 ${media?.portrait ? 'md:col-start-1' : 'md:col-span-2'}`}>
        <Route p={p} />
        <Actions p={p} />
      </div>
    </div>
  )
}

// ── ?board=a|b: temporary prototype switch (fase 2b, ronda 4) ─────────────────────────────
// The prerender and the first client render use the default layout; the query is read only
// after hydration (useSyncExternalStore's server snapshot), so hydration never mismatches.
//   a → "llenar": the card keeps the list's height and the media grows into it; buttons at the bottom
//   b → "ficha fija": the card is as tall as its content and sticks below the top bar
type BoardVariant = 'a' | 'b'
const noSubscribe = () => () => {}
const readBoard = (): BoardVariant | null => {
  const q = new URLSearchParams(window.location.search).get('board')
  return q === 'a' || q === 'b' ? q : null
}
const serverBoard = () => null

/** desktop platform for the prototypes; the layout lives in board.css (container queries on the card) */
function PlatformProto({ p, v }: { p: Project; v: BoardVariant }) {
  const { t } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  const media = MEDIA[p.slug]
  const kind = media ? (media.portrait ? 'portrait' : 'landscape') : 'none'
  return (
    <div className={`pf pf-${v} pf--${kind}`}>
      <div className="pf-text min-w-0">
        <Head p={p} />
        <Desc p={p} />
        {v === 'b' && <Evidence p={p} />}
      </div>
      {/* (a): the proofs are their own cell, so they can sit beside the demo and leave it the height */}
      {v === 'a' && <Evidence p={p} className="pf-ev min-w-0" />}
      {media ? (
        <div className="pf-media">
          <DemoVideo slug={p.slug} title={`${title} — demo`} fit />
        </div>
      ) : (
        v === 'a' && (
          // no demo to grow: the space becomes the platform's station sign (decorative, existing data only)
          <div className="pf-media pf-sign" aria-hidden="true" style={{ ['--lc' as string]: `var(--${L.line})` } as CSSProperties}>
            <span className="pf-sign-plate">
              <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} />
              <span className="sign-type">{title}</span>
            </span>
          </div>
        )
      )}
      <div className="pf-route min-w-0">
        <Route p={p} />
      </div>
      <Actions p={p} className="pf-actions" />
    </div>
  )
}

/** ids: on the desktop tabs, so the tab's name is just the title and the rest is its description */
function RowHead({ p, on, ids }: { p: Project; on: boolean; ids?: boolean }) {
  const { t, lang } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  // one proof + the main tech, never the same word twice, at most 4 items
  const first = EVIDENCE[p.slug]?.[0]?.[lang] ?? ''
  const value = [first, ...p.tags.map((x) => x.label).filter((l) => !first.includes(l))].filter(Boolean).slice(0, 4).join(' · ')
  return (
    <>
      <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} className="flex-shrink-0" />
      <span className="min-w-0 flex-1 text-left">
        <span id={ids ? `tt-${p.slug}` : undefined} className={`block font-sign text-[25px] font-bold leading-tight ${on ? 'text-ink' : 'text-ink-2'}`}>
          {title}
        </span>
        <span id={ids ? `td-${p.slug}` : undefined}>
          <span className="mt-0.5 block text-[13.5px] text-ink-3">{t(p.contextKey)}</span>
          <span className="mt-1 line-clamp-2 font-sign text-[15px] font-semibold text-ink-2">{value}</span>
        </span>
      </span>
      {p.status === 'active' && (
        <span className="flex-shrink-0 rounded-full border-2 px-2.5 py-0.5 font-sign text-sm font-bold" style={{ borderColor: `var(--${L.line})`, color: 'var(--ink)' }}>
          {t('projects.active')}
        </span>
      )}
    </>
  )
}

export function ProjectsBoard() {
  const { t } = useT()
  const [sel, setSel] = useState(0)
  const [open, setOpen] = useState<string | null>(PROJECTS[0].slug)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? PROJECTS.length - 1 : null
    if (next === null) return
    e.preventDefault()
    const k = (next + PROJECTS.length) % PROJECTS.length
    setSel(k)
    tabs.current[k]?.focus()
  }
  const cur = PROJECTS[sel]
  const curL = PROJECT_LINE[cur.slug]
  const board = useSyncExternalStore(noSubscribe, readBoard, serverBoard)
  const panel = useRef<HTMLDivElement>(null)
  useStickyTop(panel, board === 'b', cur.slug)

  return (
    <section id="proyectos" className="relative scroll-mt-[var(--bar-h)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="sign-type text-[clamp(3.2rem,7vw,4.8rem)]">{t('projects.title')}</h2>
          <p className="max-w-[440px] text-[17px] leading-relaxed text-ink-2">{t('projects.board_sub')}</p>
        </div>

        {/* desktop: board (tabs) + platform */}
        <div className={`mt-10 hidden gap-10 lg:grid ${board ? `board-grid board-grid--${board}` : 'lg:grid-cols-[470px_1fr]'}`}>
          <div role="tablist" aria-orientation="vertical" aria-label={t('projects.title')} className="flex flex-col gap-2.5">
            {PROJECTS.map((p, i) => {
              const L = PROJECT_LINE[p.slug]
              const on = i === sel
              return (
                <button
                  key={p.slug}
                  ref={(el) => void (tabs.current[i] = el)}
                  id={`tab-${p.slug}`}
                  role="tab"
                  aria-selected={on}
                  aria-controls={`anden-${p.slug}`}
                  aria-labelledby={`tt-${p.slug}`}
                  aria-describedby={`td-${p.slug}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  data-glow
                  data-line={L.line}
                  className={`card glow-card flex items-center gap-4 px-[18px] py-3.5 text-left transition-colors duration-200 ${on ? 'is-active' : 'border-transparent bg-transparent hover:bg-paper-card'}`}
                  style={{ ['--lc' as string]: `var(--${L.line})` } as CSSProperties}
                >
                  <RowHead p={p} on={on} ids />
                </button>
              )
            })}
          </div>
          <div
            id={`anden-${cur.slug}`}
            role="tabpanel"
            aria-labelledby={`tt-${cur.slug}`}
            key={cur.slug}
            ref={panel}
            data-glow
            data-line={curL.line}
            className={`card glow-card platform-in p-7 ${board ? `board-panel board-panel--${board}` : 'min-h-[640px]'}`}
            style={{ ['--lc' as string]: `var(--${curL.line})` } as CSSProperties}
          >
            {board ? <PlatformProto p={cur} v={board} /> : <Platform p={cur} />}
          </div>
        </div>

        {/* phones & tablets: accordion — every project's platform stays in the DOM */}
        <div className="mt-8 flex flex-col gap-3 lg:hidden">
          {PROJECTS.map((p) => {
            const L = PROJECT_LINE[p.slug]
            const isOpen = open === p.slug
            return (
              <div
                key={p.slug}
                id={`proyecto-${p.slug}`}
                data-glow
                data-line={L.line}
                className={`card glow-card ${isOpen ? 'is-active' : ''}`}
                style={{ ['--lc' as string]: `var(--${L.line})` } as CSSProperties}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`m-${p.slug}`}
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3.5"
                >
                  <RowHead p={p} on={isOpen} />
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-ink-3 transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div id={`m-${p.slug}`} hidden={!isOpen} className="border-t border-rule px-4 pb-5 pt-5">
                  <Platform p={p} compact />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* deep links from the map: #proyecto-<slug> selects that line on desktop */}
      <HashSelect onSelect={(slug) => {
        const i = PROJECTS.findIndex((p) => p.slug === slug)
        if (i >= 0) {
          setSel(i)
          setOpen(slug)
        }
      }} />
    </section>
  )
}

/** ?board=b: sticks below the top bar; a card taller than the viewport sticks by its bottom edge
 *  instead (negative top), so its buttons are never stranded below the fold while the list scrolls */
function useStickyTop(ref: RefObject<HTMLDivElement | null>, on: boolean, slug: string) {
  useEffect(() => {
    const el = ref.current
    if (!on || !el) return
    const update = () => {
      const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 72
      const gap = 16
      el.style.setProperty('--stick-top', `${Math.round(Math.min(bar + gap, window.innerHeight - el.offsetHeight - gap))}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref, on, slug])
}

function HashSelect({ onSelect }: { onSelect: (slug: string) => void }) {
  // latest callback without re-running the effect (which would re-apply the hash on every render)
  const cb = useRef(onSelect)
  useEffect(() => {
    cb.current = onSelect
  })
  useEffect(() => {
    const onSelect = (slug: string) => cb.current(slug)
    const apply = () => {
      const m = window.location.hash.match(/^#proyecto-(.+)$/)
      if (m) onSelect(m[1])
    }
    apply()
    window.addEventListener('hashchange', apply)
    // map station links are plain anchors handled by Lenis: listen for clicks too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#proyecto-"]') as HTMLAnchorElement | null
      if (a) onSelect(a.getAttribute('href')!.replace('#proyecto-', ''))
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', apply)
      document.removeEventListener('click', onClick)
    }
  }, [])
  return null
}
