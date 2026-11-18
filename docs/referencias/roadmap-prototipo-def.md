# Roadmap de `prototipo-def`

- **Rama**: `prototipo-def` (creada desde `prototipo1` el 18 de noviembre de 2026; solo en local).
- **Qué se construye y por qué**: [plan-diseno-awwwards.md](plan-diseno-awwwards.md). Este archivo
  es solo el **orden de trabajo**.
- **Regla**: primero diseño y animación hasta que esté de 10; lo técnico (SEO, accesibilidad,
  formularios, cookies…) va al final, en la fase técnica.
- **Cómo se usa**:
  - Se sigue en orden y **se para en cada punto**: Claude hace una tarea, te la enseña y no pasa a
    la siguiente hasta que la confirmas.
  - Se marca `[x]` cuando tú das el visto bueno.
  - Cada etapa se da por cerrada cuando cumple su "Hecho cuando", medido con la rúbrica de 10
    pruebas del plan (§11).

## Estado

| Etapa | Estado |
| --- | --- |
| Plan y decisiones D1–D13 | Hecho (18 nov) |
| E0 · Arranque | Hecho (18 nov). Por confirmar: texto de Vístalo y fechas de 2023 |
| E1 · Sistema | Hecho (18 nov) |
| **E2 · Barra, lienzo y hero** | **En curso** |
| E3 · Momentos firma | Pendiente |
| E4 · Páginas | Pendiente |
| E5 · Móvil y pulido | Pendiente |
| Fase técnica | Pendiente |
| Lanzamiento | Pendiente |

## Lo que necesito de ti

Cada cosa indica qué etapa bloquea.

- [x] **D14**: la caricatura la hace Claude en SVG a partir de tus fotos (toca en E1) y la afinamos
  juntos.
- [x] **D15**: en "Cómo lo veo yo" se transforma una web de ejemplo neutra, diseñada para la sección.
- [x] **D16**: la intro termina con la caricatura viajando a la barra.
- [x] **Vídeo de referencia** de la intro: `docs/videos/animacion-entrada.mov` (la animación de la
  marca de made_byfede). Christian quiere esa misma animación, con su caricatura: se pinta el pelo,
  etc.
- [ ] **Fotos**: la sesión nueva en blanco y negro. Mientras tanto se usa `profile.jpg`. Bloquea E4.
- [ ] **CV en PDF** y tu formación. Bloquea E4.
- [ ] **Contenido real de cada proyecto** (Tempora, Vibora, Learnish y Vístalo). Bloquea E4:
  - Qué es, tu papel, el año, el stack y los enlaces (repo o demo).
  - Capturas.
  - Dos frases de "lo que más disfruté".

## E0 · Arranque

- [x] Cerrar D14, D15 y D16.
- [x] Quitar la tarjeta 3D (hecho y confirmado el 18 nov):
  - Borrada `src/components/lanyard/`.
  - Desinstalados `three`, `@react-three/fiber`, `@react-three/rapier`, `meshline`, `react`,
    `react-dom`, `@astrojs/react` y sus tipos: nada más usaba React.
  - Quitada la integración de React de `astro.config.mjs`, los ajustes de JSX de `tsconfig.json` y
    la sección de la tarjeta del `README.md`.
  - `astro check` sin errores y `astro build` correcto (16 páginas).
- [x] Recuperar la trayectoria real que está en `main` (Vueling, Inology, SM Medioambientales y
  Pukkas) y añadir Vístalo (hecho el 18 nov; Christian dio paso al siguiente punto):
  - Los datos están en `src/data/experience.ts`, en español e inglés, de lo más reciente a lo más
    antiguo.
  - Se muestran en Sobre mí, en la sección "Trayectoria", con el estilo actual. El diseño definitivo
    (historial de versiones) llega en E4.
  - Por confirmar por Christian: el texto de Vístalo y las fechas (Inology y SM Medioambientales se
    solapan en 2023).
