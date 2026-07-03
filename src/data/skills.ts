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

export const ROADMAP: string[] = [
  'AWS',
  'Kubernetes',
  'Next.js',
  'GraphQL',
  'Terraform',
  'MongoDB',
  'PyTorch',
  'LangChain',
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
