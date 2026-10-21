# Fase 2b — "Línea Backend" v2: la web completa como red de metro

**Estado:** plan para aprobar. **No hay código nuevo.** `main` está intacto; el prototipo irá en la rama `proto/d-metro-v2` cuando des el OK.

**Documentos de esta fase**
- [docs/design-rationale.md](../design-rationale.md): por qué la web es como es. Es la referencia: tus decisiones se discuten o se mejoran, no se borran.
- Informes de los subagentes, completos, en [fase-2b/informes/](fase-2b/informes/):
  1. [Variantes de la experiencia de scroll](fase-2b/informes/1-variantes-scroll.md)
  2. [Crítica con ojos frescos del v1](fase-2b/informes/2-critico-ojos-frescos.md)
  3. [Rendimiento y accesibilidad](fase-2b/informes/3-rendimiento-accesibilidad.md)
  4. [Referencias verificadas](fase-2b/informes/4-referencias.md)

**Cómo se ha trabajado**
- Cuatro subagentes en paralelo, cada uno con un encargo independiente:
  - **Interacción:** 3 variantes de scroll.
  - **Crítico:** solo vio capturas, nunca el código, y aplicó Impeccable y Emil.
  - **Rendimiento y accesibilidad:** revisó el código real.
  - **Referencias:** comprobó premios en Awwwards y D&AD.
- Este plan junta sus conclusiones. Cuando las contradicen, mandan **tus** decisiones y el *rationale* (por ejemplo, los colores de los proyectos).

**Limitaciones que debes conocer**
- **Figma** no está autenticado: en la sección 9 tienes los pasos.
- **`review-animations`** de Emil solo la puede lanzar el usuario (`/review-animations`); los agentes han usado `emil-design-eng`, del mismo autor.
- **Impeccable** sigue en modo sin binario.

---

## 1. El concepto en una frase
**Tu carrera es una red de metro real y la web es el viaje por ella.** La línea 1 es tu trayectoria. Cada proyecto es una línea de su color que nace donde ocurrió. El viaje termina en la **próxima estación: tu equipo**.

Lo que lo hace tuyo y no de plantilla (confirmado por el crítico): cada estación es un hecho de tu CV.

---

## 2. Tabla de estaciones — CONFIRMA ANTES DE QUE DIBUJE NADA
Las fechas sin fuente van como **¿?**. No he supuesto ninguna. Las que tienen fuente las saco de la web o del CV actuales y también necesitan tu ✓.

### Línea 1 · Trayectoria (índigo, el color de la web original)
| # | Estación | Fechas | Fuente | Tipo | ✓ / corrección |
|---|---|---|---|---|---|
| 1 | **SMR** · CFGM Sistemas Microinformáticos y Redes · IES Jaume II el Just | 2016 – 2018 (¿meses?) | `education.ts` | Formación | |
| 2 | **DAM** · CFGS Desarrollo de Aplicaciones Multiplataforma · IES Jaume II el Just · nota 9 | 2018 – 2020 (¿meses?) | `education.ts` | Formación | |
| 3 | **Autis Ingenieros · prácticas I** (al acabar DAM, unos 5 meses) | **¿inicio? – ¿fin?** | Tú (el CV dice "feb 2020 – jun 2021 · 10 meses" en total) | Empleo | |
| 4 | **DAW** · CFGS Desarrollo de Aplicaciones Web · IES María Enríquez · nota 8,5 | 2020 – 2021 (¿meses?) | `education.ts` | Formación | |
| 5 | **Autis Ingenieros · prácticas II** (al acabar DAW, unos 5 meses) | **¿inicio? – ¿fin?** | Tú | Empleo | |
| — | *¿Tramo 2021 – 2022 entre DAW y el Grado?* | **¿?** | — | ¿Se muestra? ¿Qué fue? | |
| 6 | **Grado en Ingeniería Informática · UA** (correspondencia: de aquí salen las líneas de proyectos) | sept. 2022 – jun. 2026 | `education.ts` | Formación | |
| 7 | **NTT Data** · Becario IT · Consultoría / Sector público | nov. 2025 – feb. 2026 | CV | Empleo | |
| 8 | **TFG · EcoAlerta · 10/10 Matrícula de Honor** (correspondencia con la línea EcoAlerta) | defendido el 11 jun. 2026 | Web anterior (`about.p1`) | Hito | |
| 9 | **Tu equipo** · próxima estación (tramo punteado, en construcción) | — | — | Destino | |

