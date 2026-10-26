// Link-preview images (Open Graph / Twitter), 1200x630, in the site's metro look (day mode).
// One for the home and one per case study; file names carry OG_VERSION so LinkedIn and
// WhatsApp fetch the new ones instead of their cached previews. Run: npm run og
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { PROJECT_SEO, OG_HOME, ogProject } from './seo-data.mjs'

// the web fonts as TTF (resvg can't read WOFF2); see scripts/og-fonts/README.md
const FONT_DIR = 'scripts/og-fonts'
const fontFiles = readdirSync(FONT_DIR)
  .filter((f) => f.endsWith('.ttf'))
  .map((f) => `${FONT_DIR}/${f}`)

// day tokens (src/index.css :root)
const C = {
  paper: '#f4f1e8',
  card: '#ffffff',
  ink: '#16181d',
  ink2: '#474b53',
  ink3: '#5f646c',
  rule: '#d8d2c2',
  l1: '#4338ca',
  eco: '#1a7d44',
  hydro: '#0b7db5',
  donation: '#d6336c',
  studysync: '#7c3aed',
  easycab: '#f5b700',
  chaos: '#e2552d',
  cer: '#736e64',
}
const SIGN = 'Barlow Condensed'
const BODY = 'Barlow'
const MONO = 'JetBrains Mono'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// naive word-wrap for SVG <text> (SVG has no auto-wrap)
function wrap(text, max) {
  const lines = []
  let line = ''
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim())
      line = w
    } else line = (line + ' ' + w).trim()
  }
  if (line) lines.push(line)
  return lines
}

function render(svg, out) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: BODY },
  })
    .render()
    .asPng()
  writeFileSync(out, png)
  console.log(out, '→', Math.round(png.length / 1024), 'KB')
}

// the "• EAP •" pill from the top bar
const logo = (x, y) => `
  <rect x="${x}" y="${y}" width="118" height="42" rx="21" fill="${C.card}" stroke="${C.ink}" stroke-width="3"/>
  <circle cx="${x + 24}" cy="${y + 21}" r="4.5" fill="${C.l1}"/>
  <circle cx="${x + 94}" cy="${y + 21}" r="4.5" fill="${C.l1}"/>
  <text x="${x + 59}" y="${y + 30}" text-anchor="middle" font-family="${SIGN}" font-size="25" font-weight="700" fill="${C.ink}">EAP</text>`

// a numbered line badge (L2…L7), as on the map
const badge = (cx, cy, r, color, label, dark) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"${dark ? ` stroke="${C.ink}" stroke-width="2.5"` : ''}/>
  <text x="${cx}" y="${cy + r * 0.36}" text-anchor="middle" font-family="${SIGN}" font-size="${Math.round(r * 1.02)}" font-weight="700" fill="${dark ? C.ink : '#ffffff'}">${label}</text>`

// ── home ───────────────────────────────────────────────────────────────────
// right half: a small version of the hero map — L1 runs along the bottom and
// climbs to "Tu equipo"; the project lines branch off it at 45°
function homeMap() {
  const Y = 486 // the trunk
  const branch = (x, top, color, n, dark, dashed) => `
  <path d="M${x} ${Y} V${top + 46} L${x - 34} ${top + 12}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"${dashed ? ' stroke-dasharray="16 11"' : ''}${dark ? '' : ''}/>
  ${badge(x - 42, top + 4, 17, color, n, dark)}`
  return `
  <path d="M736 ${Y + 24} H1092" fill="none" stroke="${C.cer}" stroke-width="5" stroke-dasharray="12 8" stroke-linecap="round"/>
  ${branch(812, 352, C.easycab, '6', true)}
  ${branch(862, 300, C.chaos, '7')}
  ${branch(912, 248, C.hydro, '4')}
  ${branch(962, 196, C.donation, '3')}
  <path d="M1066 300 L1104 262 V170" fill="none" stroke="${C.eco}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  ${badge(1104, 156, 17, C.eco, '2')}
  <path d="M1066 248 L1046 228 V176" fill="none" stroke="${C.studysync}" stroke-width="8" stroke-dasharray="14 10" stroke-linecap="round" stroke-linejoin="round"/>
  ${badge(1046, 162, 15, C.studysync, '5')}
  <path d="M736 ${Y} H1004 L1066 ${Y - 62} V118" fill="none" stroke="${C.l1}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  ${[760, 812, 862, 912, 962]
    .map((x) => `<circle cx="${x}" cy="${Y}" r="9" fill="${C.card}" stroke="${C.l1}" stroke-width="4.5"/>`)
    .join('\n  ')}
  <circle cx="1066" cy="300" r="13" fill="${C.card}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="1059" y="236" width="14" height="14" rx="2" fill="${C.card}" stroke="${C.l1}" stroke-width="4.5"/>
  <circle cx="1066" cy="96" r="17" fill="${C.l1}"/>
  <text x="1040" y="90" text-anchor="end" font-family="${SIGN}" font-size="27" font-weight="700" fill="${C.ink}">Tu equipo</text>
  <text x="1040" y="114" text-anchor="end" font-family="${BODY}" font-size="17" fill="${C.ink3}">próxima estación</text>`
}

const home = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${C.paper}"/>
  ${logo(72, 52)}
  <text x="72" y="156" font-family="${MONO}" font-size="22" font-weight="500" fill="${C.l1}">DESARROLLADOR_FULL_STACK.execute()</text>
  <text x="66" y="266" font-family="${SIGN}" font-size="118" font-weight="700" fill="${C.ink}">Erardo</text>
  <text x="66" y="368" font-family="${SIGN}" font-size="118" font-weight="700" fill="${C.ink}">Aldana Pessoa</text>
  <text x="72" y="422" font-family="${SIGN}" font-size="35" font-weight="600" fill="${C.ink}">Desarrollador Backend (Python) · Full-Stack</text>
  <rect x="72" y="448" width="420" height="50" rx="10" fill="${C.card}" stroke="${C.rule}" stroke-width="2"/>
  <rect x="72" y="448" width="5" height="50" rx="2" fill="${C.l1}"/>
  <circle cx="102" cy="473" r="7" fill="${C.eco}"/>
  <text x="120" y="481" font-family="${BODY}" font-size="22" font-weight="600" fill="${C.eco}">Disponible · incorporación inmediata</text>
  ${homeMap()}
  <rect x="72" y="548" width="1056" height="2" fill="${C.rule}"/>
  <text x="72" y="590" font-family="${BODY}" font-size="23" fill="${C.ink2}">Ingeniero Informático · UA 2026 · TFG con Matrícula de Honor (10/10)</text>
  <text x="1128" y="590" text-anchor="end" font-family="${MONO}" font-size="20" font-weight="500" fill="${C.ink3}">eap-portfolio.vercel.app</text>
</svg>`
render(home, `public${OG_HOME}`)

