import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Award, ChevronDown } from 'lucide-react'
import { PROJECTS, type Project } from '../../data/projects'
import { EVIDENCE, PROJECT_LINE } from '../../data/lines'
import { RichText } from '../ui/RichText'
import { StationTrack } from './StationTrack'
import { CaseButton, CodeButton, LineBadge } from './buttons'
import { useReducedMotion } from '../../lib/motion'

// web-sized media (re-encoded ≤1.5 MB, posters for all; EcoAlerta is a phone app → portrait)
const MEDIA: Record<string, { src: string; poster: string; portrait?: boolean; captions?: string }> = {
  ecoalerta: { src: '/media/ecoalerta-phone.mp4', poster: '/media/ecoalerta-phone-poster.jpg', portrait: true, captions: '/media/ecoalerta-demo.es.vtt' },
  'food-donation': { src: '/media/food-donation-web.mp4', poster: '/media/food-donation-poster.webp' },
  hydrofulness: { src: '/media/hydrofulness-web.mp4', poster: '/media/hydrofulness-poster.webp' },
  easycab: { src: '/media/easycab-web.mp4', poster: '/media/easycab-poster.webp' },
}

function useT() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? ('en' as const) : ('es' as const)
  return { t, lang }
}

/** plays muted while on screen; never with reduced motion (poster + controls instead) */
function DemoVideo({ slug, title }: { slug: string; title: string }) {
  const m = MEDIA[slug]
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])
  if (!m) return null
  const video = (
    <video
      ref={ref}
      className={m.portrait ? 'h-full w-full rounded-[22px] object-cover' : 'aspect-video w-full rounded-xl object-cover'}
      src={m.src}
      poster={m.poster}
      muted
      loop
      playsInline
      preload="none"
      controls={reduce}
      aria-label={title}
      width={m.portrait ? 360 : 1280}
      height={m.portrait ? 754 : 720}
    >
      {m.captions && <track kind="descriptions" srcLang="es" src={m.captions} default />}
    </video>
  )
  return m.portrait ? (
    <div className="mx-auto aspect-[230/480] w-[min(190px,50vw)] rounded-[30px] bg-ink p-[9px] shadow-[0_18px_40px_-24px_rgba(22,24,29,.6)] md:w-[210px]">{video}</div>
  ) : (
    <div className="rounded-2xl bg-ink p-2 md:w-[340px]">{video}</div>
  )
}

/** compact: inside the mobile accordion, whose row already shows badge, title and context */
function Platform({ p, compact }: { p: Project; compact?: boolean }) {
  const { t, lang } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  const media = MEDIA[p.slug]
  return (
    // text left, media right (phone or 16:9); route + actions span the width below
    <div className="grid h-full gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[1fr_auto]">
      {media && (
        <div className="md:col-start-2 md:row-start-1">
          <DemoVideo slug={p.slug} title={`${title} — demo`} />
        </div>
      )}
      <div className="min-w-0 md:col-start-1 md:row-start-1">
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
        <RichText html={t(p.descKey)} className="mt-3 first:mt-0 max-w-[60ch] text-[16.5px] leading-relaxed text-ink-2" />
        <p className="sign-label mt-5 text-sm text-ink-3">{t('projects.evidence')}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {(EVIDENCE[p.slug] ?? []).map((ev) => (
            <li key={ev.es} className="inline-flex h-8 items-center gap-2 rounded-full border border-rule bg-paper-card px-3 text-[14px] font-medium text-ink-2">
              <span className="h-2 w-2 rounded-full" style={{ background: `var(--${L.line})` }} />
              {ev[lang]}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2 md:self-end">
        <p className="sign-label text-sm text-ink-3">{t('projects.route')}</p>
        <div className="mt-3 pr-2">
          <StationTrack stops={p.tags.map((x) => x.label)} line={L.line} dashed={L.dashed} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CodeButton href={p.repo} line={L.line} label={`${t('projects.code')} — ${title} (GitHub)`}>
            {t('projects.code')}
          </CodeButton>
          {p.caseStudy !== false && (
            <CaseButton to={`/projects/${p.slug}`} line={L.line} dark={L.dark} label={`${t('projects.casestudy')} — ${title}`}>
              {t('projects.casestudy')}
            </CaseButton>
          )}
        </div>
      </div>
    </div>
  )
}

function RowHead({ p, on }: { p: Project; on: boolean }) {
  const { t, lang } = useT()
  const L = PROJECT_LINE[p.slug]
  const title = p.titleKey ? t(p.titleKey) : p.title
  const value = (EVIDENCE[p.slug]?.[0]?.[lang] ?? '') + ' · ' + p.tags.slice(0, 3).map((x) => x.label).join(' · ')
  return (
    <>
      <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} className="flex-shrink-0" />
      <span className="min-w-0 flex-1 text-left">
        <span className={`block font-sign text-[25px] font-bold leading-tight ${on ? 'text-ink' : 'text-ink-2'}`}>{title}</span>
        <span className="mt-0.5 block text-[13.5px] text-ink-3">{t(p.contextKey)}</span>
        <span className="mt-1 block truncate font-sign text-[15px] font-semibold text-ink-2">{value}</span>
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

  return (
    <section id="proyectos" className="relative scroll-mt-[var(--bar-h)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="sign-type text-[clamp(3.2rem,7vw,4.8rem)]">{t('projects.title')}</h2>
          <p className="max-w-[440px] text-[17px] leading-relaxed text-ink-2">{t('projects.board_sub')}</p>
        </div>

        {/* desktop: board (tabs) + platform */}
        <div className="mt-10 hidden gap-10 lg:grid lg:grid-cols-[470px_1fr]">
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
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  data-glow
                  data-line={L.line}
                  className={`card glow-card flex items-center gap-4 px-[18px] py-3.5 text-left transition-colors duration-200 ${on ? 'is-active' : 'border-transparent bg-transparent hover:bg-paper-card'}`}
                  style={{ ['--lc' as string]: `var(--${L.line})` } as CSSProperties}
                >
                  <RowHead p={p} on={on} />
                </button>
              )
            })}
          </div>
          <div
            id={`anden-${cur.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${cur.slug}`}
            key={cur.slug}
            data-glow
            data-line={curL.line}
            className="card glow-card platform-in min-h-[640px] p-7"
            style={{ ['--lc' as string]: `var(--${curL.line})` } as CSSProperties}
          >
            <Platform p={cur} />
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