- [x] Quitar Architects Daughter (letra a mano) y el azul del lápiz (hecho y confirmado el 18 nov):
  - El acento de la interfaz pasa de azul a tinta: botones, lente activa, selección, foco y marca.
  - Los trazos del boceto (intro y escena) pasan a grafito: `#8e8e93` en claro y `#7c7c82` en
    oscuro.
  - Las notas del boceto dejan la letra a mano y usan la tipografía de la web.
  - Desinstalado `@fontsource/architects-daughter`.
  - Los grises de fondo siguen siendo los de `prototipo1`: tus tonos exactos llegan en E1.
  - Capturas en `.taste-skill/def/` (`e0-hoja-claro.jpg`, `e0-hoja-oscuro.jpg` y
    `e0-hoja-escena.jpg`).

**Hecho cuando**: las tres decisiones están cerradas, ya no queda nada de la tarjeta 3D, la
trayectoria ha vuelto y no quedan ni la letra a mano ni el azul.

## E1 · Sistema (la base visual)

- [x] **Color**: tus tonos en claro y en oscuro, el grafito para el boceto, y verde y rojo solo como
  estado (hecho y confirmado el 18 nov, con los tres ajustes):
  - Claro: lienzo `#e5e5e5`, papel `#ffffff`, tinta `#1a1a1a` y secundario `#4a4a4a`.
  - Oscuro: lienzo `#2c2c2e`, papel `#171717`, tinta `#f5f5f5` y secundario `#a3a3a3`.
  - Nuevos, derivados de los tuyos: tinte `#f2f2f2` / `#222222` (fondos suaves) y, en oscuro, borde
    `#3a3a3c` (tu `#262626` no se veía sobre el frame oscuro).
  - Verde de estado: `#22c55e` en oscuro y `#16a34a` en claro (el tuyo no llega a 3:1 sobre blanco).
  - Rojo de fallo, solo en la lente QA: `#dc2626` en claro y `#f87171` en oscuro. Sustituye al ámbar.
  - Capturas en `.taste-skill/def/` (`e1-color-hoja-claro.jpg` y `e1-color-hoja-oscuro.jpg`).
- [x] **Tipografía**: Bricolage con sus tres ejes (`standard.css`), la escala de 6 pasos y las
  reglas de tracking (hecho y confirmado el 18 nov):
  - Bricolage cargada con peso (200–800), anchura (75–100 %) y tamaño óptico. El archivo pasa de
    77 a 131 KB; se revisa en la fase técnica.
  - Escala: pequeño 14 · texto 17–18 · entrada 20–22 · título 24–32 · titular 36–56 · display
    40–144 px (antes llegaba a 112).
  - Display con tracking −0,045 em e interlineado 0,9; titulares a peso 650.
  - Nuevas clases `.t-title` y `.t-pencil` (estado "lápiz": fino, estrecho y en grafito).
  - Capturas: `e1-tipo-sistema-claro.jpg`, `e1-tipo-hero-claro-0.jpg` y `e1-tipo-hero-movil.jpg`.
- [x] **Movimiento**: los tokens (curvas, duraciones y muelle con `linear()`) (hecho y confirmado el
  18 nov):
  - Curvas: `--ease-out`, `--ease-camera`, `--ease-in` y `--spring`.
  - Duraciones: `--dur-micro` 140 ms, `--dur-ui` 260 ms, `--dur-ink` 600 ms y `--dur-camera` 800 ms;
    `--stagger` 50 ms y `--dist` 12 px.
  - Aplicados a las 30 transiciones que ya existían: hovers y pulsaciones a 140 ms (antes 200–250),
    paneles a 260 ms, entradas a 600 ms con 12 px (antes 700 ms y 24 px) y la transición entre
    páginas a 800 ms (antes 760).
  - Sección "Movimiento" en `/sistema`, con una demo de cada token.
