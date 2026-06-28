import type { LucideIcon } from 'lucide-react'
import { Leaf, Droplets, HeartHandshake, Gamepad2, Video } from 'lucide-react'

export type ProjectStatus = 'active' | 'done'
export type TagTone = 'default' | 'python' | 'react' | 'node' | 'pg' | 'docker' | 'ts' | 'ml' | 'cpp'

export interface ProjectTag {
  label: string
  tone?: TagTone
}

export interface Project {
  slug: string
  title: string
  titleKey?: string
  context: string
  icon: LucideIcon
  iconColor: string
  status: ProjectStatus
  descKey: string
  tags: ProjectTag[]
  footnote?: string
  footnoteKey?: string
  repo: string
  demo?: string
  featured?: boolean
  hero?: boolean
  highlight?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'ecoalerta',
    title: 'EcoAlerta',
    context: 'TFG · 2026',
    icon: Leaf,
    iconColor: 'text-emerald-400',
    status: 'done',
    descKey: 'projects.p1',
    hero: true,
    highlight: 'Matrícula de Honor · 10/10',
    tags: [
      { label: 'React 18', tone: 'react' },
      { label: 'Node.js', tone: 'node' },
      { label: 'PostgreSQL + PostGIS', tone: 'pg' },
      { label: 'Docker', tone: 'docker' },
      { label: 'JWT' },
      { label: 'PWA' },
    ],
    footnote: 'Jest · Playwright · Swagger',
    repo: 'https://github.com/eap59-ua/tfg-medioambiente-ua',
    featured: true,
  },
  {
    slug: 'hydrofulness',
    title: 'Hydrofulness',
    context: 'Hackathon AMAEM · 2026',
    icon: Droplets,
    iconColor: 'text-sky-400',
    status: 'done',
    descKey: 'projects.p2',
    tags: [
      { label: 'FastAPI', tone: 'python' },
      { label: 'React + Vite', tone: 'react' },
      { label: 'TypeScript', tone: 'ts' },
      { label: 'scikit-learn', tone: 'ml' },
      { label: 'Docker', tone: 'docker' },
    ],
    footnote: 'ML · ETL · Anomaly detection',
    repo: 'https://github.com/eap59-ua/hackathon-aguas-de-alicante-hydrofulness',
    featured: true,
  },
  {
    slug: 'food-donation',
    title: 'Food Donation Network',
    titleKey: 'projects.p3.title',
    context: 'GCS · 2026',
    icon: HeartHandshake,
    iconColor: 'text-accent-pink',
    status: 'done',
    descKey: 'projects.p3',
    tags: [
      { label: 'FastAPI', tone: 'python' },
      { label: 'PostgreSQL async', tone: 'pg' },
      { label: 'SQLAlchemy 2.0' },
      { label: 'JWT' },
      { label: 'Docker', tone: 'docker' },
    ],
    footnoteKey: 'projects.p3.tag',
    repo: 'https://github.com/eap59-ua/food-donation-backend',
  },
  {
    slug: 'studysync',
    title: 'StudySync',
    context: 'Proyecto personal · 2026',
    icon: Video,
    iconColor: 'text-accent',
    status: 'active',
    descKey: 'projects.p5',
    tags: [
      { label: 'FastAPI', tone: 'python' },
      { label: 'React', tone: 'react' },
      { label: 'PostgreSQL', tone: 'pg' },
      { label: 'Redis' },
      { label: 'LiveKit' },
      { label: 'WebSocket' },
    ],
    footnote: 'Realtime · Redis · WebSocket',
    repo: 'https://github.com/eap59-ua/studysync',
  },
  {
    slug: 'chaos-crew',
    title: 'Chaos Crew',
    context: 'DCA · 2025-26',
    icon: Gamepad2,
    iconColor: 'text-accent-violet',
    status: 'done',
    descKey: 'projects.p4',
    tags: [
      { label: 'C++', tone: 'cpp' },
      { label: 'Raylib' },
      { label: 'CMake' },
      { label: 'EnTT (ECS)' },
      { label: 'CI/CD' },
    ],
    footnoteKey: 'projects.p4.tag',
    repo: 'https://github.com/eap59-ua/chaos-crew-dca',
  },
]
