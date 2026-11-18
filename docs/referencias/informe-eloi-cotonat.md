# Informe: la web de Eloi Cotonat y cómo llevar tu portfolio a nivel Awwwards

- **Web analizada**: https://www.eloicotonat.com/ (español e inglés)
- **Fecha**: 18 de noviembre de 2026
- **Para**: el portfolio de Christian (rama `prototipo1`)
- **Sustituye como referencia vigente** a [eloi-cotonat.md](eloi-cotonat.md), que queda como
  instantánea del 5 de noviembre: la web ha cambiado mucho desde entonces (ver A2).

> **Regla de uso** (la misma de [README.md](README.md)): de esta web se toman métodos, nunca su
> firma visual. Eloi es tu socio en Vístalo; tu portfolio tiene que poder ponerse al lado del suyo
> sin que parezcan hechos por la misma mano. La sección **B2** dice dónde se pisan hoy.

## Cómo se ha hecho

- Descarga del HTML de las 32 URL del sitemap, la 404, `robots.txt`, `sitemap`, `site.webmanifest`,
  `llms.txt` y el RSS. Extracción del CSS de cada página (va todo inline), de sus scripts inline y de
  sus módulos JavaScript, y lectura de todo ello formateado.
- Navegación real, en el navegador integrado y en un Chrome sin interfaz controlado por script. Así
  se han capturado la intro fotograma a fotograma, la transición entre páginas a cámara lenta (×10),
  el modo revisión, las pestañas, los hovers, el carrusel, la galería, el lightbox, el menú móvil y
  los temas claro y oscuro.
- Inspector de la skill `design-taste-frontend` a 1440, 768 y 390 px en las páginas principales.
- Medición propia de carga (FCP, LCP, CLS, peso y peticiones), en escritorio y en móvil simulado
  (CPU ×4, 4G lenta), y del contraste WCAG de todos sus pares de color.
- Criterios oficiales de Awwwards (fuentes al final).

**Capturas** (solo en local; la carpeta está ignorada por git): `.taste-skill/eloi-1118/`

| Archivo | Qué enseña |
| --- | --- |
| [sheet-intro.jpg](../../.taste-skill/eloi-1118/sheet-intro.jpg) | La intro en 12 fotogramas (0 → 2,46 s). |
| [sheet-vt-fwd.jpg](../../.taste-skill/eloi-1118/sheet-vt-fwd.jpg) | Transición Inicio → Trabajo a cámara lenta. |
| [states/vt-back-06-3090ms.jpg](../../.taste-skill/eloi-1118/states/vt-back-06-3090ms.jpg) | Transición hacia atrás a mitad de recorrido (cabezal y etiqueta). |
| [sheet-qa.jpg](../../.taste-skill/eloi-1118/sheet-qa.jpg) | Modo revisión recorriendo sus 8 marcas. |
| [sheet-hover.jpg](../../.taste-skill/eloi-1118/sheet-hover.jpg) | Hover de cada chip del hero y su efecto en el collage. |
| [sheet-tabs.jpg](../../.taste-skill/eloi-1118/sheet-tabs.jpg) | Las 4 pestañas de "Qué hago". |
| [sheet-mobile.jpg](../../.taste-skill/eloi-1118/sheet-mobile.jpg) | Móvil: hero, menú, CTA fija y modo revisión. |
| [sheet-av.jpg](../../.taste-skill/eloi-1118/sheet-av.jpg) | Audiovisual: filtros, vídeo al pasar el ratón, lightbox y clientes. |
| [sheet-light.jpg](../../.taste-skill/eloi-1118/sheet-light.jpg) | Tema claro en seis páginas. |
| [sheet-misc.jpg](../../.taste-skill/eloi-1118/sheet-misc.jpg) | Sobre mí, contacto, servicios, nota, 404 e inglés. |
| `<página>/desktop-page-01.jpg`, `tablet-…`, `mobile-…` | Cada página entera a tres anchos (inspector). |

## Índice

- **Parte A. Qué ha hecho Eloi**: A1 Ficha técnica · A2 Qué ha cambiado · A3 La idea y la voz ·
  A4 Estructura · A5 Sistema visual · A6 Movimiento · A7 Página a página · A8 Ingeniería invisible ·
  A9 Lectura con ojos de jurado
- **Parte B. Qué significa para tu portfolio**: B1 Cómo puntúa Awwwards · B2 Dónde se pisan tu
  `prototipo1` y su web · B3 Métodos que sí puedes adoptar · B4 Lo que no se toca · B5 Propuesta para
  nivel Awwwards · B6 Distancia entre `prototipo1` y ese nivel · B7 Siguiente paso: qué componentes y
  animaciones buscar
- **Anexos**: tokens, animaciones y fuentes

---

## Resumen en 12 puntos

1. **Concepto propio y fuerte**: "El ojo que encuentra el bug es el mismo que encuentra el plano".
   Junta dos oficios, QA y cámara, y ahora añade una tercera capa de cuaderno de trabajo: fotos
   impresas con cinta, notas adhesivas, letra a mano y grano de papel.
2. **Todo con CSS y JavaScript propio**: 28 animaciones `@keyframes` en la home y ninguna librería
   (ni GSAP, ni Lenis, ni router). Entre 2 y 5 KB de JavaScript externo por página.
3. **Intro "claqueta"** de 2,4 s, solo en la primera visita de la sesión y decidida antes del primer
   pintado.
4. **Transición entre páginas nativa** (View Transitions entre documentos): un barrido de 0,36 s con
   un "cabezal" de editor de vídeo que lleva el nombre de la página de destino y el color de su
   sección. La dirección sigue el orden del menú.
5. **Pieza viva**: la nota "96 tests en verde" activa un modo revisión que dibuja recuadros a mano
   sobre la web, cada uno con el test que comprueba esa parte.
6. **Hero enlazado sin JavaScript**: al pasar por un chip se levanta su pieza del collage (con
   `:has()`).
7. **Contenido honesto y concreto**: cifras reales, casos internos contados sin capturas y un
   `llms.txt` con "precisiones para no exagerar el perfil".
8. **Contraste AAA en todo el texto**. Lo he medido: ningún par baja de 7,8:1.
9. **Rendimiento excelente**: LCP de 0,2 a 1,1 s en escritorio, CLS prácticamente 0 y entre 180 y
   590 KB por página.
10. **Ingeniería invisible de primer nivel**: CSP con hashes, Speculation Rules, consentimiento de
    cookies bien hecho, formulario antispam sin fricción, JSON-LD completo y 96 tests de Playwright
    en CI.
11. **Su punto débil es la densidad**: 4 familias tipográficas, 18 tamaños de letra, muchas
    etiquetas en mono, cajas con borde y numeraciones. Es sobresaliente en usabilidad y contenido,
    pero en diseño (el 40 % de la nota de Awwwards) la carga le resta.
12. **Choque directo con tu `prototipo1`**: su modo revisión y sus notas a mano están muy cerca de tu
    lente QA y de tus notas de boceto. Conviene separar los dos lenguajes antes de seguir (B2).

---

# Parte A. Qué ha hecho Eloi

## A1. Ficha técnica

| Campo | Dato |
| --- | --- |
| Framework | Astro, sitio estático desplegado en Vercel (CDN en París, `x-vercel-cache: HIT`). |
| CSS | Todo inline en cada página (36–89 KB sin comprimir), con el ámbito por componente de Astro (`data-astro-cid-*`). Ninguna hoja externa. |
| JavaScript | Scripts inline (con su hash en la CSP) y un módulo por página de 2–5 KB. Sin frameworks ni librerías de animación. Las únicas variables globales son `va`/`si` (Vercel) y la Navigation API del navegador. |
| HTML | 27–46 KB comprimido (brotli) por página. La home tiene 685 nodos. |
| Tipografías | Outfit (variable 100–900), Fraunces (variable 300–900, redonda y cursiva), Fira Code (300–700) y Caveat 600 (subconjunto), más una "Caveat Fallback" con métricas ajustadas. Son 5 archivos woff2 y unos 170 KB. |
| Páginas | 32 URL en el sitemap (19 en español y 13 en inglés), más los legales, 3 CV en PDF, el RSS y la 404. |
| Idiomas | Español en la raíz e inglés en `/en/`. Las notas solo están en español. Todas las páginas llevan `hreflang`. |
| Temas | Claro y oscuro: sigue al sistema y el interruptor se recuerda en `localStorage`. Audiovisual siempre es oscura, como una sala de cine. |
| Medición | Vercel Analytics y Umami (sin cookies) siempre; Google Analytics 4 y Microsoft Clarity solo si aceptas las cookies. |
| Formularios | Web3Forms + hCaptcha (se carga solo cuando empiezas a escribir). |
| Calidad | 96 tests E2E de Playwright en 16 archivos, ejecutados en GitHub Actions antes de cada publicación (accesibilidad con axe-core, contraste AAA, SEO, legibilidad, consentimiento y formulario). |

## A2. Qué ha cambiado desde el 5 de noviembre

Novedades, o detalles que el análisis anterior no recogía:

- **Hero**: la foto sobre un círculo azul pasa a ser un collage con el retrato recortado en blanco y
  negro, dos fotos impresas con cinta y una nota adhesiva.
- **Modo revisión** (nuevo): la nota "96 tests en verde" marca la web con sus tests.
- **Lenguaje de cuaderno**: letra Caveat; subrayados, flechas, ticks y casillas dibujados a rotulador
  (máscaras SVG); grano de papel en el fondo.
- **Bordes de película** en los márgenes a partir de 1280 px: "ELOI COTONAT · SAFETY FILM ▸ 12 ▸
  12A · BCN 400 ▸ 13 ▸ 13A", como lo que va impreso en el borde de un negativo.
