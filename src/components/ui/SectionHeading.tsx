import { Reveal } from '../motion/Reveal'
import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <Reveal className={cn('flex flex-col gap-4', centered ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tightest text-white sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      <span
        className={cn('h-1 w-16 rounded-full bg-gradient-to-r from-accent to-accent-violet', centered && 'mx-auto')}
        aria-hidden="true"
      />
      {subtitle && (
        <p className={cn('max-w-2xl text-base leading-relaxed text-slate-400', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
