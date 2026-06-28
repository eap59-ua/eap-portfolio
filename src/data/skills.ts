import type { LucideIcon } from 'lucide-react'
import { Server, LayoutTemplate, Database, Wrench } from 'lucide-react'

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
    titleKey: 'skills.backend',
    icon: Server,
    accent: 'from-indigo-500/25 to-indigo-500/5 text-accent',
    chips: [
      { label: 'Python', star: true },
      { label: 'FastAPI', star: true },
      { label: 'Node.js' },
      { label: 'PHP' },
      { label: 'Laravel' },
      { label: 'Java' },
    ],
  },
  {
    titleKey: 'skills.frontend',
    icon: LayoutTemplate,
    accent: 'from-violet-500/25 to-violet-500/5 text-accent-violet',
    chips: [
      { label: 'React', star: true },
      { label: 'TypeScript', star: true },
      { label: 'JavaScript' },
      { label: 'HTML5' },
      { label: 'CSS3' },
      { label: 'Tailwind' },
    ],
  },
  {
    titleKey: 'skills.data',
    icon: Database,
    accent: 'from-fuchsia-500/25 to-fuchsia-500/5 text-accent-pink',
    chips: [
      { label: 'PostgreSQL', star: true },
      { label: 'Docker', star: true },
      { label: 'PostGIS' },
      { label: 'MySQL' },
      { label: 'Linux' },
      { label: 'Kafka' },
    ],
  },
  {
    titleKey: 'skills.other',
    icon: Wrench,
    accent: 'from-emerald-500/25 to-emerald-500/5 text-emerald-300',
    chips: [
      { label: 'Android' },
      { label: 'C / C++' },
      { label: 'LabVIEW' },
      { label: 'scikit-learn' },
      { label: 'Git' },
      { label: 'Pytest / Jest' },
    ],
  },
]

export const TECH_MARQUEE: string[] = [
  'Python',
  'FastAPI',
  'React',
  'TypeScript',
  'PostgreSQL',
  'PostGIS',
  'Docker',
  'Node.js',
  'Redis',
  'Kafka',
  'scikit-learn',
  'Linux',
  'Git',
  'GitHub Actions',
  'Playwright',
  'Pytest',
]
