import type { ComponentType } from 'react'

// The case-study page is its own chunk. Once fetched, the route renders it directly
// (no Suspense round trip), so a View Transition can capture the new page at once.
let loaded: ComponentType | null = null

export const loadedCaseStudy = () => loaded
export const loadCaseStudy = () =>
  import('../pages/CaseStudy').then((m) => {
    loaded = m.CaseStudy
    return m.CaseStudy
  })
