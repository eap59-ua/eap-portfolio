import type { DiagramSpec } from '../components/projects/ArchitectureDiagram'

export interface CaseDecision {
  decision: string
  why: string
}

export interface CaseContent {
  oneLiner: string
  problem: string
  role: string
  architecture: string
  flow: string[]
  decisions: CaseDecision[]
  challenges: string[]
  results: string[]
}

export interface CaseStudy {
  slug: string
  stack: string[]
  diagram: DiagramSpec
  en: CaseContent
  es: CaseContent
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  ecoalerta: {
    slug: 'ecoalerta',
    stack: [
      'React 18', 'React Router v6', 'TailwindCSS', 'React-Leaflet', 'PWA / Service Workers',
      'Node.js 20 LTS', 'Express 4', 'PostgreSQL 16', 'PostGIS 3.4', 'JWT', 'TOTP 2FA (AES-256-GCM)',
      'Cloudflare Turnstile', 'Multer', 'Winston', 'Swagger / OpenAPI 3.0', 'Jest', 'Supertest',
      'Playwright', 'Docker & Docker Compose', 'Nginx',
    ],
    diagram: {
      pipeline: ['React 18 PWA', 'Express API', 'PostgreSQL + PostGIS'],
      aside: ['JWT + 2FA TOTP', 'Service Worker', 'Nginx', 'Docker Compose'],
    },
    en: {
      oneLiner: `A geospatial Progressive Web App that lets citizens report, track, and crowd-validate environmental incidents, routing them to the responsible local authorities through a role-based admin workflow.`,
      problem: `Environmental incidents such as illegal dumping, noise pollution, and damage to flora and fauna are often witnessed by citizens but never reach the authorities able to act on them, because there is no low-friction, location-aware channel to report and follow up. EcoAlerta closes that gap with an offline-capable PWA: citizens geolocate and document an incident in seconds, the public can validate its veracity, and a moderation and entity-assignment workflow drives each case through a clear state machine (Pending → Validated → In Progress → Resolved). It was built as a Final Degree Project (TFG) at the University of Alicante to demonstrate a production-shaped, full-stack GIS application rather than a throwaway prototype.`,
      role: `Sole author and full-stack engineer of the Final Degree Project (TFG) at the University of Alicante (C3 2025-2026 call, under academic supervision). Responsible end-to-end: product scoping, the React PWA frontend, the Node.js/Express API, the PostgreSQL/PostGIS data layer and spatial queries, security (JWT, 2FA TOTP, CAPTCHA), the Dockerized dev/prod environments, the test suites (Jest, Supertest, Playwright), and the written thesis. Defended on 11 Jun 2026 and graded 10/10 with Distinction (Matrícula de Honor).`,
      architecture: `A modular monorepo splitting a React 18 PWA frontend from a Node.js/Express REST API, backed by PostgreSQL 16 with the PostGIS 3.4 extension for spatial search. The backend follows a layered controllers/services/middlewares structure with JWT auth, OpenAPI docs, and structured logging. Everything runs through Docker Compose with separate dev (hot reload) and prod (Nginx reverse proxy) compositions.`,
      flow: [
        `A citizen opens the PWA and geolocates an incident via the browser Geolocation API or an interactive Leaflet map.`,
        `The frontend posts the incident (with photo upload via Multer) to the Express API at /api/v1/incidents, authenticated with a JWT.`,
        `The API validates input through middleware and persists the incident as a geometry in PostgreSQL/PostGIS.`,
        `Other users discover nearby incidents through GET /incidents/nearby, an R-Tree indexed PostGIS spatial query, and crowd-validate via votes and comments.`,
        `Moderators/admins triage from the admin panel: assign the case to a responsible entity (e.g. SEPRONA) and advance its state Pending → Validated → In Progress → Resolved.`,
        `The Service Worker caches the map and core reads so the app remains usable offline.`,
      ],
      decisions: [
        { decision: `PostgreSQL + PostGIS with R-Tree indexed spatial queries for the 'near me' search`, why: `Proximity search is the core of the product; PostGIS pushes geospatial filtering into the database with proper spatial indexing instead of doing slow, inaccurate distance math in the application layer.` },
        { decision: `Offline-first PWA with Service Workers rather than a native mobile app`, why: `Incidents are reported in the field where connectivity is unreliable; a PWA gives install-to-home-screen and cached map/read access on one codebase, avoiding native app-store friction for an academic project.` },
        { decision: `Layered backend (controllers / services / middlewares / routes) in a modular monorepo`, why: `Separating HTTP entry points from business use cases keeps controllers thin and logic testable, and a single repo versions and deploys frontend and backend together for a solo developer.` },
        { decision: `Mandatory 2FA TOTP for admins/entities with AES-256-GCM encrypted secrets, bcrypt recovery codes and anti-replay`, why: `Privileged accounts can reassign and resolve public incidents, so they warrant production-grade security; encrypting secrets at rest and blocking code reuse defends against database leaks and replay attacks.` },
        { decision: `Cloudflare Turnstile CAPTCHA on registration and throttled logins, plus a security audit log`, why: `A public reporting platform is a target for bots and credential stuffing; gating signup and throttled logins with CAPTCHA and auditing security events hardens the system against abuse.` },
        { decision: `Docker Compose with separate dev and prod compositions, fronted by Nginx in production`, why: `Reproducible environments make the GIS-heavy stack trivial to spin up for evaluation, and an Nginx reverse proxy serving the static build mirrors a realistic production topology.` },
      ],
      challenges: [
        `Performant proximity search: naive distance calculation over all incidents does not scale. Solved by modeling locations as PostGIS geometries and serving /incidents/nearby with R-Tree indexed spatial queries so filtering happens efficiently in the database.`,
        `Usable offline in the field: connectivity is unreliable where incidents occur. Solved with a PWA Service Worker that caches the map and core reads, giving install-to-home-screen behavior and basic offline access from one web codebase.`,
        `Production-grade account security on a student project: privileged roles can alter public records. Solved with JWT plus mandatory TOTP 2FA (AES-256-GCM secrets at rest, bcrypt recovery codes, anti-replay) and Cloudflare Turnstile CAPTCHA, with security events written to an audit log.`,
        `Trustworthy crowd-sourced data: public reports can be noisy or false. Addressed with a social veracity-voting and commenting layer plus a moderator/entity assignment workflow and an explicit incident state machine.`,
      ],
      results: [
        `Final Degree Project graded 10/10 with Distinction (Matrícula de Honor), defended 11 Jun 2026 at the University of Alicante.`,
        `Delivered a working, Dockerized full-stack PWA with three user roles (Citizen, Moderator/Admin, Entity) and a complete admin panel for assignment, metrics, and incident state transitions.`,
        `Backend covered by Jest/Supertest unit and integration tests reported at over 70% coverage, with Playwright end-to-end tests and Swagger/OpenAPI 3.0 docs.`,
        `Implemented production-grade security: JWT, mandatory TOTP 2FA with AES-256-GCM encrypted secrets and bcrypt recovery codes, plus Cloudflare Turnstile CAPTCHA and a security audit log.`,
      ],
    },
    es: {
      oneLiner: `Una PWA geoespacial que permite a la ciudadanía reportar, seguir y validar de forma colaborativa incidencias medioambientales, derivándolas a las autoridades locales responsables mediante un flujo administrativo basado en roles.`,
      problem: `Las incidencias medioambientales como los vertidos ilegales, la contaminación acústica o los daños a la flora y la fauna las presencia la ciudadanía, pero a menudo nunca llegan a las autoridades que pueden actuar, porque no existe un canal sencillo y geolocalizado para reportarlas y darles seguimiento. EcoAlerta cierra esa brecha con una PWA que funciona sin conexión: la ciudadanía geolocaliza y documenta una incidencia en segundos, el público puede validar su veracidad y un flujo de moderación y asignación a entidades hace avanzar cada caso por una máquina de estados clara (Pendiente → Validada → En progreso → Resuelta). Se desarrolló como Trabajo de Fin de Grado (TFG) en la Universidad de Alicante para demostrar una aplicación GIS full-stack con forma de producto real, no un prototipo desechable.`,
      role: `Autor único e ingeniero full-stack del Trabajo de Fin de Grado en la Universidad de Alicante (convocatoria C3 2025-2026, con supervisión académica). Responsable de extremo a extremo: definición de producto, el frontend PWA en React, la API en Node.js/Express, la capa de datos PostgreSQL/PostGIS y las consultas espaciales, la seguridad (JWT, 2FA TOTP, CAPTCHA), los entornos dockerizados de dev/prod, las suites de tests (Jest, Supertest, Playwright) y la memoria escrita. Defendido el 11 de junio de 2026 y calificado con 10/10 y Matrícula de Honor.`,
      architecture: `Un monorepo modular que separa un frontend PWA en React 18 de una API REST en Node.js/Express, con PostgreSQL 16 y la extensión PostGIS 3.4 para la búsqueda espacial. El backend sigue una estructura por capas (controllers/services/middlewares) con autenticación JWT, documentación OpenAPI y logging estructurado. Todo corre con Docker Compose, con composiciones separadas para desarrollo (hot reload) y producción (Nginx como reverse proxy).`,
      flow: [
        `La ciudadanía abre la PWA y geolocaliza una incidencia con la API de geolocalización del navegador o un mapa interactivo Leaflet.`,
        `El frontend envía la incidencia (con foto vía Multer) a la API Express en /api/v1/incidents, autenticada con un JWT.`,
        `La API valida la entrada con middleware y persiste la incidencia como geometría en PostgreSQL/PostGIS.`,
        `Otros usuarios descubren incidencias cercanas con GET /incidents/nearby, una consulta espacial PostGIS indexada con R-Tree, y validan mediante votos y comentarios.`,
        `Moderadores/administradores gestionan desde el panel: asignan el caso a una entidad responsable (p. ej. SEPRONA) y avanzan su estado Pendiente → Validada → En progreso → Resuelta.`,
        `El Service Worker cachea el mapa y las lecturas principales para que la app siga siendo usable sin conexión.`,
      ],
      decisions: [
        { decision: `PostgreSQL + PostGIS con consultas espaciales indexadas (R-Tree) para la búsqueda 'cerca de mí'`, why: `La búsqueda por proximidad es el núcleo del producto; PostGIS lleva el filtrado geoespacial a la base de datos con indexación espacial adecuada, en lugar de cálculos de distancia lentos e imprecisos en la capa de aplicación.` },
        { decision: `PWA offline-first con Service Workers en vez de una app móvil nativa`, why: `Las incidencias se reportan en campo, donde la conectividad es poco fiable; una PWA da instalación en pantalla de inicio y acceso cacheado al mapa con una sola base de código, evitando la fricción de las stores para un proyecto académico.` },
        { decision: `Backend por capas (controllers / services / middlewares / routes) en un monorepo modular`, why: `Separar los puntos de entrada HTTP de los casos de uso de negocio mantiene los controllers finos y la lógica testeable, y un único repo versiona y despliega frontend y backend juntos para un desarrollador en solitario.` },
        { decision: `2FA TOTP obligatorio para admins/entidades con secretos cifrados en AES-256-GCM, códigos de recuperación con bcrypt y anti-replay`, why: `Las cuentas privilegiadas pueden reasignar y resolver incidencias públicas, así que merecen seguridad de nivel producción; cifrar los secretos en reposo y bloquear la reutilización de códigos defiende ante filtraciones de base de datos y ataques de replay.` },
        { decision: `CAPTCHA Cloudflare Turnstile en el registro y en logins limitados, más un registro de auditoría de seguridad`, why: `Una plataforma pública de reportes es objetivo de bots y credential stuffing; proteger el registro y el login limitado con CAPTCHA y auditar los eventos de seguridad endurece el sistema frente al abuso.` },
        { decision: `Docker Compose con composiciones separadas de dev y prod, con Nginx en producción`, why: `Los entornos reproducibles hacen trivial levantar el stack GIS para evaluarlo, y un reverse proxy Nginx sirviendo el build estático refleja una topología de producción realista.` },
      ],
      challenges: [
        `Búsqueda por proximidad eficiente: calcular distancias de forma ingenua sobre todas las incidencias no escala. Resuelto modelando las ubicaciones como geometrías PostGIS y sirviendo /incidents/nearby con consultas espaciales indexadas con R-Tree, para que el filtrado ocurra en la base de datos.`,
        `Usable sin conexión en campo: la conectividad es poco fiable donde ocurren las incidencias. Resuelto con un Service Worker (PWA) que cachea el mapa y las lecturas principales, dando instalación en pantalla de inicio y acceso offline básico desde una sola base de código web.`,
        `Seguridad de cuentas de nivel producción en un proyecto de estudiante: los roles privilegiados pueden alterar registros públicos. Resuelto con JWT más 2FA TOTP obligatorio (secretos AES-256-GCM en reposo, códigos de recuperación con bcrypt, anti-replay) y CAPTCHA Cloudflare Turnstile, con los eventos de seguridad en un registro de auditoría.`,
        `Datos colaborativos fiables: los reportes públicos pueden ser ruidosos o falsos. Abordado con una capa social de votación de veracidad y comentarios, más un flujo de moderación/asignación a entidades y una máquina de estados explícita.`,
      ],
      results: [
        `Trabajo de Fin de Grado calificado con 10/10 y Matrícula de Honor, defendido el 11 de junio de 2026 en la Universidad de Alicante.`,
        `Entrega de una PWA full-stack funcional y dockerizada con tres roles de usuario (Ciudadano, Moderador/Admin, Entidad) y un panel de administración completo para asignación, métricas y transiciones de estado.`,
        `Backend cubierto por tests unitarios y de integración con Jest/Supertest con más del 70% de cobertura, tests end-to-end con Playwright y documentación de API con Swagger/OpenAPI 3.0.`,
        `Seguridad de nivel producción: JWT, 2FA TOTP obligatorio con secretos cifrados en AES-256-GCM y códigos de recuperación con bcrypt, además de CAPTCHA Cloudflare Turnstile y un registro de auditoría de seguridad.`,
      ],
    },
  },

