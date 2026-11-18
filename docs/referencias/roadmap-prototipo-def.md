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
  - Para E3 (lentes): con la lente Código, la etiqueta del primer bloque pisa el nombre del frame.
  - Capturas: `.taste-skill/def/e2-barra-hoja-escritorio.jpg` y `e2-barra-hoja-movil.jpg`.
- [ ] **Hero** (**rehecho el 18 nov con tus dos cambios; pendiente de tu visto bueno**):
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
      - Cómo se genera `card-light.jpg` (hay que repetirlo si cambia la foto), en
        `.taste-skill/recorte/`:
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
- [ ] **Entintado del titular** en las visitas siguientes (**hecho el 18 nov; pendiente de tu
  visto bueno**):
  - Cuando no hay intro, las dos líneas nacen "a lápiz" (peso 200, anchura 75 % y grafito) y se
    entintan en 600 ms hasta su peso y su ancho. Primero el nombre y 90 ms después el oficio,
    que al ensancharse entra en la foto.
  - Al cargar la página empieza a los 150 ms; al llegar desde otra página espera 520 ms, a que
    termine la transición.
  - Con "reducir movimiento" no se anima. En la carga en que sale la intro tampoco.
  - Capturas: `.taste-skill/def/e2-tinta-hoja.jpg` (seis fotogramas).
- [ ] Revisado en escritorio, tablet y móvil.

**Hecho cuando**: la primera pantalla pasa toda la rúbrica, incluida la prueba de los 5 segundos.

## E3 · Momentos firma

- [ ] **Intro** (**hecha el 19 nov, adelantada a petición tuya; pendiente de tu visto bueno**):
  - Lo que pediste: la animación del vídeo de `docs/videos/` y, después, la de eloicotonat.com.
  - La secuencia (unos 2,5–3 s; solo en la primera visita de la sesión):
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
  - **Para repetirla**: abrir la home con `?intro` en la dirección (`/?intro`). Así sale siempre,
    también al recargar; sin eso solo sale una vez por sesión.
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