### Ramal "Cercanías" · Otra experiencia (gris cálido, discontinuo, en paralelo a la L1)
Cuenta, sin quitar protagonismo a lo técnico, que te pagaste la formación trabajando.

| # | Estación | Fechas | Fuente | ✓ / corrección |
|---|---|---|---|---|
| C1 | Mozo de almacén | **¿?** | CV ("Trabajos previos", sin fechas) | |
| C2 | Maquinista | **¿?** | CV | |
| C3 | Operario de producción · Tableprint (Miramar) · robots KUKA | **¿?** | Tú (fase 1) | |
| C4 | Reponedor | **¿?** | CV | |
| C5 | **Cajero · Leroy Merlin** | ago. 2026 – actualidad | CV | |

¿Prefieres el ramal **sin fechas**, solo con el orden? Con fechas queda más claro en el recorrido horizontal.

### Líneas de proyecto (cada una con su color de siempre; nace de la estación donde ocurrió)
| Línea | Color (significado) | Nace en | Fechas | Fuente | ✓ / corrección |
|---|---|---|---|---|---|
| **EcoAlerta** | Verde (medioambiente) | TFG | 2026 | `projects.ts` | |
| **Red de Donación de Alimentos** | Rosa (cuidado; su icono es un corazón) | Grado · Ingeniería Web | 2026 (¿mes?) | `projects.ts` | |
| **Hydrofulness** | Azul agua | Grado · Hackathon Aguas de Alicante | 2026 (**¿fecha del hackathon?**) | CV | |
| **EasyCab** | Ámbar o amarillo (taxis) | Grado · Sistemas Distribuidos | 2025 (antigua tarjeta; **¿confirmas?**) | historial `main` | |
| **StudySync** | Violeta, **discontinua** ("en obras") | Después del TFG | 2026 (¿inicio?) | `projects.ts` | |
| **Chaos Crew** | **¿?** (no tenía color; propongo **coral**) | Grado · ¿asignatura? (el repo se llama `chaos-crew-dca`) | **¿?** | CV | |

### Otras paradas que hay que situar
| Parada | Fechas | ✓ / corrección |
|---|---|---|
| NASA Space Apps 2025 (actividad del grado) | **¿fecha?** | |
| Cambridge B2 First (FCE) | **¿año?** | |

---

## 3. La experiencia completa, sección a sección
Esqueleto: **scroll vertical con un único tramo horizontal fijado** (la trayectoria), los proyectos como **tablero que no atrapa** y un **mini-plano** como navegación. Es la mezcla que recomienda el informe 1, filtrada por los riesgos del crítico (no secuestrar el scroll) y por el informe 3 (fijado solo donde es accesible).

**Nuevo orden:** Plano (hero) → Proyectos → Trayectoria (experiencia y formación juntas) → Sobre mí → Stack → Contacto.

### 3.0 Navegación permanente
- **Barra superior:**
  - Logo propio: "EAP" dentro de una cápsula de correspondencia. *No es el roundel del metro de Londres: el crítico advirtió que es marca registrada de TfL.*
  - Rótulo de **"Estación actual"**, que cambia con la sección.
  - Menú de 4 entradas, ES/EN y un botón **"Pausar animación"** (obligatorio por WCAG 2.2.2).
- **Escritorio:** un **mini-plano vertical** en el borde derecho. Los capítulos son estaciones y un tren marca dónde estás (sustituye a la barra de progreso). Se puede pulsar cada estación.
- **Móvil:** una línea fina arriba con mini-estaciones y un botón **"Plano"** que abre una hoja con el plano completo como menú.
- **Referencias:** el minimapa de Rauno Freiberg y el indicador fijo de *The Deep Sea*.

### 3.1 Plano (hero)
- **Izquierda, en este orden:**
  - La etiqueta `DESARROLLADOR_FULL_STACK.execute()`, con tu efecto de desordenar texto.
  - El nombre, grande y sin degradado.
  - El rol en una línea.
  - El pitch.
  - Los CTA: **Ver proyectos**, **Descargar CV** y GitHub (con imanes).
