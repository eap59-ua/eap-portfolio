// Post-build step: for each project route, emit a static
// dist/projects/<slug>/index.html whose <head> carries that project's own
// title / description / canonical / OG + Twitter meta (with its own og:image).
// The body is the untouched SPA shell, so real users still hydrate the app;
// crawlers (LinkedIn, WhatsApp, Slack…) that never run JS get correct previews.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { PROJECT_SEO, SITE_URL } from './seo-data.mjs'

// project pages start from the empty shell; only the home gets prerendered HTML
const template = readFileSync('dist/index.html', 'utf8')

const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Replace a single tag (single- or multi-line) matched by `re` with `next`.
// Warns loudly if a tag is missing so template drift never fails silently.
function swap(html, re, next, label) {
  if (!re.test(html)) throw new Error(`prerender: <head> tag not found: ${label}`)
  return html.replace(re, next)
}

for (const p of PROJECT_SEO) {
  const url = `${SITE_URL}/projects/${p.slug}`
  const img = `${SITE_URL}/og/${p.slug}.png`
  const title = `${p.ogTitle} · Erardo Aldana Pessoa`
  const desc = p.description
  const t = esc(title)
  const d = esc(desc)

  let html = template
  // The home template carries a mobile-only static hero inside #root — strip it
  // from project pages so they don't flash the home hero before React renders.
  html = html.replace(/<div id="root">[\s\S]*?<\/div>(\s*<noscript>)/, '<div id="root"></div>$1')
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title')
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`, 'description')
  html = swap(html, /<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="article" />`, 'og:type')
  html = swap(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`, 'og:title')
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${d}" />`, 'og:description')
  html = swap(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = swap(html, /<meta\s+property="og:image"\s+content="[\s\S]*?\/>/, `<meta property="og:image" content="${img}" />`, 'og:image')
  html = swap(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${t}" />`, 'twitter:title')
  html = swap(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${d}" />`, 'twitter:description')
  html = swap(html, /<meta\s+name="twitter:image"[\s\S]*?\/>/, `<meta name="twitter:image" content="${img}" />`, 'twitter:image')
  html = swap(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`, 'canonical')

  mkdirSync(`dist/projects/${p.slug}`, { recursive: true })
  writeFileSync(`dist/projects/${p.slug}/index.html`, html)
  console.log(`prerendered /projects/${p.slug}`)
}

// Unknown routes: Vercel serves dist/404.html with a real 404 status (no SPA
// catch-all in vercel.json). Empty shell, not indexed; the app renders "Vía muerta".
let notFound = swap(template, /<title>[\s\S]*?<\/title>/, '<title>Vía muerta · Erardo Aldana Pessoa</title>', 'title')
notFound = notFound.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
writeFileSync('dist/404.html', notFound)
console.log('prerendered /404.html')

// Home: render the app at build time so the first paint doesn't wait for the
// JS bundle (fonts + HTML paint first; main.tsx hydrates the same markup).
const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const appHtml = await render('/')
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/index.html')
writeFileSync('dist/index.html', template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
console.log(`prerendered / (${Math.round(appHtml.length / 1024)} KB of HTML)`)
