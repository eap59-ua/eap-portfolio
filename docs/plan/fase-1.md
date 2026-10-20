# Fase 1 — Alinear el contenido con el CV

**Fuente de verdad:** `../_cv_src/contenido.py` y `../CV_ErardoAldanaPessoa_{ES,EN}.pdf` (versión del 19/10/2026, 23:44).
**Alcance:** solo textos, datos, PDFs y SEO. **No** cambian el diseño, el orden de las secciones ni los efectos (eso es la fase 2).

**Cómo marcar:** en cada cambio, pon una `x` en una opción. Si eliges ✏️, escribe al lado qué quieres.

**Verificación:** cada commit pasa `npm run lint`, `npm test` y `npm run build`. Sin push.

---

## Preguntas abiertas (necesito respuesta para aplicar los cambios marcados con ❓)

- **P1 · KUKA** (cambio 3.4): ¿con qué trabajo manejaste los robots KUKA? En el texto propuesto lo asocio a "operario de producción".
- **P2 · Cobertura de EcoAlerta**: el case study dice "más del 70 % de cobertura" en los tests del backend. ¿Es una cifra que mediste? Si no lo es, la quito. La reescritura a fondo de los case studies es la fase 4; aquí solo quito lo que no sea cierto.
- **P3 · "Aprendiendo ahora"** (cambio 7.3): ¿estás aprendiendo alguna tecnología *de verdad* ahora mismo? Si no, quito el bloque.
- **P4 · NASA Space Apps 2025**: aparece en Formación → Actividades, pero no en el CV. ¿Lo mantengo?
- **P5 · Idioma del SEO** (cambio 9.1): ¿meta tags e imágenes de previsualización en español (recomendado) o en inglés?

---

## Commit 1 · CVs en PDF

### 1.1 Sustituir los PDFs
- **Archivos:** `public/Erardo-Aldana-Pessoa-CV-ES.pdf` y `public/Erardo-Aldana-Pessoa-CV-EN.pdf`
- **Ahora:** los PDFs de julio (≈260 KB), con el contenido antiguo.
- **Nuevo:** copias de `../CV_ErardoAldanaPessoa_ES.pdf` y `../CV_ErardoAldanaPessoa_EN.pdf` (≈90 KB). Los nombres se mantienen, así que los enlaces no cambian. Las versiones ATS no se publican en la web.
- **Por qué:** el botón "Descargar CV" tiene que dar el CV actual.
- [ ] ✅ OK  [ ] ❌ No  [ ] ✏️ Cambiar:

---

## Commit 2 · Hero (titular, subtítulo, pitch y cifras)

Archivos: `src/i18n/es.ts`, `src/i18n/en.ts`, `src/components/sections/Hero.tsx` y el hero estático de móvil en `index.html`, que tiene que ser idéntico al hero en ES.

### 2.1 Etiqueta de código sobre el nombre (`hero.tag`)
- **Ahora:** `DESARROLLADOR_FULL_STACK.execute()` / `FULL_STACK_DEVELOPER.execute()`
- **Nuevo:** `DESARROLLADOR_BACKEND.execute()` / `BACKEND_ENGINEER.execute()`
- **Por qué:** tiene que decir lo mismo que el titular del CV. Si el efecto de texto desordenado se queda o no, se decide en la fase 2.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 2.2 Titular (`hero.role`)
- **Ahora:** `Software Engineer · Backend · Python · Cloud` (igual en los dos idiomas)
- **Nuevo ES:** `Desarrollador Backend (Python) · Full-Stack`
- **Nuevo EN:** `Backend Software Engineer (Python) · Full-Stack`
- **Por qué:** es el titular del CV. "Cloud" no tiene respaldo (AWS figuraba en "aprendiendo").
- [ ] ✅  [ ] ❌  [ ] ✏️