  hydrofulness: {
    slug: 'hydrofulness',
    stack: [
      'FastAPI', 'Python 3.11', 'scikit-learn (Isolation Forest)', 'Pandas', 'SQLAlchemy', 'SQLite',
      'React 18', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Recharts', 'Leaflet', 'Docker / Docker Compose',
    ],
    diagram: {
      pipeline: ['Data + ETL', 'scikit-learn ML', 'FastAPI', 'React + TS UI'],
      aside: ['SQLite', 'Leaflet · Recharts', 'Docker Compose'],
    },
    en: {
      oneLiner: `A full-stack water-intelligence platform that detects neighborhood-level consumption anomalies and forecasts water-stress scenarios for the municipal water utility of Alicante.`,
      problem: `Municipal water utilities need to spot abnormal consumption (leaks, fraud, meter faults) and anticipate water-stress hotspots before they escalate, but the underlying data is fragmented and hard to act on. Built during the AMAEM 2026 hackathon with real client Aguas de Alicante and real consumption data, Hydrofulness turns raw municipal records into an actionable signal: it ingests and cleanses the data, flags anomalies with machine learning, computes a per-neighborhood stress index, and surfaces it all through an interactive dashboard.`,
      role: `Software engineer on the hackathon team, contributing across the full stack: the FastAPI backend (REST API, ETL pipeline, SQLAlchemy/SQLite persistence), the scikit-learn ML layer (Isolation Forest anomaly detection and the stress-index computation), and the React + TypeScript + Vite frontend with map and chart visualizations. Delivered against a real client brief and a fixed hackathon timeframe.`,
      architecture: `A containerized two-tier application: a Python FastAPI backend that runs an ETL pipeline over municipal water data, persists it to SQLite via SQLAlchemy, and exposes ~14 REST endpoints; and a React + TypeScript SPA that consumes those endpoints to render maps, charts, and anomaly/stress views. ML (Isolation Forest, stress-index formula) runs in the backend on the cleansed data. Docker Compose ties the services together, with Vercel/GitHub Pages as alternative frontend hosting paths.`,
      flow: [
        `Ingest real municipal water consumption data from Aguas de Alicante.`,
        `An ETL pipeline loads, cleanses and transforms the records.`,
        `Cleansed data is persisted to SQLite via SQLAlchemy.`,
        `Isolation Forest detects consumption anomalies; an IEH formula computes the per-neighborhood stress index.`,
        `FastAPI exposes consumption, anomalies, stress and prediction data via ~14 REST endpoints.`,
        `The React + TypeScript frontend fetches the API and renders maps (Leaflet), charts (Recharts) and anomaly/stress dashboards.`,
      ],
      decisions: [
        { decision: `Isolation Forest for anomaly detection`, why: `Unsupervised tree-based method that flags abnormal consumption without labeled fraud/leak data, which a hackathon dataset would not have. Scales to many records and needs little tuning — a pragmatic fit for the timeframe.` },
        { decision: `FastAPI + Pydantic for the backend API`, why: `Async Python framework with automatic OpenAPI/Swagger docs, giving the frontend a typed, self-documenting contract over ~14 endpoints and fast iteration during the hackathon.` },
        { decision: `SQLite via SQLAlchemy instead of a heavier RDBMS`, why: `Zero-ops, file-based storage keeps the stack reproducible and easy to ship in Docker for a demo, while SQLAlchemy keeps the door open to swap in PostgreSQL later without rewriting data access.` },
        { decision: `React + TypeScript + Vite with Leaflet and Recharts`, why: `End-to-end TypeScript reduces integration bugs against the API; Leaflet handles the neighborhood-level geographic view and Recharts the time-series consumption charts, matching the spatial nature of the problem.` },
        { decision: `Docker Compose plus a mock-data fallback for hosting`, why: `Compose makes the multi-service app reproducible for judges and teammates; the Vercel/GitHub Pages path with mock data lets the frontend be demoed even when the backend isn't running.` },
      ],
      challenges: [
        `Working with real, messy municipal data from Aguas de Alicante meant a non-trivial ETL stage was needed up front to load, cleanse and transform records before any modeling could be trusted.`,
        `Detecting anomalies without labeled ground truth — solved by choosing an unsupervised Isolation Forest, which flags outliers from the data distribution itself rather than from known leak/fraud labels.`,
        `Quantifying an abstract concept (water stress) into something a dashboard can rank by neighborhood — addressed by computing an explicit stress index (IEH formula) over the cleansed data.`,
        `Delivering a working full-stack demo under hackathon time pressure — handled by keeping infra light (SQLite, Docker Compose) and adding a mock-data fallback so the frontend stays demoable independently of the backend.`,
      ],
      results: [
        `Delivered a working end-to-end water-intelligence prototype for a real client (Aguas de Alicante) within the AMAEM 2026 hackathon.`,
        `Built an ETL-to-API-to-UI pipeline: real municipal data is cleansed, scored for anomalies (Isolation Forest), assigned a neighborhood stress index, and served through ~14 REST endpoints with Swagger docs.`,
        `Shipped an interactive React + TypeScript dashboard with map (Leaflet) and time-series (Recharts) views over consumption, anomalies and stress metrics.`,
        `Packaged as a reproducible Docker Compose stack with a mock-data fallback; released under MIT. As a hackathon build, model accuracy and production-scale metrics were not formally measured.`,
      ],
    },
    es: {
      oneLiner: `Plataforma full-stack de inteligencia hídrica que detecta anomalías de consumo a nivel de barrio y predice escenarios de estrés hídrico para la empresa municipal de aguas de Alicante.`,
      problem: `Las empresas municipales de agua necesitan detectar consumos anómalos (fugas, fraude, contadores defectuosos) y anticipar focos de estrés hídrico antes de que se agraven, pero los datos subyacentes están fragmentados y son difíciles de explotar. Desarrollado durante el hackathon AMAEM 2026 con el cliente real Aguas de Alicante y datos de consumo reales, Hydrofulness convierte registros municipales en bruto en una señal accionable: ingiere y depura los datos, marca anomalías con machine learning, calcula un índice de estrés por barrio y lo presenta todo en un dashboard interactivo.`,
      role: `Ingeniero de software en el equipo del hackathon, contribuyendo en todo el stack: el backend FastAPI (API REST, pipeline ETL, persistencia con SQLAlchemy/SQLite), la capa de ML con scikit-learn (detección de anomalías con Isolation Forest y el cálculo del índice de estrés) y el frontend en React + TypeScript + Vite con visualizaciones de mapa y gráficas. Entregado contra un brief de cliente real y un plazo cerrado de hackathon.`,
      architecture: `Una aplicación en dos capas y contenerizada: un backend Python FastAPI que ejecuta un pipeline ETL sobre datos municipales de agua, los persiste en SQLite vía SQLAlchemy y expone ~14 endpoints REST; y una SPA en React + TypeScript que consume esos endpoints para renderizar mapas, gráficas y vistas de anomalías/estrés. El ML (Isolation Forest, fórmula del índice de estrés) corre en el backend sobre los datos depurados. Docker Compose une los servicios, con Vercel/GitHub Pages como vías alternativas de hosting del frontend.`,
      flow: [
        `Ingesta de datos reales de consumo de agua municipal de Aguas de Alicante.`,
        `Un pipeline ETL carga, depura y transforma los registros.`,
        `Los datos depurados se persisten en SQLite vía SQLAlchemy.`,
        `Isolation Forest detecta anomalías de consumo; una fórmula IEH calcula el índice de estrés por barrio.`,
        `FastAPI expone consumo, anomalías, estrés y predicciones a través de ~14 endpoints REST.`,
        `El frontend React + TypeScript consume la API y renderiza mapas (Leaflet), gráficas (Recharts) y dashboards de anomalías/estrés.`,
      ],
      decisions: [
        { decision: `Isolation Forest para la detección de anomalías`, why: `Método no supervisado basado en árboles que marca consumos anómalos sin datos etiquetados de fraude/fugas, que un dataset de hackathon no tendría. Escala a muchos registros y necesita poco ajuste — un encaje pragmático para el plazo.` },
        { decision: `FastAPI + Pydantic para la API del backend`, why: `Framework async de Python con documentación OpenAPI/Swagger automática, que da al frontend un contrato tipado y autodocumentado sobre ~14 endpoints y una iteración rápida durante el hackathon.` },
        { decision: `SQLite vía SQLAlchemy en lugar de un RDBMS más pesado`, why: `Almacenamiento en fichero y sin operaciones mantiene el stack reproducible y fácil de empaquetar en Docker para la demo, mientras SQLAlchemy deja la puerta abierta a migrar a PostgreSQL más adelante sin reescribir el acceso a datos.` },
        { decision: `React + TypeScript + Vite con Leaflet y Recharts`, why: `TypeScript de punta a punta reduce errores de integración contra la API; Leaflet maneja la vista geográfica por barrios y Recharts las series temporales de consumo, acorde a la naturaleza espacial del problema.` },
        { decision: `Docker Compose más un fallback de datos mock para el hosting`, why: `Compose hace reproducible la app multiservicio para jurado y compañeros; la vía Vercel/GitHub Pages con datos mock permite demostrar el frontend aunque el backend no esté corriendo.` },
      ],
      challenges: [
        `Trabajar con datos municipales reales y desordenados de Aguas de Alicante exigió una etapa ETL no trivial al inicio para cargar, depurar y transformar los registros antes de poder confiar en cualquier modelo.`,
        `Detectar anomalías sin verdad etiquetada — resuelto eligiendo un Isolation Forest no supervisado, que marca outliers a partir de la propia distribución de los datos en vez de etiquetas conocidas de fuga/fraude.`,
        `Cuantificar un concepto abstracto (el estrés hídrico) en algo que un dashboard pueda ordenar por barrio — abordado calculando un índice de estrés explícito (fórmula IEH) sobre los datos depurados.`,
        `Entregar una demo full-stack funcional bajo la presión de tiempo del hackathon — gestionado manteniendo la infraestructura ligera (SQLite, Docker Compose) y añadiendo un fallback de datos mock para que el frontend siga siendo demostrable de forma independiente al backend.`,
      ],
      results: [
        `Se entregó un prototipo de inteligencia hídrica funcional de extremo a extremo para un cliente real (Aguas de Alicante) dentro del hackathon AMAEM 2026.`,
        `Se construyó un flujo ETL-a-API-a-UI: los datos municipales reales se depuran, se puntúan en busca de anomalías (Isolation Forest), se les asigna un índice de estrés por barrio y se sirven a través de ~14 endpoints REST con documentación Swagger.`,
        `Se desarrolló un dashboard interactivo en React + TypeScript con vistas de mapa (Leaflet) y series temporales (Recharts) sobre consumo, anomalías y métricas de estrés.`,
        `Empaquetado como una stack reproducible con Docker Compose y datos mock de respaldo; publicado bajo licencia MIT. Al ser un proyecto de hackathon, no se midieron formalmente la precisión del modelo ni métricas a escala de producción.`,
      ],
    },
  },

