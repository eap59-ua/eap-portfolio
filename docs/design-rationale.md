# Design rationale — por qué la web es como es

**Regla de este documento:** cada decisión de diseño de Erardo se **discute o se mejora, no se borra**. Antes de quitar algo de esta lista hay que proponerlo por escrito, con su porqué, y tener su OK. Si una decisión cambia, se añade una línea fechada debajo; no se reescribe la anterior.

Fuentes: el historial de git (los mensajes de commit de junio a julio de 2026 explican casi todos los efectos), el código de `main` y las decisiones de las fases 1, 2 y 2b (octubre de 2026).

---

## 1. Principios (lo que se repite en todo el historial)

| Principio | Evidencia | Cómo se aplica en adelante |
|---|---|---|
| **Honestidad antes que impacto** | `09dc901` "honest profile, real projects"; `44f5404` EasyCab con "honest framing: academic, secrets hardcoded, not prod"; fase 1 (quitar "1,5 años", "clientes reales", "en producción") | Ningún dato, cifra ni tecnología sin fuente. Las fechas del mapa se confirman una a una con Erardo |
| **Primero la prueba de trabajo** | `86a9338` "Projects now precede Skills (lead with proof-of-work)"; fase 2: proyectos justo después del hero | La experiencia lleva a los proyectos en menos de dos gestos |
| **Efectos con personalidad, no de plantilla** | `78e5310` "Premium interactions"; fase 2b: "los elegí para diferenciarme de la típica web hecha con IA" | Los efectos se conservan y se traducen al mundo metro; no se sustituyen por otros genéricos |
| **El rendimiento manda sobre el efecto** | `dc52ef4` → `1c55152`: se probó un fondo 3D con three.js y **se revirtió** ("too dense, hurt readability") y se desinstaló; `1c9cb88` y `d9409e9` rondas de rendimiento móvil; `b3315f6` hero estático en HTML | Cada efecto tiene que caber en Lighthouse móvil de 90 o más. Si no cabe, se rediseña, no se impone |
| **Accesibilidad sin excusas** | Todos los efectos respetan `prefers-reduced-motion` y se desactivan en táctil (`c66a548`, `78e5310`); `566e8f9` y `0b852f2` arreglos de contraste; `86a9338` foco visible global y `lang` sincronizado | Se mantiene, y se mejora la alternativa con movimiento reducido (menos movimiento, no ninguno) |
| **Bilingüe y orientado a reclutador** | `229f8ed` ES/EN desde el primer día; `0bbb95e` el CV sigue al idioma activo; fase 1: ES apunta a España, EN a la UE | Todo texto nuevo en los dos idiomas; el CV siempre en el idioma activo |

---

## 2. Decisiones de diseño, una a una

Estado en el v2: **✅ se conserva** · **⬆ se conserva y se mejora** · **💬 en discusión** (propuesto cambiar, pendiente de OK).

### 2.1 Efectos que Erardo ha marcado como intocables (fase 2b)