### 2.3 Subtítulo (`hero.subheadline`)
- **Ahora ES:** `Backend-focused · Ingeniero Informático (2026) · reubicación en la UE (NL/CH) · ciudadano UE, sin visado`
- **Nuevo ES:** `Ingeniero Informático (UA, 2026) · Gandía y Alicante · disponible para reubicarme en cualquier punto de España`
- **Ahora EN:** `Backend-focused · Computer Engineer (2026) · EU relocation (NL/CH) · EU citizen, no visa required`
- **Nuevo EN:** `Computer Engineer (UA, 2026) · Based in Spain · open to relocation within the EU (NL / CH / DE) · EU citizen, no visa required`
- **Por qué:** la versión ES apunta a España y la EN a la UE, como los CVs.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 2.4 Pitch (`hero.pitch`)
- **Ahora ES:** `Construyo backends robustos con Python/FastAPI, interfaces modernas con React/TS y sistemas distribuidos. Me importa la arquitectura limpia, los tests y el código que otros pueden leer.`
- **Nuevo ES:** `Desarrollo backends con <Python, FastAPI y PostgreSQL>, y me muevo con soltura en frontend con <React y TypeScript>. Me importan la arquitectura limpia, los tests y el código que otros pueden leer.`
- **Nuevo EN:** `I build backends with <Python, FastAPI and PostgreSQL>, and I'm comfortable on the frontend with <React and TypeScript>. I care about clean architecture, tests and code that others can read.`
- **Por qué:** es la frase del perfil del CV. "Robustos" y "modernas" son relleno. Lo marcado con `<>` se mantiene resaltado como ahora.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 2.5 Cifras bajo el hero (`STATS` en `Hero.tsx` + claves `stats.*`)
| Ahora | Nuevo ES | Nuevo EN |
|---|---|---|
| `10/10` TFG · Matrícula de Honor | `10/10` TFG · Matrícula de Honor (igual) | `10/10` Final-year project · Distinction |
| `1.5+` Años de experiencia | `14` Meses de prácticas en empresa | `14` Months of internships |
| `2` Clientes reales · ENAIRE, AMAEM | `B2` Inglés · Cambridge First | `B2` English · Cambridge First |
| `5` Proyectos reales | `6` Proyectos con código público | `6` Projects with public code |
- **Por qué:** "1.5+ años" y "clientes reales" no se sostienen en una entrevista. Las cifras nuevas se pueden comprobar todas (NTT Data 4 meses + Autis 10 meses = 14; los 6 proyectos del CV).
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 3 · Sobre mí

Archivos: `src/i18n/es.ts`, `src/i18n/en.ts`.

### 3.1 Párrafo 1 (`about.p1`)
- **Ahora ES:** `Ingeniero Informático por la UA con TFG calificado con Matrícula de Honor (10/10), defendido el 11 de junio de 2026. Desarrollador Full-Stack basado en Alicante, con más de año y medio de experiencia entre consultoría IT (NTT Data) y automatización industrial con visión artificial (Autis Ingenieros).`
- **Nuevo ES:** `Ingeniero Informático por la Universidad de Alicante (2026), con el TFG calificado con Matrícula de Honor (10/10). Hice unos 14 meses de prácticas en empresa: consultoría IT en NTT Data y visión artificial industrial en Autis Ingenieros.`
- **Nuevo EN:** `Computer Engineering graduate from the University of Alicante (2026), with my final-year project graded 10/10 with Distinction. About 14 months of internships: IT consulting at NTT Data and industrial machine vision at Autis Ingenieros.`
- **Por qué:** se quita "más de año y medio" y la cifra pasa a coincidir con el CV.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 3.2 Párrafo 2 (`about.p2`)
- **Ahora ES:** `Me apasiona la arquitectura de software y los sistemas bien diseñados. Trabajo con Python/FastAPI en backend, React/TypeScript en frontend, y PostgreSQL (incluido PostGIS para GIS). Cómodo con Docker, testing, y patrones como arquitectura hexagonal.`
- **Nuevo ES:** `Lo que más me interesa es la arquitectura de software: sistemas fáciles de entender y de cambiar. Trabajo con Python y FastAPI en backend, React y TypeScript en frontend, y PostgreSQL (incluido PostGIS). Uso Docker, tests y CI en mis proyectos, y patrones como la arquitectura hexagonal.`
- **Nuevo EN:** `What interests me most is software architecture: systems that are easy to understand and to change. I work with Python and FastAPI on the backend, React and TypeScript on the frontend, and PostgreSQL (including PostGIS). I use Docker, tests and CI in my projects, and patterns such as hexagonal architecture.`
- **Por qué:** el contenido es el mismo, pero sin el tópico "me apasiona" y con algo concreto que lo respalde.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 3.3 Párrafo 3 (`about.p3`)
- **Ahora ES:** `Mi objetivo es unirme a un equipo de producto Full-Time donde pueda aportar desde el día uno y seguir escalando hacia la arquitectura cloud. Abierto a reubicación dentro de la UE.`
- **Nuevo ES:** `Busco mi primer puesto como desarrollador backend, en un equipo donde aprender rápido y aportar código que se use. Disponible para reubicarme en cualquier punto de España.`
- **Nuevo EN:** `I'm looking for my first backend developer role, in a team where I can learn fast and ship code people use. Open to relocation within the EU (NL / CH / DE) — EU citizen, no visa required.`
- **Por qué:** es la frase del CV y el mercado de cada idioma. Se quita "arquitectura cloud".
- [ ] ✅  [ ] ❌  [ ] ✏️

