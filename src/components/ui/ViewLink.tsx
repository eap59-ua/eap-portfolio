import type { ComponentProps, MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { loadCaseStudy } from '../../lib/caseStudyChunk'

type VTDocument = Document & { startViewTransition?: (update: () => void) => unknown }

// <Link> with a View Transition (card title → case-study heading). react-router only
// starts one under a data router; this app keeps <BrowserRouter> (the prerender renders
// the same tree under a StaticRouter), so the transition is started here. A case study's
// chunk is fetched first, so the new page is ready inside the transition, not a spinner.
export function ViewLink({ to, onClick, ...rest }: ComponentProps<typeof Link>) {
  const navigate = useNavigate()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    const doc = document as VTDocument
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    const ready = typeof to === 'string' && to.startsWith('/projects/') ? loadCaseStudy() : Promise.resolve()
    void ready.then(() => doc.startViewTransition!(() => flushSync(() => navigate(to))))
  }
  return <Link to={to} onClick={handle} {...rest} />
}
