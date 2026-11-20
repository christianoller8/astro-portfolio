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
| E0 · Arranque | Hecho (18 nov). Las fechas se corrigieron con el CV el 19 nov |
| E1 · Sistema | Hecho (18 nov) |
| E2 · Barra, lienzo y hero | Hecho (19 nov). El hero se queda así "de momento" |
| E3 · Momentos firma | Hecho (19 nov) |
| E4 · Páginas | Hecho (19 nov). Los casos esperan tu contenido real |
| **E5 · Móvil y pulido** | **Hecho** (19 nov), a falta de tu visto bueno a la rúbrica |
| **Ajustes de diseño** | **En curso** (20 nov): hero, barra, foto clara, hoja con textura de papel y selectores de tema e idioma, aprobados. A la espera de tu siguiente cambio |
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
- [ ] **Imágenes reales de Tempora, Vibora y Learnish** (pendiente desde el 19 nov; pediste que
  te lo recordara). Hoy solo Vístalo tiene capturas reales; en los otros tres la imagen es un
  fragmento de interfaz montado en HTML para la web. Afecta a las tarjetas, a la cabecera de cada
  caso y al morph. No bloquea nada hasta E4.
- [x] **CV en PDF**: recibido el 18 nov (`public/cv/christian-oller-cv.pdf`). La formación y los
  idiomas salen de ahí (19 nov).
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

- [x] **Lienzo** visible, con margen alrededor y el nombre del frame siempre a la vista (hecho
  y aprobado el 18 nov):
  - Margen de lienzo alrededor del frame: de 10 px en móvil a 40 px en pantallas anchas (unos 35 px
    a 1440).
  - Nombre del frame encima, a la izquierda, con su tamaño real ("Inicio 1371 × 7570"), que se
    actualiza al cambiar el tamaño de la ventana. Antes solo salía con la lente Diseño.
  - Capturas: `.taste-skill/def/e2-lienzo-hoja.jpg`.
- [x] **Barra agrupada**: caricatura y nombre · menú · lentes y "Ver lienzo" · ES/EN · modo · CV
  (hecha y aprobada el 18 nov):
  - Marca: la caricatura reducida (36 px de alto) y "made by chris" en una línea. Al pasar el
    ratón o llegar con el teclado se selecciona con tiradores y la cabeza se inclina. Cambio
    respecto al plan §5.1, que decía "Christian Oller": se usa la marca que elegiste después.
  - Menú centrado entre la marca y las herramientas; la página actual va sobre papel.
  - Grupo "vista": las tres lentes, un separador y "Ver lienzo" con su tecla M, en una bandeja.
  - Grupo "preferencias": ES/EN, modo y CV.
  - De 1024 a 1279 px las lentes y "Ver lienzo" se quedan en icono. Por debajo de 1024 px, la
    barra lleva marca, ES/EN, modo y menú; el menú es una capa a pantalla completa con las
    páginas arriba y las lentes, "Ver lienzo" y "Descargar CV" abajo, al alcance del pulgar.
  - Pendiente: "Ver lienzo" todavía no hace nada (el lienzo navegable es de E3).
  - Resuelto en E3 (lentes): con la lente Código, la etiqueta del primer bloque pisaba el nombre del
    frame.
  - Capturas: `.taste-skill/def/e2-barra-hoja-escritorio.jpg` y `e2-barra-hoja-movil.jpg`.
- [x] **Hero** (rehecho el 18–19 nov con tus cambios; el 19 nov dijiste "de momento vamos a dejarlo así"):
  - Tus cambios (decisiones D20 y D21 del plan):
    - "Software developer" en lugar de "Frontend developer", y que se vea que eres diseñador,
      desarrollador y QA.
    - La foto no puede ser "una foto plana ahí tirada": como en la página "nosotros" de Vístalo.
  - Cómo ha quedado:
    - **La foto es la de la luz roja en los dos modos**, fundida en el fondo, sin caja ni panel:
      - **Oscuro**: la foto tal cual (`card.jpg`). Sangra por arriba y se desvanece hacia los
        lados y hacia abajo con una máscara.
      - **Claro**: el hero es claro y se usa la **versión "de día" de esa misma foto**
        (`card-light.jpg`): la pared pasa a blanco y se conservan la franja de luz roja y tu
        sombra en la pared, más una sombra de ambiente muy suave alrededor de la silueta. Eso es
        lo que evita el efecto "pegote" del recorte solo.
      - En claro, "Software developer" va en modo de fusión "diferencia" (oscuro sobre el blanco,
        claro sobre la chaqueta). "Christian Oller" va en tinta normal, porque pasa por la luz
        roja y la diferencia lo teñía de azul. En móvil las dos líneas caen sobre la chaqueta y
        van las dos en diferencia.
      - Cómo se generaba `card-light.jpg` hasta el 20 nov (desde D24 se hace con `luz-gris.cjs`,
        ver "Ajustes de diseño"), en `.taste-skill/recorte/`:
        1. `person.swift` saca la máscara de la persona con la segmentación de macOS.
        2. `luz.cjs` pone la pared en blanco, conserva la franja roja (el exceso de rojo sobre
           la pared), redibuja la sombra con la propia silueta (en la foto es solo un 5 % más
           oscura que la pared y sale granulada si se extrae) y monta la figura encima.
      - En los dos, el mismo encuadre: la cara queda junto a "Christian Oller" y "Software
        developer" cruza por la chaqueta.
      - Camino recorrido (para no repetirlo): hero oscuro en los dos modos → lo quisiste claro
        en claro; una foto por modo (la de estudio en claro) → quisiste la luz roja en los dos;
        panel oscuro con borde recto en claro → no te gustó; figura recortada sola → "casi",
        pero quedaba de pegote y pediste la luz roja y la sombra.
      - Para la fase técnica: las dos imágenes van con carga diferida para que solo se descargue
        la del modo activo; habrá que precargar la que toque.
    - **Los tres oficios**: "Diseñador × Desarrollador × QA" encima del nombre. Son botones: cada
      uno activa su lente (y la apaga al volver a pulsar), así el hero recupera la entrada a las
      lentes. Subrayado fino que se entinta al pasar el ratón y con la lente activa.
    - Debajo: la frase, "Ver proyectos", "Descargar CV" y la disponibilidad con la hora de Madrid.
    - Todo se mide en ancho del contenido (`cqi`): la composición es la misma de 700 a 1920 px.
    - **Móvil**: la foto arriba a todo el ancho, el nombre montado sobre la chaqueta, después
      los oficios, la frase y los botones.
    - "Frontend developer" también se cambia en el título y la descripción de la página.
  - **CV**: el PDF está en `public/cv/christian-oller-cv.pdf` (18 nov).
  - Sin tocar todavía: los textos de Sobre mí y Contacto siguen diciendo "frontend"; se
    revisan cuando toque esa página (E4).
  - Capturas: `.taste-skill/def/e2-hero-hoja-escritorio.jpg` y `e2-hero-hoja-movil-tablet.jpg`.
- [x] **Entintado del titular** en las visitas siguientes (hecho el 18 nov; aceptado con el
  hero el 19 nov):
  - Cuando no hay intro, las dos líneas nacen "a lápiz" (peso 200, anchura 75 % y grafito) y se
    entintan en 600 ms hasta su peso y su ancho. Primero el nombre y 90 ms después el oficio,
    que al ensancharse entra en la foto.
  - Al cargar la página empieza a los 150 ms; al llegar desde otra página espera 520 ms, a que
    termine la transición.
  - Con "reducir movimiento" no se anima. En la carga en que sale la intro tampoco.
  - Capturas: `.taste-skill/def/e2-tinta-hoja.jpg` (seis fotogramas).
- [x] Revisado en escritorio, tablet y móvil (19 nov):
  - Primera pantalla comprobada a 1920, 1440, 1280, 1024, 768, 390 y 320 px, en claro y oscuro,
    y en inglés a 1440, 768 y 390: nada desborda y la barra cabe en todos.
  - Un arreglo: a 320 px los tres oficios partían en dos líneas; ahora bajan un punto de tamaño
    y caben en una.
  - Capturas: `.taste-skill/def/e2-revision-escritorio.jpg` y `e2-revision-movil.jpg`.

**Hecho cuando**: la primera pantalla pasa toda la rúbrica, incluida la prueba de los 5 segundos.

## E3 · Momentos firma

