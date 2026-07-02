import { describe, expect, it } from 'vitest'
import { es } from '../i18n/es'
import { en } from '../i18n/en'

// The site is bilingual: a key present in one catalogue but not the other
// renders as a raw key (or falls back silently) in production.
describe('i18n catalogues', () => {
  it('ES and EN expose exactly the same keys', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort())
  })

  it('no translation is empty', () => {
    for (const [key, value] of Object.entries(es)) {
      expect(value.trim(), `empty ES translation for "${key}"`).not.toBe('')
    }
    for (const [key, value] of Object.entries(en)) {
      expect(value.trim(), `empty EN translation for "${key}"`).not.toBe('')
    }
  })
})
