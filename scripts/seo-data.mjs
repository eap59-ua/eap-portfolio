// Single source of truth for per-route SEO + OG generation.
// Consumed by scripts/generate-og.mjs (builds the images) and
// scripts/prerender.mjs (injects the per-project <head> at build time).
export const SITE_URL = 'https://eap-portfolio.vercel.app'

export const PROJECT_SEO = [
  {
    slug: 'ecoalerta',
    name: 'EcoAlerta',
    kicker: 'FINAL DEGREE PROJECT · 10/10 · 2026',
    ogTitle: 'EcoAlerta — Environmental incident PWA · Final Degree Project (10/10)',
    description:
      'PWA to report environmental incidents — GIS spatial search, three roles, admin panel and full end-to-end testing.',
    tags: ['React', 'Node.js', 'PostGIS', 'Docker'],
    accentA: '#34d399',
    accentB: '#10b981',
  },
  {
    slug: 'hydrofulness',
    name: 'Hydrofulness',
    kicker: 'AMAEM HACKATHON · 2026',
    ogTitle: 'Hydrofulness — Water intelligence (AMAEM Hackathon 2026)',
    description:
      'Water intelligence: anomaly detection with Isolation Forest, real-data ETL and neighborhood water-stress prediction.',
    tags: ['FastAPI', 'React', 'scikit-learn', 'Docker'],
    accentA: '#38bdf8',
    accentB: '#0ea5e9',
  },
  {
    slug: 'food-donation',
    name: 'Food Donation Network',
    kicker: 'SOFTWARE ENGINEERING · 2026',
    ogTitle: 'Food Donation Network — Hexagonal FastAPI backend',
    description:
      'Backend linking donors with NGOs and food banks — hexagonal architecture, async PostgreSQL and JWT auth.',
    tags: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT'],
    accentA: '#f0abfc',
    accentB: '#e879f9',
  },
  {
    slug: 'studysync',
    name: 'StudySync',
    kicker: 'PERSONAL PROJECT · 2026',
    ogTitle: 'StudySync — Realtime collaborative study platform',
    description:
      'Realtime study rooms with video (LiveKit), server-authoritative Pomodoro on Redis and peer-reviewed notes.',
    tags: ['FastAPI', 'React', 'Redis', 'LiveKit', 'WebSocket'],
    accentA: '#a78bfa',
    accentB: '#818cf8',
  },
  {
    slug: 'easycab',
    name: 'EasyCab',
    kicker: 'DISTRIBUTED SYSTEMS · 2025',
    ogTitle: 'EasyCab — Distributed ride-hailing on Apache Kafka',
    description:
      'Distributed ride-hailing on Apache Kafka — hub-and-spoke fleet control, PostgreSQL row-locking, TLS + JWT.',
    tags: ['Python', 'Apache Kafka', 'PostgreSQL', 'TLS · JWT'],
    accentA: '#fbbf24',
    accentB: '#f59e0b',
  },
]
