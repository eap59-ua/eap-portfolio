// Line 1 · Trayectoria. Every date here was confirmed by Erardo on 2026-10-21
// (see docs/plan/fase-2b.md §2). Do not add or "round" dates without asking.
type L = { es: string; en: string }

export type StationKind = 'study' | 'work' | 'milestone' | 'interchange' | 'next'

export interface JourneyStation {
  id: string
  kind: StationKind
  short: L // name on the line
  title: L // card heading
  org?: L
  when: L
  year: string // shown in the fixed counter
  body: L
  tags?: string[]
  grade?: string
  /** project lines that branch off here (interchange) */
  branches?: string[]
}

export const JOURNEY: JourneyStation[] = [
  {
    id: 'smr',
    kind: 'study',
    short: { es: 'SMR', en: 'SMR' },
    title: { es: 'CFGM Sistemas Microinformáticos y Redes', en: 'VET Diploma · Systems & Networks (SMR)' },
    org: { es: 'IES Jaume II el Just', en: 'IES Jaume II el Just' },
    when: { es: 'sept 2016 – jun 2018', en: 'Sep 2016 – Jun 2018' },
    year: '2016',
    body: {
      es: 'Redes, sistemas y soporte. Prácticas FCT en App Informática (feb – jun 2018): soporte técnico.',
      en: 'Networks, systems and support. Work placement at App Informática (Feb – Jun 2018): technical support.',
    },
    tags: ['Networking', 'Sysadmin', 'Security'],
  },
  {
    id: 'dam',
    kind: 'study',
    short: { es: 'DAM', en: 'DAM' },
    title: { es: 'CFGS Desarrollo de Aplicaciones Multiplataforma', en: 'Higher VET · Multiplatform App Development (DAM)' },
    org: { es: 'IES Jaume II el Just', en: 'IES Jaume II el Just' },
    when: { es: 'sept 2018 – jun 2020', en: 'Sep 2018 – Jun 2020' },
    year: '2018',
    grade: '9',
    body: { es: 'Programación, bases de datos y desarrollo móvil.', en: 'Programming, databases and mobile development.' },
    tags: ['Java', 'Kotlin', 'Dart', 'Android'],
  },
  {
    id: 'autis-1',
    kind: 'work',
    short: { es: 'Autis I', en: 'Autis I' },
    title: { es: 'Autis Ingenieros · prácticas I', en: 'Autis Ingenieros · internship I' },
    org: { es: 'FCT de DAM', en: 'DAM work placement' },
    when: { es: 'feb – jun 2020', en: 'Feb – Jun 2020' },
    year: '2020',
    body: {
      es: 'Introducción a LabVIEW y a la automatización industrial.',
      en: 'Introduction to LabVIEW and industrial automation.',
    },
    tags: ['LabVIEW', 'Automatización'],
  },
  {
    id: 'daw',
    kind: 'study',
    short: { es: 'DAW', en: 'DAW' },
    title: { es: 'CFGS Desarrollo de Aplicaciones Web', en: 'Higher VET · Web App Development (DAW)' },
    org: { es: 'IES María Enríquez', en: 'IES María Enríquez' },
    when: { es: 'sept 2020 – jun 2021', en: 'Sep 2020 – Jun 2021' },
    year: '2020',
    grade: '8,5',
    body: {
      es: 'Un solo curso: el primero lo convalidé con DAM.',
      en: 'A single year: the first one was recognised from DAM.',
    },
    tags: ['PHP', 'Laravel', 'JavaScript', 'MySQL'],
  },
  {
    id: 'autis-2',
    kind: 'work',
    short: { es: 'Autis II', en: 'Autis II' },
    title: { es: 'Autis Ingenieros · prácticas II', en: 'Autis Ingenieros · internship II' },
    org: { es: 'FCT de DAW', en: 'DAW work placement' },
    when: { es: 'feb – jun 2021', en: 'Feb – Jun 2021' },
    year: '2021',
    body: {
      es: 'Continuación del proyecto de visión artificial: inspección por cámaras que detecta defectos de pintura en piezas de automoción.',
      en: 'Continued the machine-vision project: camera inspection that detects paint defects on automotive parts.',
    },
    tags: ['LabVIEW', 'Visión artificial', 'Automoción'],
  },
  {
    id: 'grado',
    kind: 'interchange',
    short: { es: 'Grado UA', en: 'BSc UA' },
    title: { es: 'Grado en Ingeniería Informática', en: 'BSc in Computer Engineering' },
    org: { es: 'Universidad de Alicante', en: 'University of Alicante' },
    when: { es: 'sept 2022 – jun 2026', en: 'Sep 2022 – Jun 2026' },
    year: '2022',
    body: {
      es: 'Algoritmia, ingeniería del software, arquitectura de sistemas e inteligencia artificial. De aquí salen las líneas de EasyCab, Chaos Crew, Hydrofulness y la Red de Donación. NASA Space Apps 2025.',
      en: 'Algorithms, software engineering, systems architecture and AI. The EasyCab, Chaos Crew, Hydrofulness and Food Donation lines branch off here. NASA Space Apps 2025.',
    },
    branches: ['easycab', 'chaos-crew', 'hydrofulness', 'food-donation'],
  },
  {
    id: 'ntt',
    kind: 'work',
    short: { es: 'NTT Data', en: 'NTT Data' },
    title: { es: 'NTT Data · Desarrollador Appian', en: 'NTT Data · Appian Developer' },
    org: { es: 'Contrato de formación · consultoría, sector público', en: 'Training contract · consulting, public sector' },
    when: { es: 'nov 2025 – feb 2026', en: 'Nov 2025 – Feb 2026' },
    year: '2025',
    body: {
      es: 'Bootcamp interno de Appian (plataforma low-code empresarial) e incorporación a un proyecto para ENAIRE, el gestor de la navegación aérea en España.',
      en: "Internal Appian bootcamp (enterprise low-code platform) and onboarding onto a project for ENAIRE, Spain's air navigation service provider.",
    },
    tags: ['Appian', 'Low-code', 'Consultoría'],
  },
  {
    id: 'tfg',
    kind: 'interchange',
    short: { es: 'TFG 10/10', en: 'Thesis 10/10' },
    title: { es: 'TFG · EcoAlerta · Matrícula de Honor', en: 'Final-year project · EcoAlerta · Distinction' },
    org: { es: 'Universidad de Alicante', en: 'University of Alicante' },
    when: { es: '11 jun 2026', en: '11 Jun 2026' },
    year: '2026',
    grade: '10',
    body: {
      es: 'PWA geoespacial para reportar incidencias medioambientales, calificada con 10/10 y Matrícula de Honor. De aquí sale la línea de EcoAlerta.',
      en: 'Geospatial PWA to report environmental incidents, graded 10/10 with Distinction. The EcoAlerta line branches off here.',
    },
    branches: ['ecoalerta'],
  },
  {
    id: 'b2',
    kind: 'milestone',
    short: { es: 'B2 First', en: 'B2 First' },
    title: { es: 'Cambridge English B2 First (FCE)', en: 'Cambridge English B2 First (FCE)' },
    org: { es: 'Cambridge Assessment English', en: 'Cambridge Assessment English' },
    when: { es: 'jun 2026', en: 'Jun 2026' },
    year: '2026',
    body: { es: 'Inglés certificado para trabajar en equipos internacionales.', en: 'Certified English for international teams.' },
  },
  {
    id: 'next',
    kind: 'next',
    short: { es: 'Tu equipo', en: 'Your team' },
    title: { es: 'Próxima estación: tu equipo', en: 'Next stop: your team' },
    when: { es: 'disponible ahora', en: 'available now' },
    year: '2026',
    body: {
      es: 'Busco mi primer puesto como desarrollador backend o full-stack, en un equipo donde aprender rápido y aportar código que se use.',
      en: "I'm looking for my first backend or full-stack developer role, in a team where I can learn fast and ship code people use.",
    },
  },
]

// Cercanías: parallel to the whole journey, deliberately WITHOUT dates or order
// ("I was studying and working at the same time, all along").
export const CERCANIAS = {
  jobs: {
    es: ['mozo de almacén', 'maquinista', 'operario de producción (Tableprint, robots KUKA)', 'reponedor'],
    en: ['warehouse worker', 'machine operator', 'production operator (Tableprint, KUKA robots)', 'stock replenisher'],
  },
  now: { es: 'Cajero · Leroy Merlin · hoy', en: 'Cashier · Leroy Merlin · today' },
}
