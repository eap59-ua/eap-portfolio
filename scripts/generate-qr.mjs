// Generates the LinkedIn QR printed on the back of the "abono" (Sobre mí).
// Static SVG, no runtime QR library. Run after changing SITE.linkedin:
//   node scripts/generate-qr.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// single source of truth: src/lib/site.ts
const site = readFileSync(resolve(root, 'src/lib/site.ts'), 'utf8')
const url = site.match(/linkedin:\s*'([^']+)'/)?.[1]
if (!url) throw new Error('SITE.linkedin not found in src/lib/site.ts')

const svg = await QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'Q', // survives the holo sheen / a slightly dirty screen
  margin: 4, // quiet zone: 4 modules, as the spec asks
  color: { dark: '#16181dff', light: '#ffffffff' }, // fixed: scanners need dark-on-light in both themes
})

const out = resolve(root, 'public/abono/qr-linkedin.svg')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, svg) // qrcode already sets shape-rendering=crispEdges
console.log(`QR → ${out}\n   ${url}`)
