import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'

// vercel.json's Content-Security-Policy allows index.html's inline scripts by hash only:
// editing one of them without updating the hash would silently break it in production.
describe('Content-Security-Policy', () => {
  const html = readFileSync('index.html', 'utf8')
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }
  const csp = vercel.headers.flatMap((r) => r.headers).find((h) => h.key === 'Content-Security-Policy')?.value ?? ''
  // executable inline scripts only: JSON-LD is a data block, never run, so CSP doesn't apply
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/ld\+json/.test(m[1]))

  it('every inline script has its sha256 in script-src', () => {
    expect(inline.length).toBeGreaterThan(0)
    for (const m of inline) {
      // Vercel builds on Linux from the LF copy in git
      const hash = createHash('sha256').update(m[2].replace(/\r\n/g, '\n')).digest('base64')
      expect(csp).toContain(`'sha256-${hash}'`)
    }
  })

  it('no unsafe-inline / unsafe-eval for scripts', () => {
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? ''
    expect(scriptSrc).not.toMatch(/unsafe-(inline|eval)/)
  })
})