### 3.4 Tu historia (`about.grit`) ❓P1
- **Ahora ES:** `Me costeé la formación compaginándola con varios años de trabajo en logística y producción (donde llegué a manejar robots industriales KUKA) — de ahí mi constancia y mi mentalidad práctica.`
- **Nuevo ES:** `Me pagué la FP y el grado trabajando fuera del sector: mozo de almacén, maquinista, operario de producción —donde llegué a manejar robots industriales KUKA— y reponedor. Hoy soy cajero en Leroy Merlin mientras busco mi primer puesto como desarrollador, y de ahí vienen mi constancia y mi mentalidad práctica.`
- **Nuevo EN:** `I paid for my vocational training and my degree by working outside the industry: warehouse worker, machine operator, production operator (where I got to run KUKA industrial robots) and stock replenisher. Today I'm a cashier at Leroy Merlin while I look for my first developer role, and that's where my persistence and practical mindset come from.`
- **Por qué:** es lo que pediste: 1-2 frases que conectan con la de KUKA y explican la situación actual sin quitar protagonismo a lo técnico. Se queda en el mismo sitio y con el mismo estilo (cita en cursiva, debajo de lo técnico).
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 4 · Experiencia

Archivos: `src/data/experience.ts`, `src/components/sections/Experience.tsx`, `src/i18n/*.ts`.

### 4.1 Subtítulo (`experience.subtitle`)
- **Ahora ES:** `Más de 1 año y medio entre prácticas formativas en empresa, consultoría IT y proyectos con código en producción.`
- **Nuevo ES:** `Unos 14 meses de prácticas en empresa: consultoría IT en NTT Data y automatización industrial en Autis Ingenieros.`
- **Nuevo EN:** `About 14 months of internships: IT consulting at NTT Data and industrial automation at Autis Ingenieros.`
- **Por qué:** se eliminan "año y medio" y "código en producción".
- [ ] ✅  [ ] ❌  [ ] ✏️

### 4.2 Quitar App Informática
- **Ahora:** hay una tercera entrada en la línea de tiempo: "App Informática — Técnico en prácticas, feb–jun 2018".
- **Nuevo:** se elimina la entrada de `experience.ts` junto con sus claves `exp.app.*`.
- **Por qué:** lo decidiste tú y coincide con el CV.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 4.3 Textos de NTT Data y Autis (como en el CV)
- **NTT Data, ahora ES:** `Programa de incorporación en una de las consultoras IT más grandes del mundo. Bootcamp interno en Appian […] y onboarding en proyecto del cliente ENAIRE […]. Primer contacto con metodología y dinámicas de consultoría corporativa.`
- **NTT Data, nuevo ES:** `Bootcamp interno de Appian (plataforma low-code empresarial) e incorporación a un proyecto para ENAIRE, el gestor de la navegación aérea en España. Trabajo con equipos de cliente y metodología de consultoría.`
- **Autis, ahora ES:** `Dos prácticas formativas en una empresa especializada en automatización industrial y visión artificial. Aprendí LabVIEW en profundidad y participé en un proyecto de inspección por cámaras […]`
- **Autis, nuevo ES:** `Participé en el desarrollo con LabVIEW de un sistema de inspección por visión artificial que detecta defectos de pintura en piezas de automoción: captura, procesamiento de imagen y reglas de decisión en la línea de producción.`
- **Rol de Autis:** `Desarrollador en prácticas — Ingeniería industrial` → `Desarrollador en prácticas — Automatización industrial`. Los periodos (`4 meses`, `10 meses (2 períodos)`) se mantienen.
- **EN:** los textos EN del CV, palabra por palabra.
- **Por qué:** "una de las consultoras más grandes del mundo" es relleno, y el resto pasa a coincidir con el CV. Se mantienen las negritas en Appian, ENAIRE, LabVIEW y "defectos de pintura".
- [ ] ✅  [ ] ❌  [ ] ✏️

