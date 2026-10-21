# Informe 3 · Rendimiento y accesibilidad del v2 (WCAG 2.2 AA)
*Subagente especialista. Ha revisado `main` (`App.tsx`, `motion/*`, `layout/*`, `index.css`, `index.html`, `vite.config.ts`, `prerender.mjs`) y el prototipo v1. Es de solo lectura: no ha modificado nada.*

## Problemas detectados en el código actual
- **JS inicial ≈ 155 KB gz:** `react` 70, `motion` 43, `vendor` 27 e `index` 14 KB. framer-motion entra en la carga inicial solo por la entrada del hero y por `useReducedMotion`.
- **`GlowBorders.tsx` provoca layout thrashing:** lee `getBoundingClientRect` y escribe `setProperty` en el mismo bucle, tarjeta a tarjeta.
- **`Magnetic.tsx`:** lee el rect después de aplicar el transform, así que el objetivo se desplaza y tiembla. Además deja `will-change` permanente.
- **`CustomCursor.tsx`:**
  - `cursor:none !important` en todo: también oculta el cursor de texto y el de enlace.
  - Su bucle de animación (rAF) no se detiene nunca.
  - Solo comprueba `pointer: coarse`, así que los dispositivos híbridos quedan mal.
- **Prototipo:** trenes y pulso infinitos sin forma de pausarlos (incumple el criterio 2.2.2), y `.m-station` empieza con `opacity:0` sin condición.
- **`ecoalerta-demo.mp4` pesa 6,8 MB.**
- **CLS 0,139:** viene del hero estático copiado a mano, que React descarta al montar, y del cambio de fuente de Inter.

## Presupuestos (móvil, perfil de Lighthouse)
| Métrica | Presupuesto |
|---|---|
| JS inicial | ≤ 110 KB gz |
| CSS | ≤ 15 KB gz |
| SVG del hero | ≤ 12 KB |
| Fuentes | ≤ 90 KB (5 woff2) |
| Total sin vídeo | ≤ 350 KB |
| LCP | ≤ 2,0 s |
| CLS | ≤ 0,02 |
| TBT | ≤ 150 ms |
| INP | ≤ 150 ms |

**Cómo llegar:**
- Sacar framer-motion de la carga inicial (−43 KB): la entrada del hero va en CSS y `useReducedMotion` se sustituye por un hook propio.
- GSAP y ScrollTrigger con `import()` cuando el navegador quede libre después del LCP.
- El hero funciona sin JS: las líneas se dibujan con CSS y los trenes con SMIL.
- Hidratación troceada por secciones con `<Suspense>`.
- Vídeos con `preload="none"`, póster y 1,5 MB como máximo.

## Scroll fijado horizontal accesible
- **Mejora progresiva:** el HTML base es una `<section>` con un `<ol>` de estaciones, siempre en vertical. El modo fijado solo se activa con `(min-width:1024px) and (min-height:640px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)`. Así, con zoom al 200 %, en táctil y con movimiento reducido se ve en vertical sin código extra.
- **Scroll ligado, no secuestrado:** sin `preventDefault` en rueda ni en teclado, y unas 4 pantallas como máximo.
- **Teclado:** un `focusin` calcula el scroll de cada estación y llama a `lenis.scrollTo`. `scroll-padding-top` igual a la altura de la barra (criterio 2.4.11). Botones "Estación anterior / siguiente", un índice con enlaces `#id` y un enlace "Saltar trayectoria".
- **Anclas:** `scrollToHash` resuelve los ids de estación; nada de `pushState` en cada estación.
- **Lectores de pantalla:** SVG y progreso con `aria-hidden`; todo el contenido en el DOM; sin `aria-live` ligado al scroll; es una lista, no un carrusel.
- **Qué no hacer:** `overflow:hidden` en el body, snap agresivo, contenido que solo existe al hacer scroll, foco fuera de la vista, romper los `#hash` o el botón Atrás, o fijar en táctil.

## Reglas por efecto
Todos los efectos se activan solo con `(hover:hover) and (pointer:fine)`, sin movimiento reducido y con `forced-colors: none`.
- **Borde de luz:** un IntersectionObserver con las tarjetas visibles; primero se leen todas y después se escriben; solo se escribe si el valor cambia; `@property` con `inherits:false`.
- **Imanes:** el rect se cachea en `pointerenter`; desplazamiento máximo de 8-10 px; solo se mueve el hijo; `will-change` solo durante el hover.
- **Cursor:** sin `cursor:none` global. Es un acompañante del cursor del sistema; su bucle se detiene cuando está quieto o la pestaña está oculta; desaparece al usar el teclado; nunca tapa el foco.
- **"Ver código":** también en `:focus-visible`. Es más barato rotar con transform un pseudo-elemento cónico.
- **"Caso de estudio":** 2 o 3 pulsos una sola vez al entrar en pantalla (IntersectionObserver a 0,6), a 1 Hz como mucho; desactivado con movimiento reducido.
- **Trenes:** `svg.pauseAnimations()` fuera de vista y con la pestaña oculta, un **botón "Pausar animación"** (criterio 2.2.2) y 3 trenes como máximo.

## Fuentes
Auto-alojadas, sin Google Fonts. Barlow 400 y 600, Barlow Condensed 600 y 700 y JetBrains Mono 500 en subset latin: unos 80-85 KB. Preload solo de la del h1. `swap` con métricas de reserva ajustadas, o `optional` si el CLS por fuente supera 0,01.

## CLS y LCP
Prerender real de `/` con `renderToString` y `hydrateRoot`, que elimina la copia manual del hero. Ninguna animación en el h1. El estado inicial del mapa va dentro de `prefers-reduced-motion: no-preference`. Espacio reservado con `aspect-ratio`.

## Medición
- PageSpeed Insights API (remoto: evita que Lighthouse local no arranque), mediana de 3 ejecuciones.
- Script de Playwright con Edge, emulación móvil y CPU ×4: PerformanceObserver para LCP, CLS, TBT e INP; 5 ejecuciones.
- Vídeo con `recordVideo`, también con movimiento reducido y zoom al 200 %.
- axe con `@axe-core/playwright`.

## Checklist de aceptación
PSI móvil ≥ 90 y escritorio ≥ 95 · A11y, BP y SEO = 100 · LCP ≤ 2,0 s con el h1 sin animar · CLS ≤ 0,02 · TBT e INP ≤ 150 ms · JS inicial ≤ 110 KB · sin Google Fonts · `/` prerenderizado con `hydrateRoot` · se lee sin JS · el teclado recorre el tramo horizontal con el foco visible · anclas y Atrás funcionan · movimiento reducido en vertical y estático · zoom al 200 % y 320 px sin scroll horizontal · táctil sin pin, cursor, borde de luz ni imanes · botón de pausa · parpadeo único · cursor del sistema visible · sin reflow forzado · contraste AA · vídeos de 1,5 MB o menos con póster · axe sin violaciones en ES y EN.