// ── per case study ─────────────────────────────────────────────────────────
// its line badge and kicker, the name, the pitch, and its stack drawn as stations on its line
function route(p) {
  const { color, dark, dashed } = p.line
  const x0 = 96
  const x1 = 1104
  const y = 486
  const n = p.tags.length
  const xs = p.tags.map((_, i) => x0 + 54 + (i * (x1 - x0 - 108)) / Math.max(n - 1, 1))
  const casing = dark ? `<path d="M${x0} ${y} H${x1}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>` : ''
  return `
  ${casing}
  <path d="M${x0} ${y} H${x1}" stroke="${color}" stroke-width="11" stroke-linecap="round"${dashed ? ' stroke-dasharray="24 14"' : ''}/>
  <rect x="${x0 - 6}" y="${y - 13}" width="44" height="26" rx="7" fill="${C.ink}" stroke="${C.paper}" stroke-width="4"/>
  ${xs
    .map(
      (x, i) => `<circle cx="${x}" cy="${y}" r="12" fill="${C.card}" stroke="${dark ? C.ink : color}" stroke-width="5.5"/>
  <text x="${x}" y="${y + 50}" text-anchor="middle" font-family="${SIGN}" font-size="27" font-weight="600" fill="${C.ink}">${esc(p.tags[i])}</text>`,
    )
    .join('\n  ')}`
}

function projectCard(p) {
  const { color, n, dark } = p.line
  // Barlow Condensed Bold averages ~0.46 em per character: fit the name in 1056px, max 124px
  const nameSize = Math.min(124, Math.floor(1056 / (p.name.length * 0.46)))
  const desc = wrap(p.description, 66).slice(0, 2)
  // baseline so the cap height (~0.7 em) starts 30px under the badge
  const nameY = 230 + Math.round(nameSize * 0.7)
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${C.paper}"/>
  ${logo(72, 52)}
  <text x="1128" y="82" text-anchor="end" font-family="${SIGN}" font-size="26" font-weight="600" fill="${C.ink2}">Erardo Aldana Pessoa · caso de estudio</text>
  ${badge(100, 172, 28, color, `L${n}`, dark)}
  <text x="144" y="181" font-family="${MONO}" font-size="21" font-weight="500" letter-spacing="1" fill="${C.ink2}">${esc(p.kicker)}</text>
  <text x="66" y="${nameY}" font-family="${SIGN}" font-size="${nameSize}" font-weight="700" fill="${C.ink}">${esc(p.name)}</text>
  ${desc
    .map((l, i) => `<text x="72" y="${nameY + 56 + i * 40}" font-family="${BODY}" font-size="29" fill="${C.ink2}">${esc(l)}</text>`)
    .join('\n  ')}
  ${route(p)}
  <text x="72" y="604" font-family="${MONO}" font-size="20" font-weight="500" fill="${C.ink3}">eap-portfolio.vercel.app/projects/${p.slug}</text>
</svg>`
}

mkdirSync('public/og', { recursive: true })
for (const p of PROJECT_SEO) render(projectCard(p), `public${ogProject(p.slug)}`)
