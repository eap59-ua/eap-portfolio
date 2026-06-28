import type { LucideIcon } from 'lucide-react'
import { Briefcase, Factory, Network } from 'lucide-react'

export interface ExperienceItem {
  company: string
  icon: LucideIcon
  accent: string
  roleKey: string
  periodKey: string
  descKey: string
  tags: string[]
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'NTT Data',
    icon: Briefcase,
    accent: 'text-accent',
    roleKey: 'exp.ntt.role',
    periodKey: 'exp.ntt.period',
    descKey: 'exp.ntt.desc',
    tags: ['Appian', 'Low-code', 'Consultoría IT', 'Sector público'],
  },
  {
    company: 'Autis Ingenieros',
    icon: Factory,
    accent: 'text-accent-violet',
    roleKey: 'exp.autis.role',
    periodKey: 'exp.autis.period',
    descKey: 'exp.autis.desc',
    tags: ['LabVIEW', 'Visión artificial', 'Automatización industrial', 'Automoción', 'QA en línea'],
  },
  {
    company: 'App Informática',
    icon: Network,
    accent: 'text-accent-pink',
    roleKey: 'exp.app.role',
    periodKey: 'exp.app.period',
    descKey: 'exp.app.desc',
    tags: ['Redes', 'Hardware', 'Soporte técnico'],
  },
]
