# Informe 1 · Variantes de la experiencia de scroll
*Subagente "diseñador-ingeniero de interacción". Ha leído el prototipo v1 (`proto/a-metro`), sus capturas, `prerender.mjs` y `SmoothScroll.tsx`. Es de solo lectura: no ha modificado nada.*

## Dos problemas del v1 que afectan a todas las variantes
1. **El color no es coherente.** En el hero, las líneas son capas del stack (verde = Frontend, azul = Datos). En Proyectos, cada proyecto tiene su color. EasyCab sale violeta (tendría que ser amarillo) y Donación sale rojo, que es el color de la L1. Propuesta: la L1 es la trayectoria, cada proyecto es su propia línea con su color de siempre, y las capas del stack pasan a ser "zonas tarifarias".
   *Nota del agente principal: se adopta, pero con los colores originales de `893ebf1` (Donación en rosa, StudySync en violeta), no con los del informe.*
2. **El h1 es el elemento LCP y no puede empezar con opacidad 0.** Lo que sí se puede animar es el plano.

## Variante 1: «Recorrido» (vertical con tramos horizontales fijados) · complejidad M
- **Hero:** el nombre, el rol, los CTA y "Próxima estación: tu equipo" a la izquierda. A la derecha, el plano se dibuja una sola vez (unos 1,2 s) y el tren de la L1 se para en "Tu equipo", que late. Ya asoma el primer proyecto. Todas las estaciones-proyecto del plano son enlaces, así que se llega a los proyectos en un gesto.
- **Proyectos:** vertical y sin fijar. Una espina del color de cada proyecto recorre el lateral y cada proyecto es un andén que se monta una vez, con un escalonado de 60 ms. No se fija para que el reclutador pueda pasar rápido.
- **Trayectoria (fijada en horizontal):** Experiencia y Formación unidas en la L1. El tren avanza estación a estación (SMR → DAM → Autis I → DAW → Autis II → Grado → NTT → TFG → Tu equipo). En cada estación se abre un panel. La "otra experiencia" es un ramal discontinuo.
- **Stack:** ocho zonas tarifarias que se montan, más la cinta. "Aprendiendo ahora" va como estación en obras.
- **Sobre mí:** tarjeta de "abono" con la foto y la historia de KUKA.
- **Contacto:** la L1 termina en "Fin de trayecto · tu equipo".
- **Cambio de línea:** un nudo de correspondencia fijo (`sticky`) unos 40 vh. La línea saliente se retrae, la nueva sale a 45° y un disco del color siguiente escala desde el nudo (con `transform`) y descubre la sección. Un rótulo rota: "Correspondencia → Línea 3 · Experiencia".
- **Menú:** en escritorio, un rail fijo a la derecha con el tren marcando la posición y estaciones que se pueden pulsar. En móvil, una barra fina con mini-estaciones y un botón "Plano" que abre una hoja con el plano.
- **Móvil:** la Trayectoria pasa a ser una espina vertical. **Movimiento reducido:** sin fijados, con fundidos de 150 ms.
- **Teclado:** al recibir el foco una estación (`focusin`) se calcula el scroll de esa estación y se llama a `lenis.scrollTo`. Hay un enlace de salto. **Lectores de pantalla:** `<ol>` de estaciones y el SVG decorativo; el plano tiene que ser un `<nav>` con enlaces reales.
- **Técnica:**
  - `sticky` más el progreso de ScrollTrigger, en lugar de `pin`, para que el CLS sea 0. Se usa `containerAnimation`.
  - Lenis sincronizado con ScrollTrigger y `gsap.matchMedia()`.
  - `body { overflow-x: clip }`.
  - MotionPathPlugin, o una tabla de puntos `getPointAtLength` calculada al redimensionar.
  - Variables CSS en lugar de estado de React.
  - Menos de unos 20 triggers.
  - Un solo vídeo reproduciéndose a la vez.
  - GSAP cargado en `requestIdleCallback`.

## Variante 2: «El plano es la web» (cámara sobre un mapa único) · complejidad L
El scroll mueve una cámara por un plano SVG gigante. El contenido va en paneles anclados a las estaciones, el cambio de línea es literal y un mini-plano hace de "usted está aquí". Riesgos altos: desorienta al reclutador, rinde mal en Android de gama media, la accesibilidad es cara y en móvil acaba siendo otra web.

## Variante 3: «Tablero de salidas» (vertical con secciones que se montan) · complejidad S/M
Sin fijados largos. Los proyectos son un tablero con 6 filas (línea, destino, estado), con letras que pasan como un panel de paletas y filas que se despliegan a su ficha. Las secciones se montan con CSS ligado al scroll (`animation-timeline: view()`) con respaldo IntersectionObserver. El cambio de línea es una banda de transbordo de unos 30 vh. Es excelente en rendimiento y accesibilidad, pero puede quedarse en "bonita" sin sorprender.

## Piezas comunes
- El borde de luz se tiñe con el color de la línea de cada tarjeta (`--c`).
- El anillo de "Ver código" es una línea circular que el tren completa.
- "Caso de estudio" late dos veces al entrar en pantalla.
- Se mantienen los imanes.
- Cursor: un roundel que sobre un enlace se vuelve tren o flecha y se atrae a las estaciones.
- Modo noche con tokens `--m-*`.
- Viaje de una petición: tramo fijado con `sticky`.

## Recomendación
Una mezcla: el **esqueleto de la Variante 1** (un único tramo horizontal fijado, la Trayectoria); **Proyectos como tablero sin fijar**, de la Variante 3; de la Variante 2, **solo el mini-plano como menú** y las estaciones del hero como enlaces; el cambio de línea, solo 3 o 4 veces. Técnica: `sticky` más el progreso de ScrollTrigger, con GSAP y Lenis cargados tarde. Complejidad M+.

## Tres momentos memorables obligatorios
1. "Próxima estación: tu equipo": el plano del hero se dibuja, el tren se para en una estación que late y esa estación es el CTA de contacto; la web termina en el mismo sitio.
2. Recorrer la L1 en horizontal, de SMR al TFG con 10/10, con el ramal de "otra experiencia".
3. El viaje de una petición en el case study, con el código en cada andén.
