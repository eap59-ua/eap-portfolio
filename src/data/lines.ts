// One colour, one meaning, everywhere (map, board, platform, case study, OG).
// Source: commit 893ebf1 + docs/design-rationale.md. Chaos Crew: coral (2026-10-21).
export type LineId = 'l1' | 'eco' | 'donation' | 'hydro' | 'studysync' | 'easycab' | 'chaos' | 'cer'

export interface ProjectLine {
  line: LineId
  n: number
  /** light line colour that needs dark numerals (EasyCab yellow) */
  dark?: boolean
  /** dashed = still being built */
  dashed?: boolean
}

export const PROJECT_LINE: Record<string, ProjectLine> = {
  ecoalerta: { line: 'eco', n: 2 },
  'food-donation': { line: 'donation', n: 3 },
  hydrofulness: { line: 'hydro', n: 4 },
  studysync: { line: 'studysync', n: 5, dashed: true },
  easycab: { line: 'easycab', n: 6, dark: true },
  'chaos-crew': { line: 'chaos', n: 7, dark: true }, // white on coral is 3.8:1: dark numerals
}

export const lineVar = (line: LineId) => `var(--${line})`

type L = { es: string; en: string }

// What each project proves, as short facts a tech lead can verify in the repo.
export const EVIDENCE: Record<string, L[]> = {
  ecoalerta: [
    { es: 'Tests E2E · Playwright', en: 'E2E tests · Playwright' },
    { es: 'Cobertura >70 % (Jest)', en: '>70 % coverage (Jest)' },
    { es: 'OpenAPI / Swagger', en: 'OpenAPI / Swagger' },
    { es: '2FA TOTP', en: '2FA TOTP' },
  ],
  'food-donation': [
    { es: 'Arquitectura hexagonal', en: 'Hexagonal architecture' },
    { es: 'Tests de integración · Pytest + HTTPX', en: 'Integration tests · Pytest + HTTPX' },
    { es: 'SQLAlchemy 2.0 asíncrono', en: 'Async SQLAlchemy 2.0' },
    { es: 'OpenAPI en /docs', en: 'OpenAPI at /docs' },
  ],
  hydrofulness: [
    { es: 'Isolation Forest', en: 'Isolation Forest' },
    { es: 'ETL sobre datos reales', en: 'ETL on real data' },
    { es: '~14 endpoints REST', en: '~14 REST endpoints' },
    { es: 'Docker Compose', en: 'Docker Compose' },
  ],
  studysync: [
    { es: 'Vídeo en tiempo real · LiveKit', en: 'Real-time video · LiveKit' },
    { es: 'Redis + WebSocket', en: 'Redis + WebSocket' },
    { es: 'Pomodoro autoritativo en servidor', en: 'Server-authoritative Pomodoro' },
  ],
  easycab: [
    { es: 'Apache Kafka', en: 'Apache Kafka' },
    { es: 'Bloqueo de filas en PostgreSQL', en: 'PostgreSQL row locking' },
    { es: 'TLS + JWT', en: 'TLS + JWT' },
  ],
  'chaos-crew': [
    { es: 'Entity-Component-System (EnTT)', en: 'Entity-Component-System (EnTT)' },
    { es: 'Build multiplataforma · CMake', en: 'Cross-platform build · CMake' },
    { es: 'CI en GitHub Actions', en: 'CI on GitHub Actions' },
  ],
}
