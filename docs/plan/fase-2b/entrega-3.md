# Fase 2b · Entrega 3 (ronda 3)

Rama `proto/d-metro-v2`, sin push. Capturas y vídeos en [`ronda-3/`](ronda-3/).

## 1. Tus respuestas a la entrega 2

| # | Tu respuesta | Hecho |
| --- | --- | --- |
| 1 | Abono: menos zoom, foto original | Recorte nuevo desde `../Erardo_Aldana_Pessoa_XTxlLQoBJp.jpg`: de encima del pelo a la cintura, brazos cruzados enteros. WebP 800/1200 + JPG. `profile.jpg/webp` ya no se usan (no borrados). Revisión del agente: sello de noche legible, QR más grande, elevación suave al pasar el ratón. |
| 2 | Sobre mí: la actual | Se queda (la versión corta solo estaba en el documento). |
| 3 | `*-demo.mp4` fuera de `public/` | Movidos a `media-originales/` con un README de qué vídeo publicado sale de cada uno. Nada borrado. |
| 4 | EcoAlerta no se regraba | Sin cambios. |
| 5 | Sello y «Válido desde» | OK, sin cambios. |
| 6 | Descripción del vídeo en inglés | `ecoalerta.en.vtt`; la pista elige ES/EN según el idioma. |

## 2. Revisión de animaciones (review-animations)

Ningún efecto de `design-rationale.md` se ha quitado: todos se han pulido.

| Antes | Después | Por qué |
| --- | --- | --- |
| Cursor tren animaba `width/height/border-radius` | Dos capas (cápsula y anillo) con `transform` + `opacity` | Lo que cambia de tamaño recalcula el layout en cada hover; transform va por GPU |
| `--glow`/`--start` heredables en cada tarjeta | `@property … inherits: false` | Mover el ratón recalculaba el estilo de todo el contenido de cada tarjeta cercana |
| Seguimiento del cursor, imán y aurora con factor fijo por frame | `follow()` dependiente del tiempo real | A 120/144 Hz iban el doble de rápido; ahora se sienten igual en cualquier pantalla |
| `:hover` de «Ver código» y «Caso de estudio» sin filtrar | Solo con `(hover: hover) and (pointer: fine)` | En táctil el hover se quedaba pegado y el arco giraba sin fin |
| Barra de progreso móvil con `width` | `scaleX` | Sin layout en cada scroll |
| Punto activo del raíl saltaba de tamaño | Crece con `transform: scale` | Antes no se animaba (cambiaba h/w) |
| Tooltip del raíl: solo fundido + `title` nativo duplicado | Entra deslizando 4 px; sin `title` | Origen físico y sin doble tooltip |
| Hoja «Plano» en móvil sin entrada | Se despliega en 240 ms (curva tipo cajón), cierre instantáneo | Acción ocasional: anima al abrir, responde seco al cerrar |
| Curvas `ease-out` de Tailwind (débiles) | `cubic-bezier(0.23, 1, 0.32, 1)` | Arranque más rápido: se siente más ágil con la misma duración |
| Trayectoria 450 ms, cambio de andén 320 ms | 400 ms y 260 ms | Más dentro del presupuesto de UI |
| Correspondencia: tramos lineales | Cada tramo acelera y frena (el scroll sigue mandando) | Ya no arranca ni para en seco |
| ScrambleText cambiaba glifos cada frame | Cada 45 ms | Menos parpadeo y un tercio de renders |
| Pulsación del reproductor `scale(0.94)` | `0.96` | Más sutil (0.95–0.98) |
| Abono: elevación a saltos al entrar el ratón | Elevación con el mismo muelle que la inclinación | Se asienta en vez de dar un salto |
| Abono: sombra que no giraba (losa gris a mitad del giro) | La sombra se estrecha con el canto de la tarjeta | Lo detectó el crítico (P1) |
| Imán de botones hasta 10 px | 6 px | «Ver proyectos» llegaba a tocar «Descargar CV» |
| Transición tablero → caso de estudio **no se ejecutaba** | `ViewLink` la lanza a mano tras cargar el chunk | `react-router` ignora `viewTransition` con `<BrowserRouter>` (lo detectó el QA) |

