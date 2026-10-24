# Fase 2b · Entrega 4 (ronda 4)

Rama `proto/d-metro-v2`, sin push. Capturas y vídeos en [`ronda-4/`](ronda-4/).

## Tus 6 puntos

| # | Pedido | Hecho | Evidencia |
| --- | --- | --- | --- |
| 1 | Fondo A con profundidad; fuera B y `?bg=` | Tres planos de red (lejano, medio y cercano; dos en móvil). Los lejanos son más pequeños, tenues y desenfocados (blur pintado una vez, nunca por frame). Parallax por plano con scroll y ratón, y brillo (bloom) en los trenes. Mismas reglas de rendimiento. | `fondo-antes.mp4` / `fondo-despues.mp4`, `fondo-despues.png`, `fondo-despues-movil.png` |
| 2 | «Ver código» multicolor | Cometa azul, rojo, amarillo y verde (colores oficiales de Google) solo en esos botones; el resto sigue con su línea. Misma técnica y velocidad; ahora también se pausa con el botón de pausa. | `ver-codigo-antes.png`, `ver-codigo-dia.png`, `ver-codigo-noche.png`, `ver-codigo.mp4` |
| 3 | Hueco del tablero: 2 opciones y elegir | Un diseñador senior eligió **(a) llenar la altura**, por 5 razones (abajo) | `tablero-antes.png`, `tablero-a-1440.png`, `tablero-b-1440.png`, `tablero-b-sticky.mp4`, `tablero-final-*.png` |
| 4 | Correspondencias un poco más bajas | 260 → 240 px (escritorio), 180 → 166 (móvil) | — |
| 5 | Menos scroll en Trayectoria; glow de una sola tarjeta | ~190 px por estación (antes ~300); solo se enciende la tarjeta bajo el cursor | — |
| 6 | Stack con iconos de marca, ★ que destaquen e interacción | Iconos oficiales en color de marca (ajustados a 3:1 sobre el chip; los logos negros pasan a tinta de noche). Las ★ arriba como «Correspondencias». Puntos de color por proyecto en cada tecnología. «Líneas de proyecto»: al pasar el cursor, enfocar o tocar una tecnología se encienden los proyectos donde la usaste. Se mantienen todas las tecnologías y la cinta. | `stack-antes.png`, `stack-escritorio-dia.png`, `stack-escritorio-noche.png`, `stack-final-noche.png`, `stack-movil.png`, `stack-interaccion.mp4` |

**Nota sobre el punto 2:** ni el commit `098dc33` ni la web antigua (`legacy/`) usaron nunca azul, rojo, amarillo y verde. El arco original era índigo, violeta y rosa (`rgba(99,102,241)` → `rgba(167,139,250)` → `rgba(240,171,252)`). He usado los colores oficiales de Google, como pedías.

### Por qué la opción (a) del tablero

1. Es la única que elimina el hueco. La (b), la ficha fija, solo lo cambiaba de sitio: dejaba 243 px vacíos en StudySync a 1440 y ~330 px a 1366.
2. Las demos venden mucho más: el vídeo apaisado pasa de 340×198 a 459×265 y el móvil de EcoAlerta de 210×438 a 323×673.
3. La ficha mide lo mismo en los 6 proyectos, con los botones siempre en el mismo sitio: cambiar de proyecto se siente como cambiar de andén. En (b) la altura saltaba hasta 175 px en cada clic.
4. El efecto sticky de (b) apenas se notaba: ~100 px de recorrido a 1440 y nada a 1024.
5. Sin cambios en móvil (el acordeón queda igual).

Aplicados además los 5 ajustes que pidió el diseñador:
- arreglo a 1024;
- recorrido técnico grande en los proyectos sin vídeo;
- pastillas a dos líneas;
- vídeos muy anchos centrados;
- columna de EcoAlerta ordenada.

El crítico final pidió que la ficha no superara la pantalla (P1). A partir de 1280 px la ficha mide lo que la lista, pero nunca más que la pantalla, así que a 1366×768 los botones se ven en los 6 proyectos.

## Pruebas funcionales (agente)

Todo PASS:
- tablero en 1440/1366/1024 y con teclado;
- transición al caso de estudio, incluidos «Siguiente» y «Volver»; Ctrl+clic no se intercepta y con reduced motion no hay transición;
- arco multicolor, también en táctil;
- Stack con ratón, teclado y toque;
- fondo: pausa, reduced motion y clics que atraviesan;
- un solo glow;
- 190 px por estación;
- ES/EN y día/noche sin errores de hidratación;
- los 5 casos de estudio con recarga;
- 404;
- reproductor;
- abono y QR;
- copiar email;
- CVs;
- sin scroll horizontal.

El único fallo fue el disco de la Correspondencia, cortado en móvil, y está corregido. También corregido: «Volver a proyectos» ahora aterriza en el tablero con la línea elegida a la vista.

## Rendimiento

El Stack nuevo había subido el HTML de la home de 27 a 62 KB comprimidos (iconos SVG) y el LCP móvil a ~2,2 s. Ahora los logos se pintan al acercarse a la sección: HTML de 27 KB y **LCP móvil de 1,78 s** (4× CPU y 3G rápida). Escritorio ~0,18 s. **CLS 0.** axe: 0 infracciones en la home (escritorio día y noche, móvil).

## Crítico con ojos frescos

Notas:

| Aspecto | Nota |
| --- | --- |
| Primera impresión | 8 |
| Claridad | 8 |
| Calidad visual | 7,5 |
| Movimiento | 7,5 |
| Móvil | 7 |
| Noche | 8 |

Veredicto: «se puede fusionar y enseñar en cuanto se arregle el P1», que ya está arreglado. Del fondo: «vistoso, sobrio y accesible; no tocaría nada más».

**Aplicado:**
- P1, ficha a 1366×768;
- cabecera sin saltos de línea a 1024;
- texto «Toca…» en táctil en el Stack.

**Descartado:** «el arco gira siempre en reposo». Lo comprobé: en reposo está apagado; solo da sus 2 vueltas al entrar en pantalla, como pediste.

**No aplicado, porque choca con decisiones tuyas o cambia diseño:**
- **Quitar la cinta del Stack:** pediste que se quedara.
- **Correspondencias (dice que el disco con la línea cortada parece una lupa):** te gustan como están.
- **Chaos Crew:** la ficha queda medio vacía (recorrido grande, sin medios). Si tienes una captura o un GIF del juego, lo pongo.
- **Donación e Hydrofulness:** las capturas se leen pequeñas; se podrían recortar a la zona relevante (los endpoints).
- **Stack en móvil:** la barra fija de líneas ocupa ~140 px.
- **Casos de estudio:** iconos genéricos en los chips de stack; el selector móvil dice «Plano» dentro del caso.

## Pendiente de ti

- **JavaScript en EcoAlerta y Git en todos los proyectos:** casi seguro que los usaste, pero no figuran en los datos, así que en el Stack no encienden ningún proyecto. ¿Los añado?
- **Tu OK para el merge en `main`.** Lo hago yo en local y el push lo haces tú.
