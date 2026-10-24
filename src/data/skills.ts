import type { LucideIcon } from 'lucide-react'
import { Code2, LayoutTemplate, Server, Database, Cloud, Boxes, FlaskConical, Cpu } from 'lucide-react'

export interface SkillChip {
  label: string
  star?: boolean
}

export interface SkillGroup {
  titleKey: string
  icon: LucideIcon
  accent: string
  chips: SkillChip[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    titleKey: 'skills.languages',
    icon: Code2,
    accent: 'from-indigo-500/25 to-indigo-500/5 text-accent',
    chips: [
      { label: 'TypeScript', star: true },
      { label: 'Python', star: true },
      { label: 'JavaScript' },
      { label: 'Java' },
      { label: 'C#' },
      { label: 'Kotlin' },
      { label: 'Swift' },
      { label: 'Dart' },
      { label: 'PHP' },
      { label: 'C / C++' },
      { label: 'SQL' },
      { label: 'Bash / Shell' },
    ],
  },
  {
    titleKey: 'skills.frontend',
    icon: LayoutTemplate,
    accent: 'from-violet-500/25 to-violet-500/5 text-accent-violet',
    chips: [
      { label: 'React', star: true },
      { label: 'Vue.js' },
      { label: 'Tailwind' },
      { label: 'Bootstrap / SASS' },
      { label: 'HTML5' },
      { label: 'CSS3' },
      { label: 'Vite' },
    ],
  },
  {
    titleKey: 'skills.backend',
    icon: Server,
    accent: 'from-fuchsia-500/25 to-fuchsia-500/5 text-accent-pink',
    chips: [
      { label: 'FastAPI', star: true },
      { label: 'Node.js' },
      { label: 'Laravel' },
      { label: 'Spring Boot' },
      { label: '.NET' },
      { label: 'REST APIs' },
      { label: 'WebSockets' },
      { label: 'JWT' },
    ],
  },
  {
    titleKey: 'skills.data',
    icon: Database,
    accent: 'from-sky-500/25 to-sky-500/5 text-sky-300',
    chips: [
      { label: 'PostgreSQL', star: true },
      { label: 'PostGIS' },
      { label: 'MySQL' },
      { label: 'Redis' },
      { label: 'SQLAlchemy' },
    ],
  },
  {
    titleKey: 'skills.devops',
    icon: Cloud,
    accent: 'from-blue-500/25 to-blue-500/5 text-blue-300',
    chips: [
      { label: 'Docker', star: true },
      { label: 'GitHub Actions' },
      { label: 'CI/CD' },
      { label: 'Nginx' },
      { label: 'Linux' },
      { label: 'Windows Server' },
      { label: 'Networking' },
      { label: 'Git' },
      { label: 'Kafka' },
    ],
  },
  {
    titleKey: 'skills.arch',
    icon: Boxes,
    accent: 'from-emerald-500/25 to-emerald-500/5 text-emerald-300',
    chips: [
      { label: 'Hexagonal', star: true },
      { label: 'Microservices' },
      { label: 'Software Architecture' },
      { label: 'UML' },
      { label: 'OOP' },
      { label: 'Agile' },
    ],
  },
  {
    titleKey: 'skills.testing',
    icon: FlaskConical,
    accent: 'from-cyan-500/25 to-cyan-500/5 text-cyan-300',
    chips: [{ label: 'Pytest', star: true }, { label: 'Jest' }, { label: 'Playwright' }],
  },
  {
    titleKey: 'skills.ai',
    icon: Cpu,
    accent: 'from-amber-500/25 to-amber-500/5 text-amber-300',
    chips: [
      { label: 'scikit-learn' },
      { label: 'Computer Vision' },
      { label: 'OpenAI / LLM APIs' },
      { label: 'LabVIEW' },
      { label: 'KUKA Robots' },
      { label: 'Android' },
      { label: 'iOS (Swift)' },
      { label: 'Flutter' },
    ],
  },
]

export interface RoadmapItem {
  // also the key for the tech logo (see techIcons.tsx)
  label: string
  // translated display text, when the label needs a note (e.g. "in progress")
  labelKey?: string
}

