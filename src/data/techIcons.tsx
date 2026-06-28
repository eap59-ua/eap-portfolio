import type { ComponentType, CSSProperties } from 'react'
import {
  SiPython,
  SiFastapi,
  SiNodedotjs,
  SiPhp,
  SiLaravel,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiPostgresql,
  SiDocker,
  SiMysql,
  SiLinux,
  SiApachekafka,
  SiAndroid,
  SiCplusplus,
  SiScikitlearn,
  SiGit,
  SiPytest,
  SiRedis,
  SiGithubactions,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { Camera, Code2, Map, FlaskConical } from 'lucide-react'

type IconComp = ComponentType<{ className?: string; style?: CSSProperties }>

interface TechMeta {
  Icon: IconComp
  color: string
}

const TECH: Record<string, TechMeta> = {
  Python: { Icon: SiPython, color: '#6FA8DC' },
  FastAPI: { Icon: SiFastapi, color: '#19BFA8' },
  'Node.js': { Icon: SiNodedotjs, color: '#6CC24A' },
  PHP: { Icon: SiPhp, color: '#8993BE' },
  Laravel: { Icon: SiLaravel, color: '#FF5566' },
  Java: { Icon: FaJava, color: '#E76F00' },
  React: { Icon: SiReact, color: '#61DAFB' },
  TypeScript: { Icon: SiTypescript, color: '#4F8CF0' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  HTML5: { Icon: SiHtml5, color: '#E96228' },
  CSS3: { Icon: SiCss, color: '#3C9CD7' },
  Tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  PostgreSQL: { Icon: SiPostgresql, color: '#6699E0' },
  Docker: { Icon: SiDocker, color: '#4AA0EE' },
  PostGIS: { Icon: Map, color: '#34D399' },
  MySQL: { Icon: SiMysql, color: '#6E9CC4' },
  Linux: { Icon: SiLinux, color: '#FCC624' },
  Kafka: { Icon: SiApachekafka, color: '#C7CDD6' },
  Android: { Icon: SiAndroid, color: '#3DDC84' },
  'C / C++': { Icon: SiCplusplus, color: '#5C9FD3' },
  LabVIEW: { Icon: Camera, color: '#FBBF24' },
  'scikit-learn': { Icon: SiScikitlearn, color: '#F7931E' },
  Git: { Icon: SiGit, color: '#F05033' },
  'Pytest / Jest': { Icon: SiPytest, color: '#5FC9E8' },
  Pytest: { Icon: SiPytest, color: '#5FC9E8' },
  Redis: { Icon: SiRedis, color: '#FF5C49' },
  'GitHub Actions': { Icon: SiGithubactions, color: '#4C8DF6' },
  Playwright: { Icon: FlaskConical, color: '#4CC25A' },
}

const FALLBACK: TechMeta = { Icon: Code2, color: '#94a3b8' }

export function getTech(label: string): TechMeta {
  return TECH[label] ?? FALLBACK
}

export function TechLogo({ label, className }: { label: string; className?: string }) {
  const { Icon, color } = getTech(label)
  return <Icon className={className} style={{ color }} />
}