| Decisión | Desde | Por qué (palabras del autor o del commit) | Estado v2 | Cómo vive en el metro |
|---|---|---|---|---|
| **Borde de luz por proximidad del cursor** en las tarjetas | `78e5310` (inspirado en un diseñador en Twitter/X); con colores por tarjeta en `893ebf1`; ampliado a todas las tarjetas en `44f5404`; tinte de color en `86a9338` | "Pointer-following conic-gradient glow border on cards"; *tiene que estar en todas las tarjetas* | ⬆ | Igual en **todas** las tarjetas, con el color de la línea de cada una. Mejora: medidas en caché y solo las tarjetas visibles (más barato) |
| **Botones magnéticos** | `dc52ef4` (CTAs del hero); `ef086d9` (CTA de contacto y footer); `86a9338` ("Caso de estudio") | Dar peso físico a las acciones principales | ⬆ | Se conservan. Mejora: interpolación con muelle para que tenga inercia (criterio de Emil) |
| **"Ver código" con brillo de carga** (anillo que gira) | `098dc33` "Gemini-style sweep ring"; `fed7ef2` velocidad ajustada a 2,1 s por vuelta | *Llamar la atención para que la gente siga mirando los proyectos y pulse* | ⬆ | El arco gira con el **color de la línea del proyecto** en lugar del degradado índigo. Con movimiento reducido, arco estático |
| **"Caso de estudio" que parpadea o pulsa** | `86a9338` "a subtle pulse when its project card is hovered, to invite the click" | Invitar a pulsar | ⬆ | Se activa **al entrar en pantalla** (2 o 3 pulsos y para) y al pasar el cursor por la tarjeta, en lugar de un bucle infinito. La intención se mantiene |
| **Color de proyecto con significado** | `893ebf1` "eco green, hydro aqua, donation pink, studysync violet, easycab amber" | El color dice de qué va el proyecto | ✅ | **Cada proyecto es una línea de metro de su color**: EcoAlerta verde (medioambiente), Hydrofulness azul agua, EasyCab ámbar o amarillo (taxis), Red de Donación rosa (cuidado; su icono es un corazón), StudySync violeta. Chaos Crew no tenía color (no estaba en la web en julio): propuesta **rosa fresa**, pendiente de confirmar. *Nota: el prototipo A cambió algunos colores por error; el v2 lo corrige* |
| **Cursor personalizado** | `78e5310` "dot + spring-follow ring, mix-blend, expands on hover" | Interacción premium y propia | ⬆ | Rediseño ligado al metro (ver el plan de la fase 2b). Solo con ratón, desactivado en táctil y con movimiento reducido, y **sin perder la usabilidad del cursor del sistema** sobre texto y campos |

### 2.2 Otros efectos y decisiones de la web actual