- [x] **Intro** (hecha el 19 nov, adelantada a petición tuya; aprobada el 19 nov):
  - Lo que pediste: la animación del vídeo de `docs/videos/` y, después, la de eloicotonat.com.
  - La secuencia (unos 2,5–3 s). Desde el 19 nov sale cada vez que se carga la home, no solo la
    primera vez de la sesión: lo pediste al no verla al recargar.
    1. **Trazado** (800 ms): todos los contornos de la caricatura y de "made by chris" se dibujan
       a la vez, en línea fina de grafito, sobre el lienzo liso. Como en el vídeo.
    2. **Espera en contorno** hasta que están las fuentes y la foto del hero (mínimo 300 ms,
       máximo 1,5 s).
    3. **Relleno** (200 ms): se pintan el pelo, la barba y las letras; el contorno se retira.
    4. **Pausa** (400 ms) con la marca terminada.
    5. **Salida de Eloi** (850 ms): el iris se cierra en círculo sobre la marca y deja ver la
       web; a la vez, las piezas del hero entran una detrás de otra (suben 14 px con un fundido).
  - De Eloi se toma la mecánica (iris y entrada escalonada), no su lenguaje de cámara: sin
    visor, sin REC y sin flash.
  - `?intro` en la dirección la fuerza aunque esté activado "reducir movimiento".
  - Salidas: cualquier tecla o clic salta a la salida; sin intro con ancla en la URL, "reducir
    movimiento" o ahorro de datos; si el JavaScript falla, la pantalla se quita sola a los 7 s.
  - Las letras de la marca pasan a ser trazados (`src/data/lockup-text.json`, generado con
    `.taste-skill/letras/lockup-paths.mjs`): se dibujan en contorno como la caricatura y la
    marca ya no depende de que la fuente haya cargado.
  - La intro antigua (el boceto sobre el hero) se retira; `sketch.ts` sigue, lo usa la escena
    "Del boceto al producto".
  - Por decidir contigo: el contorno va en grafito (lápiz) y el relleno en tinta; en el vídeo
    los dos son del mismo color.
  - Capturas: `.taste-skill/def/e3-intro-hoja-claro.jpg` (16 fotogramas),
    `e3-intro-hoja-oscuro-movil.jpg` y `e3-intro-hoja-movil.jpg`.
- [x] **Transición** con paneo y **tu personaje empujando o arrastrando la página** (idea tuya del
  19 nov; sustituye al hilo de prototipo). Hecha y aprobada el 19 nov, con tu segunda lámina, el
  cambio de idioma con dirección y 2 s de duración.
  - Hacia delante en el menú, todo panea a la izquierda y el personaje empuja la página que sale.
    Hacia atrás, panea a la derecha y tira de la que entra.
  - Detalle de cómo está hecho, capturas y la lista de lo que falta para afinarlo:
    [transicion-personaje.md](transicion-personaje.md).
  - Página de pruebas del muñeco: `/personaje`.
- [x] **"Cómo lo veo yo"**: web → UX/UI → programador → QA, con las tecnologías de cada mirada
  (hecha y aprobada el 19 nov):
  - Titular: "Tú ves una web. Yo la veo así."
  - **La web de ejemplo** (D15): "Norte", una landing inventada de café por suscripción, hecha en
    HTML real dentro de un frame ("norte.cafe · 1280 × 800"). Lleva sus propios colores (crema,
    marrón y mostaza), que solo viven dentro del frame.
  - **Las cuatro fases**, que cambian según el texto que vas leyendo al bajar:
    0. La web terminada.
    1. Como diseñador: la web se queda en fantasma, se dibuja el boceto de cada bloque, sale la
       retícula de 12 columnas y dos piezas quedan seleccionadas con su medida. Figma · Procreate.
    2. Como desarrollador: cada bloque lleva su etiqueta real (`<header>`, `<h1>`, `<button>`…)
       y aparece el árbol de la página. Angular · React · Next.js · Astro · TypeScript ·
       Tailwind · SASS.
    3. Como QA: cinco comprobaciones con su valor (contraste del botón, zona táctil, texto
       alternativo, orden de los títulos y enlaces con nombre). Cypress · Karma y Jasmine ·
       Postman.
  - **Nada está dibujado a mano**: el boceto, las medidas, las etiquetas, el árbol y las
    comprobaciones se calculan en el navegador a partir del HTML de la web de ejemplo. Las medidas
    se dan a 1280 px, que es el tamaño al que está "diseñada".
  - **Puente a las lentes**: "Puedes ver toda esta web así", con tres botones que activan la lente
    de Diseño, Código o QA en todo el portfolio.
  - **Escritorio**: los textos a la izquierda y el frame fijo a la derecha. **Móvil y tablet**: el
    frame fijo arriba y los textos pasando por debajo; el árbol y las comprobaciones van bajo el
    texto de su paso.
  - **Orden de la home**: hero → proyectos → "Cómo lo veo yo", como en el plan. Salen de la home
    "Del boceto al producto" y "Herramientas por lente" (los componentes siguen en el proyecto;
    el primero vuelve en el caso de Tempora).
  - Con "reducir movimiento" los cambios de fase son inmediatos.
  - **Ajustes tuyos (19 nov)**: te gustó, pero la querías más llena. Cada mirada lleva ahora un
    segundo párrafo y tres puntos (textos provisionales: los copies se revisan todos al final). El
    puente "Puedes ver toda esta web así" queda **oculto** porque no te convence (`showBridge` en
    `ViewScene.astro`).
  - Capturas: `.taste-skill/def/e3-como-lo-veo-escritorio.jpg` y `e3-como-lo-veo-movil.jpg`.
- [x] **Morph** de la tarjeta de proyecto a su caso (hecho y aprobado el 19 nov; las imágenes
  reales de Tempora, Vibora y Learnish quedan pendientes para E4):
  - Al entrar en un proyecto desde la home o desde Proyectos, la imagen del proyecto crece hasta
    ser la cabecera del caso y el título viaja hasta el H1, en 700 ms; la página de detrás se funde.
  - Al volver ("← Todos los proyectos" o el botón de atrás), la imagen y el título regresan a su
    tarjeta. Si vuelves con el enlace, la lista baja sola hasta esa tarjeta.
  - **Convive con el personaje**: el morph solo se usa entre una lista y un caso. El resto de
    cambios de página (menú, idioma, de un caso al siguiente) siguen con el paneo y el personaje.
  - Cómo está hecho: `frames.ts` da nombre de transición a las dos piezas justo antes de navegar
    (`[data-morph-visual]` y `[data-morph-title]`) y pone `html.is-morph`; la animación está en
    `global.css`.
  - Con "reducir movimiento" no hay morph.
  - Capturas a cámara lenta: `.taste-skill/def/e3-morph-ida.jpg`, `e3-morph-vuelta.jpg` y
    `e3-morph-movil.jpg`.
- [x] **Lienzo navegable** (tecla M): arrastre, zoom, selección y clic para entrar; rejilla en móvil
  (hecho y aprobado el 19 nov):
  - **Abrir**: tecla M o el botón "Ver lienzo" de la barra (y del menú en móvil). La cámara sale de
    la página en la que estás y se aleja hasta que se ve el archivo entero.
  - **Lo que se ve**: las ocho páginas como frames (Inicio, Proyectos, Sobre mí y Contacto en una
    fila; los cuatro casos debajo), cada una con su nombre y su tamaño real, los hilos de prototipo
    entre ellas y "Estás aquí" en la actual.
  - **Moverse**: arrastrar, rueda o pellizco para el zoom (del 20 % al 220 %) y "Ver todo" para
    volver a encuadrar. Abajo a la derecha, el porcentaje de zoom.
  - **Entrar**: al pulsar un frame la cámara se acerca hasta él y cambia de página sin otra
    animación (ni personaje ni morph: el viaje ya lo ha hecho la cámara). Pulsar el frame actual,
    Esc, M o "Cerrar lienzo" vuelve a la página.
  - **Móvil**: una rejilla de dos columnas con las ocho páginas.
  - **Miniaturas**: capturas reales de cada página, en claro y oscuro y en los dos idiomas
    (32 imágenes en `public/canvas/`, 1,8 MB en total; se cargan solo al abrir el lienzo y solo
    las ocho que tocan). **Hay que repetirlas cuando cambie el diseño de una página**:
    `.taste-skill/eloi-1118/tools/canvas-thumbs.mjs` hace las capturas y
    `canvas-thumbs-resize.cjs` las recorta y reduce. Las alturas de cada página quedan en
    `src/data/canvas-sizes.json`.
  - Con teclado: las páginas se recorren con el tabulador y se entra con Intro. Mientras está
    abierto, la página de detrás queda inactiva.
  - Con "reducir movimiento" la cámara salta sin viaje.
  - Capturas: `.taste-skill/def/cmap/v1-hoja.jpg` (la secuencia) y `v1-hoja-otros.jpg` (oscuro,
    tablet y móvil).
