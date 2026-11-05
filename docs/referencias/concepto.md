# Concepto de la propuesta (rama `prototipo1`)

Decidido el 5 de noviembre de 2026 a partir del cuestionario (ver [ideas-portfolio.md](ideas-portfolio.md))
y de las referencias de esta carpeta.

---

## 1. La idea en una frase

> En esta web, **la forma de trabajar de Christian —bocetar con lápiz azul, entintar en código y
> comprobar—** se convierte en **un lienzo de diseño: cada página es un artboard que se construye
> desde el boceto, se navega con zoom entre frames y se puede inspeccionar con tres lentes**.

- **Prueba del competidor**: Vístalo es la sastrería; Eloi, la cámara y los tests; Carter, un
  escritorio con datos en vivo. Nadie junta diseño + código + QA como modos de ver la misma web.
- **Lápiz azul**: los ilustradores bocetan con lápiz azul ("non-photo blue") y luego entintan en
  negro. Es el color de la marca y el del boceto; el negro es la "tinta" del producto final.

## 2. La pieza viva: tres lentes
Interruptor en la barra superior (abajo en móvil): **Diseño · Código · QA**. Sin lente activa la web
es limpia y minimalista; cada lente añade una capa calculada en el navegador, no inventada:
- **Diseño**: cajas de selección con tiradores sobre bloques e imágenes, medidas reales (ancho ×
  alto), espaciados entre secciones, tipografía real de cada titular (familia, tamaño, interlineado)
  y muestras de los colores de la página.
- **Código**: etiqueta semántica y componente de cada bloque (`<section> Hero`, `<nav>`, `<h1>`…) y
  un panel con datos reales de la página (nodos del DOM, peso de JS y CSS transferido, tiempo de
  carga).
- **QA**: comprobaciones reales de accesibilidad (texto alternativo, nombre accesible de enlaces y
  botones, orden de encabezados, contraste de cada texto, tamaño mínimo de objetivos táctiles,
  `lang`, etiquetas de formulario) con marcas en cada pieza y un resumen "N de N superadas".
- Teclado: 1, 2, 3 para cada lente y Esc para quitarla. Se recuerda en `localStorage`.

## 3. Intro: "del boceto a la web"
- Solo en la primera visita de la sesión; nunca con reduced motion, ahorro de datos o ancla en la
  URL; se salta con clic o tecla. Dura ≤ 2,4 s.
- El boceto se **genera a partir del layout real** del hero (posiciones medidas en el DOM): trazos de
  lápiz azul dibujan cajas, líneas de texto y el marco de la foto exactamente donde irán; después el
  contenido real se "entinta" en su sitio y aparece un check de QA. Funciona igual en cualquier
  tamaño de pantalla.

## 4. Transición: "zoom entre frames"
- Cada página es un artboard sobre el lienzo. Al navegar, el artboard actual se aleja (zoom out)
  hasta verse como un frame con su nombre, se desplaza, entra el siguiente frame y hace zoom in.
- Con dirección según el orden del menú (adelante: el nuevo entra por la derecha; atrás: por la
  izquierda). La barra superior no se mueve. ≤ 750 ms. Reduced motion: fundido simple.
- Inspiración: el velo de Carter (tapar, cambiar debajo, revelar coordinado) y la dirección de Eloi.

## 5. Escena de scroll: "del boceto al producto"
- Sección fijada en el inicio con una pantalla de **Tempora** (turnos de sanitarios) que pasa por
  tres estados al hacer scroll: **boceto** (lápiz azul y notas a mano) → **código** (se rellena con
  la interfaz real y aparece el fragmento de código del componente) → **QA** (aparecen las
  comprobaciones). A la izquierda, tres textos cortos explican cada paso.
- Reduced motion y móvil: los tres estados apilados, sin fijar.

## 6. Identidad nueva

| Elemento | Decisión |
| --- | --- |
| Marca | Cuadrado de selección (el "tirador" de las herramientas de diseño) en azul lápiz + "Christian Oller". |
| Tipografía | **Bricolage Grotesque** variable (titulares y texto, eje óptico); **Architects Daughter** solo para las notas del boceto; **IBM Plex Mono** solo para código real (lente Código y fragmentos). |
| Escala | 5 pasos: pequeño 14 px · texto 17–18 px · entrada 22–26 px · titular 36–56 px · display 56–112 px. |
| Colores (claro) | Lienzo `#E8E9EC` · papel `#FFFFFF` · tinta `#0E0F12` · gris `#575A61` · **azul lápiz `#2747F5`** (contraste 6,4:1 sobre blanco). |
| Colores (oscuro) | Lienzo `#0C0D10` · papel `#16171B` · tinta `#EEF0F3` · gris `#A4A8B0` · azul lápiz `#7D93FF`. |
| QA | Correcto `#0E9F6E` · aviso `#C77700` (solo en la lente QA). |
| Forma | Esquinas rectas en paneles y botones. Botón principal azul con texto blanco; secundario relleno gris claro (sin borde). |
| Movimiento | Intro, zoom entre frames, escena de scroll, entradas cortas, respuesta en controles. Todo con reduced motion. |

## 7. Estructura

- **Barra superior (sobre el lienzo)**: marca y nombre · Inicio, Proyectos, Sobre mí, Contacto ·
  lentes · ES/EN · tema · botón CV.