- **Derecha: la red completa.**
  - La L1 se dibuja primero.
  - **Las líneas de proyecto nacen de su estación de correspondencia** cuando la L1 llega a ella.
  - **Un solo tren** recorre la L1, se detiene 1,5 s en cada estación y termina en **"Tu equipo"**, que late. Esa estación es un enlace a Contacto.
  - Cada estación de proyecto es un enlace a su andén. Se llega a un proyecto en 1 gesto.
- **Móvil:** nombre, rol y CTA **por encima del pliegue**. Debajo, un **plano rediseñado para móvil**: la L1 en vertical con los ramales y etiquetas de 12 px como mínimo. No es una versión encogida del de escritorio.
- **Sin animación de entrada en el texto.** El h1 es el elemento del LCP y se pinta en su estado final. Solo se anima el plano.

### 3.2 Correspondencia (la transición firma; solo 3 veces en toda la web)
Un nudo de correspondencia se queda fijo (`sticky`) unos 40 vh. La línea saliente se retrae, la nueva sale del nudo a 45° y un disco del color del capítulo siguiente escala desde el nudo (solo `transform`, nada de desenfoques) y descubre la sección. Al mismo tiempo, el rótulo cambia: *"Correspondencia → Línea 1 · Trayectoria"*.

Dónde: Plano → Proyectos, Proyectos → Trayectoria y Stack → Contacto. Con movimiento reducido es un fundido de 150 ms.

### 3.3 Proyectos: "Líneas en servicio" (sin fijar)
- **Escritorio, en dos columnas:**
  - **Izquierda:** el **tablero de líneas**, con 6 filas que caben en una pantalla. Cada fila lleva el badge (número + color + nombre), el título, el contexto y solo el estado que es excepción ("En obras" en StudySync, no "Entregado" cinco veces).
  - **Derecha:** el **andén** del proyecto seleccionado, fijo (`sticky`) mientras miras el tablero.
- **El andén contiene:**
  - El vídeo en su **marco correcto**: EcoAlerta es una app móvil, así que va en marco vertical, sin bandas negras.
  - La descripción y las **evidencias** (Jest · Playwright · Swagger, arquitectura hexagonal, CI), que el crítico echó de menos.
  - **El stack como estaciones de la línea del proyecto**, agrupadas y legibles. Un tren **sigue al cursor** por esa línea y se engancha a la tecnología más cercana.
  - **Ver código** con su anillo de carga en el color de la línea y **Caso de estudio** con su pulso (ver la sección 5).
- **Al entrar en pantalla:** el tablero "se monta" y los títulos de las filas se resuelven con tu efecto de desordenar texto, como un panel de andén. Ocurre una sola vez.
- **Móvil:** acordeón. EcoAlerta va abierto por defecto.
- Todos los andenes están en el DOM, para lectores de pantalla, para SEO y para que funcione sin JS.

### 3.4 Trayectoria: el recorrido de la L1 (fijado en horizontal, solo donde es accesible)
- **Escritorio** (≥ 1024 px, ratón y sin movimiento reducido). El scroll vertical **mueve el tren de SMR a "Tu equipo"**, que equivale a unas 3-4 pantallas.
  - Cada estación abre su tarjeta, con borde de luz: fechas, rol o estudios, logros y nota.
  - **Las correspondencias** (el Grado, del que salen los proyectos, y el TFG) hacen un pequeño "transbordo" visual.
  - Debajo, en paralelo, corre el **ramal de Cercanías** con tus trabajos. Visualmente se ve que estudiabas y trabajabas a la vez.
  - Contador fijo **"Estación 3/9 · 2020"**, como en *The Deep Sea*.
  - Recoge efectos que ya existen: **la línea que se dibuja** (`9374946`) y **los nodos que se encienden** (`2c806fe`).
- **Accesibilidad:**
  - Es scroll ligado, no secuestrado: la rueda y el teclado funcionan de forma nativa.
  - Botones "Estación anterior / siguiente", un índice con anclas `#estacion-…` y un enlace "Saltar trayectoria".
  - El foco siempre queda visible.
- **Móvil:** espina vertical con el tren bajando a medida que haces scroll. **Movimiento reducido:** vertical y estático.
- **Cambio de estructura:** **Experiencia y Formación se funden en una sola línea cronológica.** Desaparecen como secciones separadas, pero no se pierde nada: notas, centros, prácticas y "otra experiencia". *Confírmalo en las decisiones.*