- [x] **Lentes** con estética de herramienta (valores medidos, sin rotulador) (hechas y aprobadas
  el 19 nov).
  - Las marcas ya no se pintan sobre los elementos: van en una capa aparte dentro del frame
    (`.lens-layer`), colocada midiendo cada pieza (`src/scripts/lenses.ts`, `src/styles/lenses.css`).
    Las etiquetas buscan sitio solas: no se pisan, no tapan texto y no se salen del artboard.
  - **Diseño**: selección del kit (1 px, ocho tiradores), nombre de capa, medida o tipografía real,
    guías de la columna, cotas de márgenes y columna, e inspector con el ratón (caja, líneas de
    construcción y medida de la pieza que hay bajo el puntero).
  - **Código**: cada bloque con su etiqueta y su componente dentro de la esquina (ya no pisa el
    nombre del frame), los títulos con la suya, e inspector con etiqueta, clase y tamaño.
  - **QA**: cajas de 1 px e insignias con el valor medido (contraste, zona táctil, alt, etiqueta).
    El contraste se vuelve a medir si al cargar había colores a medio cambiar.
  - **Barra de estado** abajo en lugar del panel flotante (que tapaba la frase y los botones del
    hero): cifras de la lente, capas de la página (al pulsar una, va hasta ella) y "Vista normal".
    En móvil y tablet lleva el cambio de lente.
  - Entrada: las cajas crecen desde el centro (160 ms, 20 ms de escalón), las guías se dibujan y
    al cambiar de lente hay un cruce de 200 ms.
  - De paso: la web de ejemplo de "Cómo lo veo yo" es inerte (no cuenta para QA ni se puede
    tabular) y el botón "QA" del hero tiene 24 px de ancho mínimo en móvil.
  - Comprobado: Inicio, Proyectos, un caso, Sobre mí y Contacto a 1440 px; Inicio en oscuro, en
    inglés a 820 px y a 390 px en claro y oscuro; Contacto a 390 px. QA da todo superado en todas.
  - Sin hacer: reglas en los bordes (el plan las daba como "posibles") y cruceta con coordenadas.

**Hecho cuando**: cada momento, grabado a 0,25×, no tiene saltos, y nada recuerda a la firma de Eloi
(prueba de Eloi).

## E4 · Páginas

- [x] **Inicio completo**: proyectos que se pueden tocar (una mini interacción en cada uno),
  trayectoria resumida, contacto y pie (hecho y aprobado el 19 nov).
  - **Proyectos que se pueden tocar** (`ProjectStack.astro`, `src/scripts/project-demos.ts`). La
    tarjeta ya no es un enlace entero: se entra al caso por el título o por "Ver proyecto" (el
    morph sigue igual) y la interfaz de dentro responde:
    - Tempora: "+ Nuevo turno" añade una fila y suben los contadores; "Pendiente" pasa a "Fichado".
    - Vibora: se elige una pista libre, cambia el resumen y "Confirmar" deja la reserva hecha.
    - Learnish: "Ver respuesta", y "Repasar" o "Lo sabía" pasan de tarjeta y avanzan la lección.
    - Vístalo: "Abrir la web aquí" carga la web real dentro de su marco (a 1280 px escalada; en
      móvil, a 390 px). Solo se carga al pulsar; "Volver a la captura" la quita.
    - Encima de cada marco, una nota de herramienta dice qué se puede probar.
    - Vibora y Learnish (apps de móvil) van centradas sobre su color y a tamaño de lectura. En
      móvil y tablet la interfaz se ve entera, sin recortar a 16:10.
    - Por proyecto: nombre, una línea, tipo, estado, rol y, si los hay, año y stack.
  - **Trayectoria resumida** (`Trajectory.astro`): cada etapa es una versión (v5.0 … v1.0) en una
    línea, con la actual en tinta, y un enlace a la cronología de Sobre mí.
  - **Contacto y pie**: email con botón "Copiar", frase nueva (ya no dice "frontend") y créditos
    "Hecho en capas: boceto, diseño, código y pruebas".
  - Comprobado a 1440 px (claro y oscuro), 820 px (inglés) y 390 px (claro y oscuro); la lente QA
    da todo superado. Capturas: `.taste-skill/def/e4/e4-inicio-escritorio.jpg` y
    `e4-inicio-movil.jpg`.
  - Provisional: los datos de las demos son de ejemplo y los textos nuevos, por revisar. Faltan
    año y stack de Tempora, Vibora y Learnish, y sus imágenes reales (ver "Lo que necesito de ti").
  - Las miniaturas del lienzo se repitieron el 19 nov, con el 404.
- [x] **Proyectos**: el lienzo de proyectos y la vista en lista (hecho y aprobado el 19 nov).
  - **Lienzo** (`ProjectsPage.astro`): una franja con el color y los puntos del lienzo, de lado a
    lado del artboard, y en ella los cuatro proyectos como frames de un archivo de diseño, cada uno
    en su formato: Tempora y Vístalo en escritorio (16:10), Vibora y Learnish en móvil. Cada frame
    lleva su nombre encima ("Vibora · Móvil · 390 × 844") y un hilo de prototipo hasta la nota que
    lleva a su caso (nombre, tipo, estado, una frase y "Ver caso").
  - Al señalar un frame aparece la selección del kit con su medida, y el hilo se vuelve a dibujar.
    El clic entra en el caso con el morph (el frame crece hasta ser la cabecera).
  - Todo el tablero escala con el ancho (unidades `cqi`), incluida la interfaz de dentro: los
    fragmentos de Tempora, Vibora y Learnish pasan de `rem` a `em` para escalar enteros.
  - **Lista**: una línea por proyecto (número, nombre, frase, tipo, formato, estado y rol), que se
    invierte a tinta al señalarla. La vista elegida se recuerda.
  - Móvil y tablet estrecha: en el lienzo los frames van apilados con su nota debajo, sin hilos.
  - Nuevo campo `format` (`desktop` o `mobile`) en cada proyecto.
  - Comprobado a 1440 px (claro), 1024 px (oscuro, inglés) y 390 px; la lente QA da todo superado.
    Capturas: `.taste-skill/def/e4/e4-proyectos-escritorio.jpg` y `e4-proyectos-movil.jpg`.
- [ ] **Casos** con sus 9 apartados: Tempora, Vibora, Learnish y Vístalo (**plantilla hecha el
  19 nov con contenido provisional; pendiente de tu visto bueno y de tu contenido real**).
  - Plantilla en `ProjectPage.astro`; textos en `src/data/cases.ts`; comportamiento en
    `src/scripts/case.ts`. Cada apartado lleva su número y su composición:
    1. **Cabecera** (destino del morph): nombre, frase, rol, estado, stack y enlace si los hay.
    2. **El problema**: el texto del `.md`, en grande.
    3. **Del boceto a la tinta**: la pantalla clave se dibuja a lápiz con el scroll y después se
       entinta, con un medidor "grafito → tinta 0–100 %". Vístalo no lo lleva (no hay boceto).
    4. **Decisiones**: tres, cada una con su anotación de herramienta.
    5. **Código**: el fragmento real que mueve la pieza de esta página (sale de
       `project-demos.ts` al compilar, no está copiado a mano) y, al lado, la pieza que se toca.
    6. **Pruebas**: en las apps, cinco comprobaciones calculadas en vivo sobre esa pieza
       (contraste, zona táctil, nombres, teclado y texto mínimo). En Vístalo, insignias fijas.
    7. **Resultado**: "Qué hace" en filas; en Vístalo, además, las capturas de tablet y móvil.
    8. **Lo que más disfruté**: una franja en tinta con la frase en grande.
    9. **Siguiente proyecto**: el nombre, un hilo de prototipo y el frame del siguiente.
  - Comprobado: Tempora (1440 claro), Vibora (1440 oscuro), Vístalo (1440 inglés) y Learnish
    (390); la lente QA da todo superado en los cuatro. Capturas en `.taste-skill/def/e4/`
    (`e4-caso-tempora.jpg`, `e4-caso-vibora-oscuro.jpg`, `e4-caso-vistalo-en.jpg`,
    `e4-caso-learnish-movil.jpg`).
  - **Provisional, para que lo revises** (ver también "Lo que necesito de ti"):
    - Las frases de "Lo que más disfruté" las he escrito yo: tienen que ser tuyas.
    - Las decisiones describen lo que se ve en cada pantalla de ejemplo, no decisiones tuyas.
    - El código es el de la demo de esta web, no el de las apps: cuando me pases un fragmento
      real de cada proyecto, se cambia.
    - Las pruebas en vivo miden la pieza de esta página, no la app real.
    - Faltan año, stack y enlaces de Tempora, Vibora y Learnish, y sus imágenes reales.
- [x] **Sobre mí**: cabecera, cronología completa, principios, herramientas por lente, idiomas y CV
  (hecho y aprobado el 19 nov).
  - **Trayectoria real, del CV**: por fin pude leer el PDF. `src/data/experience.ts` tenía cinco
    etapas con fechas distintas; ahora lleva las siete del CV, con tus frases resumidas:
    Vístalo (2025 – actualidad), Accenture (ene – ago 2026), VHIR · Vall d'Hebron (sep 2024 –
    ago 2025), Inology (jun 2023 – may 2024), Kenos Technology · Vueling (mar – may 2023),
    SM Medioambientales (sep 2022 – ene 2023) y Pukkas (ene – ago 2022). También la formación
    (UOC, Udemy y DAW) y los idiomas (castellano y catalán nativos, inglés B1).
  - **Cabecera**: la bio en grande y el retrato como capa. En claro, el fondo blanco de la foto se
    funde con el papel (multiplicar); en oscuro se usa la misma foto con la persona recortada
    (`profile-cut.png`, hecha con `.taste-skill/recorte/retrato-oscuro.cjs`) y el jersey se funde
    con el fondo. Debajo, tres datos: ahora, dónde e idiomas.
  - **Cronología**: historial de versiones (v7.0 … v1.0) con periodo, lugar, papel, lo que hiciste
    y el stack. Angular es el hilo: una línea de tinta recorre las etapas en las que lo usaste.
    Después, la formación.
  - **Cómo trabajo**: tres principios, cada uno con su ejemplo (un boceto a lápiz, un componente
    en código y el resultado de un test), alternando de lado.
  - **Herramientas por lente**, actualizadas con el CV (RxJS, NgRx, Signals, Python, PrimeNG,
    SQL Server, MongoDB, GraphQL, Playwright…).
  - **Idiomas y CV**.
  - En el inicio, la trayectoria resumida enseña ahora las cuatro últimas etapas.
  - Comprobado a 1440 px (claro y oscuro, inglés) y 390 px; la lente QA da todo superado.
    Capturas: `.taste-skill/def/e4/e4-sobre-mi-escritorio.jpg` y `e4-sobre-mi-oscuro-movil.jpg`.
  - **Por confirmar**: el CV dice Angular "v8–v18" y la web dice "de la 8 a la 21" (lo dejé en 21,
    como me dijiste). La web sigue diciendo "Remoto · España" (el CV pone Córdoba). El "80.000
    usuarios" de Accenture sale del CV. La sesión de fotos nueva sigue pendiente.
