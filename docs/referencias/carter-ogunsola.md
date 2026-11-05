# Carter Ogunsola — análisis (carterogunsola.com)

- URL que le gusta a Christian: https://carterogunsola.com/about (sobre todo **la transición entre
  páginas**).
- Fecha del análisis: 5 de noviembre de 2026.
- Quién es: "Creative Developer & Brand Engineer", lead web dev en Strive y fundador de Balky
  Studio; nacido en Lagos, vive en Utah; jurado de Awwwards; premios CSSDA y Webflow.

---

## 1. Ficha técnica

| Campo | Dato |
| --- | --- |
| Stack | **Astro con `<ClientRouter />`** (transiciones de Astro), **Lenis** (scroll suave, clase `html.lenis`), **GSAP** empaquetado dentro del bundle (timelines, `fromTo`, divisiones de texto por líneas), WebGL para el velo de transición. |
| Páginas | `/` (trabajo), `/about`, `/lab` (experimentos de movimiento), `/writing`, `/studio`, `/contact`, `/lab/<experimento>`. |
| Tipografías | Geist Mono Variable, Oracle (variable con eje de inclinación 0–13°), PP Neue Montreal Mono. |
| Colores | Monocromo: `--mono-100 #f7f7f7`, `--mono-500 #484848`, `--mono-900 #1e1e1e`, `--surface-warm #fdfcfb`. Tema claro y oscuro. Grano animado (`@keyframes grain-jump`). |
| Espaciado | Escala de tokens `--s-0` … `--s-160` (múltiplos de 2 px / rem). |

---

## 2. La transición entre páginas (lo que le gusta a Christian)

Secuencia observada al ir de `/writing` a `/lab`:

1. **El indicador del menú se desliza primero**: la píldora que marca la página activa se mueve
   hasta el destino antes de que cambie nada más. Da respuesta inmediata al clic.
2. **Un velo sube desde abajo con el borde ondulado**: una lámina oscura (de "papel", con grano)
   cubre la pantalla de abajo arriba. Su borde superior no es recto: es una onda orgánica e
   irregular, como papel rasgado o un líquido, dibujada en WebGL (`.veil.veil--gl` con
   `.veil__paper`).
3. **Pantalla cubierta**: mientras la lámina tapa todo, Astro cambia la página por debajo.
4. **Revelado sincronizado**: el velo se retira y lanza un evento propio `veil:reveal` con
   `{ wipeDur, tl }` (la duración del barrido y la timeline de GSAP). Cada componente de la página
   nueva se engancha a esa timeline y empieza su animación de entrada a mitad del barrido
   (`wipeDur * 0.5`), así que las piezas aparecen exactamente mientras se destapa la pantalla.
5. **Odómetro**: la etiqueta junto al logo (la página actual, p. ej. "Writing" → "Lab") cambia
   rodando letra a letra como un contador (`data-roll`, cada carácter con `--index`, y `odometer.roll`
   sincronizado con el revelado).

Detalles finos:
- **Velo de arranque** en la primera carga (`html[data-veil="boot"]`): contador grande de 000 a
  100 con dígitos que ruedan (`.veil__count`, `.veil__digit`), una palabra abajo a la izquierda
  (`.veil__word`) y otra abajo a la derecha que se desplaza (`.veil__travel`). Modo `fast` sin el
  contador para visitas siguientes.
- **Red de seguridad**: si algo falla, el velo se oculta solo a los 4 s (`@keyframes
  veil-failsafe`).
- **Transición específica en el laboratorio**: al entrar en un experimento, el "escenario" sube y
  se escala (`labd-stage-rise`: `translateY(6%) scale(.96)` → normal) y al volver se hunde
  (`labd-stage-sink`), con `view-transition-name: labd-stage` y estados `html[data-lab-nav="enter"]`
  / `"return"`.
- Reduced motion: todas las animaciones de view transition se anulan y el velo no se desplaza.
- La navegación no es instantánea: el velo marca el ritmo (≈ 1–1,5 s en total). Es teatral a
  propósito.

### Cómo traducirlo al portfolio de Christian (sin copiarlo)
- La idea que funciona es **una lámina que tapa, cambio por debajo y revelado coordinado con las
  entradas de la página nueva**, más la respuesta inmediata del menú.
- Con View Transitions nativas o `ClientRouter` de Astro se puede hacer sin WebGL: la lámina puede
  ser el **"zoom entre frames"** (la página se aleja a artboard, se desplaza, entra el siguiente) o
  una lámina con el borde dibujado a mano (SVG) que encaja con el concepto de boceto.
- Sincronizar las entradas de la página nueva con el final de la transición (evento propio).
- Etiqueta del logo con odómetro (nombre de la sección actual).

---

## 3. About ("The Front Office")

Estética de **sistema operativo / HUD** en monocromo con mono y grano:
- **Barra de estado** arriba: hora local ("UT 23:56MST"), FPS, visitantes conectados ("ONLINE 44"),
  LCP de la página ("LCP 1.4s"), "PRESENCE ON", disponibilidad ("Booking Q1'27").
- **Postal con sello**: retrato en blanco y negro dentro de un sello postal con matasellos, redes
  sociales, "About me" y "LAGOS → UTAH".
- **Telemetría en vivo**: hora local, coordenadas, conectados, commits al año y una cuadrícula de
  contribuciones.
- **Radio**: lo último que ha escuchado (Spotify), "ROTATION" con artistas.
- **Presencia multijugador**: cursores de otros visitantes con nombres aleatorios ("swift otter") y
  avisos "Someone left · 43 online".
- Pestañas laterales "FILE:: WRITING" y "FILE:: LAB", paleta de comandos `⌘K`.
- Datos curiosos: "Lagos, NG — St. George, UT · 11,886 km · −7 h · since 2000".

## 4. Lab
- Lista de experimentos dispuesta **en arco/rueda** (los nombres giran sobre una curva: Heart,
  ThreeJs Scene, Dynamic Scrollbar, Rotating Gallery, Paste-Up, Vocal Orb, Live Cursors, Dial,
  Polka Dots…) con vista previa a la derecha. Cada experimento tiene su página.

## 5. Writing
- Artículos como **baraja de cartas apiladas** ("01 — The personal starter"), filtros por año y
  tema.

## 6. Contact
- **Carta con firma y resguardo** ("Dear Carter, RE :: New business / A collaboration / Just a
  hello…", "sign here", "ONE REPLY, NO NEWSLETTER · NOT YET SIGNED", "Keep a copy", resguardo
  "INTAKE · COUNTER 01 · KEEP THIS HALF"). **El contacto de Vístalo está claramente inspirado en
  este**: no conviene repetir la idea en el portfolio de Christian.

## 7. Qué tomar
- Transición: respuesta inmediata del menú + lámina + revelado sincronizado + odómetro.
- Datos en vivo con sentido (hora, rendimiento real de la página como "LCP 1.4s").
- Sistema monocromo con grano y tipografías variables: mucho carácter con poco color.

## 8. Qué no tomar
- La estética HUD/sistema operativo completa ni la carta con resguardo (ya usada por Vístalo).
- La lentitud de navegación: para reclutadores, la transición debe durar < 800 ms.