- **Pie** con una tira de película perforada entre el gran "Hablemos" y los créditos.
- **Transición**: el cabezal lleva ahora un resplandor del color de la sección y una etiqueta con el
  nombre de la página de destino.
- **Tests**: de 78 en 15 archivos a 96 en 16.
- **Pestaña de QA**: el informe de tests dibujado en CSS pasa a ser una captura real del informe HTML
  de Playwright.
- **Trabajo y Servicios**: collage de copias impresas con pies a mano; en Servicios, "Empieza por lo
  que te pasa" con notas pegadas.
- **404**: un informe de tests con uno fallando.

**Lectura**: en dos semanas ha pasado de una web más técnica a una más cálida y editorial sin tocar
la estructura ni la ingeniería. La lección para ti es que la estructura y la técnica se quedan y la
capa de identidad se puede iterar encima.

## A3. La idea y la voz

### Concepto

- **Frase eje**: "El ojo que encuentra el bug es el mismo que encuentra el plano."
- **Titular**: "Software que te deja dormir. / Imágenes que no se olvidan." En inglés: "Software that
  lets you sleep. / Images that stay with you."
- **Tres lenguajes cruzados**:

| Lenguaje | Dónde aparece | Para qué sirve |
| --- | --- | --- |
| **Cámara** | Intro (visor, REC, código de tiempo, flash, iris), logo (anillo de objetivo con luz de REC), bordes "safety film", tira perforada en el pie, créditos de película, carrusel con REC, Audiovisual como sala oscura y fotogramas numerados (▸21, ▸22…). | Marca y memoria: es lo que se recuerda. |
| **QA** | Nota "96 tests en verde", modo revisión, informe de Playwright, anillos de Lighthouse, 404 como test que falla, reglas del formulario visibles y "Rodado por mí. Probado por mí." | Prueba: demuestra el oficio en vez de contarlo. |
| **Cuaderno** | Fotos impresas con cinta, notas adhesivas, letra a mano, subrayados de rotulador, flechas y grano de papel. | Calidez: rebaja lo técnico y lo hace personal. |

### Voz y contenido

- Frases cortas, en primera persona y con cifras concretas: "Te respondo en menos de 24 h",
  "Llamada de 20 minutos", "Propuesta cerrada".
- Habla del problema del cliente: "Cada despliegue da miedo y se prueba a mano, deprisa y tarde."
- Es honesto de forma explícita:
  - Casos internos: "Trabajo interno de cada empresa: no publico capturas, sí lo que hice y con qué."
  - Imágenes de banco marcadas como "Foto ilustrativa".
  - La IA presentada como "línea nueva".
  - Idiomas con matices: "C1 · Cursado en la EOI, sin título".
- `llms.txt` con una sección **"Precisiones (para no exagerar el perfil)"** que dice a los
  asistentes de IA qué no deben afirmar (años exactos de experiencia, que no es especialista en n8n,
  etc.). Es una idea excelente para la búsqueda con IA.
- **Caminos por perfil**: "¿Contratas QA? Trayectoria, stack y CV →" en el hero y tres CV en PDF
  según lo que busques.
- **Cierres con personalidad**: créditos de película en el pie, "Rodado por mí. Probado por mí." y
  una 404 que dice "Esta página no pasó el test."

## A4. Estructura

```
/                         Inicio (una página con secciones ancladas: #about, #que-hago, #trabajo, #como-empezamos)
/trabajo/                 Trabajo, caso a caso (#web, #qa, #audiovisual, #esta-web)
  /proyectos/negocio-manual/ · /proyectos/seo-manual/ · /proyectos/qa-suite-e2e-ci/
/audiovisual/             Reel filtrable, clientes, formatos, Instagram, cómo trabaja un rodaje
/servicios/               4 servicios + "Empieza por lo que te pasa" + método + preguntas frecuentes
  /servicios/qa-automatizacion/ · /video-y-foto/ · /diseno-web/ · /automatizacion-ia/
/notas/                   Blog: 5 artículos y RSS
/sobre-mi/                Perfil completo: trayectoria, formación, idiomas y CV
/contacto/                Formulario + email protegido
/en/…                     Versión en inglés (sin las notas)
/cv/*.pdf                 CV de QA, audiovisual y marketing y web
/aviso-legal/ · /privacidad/ · /cookies/
404                       "Esta página no pasó el test." (bilingüe con un solo archivo)
```

- **Menú**: Trabajo · Audiovisual · Servicios · Notas · Sobre mí · Contacto, más el botón "Hablemos
  ↗", el idioma (EN) y el tema. El orden del menú decide la dirección de las transiciones (A6).
- **Pie**: el CTA "Hablemos", los créditos y cinco columnas (páginas, servicios, últimas notas, CV y
  enlaces).

### La home como argumento

| Sección | Qué afirma | Con qué lo prueba |
| --- | --- | --- |
| Hero | Hago QA, vídeo, webs e IA con el mismo estándar. | Chips, collage con trabajo real, nota de tests y disponibilidad con la hora real. |
| Trayectoria 2018 → Hoy y "He trabajado y rodado para" | Tengo recorrido. | Años y nombres reales (Accenture, VHIR, Stockagile, Parc Sanitari SJD; Glaecy, MR.RPM, Supergatos). |
| Qué hago (pestañas) | Cada servicio tiene resultados. | Informe de Playwright, carrusel de fotos, Lighthouse y flujo de IA. |
| Trabajo seleccionado | Lo he hecho. | Capturas, cifras (7 módulos, 33 lecciones, 35 preguntas) y empresas con sus años. |
| Cómo empezamos | Trabajar conmigo es fácil. | 4 pasos, sin permanencia y precio cerrado. |
| Pie | Hablemos. | CTA enorme, créditos y CV. |

Mide 3,8 pantallas a 1440 × 900: es corta y densa.

## A5. Sistema visual

### Color

**Tema claro** (el de partida si el sistema no pide oscuro):

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg-base` | `#faf8f5` | Papel cálido de fondo (con grano). |
| `--bg-sunken` | `#f1efe9` | Bandas a sangre (sección "Qué hago"). |
| `--surface` | `#ffffff` | Tarjetas. |
| `--text-main` | `#101323` | Titulares. |
| `--text-sec` | `#3b3f54` | Texto. |
| `--text-tertiary` | `#454959` | Etiquetas. |
| `--accent` | `#1538c1` | Cobalto: enlaces, botón principal, cursivas. |
| `--accent-2` | `#6227a5` | Ciruela (degradado de marca). |
| `--accent-warm` | `#87320d` | Ámbar oscuro (audiovisual). |
| `--accent-teal` | `#065548` | Verde azulado (web). |
| `--success` / `--danger` | `#0a573d` / `#991b15` | Estados; el rojo es el del modo revisión. |

**Tema oscuro**: fondo `#0d0f17`, superficie `#161822`, texto principal `#f2f4f8`, texto
`#c3c8d5`, acento `#99b1ff`, ciruela `#d9b1fc`, ámbar `#fbb36a`, verde `#68dfc3` y rojo `#f99b94`.

**Un tono por servicio**, cada uno con cuatro variantes:

| Servicio | Tono (claro) | Tinte | Vivo | Profundo |
| --- | --- | --- | --- | --- |
| QA (cobalto) | `#1538c1` | `#e9edfb` | `#315ff6` | `#183195` |
| Vídeo (ámbar) | `#87320d` | `#fcefde` | `#fb9b2d` | `#7b2f0f` |
| Web (teal) | `#065548` | `#e1f4f0` | `#1fc1a1` | `#084941` |
| IA (ciruela) | `#6227a5` | `#f3ebf9` | `#a351ec` | `#4f267e` |

Se usa en los chips del hero, los iconos, los subrayados, el borde superior de las tarjetas
(`.card-tone`), los fondos tintados y el color del cabezal de la transición. Es un sistema muy
ordenado: una clase `.tone-amber` redefine `--tone`, `--tone-tint`, `--tone-vivid` y `--tone-deep`, y
el componente solo usa esas variables.

**Paletas especiales**:
- **Papel**: copia `#ffffff`, nota `#f5eed6`, tinta de copia `#171b31` y cinta `#e8d9b0` al 78 %.
- **Cine** (intro y audiovisual): fondo `#0b0d14`, superficie `#1b1d28`, texto `#fcfcfc` y crema
  `#eee5d3`.
- **Marca**: degradado a 110° de cobalto a ciruela (barra de progreso).
- **Navegador**: `theme-color` `#f8f7f4` en claro y `#0b0d13` en oscuro; el manifest usa `#1538c1`.

**Contraste medido** (WCAG 2.x). Todo cumple **AAA** (7:1):

| Par | Ratio |
| --- | --- |
| Claro: texto principal sobre fondo | 17,4 |
| Claro: texto secundario | 9,8 |
| Claro: terciario | 8,4 |
| Claro: acento cobalto | 8,4 |
| Claro: ámbar / teal | 8,0 / 8,3 |
| Claro: blanco sobre botón cobalto | 8,9 |
| Oscuro: texto principal / secundario / terciario | 17,4 / 11,4 / 9,8 |
| Oscuro: acento lavanda / ámbar | 9,2 / 10,7 |
| Oscuro: texto del botón sobre lavanda | 9,2 |
| Nota: tinta sobre papel de nota | 14,6 |
| Rojo del modo revisión: claro / oscuro | 7,9 / 9,2 |

### Tipografía

