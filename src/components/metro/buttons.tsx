import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ViewLink } from '../ui/ViewLink'
import { ArrowUpRight } from 'lucide-react'
import { GitHubIcon } from '../ui/icons'
import { Magnetic } from '../motion/Magnetic'
import { useReducedMotion } from '../../lib/motion'
import type { LineId } from '../../data/lines'

/** adds `is-inviting` once, the first time the element is clearly on screen */
function useInviteOnce<T extends HTMLElement>(ms: number) {
  const ref = useRef<T>(null)
  const [inviting, setInviting] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    let timer = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setInviting(true)
        timer = window.setTimeout(() => setInviting(false), ms)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [reduce, ms])
  return { ref, inviting }
}

// "Ver código": the author's loading-arc button, the arc in the project's line colour.
export function CodeButton({ href, line, label, children }: { href: string; line: LineId; label: string; children?: ReactNode }) {
  const { ref, inviting } = useInviteOnce<HTMLAnchorElement>(4300)
  return (
    <Magnetic>
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        data-cursor="link"
        data-line={line}
        className={`btn code-btn h-11 px-4 text-[15px] ${inviting ? 'is-inviting' : ''}`}
        style={{ ['--lc' as string]: `var(--${line})` } as CSSProperties}
      >
        <span className="code-ring" aria-hidden="true">
          <i />
        </span>
        <GitHubIcon className="h-4 w-4" />
        {children}
      </a>
    </Magnetic>
  )
}

// "Caso de estudio": filled in the line colour; ripples a few times to invite the click.
export function CaseButton({ to, line, dark, label, children }: { to: string; line: LineId; dark?: boolean; label: string; children: ReactNode }) {
  const { ref, inviting } = useInviteOnce<HTMLAnchorElement>(3600)
  return (
    <Magnetic>
      <ViewLink
        ref={ref}
        to={to}
        aria-label={label}
        data-cursor="link"
        data-line={line}
        data-dark={dark ? '' : undefined}
        className={`btn case-btn h-11 px-4 text-[15px] ${inviting ? 'is-inviting' : ''}`}
        style={{ ['--lc' as string]: `var(--${line})` } as CSSProperties}
      >
        {children}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </ViewLink>
    </Magnetic>
  )
}

export function LineBadge({ line, n, dark, className = '' }: { line: LineId; n: string | number; dark?: boolean; className?: string }) {
  return (
    <span className={`line-badge ${className}`} style={{ ['--lc' as string]: `var(--${line})` } as CSSProperties} data-dark={dark ? '' : undefined}>
      {n}
    </span>
  )
}
