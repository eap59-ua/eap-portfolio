import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PROJECTS } from '../data/projects'
import { CASE_STUDIES } from '../data/caseStudies'

// Projects, case studies and the sitemap are maintained by hand in separate
// files — these checks keep them from drifting apart.
describe('project data integrity', () => {
  const slugs = PROJECTS.map((p) => p.slug)

  it('project slugs are unique', () => {
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every project has a case study and every case study has a project', () => {
    expect(Object.keys(CASE_STUDIES).sort()).toEqual([...slugs].sort())
  })

  it('every case study is complete in both languages', () => {
    for (const [slug, study] of Object.entries(CASE_STUDIES)) {
      for (const lang of ['es', 'en'] as const) {
        const c = study[lang]
        expect(c.problem, `${slug}.${lang}.problem`).toBeTruthy()
        expect(c.decisions.length, `${slug}.${lang}.decisions`).toBeGreaterThan(0)
        expect(c.results.length, `${slug}.${lang}.results`).toBeGreaterThan(0)
      }
    }
  })

  it('the sitemap lists every case-study route', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8')
    for (const slug of slugs) {
      expect(sitemap, `sitemap.xml missing /projects/${slug}`).toContain(`/projects/${slug}`)
    }
  })
})