### 3.5 Sobre mí: "Abono"
- **Tu foto en una tarjeta de abono de transporte:** "Válido: toda España" en ES y "EU · no visa" en EN, siguiendo tu regla de mercado por idioma.
- **Texto:**
  - El saludo con **la mano que saluda** (`c9967d9`).
  - La bio.
  - La historia: te pagaste la formación trabajando, con los robots KUKA. Si das el OK, empieza con "De mover palés a mover peticiones".
- **Enlaces sociales:** con imanes.

### 3.6 Stack: "Mapa de la red"
- Las **8 zonas** del stack (los 8 grupos completos) son zonas tarifarias del plano y cada tecnología es una estación. **★ = estación de correspondencia** (más grande).
- Las tecnologías que usan los proyectos están conectadas con sus líneas. Cuando varias líneas comparten un tramo, van **en paralelo**, como en Transit.
- "Aprendiendo ahora" son estaciones **"en obras"** (discontinuas), con "AWS (Cloud Practitioner, preparándola)".
- Se conserva la **cinta de logos**, como panel de andén.
- El contenido sigue siendo **texto escaneable**. El crítico avisa: que la metáfora no se coma la información.

### 3.7 Contacto: "Fin de trayecto: tu equipo"
- El tren de la L1 llega y se detiene. Un gran rótulo de estación dice **"Tu equipo"**.
- Las tarjetas con borde de luz mantienen su identidad de color (`54af42c`): email rojo (se copia con feedback), GitHub, LinkedIn azul y ubicación.
- CTA de email con imán, CV en ES/EN y "Disponible", con su pulso.
- **Pie:** "Fin de línea" y volver arriba con imán.

### 3.8 Páginas de case study: el "andén" del proyecto
- Cabecera en el color de la línea y transición desde la tarjeta (View Transitions, `d7f2773`, ampliada al vídeo).
- El diagrama de arquitectura **se monta capa a capa** con el scroll (Ciechanowski).
- La **pieza firma A** ("el viaje de una petición" en Food Donation) se diseña ya en este lenguaje: Router → Auth JWT → Caso de uso → Dominio → Repositorio → PostgreSQL, con el guion de Vercel ("una parada, una responsabilidad, una frase") y el código real en cada andén. Se construye en la fase 3.
- **404:** "Vía muerta · esta estación no existe".

---

## 4. Sistema visual

### 4.1 Color: tokens con modo noche desde el primer día
Todo se define como variables CSS. El modo noche cambia **solo los tokens** (`[data-theme="night"]`); los componentes no se tocan.

| Token | Día (papel) | Noche (plano iluminado) | Uso |
|---|---|---|---|
| `--paper` | `#F4F1E8` | `#0E1320` (azul noche) | Fondo |
| `--paper-2` | `#EAE5D7` | `#161C2C` | Superficies |
| `--ink` | `#16181D` | `#ECE8DC` | Texto, trenes |
| `--ink-2` | `#474B53` | `#B9BCC6` | Texto secundario |
| `--ink-3` | `#5F646C` | `#8D93A1` | Metadatos |
| `--line-l1` | `#4338CA` índigo | `#8B87F5` | Trayectoria (continuidad con el índigo original) |
| `--line-eco` | `#1E8A4C` | `#3CC57A` | EcoAlerta |
| `--line-hydro` | `#0B7DB5` | `#39A8E0` | Hydrofulness |
| `--line-donation` | `#D6336C` | `#F06A9A` | Red de Donación |
| `--line-studysync` | `#7C3AED` (discontinua) | `#A78BFA` | StudySync |
| `--line-easycab` | `#F5B700` con **contorno de tinta** | `#FFC83D` | EasyCab |
| `--line-chaos` | `#E2552D` (propuesta) | `#FF7A52` | Chaos Crew |
| `--line-cercanias` | `#8C877B` (discontinua) | `#6E7486` | Otra experiencia |

- **Reglas:**
  - El color **nunca va solo**: siempre con número y nombre de línea.
  - Los colores de línea tienen 3:1 o más contra el papel. El amarillo no llega y lleva contorno de tinta, como hacen los planos reales.
  - El texto tiene 4,5:1 o más. *Los valores se verificarán con herramienta en el prototipo.*
- **Modo noche:** las estaciones se iluminan, los trenes llevan faros y **la aurora que sigue al cursor** puede vivir aquí como luz ambiental sobre el plano (propuesta del *rationale*, apartado 2.2). La decisión de activarlo, después.

