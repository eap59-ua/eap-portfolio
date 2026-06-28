import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Check, Award } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import { CASE_STUDIES } from '../data/caseStudies'
import { ArchitectureDiagram } from '../components/projects/ArchitectureDiagram'
import { MediaFrame } from '../components/projects/MediaFrame'
import { TechTag } from '../components/ui/TechTag'
import { Button } from '../components/ui/Button'
import { GitHubIcon } from '../components/ui/icons'
import { NotFound } from './NotFound'
import { cn } from '../lib/utils'

export function CaseStudy() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const project = PROJECTS.find((p) => p.slug === slug)
  const study = slug ? CASE_STUDIES[slug] : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project || !study) return <NotFound />

  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const c = study[lang]
  const title = project.titleKey ? t(project.titleKey) : project.title
  const Icon = project.icon
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const nextTitle = next.titleKey ? t(next.titleKey) : next.title

  return (
    <article className="relative pt-28">
      <title>{`${title} · Erardo Aldana Pessoa`}</title>
      <meta name="description" content={c.oneLiner} />
      <meta property="og:title" content={`${title} · Erardo Aldana Pessoa`} />
      <meta property="og:description" content={c.oneLiner} />
      <meta property="og:type" content="article" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-accent-strong/10 to-transparent"
      />

      <div className="container max-w-3xl pb-24">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('cs.back')}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <Icon className={cn('h-5 w-5', project.iconColor)} />
            <span className="font-mono text-sm text-slate-500">{project.context}</span>
            <span
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                project.status === 'active'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-accent/30 bg-accent/10 text-accent',
              )}
            >
              {t(project.status === 'active' ? 'projects.active' : 'projects.done')}
            </span>
            {project.highlight && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-200">
                <Award className="h-3.5 w-3.5" />
                {project.highlight}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tightest text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{c.oneLiner}</p>

          <div className="mt-6">
            <Button href={project.repo} target="_blank" rel="noopener noreferrer" variant="outline">
              <GitHubIcon className="h-4 w-4" />
              {t('cs.repo')}
            </Button>
          </div>
        </header>

        <div className="mt-10">
          <MediaFrame className="w-full" />
        </div>

        <Section label={t('cs.problem')}>
          <p className="leading-relaxed text-slate-300">{c.problem}</p>
        </Section>

        <Section label={t('cs.role')}>
          <p className="leading-relaxed text-slate-300">{c.role}</p>
        </Section>

        <Section label={t('cs.architecture')}>
          <p className="mb-6 leading-relaxed text-slate-300">{c.architecture}</p>
          <ArchitectureDiagram pipeline={study.diagram.pipeline} aside={study.diagram.aside} />
          <ol className="mt-6 space-y-3">
            {c.flow.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-line bg-white/[0.03] font-mono text-xs text-accent">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section label={t('cs.decisions')}>
          <div className="space-y-4">
            {c.decisions.map((d, i) => (
              <div key={i} className="card-surface p-5">
                <div className="font-semibold text-white">{d.decision}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{d.why}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label={t('cs.challenges')}>
          <ul className="space-y-3">
            {c.challenges.map((ch, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line bg-white/[0.02] p-4">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span className="text-sm leading-relaxed text-slate-300">{ch}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label={t('cs.results')}>
          <ul className="space-y-3">
            {c.results.map((r, i) => (
              <li key={i} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span className="text-sm leading-relaxed text-slate-300">{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label={t('cs.stack')}>
          <div className="flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <TechTag key={s} label={s} />
            ))}
          </div>
        </Section>

        <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('cs.back')}
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            className="inline-flex items-center gap-1.5 text-right text-sm font-semibold text-accent transition-colors hover:text-accent-violet"
          >
            <span className="text-slate-500">{t('cs.next')}:</span> {nextTitle}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
        <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
        {label}
      </h2>
      {children}
    </section>
  )
}