- [x] **Contacto** (diseño): frase, datos y formulario con sus estados dibujados (hecho y aprobado
  el 19 nov).
  - **La frase**: "Hablemos" a tamaño de póster y, debajo, la pregunta en grande.
  - **Los datos**, en filas: email con botón "Copiar", LinkedIn, GitHub y el estado.
  - **El formulario como componente dentro de su frame**, sobre una franja del lienzo. El nombre
    del frame dice en qué estado está ("Formulario · Válido") y, al lado, los cuatro estados van
    dibujados en miniatura (vacío, escribiendo, válido y enviado), con el actual seleccionado y
    marcado "ahora". Cambian solos mientras escribes.
  - Estado **enviado** diseñado: un panel con "Mensaje enviado" y "Escribir otro" sustituye a los
    campos. Hoy solo se ve al enviar con un endpoint configurado (fase técnica); sin él, el
    formulario sigue abriendo tu correo con el mensaje escrito.
  - Para revisar cada estado sin escribir: `/contact/?estado=escribiendo`, `?estado=valido` o
    `?estado=enviado` (usa datos de ejemplo).
  - Comprobado a 1440 px (claro, y oscuro en inglés) y 390 px (claro y oscuro); la lente QA da todo
    superado. Capturas: `.taste-skill/def/e4/e4-contacto-escritorio.jpg` y `e4-contacto-movil.jpg`.
- [x] **404**: "Frame no encontrado", con la caricatura buscándolo (hecho y aprobado el 19 nov).
  - `src/pages/404.astro`. El artboard no tiene papel: es un frame vacío de borde discontinuo sobre
    el lienzo, y su nombre (arriba, donde va siempre) es la ruta que se pidió.
  - Dentro: "Frame no encontrado", la ruta, "Volver al inicio" y "Ver el lienzo". A la derecha, los
    cuatro frames que sí existen, con hilos de prototipo que salen del texto hacia cada uno (se
    vuelven a dibujar al señalarlos).
  - El personaje articulado, de pie sobre el borde de abajo del frame, otea con la mano de visera
    y cada pocos segundos se gira a mirar al otro lado (pose nueva `searching()` en
    `src/scripts/character.ts`).
  - Un solo archivo sirve a los dos idiomas: lleva los dos textos y enseña el que toca según la
    ruta empiece o no por `/en`. La barra de arriba sale siempre en español (limitación de un 404
    estático).
  - El lienzo navegable, abierto desde un 404, ya no marca "Estás aquí" en ningún frame.
  - **Miniaturas del lienzo repetidas** (las 32 de `public/canvas` y `canvas-sizes.json`): ahora
    enseñan los diseños nuevos de Inicio, Proyectos, casos, Sobre mí y Contacto.
  - Comprobado a 1440 px (claro, y oscuro en inglés), 820 px y 390 px. Capturas:
    `.taste-skill/def/e4/e4-404-escritorio.jpg` y `e4-404-movil.jpg`.
- [x] **Inglés** al mismo nivel que el español (revisado y aprobado el 19 nov).
  - Claves de texto: 224 en español y 224 en inglés, sin ninguna suelta. Los proyectos tienen las
    mismas listas y el mismo contenido en los dos idiomas.
  - Barrido de las ocho páginas en inglés buscando español en el texto visible y en `aria-label`,
    `alt`, `title` y `placeholder`: solo quedan nombres propios (Vístalo, Lucía Prieto) y las frases
    de las tarjetas de Learnish, que son en español a propósito.
  - Estados que no se ven al cargar, también en inglés: las tres lentes y su barra, las cuatro
    demos de proyectos, el lienzo navegable, el menú de móvil, las pruebas de los casos y los
    estados del formulario.
  - Tres arreglos: la descripción de Contacto decía "proyecto frontend" (en los dos idiomas); el
    código de los casos enseñaba sus comentarios en español (en inglés va sin comentarios); y en un
    404 de `/en/…` la barra de arriba salía en español (ahora se pasa a inglés, con sus enlaces).
  - **De paso, dos desbordes reales a 320 px, en los dos idiomas**: el pie (el email con "Copiar"
    ensanchaba todo el bloque) y la interfaz de Vibora (no cabía; ahora encoge con el ancho).
    Barrido final: 9 páginas × 2 idiomas × 6 anchos (320 a 1920 px), 0 desbordes.
  - El inglés es británico ("colour", "organise"), como ya estaba. Los textos nuevos siguen siendo
    provisionales, igual que en español.
  - Herramientas: `.taste-skill/eloi-1118/tools/en-scan.mjs`, `en-states.mjs` y `overflow-all.mjs`.

**Hecho cuando**: cada pantalla pasa la prueba del póster (un protagonista claro).

## E5 · Móvil y pulido

- [x] Composición propia a 390 px en todas las páginas (revisado y aprobado el 19 nov).
  - Repasadas, pantalla a pantalla, las seis páginas a 390 px: Inicio (11 pantallas), Proyectos (5),
    un caso (9), Sobre mí, Contacto (4) y el 404. La mayoría ya estaba compuesta para móvil al
    construirla en E4 (hero con el retrato como capa, interfaces enteras y a su formato, frames
    apilados con su nota, datos en dos líneas, lentes y estados en la barra de abajo).
  - **Arreglado**: en "Cómo lo veo yo" el panel del árbol y el de las comprobaciones pasaban por
    encima de la web de ejemplo al subir; ahora pasan por debajo del escenario fijo.
  - **Sobre mí**: eran 13 pantallas y la cronología ocupaba cinco. En móvil cada etapa enseña
    periodo, empresa, papel, resumen y stack, y el detalle va plegado en "Lo que hice" (se abre al
    tocarlo). En escritorio sigue todo a la vista. Queda en 11 pantallas.
  - **Proyectos**: el pie va pegado a la franja del lienzo, sin la banda blanca que quedaba entre
    los dos (también en escritorio).
  - Comprobado en claro, oscuro e inglés; 0 desbordes en 108 combinaciones y la lente QA sin fallos.
    Capturas: `.taste-skill/def/e5/e5-movil-*.jpg`. Herramienta: `mobile-strip.mjs`.
- [x] Todas las microinteracciones del catálogo (§4.4 del plan) (hecho y aprobado el 19 nov). De las
  doce del catálogo:
  - **Ya estaba**: botón principal (el fondo se aclara, la flecha avanza 3 px, escala 0,98).
  - **Sustituida por decisión tuya**: el cambio de idioma. El plan pedía un fundido; lo hace el
    personaje empujando o arrastrando la página.
  - **Hechas ahora**:
    - *Enlace de texto*: subrayado fino de grafito que se entinta de izquierda a derecha (200 ms).
    - *Botón secundario*: al señalarlo, un paso de grafito claro (antes se invertía a tinta).
    - *Tarjeta de proyecto*: en el inicio, el frame de cada proyecto se selecciona (tiradores y
      medida); en el lienzo de Proyectos, además, lo de dentro se acerca un 2 %.
    - *Enlace activo del menú*: un cuadradito de selección bajo el enlace activo que se desliza
      hasta el nuevo enlace durante la transición de página (600 ms).
    - *Interruptor de lentes* (y el de Lienzo/Lista): el indicador se desliza al segmento elegido
      (260 ms, muelle). Pieza del kit: `[data-seg]`.
    - *Modo claro / oscuro*: en dos tiempos, primero el lienzo y la barra y después los frames.
    - *Retrato* (Sobre mí): selección con su nombre de archivo y su tamaño.
    - *Copiar el email*: una píldora "Copiado" sale desde el puntero (desde el botón, con teclado).
    - *Botón de CV*: la flecha baja 4 px y vuelve, como una hoja saliendo de la impresora.
    - *Foco con teclado*: un único cuadro de selección (1 px y ocho tiradores, el del hover) rodea
      lo que tiene el foco y lo sigue. Los campos de formulario conservan su propio estilo.
  - Todas se anulan con "reducir movimiento". Comprobadas en claro y oscuro con capturas a cámara
    lenta (`.taste-skill/def/e5/e5-microinteracciones.jpg`); 0 desbordes y la lente QA sin fallos.