### 4.2 Tipografía
- **Barlow Condensed** 600/700 para la rotulación (nombre, estaciones, títulos).
- **Barlow** 400/600 para el texto, con cifras tabulares en fechas.
- **JetBrains Mono** 500 solo para código y endpoints.
- Fuentes **auto-alojadas**, sin Google Fonts, en unos 85 KB.
- *No se imita* Johnston (TfL), el rombo de Metro de Madrid ni ninguna marca real.
- **Rotulación de plano:** las etiquetas llevan un halo del color del papel (`paint-order: stroke`) para que nunca las corte una línea, y van siempre en el mismo lado según la dirección de la línea.

### 4.3 Gramática del plano (de Mini Metro y Beck)
- Solo ángulos de 45° y 90°, curvas de radio constante y grosor constante.
- **Forma por tipo de estación:** círculo = formación, cuadrado = empleo, rombo = tecnología y cápsula = correspondencia.
- Las terminales llevan una marca perpendicular. Las líneas **se dibujan**, nunca aparecen de golpe.

---

## 5. Sistema de animación

### 5.1 Tokens (una sola curva base para todo el sitio, como en GSAP.com)
| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entradas y respuestas |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Movimiento en pantalla (trenes) |
| Pulsar | 140 ms | `scale(0.97)` en todos los botones |
| Hover | 200 ms | Color y tinte |
| Estación que aparece | 200 ms, `scale(0.85)` + opacidad | Cuando el trazo pasa por ella |
| Línea que se dibuja | 700 – 850 ms | Entrada del plano |
| Correspondencia | 450 ms | Transición de capítulo |
| Parada del tren | 1,5 s | Tren de la L1 |

**Reglas:**
- **Un solo momento firma por pantalla.**
- Bucles infinitos **solo dos**: el tren de la L1 y el latido de "Tu equipo". Ambos se pausan fuera de pantalla, con la pestaña oculta y con el botón de pausa.
- Ninguna animación en el texto del hero.
- Con movimiento reducido: **menos, no nada**. Fundidos cortos, plano ya dibujado y nada de fijados.

### 5.2 Tus efectos intocables en el v2

| Efecto | Cómo vive en el metro | Mejora |
|---|---|---|
| **Borde de luz** (todas las tarjetas) | El arco cónico toma el **color de la línea** de cada tarjeta | Sin reflow forzado: medidas en caché y solo las tarjetas visibles (informe 3) |
| **Imanes** | En los CTA del hero, "Caso de estudio", contacto y pie | Con muelle (inercia), el rect medido antes de moverse y como máximo 8-10 px |
| **"Ver código" con brillo de carga** | El arco gira alrededor del botón **como un tren dando la vuelta**, en el color de la línea. Se activa al pasar el cursor por la tarjeta, **con el foco del teclado** y **una vez al entrar en pantalla**, para invitar | Más barato: rotación de un pseudo-elemento en lugar de repintar el gradiente |
| **"Caso de estudio" que pulsa** | Botón relleno en el color de la línea. Al entrar en pantalla emite **2-3 ondas como la de "Tu equipo"** y para; al pasar el cursor, vuelve a pulsar | Sin bucle infinito, como mucho 1 Hz y desactivado con movimiento reducido |
| **Colores con significado** | Cada proyecto **es** su línea, igual en el plano, el tablero, el andén, el case study y la imagen OG | Se corrige el error de colores del v1 |
| **Cursor propio** | Ver la sección 5.3 | Rediseñado |

### 5.3 Cursor "tren" (propuesta)
Solo con ratón (`hover: hover` y `pointer: fine`), desactivado en táctil y con movimiento reducido.

| Estado | Qué ves |
|---|---|
| En reposo | Una cápsula pequeña en índigo (un tren) que sigue al puntero con muelle y **gira hacia la dirección del movimiento**, como si fuera sobre raíles |
| Sobre un enlace o botón | El tren se convierte en un **anillo del color de la línea** de ese elemento (un "andén") y se atrae hacia él |
| Sobre una estación del plano | Se engancha al centro de la estación |
| Sobre texto o campos | Desaparece (el cursor de texto del sistema manda) |
| Con teclado | Se oculta y nunca tapa el foco |

