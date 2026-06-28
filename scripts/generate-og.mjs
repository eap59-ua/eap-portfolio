import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'node:fs'

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
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

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})
const png = resvg.render().asPng()
writeFileSync('public/og.png', png)
console.log('og.png written:', png.length, 'bytes')
