import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Award } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { TechTag } from '../ui/TechTag'
import { Button } from '../ui/Button'
import { GitHubIcon } from '../ui/icons'
import { Magnetic } from '../motion/Magnetic'
import { MediaFrame } from '../projects/MediaFrame'
import { PROJECTS, type Project } from '../../data/projects'
import { SITE } from '../../lib/site'
import { cn } from '../../lib/utils'

// per-project hover glow — the lit border + ambient halo take the project's own colour
const GLOW: Record<string, { a: string; b: string; shadow: string }> = {
  ecoalerta: { a: '#34d399', b: '#10b981', shadow: 'rgba(16,185,129,0.5)' },
  hydrofulness: { a: '#38bdf8', b: '#0ea5e9', shadow: 'rgba(14,165,233,0.5)' },
  'food-donation': { a: '#f0abfc', b: '#e879f9', shadow: 'rgba(232,121,249,0.45)' },
  studysync: { a: '#a78bfa', b: '#818cf8', shadow: 'rgba(129,140,248,0.5)' },
  easycab: { a: '#fbbf24', b: '#f59e0b', shadow: 'rgba(245,158,11,0.5)' },
}

function glowStyle(slug: string): CSSProperties {
  const g = GLOW[slug] ?? { a: '#a78bfa', b: '#818cf8', shadow: 'rgba(99,102,241,0.5)' }
  return { '--glow-a': g.a, '--glow-b': g.b, '--glow-shadow': g.shadow } as CSSProperties
}

export function Projects() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const hero = PROJECTS.find((p) => p.hero) ?? PROJECTS[0]
  const rest = PROJECTS.filter((p) => p !== hero)
  // asymmetric "bento": alternating wide/narrow rows (7+5, then 5+7) on large screens
  const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

  useEffect(() => {
    if (reduce) return
    const root = rootRef.current
    if (!root) return

    let killed = false
    let io: IntersectionObserver | null = null

    void (async () => {
      const mod = await import('gsap')
      if (killed) return
      const gsap = mod.gsap ?? mod.default
      const items = root.querySelectorAll('.proj-reveal')
      gsap.set(items, { opacity: 0, y: 56, scale: 0.94, transformPerspective: 900 })
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            io?.unobserve(entry.target)
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              clearProps: 'transform',
            })
          }
        },
        { threshold: 0.15 },
      )
      items.forEach((item) => io?.observe(item))
    })()

    return () => {
      killed = true
      if (io) io.disconnect()
    }
  }, [reduce])

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow={t('projects.eyebrow')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />

        <div ref={rootRef}>
          <div className="proj-reveal mt-16">
            <FeaturedProject project={hero} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
            {rest.map((project, index) => (
              <div key={project.slug} className={cn('proj-reveal', spans[index])}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
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
  const title = project.titleKey ? t(project.titleKey) : project.title
  return (
    <div className="ml-auto flex items-center gap-4">
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('projects.code')} — ${title} (GitHub)`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <GitHubIcon className="h-4 w-4" />
        {t('projects.code')}
      </a>
      <Magnetic>
        <Link
          to={`/projects/${project.slug}`}
          viewTransition
          aria-label={`${t('projects.casestudy')} — ${title}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/20 hover:text-white group-hover:animate-cta-pulse motion-reduce:group-hover:animate-none"
        >
          {t('projects.casestudy')}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Magnetic>
    </div>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const { t } = useTranslation()
  const Icon = project.icon
  const title = project.titleKey ? t(project.titleKey) : project.title
  const footnote = project.footnoteKey ? t(project.footnoteKey) : project.footnote

  return (
    <article data-glow style={glowStyle(project.slug)} className="card-surface card-hover glow-card glow-tint group overflow-hidden">
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

          <h3
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ viewTransitionName: `vt-${project.slug}` } as CSSProperties}
          >
            {title}
          </h3>
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
          <MediaFrame
            src={project.video}
            poster={project.poster}
            captions={project.captions}
            autoplay
            className="w-full"
          />
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
    <article data-glow data-tilt style={glowStyle(project.slug)} className="card-surface glow-card tilt-card glow-tint group flex h-full flex-col p-7">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Icon className={cn('h-5 w-5', project.iconColor)} />
            <span className="font-mono text-xs text-slate-400">{project.context}</span>
          </div>
          <h3
            className="text-xl font-bold text-white"
            style={{ viewTransitionName: `vt-${project.slug}` } as CSSProperties}
          >
            {title}
          </h3>
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
