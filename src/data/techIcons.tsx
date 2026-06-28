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
  SiKotlin,
  SiVite,
  SiJest,
  SiGraphql,
  SiKubernetes,
  SiTerraform,
  SiMongodb,
  SiNextdotjs,
  SiPytorch,
  SiOpenai,
  SiDart,
  SiVuedotjs,
  SiBootstrap,
  SiNginx,
  SiFlutter,
  SiSpringboot,
} from 'react-icons/si'
import { FaJava, FaWindows } from 'react-icons/fa'
import {
  Camera,
  Code2,
  Map,
  FlaskConical,
  Database,
  Webhook,
  ArrowLeftRight,
  KeyRound,
  Hexagon,
  Boxes,
  Component,
  Repeat,
  Eye,
  Workflow,
  Factory,
  Blocks,
  Network,
  Cloud,
  Cable,
  Terminal,
  GitBranch,
} from 'lucide-react'

type IconComp = ComponentType<{ className?: string; style?: CSSProperties }>

interface TechMeta {
  Icon: IconComp
  color: string
}

const TECH: Record<string, TechMeta> = {
  // Languages
  Python: { Icon: SiPython, color: '#6FA8DC' },
  TypeScript: { Icon: SiTypescript, color: '#4F8CF0' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  Java: { Icon: FaJava, color: '#E76F00' },
  Kotlin: { Icon: SiKotlin, color: '#A97BFF' },
  Dart: { Icon: SiDart, color: '#3FC3F0' },
  'Bash / Shell': { Icon: Terminal, color: '#cbd5e1' },
  PHP: { Icon: SiPhp, color: '#8993BE' },
  'C / C++': { Icon: SiCplusplus, color: '#5C9FD3' },
  SQL: { Icon: Database, color: '#6699E0' },
  HTML5: { Icon: SiHtml5, color: '#E96228' },
  CSS3: { Icon: SiCss, color: '#3C9CD7' },

  // Frontend
  React: { Icon: SiReact, color: '#61DAFB' },
  Tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  'Vue.js': { Icon: SiVuedotjs, color: '#54C99A' },
  'Bootstrap / SASS': { Icon: SiBootstrap, color: '#A77BF0' },
  Vite: { Icon: SiVite, color: '#A879FF' },

  // Backend & APIs
  FastAPI: { Icon: SiFastapi, color: '#19BFA8' },
  'Node.js': { Icon: SiNodedotjs, color: '#6CC24A' },
  Laravel: { Icon: SiLaravel, color: '#FF5566' },
  'Spring Boot': { Icon: SiSpringboot, color: '#7FB83E' },
  'REST APIs': { Icon: Webhook, color: '#9aa6bd' },
  REST: { Icon: Webhook, color: '#9aa6bd' },
  WebSockets: { Icon: ArrowLeftRight, color: '#22d3ee' },
  WebSocket: { Icon: ArrowLeftRight, color: '#22d3ee' },
  JWT: { Icon: KeyRound, color: '#f0abfc' },
  'Swagger / OpenAPI': { Icon: Webhook, color: '#85C540' },

  // Databases
  PostgreSQL: { Icon: SiPostgresql, color: '#6699E0' },
  PostGIS: { Icon: Map, color: '#34D399' },
  MySQL: { Icon: SiMysql, color: '#6E9CC4' },
  Redis: { Icon: SiRedis, color: '#FF5C49' },
  SQLAlchemy: { Icon: Database, color: '#9aa6bd' },
  'SQLAlchemy 2.0': { Icon: Database, color: '#9aa6bd' },

  // DevOps & Cloud
  Docker: { Icon: SiDocker, color: '#4AA0EE' },
  'GitHub Actions': { Icon: SiGithubactions, color: '#4C8DF6' },
  'CI/CD': { Icon: Workflow, color: '#4C8DF6' },
  Nginx: { Icon: SiNginx, color: '#4FA64F' },
  Networking: { Icon: Network, color: '#818cf8' },
  'Windows Server': { Icon: FaWindows, color: '#3FA0EF' },
  Linux: { Icon: SiLinux, color: '#FCC624' },
  Git: { Icon: SiGit, color: '#F05033' },
  Kafka: { Icon: SiApachekafka, color: '#C7CDD6' },

  // Architecture, testing & methods
  'Software Architecture': { Icon: Network, color: '#818cf8' },
  Hexagonal: { Icon: Hexagon, color: '#a78bfa' },
  'Hexagonal Architecture': { Icon: Hexagon, color: '#a78bfa' },
  Microservices: { Icon: Boxes, color: '#818cf8' },
  UML: { Icon: GitBranch, color: '#a78bfa' },
  OOP: { Icon: Component, color: '#34d399' },
  Agile: { Icon: Repeat, color: '#34d399' },
  Pytest: { Icon: SiPytest, color: '#5FC9E8' },
  'Pytest / Jest': { Icon: SiPytest, color: '#5FC9E8' },
  Jest: { Icon: SiJest, color: '#E36F8B' },
  Playwright: { Icon: FlaskConical, color: '#4CC25A' },

  // AI & vision
  'scikit-learn': { Icon: SiScikitlearn, color: '#F7931E' },
  'Computer Vision': { Icon: Eye, color: '#FBBF24' },
  'Machine Vision': { Icon: Eye, color: '#FBBF24' },
  LabVIEW: { Icon: Camera, color: '#FBBF24' },
  'OpenAI / LLM APIs': { Icon: SiOpenai, color: '#cbd5e1' },

  // Mobile & other
  Android: { Icon: SiAndroid, color: '#3DDC84' },
  Flutter: { Icon: SiFlutter, color: '#54C5F8' },
  'Industrial Automation': { Icon: Factory, color: '#9aa6bd' },
  'Low-Code': { Icon: Blocks, color: '#9aa6bd' },

  // Roadmap / learning
  AWS: { Icon: Cloud, color: '#FF9D2E' },
  Kubernetes: { Icon: SiKubernetes, color: '#5B8DEF' },
  'Next.js': { Icon: SiNextdotjs, color: '#cbd5e1' },
  GraphQL: { Icon: SiGraphql, color: '#E64D9C' },
  Terraform: { Icon: SiTerraform, color: '#9B6BE8' },
  MongoDB: { Icon: SiMongodb, color: '#4CC56A' },
  PyTorch: { Icon: SiPytorch, color: '#EE6C3C' },
  LangChain: { Icon: Cable, color: '#34d399' },
}

const FALLBACK: TechMeta = { Icon: Code2, color: '#94a3b8' }

export function getTech(label: string): TechMeta {
  return TECH[label] ?? FALLBACK
}

export function TechLogo({ label, className }: { label: string; className?: string }) {
  const { Icon, color } = getTech(label)
  return <Icon className={className} style={{ color }} />
}
