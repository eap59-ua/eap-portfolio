import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Award } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { TechTag } from '../ui/TechTag'
import { Button } from '../ui/Button'
import { GitHubIcon } from '../ui/icons'
import { MediaFrame } from '../projects/MediaFrame'
import { PROJECTS, type Project } from '../../data/projects'
import { SITE } from '../../lib/site'
import { cn } from '../../lib/utils'

export function Projects() {
  const { t } = useTranslation()
  const hero = PROJECTS.find((p) => p.hero) ?? PROJECTS[0]
  const rest = PROJECTS.filter((p) => p !== hero)

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow={t('projects.eyebrow')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />

        <Reveal className="mt-16">
          <FeaturedProject project={hero} />
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 2) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Button href={SITE.github} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
            <GitHubIcon className="h-4 w-4" />
            {t('projects.more')}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const { t } = useTranslation()
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium',
        status === 'active'
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
          : 'border-accent/30 bg-accent/10 text-accent',
      )}
    >
      {t(status === 'active' ? 'projects.active' : 'projects.done')}
    </span>
  )
}

function ProjectLinks({ project }: { project: Project }) {
  const { t } = useTranslation()
  return (
    <div className="ml-auto flex items-center gap-4">
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <GitHubIcon className="h-4 w-4" />
        {t('projects.code')}
      </a>
      <Link
        to={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-violet"
      >
        {t('projects.casestudy')}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const { t } = useTranslation()
  const Icon = project.icon
  const title = project.titleKey ? t(project.titleKey) : project.title
  const footnote = project.footnoteKey ? t(project.footnoteKey) : project.footnote

  return (
    <article data-glow className="card-surface card-hover glow-card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="order-2 flex flex-col p-7 lg:order-1 lg:p-9">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Icon className={cn('h-5 w-5', project.iconColor)} />
            <span className="font-mono text-xs text-slate-400">{project.context}</span>
            <StatusBadge status={project.status} />
            {project.highlight && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-200">
                <Award className="h-3.5 w-3.5" />
                {project.highlight}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">{title}</h3>
          <RichText html={t(project.descKey)} className="mt-3 text-sm leading-relaxed text-slate-300" />

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechTag key={tag.label} label={tag.label} tone={tag.tone} />
            ))}
          </div>

          <div className="mt-6 flex items-center border-t border-line pt-4">
            {footnote && <span className="font-mono text-xs text-slate-400">{footnote}</span>}
            <ProjectLinks project={project} />
          </div>
        </div>

        <div className="order-1 flex items-center p-5 lg:order-2 lg:p-6">
          <MediaFrame src={project.video} poster={project.poster} className="w-full" />
        </div>
      </div>
    </article>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation()
  const Icon = project.icon
  const title = project.titleKey ? t(project.titleKey) : project.title
  const footnote = project.footnoteKey ? t(project.footnoteKey) : project.footnote

  return (
    <article data-glow data-tilt className="card-surface glow-card tilt-card flex h-full flex-col p-7">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Icon className={cn('h-5 w-5', project.iconColor)} />
            <span className="font-mono text-xs text-slate-400">{project.context}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <RichText html={t(project.descKey)} className="mb-5 text-sm leading-relaxed text-slate-300" />

      <div className="mb-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <TechTag key={tag.label} label={tag.label} tone={tag.tone} />
        ))}
      </div>

      <div className="mt-auto flex items-center border-t border-line pt-4">
        {footnote && <span className="font-mono text-xs text-slate-400">{footnote}</span>}
        <ProjectLinks project={project} />
      </div>
    </article>
  )
}