export const ROADMAP: RoadmapItem[] = [
  { label: 'AWS', labelKey: 'skills.roadmap.aws' },
  { label: 'Kubernetes' },
  { label: 'Next.js' },
  { label: 'GraphQL' },
  { label: 'Terraform' },
  { label: 'MongoDB' },
  { label: 'PyTorch' },
  { label: 'LangChain' },
]

export const TECH_MARQUEE: string[] = [
  'Python',
  'FastAPI',
  'TypeScript',
  'React',
  'Node.js',
  'PostgreSQL',
  'PostGIS',
  'Docker',
  'Redis',
  'Kafka',
  'scikit-learn',
  'Linux',
  'Git',
  'GitHub Actions',
  'Playwright',
  'Pytest',
  'Jest',
  'Tailwind',
  'JavaScript',
  'Java',
  'Kotlin',
  'Laravel',
  'MySQL',
  'Vite',
]

// Where each technology was used, by project slug (same order as the project lines).
// Taken only from the project data, never guessed: tags + footnote in projects.ts and
// stack + diagram in caseStudies.ts; the concepts marked "(architecture)" come from the
// case study's own architecture paragraph. A technology with no entry lights no project.
export const TECH_PROJECTS: Record<string, string[]> = {
  TypeScript: ['hydrofulness', 'studysync'],
  // confirmed by the author (2026-10-24): EcoAlerta's Node/React 18 is plain JavaScript
  JavaScript: ['ecoalerta'],
  Python: ['food-donation', 'hydrofulness', 'studysync', 'easycab'],
  Kotlin: ['studysync'],
  'C / C++': ['chaos-crew'],
  React: ['ecoalerta', 'hydrofulness', 'studysync'],
  Tailwind: ['ecoalerta', 'hydrofulness', 'studysync'],
  Vite: ['hydrofulness', 'studysync'],
  FastAPI: ['food-donation', 'hydrofulness', 'studysync'],
  'Node.js': ['ecoalerta', 'easycab'],
  // (architecture) "Express REST API", "REST routes", "~14 REST endpoints"; EasyCab: "REST audit API"
  'REST APIs': ['ecoalerta', 'food-donation', 'hydrofulness', 'easycab'],
  WebSockets: ['studysync'],
  JWT: ['ecoalerta', 'food-donation', 'easycab'],
  PostgreSQL: ['ecoalerta', 'food-donation', 'studysync', 'easycab'],
  PostGIS: ['ecoalerta'],
  Redis: ['studysync'],
  SQLAlchemy: ['food-donation', 'hydrofulness', 'studysync'],
  Docker: ['ecoalerta', 'food-donation', 'hydrofulness', 'studysync'],
  'GitHub Actions': ['studysync', 'chaos-crew'],
  // StudySync (architecture) "gated by GitHub Actions CI"; Chaos Crew footnote "ECS · CI"
  'CI/CD': ['studysync', 'chaos-crew'],
  Nginx: ['ecoalerta'],
  Kafka: ['easycab'],
  // (architecture) "hexagonal layers" / "hexagonal architecture"
  Hexagonal: ['food-donation', 'studysync'],
  Pytest: ['food-donation'],
  Jest: ['ecoalerta'],
  Playwright: ['ecoalerta'],
  'scikit-learn': ['hydrofulness'],
  // StudySync's stack: "PWA / Android" (Kotlin + Jetpack Compose client)
  Android: ['studysync'],
  // confirmed by the author (2026-10-24): every project lives in Git
  Git: ['ecoalerta', 'food-donation', 'hydrofulness', 'studysync', 'easycab', 'chaos-crew'],
}

// The interchanges (★) shown first, as one line: backend first, since that is the job he's after.
// Only reorders the starred chips above; it never adds or removes one.
const BEST_ORDER = ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Hexagonal', 'Pytest', 'TypeScript', 'React']
const bestRank = (label: string) => {
  const i = BEST_ORDER.indexOf(label)
  return i === -1 ? BEST_ORDER.length : i
}
export const BEST: string[] = SKILL_GROUPS.flatMap((g) => g.chips.filter((c) => c.star).map((c) => c.label)).sort(
  (a, b) => bestRank(a) - bestRank(b),
)
