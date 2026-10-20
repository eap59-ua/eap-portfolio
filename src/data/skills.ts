import type { LucideIcon } from 'lucide-react'
import { Server, LayoutTemplate, Database, Cloud, Boxes } from 'lucide-react'

export interface SkillChip {
  // also the key for the tech logo (see techIcons.tsx)
  label: string
  // translated display text, when the label itself is language-specific
  labelKey?: string
  star?: boolean
}

export interface SkillGroup {
  titleKey: string
  icon: LucideIcon
  accent: string
  chips: SkillChip[]
}

// Same cut as the CV's "Competencias técnicas"; ★ = the CV's main stack.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    titleKey: 'skills.backend',
    icon: Server,
    accent: 'from-fuchsia-500/25 to-fuchsia-500/5 text-accent-pink',
    chips: [
      { label: 'Python', star: true },
      { label: 'FastAPI', star: true },
      { label: 'SQLAlchemy' },
      { label: 'Node.js' },
      { label: 'REST APIs', labelKey: 'skills.chip.rest' },
    ],
  },
  {
    titleKey: 'skills.frontend',
    icon: LayoutTemplate,
    accent: 'from-violet-500/25 to-violet-500/5 text-accent-violet',
    chips: [{ label: 'React', star: true }, { label: 'TypeScript', star: true }, { label: 'Tailwind' }],
  },
  {
    titleKey: 'skills.data',
    icon: Database,
    accent: 'from-sky-500/25 to-sky-500/5 text-sky-300',
    chips: [{ label: 'PostgreSQL', star: true }, { label: 'PostGIS' }, { label: 'Redis' }, { label: 'MySQL' }],
  },
  {
    titleKey: 'skills.devops',
    icon: Cloud,
    accent: 'from-blue-500/25 to-blue-500/5 text-blue-300',
    chips: [
      { label: 'Docker', star: true },
      { label: 'GitHub Actions' },
      { label: 'Linux' },
      { label: 'Git' },
      { label: 'Pytest' },
      { label: 'Playwright' },
    ],
  },
  {
    titleKey: 'skills.other',
    icon: Boxes,
    accent: 'from-emerald-500/25 to-emerald-500/5 text-emerald-300',
    chips: [
      { label: 'C++' },
      { label: 'Java' },
      { label: 'Apache Kafka' },
      { label: 'Hexagonal', labelKey: 'skills.chip.hexagonal' },
    ],
  },
]

// Only what I'm actually studying for right now.
export const ROADMAP: string[] = ['AWS Cloud Practitioner']

export const TECH_MARQUEE: string[] = [
  'Python',
  'FastAPI',
  'SQLAlchemy',
  'PostgreSQL',
  'PostGIS',
  'Redis',
  'MySQL',
  'React',
  'TypeScript',
  'Tailwind',
  'Node.js',
  'Docker',
  'GitHub Actions',
  'Linux',
  'Git',
  'Pytest',
  'Playwright',
  'Kafka',
  'C++',
  'Java',
]
