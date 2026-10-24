# Fase 2b · Entrega del prototipo "Línea Backend" (Metro v2)

Rama `proto/d-metro-v2`, en commits pequeños y sin push. `main` no se ha tocado.

## Cómo revisarlo
- Desarrollo: `npm run dev`
- Producción, que es lo que se mide: `npm run build && npx vite preview`
- Modo noche, solo para previsualizar: añade `?theme=night` a la URL
- Capturas y vídeos en `prototipo/`:
  - `escritorio-*.jpg` y `movil-*.jpg`
  - `recorrido-escritorio.mp4` y `recorrido-movil.mp4`
- Cuando quieras: `/review-animations` sobre el prototipo

## Qué hay
| Sección | Qué es |
|---|---|
| Plano (hero) | El mapa de la red con tu trayectoria real, dibujado al entrar, con un tren que hace un viaje. Versión propia para móvil. |
| Proyectos | Tablero de líneas y andén: lo que demuestra cada proyecto, el recorrido técnico y los botones "Ver código" y "Caso de estudio". En móvil es un acordeón. |
| Trayectoria | Experiencia y formación en una sola línea. En escritorio es un tramo fijado ligado al scroll; en el resto, una espina vertical. Cercanías va en paralelo y termina en Leroy Merlin. |
| Sobre mí | El abono de transporte junto a tu texto. |
| Stack | Mapa de la red: las 8 zonas, ★ para las correspondencias, "En obras" y la cinta. |
| Contacto | Fin de trayecto: todas las líneas llegan a "Tu equipo". |
| Correspondencia ×3 | La transición firma, ligada al scroll y reversible. |
| Caso de estudio | El andén de su línea, con un índice de estaciones. |
| 404 | "Vía muerta". |

Efectos que se mantienen e integran:
- borde de luz en todas las tarjetas;
- botones magnéticos;
- "Ver código" con el arco de carga;
- "Caso de estudio", que pulsa al entrar en pantalla;
- color de proyecto con significado;
- cursor-tren, solo con ratón.

## Revisión con subagentes
**Crítico con ojos frescos (sin ver código): 21/32.** Apliqué casi todo lo que señaló:
- la cabecera era transparente por un fallo;
- la diagonal de la Correspondencia se cortaba;
- las tarjetas de Trayectoria se solapaban;
- había huecos en el andén;
- la fila de EasyCab repetía Kafka;
- los vídeos mostraban la barra de tareas y `localhost` (ahora están recortados y los originales siguen intactos);
- el botón "Plano" en móvil no cambiaba;
- los botones de CV no estaban claros.

**Rendimiento y accesibilidad.** Los 6 P0 están corregidos:
- los vídeos se paran con el botón de pausa;
- quedaba foco dentro de tarjetas ocultas;
- el foco se perdía en la última estación;
- la hoja "Plano" pasa a ser un `<dialog>` modal;
- ya no quedan bucles con movimiento reducido;
- el contraste llega a AA en todos los casos.

También apliqué los P1 principales: 404 real, la cinta solo en cliente (el HTML baja de 332 KB a 222 KB), Lenis solo con ratón, y los enlaces `#estacion-*`. axe ya no da ninguna violación en la home (escritorio y móvil), en el caso de estudio ni en modo noche.

| Métrica (build de producción) | Móvil (CPU 4×, 1,6 Mbps) | Escritorio |
|---|---|---|
| FCP / LCP | ≈1,9 s | ≈0,2 s |
| CLS | 0 | 0 |
| Long tasks (≈TBT) | ≈110 ms | ≈0 |

## Lo que NO apliqué porque lo decides tú
1. Cambiar la etiqueta del hero `DESARROLLADOR_FULL_STACK.execute()`. El crítico propone «Ingeniero Informático · TFG 10/10 · Matrícula de Honor» porque contradice el «Backend» del rol.
2. Matizar el texto del hero: «Python (FastAPI) **y Node.js**». Lo propone porque EcoAlerta, el proyecto que sale seleccionado, es Node/Express.
3. Recortar el Stack (★ + 3 y «+N más») o quitar la cinta. Pediste el stack completo, así que no lo toco.
4. Acortar tu párrafo de «Sobre mí» porque repite Cercanías.
5. Ajustes de color: oscurecí un tono `--eco` y `--cer` y puse numerales oscuros en Chaos Crew para pasar AA. Si prefieres los tonos anteriores, lo hablamos.

## Preguntas pendientes
- ¿Qué proyecto sale destacado por defecto: EcoAlerta o Red de Donación (FastAPI)?
- ¿Cómo describimos tu rol en NTT? El prototipo dice «Desarrollador Appian · contrato de formación» y el CV dice «Becario IT».
- «Unos 14 meses de prácticas» en «Sobre mí»: ¿lo mantenemos?
- ¿Activamos el modo noche para los visitantes, por ejemplo siguiendo el tema del sistema?
- Los vídeos originales `*-demo.mp4` (10,9 MB) ya no se usan. ¿Los quitamos del deploy?

## Limitaciones conocidas
- Si redimensionas la misma pestaña de escritorio a móvil, el scroll se desplaza: el reflow rompe el anclaje del navegador. No afecta a una carga normal.
- Los casos de estudio no se prerenderizan. Su LCP en móvil es 2,2 s, todavía dentro del objetivo.
- Al cambiar a inglés, el `<title>` sigue en español.