- [x] **Kit gráfico**: nombre de frame, selección con tiradores, cotas, guías, hilo de prototipo,
  cursores e insignias (hecho y confirmado el 18 nov):
  - Estilos en `src/styles/kit.css` y comportamiento en `src/scripts/kit.ts`.
  - Selección: `data-sel` en cualquier elemento; aparece al pasar el ratón, con el foco de teclado o
    con `.is-selected`, y muestra su medida real.
  - Hilo de prototipo: `drawThread()` lo traza entre dos piezas y `playThread()` lo dibuja.
  - Cruceta con coordenadas en cualquier zona con `data-coords`.
  - Sección "Kit gráfico" en `/sistema`. Todavía no está aplicado a las páginas: el nombre de frame
    llega en E2 y las lentes pasan a este kit en E3.
  - Capturas: `e1-kit-claro.jpg`, `e1-kit-oscuro.jpg` y `e1-kit-hoja-estados.jpg`.
- [x] **Analizar el vídeo de referencia** (`docs/videos/animacion-entrada.mov`) fotograma a fotograma
  (hecho y confirmado el 18 nov):
  - Resultado en [analisis-video-intro.md](analisis-video-intro.md).
  - La secuencia: trazado de todos los contornos a la vez (800 ms), espera mientras carga, relleno
    con fundido (200 ms), espera (400 ms) y salida (250 ms).
  - Consecuencia: la caricatura se construye con formas cerradas y rellenas, no con líneas.
  - Por decidir en E3: contorno en grafito o en tinta, y si la marca viaja a la barra (D16) o se
    desvanece en su sitio como en el vídeo.
- [x] **Caricatura**: versión grande y reducida en SVG, más el favicon (hecho y confirmado el 18 nov,
  con el dibujo de Christian):
  - La caricatura es la suya (`docs/imgs/caricatura-chris.jpeg`), con "made by" pequeño y "chris"
    grande en Bricolage Grotesque y un cuarto de la altura de la cabeza de separación.
  - Vectorizada a SVG en tres capas: silueta de papel, gris de la barba y 12 piezas de tinta (pelo y
    contorno, ceja, ojos, nariz, boca, oreja, marcas de las mejillas…).
  - Dos trazados: completo (40 KB, para la intro y tamaños grandes) y simplificado (8 KB, para la
    barra y el favicon). Datos en `src/data/caricature.json` y `caricature-mark.json`; se regeneran
    con `.taste-skill/letras/vectorize.cjs`.
  - Componente `src/components/site/Caricature.astro` (variantes `head`, `mark` y `lockup`),
    favicon nuevo y sección "Marca" en `/sistema`, con la prueba del trazado.
  - Historia: antes hubo cuatro versiones dibujadas por Claude, que no convencieron, y una prueba
    de 10 parejas de letras de Adobe Fonts, descartadas en favor de la letra de la web.
  - Modo oscuro: el dibujo no se invierte. Conserva sus colores (pelo oscuro, cara clara, barba
    gris) y lleva un borde claro alrededor, como una pegatina. El modo claro no cambia.
  - Aún no está en la barra superior: se coloca en E2.
- [x] **Página interna de muestra** (`/sistema`, no indexada), con todo junto en claro y en oscuro
  (hecho y confirmado el 18 nov):
  - Cinco secciones con índice: Marca, Color, Tipografía, Movimiento y Kit gráfico.
  - Revisada en claro, en oscuro y en móvil (sin desbordes a 390 px).
  - Inspector de la skill: lo que marca es propio de una página interna (sin fotos ni vídeo, poco
    movimiento al cargar) o deliberado (letra mono en medidas e insignias, guías discontinuas).
  - Rúbrica: coherencia (un solo acento, una familia, selección = foco) y densidad (seis tamaños,
    sin eyebrows ni numeraciones en las páginas reales) cumplidas en lo construido hasta aquí.

**Hecho cuando**: la página de muestra pasa las pruebas de coherencia y de densidad de la rúbrica.

## E2 · Barra, lienzo y hero (la primera pantalla de 10)