  'food-donation': {
    slug: 'food-donation',
    stack: [
      'FastAPI', 'Python 3.11', 'PostgreSQL 16', 'SQLAlchemy 2.0 (async)', 'JWT (python-jose)',
      'bcrypt / passlib', 'Pytest + HTTPX', 'Docker / Docker Compose', 'Poetry',
    ],
    diagram: {
      pipeline: ['Presentation', 'Application', 'Domain', 'Infrastructure', 'PostgreSQL 16'],
      aside: ['JWT auth', 'Async SQLAlchemy 2.0', 'Docker Compose', 'Pytest + HTTPX'],
    },
    en: {
      oneLiner: `An async FastAPI backend, built on a strict hexagonal architecture, that matches food donors (restaurants, supermarkets) with receivers (NGOs, food banks) to cut waste.`,
      problem: `Edible surplus from restaurants and supermarkets is routinely discarded while NGOs and food banks struggle to source it in time. No shared, structured channel lets donors publish available food with location and status, and lets receivers discover, request, and claim it. This backend, built as a Cloud & Distributed Systems course project (2026), provides that channel: a domain-driven API modeling donors, receivers, donations, and requests, with authenticated workflows for publishing, requesting, and approving food handovers.`,
      role: `Backend engineer on a university Cloud & Distributed Systems team project (2026). Responsible for designing and implementing the API following a strict hexagonal (ports-and-adapters) architecture, the async PostgreSQL data layer with SQLAlchemy 2.0, JWT-based authentication, and the Dockerized runtime and integration test suite.`,
      architecture: `A FastAPI service organized in four strictly separated hexagonal layers. Presentation exposes REST routes and auth middleware; Application holds services, DTOs, and business logic; Domain contains pure entities (user, donation, request) with no framework or persistence dependencies; Infrastructure implements async SQLAlchemy 2.0 ORM models and PostgreSQL access. Dependencies point inward toward the domain. The stack runs in Docker via Docker Compose, and integration tests swap PostgreSQL for in-memory SQLite.`,
      flow: [
        `The client sends an HTTP request to a FastAPI route in the Presentation layer.`,
        `Auth middleware validates the JWT and resolves the current user.`,
        `The route delegates to an Application service, passing/returning DTOs.`,
        `The service applies business rules using pure Domain entities.`,
        `The service calls an Infrastructure repository for persistence.`,
        `Infrastructure executes async SQLAlchemy queries against PostgreSQL 16.`,
        `The result flows back out as a DTO and is serialized to JSON in the response.`,
      ],
      decisions: [
        { decision: `Strict hexagonal (ports-and-adapters) architecture with four layers`, why: `Keeps the Domain free of FastAPI and SQLAlchemy dependencies, so business rules are testable in isolation and infrastructure can be swapped without touching core logic — a clean fit for a Cloud & Distributed Systems brief.` },
        { decision: `Async PostgreSQL with SQLAlchemy 2.0`, why: `The async engine and 2.0-style API let request handlers do non-blocking I/O, matching FastAPI's async model and giving the service room to handle concurrent donor/receiver traffic efficiently.` },
        { decision: `Stateless JWT auth (python-jose) with bcrypt password hashing (passlib)`, why: `Tokens (HS256, 24h expiry) keep the API stateless and horizontally scalable; bcrypt protects credentials at rest with a well-vetted hashing scheme.` },
        { decision: `In-memory SQLite (aiosqlite) for the integration test suite`, why: `Lets Pytest + HTTPX exercise real API routes end-to-end fast and without external services, while production runs on PostgreSQL 16 — the hexagonal boundary makes this DB swap clean.` },
        { decision: `Docker Compose for the full runtime`, why: `One \`docker compose up --build\` brings up API plus database, giving reviewers a reproducible environment and reflecting the course's distributed-deployment focus.` },
      ],
      challenges: [
        `Keeping the Domain layer truly pure: enforcing that domain entities carry no FastAPI/SQLAlchemy imports requires disciplined dependency direction and DTO mapping at the Application boundary; the payoff is domain logic that is unit-testable without a database or web server.`,
        `Async persistence correctness: moving to async SQLAlchemy 2.0 means careful session and transaction lifecycle handling so concurrent requests don't share or leak sessions — the main infrastructure risk.`,
        `Dual-database parity: tests run on in-memory SQLite while production uses PostgreSQL 16, so data access must avoid backend-specific behavior to keep tests representative — solved by routing all DB access through Infrastructure repositories behind the hexagonal port.`,
        `Modeling the donation/request lifecycle: donations move through statuses and requests must be approved or denied by the donor, so these state transitions and authorization rules live in the Application/Domain layers rather than in route handlers.`,
      ],
      results: [
        `Working API with JWT authentication and complete donation/request workflows: register/login, publish and edit donations, list with status/location filters, submit requests, and donor approve/deny.`,
        `Strict hexagonal architecture with four separated layers (Domain, Application, Infrastructure, Presentation), keeping the Domain free of framework and persistence dependencies.`,
        `Async data layer on PostgreSQL 16 with SQLAlchemy 2.0, designed for concurrent request handling.`,
        `Integration test suite (Pytest + HTTPX over in-memory SQLite) and a one-command Docker Compose deployment with auto-generated OpenAPI docs at /docs. Academic project, in progress — no production usage metrics are claimed.`,
      ],
    },
    es: {
      oneLiner: `Un backend asíncrono en FastAPI, construido sobre una arquitectura hexagonal estricta, que conecta donantes de alimentos (restaurantes, supermercados) con receptores (ONGs, bancos de alimentos) para reducir el desperdicio.`,
      problem: `El excedente comestible de restaurantes y supermercados se desecha de forma habitual mientras ONGs y bancos de alimentos tienen dificultades para conseguirlo a tiempo. No existe un canal compartido y estructurado que permita a los donantes publicar alimentos disponibles con ubicación y estado, y a los receptores descubrirlos, solicitarlos y reclamarlos. Este backend, desarrollado como proyecto de la asignatura de Sistemas Cloud y Distribuidos (2026), aporta ese canal: una API orientada al dominio que modela donantes, receptores, donaciones y solicitudes, con flujos autenticados para publicar, solicitar y aprobar entregas de alimentos.`,
      role: `Ingeniero de backend en un proyecto universitario de la asignatura de Sistemas Cloud y Distribuidos (2026). Responsable de diseñar e implementar la API siguiendo una arquitectura hexagonal estricta (puertos y adaptadores), la capa de datos asíncrona en PostgreSQL con SQLAlchemy 2.0, la autenticación basada en JWT y el runtime dockerizado con su suite de tests de integración.`,
      architecture: `Un servicio FastAPI organizado en cuatro capas hexagonales estrictamente separadas. Presentación expone las rutas REST y el middleware de auth; Aplicación contiene servicios, DTOs y lógica de negocio; Dominio contiene entidades puras (usuario, donación, solicitud) sin dependencias de framework ni persistencia; Infraestructura implementa los modelos ORM async de SQLAlchemy 2.0 y el acceso a PostgreSQL. Las dependencias apuntan hacia dentro, hacia el dominio. El stack corre en Docker vía Docker Compose, y los tests de integración cambian PostgreSQL por SQLite en memoria.`,
      flow: [
        `El cliente envía una petición HTTP a una ruta FastAPI en la capa de Presentación.`,
        `El middleware de auth valida el JWT y resuelve el usuario actual.`,
        `La ruta delega en un servicio de la capa de Aplicación, pasando/devolviendo DTOs.`,
        `El servicio aplica reglas de negocio usando entidades puras de Dominio.`,
        `El servicio llama a un repositorio de Infraestructura para la persistencia.`,
        `Infraestructura ejecuta consultas async de SQLAlchemy contra PostgreSQL 16.`,
        `El resultado vuelve como DTO y se serializa a JSON en la respuesta.`,
      ],
      decisions: [
        { decision: `Arquitectura hexagonal estricta (puertos y adaptadores) con cuatro capas`, why: `Mantiene el Dominio libre de dependencias de FastAPI y SQLAlchemy, de modo que las reglas de negocio son testeables en aislamiento y la infraestructura se puede cambiar sin tocar la lógica central — un encaje limpio para un brief de Sistemas Cloud y Distribuidos.` },
        { decision: `PostgreSQL asíncrono con SQLAlchemy 2.0`, why: `El motor async y la API estilo 2.0 permiten a los handlers hacer E/S no bloqueante, acorde al modelo async de FastAPI y dando margen para manejar tráfico concurrente de donantes/receptores con eficiencia.` },
        { decision: `Auth JWT stateless (python-jose) con hashing bcrypt (passlib)`, why: `Los tokens (HS256, expiración 24h) mantienen la API stateless y escalable horizontalmente; bcrypt protege las credenciales en reposo con un esquema de hashing bien probado.` },
        { decision: `SQLite en memoria (aiosqlite) para la suite de tests de integración`, why: `Permite a Pytest + HTTPX ejercitar rutas reales de la API de extremo a extremo, rápido y sin servicios externos, mientras producción corre sobre PostgreSQL 16 — la frontera hexagonal hace limpio este cambio de BD.` },
        { decision: `Docker Compose para todo el runtime`, why: `Un solo \`docker compose up --build\` levanta API y base de datos, dando a revisores un entorno reproducible y reflejando el enfoque de despliegue distribuido de la asignatura.` },
      ],
      challenges: [
        `Mantener la capa de Dominio realmente pura: exigir que las entidades de dominio no tengan imports de FastAPI/SQLAlchemy requiere una dirección de dependencias disciplinada y mapeo de DTOs en la frontera de Aplicación; la recompensa es una lógica de dominio testeable por unidad sin base de datos ni servidor web.`,
        `Corrección de la persistencia asíncrona: pasar a SQLAlchemy 2.0 async implica un manejo cuidadoso del ciclo de vida de sesiones y transacciones para que las peticiones concurrentes no compartan ni filtren sesiones — el principal riesgo de infraestructura.`,
        `Paridad entre dos bases de datos: los tests corren sobre SQLite en memoria mientras producción usa PostgreSQL 16, así que el acceso a datos debe evitar comportamientos específicos de un motor — resuelto enrutando todo el acceso a BD por repositorios de Infraestructura tras el puerto hexagonal.`,
        `Modelar el ciclo de vida de donación/solicitud: las donaciones pasan por estados y las solicitudes deben ser aprobadas o denegadas por el donante, así que estas transiciones de estado y reglas de autorización viven en las capas de Aplicación/Dominio y no en los handlers de ruta.`,
      ],
      results: [
        `API funcional con autenticación JWT y flujos completos de donación y solicitud: registro/login, publicar y editar donaciones, listar con filtros de estado y ubicación, enviar solicitudes y aprobación/denegación por parte del donante.`,
        `Arquitectura hexagonal estricta con cuatro capas separadas (Dominio, Aplicación, Infraestructura, Presentación), manteniendo el Dominio libre de dependencias de framework y persistencia.`,
        `Capa de datos asíncrona sobre PostgreSQL 16 con SQLAlchemy 2.0, diseñada para manejar peticiones concurrentes.`,
        `Suite de tests de integración (Pytest + HTTPX sobre SQLite en memoria) y despliegue con un solo comando mediante Docker Compose, con documentación OpenAPI en /docs. Proyecto académico, en curso: no se reportan métricas de uso en producción.`,
      ],
    },
  },

