// Post-build step: for each project route, emit a static
// dist/projects/<slug>/index.html whose <head> carries that project's own
// title / description / canonical / OG + Twitter meta (with its own og:image).
// The body is the untouched SPA shell, so real users still hydrate the app;
// crawlers (LinkedIn, WhatsApp, Slack…) that never run JS get correct previews.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { PROJECT_SEO, SITE_URL } from './seo-data.mjs'

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