**Decisión que necesito:** tu cursor original ocultaba el del sistema (`cursor: none` en toda la página). El informe de accesibilidad pide no hacerlo. Te propongo dos opciones:
- **(A) Acompañante:** el cursor del sistema siempre visible y el tren a su lado.
- **(B) Sustituto solo en zonas sin texto:** el plano, las tarjetas y los vídeos; sobre texto vuelve el del sistema.

Yo recomiendo **(B)**: conserva tu idea y cumple la accesibilidad.

---

## 6. Referencias (verificadas por el subagente; detalle en el informe 4)
1. **Mini Metro** (IGF 2016): la gramática del trazo y las formas de estación.
2. **Vercel · "Life of a Vercel request"**: el guion de la pieza firma.
3. **Apple · AirPods Pro** (D&AD 2020, Yellow Pencil): el marco fijo con avance reversible para la trayectoria.
4. **neal.fun · The Deep Sea**: el ritmo de pausas y el contador de posición fijo.
5. **rauno.me**: el minimapa como navegación y la artesanía de la microinteracción.
6. **Bartosz Ciechanowski**: diagramas que se construyen concepto a concepto (case studies).
7. **stripe.dev** (Awwwards SOTD y Developer Award, 2024): la pieza técnica funcional y los temas claro y oscuro como sistema.
8. **Transit** (finalista de los Apple Design Awards 2022): líneas paralelas en tramos compartidos y jerarquía de señalética.

Como apoyo técnico: **GSAP.com** (SOTD y Developer Award, 2023), por el horizontal con `containerAnimation` y una sola curva. *Pásame los ejemplos que te gusten y los incorporo con el mismo análisis.*

---

## 7. Rendimiento y accesibilidad (resumen del informe 3)
- **Presupuestos móviles:**
  - JS inicial de 110 KB gz o menos (hoy unos 155: framer-motion sale de la carga inicial).
  - LCP de 2,0 s o menos, CLS de 0,02 o menos y TBT e INP de 150 ms o menos.
  - Fuentes de 90 KB o menos y vídeos de 1,5 MB o menos con póster.
- **CLS:** el hero se **prerenderiza de verdad** (`renderToString` + `hydrateRoot`) y desaparece la copia manual de `index.html`.
- **El fijado solo se activa** con ≥ 1024 px de ancho, ≥ 640 px de alto, ratón y sin movimiento reducido. Con zoom al 200 %, en táctil y con movimiento reducido todo cae a vertical automáticamente.
- **GSAP y Lenis** se cargan con `import()` cuando el navegador queda libre. El hero funciona **sin JS**.
- **Medición:** script de Playwright (Edge, móvil emulado, CPU ×4) para LCP, CLS, TBT e INP, **vídeos del scroll** con `recordVideo` y axe. Además, PageSpeed Insights sobre la vista previa de Vercel si subes la rama.
- **Checklist de aceptación completo:** al final del informe 3.

---

## 8. Proceso del prototipo (cuando des el OK)
1. Rama `proto/d-metro-v2` desde `main`. **Toda la web**, no solo el hero.
2. **Orden de construcción:** tokens y tipografía → plano (escritorio y móvil) → navegación → proyectos → trayectoria → sobre mí → stack → contacto → case study y 404 → modo noche (solo los tokens, para comprobar que el sistema lo admite).
3. **Bucle de iteración en cada bloque**, antes de enseñarte nada:
   - Capturas y **vídeos cortos del scroll** con Playwright, en escritorio y móvil.
   - El **subagente crítico** revisa las capturas y una secuencia de fotogramas del vídeo sin ver el código, porque los agentes no pueden ver vídeo.
   - El **subagente de rendimiento y accesibilidad** pasa el script de medición y axe.
   - Corrijo y repito, hasta dos rondas por bloque.
4. Te entrego la rama con todas las capturas, los vídeos, las métricas y el informe del crítico. **`main` no se toca** hasta tu aprobación.

**Herramientas que tendría que instalar (solo en la rama del prototipo o en el scratchpad):**
- `playwright` como dependencia de desarrollo, para los vídeos y el script de métricas (usa tu Edge, sin descargar navegadores).
- `@axe-core/playwright`.
- **ffmpeg** (`winget install ffmpeg`), para volver a comprimir los vídeos (EcoAlerta pesa 6,8 MB) y generar los pósteres. *Te pido permiso para ffmpeg porque se instala en el sistema.*

---

## 9. Figma

