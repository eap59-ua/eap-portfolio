// Single source of truth for per-route SEO + OG generation.
// Consumed by scripts/generate-og.mjs (builds the images) and
// scripts/prerender.mjs (injects the per-project <head> at build time).
export const SITE_URL = 'https://eap-portfolio.vercel.app'

export const PROJECT_SEO = [
  {
    slug: 'ecoalerta',
    name: 'EcoAlerta',
    kicker: 'TFG · MATRÍCULA DE HONOR (10/10) · 2026',
    ogTitle: 'EcoAlerta — PWA de incidencias medioambientales · TFG (10/10)',
    description:
      'PWA para reportar incidencias medioambientales: búsqueda con PostGIS, tres roles con JWT y tests end-to-end.',
    tags: ['React', 'Node.js', 'PostGIS', 'Docker'],
    accentA: '#34d399',
    accentB: '#10b981',
  },
  {
    slug: 'hydrofulness',
    name: 'Hydrofulness',
    kicker: 'HACKATHON AGUAS DE ALICANTE · 2026',
    ogTitle: 'Hydrofulness — Inteligencia hídrica (Hackathon Aguas de Alicante 2026)',
    description:
      'Anomalías de consumo con Isolation Forest, ETL de datos reales y predicción de estrés hídrico por barrio.',
    tags: ['FastAPI', 'React', 'scikit-learn', 'Docker'],
    accentA: '#38bdf8',
    accentB: '#0ea5e9',
  },
  {
    slug: 'food-donation',
    name: 'Red de Donación de Alimentos',
    kicker: 'INGENIERÍA WEB · UA · 2026',
    ogTitle: 'Red de Donación de Alimentos — Backend FastAPI con arquitectura hexagonal',
    description:
      'API REST que conecta donantes con ONGs y bancos de alimentos: arquitectura hexagonal, PostgreSQL y JWT.',
    tags: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT'],
    accentA: '#f0abfc',
    accentB: '#e879f9',
  },
  {
    slug: 'studysync',
    name: 'StudySync',
    kicker: 'PROYECTO PERSONAL · EN CURSO',
    ogTitle: 'StudySync — Plataforma de estudio colaborativo en tiempo real',
    description:
      'Salas de estudio con vídeo (LiveKit), Pomodoro sincronizado en servidor con Redis y WebSocket, y apuntes.',
    tags: ['FastAPI', 'React', 'Redis', 'LiveKit', 'WebSocket'],
    accentA: '#a78bfa',
    accentB: '#818cf8',
  },
  {
    slug: 'easycab',
    name: 'EasyCab',
    kicker: 'SISTEMAS DISTRIBUIDOS · UA',
    ogTitle: 'EasyCab — Transporte distribuido sobre Apache Kafka',
    description:
      'Central, taxis y clientes sobre Apache Kafka: concurrencia en PostgreSQL con bloqueo de filas, TLS y JWT.',
    tags: ['Python', 'Apache Kafka', 'PostgreSQL', 'TLS · JWT'],
    accentA: '#fbbf24',
    accentB: '#f59e0b',
  },
]