- [ ] **Lienzo** visible, con margen alrededor y el nombre del frame siempre a la vista.
- [ ] **Barra agrupada**: caricatura y nombre · menú · lentes y "Ver lienzo" · ES/EN · modo · CV.
- [ ] **Hero**:
  - Display en dos líneas y tu foto riendo como capa seleccionada.
  - La frase "Disfruto haciendo webs y apps. Se nota en el resultado.".
  - Los botones "Ver proyectos" y "Descargar CV", y la disponibilidad con la hora.
- [ ] **Entintado del titular** en las visitas siguientes.
- [ ] Revisado en escritorio, tablet y móvil.

**Hecho cuando**: la primera pantalla pasa toda la rúbrica, incluida la prueba de los 5 segundos.

## E3 · Momentos firma

- [ ] **Intro "te dibujo"**: la caricatura en grafito, que se entinta y viaja a la barra, con todas
  sus salidas.
- [ ] **Transición** con hilo de prototipo y paneo de derecha a izquierda (al revés hacia atrás).
- [ ] **"Cómo lo veo yo"**: web → UX/UI → programador → QA, con las tecnologías de cada mirada.
- [ ] **Morph** de la tarjeta de proyecto a su caso.
- [ ] **Lienzo navegable** (tecla M): arrastre, zoom, selección y clic para entrar; rejilla en móvil.
- [ ] **Lentes** con estética de herramienta (valores medidos, sin rotulador).

**Hecho cuando**: cada momento, grabado a 0,25×, no tiene saltos, y nada recuerda a la firma de Eloi
(prueba de Eloi).

## E4 · Páginas

- [ ] **Inicio completo**: proyectos que se pueden tocar (una mini interacción en cada uno),
  trayectoria resumida, contacto y pie.
- [ ] **Proyectos**: el lienzo de proyectos y la vista en lista.
- [ ] **Casos** con sus 9 apartados: Tempora, Vibora, Learnish y Vístalo.
- [ ] **Sobre mí**: cabecera, cronología completa, principios, herramientas por lente, idiomas y CV.
- [ ] **Contacto** (diseño): frase, datos y formulario con sus estados dibujados.
- [ ] **404**: "Frame no encontrado", con la caricatura buscándolo.
- [ ] **Inglés** al mismo nivel que el español.

**Hecho cuando**: cada pantalla pasa la prueba del póster (un protagonista claro).

## E5 · Móvil y pulido

- [ ] Composición propia a 390 px en todas las páginas.
- [ ] Todas las microinteracciones del catálogo (§4.4 del plan).
- [ ] Revisión completa en claro y en oscuro.
- [ ] **Nota de Christian (18 nov)**: quiere incorporar algo de three.js. Se mira aquí, al final
  (decisión D18 del plan): qué pieza 3D, dónde, y que salga del concepto del lienzo.
- [ ] Inspector de la skill: 0 FAIL a 1440, 768 y 390 px.
- [ ] Las 10 pruebas de la rúbrica.

**Hecho cuando**: pasa toda la rúbrica. Ahí el diseño está de 10.

## Fase técnica (después del 10 de diseño)

- [ ] **Formulario**: que funcione (servicio de envío) y antispam sin fricción.
- [ ] **SEO**:
  - Dominio canónico con www, `hreflang` y sitemap correctos.
  - JSON-LD, imagen OG por página y `llms.txt`.
- [ ] **Accesibilidad**: versión quieta de cada momento (reduced motion), teclado, foco y contraste.
- [ ] **Rendimiento**: presupuesto de JS, fuentes e imágenes.
- [ ] **Seguridad**: CSP y cabeceras.
- [ ] **Analítica** sin cookies (sin banner).
- [ ] **Tests de Playwright**: lentes, navegación, formulario y accesibilidad.
- [ ] **Otros**: la 404 real en Vercel y el manifest.

## Lanzamiento

- [ ] Publicar `prototipo-def` en christianoller.dev (merge a `main`). Con eso desaparecen los
  proyectos de ejemplo y el formulario roto de la web actual.
- [ ] Grabar un vídeo de 20–30 s con los momentos firma y hacer capturas a 1440 px y en móvil.
- [ ] Enviar a Awwwards la URL en inglés.
