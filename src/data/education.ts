import type { LucideIcon } from 'lucide-react'
import { Globe, Smartphone, Network } from 'lucide-react'

export interface DegreeInfo {
  titleKey: string
  org: string
  period: string
  badgeKey: string
  descKey: string
  activities: string[]
}

export const DEGREE: DegreeInfo = {
  titleKey: 'edu.degree.title',
  org: 'Universidad de Alicante',
  period: 'sept. 2022 — jun. 2026',
  badgeKey: 'edu.degree.badge',
  descKey: 'edu.degree.desc',
  activities: ['NASA Space Apps 2025', 'Hackathon AMAEM 2026'],
}

export interface FpItem {
  titleKey: string
  org: string
  period: string
  grade?: string
  tags: string[]
  icon: LucideIcon
  accent: string
}

// most recent first (DAW → DAM → SMR)
export const FP_ITEMS: FpItem[] = [
  {
    titleKey: 'edu.daw.title',
    org: 'IES María Enríquez',
    period: '2020 — 2021',
    grade: '8.5',
    tags: ['PHP', 'Laravel', 'JavaScript', 'MySQL'],
    icon: Globe,
    accent: 'text-accent-pink',
  },
  {
    titleKey: 'edu.dam.title',
    org: 'IES Jaume II el Just',
    period: '2018 — 2020',
    grade: '9',
    tags: ['Java', 'Kotlin', 'Dart', 'Android'],
    icon: Smartphone,
    accent: 'text-accent-violet',
  },
  {
    titleKey: 'edu.smr.title',
    org: 'IES Jaume II el Just',
    period: '2016 — 2018',
    tags: ['Networking', 'Sysadmin', 'Security'],
    icon: Network,
    accent: 'text-accent',
  },
]