  studysync: {
    slug: 'studysync',
    stack: [
      'FastAPI', 'Python 3.12', 'SQLAlchemy 2.0', 'PostgreSQL 16', 'Redis 7', 'WebSocket', 'LiveKit',
      'React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Kotlin', 'Jetpack Compose', 'Hilt', 'Retrofit',
      'Docker', 'GitHub Actions', 'Fly.io', 'GitHub Pages',
    ],
    diagram: {
      pipeline: ['PWA / Android', 'FastAPI', 'PostgreSQL 16'],
      aside: ['Redis · Pomodoro', 'WebSocket · sync', 'LiveKit · video', 'GitHub Actions'],
    },
    en: {
      oneLiner: `A real-time collaborative study platform where remote learners share video rooms, a server-synchronized Pomodoro timer, and peer-reviewed notes.`,
      problem: `Remote and independent learners lack the shared focus and accountability of an in-person study group: timers drift between participants, video and study tooling live in separate apps, and shared notes have no quality signal. StudySync brings these into one platform — co-located video rooms, a single server-authoritative Pomodoro that keeps every participant on the same cycle, and a notes exchange with peer reviews. It is a personal project started in 2026 and still in active development.`,
      role: `Sole developer (personal project, 2026). Owns the full stack end to end: backend domain and infrastructure (FastAPI, PostgreSQL, Redis), the real-time synchronization layer (WebSocket + Redis-backed Pomodoro), LiveKit video integration, the React/TypeScript PWA, an additional Kotlin/Jetpack Compose Android client, plus CI/CD and deployment.`,
      architecture: `A FastAPI backend structured with hexagonal architecture (domain, application, infrastructure, presentation layers) serves two clients: a React/TypeScript PWA and a native Kotlin/Jetpack Compose Android app. PostgreSQL is the source of truth for users, rooms, and notes; Redis holds the server-authoritative Pomodoro state so timers stay consistent across all participants. Real-time room state is pushed over WebSocket, and LiveKit provides the video/audio transport. Backend deploys to Fly.io, the PWA to GitHub Pages, and the Android app targets Google Play, each gated by GitHub Actions CI.`,
      flow: [
        `A user signs in via the PWA or Android client and joins a study room.`,
        `The API authenticates, persists room membership in PostgreSQL, and issues a LiveKit access token.`,
        `The client connects to LiveKit for video/audio in the room.`,
        `Pomodoro start/pause/reset commands hit the API, which mutates the authoritative timer state in Redis.`,
        `The backend broadcasts timer and room-state updates over WebSocket to every participant so all clients stay in sync.`,
        `Notes are uploaded, discovered, and peer-reviewed through the API and stored in PostgreSQL.`,
        `A rule-based recommender surfaces study suggestions from the user's history.`,
      ],
      decisions: [
        { decision: `Make the Pomodoro server-authoritative with state in Redis rather than per-client timers`, why: `Client-side timers drift apart due to network latency, tab throttling, and clock skew. A single authoritative source in Redis with WebSocket broadcast guarantees every participant sees the same cycle — the core promise of a shared study session.` },
        { decision: `Use WebSocket for room and timer state, with LiveKit handling video/audio separately`, why: `Separating low-bandwidth control/state signaling from high-bandwidth media lets each layer use the right transport. LiveKit offloads SFU media complexity, while WebSocket keeps state updates lightweight and low-latency.` },
        { decision: `Apply hexagonal architecture on the FastAPI backend`, why: `Isolating domain logic from frameworks and I/O keeps the timer, rooms, and notes rules testable in isolation and makes it easier to swap infrastructure without touching business rules — valuable for a solo developer maintaining the project long-term.` },
        { decision: `Ship a React PWA and a native Kotlin/Jetpack Compose Android client against the same API`, why: `A PWA gives instant, install-free web reach, while a native Android app delivers better mobile ergonomics and Play Store distribution. Sharing one FastAPI contract avoids duplicating backend logic across the two clients.` },
        { decision: `Gate backend and web with GitHub Actions CI and deploy to managed platforms (Fly.io, GitHub Pages, Google Play)`, why: `Separate CI pipelines catch regressions per surface, and managed deployment targets minimize ops overhead so a single developer can keep a multi-client system shippable.` },
      ],
      challenges: [
        `Keeping the Pomodoro consistent across all room participants despite latency and clock differences — solved by making the server the single source of truth, storing timer state in Redis, and broadcasting updates over WebSocket instead of trusting client-local timers.`,
        `Coordinating two transport concerns in one room — real-time control/state versus live video — addressed by layering WebSocket for state sync on top of LiveKit for media, so each handles what it is best suited for.`,
        `Serving two different clients (web PWA and native Android) without forking business logic — handled by a hexagonal FastAPI backend exposing a single API contract.`,
        `Adding a quality signal to a notes exchange where any user can upload — approached with a peer-review model so notes carry reviews rather than being an unfiltered dump.`,
      ],
      results: [
        `End-to-end real-time study room implemented: LiveKit video/audio plus a server-authoritative, Redis-backed Pomodoro synchronized across participants over WebSocket.`,
        `Hexagonal FastAPI backend (Python 3.12, SQLAlchemy 2.0) backed by PostgreSQL 16 and Redis 7, with separate backend and web CI pipelines on GitHub Actions.`,
        `Two clients against one API: a React 19 / TypeScript PWA and a native Kotlin / Jetpack Compose Android app, with deployment targets on Fly.io, GitHub Pages, and Google Play.`,
        `Project is in active development on a 12-week 2026 plan; no usage or performance metrics are claimed yet, as it has not reached a measured production milestone.`,
      ],
    },
    es: {
      oneLiner: `Una plataforma de estudio colaborativo en tiempo real donde estudiantes remotos comparten salas de vídeo, un temporizador Pomodoro sincronizado por el servidor y apuntes revisados por pares.`,
      problem: `Quienes estudian en remoto o por su cuenta no tienen el foco compartido ni la responsabilidad mutua de un grupo de estudio presencial: los temporizadores se desincronizan entre participantes, el vídeo y las herramientas de estudio viven en apps distintas, y los apuntes compartidos no tienen ninguna señal de calidad. StudySync los reúne en una sola plataforma: salas de vídeo conjuntas, un único Pomodoro con autoridad en el servidor que mantiene a todos en el mismo ciclo, y un intercambio de apuntes con revisiones por pares. Es un proyecto personal iniciado en 2026 y todavía en desarrollo activo.`,
      role: `Desarrollador único (proyecto personal, 2026). Dueño de todo el stack de extremo a extremo: dominio e infraestructura del backend (FastAPI, PostgreSQL, Redis), la capa de sincronización en tiempo real (WebSocket + Pomodoro respaldado en Redis), la integración de vídeo con LiveKit, la PWA en React/TypeScript, un cliente Android adicional en Kotlin/Jetpack Compose, además del CI/CD y el despliegue.`,
      architecture: `Un backend FastAPI estructurado con arquitectura hexagonal (capas de dominio, aplicación, infraestructura y presentación) sirve a dos clientes: una PWA en React/TypeScript y una app Android nativa en Kotlin/Jetpack Compose. PostgreSQL es la fuente de verdad para usuarios, salas y apuntes; Redis guarda el estado del Pomodoro con autoridad en el servidor para que los temporizadores sean consistentes entre todos los participantes. El estado de las salas en tiempo real se envía por WebSocket, y LiveKit aporta el transporte de vídeo/audio. El backend despliega en Fly.io, la PWA en GitHub Pages y la app Android apunta a Google Play, cada uno gobernado por CI de GitHub Actions.`,
      flow: [
        `Un usuario inicia sesión vía la PWA o el cliente Android y entra en una sala de estudio.`,
        `La API autentica, persiste la pertenencia a la sala en PostgreSQL y emite un token de acceso de LiveKit.`,
        `El cliente se conecta a LiveKit para el vídeo/audio de la sala.`,
        `Los comandos de Pomodoro (iniciar/pausar/reiniciar) llegan a la API, que muta el estado autoritativo del temporizador en Redis.`,
        `El backend difunde por WebSocket las actualizaciones de temporizador y estado de sala a cada participante para que todos los clientes queden sincronizados.`,
        `Los apuntes se suben, descubren y revisan por pares a través de la API y se almacenan en PostgreSQL.`,
        `Un recomendador basado en reglas sugiere estudio a partir del historial del usuario.`,
      ],
      decisions: [
        { decision: `Hacer el Pomodoro autoritativo en el servidor con el estado en Redis, en vez de temporizadores por cliente`, why: `Los temporizadores del lado del cliente se desincronizan por latencia de red, throttling de pestañas y desfase de reloj. Una única fuente autoritativa en Redis con difusión por WebSocket garantiza que cada participante vea el mismo ciclo — la promesa central de una sesión de estudio compartida.` },
        { decision: `Usar WebSocket para el estado de sala y temporizador, con LiveKit manejando vídeo/audio por separado`, why: `Separar la señalización de control/estado de bajo ancho de banda del medio de alto ancho de banda permite que cada capa use el transporte adecuado. LiveKit descarga la complejidad del SFU, mientras WebSocket mantiene las actualizaciones ligeras y de baja latencia.` },
        { decision: `Aplicar arquitectura hexagonal en el backend FastAPI`, why: `Aislar la lógica de dominio de frameworks y E/S mantiene las reglas de temporizador, salas y apuntes testeables en aislamiento y facilita cambiar infraestructura sin tocar las reglas de negocio — valioso para un desarrollador en solitario que mantiene el proyecto a largo plazo.` },
        { decision: `Publicar una PWA en React y un cliente Android nativo en Kotlin/Jetpack Compose contra la misma API`, why: `Una PWA da alcance web instantáneo y sin instalación, mientras una app Android nativa ofrece mejor ergonomía móvil y distribución en Play Store. Compartir un único contrato FastAPI evita duplicar la lógica de backend entre los dos clientes.` },
        { decision: `Gobernar backend y web con CI de GitHub Actions y desplegar en plataformas gestionadas (Fly.io, GitHub Pages, Google Play)`, why: `Pipelines de CI separadas detectan regresiones por superficie, y los destinos de despliegue gestionados minimizan la carga de operaciones para que un solo desarrollador mantenga un sistema multicliente entregable.` },
      ],
      challenges: [
        `Mantener el Pomodoro consistente entre todos los participantes pese a la latencia y las diferencias de reloj — resuelto haciendo del servidor la única fuente de verdad, guardando el estado en Redis y difundiendo actualizaciones por WebSocket en lugar de confiar en temporizadores locales.`,
        `Coordinar dos preocupaciones de transporte en una sala — control/estado en tiempo real frente a vídeo en vivo — abordado superponiendo WebSocket para la sincronización de estado sobre LiveKit para el medio, de modo que cada uno haga aquello para lo que mejor sirve.`,
        `Servir a dos clientes distintos (PWA web y Android nativo) sin bifurcar la lógica de negocio — resuelto con un backend FastAPI hexagonal que expone un único contrato de API.`,
        `Añadir una señal de calidad a un intercambio de apuntes donde cualquier usuario puede subir — abordado con un modelo de revisión por pares para que los apuntes lleven reseñas en vez de ser un volcado sin filtrar.`,
      ],
      results: [
        `Sala de estudio en tiempo real implementada de extremo a extremo: vídeo/audio con LiveKit más un Pomodoro con autoridad en el servidor, basado en Redis y sincronizado entre participantes por WebSocket.`,
        `Backend FastAPI con arquitectura hexagonal (Python 3.12, SQLAlchemy 2.0) sobre PostgreSQL 16 y Redis 7, con pipelines de CI separadas para backend y web en GitHub Actions.`,
        `Dos clientes contra una misma API: una PWA en React 19 / TypeScript y una app Android nativa en Kotlin / Jetpack Compose, con despliegue en Fly.io, GitHub Pages y Google Play.`,
        `El proyecto está en desarrollo activo según un plan de 12 semanas para 2026; aún no se reclaman métricas de uso ni de rendimiento, ya que no ha alcanzado un hito de producción medido.`,
      ],
    },
  },