| Familia | Papel | Peso |
| --- | --- | --- |
| **Fraunces** (serif con eje óptico) | Titulares H1 y H2, cifras grandes, el "Hablemos" del pie y las cursivas de acento. | 600 (cursiva 500) |
| **Outfit** (geométrica) | Texto, botones, menú y H3. | 400–700 |
| **Fira Code** (mono) | Chips, eyebrows, etiquetas, código de tiempo, enlaces con flecha y datos. | 600–700 |
| **Caveat** (a mano) | Pies de foto, notas, marcas del modo revisión y años de "La historia en cuatro actos". | 600 |

- **Escala** (tokens): 2xs 0,76 rem (12 px) · xs 0,84 rem (13 px) · sm 0,94 rem (15 px) · base 1,02
  rem (16 px) · md 17–19,5 px · lg 19,5–22,7 px · xl 22,7–27 px · 2xl 26–34 px · 3xl 30–42 px.
- **Titulares**:
  - H1 del hero: `clamp(1.9rem, min(3.7vw, 6.4vh), 3.6rem)`. El `vh` hace que el hero quepa en la
    altura de la pantalla.
  - Títulos de sección: `clamp(2.3rem, 5.2vw, 3.9rem)`; títulos de la home: `clamp(1.9rem, 3.8vw,
    2.9rem)`.
  - Interlineado 1,02–1,05, tracking −0,03 em, `font-optical-sizing: auto`.
  - `text-wrap: balance` en titulares y `pretty` en párrafos.
- **Acento**: palabras en cursiva del color de acento con un trazo de rotulador debajo (máscara SVG)
  que se dibuja al cargar. En móvil (≤ 600 px) el trazo pasa a ser un `text-decoration` normal para
  que no se rompa al partirse la línea.
- **Caveat**: subconjunto de 21 KB y fallback con `size-adjust: 72%` y `ascent/descent-override`,
  para que no haya salto cuando carga la fuente.
- **Lo que mide el inspector en la home**: 4 familias (Outfit 60 %, Fira Code 32 %, Fraunces 8 % y
  Caveat), 18 tamaños distintos (de 12 a 74 px) y 29 bloques de texto por debajo de 13 px.

### Retícula, espacio y forma

- **Ancho máximo** `--measure: 1200px`; márgenes de 2 rem (1,1 rem en ≤ 900 px).
- **Ritmo de sección** `clamp(3.25rem, 5.5vw, 5rem)`; las secciones se separan con una línea fina.
- **Hero** en rejilla 1,25fr / 0,75fr. Las bandas a sangre usan `inset: 0 calc(50% - 50vw)` en un
  `::before`, sin romper el contenedor.
- **Radios**: 6, 9, 12 y 16 px, y píldora. Los botones, 10 px.
- **Sombras**: suaves en claro (con tinte azul tinta, `hsl(230 24% 8%)`) y profundas en oscuro. Las
  copias impresas tienen su propia sombra de papel.
- **Puntos de corte**: 1280 (bordes de película), 1100, 1024, 1000, 900 (cambio principal a móvil),
  820, 720, 640, 600, 420, 400 y 380 px, más `(hover: none)` para pantallas táctiles.

### Texturas y detalles

- **Grano de papel**: dos capas SVG con `feTurbulence` de fondo en el `body`, un grano fino de 220 px
  y manchas grandes de 900 px, con valores distintos para el tema claro y el oscuro.
- **Bordes de película** (≥ 1280 px): texto SVG vertical que se repite en los dos márgenes como
  `background-image` de `body::before` y `body::after`.
- **Copias impresas**:
  - Papel blanco con 7 px de margen, cinta de 54 × 18 px girada −4°, pie en Caveat y giro de −6° o
    +5°.
  - Al pasar el ratón por el collage se enderezan.
- **Marcas como variables CSS** (máscaras SVG): `--tick-mark`, `--box-mark`, `--arrow-mark` y
  `--stroke-mark`. Se pintan con `background: currentColor` y `mask`, así que cambian de color con
  el tema.
- **Recuadro a mano del modo revisión**: `border-radius: 255px 18px 225px / 18px 225px 18px 255px`,
  el truco clásico para que un rectángulo parezca dibujado.
- **Detalles finos**: selección de texto en el color de acento, barra de scroll fina propia y foco
  visible de 2 px separado 3 px.
- **Logo**:
  - Un anillo de objetivo forma la C (con degradado), las tres barras de la E van dentro y lleva la
    luz ámbar de REC.
  - Al pasar el ratón crece un 8 % y el anillo gira 40° con un muelle (`cubic-bezier(.34, 1.4, .5,
    1)`).

## A6. Movimiento (catálogo completo)

**Principios**

- Todo en CSS (28 `@keyframes` en la home); el JavaScript solo cambia estados.
- **Curvas**:
  - Una de salida principal, `cubic-bezier(.16, 1, .3, 1)` (expo out, 27 usos).
  - Otra para el montaje, `cubic-bezier(.6, 0, .3, 1)`.
  - Muelles con rebote solo en el logo.
  - `steps(2, end)` para el parpadeo de REC.
- **Duraciones cortas**: 0,2–0,45 s en interacciones, 0,7 s en entradas y 0,36 s en transiciones.
- **`prefers-reduced-motion`**: 11 bloques en la home. Todo pasa a 0,01 ms, sin intro ni
  transición, y los elementos que entran con reveal ya se ven.
- **Animaciones pausadas fuera de pantalla**: `[data-anim-zone]` + IntersectionObserver con 160 px
  de margen → clase `is-off` → `animation-play-state: paused`.
- **Inspector**: 38 elementos se mueven al cargar y recorrer la home (25 animaciones CSS, 12
  transiciones y 1 por script).

### 1. Intro "claqueta" ([sheet-intro.jpg](../../.taste-skill/eloi-1118/sheet-intro.jpg))

**Cuándo**: en la primera carga de la sesión, nunca con ancla en la URL, reduced motion o ahorro de
datos. Lo decide un script inline del `<head>` antes del primer pintado: pone la clase `has-intro` y
`sessionStorage.introDone`.

| t | Qué pasa | Animación |
| --- | --- | --- |
| 0,05 s | Aparecen las 4 esquinas del visor (escala 1,04 → 1). | `introVf` 0,6 s expo |
| 0,15 s | "● REC 00:00:00:00" arriba a la izquierda. El punto parpadea y el código corre a 24 fps (JS). | `introFade` 0,35 s; `recBlink` 0,8 s `steps(2)` |
| 0,25 s | "Eloi *Cotonat*" se revela de abajo arriba (clip-path) y sube 14 px. | `introNameIn` 0,75 s expo |
| 0,45 s | "24 fps · 4K · BCN" abajo a la derecha. | `introFade` 0,45 s |
| 0,65 s | Línea degradada de cobalto a ámbar bajo el nombre. | `introRule` 0,5 s (`scaleX`) |
| 0,85 s | "QA · VÍDEO · WEB · IA". | `introFade` 0,4 s |
| 1,42 s | Flash blanco al 32 %. | `introFlash` 0,32 s |
| 1,55 s | El iris se cierra hacia el punto 50 % / 46 % y deja ver la web. | `introIris` 0,85 s `cubic-bezier(.76, 0, .24, 1)` |
| 2,40 s | Fin visual. A los 2,55 s el JS la quita del DOM. | — |

**Encadenado**: el hero, el banner de cookies y los subrayados esperan `--intro-delay: 1.6s`, así la
web entra mientras el iris se abre.

### 2. Transición entre páginas ([sheet-vt-fwd.jpg](../../.taste-skill/eloi-1118/sheet-vt-fwd.jpg) y [vt-back-06](../../.taste-skill/eloi-1118/states/vt-back-06-3090ms.jpg))

- **Mecanismo**:
  - `@view-transition { navigation: auto; }`: transición entre documentos, sin router.
  - La página antigua se queda quieta y la nueva entra con un barrido `clip-path: inset()` de 0,36 s.
- **Cabezal** (`.vt-head`): la aguja de un editor de vídeo pasando por la línea de tiempo.
  - Una línea de 2 px del color de la sección de destino, con resplandor y un degradado detrás.
  - Una etiqueta en mono con el nombre de la página ("▸ Trabajo", "▸ Trabajo / Negocio Manual") sobre
    el color profundo de esa sección.
- **Dirección**:
  - Cada página tiene un puesto: posición en el menú (Inicio, Trabajo/Proyectos, Audiovisual,
    Servicios, Notas, Sobre mí, Contacto) × 2, + 1 si es una subpágina.
  - Si vas a una página posterior, el barrido va hacia la derecha. Si vas a una anterior o vuelves
    con el historial, va hacia la izquierda.
  - El origen lo dan `navigation.activation.from` (Navigation API) o `document.referrer`, dentro del
    evento `pagereveal`.
- **Sincronía**: el barrido lo anima el navegador y el cabezal es un elemento de la página. Para que
  la aguja vaya pegada al borde, el script iguala el `startTime` de las dos animaciones en cuanto
  `viewTransition.ready` se resuelve.
- **Lo que no se mueve**:
  - La barra superior (`view-transition-name: topnav`, 0,3 s).
  - El subrayado del enlace activo (`nav-line`), que se desliza de un enlace a otro.
- **Precarga**: Speculation Rules `prerender` con `eagerness: moderate` en todos los enlaces internos
  salvo PDF y descargas. Al hacer clic la página ya está lista y la transición es inmediata.
- **Reduced motion**: sin barrido ni cabezal.

### 3. Entrada del hero

- **Escalonado** con `animation-delay: calc(var(--intro-delay) + var(--d))`: roles 50 ms ·
  subtítulo 120 ms · disponibilidad 150 ms · botones 200 ms · enlace para reclutadores 250 ms ·
  trayectoria 300 ms · empresas 400 ms. Cada pieza sube 14 px con fundido (0,7 s, expo out).
