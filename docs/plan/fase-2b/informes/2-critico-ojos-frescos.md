# Informe 2 · Crítica con ojos frescos del prototipo v1
*Subagente "director de diseño". Solo ha visto capturas, no código. Ha usado Impeccable sin su binario (critique y craft-floor) y los criterios de Emil Kowalski (`emil-design-eng`). La skill `review-animations` no la puede lanzar un agente: solo el usuario, con `/review-animations`.*

> ⚠️ DEGRADED: crítica en un solo contexto, sin detector.

## Veredicto de especificidad
**Alto en el hero y medio en Proyectos.** El hero del v1 no se puede trasplantar a otra persona: la trayectoria real dibujada como plano es la mejor idea de la web. En Proyectos el concepto se diluye, con 6 filas idénticas y una línea decorativa que estira el stack.

| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Estado del sistema | 2 | No marca la sección activa; el plano pide un "usted está aquí" |
| 2 | Mundo real | 3 | SMR, DAM y DAW son jerga para un reclutador |
| 3 | Control | 3 | Scroll estándar (un fijado mal hecho bajaría la nota) |
| 4 | Consistencia | 2 | El color y el número se contradicen entre el hero y Proyectos |
| 5 | Prevención de errores | 3 | |
| 6 | Reconocer | 3 | La leyenda va separada de las líneas |
| 7 | Flexibilidad | n/a | Portfolio |
| 8 | Estética | 3 | Más limpio; ruido de badges y botones repetidos |
| 9 | Recuperación de errores | 3 | |
| 10 | Ayuda | n/a | Portfolio |
| **Total** | | **22/32** | Aceptable, en el límite de bueno |

## Problemas prioritarios
- **[P1] El color y el número se contradicen.** En un plano de metro, el color *es* la información. → Un único mapeo: L1 = trayectoria y cada proyecto, su línea, igual en todas partes. Las 6 líneas tienen que salir en el plano. Quitar las etiquetas "1 Backend / 2 Full-Stack".
- **[P1] Primera pantalla en móvil.** Los CTA quedan por debajo del pliegue y el plano tiene letras de unos 9 px. → Primero nombre, rol y CTAs; después un plano rediseñado para móvil, con etiquetas de 12 px o más.
- **[P1] Vídeo de EcoAlerta con bandas negras.** Un móvil en vertical dentro de un marco apaisado. → Marco vertical o composición propia. Cada proyecto necesita su pieza visual.
- **[P2] Filas de proyectos monótonas.** "Entregado" sale 5 veces y hay 5 botones negros. → Mostrar solo la excepción ("En obras"), agrupar el stack y recuperar las pruebas (Jest · Playwright · Swagger, arquitectura hexagonal).
- **[P2] El logo imita el roundel de TfL**, que es una marca registrada. → Glifo propio.

## Personas
- **Casey (reclutadora, móvil):** no hay CTA en la primera pantalla y el plano es ilegible.
- **Jordan (reclutador no técnico):** ¿qué es "1/2"? ¿SMR, DAM, DAW?
- **Marta (tech lead):** se han perdido las pruebas (tests, CI).
- **Sam (accesibilidad):** el significado va solo por color, el amarillo no contrasta sobre crema y el tren solo funciona con ratón.

## Animaciones (formato Emil)
| Antes | Después | Por qué |
|---|---|---|
| Líneas de 1,1 s ease-in-out con escalonado arbitrario | 700-850 ms ease-out. Las líneas de proyecto *nacen* de su estación de transbordo cuando la L1 llega a ella | Es una entrada, así que va ease-out. Que una línea salga de otra cuenta una historia |
| Estaciones con pop scale(0.6) 320 ms | scale(0.85) + opacidad 0 → 1 en 200 ms, cuando el trazo pasa por ellas | Nada aparece de casi cero; si no, el escalonado se va por encima de 1 s |
| 3 trenes en bucle infinito | 1 tren en la L1 que se para 1,5 s en cada estación, pausado fuera de vista y desactivado con movimiento reducido | Tres movimientos perpetuos junto al texto distraen |
| Latido de "Tu equipo" | Se mantiene (solo transform y opacidad) | Es el único foco que se gana un bucle |
| Tren de 900 ms al pasar el cursor por la fila | El tren sigue la X del cursor con un muelle, se engancha a la estación más cercana y resalta su tecnología | Es interrumpible e informa |
| (previsto) Cambio de línea | Barrido con `clip-path` en el color de destino, 450 ms, una vez por sección | Un único momento firmado |
| (previsto) Scroll fijado | Fijado solo a partir de 1024 px; en móvil y con movimiento reducido, vertical | El fijado castiga al lector de 30 s |

## Qué separa el v1 de un nivel Awwwards
- **Tipografía:** un sistema de rotulación, con halo de papel en las etiquetas (`paint-order: stroke`), lado fijo según la dirección de la línea, cifras tabulares, gris cálido con contraste y tracking de -0.02em en el nombre.
- **Composición:** el plano anclado a la retícula (borde superior a la altura del nombre y "Tu equipo" alineado con los CTAs) y ritmo en Proyectos.
- **Color:** paleta de líneas cerrada (7 como mucho, 3:1 contra el papel) y el amarillo con borde; el negro, solo para la tinta.
- **Detalle:** terminales con una marca perpendicular, transbordos tipo cápsula, grosor constante, plano propio para móvil, superficies del navegador tematizadas, logo propio y navegación tipo "estación actual".
- **No tocar:** el papel crema con tinta, el nombre grande, el plano sobre la cronología real, "Tu equipo · próxima estación", StudySync "en obras", la geometría a 45°, el menú de 3 entradas, ES/EN, los CTA y el texto visible desde el primer fotograma.

## Cinco riesgos para el v2
1. Secuestrar el scroll: como mucho unas 2 pantallas fijadas, solo en escritorio, con anclas y teclado funcionando.
2. Que la metáfora se coma la información: tecnologías, fechas y logros tienen que seguir siendo texto escaneable.
3. Codificar solo por color: siempre número + nombre + color, con contraste AA.
4. Imitar marcas reales: el roundel de TfL, el rombo de Metro de Madrid o la tipografía Johnston.
5. Exceso de movimiento en el navegador interno de LinkedIn en un Android modesto, o perder contenido de la versión anterior.
