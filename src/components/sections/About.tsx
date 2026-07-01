import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Code2, Sparkles } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { RichText } from '../ui/RichText'
import { GitHubIcon, LinkedInIcon } from '../ui/icons'
import { SITE } from '../../lib/site'

export function About() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const bioRef = useRef<HTMLDivElement>(null)

  // cascade the bio lines in as the section scrolls into view
  useEffect(() => {
    if (reduce) return
    const root = bioRef.current
    if (!root) return
    let killed = false
    let io: IntersectionObserver | null = null
    void (async () => {
      const mod = await import('gsap')
      if (killed) return
      const gsap = mod.gsap ?? mod.default
      const lines = root.querySelectorAll('.about-line')
      gsap.set(lines, { opacity: 0, y: 16 })
      io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          io?.disconnect()
          gsap.to(lines, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'transform',
          })
        },
        { threshold: 0.2 },
      )
      io.observe(root)
    })()
    return () => {
      killed = true
      if (io) io.disconnect()
    }
  }, [reduce])

  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div
              data-tilt
              className="card-surface tilt-card relative mx-auto aspect-[4/5] max-w-sm overflow-hidden"
            >
              <img
                src="/profile.jpg"
                alt={SITE.name}
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink-900/60 via-transparent to-accent-strong/10" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div ref={bioRef} data-glow data-tilt className="card-surface glow-card tilt-card p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs font-semibold tracking-wide text-emerald-300">
                  {t('about.status')}
                </span>
              </div>

              <h3 className="about-line mb-5 text-2xl font-bold text-white sm:text-3xl">
                {t('about.greeting')} <span className="inline-block">👋</span>
              </h3>

              <div className="space-y-4 leading-relaxed text-slate-300">
                <RichText html={t('about.p1')} className="about-line" />
                <RichText html={t('about.p2')} className="about-line" />
                <RichText html={t('about.p3')} className="about-line" />
              </div>

              <p className="about-line mt-5 flex items-start gap-2 border-l-2 border-accent/40 pl-3 text-sm italic text-slate-400">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                {t('about.grit')}
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <SocialPill index={0} href={SITE.linkedin} label="LinkedIn">
                  <LinkedInIcon className="h-4 w-4" />
                </SocialPill>
                <SocialPill index={1} href={SITE.github} label="GitHub">
                  <GitHubIcon className="h-4 w-4" />
                </SocialPill>
                <SocialPill index={2} href={`mailto:${SITE.email}`} label="Email" external={false}>
                  <Mail className="h-4 w-4" />
                </SocialPill>
                <SocialPill index={3} href={SITE.repo} label={t('about.source')}>
                  <Code2 className="h-4 w-4" />
                </SocialPill>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SocialPill({
  href,
  label,
  children,
  external = true,
  index = 0,
}: {
  href: string
  label: string
  children: ReactNode
  external?: boolean
  index?: number
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{ animationDelay: `${index * 0.5}s` }}
      className="inline-flex animate-float-soft items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200 transition-colors hover:border-accent hover:text-white motion-reduce:animate-none"
    >
      {children}
      {label}
    </a>
  )
}