- **Subrayados de rotulador del titular**: se dibujan de izquierda a derecha con `clip-path: inset(0
  100% 0 0)` → `inset(0 -2% 0 0)`, a los 0,45 s (cobalto) y a los 0,6 s (ámbar).

### 4. Collage enlazado ([sheet-hover.jpg](../../.taste-skill/eloi-1118/sheet-hover.jpg))

- Al pasar el ratón (o el foco) por un chip, se mueve su pieza del collage:
  - Vídeo → la foto del videoclip, con contorno ámbar; se endereza y sube.
  - Web → la copia de "mi web", en teal.
  - QA → la nota de tests, en cobalto.
- Es solo CSS:
  `.hero:has(.hero-role.tone-amber:is(:hover, :focus-visible)) .hc-print-a { … }`.
- Al pasar por el collage, las dos copias se enderezan (rotate y translate, 0,5 s).

### 5. Modo revisión ([sheet-qa.jpg](../../.taste-skill/eloi-1118/sheet-qa.jpg))

- **Activación**: la nota "✓ 96 tests en verde · ver qué comprueban →" es un `<button
  aria-pressed>`; al pulsarla cambia a "quitar las marcas ✕".
- **Datos**: las marcas vienen en un JSON (`data-marks`) y cada elemento lleva `data-qa="h1"`,
  `"text"`, `"cta"`, `"alt"`, `"tabs"`, `"links"`, `"form"` o `"cookies"`. Hay 8 en la home:

| Nº | Marca | Test |
| --- | --- | --- |
| 1 | un único H1 por página | `seo.spec` |
| 2 | ningún texto por debajo de 12 px | `legibilidad.spec` |
| 3 | el botón se ve sin hacer scroll | `legibilidad.spec` (solo escritorio) |
| 4 | todas las imágenes llevan alt | `a11y.spec` |
| 5 | funciona con ratón y con teclado | `home.spec` |
| 6 | cada bloque lleva a su página | `home.spec` |
| 7 | el formulario frena a los bots | `contact.spec` |
| 8 | nada se carga sin tu permiso | `consent.spec` |

- **Dibujo**:
  - Una capa absoluta con un recuadro rojo "a mano" por marca (el truco del `border-radius`), con
    8 px de margen alrededor del elemento.
  - Entran escalonados cada 80 ms (escala 1,03 → 1).
  - Cada recuadro lleva una etiqueta en Caveat con el número en un círculo y el nombre del archivo en
    mono.
- **Panel**: fijo abajo a la izquierda, en papel de nota girado −1,2°: "Marcado por los tests de esta
  web · Siguiente marca ↓ · Quitarlas ✕". "Siguiente marca" hace scroll suave hasta cada una.
- **Detalles**:
  - Esc lo cierra y la capa se recalcula con un ResizeObserver.
  - En móvil oculta las marcas anchas y el nombre del archivo.
  - No se imprime.

### 6. Visor con fotos (pestaña "Vídeo y foto")

- **Aspecto de visor**:
  - REC parpadeando, código de tiempo a 25 fps, contador "01 / 05" y la etiqueta "@elhoyfoto · calle
    B/N".
  - Un cuadro de enfoque que "enfoca" (escala 1,5 → 0,92 → 1 en 0,9 s, con rebote).
- **Ritmo**: cambia de foto cada 3,8 s con un zoom lento tipo Ken Burns (escala 1,06 → 1 en 4,6 s).
- **Control**:
  - El botón REC pausa o reanuda, y el carrusel se pausa solo al pasar el ratón o con el foco.
  - Funciona con las flechas del teclado y deslizando en táctil (40 px).
  - Solo corre mientras se ve (IntersectionObserver), y es entonces cuando carga las imágenes
    diferidas.

### 7. Otros movimientos

| Pieza | Qué hace | Técnica |
| --- | --- | --- |
| Anillos de Lighthouse | El anillo se llena. | `stroke-dashoffset`, 1 s expo |
| Flujo de IA | Los 4 nodos entran en cascada. | `wvRow` 0,4 s escalonado |
| "Cómo empezamos" | La línea se dibuja y los iconos "se encienden" al aparecer. | `scaleX` 1,4 s + color 0,35 s |
| Contadores (donde los hay) | Cuentan hasta la cifra. | rAF de 1,1 s con ease out cúbico |
| Disponibilidad | Un punto verde que late. | pulso con `box-shadow`, 2 s |
| "Hoy" en la trayectoria | Una onda que se expande. | `hpPulse` 2,4 s |
| Barra superior | Pasa de transparente a cristal con desenfoque a los 8 px de scroll. | transición 0,3 s, `backdrop-filter: blur(14px)` |
| Barra de progreso | 3 px con el degradado de marca. | `transform: scaleX` con rAF |
| Botones | Suben 2 px y aparece una sombra dura de 3 px, como una tecla. | 0,25 s |
| "Hablemos" del pie | El subrayado crece y la flecha gira 8°. | `background-size` 0,45 s |
| Reveal global | Sube 16 px con fundido al entrar en pantalla. | IntersectionObserver (umbral 0,04), 0,5 s |
| Banner de cookies | Entra cuando acaba la intro. | `ckIn` 0,45 s + `--intro-delay` |
| CTA fija en móvil | Aparece tras el hero y se esconde al llegar al pie. | `translateY(120%)` → 0 |
| Vídeos de audiovisual | Se reproducen en silencio al pasar el ratón; el vídeo se carga en ese momento. | `pointerenter`; solo con ratón y sin reduced motion |
| Reel | Lightbox nativo (`<dialog>`) que encadena 4 directos con sonido. | evento `ended` |

## A7. Página a página

### Inicio

1. **Banner de cookies**: tarjeta abajo a la izquierda (25 rem, borde superior de 3 px en tinta).
   Entra tras la intro y los botones Aceptar y Rechazar pesan lo mismo.
2. **Barra superior**:
   - Logo, enlaces, EN, tema y la píldora "Hablemos ↗".
   - Es pegajosa y se vuelve de cristal al bajar 8 px.
   - En la home, el ancla de la URL cambia a la sección visible mientras haces scroll
     (`history.replaceState`), y el logo vuelve arriba con scroll suave.
3. **Barra de progreso** de lectura arriba.
4. **Hero** (rejilla 1,25fr / 0,75fr):
   - **Izquierda**:
     - 4 chips de rol con un cuadrado de color (QA cobalto, Vídeo ámbar, Web teal, IA ciruela) que
       llevan a cada servicio.
     - H1 en Fraunces 600 en dos líneas, con las cursivas subrayadas a rotulador.
     - Subtítulo de 54 caracteres de ancho.
     - Botones "Hablemos ↗" y "Ver trabajo ↓".
     - El camino para reclutadores: "¿Contratas QA? Trayectoria, stack y CV →".
   - **Derecha**:
     - Píldora invertida "● Disponible · Barcelona 17:55 HORA LOCAL", con la hora real que se
       actualiza justo al cambiar el minuto.
     - Collage: el retrato recortado en blanco y negro (precargado con `imagesrcset` en cuatro
       tamaños; es el LCP), la copia "videoclip · Glaecy", la copia "mi web" y la nota de tests.
   - **Abajo**:
     - La trayectoria 2018 → 2022 → 2024 → Hoy, con iconos en círculos y una línea con un color por
       tramo.
     - La banda "He trabajado y rodado para", con los clientes técnicos en blanco y los
       audiovisuales en ámbar.
5. **Qué hago** (banda a sangre más hundida):
   - Lista de pestañas a la izquierda (número, icono en un cuadrado de su color, título y subtítulo
     en mono) y panel a la derecha.
   - Es una `tablist` ARIA completa: flechas, Inicio y Fin.
   - Cada panel tiene su imagen o pieza animada, una frase de promesa y un botón "Ver servicio".
   - Las imágenes diferidas se cargan en cuanto el ratón entra en la sección.
6. **Trabajo seleccionado** (rejilla tipo bento):
   - Negocio Manual en un marco de navegador con su URL.
   - SEO Manual con tres cifras.
   - QA con la captura del informe de Playwright, las tres empresas con sus años y el stack en chips.
   - Audiovisual en una tarjeta de color ámbar tostado con tres fotogramas y un botón de play.
7. **Cómo empezamos**: 4 pasos con iconos y una línea que se dibuja, y los compromisos (sin
   permanencia, precio cerrado, Barcelona y remoto, ES · CA · EN).