- **Inicio**: hero (nombre, "Frontend developer", frase, Ver proyectos + CV, "Disponible · remoto,
  España (CET)", retrato) → escena del boceto al producto → proyectos (4) → cómo trabajo y stack por
  lentes → contacto → pie como **reverso del artboard** (nombre a todo el ancho, enlaces, créditos).
- **Proyectos**: Tempora, Vibora, Learnish y Vístalo, cada uno con su frame y su página de detalle.
- **Sobre mí**: biografía, trayectoria (pendiente del CV), stack por lentes, idiomas, CV.
- **Contacto**: formulario que llega al email (servicio configurable por variable de entorno) con
  comprobaciones en vivo.

## 8. Tarjeta 3D
Se retira del inicio en esta propuesta: el concepto ya tiene tres piezas interactivas y la tarjeta
(three.js + rapier) añade peso y compite con la intro. El código sigue en `src/components/lanyard/`
por si se quiere recuperar (por ejemplo, como "acreditación" en Sobre mí).

## 9. Desviaciones de la hoja de la skill `design-taste-frontend`
Hoja repartida: dirección "The page is the object" (seed 1975741440). Se mantiene la dirección (el
artboard sobre el lienzo es el objeto) y se cambian, con motivo:
- Tipografía Bodoni Moda / Jost → pareja de moda y lujo que no encaja con un frontend.
- Paleta navy y rosa → el objeto tiene sus propios colores (lienzo gris, papel blanco, lápiz azul).
- Hero "tarjeta junto a la habitación" → necesita una foto de un espacio que no existe; el hero es
  el propio artboard.
- Índice en lomos de libro → pide 20–40 proyectos; hay 4.
- Cupón recortable → se parece demasiado al resguardo de Vístalo y de Carter.

## 10. Pendiente de Christian
Fotos (retrato y de trabajo), CV en PDF, detalles de Tempora / Vibora / Learnish (stack, año, su
papel, enlaces, capturas), email público, enlaces definitivos (LinkedIn, GitHub) y la clave del
servicio de formulario.

---

## 11. Estado de la implementación (5 nov 2026)

Construido en `prototipo1`:

| Pieza | Archivos |
| --- | --- |
| Tokens, tipografía, lentes (CSS), intro, transición | `src/styles/global.css` |
| Layout con lienzo y artboard, script del `<head>` (tema, lente, intro) | `src/layouts/Layout.astro` |
| Barra superior con lentes, idioma, tema y CV | `src/components/common/Header.astro`, `src/components/site/LensSwitch.astro` |
| Panel de la lente activa | `src/components/site/LensPanel.astro` |
| Pie como reverso del artboard | `src/components/common/Footer.astro` |
| Lógica de lentes (medidas, etiquetas, comprobaciones reales) | `src/scripts/lenses.ts` |
| Trazos a mano generados desde el DOM | `src/scripts/sketch.ts` |
| Intro del boceto a la web | `src/scripts/intro.ts` |
| Dirección del zoom entre frames | `src/scripts/frames.ts` |
| Escena del boceto al producto | `src/components/home/ProcessScene.astro`, `src/scripts/process.ts` |
| Inicio | `src/components/home/Hero.astro`, `ProjectStack.astro`, `ToolsByLens.astro`, `src/components/pages/HomePage.astro` |
| Fragmentos de interfaz de las apps (datos de ejemplo) | `src/components/ui/TemporaUI.astro`, `ViboraUI.astro`, `LearnishUI.astro`, `ProjectVisual.astro` |
| Proyectos (contenido ES/EN) | `src/content/projects/{es,en}/{tempora,vibora,learnish,vistalo}.md`, `src/content/config.ts` |
| Páginas | `ProjectsPage.astro`, `ProjectPage.astro`, `AboutPage.astro`, `ContactPage.astro` |
| Datos de contacto y CV | `src/data/site.ts` |

Comprobado:
- `astro check` sin errores; `astro build` correcto.
- Intro: el boceto se dibuja sobre la posición real del hero y se entinta (solo primera visita de
  la sesión; se salta con reduced motion, ahorro de datos, ancla o navegador automatizado).
- Lentes: Diseño (cajas y medidas reales, tipografía, colores), Código (etiquetas, nodos, KB de JS
  y CSS, tiempo de carga) y QA (135/135 comprobaciones en el inicio).
- Transición: `frame-out`/`frame-in` hacia delante y `frame-out-back`/`frame-in-back` hacia atrás,
  760 ms; la barra no se mueve.
- Inspector de la skill en el inicio: **0 FAIL** (avisos: sin vídeo, tipografía distinta de la
  hoja —cambio deliberado—, escena fijada larga).

Pendiente o conocido:
- Subpáginas: el inspector pide más imágenes (dependen de las fotos y capturas de Christian) y
  marca texto de 14 px en páginas con poco contenido (menú y botones pesan más que el texto).
- La tarjeta 3D no se usa en esta propuesta (los archivos siguen en `src/components/lanyard/`).
- CV: el botón aparece solo cuando exista `public/cv/christian-oller-cv.pdf`.
- Formulario: sin `PUBLIC_FORM_ENDPOINT` abre el correo con el mensaje escrito; con endpoint
  (Formspree, Web3Forms…) envía por `fetch`.
- Datos de ejemplo por confirmar: funciones de Vibora y Learnish, filas de la tabla de Tempora,
  nombres de los tests de la escena y que Tempora esté hecha en Angular (el fragmento de código lo
  da a entender).