### 9.1 Cómo autenticar el MCP de Figma
1. En el chat de Claude Code (este panel de VS Code o la terminal), escribe **`/mcp`**.
2. En la lista, elige **`plugin:design:figma`** y pulsa **Authenticate**.
3. Se abre el navegador con el login de Figma: inicia sesión y **permite el acceso**. Después vuelve a VS Code.
4. **Reinicia la sesión** (conversación nueva o recargar la ventana) para que yo vea las herramientas de Figma.
5. Crea un archivo de Figma vacío, por ejemplo **"EAP · Línea Backend v2"**, y pásame el enlace.

> **Aviso honesto:** el servidor es el remoto oficial de Figma (`https://mcp.figma.com/mcp`). Hasta que esté autenticado no puedo ver qué herramientas expone. **Si permite crear y editar diseños**, dibujo los frames directamente. **Si solo permite leer** (contexto de diseño, capturas, variables), el plan B es que yo genere cada frame como una página HTML o SVG exacta y tú la importes a Figma con el plugin *html.to.design*. A partir de ahí iteramos en Figma y yo leo los cambios por el MCP. Te diré cuál de los dos es en cuanto lo vea.

### 9.2 Frames clave a diseñar antes de programar
| # | Frame | Tamaño | Para decidir |
|---|---|---|---|
| F1 | Plano (hero), día | 1440 × 900 | Composición, retícula, rotulación del plano |
| F2 | Plano (hero), móvil | 390 × 844 | CTAs por encima del pliegue y plano vertical legible |
| F3 | Plano (hero), **noche** | 1440 × 900 | Que el sistema de tokens funciona |
| F4 | Correspondencia: 3 fotogramas (inicio, mitad, fin) | 1440 × 900 | La transición firma |
| F5 | Proyectos: tablero y andén abierto (EcoAlerta) | 1440 × 900 | Ritmo, marco del vídeo, evidencias, botones |
| F6 | Proyectos, móvil (acordeón) | 390 × 844 | |
| F7 | Trayectoria fijada: estación "Autis · prácticas I" | 1440 × 900 | Tarjeta de estación, ramal de Cercanías, contador |
| F8 | Trayectoria, móvil (espina vertical) | 390 × 844 | |
| F9 | Sobre mí "Abono" | 1440 × 900 | |
| F10 | Stack "Mapa de la red" | 1440 × 900 | Que siga siendo escaneable |
| F11 | Contacto "Fin de trayecto" | 1440 × 900 | |
| F12 | Componentes: badges de línea, formas de estación, tarjeta con borde de luz, "Ver código" (reposo, hover, foco), "Caso de estudio" (pulso), cursor (5 estados), logo cápsula | — | El sistema |

---

## 10. Decisiones y datos que necesito (marca o responde)
1. **Tabla de estaciones (sección 2):** fechas de las dos prácticas en Autis, meses de SMR, DAM y DAW, el **tramo 2021-2022**, las fechas de los trabajos previos (o "sin fechas"), el hackathon, EasyCab 2025, el inicio de StudySync, Chaos Crew (asignatura, fecha y color), NASA Space Apps y el B2.
2. **Experiencia y Formación fundidas en la L1:**  [ ] Sí  [ ] No, mantener secciones separadas.
3. **Cursor:**  [ ] (A) acompañante  [ ] (B) sustituto solo en zonas sin texto (recomendado)
4. **"De mover palés a mover peticiones"** al abrir tu historia en Sobre mí:  [ ] Sí  [ ] No
5. **Color de Chaos Crew:**  [ ] coral (propuesta)  [ ] otro:
6. **Aurora del cursor** (no está en tu lista de intocables):  [ ] solo en modo noche (propuesta)  [ ] mantener siempre  [ ] quitar
7. **Pastillas sociales flotantes** (tampoco están en la lista):  [ ] que floten hasta el primer hover (propuesta)  [ ] como ahora  [ ] quitar
8. **Instalar ffmpeg** para comprimir los vídeos:  [ ] Sí  [ ] Lo hago yo  [ ] No
9. **Figma:** autentica con `/mcp` y pásame el enlace del archivo. Si prefieres no usar Figma, voy directo al prototipo con los frames en HTML.
10. **¿Commiteo los documentos** (`design-rationale.md`, `fase-2.md`, `fase-2b.md` e informes) en `main`? Son solo documentación, no código.  [ ] Sí  [ ] No, aún no
11. **Tus referencias:** pásame las webs que te gusten y las añado.