  'chaos-crew': {
    slug: 'chaos-crew',
    stack: [
      'C++17', 'Raylib v5.0+', 'CMake 3.15+', 'GNU Gettext (i18n, ES/EN)', 'EnTT (ECS — planned)',
      'GitHub Actions (CI/CD — planned)', 'MSYS2 (Windows toolchain)', 'Git / GitHub (GitHub Flow, SemVer 2.0.0)', 'MIT License',
    ],
    diagram: {
      pipeline: ['Input · Raylib', 'Game loop', 'Renderer'],
      aside: ['Gettext · ES/EN', 'CMake · Linux/Win', 'EnTT (planned)', 'CI (planned)'],
    },
    en: {
      oneLiner: `A 2-to-5-player cooperative 2D platformer built in modern C++ with Raylib, where progress depends on coordinated movement through trap-laden levels.`,
      problem: `University game-development coursework (2025-26) requiring a complete, version-controlled C++ game from a five-person team under fixed milestone deadlines. The design goal is a cooperative platformer — inspired by Level Devil's traps and Pico Park's forced cooperation — where 2 to 5 players must coordinate to clear obstacle courses, so no one can finish alone. The technical goal is to deliver this with a maintainable engine architecture, reproducible Linux/Windows builds, and professional engineering practice. The project is in early alpha (v0.1.0-alpha), so much of the engineering scope is still roadmap rather than shipped.`,
      role: `Member of a five-person team with clearly distributed ownership (project lead/DevOps, gameplay programming, UI, systems architecture, level design). Contribution to the shared C++/Raylib codebase and the engineering-practice setup (CMake build, GitHub Flow, internationalization, milestone delivery) rather than sole ownership.`,
      architecture: `A native C++ game built on Raylib for rendering, input and the game loop, compiled via CMake across Linux and Windows (MSYS2). Gameplay currently uses a straightforward game-loop architecture; a formal ECS layer (EnTT) and a GitHub Actions CI/CD pipeline are on the roadmap (Milestone 2/3) rather than in the alpha. Internationalization is handled through GNU Gettext with runtime language switching.`,
      flow: [
        `Player input is captured via Raylib (P1 WASD, P2 arrows, gamepads for players 3-5).`,
        `The game loop updates entity state: movement, collision resolution, level/objective logic.`,
        `The renderer draws the frame; an F1 debug overlay exposes real-time state when enabled.`,
        `Gettext resolves UI strings against the active locale; the L key toggles ES/EN at runtime.`,
        `CMake produces reproducible builds on Linux (Ubuntu 20.04+) and Windows 10+ (MSYS2).`,
      ],
      decisions: [
        { decision: `C++ with Raylib instead of a heavyweight engine (Unity/Godot)`, why: `The course rewards understanding low-level game-loop, input and rendering concerns; Raylib gives a thin, well-documented C/C++ API without hiding the architecture, keeping the codebase ~96% C++.` },
        { decision: `CMake 3.15+ as the primary build system with a legacy Makefile fallback`, why: `Reproducible, cross-platform builds (Linux and Windows via MSYS2) for a five-person team, while keeping a simpler path available for contributors.` },
        { decision: `GNU Gettext for ES/EN internationalization with runtime toggle and system-language detection`, why: `Standard, translator-friendly i18n that decouples strings from code and lets users switch language live (L key) rather than at compile time.` },
        { decision: `Defer ECS (EnTT) and CI/CD (GitHub Actions) to later milestones`, why: `Pragmatic sequencing — ship a playable vertical slice first (movement, collision, a working level), then introduce the data-oriented ECS refactor and automated pipeline once the game shape is validated.` },
        { decision: `GitHub Flow + Semantic Versioning 2.0.0 + issue templates`, why: `Lightweight branching and explicit versioning suit a small team on short milestone cycles, and standardized issue/bug templates keep coordination overhead low.` },
      ],
      challenges: [
        `Cross-platform builds for a mixed Linux/Windows team: standardized on CMake 3.15+ and documented an MSYS2 + Gettext toolchain so Windows contributors get reproducible builds matching Ubuntu.`,
        `Forced-cooperation game design: translating Pico Park-style mechanics where 2-5 players must coordinate (no solo completion) into concrete movement, collision and level-objective logic in the alpha.`,
        `Local multiplayer input for up to five players: separate keyboard schemes for P1 (WASD) and P2 (arrows) plus gamepad support for players 3-5, with shared restart/pause controls.`,
        `Runtime internationalization: wiring GNU Gettext so ES/EN strings resolve against system locale and can be toggled live, including the locale-configuration friction on Linux/WSL and Windows/MSYS2.`,
      ],
      results: [
        `Playable alpha (v0.1.0-alpha) delivered for Milestone 1 (Oct 22, 2025): working gameplay screen, game-over screen, two-player movement, core collision system, and a complete level with objectives.`,
        `Local co-op input for 2-5 players (keyboard for P1/P2, gamepads for players 3-5) with an F1 debug overlay for real-time state inspection.`,
        `Bilingual ES/EN UI via GNU Gettext with automatic system-language detection and live in-game toggling.`,
        `Reproducible cross-platform builds via CMake on Linux (Ubuntu 20.04+) and Windows 10+ (MSYS2); MIT-licensed repository using GitHub Flow, Semantic Versioning and issue templates. ECS (EnTT) and GitHub Actions CI/CD are on the roadmap — the project is in active development.`,
      ],
    },
    es: {
      oneLiner: `Un plataformas 2D cooperativo para 2 a 5 jugadores, desarrollado en C++ moderno con Raylib, donde avanzar exige coordinar el movimiento a través de niveles llenos de trampas.`,
      problem: `Proyecto de la asignatura de desarrollo de videojuegos (2025-26) que exige entregar, en equipo de cinco personas y con plazos por hitos, un juego completo en C++ bajo control de versiones. El objetivo de diseño es un plataformas cooperativo —inspirado en las trampas de Level Devil y la cooperación forzada de Pico Park— en el que de 2 a 5 jugadores deben coordinarse para superar los obstáculos, de modo que nadie pueda terminar en solitario. El objetivo técnico es lograrlo con una arquitectura de motor mantenible, compilaciones reproducibles en Linux y Windows, y buenas prácticas de ingeniería. El proyecto está en alfa temprana (v0.1.0-alpha), por lo que buena parte del alcance técnico todavía es hoja de ruta.`,
      role: `Miembro de un equipo de cinco personas con propiedad claramente distribuida (lead de proyecto/DevOps, programación de gameplay, UI, arquitectura de sistemas, diseño de niveles). Contribución al código compartido en C++/Raylib y a la configuración de buenas prácticas de ingeniería (build con CMake, GitHub Flow, internacionalización, entrega por hitos) más que una propiedad en solitario.`,
      architecture: `Un juego nativo en C++ sobre Raylib para el renderizado, la entrada y el bucle de juego, compilado con CMake en Linux y Windows (MSYS2). El gameplay usa actualmente una arquitectura de bucle de juego directa; una capa ECS formal (EnTT) y un pipeline de CI/CD con GitHub Actions están en la hoja de ruta (Hito 2/3), no en la alfa. La internacionalización se maneja con GNU Gettext y cambio de idioma en tiempo de ejecución.`,
      flow: [
        `La entrada del jugador se captura con Raylib (J1 WASD, J2 flechas, mandos para los jugadores 3-5).`,
        `El bucle de juego actualiza el estado de las entidades: movimiento, resolución de colisiones, lógica de nivel/objetivos.`,
        `El renderer dibuja el frame; una capa de depuración F1 expone el estado en tiempo real cuando se activa.`,
        `Gettext resuelve las cadenas de UI contra el locale activo; la tecla L alterna ES/EN en tiempo de ejecución.`,
        `CMake produce builds reproducibles en Linux (Ubuntu 20.04+) y Windows 10+ (MSYS2).`,
      ],
      decisions: [
        { decision: `C++ con Raylib en vez de un motor pesado (Unity/Godot)`, why: `El contexto académico premia entender el bucle de juego, la entrada y el renderizado a bajo nivel; Raylib da una API C/C++ fina y bien documentada sin ocultar la arquitectura, manteniendo el código ~96% C++.` },
        { decision: `CMake 3.15+ como sistema de build principal con un Makefile heredado de respaldo`, why: `Builds reproducibles y multiplataforma (Linux y Windows vía MSYS2) para un equipo de cinco, manteniendo una vía más simple para quien contribuya.` },
        { decision: `GNU Gettext para la internacionalización ES/EN con cambio en caliente y detección del idioma del sistema`, why: `i18n estándar y amigable para traductores que desacopla las cadenas del código y permite cambiar de idioma en vivo (tecla L) en vez de en tiempo de compilación.` },
        { decision: `Aplazar el ECS (EnTT) y el CI/CD (GitHub Actions) a hitos posteriores`, why: `Secuenciación pragmática — entregar primero un vertical slice jugable (movimiento, colisiones, un nivel funcional) y luego introducir el refactor a ECS orientado a datos y el pipeline automatizado una vez validada la forma del juego.` },
        { decision: `GitHub Flow + Versionado Semántico 2.0.0 + plantillas de issues`, why: `Un branching ligero y un versionado explícito encajan con un equipo pequeño en ciclos de hito cortos, y las plantillas estandarizadas mantienen bajo el coste de coordinación.` },
      ],
      challenges: [
        `Builds multiplataforma para un equipo mixto Linux/Windows: estandarizado en CMake 3.15+ y documentada una toolchain MSYS2 + Gettext para que quien contribuye en Windows obtenga builds reproducibles equivalentes a Ubuntu.`,
        `Diseño de cooperación forzada: trasladar mecánicas estilo Pico Park donde 2-5 jugadores deben coordinarse (sin completar en solitario) a lógica concreta de movimiento, colisiones y objetivos de nivel en la alfa.`,
        `Entrada multijugador local para hasta cinco jugadores: esquemas de teclado separados para J1 (WASD) y J2 (flechas) más soporte de mando para los jugadores 3-5, con controles compartidos de reinicio/pausa.`,
        `Internacionalización en tiempo de ejecución: cablear GNU Gettext para que las cadenas ES/EN se resuelvan contra el locale del sistema y se puedan alternar en vivo, incluida la fricción de configuración de locales en Linux/WSL y Windows/MSYS2.`,
      ],
      results: [
        `Alfa jugable (v0.1.0-alpha) entregada para el Hito 1 (22 oct 2025): pantalla de juego funcional, pantalla de fin de partida, movimiento de dos jugadores, sistema de colisiones básico y un nivel completo con objetivos.`,
        `Entrada de control local para 2-5 jugadores (teclado para J1/J2, mandos para los jugadores 3-5) con una capa de depuración (F1) para inspeccionar el estado en tiempo real.`,
        `Interfaz bilingüe ES/EN mediante GNU Gettext, con detección automática del idioma del sistema y cambio en caliente dentro del juego.`,
        `Compilación multiplataforma reproducible con CMake en Linux (Ubuntu 20.04+) y Windows 10+ (MSYS2); repositorio bajo licencia MIT con GitHub Flow, versionado semántico y plantillas de issues. El ECS (EnTT) y el CI/CD con GitHub Actions están en la hoja de ruta: el proyecto está en desarrollo activo.`,
      ],
    },
  },
}
