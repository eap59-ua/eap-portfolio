# eap-portfolio

> Personal portfolio of **Erardo Aldana Pessoa** — Software Engineer (Backend · Python · Cloud), Computer Engineer (Distinction) from the University of Alicante.

A dark, premium single-page portfolio with in-depth project case studies, built as a modern React app.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (dark, OLED-style theme)
- **Framer Motion** (scroll reveal, micro-interactions) + **Lenis** (smooth scroll)
- **react-i18next** — bilingual ES / EN with persisted preference
- **react-router** — home + per-project case studies
- **react-icons** (brand tech logos) + **lucide-react**

## Features

- Bilingual (Spanish / English), persisted in `localStorage`
- Full case-study page per project (`/projects/:slug`): problem, role, architecture diagram, technical decisions, challenges, results, stack
- Dark premium design, accessible contrast, `prefers-reduced-motion` respected
- Route-level code splitting, per-route SEO meta
- Real projects and facts only — no invented metrics

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Deploy

Deployed on **Vercel** (Vite preset, output `dist/`). `vercel.json` rewrites all routes to `index.html` for client-side routing. Push to the connected branch to trigger a deploy.

## Structure

```
src/
  data/          projects, experience, skills, education, caseStudies, techIcons
  i18n/          es / en resources + config
  components/    layout · sections · projects · motion · ui
  pages/         Home · CaseStudy · NotFound
  lib/           utils, site constants
public/          profile photo, CV (PDF), robots.txt
legacy/          previous static single-file portfolio (archived)
```

## Contact

- [erardoap@gmail.com](mailto:erardoap@gmail.com)
- [github.com/eap59-ua](https://github.com/eap59-ua) · [linkedin.com/in/erardo-aldana](https://www.linkedin.com/in/erardo-aldana/)
