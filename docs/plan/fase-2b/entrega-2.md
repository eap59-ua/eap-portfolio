# Fase 2b · Entrega 2: tus cambios y respuestas aplicados

Rama `proto/d-metro-v2`, en commits pequeños y sin push. `main` no se ha tocado.

## Qué revisar
- **Capturas** en [`ronda-2/`](ronda-2/), en escritorio y móvil, día y noche:
  - `01` hero con el estado del servicio;
  - `02`–`04` abono: anverso, inclinado y reverso con QR;
  - `05` contacto;
  - `06`–`09` casos de estudio y visor;
  - `10`–`13` móvil.
- **Vídeos de interacción:**
  - `ronda-2/interaccion-escritorio.mp4`: inclinación y giro del abono, hover en las tarjetas, copiar email, reproductor y visor.
  - `ronda-2/interaccion-movil.mp4`.
- **Para probarlo tú:** `npm run dev`, o `npm run build && npx vite preview` para ver lo mismo que se ha medido.

## A. Tus respuestas, aplicadas
| # | Qué pediste | Hecho |
|---|---|---|
| 1 | Etiqueta `execute()` | Se queda |
| 2 | Hero con Node.js | «Desarrollo backends con **Python (FastAPI) y Node.js** sobre **PostgreSQL**…» |
| 3 | Stack completo y cinta | Sin cambios |
| 4 | Sobre mí más corto | Propuesta abajo; tú eliges. La frase de los palés no estaba en la web (se descartó en el plan) |
| 5 | Tonos más oscuros para el contraste | Aplicado |
| 6 | Destacado por defecto | EcoAlerta (ya lo era) |
| 7 | Rol en NTT | «Desarrollador Appian · contrato de formación» (ya estaba) |
| 8 | 14 meses | «Unos 14 meses en empresa entre prácticas y contrato de formación», como en el CV. Además, la web servía CV ES/EN antiguos: ahora sirve los PDF del 21-oct |
| 9 | Modo noche | Sigue `prefers-color-scheme` y hay un botón sol/luna (se recuerda tu elección). Se aplica antes del primer pintado, sin destello |
| 10 | 404 real | Comprobado con un servidor que imita las reglas de Vercel (detalle debajo) |
| 11 | `.gitignore` | `.playwright-mcp/` añadido |
| 12 | Scroll al redimensionar | Arreglado: la sección se queda en el mismo sitio en 390, 820 y 1440 px |

**Detalle del punto 10:**
- Los 5 casos de estudio responden 200 con su título, con y sin barra final, también al recargar tras navegar.
- Las rutas desconocidas dan un 404 real con «Vía muerta».
- Recuerda que se comprueba de verdad en la preview de Vercel cuando hagas push.

## B. El abono
**Foto grande**: 386×330 px en escritorio (antes unos 190) y 296 px en móvil. Es una tarjeta vertical «de verdad»:
- chip y contactless;
- banda holográfica que cambia de tono con el ángulo;
- textura y guilloché;
- ranura de colgar y troquel;
- sello «VALIDADO» sobre el borde de la foto.

**Efecto 3D:**
- Inclinación de hasta 8° con muelle, reflejo especular y sombra que se mueve al contrario.
- Solo con ratón; con movimiento reducido no hay giro, solo un fundido.

**Botón ↻ en la cabecera para girarla:**
- El reverso es un **QR a tu LinkedIn**. Se genera en el build con `scripts/generate-qr.mjs`.
- Lo he comprobado decodificando capturas reales en día, noche y móvil: abre exactamente tu perfil.
- Debajo lleva la URL escrita y un enlace, para quien ya está en el móvil.

**Campos:**
- «Título: Ingeniero Informático · UA 2026» en lugar de «Desde 2016 · SMR».
- Pie: «Válido desde: incorporación inmediata · N.º EAP-2026».

**Botones sociales** más grandes, con borde de luz, imán, la misma flecha en los cuatro y flotando a la vez.

## C. Contacto
Las 4 tarjetas comparten anatomía (cabecera de marca y cuerpo neutro). El color de marca solo va en la cabecera, para que no compita con el color de las líneas.
- **GitHub:** blanco y negro.
- **LinkedIn:** su azul.
- **Email:** sobre con los colores de Gmail. Toda la tarjeta copia el email y confirma «¡Copiado!»; «o abrir en tu correo» aparte.
- **Ubicación:** mapa estilo Google Maps con su pin y tu texto exacto. Enlaza a Gandía en Maps.

## D. Disponibilidad visible
- **Panel «Estado del servicio» junto al rol**, con la franja de la L1 como un cartel de andén: «● Disponible · incorporación inmediata» y debajo «Gandía (Valencia) y Alicante · Reubicación: cualquier punto de España».
- **Unifiqué el mensaje en toda la web**: hero, Sobre mí y Contacto dicen lo mismo.

## E. Vídeos de los casos de estudio
- **Reproductor de verdad a todo el ancho:**
  - play/pausa, barra de progreso y tiempo;
  - sonido (los clips no tienen audio, así que lo indica en lugar de fingir un botón);
  - **Ampliar**: un visor que carga la versión HD;
  - **pantalla completa**;
  - teclado: Espacio/K, ←/→, F, M.