### 4.4 Etiquetas traducidas
- **Ahora:** las etiquetas están escritas en el código y solo en español (`Consultoría IT`, `Visión artificial`, `QA en línea`…), así que en EN se ven en español.
- **Nuevo:** las del CV, traducidas: ES `Appian · Low-code · Consultoría` / `LabVIEW · Visión artificial · Automoción`; EN `Appian · Low-code · Consulting` / `LabVIEW · Machine vision · Automotive`.
- **Por qué:** corrige un fallo de traducción y coincide con el CV.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 4.5 Nuevo bloque "Otra experiencia"
- **Ahora:** no existe.
- **Nuevo:** un bloque compacto debajo de la línea de tiempo, sin iconos ni animación de la línea, para que no compita con las prácticas:
  - **Cajero · Leroy Merlin** · ago 2026 – actualidad. `Cajas, asistencia en autopago (incidencias de las máquinas y ayuda a clientes), devoluciones y entrega de pedidos; gestión de facturas, tickets y reembolsos.`
  - **Logística, producción y retail · Trabajos previos.** `Mozo de almacén, maquinista, operario de producción y reponedor, compaginado con la FP y el grado.`
  - En EN, los textos EN del CV ("Other experience", "Cashier", "Earlier jobs"…).
- **Por qué:** es igual que en el CV. Va separado de las prácticas para que la experiencia técnica siga siendo lo principal. Su estilo visual se pule en la fase 2.
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 5 · Proyectos

Archivos: `src/data/projects.ts`, `src/components/sections/Projects.tsx`, `src/i18n/*.ts`, `src/data/caseStudies.ts`, `src/__tests__/data.test.ts`.

### 5.1 Título y subtítulo de la sección
- **Ahora ES:** `Proyectos reales` · `Trabajo académico, hackathons y proyectos colaborativos. Todo el código está público en GitHub.`
- **Nuevo ES:** `Proyectos` · `TFG, asignaturas, un hackathon y proyectos personales. Todo el código es público en GitHub.`
- **Nuevo EN:** `Projects` · `Final-year project, coursework, a hackathon and personal projects. All the code is public on GitHub.`
- **Por qué:** "reales" sobra y el subtítulo nuevo describe con exactitud de dónde viene cada proyecto.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 5.2 Descripciones de las tarjetas (las del CV)
| Proyecto | Nuevo ES (del CV) |
|---|---|
| EcoAlerta | `PWA para reportar y seguir incidencias medioambientales: búsqueda geoespacial con PostGIS, tres roles con JWT, panel de administración y tests end-to-end con Playwright, todo en Docker.` |
| Food Donation | `En un equipo de clase, desarrollé casi todo el backend: API REST que conecta donantes con ONGs y bancos de alimentos, con arquitectura hexagonal, SQLAlchemy 2.0 asíncrono y autenticación JWT.` |
| Hydrofulness | `A partir de los datos reales de consumo que reunió el equipo, diseñé y desarrollé toda la solución técnica: ETL, detección de anomalías con Isolation Forest, predicción de estrés hídrico por barrio, API en FastAPI y panel en React.` |
| StudySync | `Plataforma de estudio colaborativo en tiempo real: salas con vídeo (LiveKit), Pomodoro sincronizado en servidor con Redis y WebSocket, e intercambio de apuntes con reseñas.` |
| EasyCab | `Sistema de transporte distribuido sobre Apache Kafka (central, taxis y clientes): concurrencia en PostgreSQL con bloqueo de filas y comunicaciones seguras con TLS y JWT.` |
- **EN:** los textos EN del CV.
- **Por qué:** coinciden con el CV y dejan claro qué hiciste tú (Food Donation y Hydrofulness).
- [ ] ✅  [ ] ❌  [ ] ✏️

### 5.3 Contexto de cada proyecto (traducido)
- **Ahora:** escrito en el código y solo en español, así que en EN se ve en español: `Ingeniería del Software · 2026`, `Hackathon AMAEM · 2026`, `Sistemas Distribuidos · 2025`… y el sello `Matrícula de Honor · 10/10`.