| Decisión | Desde | Por qué | Estado v2 |
|---|---|---|---|
| Constelación de partículas en el hero que reacciona al cursor | `c66a548`; física de repulsión en `5f9652e`; 3D real con órbita en `f23d24a` | Un hero vivo que responde al usuario, en canvas 2D ligero en vez de three.js | 💬 Propuesta: el mapa vivo (trenes, líneas) hereda ese papel de "hero que responde al cursor". La técnica (canvas que se pausa fuera de pantalla) se reutiliza si hace falta |
| Texto que se desordena (`ScrambleText`) | `c66a548`; 2000 → 1000 ms en `86a9338` ("so the decrypt effect reads better") | Carácter "terminal" en la etiqueta del hero | ⬆ Se conserva en la etiqueta `DESARROLLADOR_FULL_STACK.execute()` (decisión de la fase 1). Propuesta: que también "resuelva" los nombres de estación como en un panel de andén |
| Aurora que sigue al cursor | `78e5310`; atenuada en `5f9652e` ("less blinding") | Color ambiental que sigue al usuario | 💬 En fase 2 propuse quitarla por coste (desenfoque de 64 px y bucle permanente). No está en tu lista de intocables. Alternativa: que **ilumine el mapa en modo noche** y se pause cuando el cursor está quieto |
| Inclinación 3D (tilt) en tarjetas, foto y bio | `dc52ef4`; `0b852f2` | Profundidad al pasar el cursor | ⬆ Se conserva en tarjetas y foto. Propuesta: menos ángulo en bloques de texto largo |
| Barra de progreso de scroll | `5f9652e` | Orientación | ⬆ Pasa a ser **un tren recorriendo la línea**: es el indicador de progreso del viaje |
| Apariciones al hacer scroll (subir y girar un poco) | `dc52ef4` "rise + slightly rotate for more character"; `86a9338` `once:true` | Carácter al entrar las secciones | ⬆ Cada sección con su propia coreografía metro en lugar de una entrada idéntica |
| Línea de tiempo que se dibuja con el scroll | `9374946` | La experiencia "se recorre" | ✅ En el metro es literal: la línea se dibuja y las estaciones se iluminan |
| Nodos que se encienden al llegar la línea | `2c806fe` "one-shot ping + halo… fully reversible on scroll-up" | Feedback de recorrido | ✅ Las estaciones se encienden al pasar el tren |
| Pirámide invertida en Formación (grado → CFGS → CFGM) | `4f59304` | El tamaño codifica el nivel académico | ⬆ En el metro: el grado es una estación de correspondencia grande y los ciclos son estaciones de la línea |
| Colores por nivel en Formación (azul marino CFGS, verde azulado CFGM, ámbar B2) | `893ebf1`, `80497d4` | Que los niveles se distingan | ⬆ Se reinterpretan como colores de tramo |
| Rejilla asimétrica de proyectos (bento) | `c7b97a2` | Romper la rejilla uniforme | 💬 Pasa a ser el recorrido por líneas (ver plan); la intención, que los proyectos no sean tarjetas iguales, se conserva |
| Vídeo del proyecto destacado que se reproduce al entrar en pantalla | `c50fc43`, `d72466b` | Prueba real en movimiento | ✅ Con póster en todos los vídeos |
| Transición de la tarjeta al case study (View Transitions) | `d7f2773` "card-title morph… 0 KB, progressive enhancement" | Continuidad espacial | ⬆ Se amplía: "entrar en la estación" del proyecto |
| Menú con la sección activa (scroll-spy) | `ef086d9` | Orientación | ⬆ El menú es el **plano**: la estación actual se marca |
| Copiar email con feedback | `ef086d9` | Contactar sin salir de la página | ✅ Y se arregla su nombre accesible |
| Identidad de color por tarjeta en Contacto (email rojo, GitHub blanco, LinkedIn azul, ubicación estilo Google Maps) | `54af42c` | Reconocer cada canal de un vistazo | ⬆ Se conserva el significado y se adapta a la paleta del plano |
| Pastillas sociales flotando | `0b852f2` | Vida en la sección Sobre mí | 💬 Propuesta en fase 2: quitarlas porque un botón en movimiento es difícil de pulsar. No está en la lista de intocables. Alternativa: que floten solo hasta el primer `hover` |
| La mano que saluda al entrar en pantalla | `c9967d9` | Calidez, una sola vez | ✅ |
| Degradado animado en el nombre | `229f8ed` (tema índigo/violeta); contraste arreglado en `566e8f9` | Identidad de marca | 💬 Propuesta: la marca pasa a ser la línea 1 (índigo, continuidad con el tema original), con el nombre en tinta y sin degradado |
| Hero estático en el HTML para móvil | `b3315f6` | Pintar antes de que cargue el JS en móvil | ⬆ Se mantiene la intención (pintado rápido), pero idéntico al hero real para eliminar el CLS |
| Stack completo con 8 grupos, ★, "aprendiendo ahora" y cinta | `1c55152`, `d47bc33`, `80ab22e`, `75efacf`; fase 1 (revertido el recorte) | "Que se vea un junior al que no le da miedo tocar cosas" | ✅ Completo. Propuesta: presentarlo como **mapa de la red** (las tecnologías son estaciones) |
| Frase de historia (KUKA, pagarse la formación) | `d47bc33`, `11db5ce`; fase 1 | Que se note que no solo ha estudiado | ✅ |
| El CV sigue al idioma activo | `0bbb95e` | El reclutador recibe el CV en su idioma | ✅ |
| Previsualizaciones OG propias por proyecto | `a0713d9` | Enlaces bonitos al compartir en LinkedIn o WhatsApp | ✅ Se rediseñan con el estilo del plano |

### 2.3 Decisiones de contenido (fase 1, octubre de 2026)
Están en [docs/plan/fase-1.md](plan/fase-1.md): titular del CV, cifras verificables, mercado por idioma, Leroy Merlin y trabajos previos en "Otra experiencia", Hydrofulness como responsable técnico en un equipo de cinco, Food Donation de Ingeniería Web, App Informática fuera de la experiencia, y el stack de la web completo mientras el CV va recortado.

---

## 3. Registro de cambios de criterio
- **2026-10-20** — Erardo revierte el recorte del stack: la web muestra todo lo tocado y el CV sigue recortado.
- **2026-10-20** — La etiqueta del hero vuelve a `DESARROLLADOR_FULL_STACK.execute()`.
- **2026-10-21** — Dirección elegida: **Metro (A)**, en versión profesional y con experiencia de scroll. Efectos intocables: borde de luz, imanes, anillo de "Ver código", pulso de "Caso de estudio", colores con significado y cursor propio (rediseñado). Autis Ingenieros son **dos** paradas.