- **EcoAlerta:**
  - Mantiene el marco de móvil; los controles son la «barbilla» del teléfono.
  - El clip de móvil ya no muestra la barra de tareas.
  - **Aviso:** a partir del segundo 20, la grabación original pasa a Chrome de escritorio. Por eso el móvil son los 0–19,8 s, y la parte de escritorio (mapa, 2FA, panel admin) va como segundo vídeo limpio debajo.
- **Otros recortes:** en Hydrofulness quité la barra de scroll y una burbuja de `localhost`. Los pósters son fotogramas limpios.
- **Uso de los `*-demo.mp4`** (no he borrado ninguno):
  - Son tus originales (10,9 MB). De ellos salen todos los recortes `-web`, `-hd` y `-phone`.
  - Ningún componente los usa: solo aparecen en campos viejos `video`/`poster` de `projects.ts` que nadie lee.
  - **Recomendación:** sacarlos de `public/`, a una carpeta que no se publique (p. ej. `media-src/`), para no subir 10,9 MB inútiles al deploy. Lo hago si me dices que sí.
  - Los `*-poster.webp` antiguos (0,23 MB) tampoco se usan.

## Revisión con subagentes
- 3 agentes en paralelo (abono, contacto, reproductor), cada uno con sus archivos.
- Las mismas partes pasaron dos veces por el crítico, que revisa solo capturas, sin ver el código:

| Parte | 1.ª pasada | 2.ª pasada |
|---|---|---|
| Panel de estado | 6 | 8 |
| Abono | 7 | 8,5 |
| Contacto | 6,5 | 8,5 |
| Reproductor | 7,5 | 8,5 |

  Veredicto: «listo para enseñar». Apliqué también sus retoques finales.
- **axe:** 0 violaciones en la home y en los casos de estudio, en día y noche, escritorio y móvil.
- **Movimiento reducido:** no queda ningún bucle activo.

| Medido (build de producción, con compresión) | Móvil (CPU 4×, 1,6 Mbps) | Escritorio |
|---|---|---|
| Home: FCP / LCP | 1,65 s | 0,16 s |
| Casos de estudio: LCP | 1,1–1,7 s (antes 2,6 s; ahora también se prerenderizan) | ≤ 0,1 s |
| CLS | 0 en todas las páginas | 0 |

## Sobre mí: versión corta propuesta (tú eliges)
**Actual** (cuatro bloques):
> **Ingeniero Informático** por la Universidad de Alicante (2026), con el **TFG calificado con Matrícula de Honor (10/10)**. Unos 14 meses en empresa entre prácticas y contrato de formación: consultoría IT en **NTT Data** y visión artificial industrial en **Autis Ingenieros**.
>
> Lo que más me interesa es la **arquitectura de software**: sistemas fáciles de entender y de cambiar. Trabajo con **Python y FastAPI** en backend, **React y TypeScript** en frontend, y **PostgreSQL** (incluido PostGIS). Uso Docker, tests y CI en mis proyectos, y patrones como la arquitectura hexagonal.
>
> Busco mi **primer puesto como desarrollador backend o full-stack**, en un equipo donde aprender rápido y aportar código que se use. **Disponible para reubicarme en cualquier punto de España.**
>
> *Me pagué la FP y el grado trabajando fuera del sector: mozo de almacén, maquinista, operario de producción —donde llegué a manejar robots industriales KUKA— y reponedor. Hoy soy cajero en Leroy Merlin mientras busco mi primer puesto como desarrollador, y de ahí vienen mi constancia y mi mentalidad práctica.*

**Propuesta corta** (los mismos datos, más o menos la mitad de texto; se mantiene la historia de trabajar mientras estudiabas):
> **Ingeniero Informático** por la UA (2026), con **Matrícula de Honor en el TFG**. Unos 14 meses en empresa entre prácticas y contrato de formación (**NTT Data**, **Autis Ingenieros**).
>
> Me interesa la **arquitectura de software**: sistemas fáciles de entender y de cambiar. **Python (FastAPI) y Node.js** en backend, **React y TypeScript** en frontend, **PostgreSQL** debajo, y Docker, tests y CI en mis proyectos.
>
> *Me pagué la FP y el grado trabajando fuera del sector (almacén, producción con robots KUKA, reposición). Hoy soy cajero en Leroy Merlin mientras busco mi primer puesto como desarrollador backend o full-stack.*

Dime cuál prefieres, o qué cambiarías, y lo aplico en ES y EN.

## Preguntas abiertas
1. **Sobre mí:** ¿la actual o la corta?
2. **`*-demo.mp4`:** ¿los saco de `public/` (sin borrarlos) para no publicarlos?
3. **Dos detalles de las grabaciones:**
   - Los paneles con gráfico de donut (EcoAlerta admin y Hydrofulness) nunca terminan de cargar en la grabación.
   - En el clip de móvil se ve 1,5 s del diálogo «Abrir» de Windows al adjuntar la foto.
   - Para arreglarlo habría que regrabar. ¿Te merece la pena?
4. **El abono:**
   - ¿Te gusta el sello sobre el borde de la foto?
   - ¿«Válido desde: incorporación inmediata» te encaja? Lo propusiste como ejemplo; no es un dato del CV.
5. **La descripción de vídeo de EcoAlerta** (para lectores de pantalla) solo existe en español. ¿Quieres una versión en inglés? Necesitaría que me confirmes el texto.
6. Ya puedes lanzar `/review-animations` sobre el prototipo cuando quieras.