| Proyecto | Nuevo ES | Nuevo EN |
|---|---|---|
| EcoAlerta | `TFG · 2026` | `Final-year project · 2026` |
| Food Donation | `Ingeniería Web · UA · backend del equipo` | `Web Engineering · UA · team backend` |
| Hydrofulness | `Hackathon Aguas de Alicante 2026 · responsable técnico` | `Aguas de Alicante Hackathon 2026 · technical lead` |
| StudySync | `Proyecto personal · en curso` | `Personal project · in progress` |
| EasyCab | `Sistemas Distribuidos · UA` | `Distributed Systems · UA` |
| Chaos Crew | `Videojuego en equipo · C++` | `Team game · C++` |
| Sello de EcoAlerta | `Matrícula de Honor · 10/10` | `Distinction · 10/10` |
- **Por qué:** son los `meta` del CV. Se corrige "Ingeniería del Software" (era Ingeniería Web) y "AMAEM" pasa a decir "Aguas de Alicante".
- [ ] ✅  [ ] ❌  [ ] ✏️

### 5.4 Orden de los proyectos
- **Ahora:** EcoAlerta (destacado) → Hydrofulness → Food Donation → StudySync → EasyCab.
- **Nuevo:** el orden del CV: EcoAlerta (destacado) → Food Donation → Hydrofulness → StudySync → EasyCab → Chaos Crew.
- **Por qué:** Food Donation es el proyecto más puramente backend y pasa a ocupar la tarjeta ancha junto al destacado. Además, será la base de la pieza firma de la fase 3.
- [ ] ✅  [ ] ❌  [ ] ✏️ (por ejemplo, dejar Hydrofulness segundo)

### 5.5 Añadir Chaos Crew
- **Ahora:** no está en la web.
- **Nuevo:** sexta tarjeta, con el icono de mando de juego (`Gamepad2`), el texto del CV (`Juego cooperativo 2D en C++ moderno con arquitectura Entity-Component-System (EnTT), Raylib, build multiplataforma con CMake e integración continua en GitHub Actions.`) y las etiquetas `C++ · EnTT · Raylib · CMake · GitHub Actions`. Solo tendrá el botón "Ver código", **no tendrá case study** porque no tengo datos y no los voy a inventar. En escritorio ocupa la última fila a todo el ancho.
- **Cambios técnicos:**
  - El tipo `Project` gana el campo `caseStudy?: false`.
  - El botón "Caso de estudio" se oculta en los proyectos sin case study.
  - El test `every project has a case study` pasa a comprobar solo los proyectos que sí lo tienen.
  - El sitemap y `vercel.json` no cambian.
- **Por qué:** está en el CV, que es la fuente de verdad. La forma de la tarjeta se pule en la fase 2.
- [ ] ✅  [ ] ❌ (no mostrarlo en la web)  [ ] ✏️

### 5.6 Case study de Hydrofulness: rol y "cliente real"
- **Rol, ahora ES:** `Ingeniero de software en el equipo del hackathon, contribuyendo en todo el stack: […]`
- **Rol, nuevo ES:** `Responsable técnico en un equipo de cinco personas. Mis compañeros reunieron los datos (datasets y documentación de Aguas de Alicante); a partir de ahí planteé y desarrollé toda la solución técnica: qué incluir, el pipeline ETL, los modelos (Isolation Forest y el índice de estrés), la API en FastAPI, el diseño y el frontend en React + TypeScript, el repositorio y el despliegue. Todas las decisiones técnicas fueron mías.`
- **Rol, nuevo EN:** `Technical lead in a team of five. My teammates gathered the data (Aguas de Alicante datasets and documentation); from there I scoped and built the whole technical solution: what to include, the ETL pipeline, the models (Isolation Forest and the stress index), the FastAPI API, the design and the React + TypeScript frontend, the repository and the deployment. All technical decisions were mine.`
- **"Cliente real":** en el problema, `con el cliente real Aguas de Alicante` → `con un reto propuesto por Aguas de Alicante`; en el resultado 1, `para un cliente real (Aguas de Alicante)` → `para el reto de Aguas de Alicante`. Lo mismo en EN.
- **Por qué:** es tu rol real, contado como me lo explicaste. Un hackathon no es un cliente y esa palabra invita a una pregunta incómoda.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 5.7 Case study de Food Donation: asignatura y rol
- **Ahora:** dice "proyecto de la asignatura de Sistemas Cloud y Distribuidos" (en el problema y en el rol), y dos decisiones técnicas terminan con "encaje limpio para un brief de Sistemas Cloud y Distribuidos" y "reflejando el enfoque de despliegue distribuido de la asignatura".
- **Nuevo:**
  - Problema: `desarrollado en equipo para la asignatura de Ingeniería Web (UA, 2026)`.
  - Rol ES: `Proyecto en equipo de la asignatura de Ingeniería Web (UA, 2026). Desarrollé casi todo el backend: la API con arquitectura hexagonal estricta (puertos y adaptadores), la capa de datos asíncrona en PostgreSQL con SQLAlchemy 2.0, la autenticación JWT y el entorno en Docker con su suite de tests de integración.`
  - En las dos decisiones se borra la coletilla sobre la asignatura y la justificación técnica queda intacta.
  - Lo mismo en EN.
