import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { PROJECT_SEO } from './seo-data.mjs'

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// naive word-wrap for SVG <text> (no auto-wrap in SVG)
function wrap(text, max) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim())
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
  }
  if (line) lines.push(line)
  return lines
}

function render(svg, out) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true },
  })
    .render()
    .asPng()
  writeFileSync(out, png)
  console.log(out, '→', Math.round(png.length / 1024), 'KB')
}

// ── home card (unchanged brand look) ───────────────────────────────────────
const home = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="#818cf8"/>
      <stop offset="0.5" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#f0abfc"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.08" r="0.75">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0e1a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="url(#name)"/>
  <text x="80" y="124" font-family="Consolas, monospace" font-size="30" font-weight="700" fill="#818cf8">&lt;EAP/&gt;</text>
  <text x="78" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="800" fill="url(#name)">Erardo Aldana Pessoa</text>
  <text x="80" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="37" font-weight="600" fill="#c3cee0">Software Engineer · Backend · Python · Cloud</text>
  <text x="80" y="428" font-family="Consolas, monospace" font-size="26" fill="#818cf8">DESARROLLADOR_FULL_STACK.execute()</text>
  <text x="80" y="548" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#7c8aa3">Computer Engineer · Distinction (TFG 10/10) · Open to the EU</text>
  <text x="80" y="588" font-family="Consolas, monospace" font-size="23" fill="#4b5670">eap-portfolio.vercel.app</text>
</svg>`
render(home, 'public/og.png')

// ── per-project cards ──────────────────────────────────────────────────────
function projectCard(p) {
  const descLines = wrap(p.description, 62).slice(0, 2)
  const descSvg = descLines
    .map(
      (l, i) =>
        `<text x="80" y="${404 + i * 46}" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#c3cee0">${esc(l)}</text>`,
    )
    .join('\n  ')
  const tagSvg = p.tags.join('    ·    ')
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${p.accentA}"/>
      <stop offset="1" stop-color="${p.accentB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.86" cy="0.05" r="0.85">
      <stop offset="0" stop-color="${p.accentA}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${p.accentA}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0e1a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="url(#bar)"/>
  <text x="80" y="120" font-family="Consolas, monospace" font-size="28" font-weight="700" fill="#818cf8">&lt;EAP/&gt;</text>
  <text x="82" y="210" font-family="Consolas, monospace" font-size="25" font-weight="600" letter-spacing="3" fill="${p.accentA}">${esc(p.kicker)}</text>
  <text x="78" y="312" font-family="Segoe UI, Arial, sans-serif" font-size="86" font-weight="800" fill="#f4f6fb">${esc(p.name)}</text>
  ${descSvg}
  <text x="80" y="524" font-family="Consolas, monospace" font-size="25" fill="#8493ab">${esc(tagSvg)}</text>
  <rect x="80" y="556" width="1040" height="1.5" fill="#1b2237"/>
  <text x="80" y="596" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#7c8aa3">Erardo Aldana Pessoa   ·   eap-portfolio.vercel.app/projects/${p.slug}</text>
</svg>`
}

mkdirSync('public/og', { recursive: true })
for (const p of PROJECT_SEO) {
  render(projectCard(p), `public/og/${p.slug}.png`)
}
