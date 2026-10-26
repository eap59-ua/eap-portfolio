// Post-build step: for each project route, emit a static
// dist/projects/<slug>/index.html whose <head> carries that project's own
// title / description / canonical / OG + Twitter meta (with its own og:image),
// and whose #root holds that case study already rendered (marked data-ssr, so
// main.tsx hydrates it). Crawlers that never run JS get correct previews too.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { PROJECT_SEO, SITE_URL, ogProject } from './seo-data.mjs'

const template = readFileSync('dist/index.html', 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/index.html')
const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
/** #root with the markup and the route it was rendered for (see src/lib/ssr.ts) */
/** The page's <title>/<meta> (React 19 hoistables) come out inline in renderToString's
 *  string; <head> already carries them (swapped below), so they're dropped from the body.
 *  Hydration doesn't look for hoistables in place, and on the client React puts its own in <head>. */
const stripHoistables = (app) => app.replace(/<title>[\s\S]*?<\/title>|<meta\b[^>]*>/g, '')
const withApp = (html, route, app) => html.replace('<div id="root"></div>', `<div id="root" data-ssr="${route}">${stripHoistables(app)}</div>`)

// The case study is a lazy chunk with its own stylesheet (the video player's), which Vite
// only links once that chunk's JS runs — after the prerendered page has painted, so the
// header reflowed (CLS ≈ 0.28 on desktop). Project pages link it up front, and preload the
// chunk itself; Vite's loader then finds the stylesheet already there and doesn't add it again.
const assets = readdirSync('dist/assets')
const csCss = assets.filter((f) => /^CaseStudy-.*\.css$/.test(f))
const csJs = assets.filter((f) => /^CaseStudy-.*\.js$/.test(f))
if (csCss.length !== 1 || csJs.length !== 1) throw new Error(`prerender: expected one CaseStudy chunk, got ${csCss} / ${csJs}`)
const caseStudyHead = `<link rel="stylesheet" crossorigin href="/assets/${csCss[0]}">
    <link rel="modulepreload" crossorigin href="/assets/${csJs[0]}">
  </head>`

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
  const img = `${SITE_URL}${ogProject(p.slug)}`
  const title = `${p.ogTitle} · Erardo Aldana Pessoa`
  const desc = p.description
  const t = esc(title)
  const d = esc(desc)

  let html = template
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title')
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`, 'description')
  html = swap(html, /<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="article" />`, 'og:type')
  html = swap(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`, 'og:title')
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${d}" />`, 'og:description')
  html = swap(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = swap(html, /<meta\s+property="og:image"\s+content="[\s\S]*?\/>/, `<meta property="og:image" content="${img}" />`, 'og:image')
  html = swap(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${t}" />`, 'twitter:title')
  html = swap(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${d}" />`, 'twitter:description')
  html = swap(html, /<meta\s+property="og:image:alt"[\s\S]*?\/>/, `<meta property="og:image:alt" content="${esc(`${p.name} · caso de estudio de Erardo Aldana Pessoa`)}" />`, 'og:image:alt')
  html = swap(html, /<meta\s+name="twitter:image"[\s\S]*?\/>/, `<meta name="twitter:image" content="${img}" />`, 'twitter:image')
  html = swap(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`, 'canonical')

  html = html.replace('</head>', caseStudyHead)

  const route = `/projects/${p.slug}`
  const app = await render(route)
  html = withApp(html, route, app)

  mkdirSync(`dist/projects/${p.slug}`, { recursive: true })
  writeFileSync(`dist/projects/${p.slug}/index.html`, html)
  console.log(`prerendered ${route} (${Math.round(app.length / 1024)} KB of HTML)`)
}

// Unknown routes: Vercel serves dist/404.html with a real 404 status (no SPA
// catch-all in vercel.json). Empty shell, not indexed; the app renders "Vía muerta".
let notFound = swap(template, /<title>[\s\S]*?<\/title>/, '<title>Vía muerta · Erardo Aldana Pessoa</title>', 'title')
notFound = notFound.replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
writeFileSync('dist/404.html', notFound)
console.log('prerendered /404.html')

// Home: render the app at build time so the first paint doesn't wait for the
// JS bundle (fonts + HTML paint first; main.tsx hydrates the same markup).
const appHtml = await render('/')
writeFileSync('dist/index.html', withApp(template, '/', appHtml))
console.log(`prerendered / (${Math.round(appHtml.length / 1024)} KB of HTML)`)