- **Por qué:** había tres versiones distintas de la asignatura (Ingeniería del Software, Sistemas Cloud y Distribuidos, sin asignatura). Ahora hay una sola y es la correcta.
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 6 · Formación

### 6.1 Línea de prácticas FCT (`edu.fct`)
- **Ahora:** `Prácticas FCT: Autis Ingenieros (visión artificial) · App Informática`
- **Nuevo:** `Prácticas FCT: Autis Ingenieros (visión artificial)` / `Internships: Autis Ingenieros (machine vision)`
- **Por qué:** coherencia con haber quitado App Informática.
- [ ] ✅  [ ] ❌ (dejarla aquí como dato de formación)  [ ] ✏️

### 6.2 Actividades del grado (`DEGREE.activities` en `education.ts`) ❓P4
- **Ahora:** `NASA Space Apps 2025` · `Hackathon AMAEM 2026`
- **Nuevo:** `NASA Space Apps 2025` · `Hackathon Aguas de Alicante 2026`
- **Por qué:** mismo nombre que en el CV.
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 7 · Stack técnico (recortado como en el CV)

Archivos: `src/data/skills.ts`, `src/components/sections/Skills.tsx`, `src/i18n/*.ts`.

### 7.1 Grupos y tecnologías
- **Ahora:** 8 grupos y unas 60 tecnologías (C#, Kotlin, Swift, Dart, PHP, Vue, Laravel, Spring Boot, .NET, Flutter, KUKA, "OpenAI / LLM APIs", Windows Server, Microservicios, UML…).
- **Nuevo:** 5 grupos, igual que en el CV; ★ = el `stack_main` del CV.

| Grupo ES / EN | Tecnologías |
|---|---|
| Backend | Python★, FastAPI★, SQLAlchemy, Node.js, APIs REST |
| Frontend | React★, TypeScript★, Tailwind |
| Datos / Data | PostgreSQL★, PostGIS, Redis, MySQL |
| DevOps y testing / DevOps & testing | Docker★, GitHub Actions, Linux, Git, Pytest, Playwright |
| Otros / Other | C++, Java, Apache Kafka, Arquitectura hexagonal |

- La rejilla pasa de 4 columnas a 3 en escritorio (3 + 2) para que 5 grupos no queden descolgados.
- **Por qué:** es el recorte que hiciste en el CV. Cada tecnología listada es una pregunta posible en una entrevista. scikit-learn, LabVIEW y WebSocket siguen visibles en las etiquetas de sus proyectos.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 7.2 Cinta de logos (marquee)
- **Ahora:** 24 tecnologías (Kotlin, Laravel, Java, Jest…) y el rótulo `// stack en producción`.
- **Nuevo:** solo las tecnologías de la tabla 7.1, y el rótulo `// con lo que trabajo` / `// what I work with`.
- **Por qué:** "en producción" no es cierto. Si la cinta se queda o no es una decisión de la fase 2.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 7.3 Bloque "Aprendiendo ahora" ❓P3
- **Ahora:** AWS, Kubernetes, Next.js, GraphQL, Terraform, MongoDB, PyTorch, LangChain.
- **Nuevo:** se quita, salvo que me digas 1 o 2 tecnologías que estés aprendiendo de verdad.
- **Por qué:** 8 tecnologías "aprendiendo" se leen como una lista de deseos, y en una entrevista te pueden preguntar por cualquiera.
- [ ] ✅ quitar  [ ] ✏️ dejar solo:

---

## Commit 8 · Contacto

### 8.1 Ubicación y reubicación
| Clave | Ahora | Nuevo ES | Nuevo EN |
|---|---|---|---|
| `contact.location_value` | `Alicante · Abierto a UE` / `Alicante · Open to EU` | `Gandía (Valencia) y Alicante` | `Gandía & Alicante, Spain` |
| `contact.relocate_value` | `UE prioritaria · NL/CH/DE` / `EU priority · NL/CH/DE` | `Reubicación: cualquier punto de España` | `Relocation: within the EU · NL / CH / DE` |
- **Por qué:** la ubicación del CV y el mercado de cada idioma.
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Commit 9 · SEO e imágenes de previsualización ❓P5

### 9.1 Meta tags de `index.html`
- **Ahora:** todo en inglés aunque la página está en español: `Erardo Aldana Pessoa · Software Engineer`, `Software Engineer (Backend · Python · Cloud) … Open to full-time roles in the EU`.
- **Nuevo (si eliges español):**
  - `<title>`: `Erardo Aldana Pessoa · Desarrollador Backend (Python)`
  - `description`: `Desarrollador backend con Python, FastAPI y PostgreSQL, y full-stack con React y TypeScript. Ingeniero Informático por la Universidad de Alicante (2026), TFG con Matrícula de Honor. Proyectos con Docker, tests y CI.`
  - `og:title`, `og:description` y Twitter, con el mismo contenido; se añade `og:locale` = `es_ES`.
  - `keywords`: sin "Cloud", "EU", "Netherlands" ni "full-time"; se añaden "desarrollador backend", "Python" y "FastAPI".
- **Por qué:** la página se abre en español por defecto y tu mercado principal es España. Es lo que verá un reclutador cuando pegues el enlace en LinkedIn o WhatsApp.
- [ ] ✅ en español  [ ] ✏️ en inglés  [ ] ❌

### 9.2 JSON-LD (datos estructurados) y `<noscript>`
- **Ahora:** `jobTitle: "Software Engineer"`, `knowsAbout` incluye `"Cloud architecture"`; el `<noscript>` dice "Software Engineer (Backend · Python · Cloud)".
- **Nuevo:** `jobTitle: "Desarrollador Backend (Python)"`, sin "Cloud architecture"; el `<noscript>` con el titular y el subtítulo nuevos.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 9.3 Imagen de previsualización principal (`og.png`, se regenera con `npm run og`)
- **Ahora:** `Software Engineer · Backend · Python · Cloud`, `DESARROLLADOR_FULL_STACK.execute()`, `Computer Engineer · Distinction (TFG 10/10) · Open to the EU`.
- **Nuevo:** `Desarrollador Backend (Python) · Full-Stack`, `DESARROLLADOR_BACKEND.execute()`, `Ingeniero Informático · UA 2026 · TFG con Matrícula de Honor`.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 9.4 Previsualizaciones por proyecto (`scripts/seo-data.mjs`; se regeneran las imágenes de `public/og/` y las páginas prerenderizadas)
- **Ahora:** títulos y descripciones en inglés, y kickers `SOFTWARE ENGINEERING · 2026` (Food Donation) y `AMAEM HACKATHON · 2026` (Hydrofulness).
- **Nuevo:** en el idioma que elijas en 9.1, con los kickers corregidos: `INGENIERÍA WEB · UA · 2026` y `HACKATHON AGUAS DE ALICANTE · 2026`.
- **Por qué:** quedan corregidas las mismas incoherencias de la sección de proyectos.
- [ ] ✅  [ ] ❌  [ ] ✏️

### 9.5 README
- **Ahora:** `Software Engineer (Backend · Python · Cloud)`
- **Nuevo:** `Backend Developer (Python) · Full-Stack`
- [ ] ✅  [ ] ❌  [ ] ✏️

---

## Fuera de esta fase (va en la fase 2)
- Proyectos justo después del hero (ya está acordado) y el orden del menú.
- La lista de efectos con la decisión de mantener, pulir o quitar cada uno, revisada con `review-animations`.
- El CLS en móvil (0,139), el nombre accesible del botón de copiar el email y el póster de EcoAlerta.
- Detectar el idioma del navegador al entrar. Ahora un visitante de fuera de España ve la web en español. Hay que hacerlo junto con el hero estático de móvil para no provocar saltos de contenido.
