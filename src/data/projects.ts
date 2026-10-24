import type { LucideIcon } from 'lucide-react'
import { Leaf, Droplets, HeartHandshake, Car, Video, Gamepad2 } from 'lucide-react'

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
  contextKey: string
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
  highlightKey?: string
  // false = no case-study page (card links only to the repo)
  caseStudy?: false
}

export const PROJECTS: Project[] = [
  {
    slug: 'ecoalerta',
    title: 'EcoAlerta',
    contextKey: 'projects.ctx.ecoalerta',
    icon: Leaf,
    iconColor: 'text-emerald-400',
    status: 'done',
    descKey: 'projects.p1',
    hero: true,
    highlightKey: 'projects.highlight.ecoalerta',
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
    slug: 'food-donation',
    title: 'Food Donation Network',
    titleKey: 'projects.p3.title',
    contextKey: 'projects.ctx.food-donation',
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
    slug: 'hydrofulness',
    title: 'Hydrofulness',
    contextKey: 'projects.ctx.hydrofulness',
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
    slug: 'studysync',
    title: 'StudySync',
    contextKey: 'projects.ctx.studysync',
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
    slug: 'easycab',
    title: 'EasyCab',
    contextKey: 'projects.ctx.easycab',
    icon: Car,
    iconColor: 'text-amber-300',
    status: 'done',
    descKey: 'projects.p4',
    tags: [
      { label: 'Python', tone: 'python' },
      { label: 'Apache Kafka' },
      { label: 'PostgreSQL', tone: 'pg' },
      { label: 'JWT' },
      { label: 'TLS / SSL' },
    ],
    footnoteKey: 'projects.p4.tag',
    repo: 'https://github.com/eap59-ua/easycabSD-P2',
  },
  {
    slug: 'chaos-crew',
    title: 'Chaos Crew',
    contextKey: 'projects.ctx.chaos-crew',
    icon: Gamepad2,
    iconColor: 'text-rose-300',
    status: 'done',
    descKey: 'projects.p6',
    tags: [
      { label: 'C++', tone: 'cpp' },
      { label: 'EnTT' },
      { label: 'Raylib' },
      { label: 'CMake' },
      { label: 'GitHub Actions' },
    ],
    footnote: 'ECS · CI',
    repo: 'https://github.com/eap59-ua/chaos-crew-dca',
    caseStudy: false,
  },
]
