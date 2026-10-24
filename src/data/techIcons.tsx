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
  SiLinux,
  SiApachekafka,
  SiAndroid,
  SiCplusplus,
  SiDotnet,
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
  SiSwift,
  SiGnubash,
  SiJsonwebtokens,
  SiSwagger,
  SiUml,
  SiLangchain,
  SiExpress,
  SiVercel,
} from 'react-icons/si'
import { FaJava, FaWindows, FaAws } from 'react-icons/fa'
import { TbBrandCSharp, TbBrandMysql } from 'react-icons/tb'
import {
  Camera,
  Code2,
  Map,
  FlaskConical,
  Database,
  Webhook,
  ArrowLeftRight,
  Hexagon,
  Boxes,
  Component,
  Repeat,
  Eye,
  Workflow,
  Factory,
  Blocks,
  Network,
} from 'lucide-react'

type IconComp = ComponentType<{ className?: string; style?: CSSProperties; 'aria-hidden'?: boolean }>

/**
 * hex: the official brand colour (Simple Icons hex, simpleicons.org). No hex = a concept
 * with no logo (REST, Hexagonal...): it is drawn in ink.
 * plate: colour seen through the letters cut out of a square logo (JS has black letters,
 * TS white ones), so the logo looks like the real one on any chip.
 */
interface TechDef {
  Icon: IconComp
  hex?: string
  plate?: string
}

const TECH: Record<string, TechDef> = {
  // Languages
  Python: { Icon: SiPython, hex: '#3776AB' },
  TypeScript: { Icon: SiTypescript, hex: '#3178C6', plate: '#FFFFFF' },
  JavaScript: { Icon: SiJavascript, hex: '#F7DF1E', plate: '#000000' },
  Java: { Icon: FaJava, hex: '#E76F00' },
  Kotlin: { Icon: SiKotlin, hex: '#7F52FF' },
  Swift: { Icon: SiSwift, hex: '#F05138' },
  Dart: { Icon: SiDart, hex: '#0175C2' },
  'Bash / Shell': { Icon: SiGnubash, hex: '#4EAA25' },
  PHP: { Icon: SiPhp, hex: '#777BB4' },
  'C / C++': { Icon: SiCplusplus, hex: '#00599C' },
  'C#': { Icon: TbBrandCSharp, hex: '#512BD4' },
  SQL: { Icon: Database },
  HTML5: { Icon: SiHtml5, hex: '#E34F26' },
  CSS3: { Icon: SiCss, hex: '#663399' },

  // Frontend
  React: { Icon: SiReact, hex: '#61DAFB' },
  Tailwind: { Icon: SiTailwindcss, hex: '#06B6D4' },
  'Vue.js': { Icon: SiVuedotjs, hex: '#4FC08D' },
  'Bootstrap / SASS': { Icon: SiBootstrap, hex: '#7952B3' },
  Vite: { Icon: SiVite, hex: '#646CFF' },

  // Backend & APIs
  FastAPI: { Icon: SiFastapi, hex: '#009688' },
  'Node.js': { Icon: SiNodedotjs, hex: '#5FA04E' },
  Express: { Icon: SiExpress, hex: '#000000' },
  Laravel: { Icon: SiLaravel, hex: '#FF2D20' },
  'Spring Boot': { Icon: SiSpringboot, hex: '#6DB33F' },
  '.NET': { Icon: SiDotnet, hex: '#512BD4' },
  'REST APIs': { Icon: Webhook },
  REST: { Icon: Webhook },
  WebSockets: { Icon: ArrowLeftRight },
  WebSocket: { Icon: ArrowLeftRight },
  JWT: { Icon: SiJsonwebtokens, hex: '#000000' },
  'Swagger / OpenAPI': { Icon: SiSwagger, hex: '#85EA2D' },

  // Databases
  PostgreSQL: { Icon: SiPostgresql, hex: '#4169E1' },
  PostGIS: { Icon: Map },
  // Simple Icons' MySQL is a wordmark, unreadable at 18px: Tabler's dolphin, same brand blue
  MySQL: { Icon: TbBrandMysql, hex: '#4479A1' },
  Redis: { Icon: SiRedis, hex: '#FF4438' },
  // its logo is a wordmark ("SQLA"), unreadable at this size: a plain database glyph in ink
  SQLAlchemy: { Icon: Database },
  'SQLAlchemy 2.0': { Icon: Database },

  // DevOps & Cloud
  Docker: { Icon: SiDocker, hex: '#2496ED' },
  'GitHub Actions': { Icon: SiGithubactions, hex: '#2088FF' },
  'CI/CD': { Icon: Workflow },
  Nginx: { Icon: SiNginx, hex: '#009639' },
  Networking: { Icon: Network },
  'Windows Server': { Icon: FaWindows, hex: '#0078D4' },
  Linux: { Icon: SiLinux, hex: '#FCC624' },
  Git: { Icon: SiGit, hex: '#F05032' },
  Kafka: { Icon: SiApachekafka, hex: '#231F20' },
  Vercel: { Icon: SiVercel, hex: '#000000' },

  // Architecture, testing & methods
  'Software Architecture': { Icon: Network },
  Hexagonal: { Icon: Hexagon },
  'Hexagonal Architecture': { Icon: Hexagon },
  Microservices: { Icon: Boxes },
  UML: { Icon: SiUml, hex: '#FABD14' },
  OOP: { Icon: Component },
  Agile: { Icon: Repeat },
  Pytest: { Icon: SiPytest, hex: '#0A9EDC' },
  'Pytest / Jest': { Icon: SiPytest, hex: '#0A9EDC' },
  Jest: { Icon: SiJest, hex: '#C21325' },
  Playwright: { Icon: FlaskConical },

  // AI & vision
  'scikit-learn': { Icon: SiScikitlearn, hex: '#F7931E' },
  'Computer Vision': { Icon: Eye },
  'Machine Vision': { Icon: Eye },
  // LabVIEW's logo is a wordmark too: a camera, as before (machine vision)
  LabVIEW: { Icon: Camera },
  'OpenAI / LLM APIs': { Icon: SiOpenai, hex: '#412991' },

  // Mobile & other
  Android: { Icon: SiAndroid, hex: '#34A853' },
  'iOS (Swift)': { Icon: SiSwift, hex: '#F05138' },
  Flutter: { Icon: SiFlutter, hex: '#02569B' },
  'Industrial Automation': { Icon: Factory },
  'KUKA Robots': { Icon: Factory },
  'Low-Code': { Icon: Blocks },

  // Roadmap / learning
  AWS: { Icon: FaAws, hex: '#FF9900' },
  Kubernetes: { Icon: SiKubernetes, hex: '#326CE5' },
  'Next.js': { Icon: SiNextdotjs, hex: '#000000' },
  GraphQL: { Icon: SiGraphql, hex: '#E10098' },
  Terraform: { Icon: SiTerraform, hex: '#844FBA' },
  MongoDB: { Icon: SiMongodb, hex: '#47A248' },
  PyTorch: { Icon: SiPytorch, hex: '#EE4C2C' },
  LangChain: { Icon: SiLangchain, hex: '#1C3C3C' },
}

