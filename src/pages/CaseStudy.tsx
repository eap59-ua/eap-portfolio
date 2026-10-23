import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Award, Check } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import { CASE_STUDIES } from '../data/caseStudies'
import { EVIDENCE, PROJECT_LINE } from '../data/lines'
import { MEDIA, MEDIA_EXTRA } from '../data/media'
import { TechLogo } from '../data/techIcons'
import { VideoPlayer } from '../components/metro/VideoPlayer'
import { CodeButton, LineBadge } from '../components/metro/buttons'
import { NotFound } from './NotFound'

const SECTIONS = ['problem', 'role', 'architecture', 'decisions', 'challenges', 'results', 'stack'] as const

// The case study is the line's platform: same colour, same station grammar.
export function CaseStudy() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const project = PROJECTS.find((p) => p.slug === slug)
  const study = slug ? CASE_STUDIES[slug] : undefined
  const [current, setCurrent] = useState<string>(SECTIONS[0])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setCurrent(e.target.id.replace('cs-', ''))
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(`cs-${s}`)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [slug])

  if (!project || !study) return <NotFound />

  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const c = study[lang]
  const L = PROJECT_LINE[project.slug]
  const lc = { ['--lc' as string]: `var(--${L.line})` } as CSSProperties
  const title = project.titleKey ? t(project.titleKey) : project.title
  const withStudy = PROJECTS.filter((p) => p.caseStudy !== false)
  const next = withStudy[(withStudy.findIndex((p) => p.slug === slug) + 1) % withStudy.length]
  const nextL = PROJECT_LINE[next.slug]
  const nextTitle = next.titleKey ? t(next.titleKey) : next.title
  const media = MEDIA[project.slug]
  const extra = MEDIA_EXTRA[project.slug] ?? []
  const accent = `var(--${L.line})`

  return (
    <article className="relative pb-24 pt-[calc(var(--bar-h)+28px)]" style={lc}>
      <title>{`${title} · Erardo Aldana Pessoa`}</title>
      <meta name="description" content={c.oneLiner} />
      <meta property="og:title" content={`${title} · Erardo Aldana Pessoa`} />
      <meta property="og:description" content={c.oneLiner} />
      <meta property="og:type" content="article" />

      {/* the platform edge, in the line's colour */}
      <div className="absolute inset-x-0 top-[var(--bar-h)] h-[6px]" style={L.dashed ? { backgroundImage: `repeating-linear-gradient(90deg, var(--${L.line}) 0 18px, transparent 18px 28px)` } : { background: `var(--${L.line})` }} aria-hidden="true" />

      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10">
        <Link to={`/#proyecto-${project.slug}`} className="inline-flex items-center gap-2 font-sign text-[16px] font-semibold text-ink-2 hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('cs.back')}
        </Link>

        <header className={`mt-6 grid gap-8 ${media?.portrait ? 'md:grid-cols-[minmax(0,1fr)_auto] md:items-start' : ''}`}>
          <div>
            <p className="flex flex-wrap items-center gap-2.5">
              <LineBadge line={L.line} n={`L${L.n}`} dark={L.dark} />
              <span className="sign-label text-[15px] text-ink-3">{t(project.contextKey)}</span>
              {project.status === 'active' && <span className="rounded-full border-2 px-2.5 py-0.5 font-sign text-sm font-bold" style={{ borderColor: `var(--${L.line})` }}>{t('projects.active')}</span>}
              {project.highlightKey && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e3c169] bg-[#fdf5df] px-2.5 py-0.5 text-[13px] font-semibold text-[#6f5300]">
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(project.highlightKey)}
                </span>
              )}
            </p>
            <h1 className="sign-type mt-4 text-[clamp(3rem,7vw,5rem)]" style={{ viewTransitionName: `vt-${project.slug}` } as CSSProperties}>
              {title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-[19px] leading-relaxed text-ink-2">{c.oneLiner}</p>
            <div className="mt-6">
              <CodeButton href={project.repo} line={L.line} label={`${t('cs.repo')} — ${title} (GitHub)`}>
                {t('cs.repo')}
              </CodeButton>
            </div>
            {/* beside the phone: what the project proves and its main stack, straight from the data (no new copy) */}
            {media?.portrait && (
              <div className="mt-10 max-w-[560px] space-y-6 border-t border-dashed border-rule pt-6">
                <div>
                  <p className="sign-label text-[14px] text-ink-3">{t('projects.evidence')}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {(EVIDENCE[project.slug] ?? []).map((ev) => (
                      <li key={ev.es} className="inline-flex h-8 items-center gap-2 rounded-full border border-rule bg-paper-card px-3 text-[14px] font-medium text-ink-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: `var(--${L.line})` }} aria-hidden="true" />
                        {ev[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="sign-label text-[14px] text-ink-3">{t('cs.stack')}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {[...study.diagram.pipeline, ...study.diagram.aside].map((s) => (
                      <li key={s} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rule bg-paper-card px-3 text-[14px] font-medium text-ink-2">
                        <TechLogo label={s} mono className="h-3.5 w-3.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {media?.portrait && (
            <figure>
              <VideoPlayer media={media} title={title} label={t('player.ecoPhone')} accent={accent} dark={L.dark} />
              <figcaption className="sign-label mt-3 text-center text-[14px] text-ink-3">{t('player.ecoPhone')}</figcaption>
            </figure>
          )}
        </header>
        {media && !media.portrait && (
          <div className="mt-10">
            <VideoPlayer media={media} title={title} accent={accent} dark={L.dark} />
          </div>
        )}
        {extra.map((x) => (
          <figure key={x.media.src} className="mt-10">
            <VideoPlayer media={x.media} title={title} label={t(x.labelKey)} accent={accent} dark={L.dark} />
            <figcaption className="sign-label mt-3 text-[14px] text-ink-3">{t(x.labelKey)}</figcaption>
          </figure>
        ))}

        <div className="mt-14 grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* the platform's own little line: one station per section */}
          <nav aria-label={t('cs.index')} className="hidden lg:block">
            <ol className="sticky top-[calc(var(--bar-h)+32px)] flex flex-col">
              {SECTIONS.map((s, i) => (
                <li key={s} className="relative pb-5 pl-7 last:pb-0">
                  {i < SECTIONS.length - 1 && <span className="absolute left-[7px] top-3 h-full w-[4px]" style={{ background: `var(--${L.line})` }} aria-hidden="true" />}
                  <span
                    className="absolute left-0 top-[3px] h-[18px] w-[18px] rounded-full border-4 transition-colors duration-200"
                    style={{ borderColor: `var(--${L.line})`, background: s === current ? `var(--${L.line})` : 'var(--card)' }}
                    aria-hidden="true"
                  />
                  <a href={`#cs-${s}`} aria-current={s === current ? 'location' : undefined} className={`font-sign text-[17px] font-semibold transition-colors ${s === current ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}>
                    {t(`cs.${s}`)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Section id="problem" label={t('cs.problem')}>
              <p>{c.problem}</p>
            </Section>
            <Section id="role" label={t('cs.role')}>
              <p>{c.role}</p>
            </Section>
            <Section id="architecture" label={t('cs.architecture')}>
              <p>{c.architecture}</p>
              {/* request path as stations; the supporting pieces as sidings */}
              <div data-glow className="card glow-card mt-6 p-5" style={lc}>
                <ol className="flex flex-wrap items-center gap-y-3">
                  {study.diagram.pipeline.map((node, i) => (
                    <li key={node} className="flex items-center">
                      {i > 0 && <span className="mx-1 h-[6px] w-8 rounded-full" style={{ background: `var(--${L.line})` }} aria-hidden="true" />}
                      <span className="rounded-lg border-2 bg-paper-card px-3 py-1.5 font-sign text-[17px] font-bold text-ink" style={{ borderColor: `var(--${L.line})` }}>
                        {node}
                      </span>
                    </li>
                  ))}
                </ol>
                <ul className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-rule pt-4">
                  {study.diagram.aside.map((a) => (
                    <li key={a} className="rounded-full border border-rule px-2.5 py-1 text-[13.5px] font-medium text-ink-2">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="sign-label mt-8 text-[14px] text-ink-3">{t('cs.flow')}</h3>
              <ol className="mt-3 space-y-3">
                {c.flow.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-sign text-[14px] font-bold text-paper" style={{ background: `var(--${L.line})`, color: L.dark ? '#16181d' : undefined }}>
                      {i + 1}
                    </span>
                    <span className="text-[16px] leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
            <Section id="decisions" label={t('cs.decisions')}>
              <div className="space-y-3">
                {c.decisions.map((d, i) => (
                  <div key={i} data-glow className="card glow-card p-5" style={lc}>
                    <p className="font-semibold text-ink">{d.decision}</p>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-2">{d.why}</p>
                  </div>
                ))}
              </div>
            </Section>
            <Section id="challenges" label={t('cs.challenges')}>
              <ul className="space-y-3">
                {c.challenges.map((ch, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-sm" style={{ background: `var(--${L.line})` }} aria-hidden="true" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section id="results" label={t('cs.results')}>
              <ul className="space-y-3">
                {c.results.map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: `var(--${L.line})` }} aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section id="stack" label={t('cs.stack')}>
              <ul className="flex flex-wrap gap-2">
                {study.stack.map((s) => (
                  <li key={s} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rule bg-paper-card px-3 text-[14px] font-medium text-ink-2">
                    <TechLogo label={s} mono className="h-3.5 w-3.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </Section>

            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
              <Link to={`/#proyecto-${project.slug}`} viewTransition className="inline-flex items-center gap-2 font-sign text-[16px] font-semibold text-ink-2 hover:text-ink">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t('cs.back')}
              </Link>
              <Link to={`/projects/${next.slug}`} viewTransition className="inline-flex items-center gap-2.5 font-sign text-[17px] font-semibold text-ink hover:underline">
                <span className="text-ink-3">{t('cs.next')}:</span>
                <LineBadge line={nextL.line} n={`L${nextL.n}`} dark={nextL.dark} className="h-[26px] min-w-[26px] text-[13px]" />
                {nextTitle}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={`cs-${id}`} className="mt-12 scroll-mt-[calc(var(--bar-h)+24px)] text-[17px] leading-[1.7] text-ink-2 first:mt-0">
      <h2 className="sign-type mb-4 text-[clamp(1.9rem,3vw,2.4rem)]">{label}</h2>
      {children}
    </section>
  )
}