Veredicto de la revisión tras los cambios: **aprobado**. No quedan animaciones con `ease-in`, `scale(0)` en UI, `transition: all` ni propiedades de layout. Reduced motion y el botón de pausa se respetan en todo, incluido el fondo nuevo.

## 3. Fondo de partículas del modo noche: elige una

Las dos son Canvas 2D sin librerías y van en un chunk que se carga en idle después de hidratar (no tocan el LCP). El lienzo es `fixed` con `pointer-events: none` (CLS 0, el cursor tren sigue visible).

- Se pausan con la pestaña oculta y con el botón de pausa.
- Con reduced motion se quedan en un fotograma fijo.
- En móvil van a 30 fps, con DPR ≤ 1,5 y menos elementos.
- Solo existen de noche.
- A plena intensidad solo detrás del hero; al leer bajan al 42 %.

| | A · «Red en servicio» (**por defecto, recomendada**) | B · «Malla de estaciones» |
| --- | --- | --- |
| Qué es | Red octilineal tenue en los colores de los proyectos; trenes de luz que aceleran, paran en las estaciones y dan la vuelta en las cabeceras; con ratón, foco de «sala de control» | Estaciones que derivan en las 8 direcciones del metro y se enlazan con tramos a 45°/90°; el cursor hace de nudo |
| Vídeo | [`particulas-a.mp4`](ronda-3/particulas-a.mp4) | [`particulas-b.mp4`](ronda-3/particulas-b.mp4) |
| Coste (escritorio) | +0,2 ms de JS por frame, 0 frames largos | +0,2 ms, 0 frames largos |

Vista previa: `?theme=night&bg=a` o `?theme=night&bg=b` (`?bg=off` lo quita). El agente y el crítico recomiendan **A**: es una red de metro *en servicio*, mientras que B se parece al típico fondo «plexus». Cuando elijas, quito la otra opción y el selector.

Medido con el fondo activo: LCP móvil (4× CPU, 3G rápida) 1,73 s; escritorio 0,16 s; CLS ≤ 0,001.

## 4. QA funcional (agente)

Todo **PASS** salvo la transición al caso de estudio, ya corregida:

- navegación, raíl y Plano;
- `#estacion-*`;
- los 5 casos de estudio con carga directa y recarga, con y sin `/` final;
- 404 real;
- ES/EN sin errores de hidratación;
- pista VTT en los dos idiomas;
- noche por sistema, por botón y por `?theme`;
- reproductor (teclado, visor, pantalla completa, móvil);
- QR, decodificado: `linkedin.com/in/erardo-aldana`;
- copiar email;
- CV ES/EN;
- sin scroll horizontal a 390, 768, 1024 y 1440.

Corregido también: el `<title>`/`<meta>` duplicado que el prerender dejaba dentro de `#root`.

## 5. Crítico con ojos frescos

Notas: primera impresión 8, claridad para un reclutador 8, calidad visual 8, movimiento 7 (antes de los retoques), móvil 8, noche 7 con A. Veredicto: «casi listo». Sus tres P1 están resueltos: la sombra del giro, el tamaño del abono (420 → 380 px) y el fondo detrás del texto.

**No aplicado, porque contradice decisiones tuyas:**
- Cambiar `DESARROLLADOR_FULL_STACK.execute()` por `BACKEND_PYTHON.execute()`: dijiste que se queda.
- Quitar el aspecto de «carga» del arco de «Ver código»: es el efecto que elegiste.

**Propuestas pendientes de tu OK** (cambian diseño, no son pulido):
1. Tablero de proyectos: el panel deja 150–250 px vacíos abajo; propone panel `sticky` o vídeo más grande.
2. Correspondencias: comprimirlas de ~400 a ~240 px de alto y dibujar el disco como el símbolo de correspondencia (dos anillos).
3. Trayectoria: menos scroll por estación (~300 → ~200 px).
4. Borde de luz: radio 150 → 120 px para que no se iluminen 3 tarjetas a la vez.
5. Abono: aún mide ~790 px de alto en escritorio. Es el precio de verte de cuerpo entero; con `5/6` en la foto se ahorran ~20 px.
6. Cabecera de `/projects/hydrofulness`: columna derecha vacía.