// ── colour that stays legible ─────────────────────────────────────────────
// A logo is a graphic: it needs 3:1 against the chip behind it (WCAG 1.4.11).
// The chip is --card: #ffffff by day, #131a2a by night (src/index.css).
// The official hex is kept whenever it passes; otherwise it is darkened (day) or
// lightened (night) just enough, same hue. Black logos (Next.js, Kafka, JWT...)
// take the ink colour at night, as the brands themselves do on dark backgrounds.
const DAY_CARD = '#ffffff'
const NIGHT_CARD = '#131a2a'
const MIN = 3

type RGB = [number, number, number]
const rgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const lum = (c: RGB) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a: string, b: string) {
  const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
function legible(hex: string, bg: string, toward: number) {
  const c = rgb(hex)
  for (let t = 0; t <= 1; t += 0.04) {
    const out = toHex(c.map((v) => v + (toward - v) * t) as RGB)
    if (contrast(out, bg) >= MIN) return out
  }
  return toHex([toward, toward, toward])
}
const isBlackLogo = (hex: string) => {
  const c = rgb(hex)
  return Math.max(...c) - Math.min(...c) < 40 && lum(c) < 0.05
}

export interface TechMeta {
  Icon: IconComp
  /** colour on the day chip / on the night chip (CSS colour) */
  day: string
  night: string
  plate?: string
  /** has an official logo (false: a concept drawn in ink) */
  brand: boolean
}

function resolve({ Icon, hex, plate }: TechDef): TechMeta {
  if (!hex) return { Icon, day: 'var(--ink-2)', night: 'var(--ink-2)', brand: false }
  // a plate logo is read through its letters (black JS on yellow): the letters carry the contrast
  const day = plate ? hex : legible(hex, DAY_CARD, 0)
  const night = isBlackLogo(hex) ? 'var(--ink)' : plate ? hex : legible(hex, NIGHT_CARD, 255)
  return { Icon, day, night, plate, brand: true }
}

const RESOLVED: Record<string, TechMeta> = Object.fromEntries(Object.entries(TECH).map(([k, v]) => [k, resolve(v)]))
const FALLBACK: TechMeta = { Icon: Code2, day: 'var(--ink-2)', night: 'var(--ink-2)', brand: false }

export function getTech(label: string): TechMeta {
  return RESOLVED[label] ?? FALLBACK
}

/**
 * Brand colours by default (day/night variants through CSS variables, so the
 * prerendered HTML is the same for both themes; see .tech-brand in stack.css).
 * mono: inherit the text colour instead.
 */
export function TechLogo({ label, className = '', mono }: { label: string; className?: string; mono?: boolean }) {
  const { Icon, day, night, plate } = getTech(label)
  if (mono) return <Icon className={className} aria-hidden />
  const style = { ['--tc-d' as string]: day, ['--tc-n' as string]: night, background: plate, borderRadius: plate ? 1 : undefined } as CSSProperties
  return <Icon className={`tech-brand ${className}`} style={style} aria-hidden />
}
