import type { LucideIcon } from 'lucide-react'
import { Briefcase, Factory } from 'lucide-react'

export interface ExperienceItem {
  company: string
  icon: LucideIcon
  accent: string
  roleKey: string
  periodKey: string
  descKey: string
  // translated, ' · '-separated list (e.g. "Appian · Low-code · Consultoría")
  tagsKey: string
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'NTT Data',
    icon: Briefcase,
    accent: 'text-accent',
    roleKey: 'exp.ntt.role',
    periodKey: 'exp.ntt.period',
    descKey: 'exp.ntt.desc',
    tagsKey: 'exp.ntt.tags',
  },
  {
    company: 'Autis Ingenieros',
    icon: Factory,
    accent: 'text-accent-violet',
    roleKey: 'exp.autis.role',
    periodKey: 'exp.autis.period',
    descKey: 'exp.autis.desc',
    tagsKey: 'exp.autis.tags',
  },
]

// Non-tech jobs, shown compactly under the timeline (same as the CV's
// "Otra experiencia" block) so the internships stay the main story.
export interface OtherExperienceItem {
  roleKey: string
  orgKey: string
  periodKey?: string
  descKey: string
  accent: string
}

export const OTHER_EXPERIENCE: OtherExperienceItem[] = [
  {
    roleKey: 'exp.leroy.role',
    orgKey: 'exp.leroy.org',
    periodKey: 'exp.leroy.period',
    descKey: 'exp.leroy.desc',
    accent: 'text-accent-pink',
  },
  {
    roleKey: 'exp.prev.role',
    orgKey: 'exp.prev.org',
    descKey: 'exp.prev.desc',
    accent: 'text-sky-300',
  },
]