8. **Pie**:
   - "¿Tienes un proyecto entre manos?" en mono y un enorme "Hablemos ↗" en Fraunces.
   - "Respondo en menos de 24 h · Barcelona y remoto" y la tira de película perforada.
   - Los créditos ("Dirección y cámara · Pruebas: 96 tests E2E · Hecho con: Astro y Playwright ·
     Desde: Barcelona") y cinco columnas.
   - Una barra final con ©, la disponibilidad con la hora, los legales, "Preferencias de cookies" y
     "↑ Arriba".
9. **Móvil**:
   - El collage se reduce y la trayectoria pasa a rejilla de 2 × 2.
   - Las pestañas se apilan.
   - Aparece una píldora fija "Respondo en menos de 24 h · Hablemos ↗" (respeta
     `safe-area-inset-bottom`).

### Trabajo

- **Cabecera**:
  - Ruta de migas, eyebrow, H1 "Webs, QA y audiovisual, *caso a caso*" (subrayado) y entradilla.
  - A la derecha, un collage de 4 copias impresas, una por grupo: "2 webs propias", "3 equipos de
    QA", "4 proyectos audiovisuales" y "96 tests en esta web".
  - Una nota a mano con flecha: "cada copia lleva a su grupo →". Cada copia es un enlace a su grupo.
- **Grupos** (`#web` teal, `#qa` cobalto, `#audiovisual` ámbar), cada uno con:
  - Un contador a mano encima del H2 ("2 webs propias"), el H2 subrayado en el color del grupo y una
    entradilla a la derecha.
  - **Web y SEO**: tarjetas con captura en marco de navegador (escritorio y móvil superpuestos),
    categoría y años, nombre, frase, chips, "Ver caso →" y "Visitar ↗".
  - **QA**: la captura del informe de Playwright con su pie ("Informe real de Playwright: la suite de
    esta web, antes de cada publicación") y tres tarjetas de empresa con proyecto, años, contexto y
    stack.
  - **Audiovisual**: una hoja de contactos con fotogramas numerados (▸ 21, ▸ 22…) que llevan a cada
    cliente en `/audiovisual/`.
- **"Esta web, como prueba · Rodado por mí. *Probado por mí.*"**: cinco anillos (Rendimiento 96–98,
  Accesibilidad 100, SEO 100, Contraste AAA y Tests E2E 96) y "Cómo se prueba sola →".

### Audiovisual (siempre en oscuro)

- **Hero**:
  - Fotograma de fondo con sombreado, eyebrow "REC Audiovisual · Barcelona" (REC en rojo) y H1
    "Cámara, foto y vídeo / *para artistas y creadores.*".
  - Chips, el botón crema "Hablemos de tu rodaje ↗" y "Ver reel · 4 directos · con sonido".
  - Una tarjeta-visor "Reel 2026" con REC y código de tiempo.
  - Enlaces a los canales, "Han confiado: Glaecy · MR.RPM · Supergatos" y el crédito del fotograma
    de fondo.
- **01 Reel, "Todo el trabajo"**:
  - Filtros con contador y `aria-pressed` (Todo 17, Videoclip 2, Directo 4, Cámara 4, Foto 7).
  - Rejilla que mezcla vertical y horizontal. Los directos se reproducen al pasar el ratón; los
    vídeos de YouTube llevan su insignia.
- **02 Proyectos, "Para quién he rodado"**: una sección por cliente con texto, la insignia "EN
  CAMINO: 2 videoclips más", una ficha (rol, periodo, piezas, publicado en), entregables en chips,
  enlace al canal y su rejilla de piezas.
- **Cierre**: "Formatos listos para cada canal" (videoclip, directo, retrato, vertical), "Más fotos
  en Instagram" y "Cómo trabajo un rodaje" (Brief, Rodaje, Selección y color, Entrega por canal).
- **Lightbox** con `<dialog>` nativo:
  - Anterior y siguiente con el teclado, cierre al hacer clic fuera y foco devuelto al elemento que
    lo abrió.
  - En modo reel, el contador muestra "Reel · 1/4".
- **JSON-LD** `ItemList` con todas las piezas (5 KB).

### Servicios y sus cuatro subpáginas

- **Índice**:
  - H1 "QA, vídeo, webs y automatización con IA" y 4 compromisos en tarjetas.
  - Un collage de las 4 tarjetas de servicio con la nota "cada tarjeta baja a su capítulo".
- **Un artículo por servicio**, con imagen y texto alternados:
  - QA: el informe de Playwright con su barra azul "96 tests en verde".
  - Vídeo: el visor con fotos.
  - Web: un móvil con SEO Manual y el panel de Lighthouse.
  - IA: una foto marcada como ilustrativa con el flujo de ejemplo.
  - Cada artículo lleva qué incluye, qué te entrega y "Ver el servicio".
- **"Empieza por lo que te pasa"**: 4 notas pegadas con frases del cliente entre comillas ("Cada
  despliegue da miedo…") que llevan a su servicio.
- **Cierre**: "Cómo trabajo" (Diagnóstico → Plan → Ejecución, con flechas a mano) y preguntas
  frecuentes con `<details>`.
- **Subpáginas**: H1 largo orientado a resultado, ficha, "¿Esto te suena?", qué incluye, cómo
  trabajamos (4 pasos), formatos de trabajo, 5 preguntas frecuentes y una caja lateral para
  preguntar.

### Proyectos (casos)

- **Estructura**: "01 El reto · 02 Qué hice · 03 Resultado", con una ficha lateral. En SEO Manual y
  Negocio Manual, capturas en marco; en QA, sin capturas (trabajo interno), con el qué y el con qué.

### Notas

- **Índice**: "Lo que aprendo trabajando, escrito", 5 artículos en tarjetas y RSS.
- **Artículo**:
  - Índice lateral con scrollspy, tiempo de lectura y etiquetas.
  - Caja final de contacto y "más notas".
  - JSON-LD `BlogPosting` y migas de pan.

### Sobre mí

- **Cabecera**:
  - H1 "IT de profesión, *cámara de toda la vida*" (subrayado en ámbar).
  - Ficha rápida en `dl`: Base, Experiencia, En QA e Idiomas.
  - "CV en PDF, según lo que busques" (3 botones).
  - Retrato impreso sobre fondo cobalto, una foto de calle en blanco y negro y una nota a mano
    "sistemas 2018 · QA 2022 · cámara 2024".
  - Una tarjeta "ahora mismo · Disponible para proyectos y para incorporarme a un equipo ·
    Barcelona · hora".
- **Bio**: con una cita destacada: "La tecnología robusta debe ser invisible. El contenido visual
  debe ser inolvidable."
- **"La mirada, fuera del encargo"**: su fotografía de calle, con una tira de película de miniaturas
  y dos copias ("Sevilla", "la plaza").
- **"La historia en cuatro actos"**: Acto I 2016 Delante de la cámara → Acto II 2018 Sistemas → Acto
  III 2022 QA → Acto IV 2024 Detrás de la cámara (años en Caveat).
- **"Qué gana tu proyecto con un perfil dual"**: 3 tarjetas tintadas.
- **Trayectoria**:
  - Línea de tiempo con filtros (QA · Sistemas · Audiovisual · Web · Origen).
  - Cada puesto lleva un icono de su área, la insignia "ACTUAL" si sigue, logros concretos y su
    stack.
- **"Con qué trabajo"**: stack por áreas, con la etiqueta "línea nueva" en IA.
- **Formación como `$ git log --graph formacion`**: dos ramas (técnica y creativa) que acaban en un
  `merge: técnica + creativa`, y un lateral con "Raíz técnica 2015 → 2019 · Raíz creativa 2016 →
  2023 · En curso 2026".
- **Cierre**: certificaciones e idiomas con una barra de la escala A1–C2 y matices honestos.

### Contacto

- **Columna izquierda**:
  - H1 "¿Tienes un proyecto *entre manos?*", entradilla y disponibilidad con la hora.
  - Lista de contacto con el email protegido: "Ver email" → hCaptcha → aparece la dirección, con un
    botón para copiarla que muestra "✓" durante 2 s y se recuerda en la sesión.
  - LinkedIn, ubicación, "Respuesta en menos de 24 h" y "Qué pasa después" en 3 pasos.
- **Formulario** (columna derecha):
  - Campos: nombre, email, "¿Qué necesitas?" (se preselecciona con `?need=qa|av|web|ia` desde los
    botones de servicio) y mensaje.
  - Debajo, **las reglas como tests en mono** ("nombre: no vacío · email: formato válido · mensaje:
    ≥ 10 caracteres"), que pasan de ○ a ✓ mientras escribes. El botón cambia de estado cuando las
    tres pasan.
- **Antispam sin fricción**:
  - hCaptcha solo se carga al primer foco o pulsación.
  - Hay una casilla trampa oculta (honeypot).
  - Si envías antes de 2,5 s desde que empezaste, responde "Un segundo… vuelve a pulsar Enviar".
  - Clarity enmascara el formulario.
- **Mensajes de estado** claros en español e inglés, y eventos de medición `contact_start`,
  `contact_sent` y `contact_error`.

### 404

- "404" enorme, "Esta página no pasó el *test*." y un texto con su voz: "Como buen QA, prefiero
  avisarte antes de que rompa algo".
- **Un informe de tests**:
  - Pasan `home.spec`, `nav.spec` y `contacto.spec`.
  - Falla `404.spec`: "/esta-ruta/ responde 200 · esperado 200 · recibido 404".
  - Resumen: "3 pasan · 1 falla · el resto de la web está bien".
- **Accesos** a las secciones principales.
- **Bilingüe con un solo archivo**: si la ruta empieza por `/en/`, cambia los textos con un JSON
  guardado en `data-en`.

### Versión en inglés

- Mismo diseño y textos adaptados, no traducidos palabra por palabra ("Images that stay with you",
  "Got a project in the works?").
- **Cambio de idioma**:
  - En la home, el enlace EN lleva a la misma sección (`/en/#que-hago`).
  - Guarda la posición de scroll en `sessionStorage` y la restaura al cargar.

## A8. Ingeniería invisible (lo que valora un jurado de desarrollo)

### Rendimiento (medido el 18 de noviembre, caché desactivada)

| Dispositivo | Página | FCP | LCP (elemento) | CLS | Peso | JS |
| --- | --- | --- | --- | --- | --- | --- |
| Escritorio | Inicio (con intro) | 1,14 s | 1,14 s (foto del hero) | 0 | 407 KB | 5 KB |
| Escritorio | Inicio | 0,82 s | 0,82 s (foto del hero) | 0 | 406 KB | 5 KB |
| Escritorio | Trabajo | 0,17 s | 0,26 s | 0 | 361 KB | 2 KB |
| Escritorio | Audiovisual | 0,27 s | 0,33 s | 0,03 | 588 KB | 2 KB |
| Escritorio | Sobre mí | 0,96 s | 1,14 s | 0 | 286 KB | 2 KB |
| Escritorio | Contacto | 0,18 s | 0,18 s (H1) | 0 | 182 KB | 5 KB |
| Móvil (CPU ×4, 4G lenta) | Inicio | 0,67 s | 0,84 s | 0 | 302 KB | 5 KB |
| Móvil | Audiovisual | 0,62 s | 1,68 s | 0 | 365 KB | 2 KB |
| Móvil | Contacto | 0,48 s | 0,48 s | 0,004 | 182 KB | 5 KB |

**Cómo lo consigue**:
- CSS inline (no hay petición de estilos que bloquee el pintado).
- Ningún framework de JavaScript.
- Precarga de la imagen LCP y de 2 de las 5 fuentes.
- `font-display: swap`, con métricas de fallback para Caveat.
- Imágenes en WebP con `srcset`.
- Vídeos que solo se descargan al pasar el ratón.
- Carruseles que solo corren cuando se ven.
- Prerender de las páginas enlazadas.
- Fuentes con caché inmutable de un año.

**Lo más pesado**: las fuentes (148–170 KB).

### Accesibilidad

- **Contraste AAA** en todo el texto (medido en A5).
- **Navegación**: enlace "Saltar al contenido" y foco visible en todo.
- **ARIA**:
  - `tablist` con teclado completo y `aria-pressed` en filtros, tema y modo revisión.
  - `aria-expanded` y `aria-controls` en el menú, y `aria-current` en la navegación.
  - `<dialog>` nativo con el foco devuelto al cerrar.
- **Contenido accesible**:
  - Textos alternativos descriptivos ("Fotograma del videoclip de Glaecy, con dirección de cámara de
    Eloi Cotonat").
  - Etiquetas en todos los campos y un comentario en el código que cita WCAG 2.5.3 ("el nombre del
    botón es lo que se lee en él").
- **Movimiento y lengua**: reduced motion en todo (incluidas la intro y la transición) y `lang`
  correcto en cada idioma.
- **Mejorable**: hay texto de 12–13 px (chips, etiquetas en mono) y en móvil el banner de cookies
  tapa cerca de un tercio de la pantalla hasta que decides.

### SEO y datos

- **Metadatos por página**:
  - Título del tipo "QA, automatización y vídeo en Barcelona · Eloi Cotonat" y descripción
    propia.
  - `canonical`, `hreflang` (es, en y x-default), Open Graph (1200 × 630) y Twitter card.
  - `color-scheme` y `theme-color` por tema.
- **JSON-LD**:
  - `Person`, con `knowsAbout`, `knowsLanguage`, `makesOffer`, `alumniOf` y `sameAs`.
  - `WebSite`, `ItemList`, `BreadcrumbList`, `ContactPage` y `BlogPosting`.
- **Archivos para buscadores**:
  - `sitemap-index.xml` con hreflang.
  - `robots.txt`, con un comentario que explica por qué los CV no se bloquean (para que el
    rastreador lea su `noindex`).
  - RSS, `site.webmanifest` y **`llms.txt`**: un resumen para asistentes de IA con servicios,
    proyectos, notas, contacto y "Precisiones".

### Seguridad y privacidad

- **CSP en `<meta>`**: el hash `sha256` de cada script y estilo inline, y solo los dominios que usa
  (hCaptcha, Web3Forms, Umami y Google, este solo tras el consentimiento).
- **Cabeceras**: HSTS, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, COOP `same-origin`,
  Permissions-Policy (sin cámara, micrófono, geolocalización, pago ni USB), `nosniff` y
  `Referrer-Policy`.
- **Consentimiento** según la guía de la AEPD:
  - Nada se descarga antes de aceptar.
  - Rechazar pesa lo mismo que aceptar.
  - La decisión se recuerda 12 meses y se puede cambiar desde el pie.
  - Al retirarla se borran las cookies y se recarga.
  - GA4 va en modo de consentimiento, con publicidad denegada y sin señales de Google.
- **Email**: guardado en base64 y al revés; en contacto, tras hCaptcha.

### Calidad

- **Suite propia** de 96 tests en 16 archivos (home, navegación, SEO, legibilidad, accesibilidad,
  contraste AAA, formulario, consentimiento, errores de consola…) que se ejecuta en GitHub Actions
  antes de cada publicación.
- Lo cuenta en la nota "Cómo se prueba sola esta web".

### Medición

- Eventos sin datos personales que se deducen del propio enlace: `cv_download`, `email_click`,
  `reel_play`, `path_cta`, `service_cta`, `social_click`, `qa_mode` y los del formulario.
- Se envían a todas las herramientas cargadas (Vercel, Umami y, si hay permiso, GA4 y Clarity).

## A9. Lectura con ojos de jurado

### Lo que el inspector de la skill marca en su home

Son reglas de la skill contra lo genérico, no de Awwwards, pero apuntan a lo mismo:

- 5 eyebrows sobre titulares y 9 microetiquetas en mayúsculas espaciadas.
- Mono fuera del código (Fira Code en chips, etiquetas y enlaces) y numeraciones decorativas
  (01–04).
- 16 sombras en reposo, 14 líneas finas, 11 cajas con contorno de 1 px y 2 filas de tarjetas
  idénticas con icono.
- 4 familias, 18 tamaños y 29 bloques de texto por debajo de 13 px.
- Sin punto focal dominante en la primera pantalla: el H1 mide 53 px (3,7 vw) y ninguna imagen
  ocupa un tercio de la pantalla.
- El titular se parte en 4 líneas a 390 px.

### Mi lectura por criterio de Awwwards

Es una estimación personal, no una nota oficial:

| Criterio (peso) | Fuerte | Le resta |
| --- | --- | --- |
| **Diseño (40 %)** | Sistema de color y tonos impecable, detalles de oficio (bordes de película, cinta, logo) y coherencia total entre páginas. | Densidad: demasiadas piezas por pantalla, letra pequeña, muchas familias y tamaños, y ninguna imagen o tipografía que mande en el primer pantallazo. |
| **Usabilidad (30 %)** | Sobresaliente: velocidad, accesibilidad AAA, teclado, móvil cuidado, caminos claros y formularios sin fricción. | El banner de cookies en móvil. |
| **Creatividad (20 %)** | Idea propia (QA + cámara), intro con significado, transición con dirección, modo revisión y 404 como test. | El registro visual es de "web de producto muy bien hecha", no de experiencia: no hay un momento visual que te deje sin palabras. |
| **Contenido (10 %)** | Textos con voz, honestos y concretos; `llms.txt`; notas propias. | Nada relevante. |

**Veredicto**: es una web excelente para conseguir clientes y que un jurado de desarrollo puntuaría
muy alto. Para un Site of the Day le faltaría una dirección de arte más rotunda (menos piezas, letra
más grande, un elemento que domine cada pantalla) y un momento visual memorable. Es justo el hueco
que puede ocupar tu portfolio.

---

# Parte B. Qué significa para tu portfolio

## B1. Cómo puntúa Awwwards

**Datos oficiales** (página de evaluación de Awwwards):
- **Criterios y pesos**: **Diseño 40 %**, **Usabilidad 30 %**, **Creatividad 20 %** y **Contenido
  10 %**.
- **Jurado**: al menos 18 miembros. Se descartan automáticamente las 3 notas más alejadas de la
  media y la votación dura 5 días.
- **Mención de Honor**: nota del jurado de 6,5 o más.
- **Site of the Day**: no hay umbral numérico publicado. Hace falta una nota alta del jurado y votos
  de usuarios PRO.
- **Developer Award**: los ganadores de Site of the Day pasan al jurado de desarrollo, y con más de
  7 reciben el premio. Sus guías para desarrolladores no están en esa página. Históricamente valoran
  semántica y SEO, animaciones y transiciones, accesibilidad, rendimiento (WPO), diseño responsive y
  marcado/metadatos.
- **Envío**: es de pago; comprueba la tarifa vigente antes de enviar.

**Lo que premia en la práctica** (síntesis propia de lo analizado en esta carpeta):
- Una idea clara que se reconoce en cada pantalla.
- Dirección de arte rotunda: tipografía grande, composición con aire y un elemento dominante por
  pantalla.
- Uno o dos momentos memorables (una transición, una pieza interactiva) mejor que veinte efectos.
- Fluidez sin tirones: 60 fps, nada de scroll secuestrado sin motivo.
- Móvil tan cuidado como escritorio.
- Cero errores: consola limpia, enlaces vivos, carga rápida.

**Lo que castiga**: plantillas reconocibles, cargadores largos, efectos que estorban la lectura,
móviles rotos y densidad (justo el punto débil de la web de Eloi).

## B2. Dónde se pisan tu `prototipo1` y su web

Esta es la parte más importante del informe: en dos semanas Eloi ha llegado, por su lado, a recursos
muy cercanos a los de tu propuesta.

| Pieza de Eloi | Pieza de `prototipo1` | Riesgo | Cómo diferenciarte |
| --- | --- | --- | --- |
| **Modo revisión**: marcas rojas a mano sobre la web, con el test que comprueba cada pieza, numeradas, con un panel y "Siguiente marca". | **Lente QA**: marcas y panel con comprobaciones calculadas en vivo. | **Alto**: la misma idea de fondo (la web enseña su QA encima de sí misma). | Lo que solo tiene la tuya: **calcula en vivo** y son **tres lentes de una herramienta de diseño y DevTools**. Que su estética sea de herramienta (insignias con el valor medido, "contraste 8,4:1", tiradores, reglas) y nunca de rotulador rojo. Sin numerar marcas ni nombrar archivos `.spec`, y sin nota adhesiva para activarla. |
| **Letra a mano (Caveat)** en notas, pies de foto, marcas y años. | **Architects Daughter** en las notas del boceto. | **Medio-alto**: dos webs de socios con notas a mano. | Limitar la mano a la intro y a la escena del boceto (trazos, sin texto manuscrito), o cambiar las notas por **rotulación técnica de plano**: cotas, flechas de medida y etiquetas en la sans de la marca. |
| **Subrayados y cajas de rotulador** (máscaras SVG permanentes). | **Trazos de lápiz** generados desde el DOM. | Medio | Los tuyos son **de construcción** (rectos, con cotas, cajas con tiradores) y **desaparecen al entintar**. Los suyos son decoración que se queda. Mantén esa diferencia y evita subrayados a mano en tus titulares. |
| **Grano de papel, copias con cinta y nota adhesiva.** | Lienzo gris liso con artboards blancos. | Bajo | No añadas grano, cinta ni polaroids: tu "papel" es el artboard digital. |
| **Intro claqueta** (visor, REC, iris). | **Intro del boceto a la tinta.** | Bajo | — |
| **Barrido con cabezal** y etiqueta con el nombre de la página. | **Zoom entre frames**, con el nombre del frame en la lente Diseño. | Medio-bajo: los dos "etiquetan" la página durante el cambio. | Que el nombre forme parte del artboard (como en Figma, encima del frame) y no flote como etiqueta durante la transición. |
| **"Esta web, como prueba"**: Lighthouse, tests y AAA en una sección. | Datos reales dentro de las lentes Código y QA. | Medio | No hagas una sección del tipo "esta web se prueba sola": que las cifras vivan dentro de las lentes, que es donde son tuyas. |
| **Formulario con reglas visibles que pasan a ✓.** | Contacto con comprobaciones en vivo. | Medio | Es un patrón común, pero el suyo usa mono y círculos de test. Dale tu lenguaje: las comprobaciones como validación de un componente (estado de campo, contador) o como el brief de un frame. |
| **404 como test que falla.** | No hay 404. | — | Haz la tuya con tu idioma: "Frame no encontrado" en el lienzo, con el resto de frames a la vista. |
| **Trayectoria 2018 → Hoy en el hero.** | — | Bajo | Si la añades, que sea de otra forma (por ejemplo, las versiones de Angular que has usado como "releases"). |
| **Pie como créditos de película.** | Pie como reverso del artboard. | Bajo | — |

**Conclusión**: tu concepto sigue siendo distinto (herramienta de diseño + DevTools frente a cámara
+ cuaderno), pero la capa de anotación a mano y la lente QA están demasiado cerca. Recomiendo:

1. Llevar la lente QA a una estética de herramienta con valores medidos.
2. Quitar o reducir al mínimo la letra manuscrita.
3. Mantener los trazos de lápiz solo como construcción efímera.

## B3. Métodos que sí puedes adoptar (sin su estética)

| Método | Cómo lo harías en tu web |
| --- | --- |
| Decidir tema e intro en un script inline del `<head>`, antes del primer pintado | Ya lo haces, con las mismas salidas (ancla en la URL, reduced motion y ahorro de datos). |
| Speculation Rules o precarga | Con `ClientRouter`, activa `prefetch` de Astro (al pasar el ratón o al verse el enlace). Si pasas a transiciones entre documentos, usa Speculation Rules como él. |
| Transición con dirección según el menú | Ya la tienes (`frames.ts`). |
| Sincronizar un elemento de la página con la transición (`startTime`) | Útil si añades algo propio durante el zoom (una regla, el nombre del frame, un minimapa). |
| Subrayado del menú compartido entre páginas | `transition:name` en Astro para que la marca del enlace activo se deslice. Cuesta poco. |
| Enlaces entre controles y visuales con `:has()` sin JS | Al pasar por un proyecto de la lista se ilumina su frame en el lienzo; al pasar por un botón de lente se previsualiza la capa. |
| Pausar animaciones fuera de pantalla | `data-anim-zone` + IntersectionObserver → `animation-play-state: paused`. |
| Marcas como máscaras SVG que cambian de color con el tema | Para tus trazos de lápiz, cotas y flechas de medida. |
| Hero que cabe en la pantalla con `vh` dentro del `clamp()` | `clamp(…, min(Xvw, Yvh), …)` en tu display. |
| `text-wrap: balance` / `pretty` | En titulares y párrafos. |
| Fallback de fuentes con `size-adjust` y `*-override` | Para Bricolage y la mono, y así evitar CLS. |
| Camino para reclutadores en el hero | "¿Buscas frontend? Stack, CV y disponibilidad →". |
| Disponibilidad con hora real | "Remoto · España (CET) · 17:55", sin ciudad, como decidiste. |
| `llms.txt` con "Precisiones" | Tus límites honestos: proyectos personales, sin clientes todavía, versiones de Angular reales… |
| JSON-LD completo | `Person` (`knowsAbout`, `sameAs`), `CreativeWork` o `SoftwareApplication` por proyecto y `BreadcrumbList`. |
| CSP con hashes y cabeceras de seguridad | En el build o en la configuración del hosting. |
| Medición sin cookies | Mejor solo Umami o Vercel Analytics y **sin banner**: más limpio y minimalista. |
| Formulario: casilla trampa, tiempo mínimo, verificación diferida y `?tipo=` | Con tus estados de campo; `?tipo=empleo` desde el botón de CV. |
| 404 bilingüe en un solo archivo | Técnica aprovechable; el contenido, tuyo. |
| Cambio de idioma que conserva la sección y el scroll | Encaja con tus i18n. |
| CTA fija en móvil tras el hero | "CV · Contacto". |
| Tests de Playwright en CI | Tienes `tests/`, pero el ejemplo es de la versión anterior y hay que rehacerlo. Cuéntalo dentro de la lente QA y en un caso, no como sección aparte. |

## B4. Lo que no se toca (la firma de Eloi)

- El lenguaje de cámara: visor, REC, código de tiempo, iris, flash, "24 fps · 4K", bordes "safety
  film", tira perforada, fotogramas numerados y créditos de película.
- El cuaderno: copias impresas con cinta, notas adhesivas, Caveat, recuadros rojos a mano, flechas
  de rotulador y grano de papel.
- El modo revisión tal como es: nota "N tests en verde", marcas numeradas con archivo `.spec` y
  "Siguiente marca".
- El cabezal de editor con etiqueta de página en la transición.
- "Rodado por mí. Probado por mí.", la 404 como informe de tests y el informe de Playwright como
  imagen de prueba.
- Los chips de servicio con un cuadrado de color y la paleta cobalto/ámbar/teal/ciruela.
- La tipografía Fraunces con cursivas de acento subrayadas.

## B5. Propuesta para nivel Awwwards

### 1. Concepto: afilar, no cambiar

**"Del lápiz azul a la tinta, sobre un lienzo"**. La prueba del competidor sigue funcionando: Eloi es
cámara y cuaderno; Vístalo, sastrería; tú eres **la herramienta**: lienzo, frames, capas, medidas e
inspección. Todo lo que añadas tiene que parecer sacado de Figma o de DevTools, no de un cuaderno.

### 2. Dirección de arte (objetivos medibles)

- **Tipografía**: 2 familias como máximo (Bricolage para todo; mono solo en código real). 5–6
  tamaños. Texto a 17–18 px o más. El display del hero puede llegar a 8–12 vw.
- **Color**: lienzo, papel, tinta y un único acento (el azul lápiz). Nada de un color por sección.
- **Densidad**: un elemento dominante por pantalla y aire alrededor. Sin eyebrows, numeraciones ni
  chips repartidos (justo lo que le resta a Eloi).
- **Imagen**: fragmentos reales de tus apps (ya los tienes), tus fotos (pendientes) y bocetos
  generados desde el DOM. Ninguna foto de banco.

### 3. Momentos firma (cuatro como máximo)

1. **Intro del boceto a la tinta** (existe):
   - Que dure 1,8 s como mucho, se salte con cualquier tecla y no retrase el LCP (el contenido real
     está debajo desde el principio; ya es así).
2. **El lienzo navegable** (nuevo; es el "wow" que te falta):
   - Con una tecla (por ejemplo, M) o el botón "Ver lienzo", la página se aleja hasta una vista con
     todos los frames de la web (Inicio, Proyectos, cada caso, Sobre mí, Contacto) colocados en el
     lienzo.
   - Se arrastra y se hace zoom con la rueda; al hacer clic en un frame, zoom de entrada y
     navegación con View Transitions.
   - Las miniaturas se generan en el build con Playwright: tu herramienta de QA hace de cámara.
   - Alternativas: una lista accesible y una rejilla en móvil.
   - Convierte el "zoom entre frames" en un modelo espacial real.
3. **Morph de proyecto**:
   - La tarjeta del proyecto se convierte en la cabecera del caso (`transition:name` por proyecto) y,
     al volver, regresa a su sitio. Es el gesto más valorado en portfolios premiados y tú ya tienes
     la base.
4. **Las tres lentes** (existe):
   - Estética de herramienta: insignias con valores medidos, tiradores, reglas y cotas.
   - En la lente Diseño, el cursor pasa a ser una cruceta con coordenadas.
   - Además, la **escena del boceto al producto** puede pasar a animaciones CSS ligadas al scroll
     (`animation-timeline: view()`), con la versión actual como alternativa.

### 4. Microinteracciones (pocas y finas)

- **Tarjetas**: al pasar el ratón aparecen tiradores de selección y la medida (W × H).
- **Enlaces**: el subrayado pasa de lápiz azul a tinta.
- **Copiar el email**: aviso "Copiado" con un check que se dibuja.
- **Botón de CV**: el icono de descarga se "imprime".
- **Tema oscuro como "mesa de luz"** (opcional): el lienzo se ilumina por detrás.
- **Nada de** cursor-burbuja, botones magnéticos ni inclinación 3D de tarjetas: son plantilla.

### 5. Contenido

- **Casos con la misma plantilla**: Problema → Boceto → Decisiones → Código (fragmento real) →
  Pruebas (qué probaste y cómo) → Resultado. Cada caso se abre como boceto y se entinta al hacer
  scroll.
- **Para reclutadores**: el camino en el hero, el CV en PDF y "qué busco", en tres líneas.
- **Datos honestos**: proyectos personales presentados como productos, sin clientes inventados, y
  "Precisiones" en `llms.txt`.
- **Notas** (opcional, suma en contenido y SEO): 2 o 3 artículos cortos sobre cómo construiste las
  lentes o los bocetos desde el DOM.

### 6. Excelencia técnica (pensando en el Developer Award)

| Métrica | Objetivo | Eloi |
| --- | --- | --- |
| JS por página | ≤ 30 KB comprimido (sin React si la página no lo necesita) | 2–5 KB externo + unos 20 KB inline (medido) |
| LCP en móvil (4G lenta, CPU ×4) | ≤ 1,5 s | 0,5–1,7 s (medido) |
| CLS | ≤ 0,02 | 0–0,03 (medido) |
| Contraste | AAA en texto | AAA (medido) |
| Lighthouse | 100 en accesibilidad, buenas prácticas y SEO; ≥ 95 en rendimiento | 96–100 (según su web) |
| Tests | Accesibilidad, enlaces, formulario, lentes y regresión visual | 96 E2E (según su web) |

**Además**: CSP, cabeceras, precarga, JSON-LD, sitemap con hreflang (ya lo tienes), `llms.txt`,
manifest, 404, reduced motion completo, teclado y foco visible.

### 7. Móvil (para optar a Mobile Excellence)

- Las lentes en una barra inferior al alcance del pulgar (ya están en la bandeja).
- El lienzo como rejilla con pellizco para hacer zoom.
- CTA fija tras el hero, menú a pantalla completa con transición y objetivos táctiles de 44 px o
  más.

### 8. Antes de enviarlo

- **Requisitos del sitio**: dominio propio, consola limpia, imagen OG, favicon, 404 y español e
  inglés.
- **Material del envío**: vídeo de 20–30 s con los momentos firma y capturas a 1440 px y en móvil.
- **Pruebas**: Chrome, Safari y Firefox, en iOS y Android; con reduced motion y con teclado.

## B6. Distancia entre `prototipo1` y ese nivel

| Área | `prototipo1` hoy | Lo que falta |
| --- | --- | --- |
| Concepto | Lienzo, lápiz azul, tres lentes, intro, zoom entre frames y escena del boceto al producto. | Separarse del lenguaje de Eloi (B2): lente QA de herramienta y menos letra a mano. |
| Tipografía | Bricolage + Architects Daughter + IBM Plex Mono. | Decidir si Architects Daughter sobra (choca con Caveat). |
| Contenido | Tempora, Vibora y Learnish con datos de ejemplo; Vístalo con capturas reales. | Tus fotos, tu CV y casos con proceso real (boceto, decisiones, código, pruebas). |
| Navegación | `ClientRouter` + frames con dirección. | Lienzo navegable, morph de proyecto, `prefetch` y subrayado del menú compartido. |
| SEO | `hreflang`, Open Graph, Twitter y sitemap. | JSON-LD, `llms.txt`, imagen OG propia y 404. |
| Seguridad | — | CSP y cabeceras. |
| Contacto | `mailto` o `fetch` según la variable de entorno. | Servicio de formulario, casilla trampa y tiempo mínimo. |
| Calidad | `astro check` y `build` correctos; inspector con 0 FAIL en la home. | Rehacer los tests de Playwright para la nueva web (lentes, formulario, accesibilidad). |
| Móvil | Lentes en la bandeja y escena apilada. | CTA fija y revisión de tamaños táctiles. |

## B7. Siguiente paso: qué componentes y animaciones buscar

Para la búsqueda que quieres hacer, esta es la lista de lo que encaja, dónde iría y con qué criterio
elegirlo.

| Qué buscar | Dónde iría | Qué tiene que cumplir | Qué evitar |
| --- | --- | --- | --- |
| Transiciones con zoom o escala y morph de elementos compartidos (View Transitions) | Toda la web y la tarjeta → caso | Nativas, con dirección y alternativa para reduced motion | Routers pesados (Barba + GSAP) si no hacen falta |
| Lienzo con arrastre y zoom (pan/zoom) y minimapa | Vista "Ver lienzo" | `transform` a 60 fps, teclado y lista alternativa | WebGL si no aporta |
| Trazos SVG que se dibujan (`stroke-dashoffset`) y "entintado" | Intro, escena y cabecera de cada caso | Coherente con tu lápiz azul y generado desde el DOM | Garabatos sueltos tipo cuaderno |
| Revelado de titulares por líneas | Hero y títulos de caso | Texto real accesible, sin librerías de pago | Letras que vuelan una a una |
| Animaciones ligadas al scroll (CSS scroll-driven) | Escena del boceto y casos | Sin secuestrar el scroll; alternativa sin soporte | Lenis o scroll suavizado si no aporta |
| Cursor contextual (cruceta con coordenadas) | Solo en la lente Diseño | Solo con puntero fino y desactivable | Cursor-burbuja en toda la web |
| Hover de selección (tiradores + medidas) | Tarjetas de proyecto | Lenguaje de herramienta de diseño | Inclinación 3D genérica |
| Microfeedback (copiado, enviado) | Email, formulario y CV | `aria-live` y check que se dibuja | Confeti |
| Wordmark grande con revelado | Pie (reverso del artboard) | Una vez, al llegar | Marquesinas infinitas |

**Fuentes ya analizadas en esta carpeta**:
- [scrolltide.md](scrolltide.md): catálogo de componentes.
- [framer-templates.md](framer-templates.md): Canvasfolio, con su lienzo y cajas de selección, es la
  referencia directa del lienzo navegable.
- [carter-ogunsola.md](carter-ogunsola.md): velo con borde ondulado y revelado sincronizado.

**Checklist para aceptar cualquier componente**:
1. ¿Cuenta tu idea (lienzo, lápiz, lentes) o es decoración?
2. ¿Se parece a algo de Eloi o de Vístalo (B4)?
3. ¿Se puede hacer nativo (CSS, View Transitions, scroll-driven) antes que con una librería?
4. ¿Cuánto JS añade? ¿Cabe en el presupuesto de 30 KB?
5. ¿Funciona con reduced motion, con teclado y en móvil?
6. ¿Provoca saltos de maquetación o retrasa el LCP?
7. ¿Qué licencia tiene?

---

# Anexos

## Anexo 1. Las 28 animaciones de su home

`heroIn` · `heroRule` · `pulse` · `hpPulse` · `hwsLine` (×2: horizontal y vertical en móvil) ·
`hwsOn` · `qaIn` · `qaPanelIn` · `vtWipe` · `vtWipeBack` · `vtHead` · `vtHeadBack` · `navLineIn` ·
`navLineOut` · `ckIn` · `introIris` · `introVf` · `recBlink` · `introNameIn` · `introRule` ·
`introFlash` · `introFade` · `wvIn` · `wvRow` · `vfDrift` · `vfFocus` · `vfBlink` · `gFill`.

## Anexo 2. Curvas y duraciones

| Curva | Usos | Para qué |
| --- | --- | --- |
| `cubic-bezier(.16, 1, .3, 1)` | 27 | Entradas, hovers, paneles (expo out) |
| `linear` | 15 | Bucles y progreso |
| `cubic-bezier(.6, 0, .3, 1)` | 4 | Transición entre páginas y subrayado del menú |
| `steps(2, end)` | 2 | Parpadeo de REC |
| `cubic-bezier(.34, 1.56, .64, 1)` / `(.34, 1.4, .5, 1)` | 2 | Muelle del logo |
| `cubic-bezier(.76, 0, .24, 1)` | 1 | Iris de la intro |
| `cubic-bezier(.65, 0, .35, 1)` | 1 | Línea de "Cómo empezamos" |
| `cubic-bezier(.3, 1.4, .4, 1)` | 1 | Enfoque del visor |

Duraciones más usadas: 0,25 s (21), 0,2 s (20), 0,3 s (12), 0,4 y 0,45 s (8 cada una), 0,5 s (6) y
0,36 s (5).

## Anexo 3. Fuentes

- Web analizada: https://www.eloicotonat.com/ (y `/llms.txt`, `/sitemap-0.xml`,
  `/site.webmanifest`).
- Criterios de evaluación de Awwwards: https://www.awwwards.com/about-evaluation/
- Developer Award de Awwwards: https://www.awwwards.com/developer-award
- Análisis anteriores de esta carpeta: [eloi-cotonat.md](eloi-cotonat.md),
  [vistalo.md](vistalo.md), [carter-ogunsola.md](carter-ogunsola.md),
  [framer-templates.md](framer-templates.md), [scrolltide.md](scrolltide.md),
  [ideas-portfolio.md](ideas-portfolio.md) y [concepto.md](concepto.md).