- [x] Revisión completa en claro y en oscuro (hecha y aprobada el 19 nov).
  - Repasadas en oscuro, sección a sección, las seis páginas a 1440 px (37 pantallas), y en los dos
    temas los estados: pie, las tres lentes sobre las páginas nuevas, menú de móvil y lente en móvil.
  - **Arreglado en oscuro**: los paneles de código (casos, "Cómo trabajo" y el árbol de "Cómo lo veo
    yo") eran casi del mismo negro que el papel y se perdían; ahora suben un paso. El marco de
    Learnish era un bloque muy claro; en oscuro baja a azul noche y solo brilla la pantalla de la app.
  - **Arreglado en los dos temas (venía de las lentes)**: con una lente activa, las marcas quedaban
    unos 12 px por debajo de los títulos que entran al hacer scroll. La regla que debía dejar todo
    quieto bajo una lente no llegaba a aplicarse (selector mal escrito). Comprobado: 0 elementos
    desplazados con la lente puesta.
  - Sin cambios: las interfaces de Tempora y Vístalo conservan sus colores propios en oscuro (son
    capturas de producto), y las franjas "en tinta" (pie, "Lo que más disfruté", la etapa actual)
    se invierten a claro, como estaba decidido.
  - Capturas: `.taste-skill/def/e5/e5-oscuro-arreglos.jpg` y `e5-lente-alineada.jpg`.
- [x] **Pieza de three.js (D18)** (hecha y aprobada el 19 nov). Elegiste la
  "vista explosionada", como cierre de "Cómo lo veo yo" en el inicio.
  - **"Y todo a la vez, en capas."** (`LayerStack.astro`, `src/scripts/layer-stack.ts`): la web de
    ejemplo se separa en sus cuatro capas, puestas en el espacio: 01 Boceto, 02 Diseño, 03 Código
    y 04 Pruebas. Se gira arrastrando (o con las flechas) y un control abre o cierra la separación.
    Al entrar en pantalla las capas se separan solas; en reposo se mecen muy despacio.
  - **Las capas no son imágenes guardadas**: se pintan en el navegador midiendo el HTML real de la
    web de ejemplo (el boceto con los mismos trazos de la escena, el diseño repintado pieza a pieza
    desde sus estilos, las etiquetas reales y las comprobaciones). Si cambia la demo o el tema,
    cambian ellas.
  - **Peso**: three.js son 173 KB (comprimido) y solo se descarga cuando la sección se acerca a la
    pantalla; el resto de la web no lo carga. Solo se dibuja mientras se ve.
  - **Alternativas**: sin WebGL, las cuatro capas se enseñan planas en una rejilla (probado). Con
    "reducir movimiento" no se mecen. En táctil se gira a los lados y el scroll sigue siendo de la
    página.
  - Comprobado a 1440 px (claro y oscuro, inglés) y 390 px; al salir y volver de la página no deja
    errores ni lienzos sueltos; 0 desbordes y la lente QA sin fallos. Capturas:
    `.taste-skill/def/e5/e5-capas-3d.jpg` y `e5-capas-3d-movil.jpg`.
  - No lo he podido ver moviéndose: el giro, el balanceo y la apertura a velocidad real los juzgas tú.
- [x] Inspector de la skill: 0 FAIL a 1440, 768 y 390 px (hecho y aprobado el 19 nov).
  - **De 46 FAIL a 0** en catorce páginas (las ocho en español y seis en inglés), a los tres anchos,
    con dos excepciones declaradas (abajo). Informes en `.taste-skill/def/e5/insp4/`.
  - **Lo que se ha arreglado de verdad**:
    - *Monoespaciada como rótulo*: el plan ya decía "mono solo para código y medidas". Los rótulos
      (versiones, fechas, "Pruébalo…", nombres de capa, datos de contacto, estados…) pasan a la
      letra de texto. La mono queda para código, rutas y valores medidos, que ahora van marcados
      como tales en el HTML (`<code>` y `<samp>`).
    - *Numeración decorativa* ("01", "02"…): fuera de las capas 3D, las funciones, los principios,
      la lista de proyectos y los apartados de los casos.
    - *Etiquetas pequeñas encima de títulos*: en los casos, cada apartado tiene ahora un título de
      verdad; la anotación de cada decisión va debajo de su texto; "Siguiente proyecto" y el nombre
      son una sola pieza grande.
    - *Textos grandes de más de dos líneas*: el problema del caso, la bio de Sobre mí y la frase de
      Contacto bajan a 36 px (son párrafos, no titulares). "Lo que más disfruté" pasa a ser un
      titular corto con su frase al lado. El titular de la web de ejemplo se acorta.
    - *Degradados*: el subrayado de los enlaces y el control de separación ya no los usan.
    - *Secciones cargadas a un lado*: "Qué hace" va en tres columnas y "Lo que más disfruté", en dos.
    - *Texto tapado*: los hilos de prototipo van ahora por debajo de los títulos (Proyectos y casos).
    - *Contraste* del control Lienzo/Lista (el texto no tenía su fondo real debajo), *tamaño del
      texto* de las notas de Proyectos (16 px), *sombra* de un panel, *nombre del frame* a menos
      de 12 px del borde en móvil y la *paleta del código* (tema propio: tinta, grafito y verde).
  - **Excepciones declaradas** (`--allow`), con su porqué:
    - `eyebrow`: el inspector toma el nombre del frame ("Inicio", "Sobre mí"…) por una etiqueta
      encima del H1. Es la pieza central del concepto y va fuera del artboard, como en Figma.
    - `few-pictures` (páginas interiores): pide al menos cuatro imágenes reales. Faltan las tuyas:
      capturas de Tempora, Vibora y Learnish y la sesión de fotos. Se quita cuando lleguen.
    - `covered-text` (solo Inicio, en móvil): en "Cómo lo veo yo" el texto pasa por debajo de la web
      de ejemplo, que va fija. Es como funciona la escena.
  - Avisos (WARN) que quedan y no bloquean: no hay vídeo, muchos tamaños de letra distintos (los de
    las interfaces de ejemplo) y la hoja de dirección antigua de la skill (otras tipografías).
  - Tras los cambios: 0 desbordes en 108 combinaciones y la lente QA sin fallos.
  - **Textos que he cambiado** (provisionales, como el resto): los titulares de "Lo que más
    disfruté" de los cuatro casos y el titular de la web de ejemplo.
- [ ] Las 10 pruebas de la rúbrica (**pasadas el 19 nov; pendiente de tu visto bueno**). Ocho pasan,
  una pasa con una excepción que decidiste tú y una no pasa al pie de la letra:
  1. **Competidor** · pasa (juicio mío). Nadie más tiene el lienzo con sus frames, las tres lentes,
     tu personaje moviendo las páginas y la web separada en capas.
  2. **Póster** · pasa. La sección más floja era "Lo que uso, por lentes" (tres columnas de texto):
     ahora los tres oficios van en grande.
  3. **5 segundos** · pasa. Con la intro, el nombre, el oficio, "Ver proyectos" y "Descargar CV"
     están a la vista a los 3,4 s (medido en fotogramas); sin intro, a los 0,2 s.
  4. **Cámara lenta** · pasa. Regrabadas la intro, la transición con el personaje y el morph después
     de todos los cambios de E5: sin saltos. En el morph hay un instante de doble imagen del título
     durante el cruce (ya estaba). Lienzo, lentes y capas 3D se revisaron al construirlos.
  5. **Coherencia** · pasa. Hover de tarjetas y retrato, foco con teclado, lentes y selección de
     frames usan el mismo cuadro de 1 px con ocho tiradores; los hilos unen frames en Proyectos,
     casos y 404.
  6. **Densidad** · **no pasa al pie de la letra**. Pide dos tamaños más el display por pantalla y
     hay entre 3 y 5. Lo que sí se ha hecho: los tamaños sueltos que fui metiendo en E4 (hasta 7
     por pantalla) se han reducido a la escala de seis del sistema (pequeño, cuerpo, entradilla,
     título, cabecera y display); no quedan numeraciones ni etiquetas sobre títulos (salvo el
     nombre del frame); y los chips de tecnología de la cronología pasan a una línea de texto.
     Quedan como píldoras las notas "Pruébalo…", las anotaciones de las decisiones y "actual".
  7. **Eloi** · pasa, con una excepción tuya: la intro se cierra con un iris, que está en su lista
     de firma; lo pediste expresamente. He alejado dos parecidos: el título gigante de Contacto ya
     no es "Hablemos" (ahora "Escríbeme" / "Say hello") y el ejemplo de test ya no es un `.spec`.
  8. **Inspector** · pasa: 0 FAIL en catorce páginas, con tres excepciones declaradas.
  9. **Móvil** · pasa (revisión de E5).
  10. **Memoria** · pasa (juicio mío): el lienzo y las lentes están siempre en la barra. En móvil
      van dentro del menú, así que ahí se recuerdan menos; el personaje y las capas 3D sí se ven.
  - Medidas con `.taste-skill/eloi-1118/tools/rubric.mjs`; fotogramas en
    `.taste-skill/def/e5/e5-rubrica-*.jpg`. Tras los cambios: 0 desbordes en 108 combinaciones.
  - **Textos que he cambiado** (provisionales): el título de Contacto y un titular en inglés.

**Hecho cuando**: pasa toda la rúbrica. Ahí el diseño está de 10.

## Ajustes de diseño (después de E5)

El 20 nov, en vez de cerrar el diseño, Christian pidió cambios, empezando por la home. Se trabajan
igual: un punto por parada y la casilla se marca con su visto bueno.

- [x] **Hero sin texto encima de la foto** (D22; hecho y aprobado el 20 nov):
  - Antes de tocar nada se hizo una maqueta (CSS inyectado sobre la web construida) y la aprobaste.
  - Escritorio: el texto en su columna (hasta el 54 % del ancho del contenido) y la foto en la suya
    (desde el 58 %; antes, el 55,5 %). Titular de 150 a 118 px a 1440 (`--d` de 12,6 a 9,8 cqi) y
    "Software developer" en dos líneas. El H1 y la frase no salen de su columna, así que la caja que
    dibuja la lente Diseño también se queda en ella.
  - Claro: sin el modo de fusión "diferencia" (ya no hace falta): el oficio va en el gris secundario,
    que es el tono que daba la fusión sobre blanco.
  - Móvil: la foto arriba y el texto debajo, empezando donde la máscara de la foto llega a
    transparente (el 88 % de su alto en claro y el 92 % en oscuro). El nombre ya no monta sobre la
    chaqueta.
  - Comprobado a 1920, 1440, 1280, 1024, 768, 390 y 320 px, en claro y oscuro: el texto acaba antes
    de la foto (8 px de aire a 768, donde el borde de la foto ya es transparente, y unos 45 px en
    escritorio) y nada desborda. Capturas en `.taste-skill/mock-hero/verify/`.
- [x] **Barra dentro de la página** (D23; hecho y aprobado el 20 nov):
  - La barra es la primera fila del artboard: papel, el ancho del frame (deja ver el lienzo a los
    lados) y su contenido alineado con el de las secciones (82rem). La página actual del menú va
    sobre un paso de tinte y el menú de móvil, sobre papel.
  - El nombre del frame encima del artboard solo queda en la 404 (allí la barra sigue sobre el
    lienzo). En el resto de páginas sale en la barra de estado de las lentes ("Inicio 1371 × 9643",
    en escritorio) y en el lienzo.
  - En el paneo la barra se queda quieta como antes (conserva el cuadradito que se desliza). En el
    cambio de modo cambia con los frames, no con el lienzo.
  - **Miniaturas del lienzo repetidas** (las 32 y `canvas-sizes.json`): ahora incluyen la barra, y la
    altura de cada frame es la barra más el artboard (igual que en la barra de estado de las lentes).
    Las alturas guardadas venían desfasadas de antes (los casos medían unos 1.300 px menos).
    `canvas-thumbs-resize.cjs` pasa de jimp a sharp (ya es dependencia del proyecto), así funciona
    también en Windows.
  - **Lienzo navegable**: la cámara coloca la miniatura de la página actual exactamente sobre la
    página real (comprobado a 1440, 1280 y 1100 px, en Inicio, Sobre mí y en inglés). De paso, un
    fallo que ya estaba: en la home no se marcaba "Estás aquí" y el lienzo se abría alejado.
  - **Revisión con contexto limpio**: confirmó dos fallos (la cámara del lienzo y el cambio de tema
    en la 404, donde la barra sigue sobre el lienzo) y avisó de otros que se comprobaron en el
    navegador: a 360 px la barra no cabía ("made by" se oculta ahora por debajo de 390 px) y en tablet
    el nombre se salía de su columna porque el eje óptico ensancha las letras (el titular usa ahora
    siempre el corte de display, `opsz` 96).
  - **Inspector**: 0 FAIL en Inicio y Sobre mí con las excepciones `eyebrow`, `few-pictures`,
    `covered-text` y, nueva, `headline-lines` (el H1 en tres líneas por D22).
  - **Tests de Playwright desfasados** (no por este cambio): `tests/example.spec.ts` viene de `main` y
    falla en 7 de 12 casos (títulos con "|", el id `#mobile-menu-btn` y dos `<nav>` en la home por la
    web de ejemplo). Se rehacen en la fase técnica.
- [x] **Foto clara sin sombra ni franja, sobre gris** (D24; hecha y aprobada el 20 nov: "déjala como
  está, me gusta". Con D25 su fondo pasa a ser transparente, ver el punto siguiente):
  - Pediste quitar en modo claro la sombra y la línea roja de la pared, y un fondo algo más gris.
  - `card-light.jpg` es ahora tu figura (la de `card.jpg`) sobre un gris claro, más hondo detrás de
    los hombros (#e0e0e0) y que se abre a blanco hacia arriba y hacia los lados. Arriba, donde la
    foto asoma bajo la barra, ya es blanco: no hay línea. Las máscaras del hero son las mismas.
  - La luz roja de la cara se queda (es de la foto) y el texto no cambia de color.
  - En el borde de la figura se cambia la pared vieja por el gris, así no queda cerco oscuro ni
    rojizo (en la oreja, a la altura de la franja, se notaba).
  - Cómo se genera, en Windows o en macOS, desde la raíz:
    1. `mascara-diferencia.cjs` recuperó tu máscara de persona comparando el `card-light.jpg`
       anterior con `card.jpg` (allí la figura iba pegada tal cual). Está guardada en
       `docs/imgs/card-mascara.png`, así que para esta foto ya no hace falta `person.swift`.
    2. `node .taste-skill/recorte/luz-gris.cjs src/assets/images/card.jpg docs/imgs/card-mascara.png src/assets/images/card-light.jpg`
       monta la versión clara. El gris se ajusta con variables de entorno; los valores por defecto
       son los de ahora.
  - Probadas antes cinco variantes en la página: un gris uniforme llegaba a los bordes del artboard
    en móvil y el frame se confundía con el lienzo; uno concentrado detrás del cuerpo, no.
  - Comprobado a 1920, 1440, 1280, 1024, 768, 390 y 320 px: justo bajo la barra la foto es papel
    (254 de 255) en todos los anchos. El oscuro no cambia. Capturas en
    `.taste-skill/mock-hero/verify-gray/`.
  - Miniaturas del lienzo: repetidas las dos de la home en claro (`es-home-light.jpg` y
    `en-home-light.jpg`). Las alturas no cambian.
- [x] **Hoja con textura de papel** (D25; hecha y aprobada el 20 nov):
  - Viste el fondo en carterogunsola.com/writing y lo quisiste en toda la página y en los dos
    modos, pero fijo: sin la estela que allí deja el ratón.
  - Cómo está hecho: allí es un shader que se redibuja en cada fotograma (por eso reacciona al
    ratón). Aquí es una imagen que se repite sin costuras, así que no puede reaccionar a nada, pesa
    50 KB en claro y 43 KB en oscuro y no gasta batería. La textura es propia: trama de puntos a
    45°, manchas muy suaves y grano.
  - Se genera con `node .taste-skill/papel/papel.cjs light public/textures/paper-light.webp` (y
    `dark`); el aspecto se ajusta con variables de entorno.
  - Colores: hay una superficie nueva, `--sheet` (la hoja: `#d6d6d6` en claro, `#171717` en oscuro),
    que se pinta con `--sheet-bg` (color más textura). `--paper` queda para las piezas que van
    encima. En claro, además: lienzo `#c6c6c6` (antes `#e5e5e5`; más oscuro que la hoja, para
    que se distinga de ella donde aún se ve), bordes `#b6b6b6` y grafito `#74747a` (más oscuros,
    para conservar el contraste que tenían sobre blanco). El oscuro no cambia de colores.
  - **De borde a borde** (lo pediste al verla: a los lados seguía el gris liso del lienzo): la hoja
    la pinta el `body`, como una sola superficie sin costuras, y el artboard va sin fondo. Los
    márgenes siguen midiendo lo mismo, pero ya son papel. El lienzo solo se ve donde hace de mesa
    de trabajo: el paneo entre páginas, "Ver lienzo", la 404 y las franjas de Proyectos y Contacto.
    El pie y esas franjas quedan como paneles dentro de la hoja.
  - **La barra sin línea recta** (también pedido al verla): su fondo y su borde son dos capas de la
    misma hoja. El borde es una franja de 36 px que se desvanece, así las tarjetas se funden al
    pasar por debajo en vez de cortarse. Solo aparece con la página movida (`html[data-scrolled]`,
    lo pone el guion de `Header.astro`); arriba del todo taparía el principio del contenido.
  - También usan la hoja el menú de móvil y, en móvil y tablet, el escenario fijo de "Cómo lo veo
    yo" (en escritorio va sin fondo). El hero ya no pinta fondo propio.
  - Cambio de modo: la textura se funde a la vez que el texto (antes de corregirlo saltaba al
    instante y el texto quedaba 150 ms del color del modo anterior). Como ya no hay lienzo a la
    vista, el cambio en dos tiempos solo queda en la 404.
  - Revisión con contexto limpio: encontró el escenario fijo pintado de blanco, la etiqueta de las
    cotas en blanco y el salto de la textura al cambiar de modo. Los tres, corregidos.
  - Las fotos de persona en claro:
    - Hero: `card-light.webp` sustituye a `card-light.jpg`. Es la misma figura con fondo
      transparente y un velo claro muy suave detrás, así se ve la trama del papel hasta el borde
      de la silueta. `luz-gris.cjs` genera ahora esta versión.
    - Sobre mí: el fundido por multiplicación no funcionaba (la máscara de la figura lo aislaba) y
      sobre blanco no se notaba. Ahora la mezcla va en el envoltorio y el retrato queda impreso
      sobre la hoja.
  - La lente Diseño conserva el gris de la hoja y cambia la textura por su rejilla de puntos; su
    barra de estado enseña `sheet` en lugar de `canvas`.
  - Lo que no se ha copiado: las líneas de pliegue de la referencia (cruzarían titulares y
    tarjetas y parecerían líneas de maquetación) y su interacción.
  - Miniaturas del lienzo: repetidas las 32. Las alturas no cambian.
  - Comprobado en Inicio, Proyectos, dos casos, Sobre mí, Contacto y la 404, a 1440 y 390 px, en
    claro y oscuro, más la barra con la página desplazada, la lente Diseño, el menú de móvil y el
    cambio de modo. Capturas en `.taste-skill/mock-hero/audit/` y `states/`.
- [x] **Selectores de tema e idioma** (D26; hechos y aprobados el 20 nov):
  - Los dos con la misma pieza (`.seg`, en `kit.css`): una bandeja con las dos opciones a la vista
    y una marca bajo la activa. Esquinas rectas, como elegiste, y a juego con la bandeja de lentes.
  - Tema: sol y luna, dibujados con el trazo de los demás iconos de la barra. La marca se desliza al
    cambiar. Pulsar la opción que ya está activa no hace nada.
  - Idioma: ES y EN. La marca cambia con la barra al pasar de página, sin transición propia (va
    debajo de las siglas; como capa aparte las taparía o quedaría tapada).
  - Revisión con contexto limpio: avisó de eso mismo (la marca se perdía durante el cambio de
    idioma) y de que guardar el tema podía fallar con el almacenamiento bloqueado. Corregidos.
  - Los tests de Playwright de `tests/example.spec.ts`, que ya estaban desfasados, buscan además
    `.theme-toggle-btn`, que ya no existe. Se rehacen en la fase técnica.
  - No se aplica a los botones de acción (CV, Ver proyectos, Ver lienzo).
  - Móvil: por debajo de 480 px no caben en la barra junto a la marca y el botón del menú, y van
    dentro del menú, en una fila propia con celdas de 44 px. De 480 a 1023 px van en la barra, con
    celdas de 36 px.
  - Lo que arrastra en la barra: ocupan unos 45 px más que antes. Los rótulos de las lentes y de
    "Ver lienzo" aparecen ahora a partir de 1360 px (antes, 1280; entre medias van en icono) y a
    1024–1099 px el menú va más apretado. Medido a 14 anchos (de 320 a 1920 px) y en los dos
    idiomas: todo en una línea, sin desbordes.
  - Componentes: `ThemeToggle.astro` (rehecho) y `LangSwitch.astro` (nuevo), los dos con una
    variante para el menú.
  - Miniaturas del lienzo: repetidas las 32 (la barra sale en todas). Las alturas no cambian.
- [x] **Foto oscura del hero: bordes** (hecho y aprobado el 20 nov; solo cambia la máscara, la foto
  es la misma):
  - Arriba, la pared ya no corta recta bajo la barra: se funde con la hoja (del 16,8 % al 25 % del
    alto de la foto; en móvil, del 0 al 8 %). El pelo no lo acusa porque es del tono de la hoja.
  - Abajo, menos fundido: la figura aguanta sólida hasta el 71 % (antes, 62 %); en móvil, hasta el
    58 % (antes, 48 %). El punto donde se desvanece del todo no cambia.
  - Las miniaturas de la home se repitieron al cerrar el punto siguiente.
- [x] **Hero: la misma foto en los dos modos y aire arriba** (cerrado por Christian el 20 nov: "esto
  de diseño ya está todo", no quiere tocar más la home por ahora):
  - La foto es la misma en claro y en oscuro (`card-dark.jpg`): la de la luz roja con su pared gris,
    pero sin la sombra que la figura proyectaba en la pared. Sale de `card.jpg` con
    `.taste-skill/recorte/sin-sombra.cjs`, que rehace la pared de la derecha. La versión recortada
    sobre transparente (`card-light.webp`) ya no se usa en el hero; el archivo y su guion siguen.
  - Se probó sentar la figura recortada sobre una línea de base: no le gustó.
  - En móvil, el encuadre, el fundido y la altura a la que empieza el texto son los mismos en los
    dos modos (antes la foto oscura era más alta).
  - En escritorio, texto y foto bajan juntos unos 48 px respecto a la barra (`--hero-top`), y el
    hero llega al menos hasta donde acaba la foto.
  - Fundidos en escritorio: en oscuro, los de antes (anchos, casi no se notan). En claro, una curva
    suave en los cuatro lados. **No se ven iguales**: la pared oscura contrasta mucho con la hoja
    clara y el fundido se nota como un halo. Quedó propuesto y sin respuesta aclarar la pared en la
    versión clara para igualarlas; si vuelve a la home, empezar por ahí.
- [x] **Lentes y lienzo en el bocadillo de la caricatura** (D27; hecho y aprobado el 20 nov, con
  la barra, la frase nueva y el menú de móvil):
  - Fuera de la barra de escritorio: la barra queda en marca, menú, idioma, tema y CV.
  - La caricatura, fija abajo a la izquierda, con un bocadillo de cómic. Al pulsarla se abre con
    Diseño, Código, QA y Ver lienzo, y con "Vista normal" si hay una lente puesta
    (`src/components/site/ViewBubble.astro`). Con teclado: Tab hasta la caricatura, Enter, flechas
    y Esc; los atajos 1, 2, 3 y M no cambian.
  - Con la página movida o una lente puesta queda la cabeza sola; con una lente sube por encima de
    su barra de estado. Se esconde con el lienzo abierto, el menú de móvil y la intro.
  - Comprobado con `.taste-skill/mock-hero/vb-check.mjs` (escritorio, oscuro y móvil).
  - La barra, el mismo día: aire arriba (`--toolbar-top`, de 6 a 14 px, contado dentro de
    `--toolbar-h`), idioma y tema más separados y **sin el botón de CV en escritorio** (el CV sigue
    en el hero, en Sobre mí, en el pie y en el menú de móvil).
  - Después pidió: frase "¿Quieres verlo como yo?", bocadillo cerrado más cuadrado (como el
    abierto) y quitar las lentes y el lienzo del menú de móvil. Hecho: el bocadillo es la única
    entrada en todos los tamaños y el menú de móvil queda en enlaces, idioma, tema y CV.
  - La caricatura tiene vida (idea suya, hecha el 20 nov, pendiente de su visto bueno): parpadea
    a intervalos irregulares y mueve la boca cuando "habla". La página entra sin bocadillo; un
    segundo después habla y el bocadillo salta. Eso pasa **una vez por visita**; en las demás
    páginas queda la cabeza y habla al pasar el ratón o enfocarla. Sin movimiento si el sistema
    lo pide. Los ojos y la boca son trazos de `caricature.json` (`trazo-3`, `trazo-4`, `trazo-6`,
    `trazo-7`): si se regenera el dibujo hay que revisarlos en `ViewBubble.astro`.
  - Ajustes posteriores, a ojo con él: al hablar la boca **no se estira**, pasa de una forma a
    otra por sílaba (entreabierta, en "o", abierta), como en los dibujos animados; estirarla le
    pareció poco natural. Y la cara: entra con la del dibujo, habla y **al acabar guiña un ojo;
    así se queda el resto de la visita**. La boca en reposo es siempre la del dibujo (la sonrisa
    abierta fija se probó y no la quiso; queda solo como una de las formas al hablar). El
    bocadillo sale al entrar, **dura cinco segundos y se recoge**; después, solo al pasar el
    ratón. Y el paso del bocadillo al panel es **un solo globo que crece** desde el tamaño del
    bocadillo (antes uno desaparecía y el otro saltaba: lo vio forzado). El saludo sale **cada vez
    que se carga la web** (al entrar o al recargar), no al pasar de una página a otra: primero se
    hizo "una vez por visita" con `sessionStorage` y, al recargar para probarlo, no lo veía. Para
    que se entienda que se pulsa, el bocadillo lleva debajo de la pregunta **"Haz clic aquí"** en
    letra fina y gris, y el cursor de mano (se probó un "Sí" con forma de botón: no lo quiso).
    **Todo esto, aprobado el 20 nov.** El guiño y las bocas están
    dibujados en `ViewBubble.astro` encima de la caricatura (referencia suya: un logo de cara
    guiñando; se tomó el gesto, no el dibujo). La marca y la intro conservan la cara normal.
  - Capas 3D de la home ("Y todo a la vez, en capas"), 20 nov: le salían planas. No era el diseño:
    él mira la web en su servidor de desarrollo (`localhost:4321`) y Vite devolvía un 504
    "Outdated Optimize Dep" para three.js; arreglado con `optimizeDeps.include: ['three']` en
    `astro.config.mjs`. En el modo plano la barra de "Separación" ya se esconde. Preguntó si el
    boceto debía ir delante: se dejó el orden (boceto y diseño son hojas opacas; código y pruebas,
    transparentes) y **las capas van numeradas del 1 al 4** en las etiquetas y en la lista.
  - Enlace con la escena de la home (hecho y aprobado el 20 nov): al acabar
    "Tú ves una web. Yo la veo así", con las capas 3D a la vista, la caricatura habla otra vez y
    su bocadillo dice **"Puedes ver toda esta web así."** durante cinco segundos, una vez por
    carga. No se añade ningún bloque: el puente con botones que había (`showBridge` en
    `ViewScene.astro`) sigue escondido porque no le convenció; se reutiliza solo su frase.
    Comprobado con `.taste-skill/mock-hero/escena-check.mjs`.
  - Ya no hace falta, salvo que quiera afinar el gesto con su trazo: el dibujo de una cara contenta (ojos en U invertida) para el bocadillo, en
    tinta negra sobre blanco y con el encuadre de `docs/imgs/avatar/head-front.png`. Se pasa a
    vectores con `.taste-skill/letras/vectorize.cjs`.
  - De la misma conversación quedan por hacer: enlazar "Tú ves una web. Yo la veo
    así" con el bocadillo, las cajas de proyectos con vídeo al estilo de poulo.site y mirar por
    qué han dejado de verse las capas 3D de la home.

- [x] **Proyectos en cajas** (idea suya, con poulo.site como referencia de organización; hecho y
  aprobado el 20 nov; **quedan sus vídeos**, ver el último punto):
  - Hecho: el componente `src/components/ui/ProjectBento.astro`. Por proyecto: nombre y datos,
    una caja grande con su pieza (la interfaz que se toca), una caja con el resumen, el papel y
    "Ver caso", y una fila con sus tres decisiones (`src/data/cases.ts`). Cajas del sistema: planas,
    rectas, sobre `--tint`. Sin filtros ni vistas, que con cuatro proyectos sobran.
  - Dónde va (decidido por él el 20 nov): en la **página de Proyectos, como vista principal**. La
    vista en lista de una línea por proyecto desaparece; el Lienzo (tablero con hilos) queda como
    segunda vista. La vista elegida se sigue recordando (`projects-mode`: `boxes` o `canvas`). La
    página de pruebas `/cajas` ya se quitó. En la home no se pone: ya hay una tarjeta por proyecto.
  - Cada proyecto está ahora dos veces en la página (una por vista, la otra escondida). Por eso
    `frames.ts` coge para el paso animado al caso las piezas de la vista que se ve, y la vista
    guardada se aplica también al llegar navegando (script del `<head>` de `Layout.astro`).
  - Las miniaturas del lienzo de Proyectos y su altura (`canvas-sizes.json`: la página pasa de
    2.397 a 4.641 px) ya están rehechas.
  - Falta de él: un vídeo corto por app (8–15 s, sin sonido, una sola acción). Cuando llegue el
    primero se añade el campo `video` al esquema de proyectos y la caja grande lo enseña.

- [x] **La marca de la barra, una firma** (D28; hecho y aprobado el 20 nov; las miniaturas del
  lienzo ya la llevan):
  - "Chris" en Rock Salt en lugar de la caricatura con "made by chris". Elegida por él entre doce,
    "de momento". Es una imagen usada de máscara, no una tercera familia de letra.
  - Pendiente de él: su firma a mano (varias pruebas con rotulador grueso sobre papel blanco, en
    foto), para sustituir a la de la fuente.
  - **La intro no se toca**: sigue dibujando la caricatura con "made by chris". Se llegó a cambiar
    para que escribiera la firma y él lo mandó revertir: lo había entendido mal.
  - Lo que pidió: que **la firma de la barra se escriba a máquina**, letra a letra y con un cursor
    delante, en claro y en oscuro (hecho el 20 nov, pendiente de su visto bueno). El cursor
    desaparece en cuanto se escribe la S: los parpadeos del final los mandó quitar. **Aprobado.**
  - Para que las dos animaciones no se pisen, el saludo del bocadillo entra a los **3 s** de
    cargar (antes, 1 s): primero se escribe la firma arriba y después habla la caricatura abajo.
    Solo al cargar la web, no al pasar de una página a otra; en la home espera a que acabe la
    intro. Como la firma es una imagen, se destapa a saltos donde acaba cada letra (`Header.astro`):
    si cambia la imagen hay que volver a medir esos puntos.

- [x] **Retoques del 20 nov, tanda cerrada por él** (todo aprobado; miniaturas del lienzo rehechas):
  - **Foto clara tan ancha como la oscura**: medidas, las dos paredes ocupaban casi lo mismo,
    pero en claro el fundido lateral (18 % del ancho) hacía que se viera unos 100 px más estrecha,
    porque la pared oscura a medio fundir sobre la hoja clara ya no se lee como foto. El fundido
    lateral de la clara pasa al 9 %. La oscura no se toca. Coste: el borde de la clara es algo
    más marcado.
  - **Transición entre páginas sobre papel**: mientras el personaje empuja la página, el fondo ya
    no es el lienzo con puntos sino la misma hoja con textura, en claro y en oscuro
    (`::view-transition` en `global.css`).
  - **Menú**: la página actual se marca solo con una línea de tinta debajo de la palabra, de su
    primera letra a la última, sin fondo. (Primero se probó la línea con el enlace sobre tinte,
    como una pestaña: el fondo no le gustó.) Sigue deslizándose de un enlace a otro.
  - **Selectores de idioma y tema**: la opción activa va sobre una marca gris, la tinta rebajada
    con el tono de la hoja (gris oscuro en claro, gris claro en oscuro), con el texto en el tinte
    de la bandeja; contraste 7:1. (Antes, papel sobre tinte, que no se distinguía; después, tinta
    y papel puros, que vio "muy negro y muy blanco".)
  - Aprobados la foto, la transición sobre papel, la línea del menú y los selectores. Tres
    retoques más, pendientes de su visto bueno:
    - **Texto del menú a 16 px** (era 14 desde antes de esta tanda; preguntó si lo había
      encogido: no). Cabe en una línea también a 1024 px.
    - **Canto de la página en la transición, en claro**: una línea gris de 1 px a cada lado de la
      página que se mueve (`--page-edge`). En oscuro el canto ya se veía solo y le gusta así.
    - **Grises del hero en oscuro**: "Software developer" pasa de `#b4b4b4` a `#8f8f8f` (no se
      había tocado desde el 18 nov; lo veía demasiado claro). Los tres oficios, igual: la palabra
      en ese gris y el subrayado en blanco (antes, palabra blanca y subrayado gris); al pasar el
      ratón o con su lente puesta, la palabra pasa a blanco. **El modo claro no se tocó**: ahí
      los oficios siguen en tinta con el subrayado gris.
    Dio por buenos el menú y los colores ("de ahí no quiero tocar nada"; el modo claro se queda
    como está). La línea del canto en claro la pidió más oscura: `--page-edge` pasa a `#8a8a8a`.
  - **Cuadro de selección al pasar el ratón, desactivado** (20 nov): el recuadro con tiradores y
    medida que salía al pasar el ratón por las piezas con `data-sel` (la firma, las imágenes de los
    proyectos, la foto de Sobre mí…) no le gusta. Está **comentado, no borrado**, en `kit.css`
    (bloque `[data-sel]:hover`), por si lo quiere de vuelta: basta con quitar el comentario. Se
    sigue viendo al llegar con el teclado, que es lo que indica dónde está el foco.
  - Las miniaturas del lienzo de todas las páginas se rehicieron al cerrar la tanda.

- [x] **Sobre mí: foto nueva y Angular sin versiones** (hecho y aprobado el 20 nov; miniaturas
  del lienzo rehechas):
  - **Foto**: el retrato de la luz circular que pasó él, **en blanco y negro**
    (`src/assets/images/about.jpg`, hecha con `.taste-skill/recorte/sobre-mi.cjs`; el original en
    color, en `docs/imgs/sobre-mi-luz.jpg`). La misma en los dos modos, encuadrada en 4:5 sobre el
    círculo de luz y la cara, y fundida con la hoja por los cuatro bordes, como la del hero.
    Sustituye a la figura recortada sobre blanco (`profile.jpg` sigue siendo la imagen para
    compartir; `profile-cut.png` ya no se usa).
  - **Más aire bajo el titular**: el texto y la foto empiezan 80 px por debajo de "Diseño, código
    y QA" (antes 48) y la foto ya no sube hacia el titular.
  - **Angular sin versiones en toda la web**: fuera "de la versión 8 a la 21", "v8–v21" y
    "v8 → v15" (bio de Sobre mí en los dos idiomas, el rótulo del hilo de la trayectoria, la etapa
    de la cronología y las herramientas por lente). Las etiquetas "v7.0, v6.0…" de la trayectoria
    no son de Angular: son la numeración de las etapas y se quedan.

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
