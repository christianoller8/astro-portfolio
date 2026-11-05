# Scrolltide — análisis (scrolltide.co)

- URLs que le gustan a Christian: https://www.scrolltide.co/#library (plantillas) y
  https://www.scrolltide.co/components (componentes).
- Fecha del análisis: 5 de noviembre de 2026.
- Qué es: una biblioteca de **prompts** para generar con IA (Claude, Cursor, v0) webs y piezas con
  movimiento "cinematográfico" (React, Vite, Next.js, Tailwind, Framer Motion, GSAP, Three.js,
  WebGL, shaders, Lenis). De pago (plan anual o vitalicio; al navegar salta un modal de suscripción,
  no se ha interactuado con él).
- Inventario: **139 plantillas** (hero sections, landing pages, portfolios, ecommerce, webs 3D,
  fondos), **73 componentes**, **55 shaders**, **22 secciones** y **14 pantallas de interfaz**.
- Su propio lema: "Ship websites that move like the tide… launch a site that doesn't look AI-made."

---

## 1. Componentes (catálogo completo con lo que hace cada uno)

### Botones
- **Ink Button**: botón de tinta negra húmeda; al alejar el puntero salen hilos que se estiran, se
  unen y se rompen; el botón tiembla y el puntero gotea.
- **Bonfire**: botón de mantener pulsado para confirmar; la página se quema desde el punto pulsado
  con llama aguamarina y se "cura" si sueltas.
- **Meniscus**: gota de vidrio líquido que se separa de su base y se funde con lo que toca
  (refracción, franjas de color).
- **Unfurl**: botón de pergamino que se enrolla, se escribe línea a línea y se sella con lacre.
- **Glow Ring Button**: píldora de navegación con un anillo iridiscente que orbita el icono.
- **Send Halo**: botón de enviar de un compositor de IA; el halo se ilumina a medida que el campo
  se llena (el control avisa de que está listo antes de llegar a él).
- **Eye Button**: píldora con ojos saltones que siguen al puntero y parpadean.
- **Liquid Glass Button**: píldora de vidrio que difumina y curva lo que tiene detrás, con brillos
  que siguen al puntero; todo con propiedades CSS registradas, sin JS por fotograma.

### Tarjetas y listas
- **Tear Ticket**: billete de tren cuyo resguardo se arranca agujero a agujero; el trozo suelto se
  aleja revoloteando y se reimprime.
- **Fan Deck**: abanico de cartas desde una bisagra inferior (una sola rotación sobre un pivote).
- **Spotlight Carousel**: fotos enmarcadas en fila; la central se abre y **recorta** de nuevo (no
  se estira).
- **Expanded Cards**: tiras altas; la que pasas se ensancha a tarjeta completa y aparta a las
  vecinas; el pie se maqueta una sola vez al ancho abierto para que el texto no salte.
- **Fan Carousel**, **Arc Carousel**, **Halo Carousel**, **Layer Carousel**, **Grow Carousel**,
  **Quote Deck**, **Story Deck**, **Photo Stack**, **Orbit Gallery**, **Overlap Reel**,
  **Post Carousel**: variaciones de carruseles con profundidad, desenfoque y arrastre.
- **Card Folder**: tarjeta-carpeta cuya pestaña baja al pasar y deja ver un degradado iridiscente
  con un objeto recortado que asoma.
- **Card Bookmark**: tarjeta-marcapáginas cuya imagen florece en color al pasar.
- **Showcase Card**: tarjeta de proyecto que se abre en un resumen de caso (visión general, chips y
  descripción que se enfocan desde un desenfoque).
- **Hover List**: lista grande de servicios; la fila que pasas se oscurece, se abre con su
  descripción y su imagen entra girando hasta quedar ligeramente inclinada.
- **Scroll Index**: índice de proyectos guiado por scroll: cada proyecto ocupa la pantalla con su
  imagen a sangre y su nombre enorme en el centro, con una tira de miniaturas que marca dónde
  estás.
- **Clothes Line**: fotos colgadas con pinzas de una cuerda que pasa; cada tarjeta es un péndulo
  (el "rack" de Vístalo es este tipo de pieza).
- **Parallax Row**: tira de marcos de distintos formatos con la imagen desplazándose dentro de cada
  marco según su profundidad; clic para visor a pantalla completa.
- **Hover Tabs**: lista de servicios junto a una imagen; la fila activa se convierte en una pestaña
  del color del marco que se une a él con esquinas cóncavas.
- **Service Cards**: tarjetas que pasan de tres columnas a una sin breakpoints.
- **Zoom Reveal**: una píldora de vídeo entre dos palabras que se abre a pantalla completa al hacer
  scroll mientras las palabras salen por los lados.
- **Media Folder**: carpeta de escritorio que suelta ventanas arrastrables con imágenes, vídeo o
  audio.
- **Reveal Gallery**: tarjetas sobre un titular enorme; al pasar, otra imagen rompe a través con
  uno de cinco efectos y la página se tiñe.
- **Team Roster**: lista de equipo; al pasar un nombre, sus letras ruedan una a una y el retrato
  cambia con una cortina.
- **Step Accordion**: "cómo funciona" en acordeón con una imagen que se desliza junto al paso
  abierto y se transforma en el siguiente.
- **Step Path**: pasos unidos por una línea discontinua que se dibuja al entrar en pantalla, cada
  paso aparece cuando llega la línea y un tramo más oscuro sigue viajando.
- **Contour Reveal**: las imágenes ceden pasando por un **dibujo de sí mismas** (curvas de nivel) y
  la siguiente aparece como escarcha antes de llenarse de color.
- **Elastic Frame**: marco redondeado dibujado como una cuerda elástica que se "pulsa" al acercar
  el puntero.

### 3D
- **Arc Wave** (retratos en el interior de un tambor que gira), **Pleated Strip** (columna de
  pósters unidos por pliegues de papel enrollada en un tambor), **Scroll Key** (tecla de cristal que
  gira bajo el cursor y se pulsa), **Particle Globe** (continentes de puntos), **Carousel Ring**
  (52 páginas como un rolodex), **Media Gallery** (anillo que rodea al visitante), **Circular
  Slider**, **Tilt Carousel**, **Reel Slider**, **Image Tunnel** (pasillo 3D infinito con CSS),
  **Block Field** (bloques isométricos que ondulan como agua bajo el puntero), **Wave Gallery**,
  **Spiral Slider**, **DNA Carousel**, **Scroll 3D Slider**, **Depth Carousel**.

### Texto
- **Focus Reveal**: las palabras están desenfocadas hasta que un **marco de enfoque tipo cámara**
  viaja hasta ellas y las enfoca, estirándose al tamaño de cada palabra (mide cada caja, sirve para
  cualquier tipografía).
- **Particle Text**: palabra hecha de miles de puntos que el puntero aparta y vuelven.
- **Petal Dissolve**: palabra que se deshace en pétalos y se reconstruye rebobinando.
- **Grid Warp**: palabra vista a través de una cuadrícula que el puntero arrastra y cizalla.

### Fondos
- **Mesh Flow**: retícula de puntos casi invisible que el puntero curva como una lámina de goma
  (Canvas 2D, una gaussiana, sin shader).
- **Image Trail**, **Mosaic Trail**, **Dither Lens**, **Ember Carve**, **Noise Blobs**, **Fluted
  Glass**, **Light Cove**, **Marble Scroll**.

### Loader
- **Intro Loader**: intro de carga: una frase se construye palabra a palabra, da paso al logo,
  suben tarjetas con imágenes por los dos lados y la pantalla se abre sobre la página. Dos
  secuencias y se elimina sola al terminar.

---

## 2. Plantillas, shaders, secciones y pantallas
- **Plantillas destacadas**: Odaline, Marea, mobula, Parrot, Synapse (3D), Nightjar, Lacuna, Otis
  (gratis), Fabrica (3D), ARÊTE (3D), Ondine, VALMORA, Whisker Ops, SELENE (gratis), NAÏADE
  (gratis), Cortex, UPDRAFT, Earshot, Ora, Zephyr, Toucan, Macaw, Pouterby, ODDBALL, Firnlight,
  Vesper (3D), Cold Club, VIVANT, Gummy Grove (3D).
- **Shaders**: remolinos (Tide, Rose, Mono, Citrus), mallas de degradado (Noir, Mint, Sunset,
  Ocean, Neon, Indigo…), semitono (Halftone Tide/Sun/Mono/Forest/Cyan) y llamas.
- **Secciones**: pies (Sienna Bridge, Cosmos Dusk, Portfolio Close, **Wordmark Bleed** —el nombre a
  sangre—, Loom Footer…), CTA, features (Service Bento, Render Grid, Ledger Bento, Lime Metrics),
  contacto (Studio Enquiry, Contact Column, **Signal Form**, Route Booking) y precios.
- **Pantallas de interfaz**: dashboards de comercio, propiedades, roadmap, carteras, banca,
  directorio de personas, salud, ventas… ("datos con forma real, estados reales").

---

## 3. Qué tomar para el portfolio de Christian
- **Focus Reveal** → encaja con la lente "Diseño": un marco de selección que viaja y "enfoca" las
  palabras clave del titular (en lugar de un marco de cámara, una caja de selección con tiradores).
- **Step Path** → para "Sobre mí" (trayectoria Angular v8 → v21) o el proceso: línea que se dibuja
  y une hitos.
- **Contour Reveal** → la idea de que una imagen "pasa por su dibujo" es justo el concepto boceto →
  producto. Se puede hacer con SVG: las capturas de las apps aparecen primero como contorno y se
  rellenan.
- **Scroll Index** → para Proyectos: cada app ocupa la pantalla con su nombre enorme y una tira de
  miniaturas de posición (alternativa a la galería horizontal de Vístalo).
- **Expanded Cards** / **Hover List** → lista de proyectos que se abre al pasar.
- **Send Halo** → el botón de enviar del contacto se ilumina cuando el formulario está listo
  (encaja con "contacto con checks").
- **Mesh Flow** → retícula de puntos que reacciona al puntero para el "lienzo" de la lente Diseño.
- **Wordmark Bleed** → cierre con el nombre a todo el ancho.
- **Intro Loader** → estructura de intro en dos secuencias que se elimina sola.

## 4. Qué evitar
- Efectos de "demo técnica" sin relación con el contenido (llamas, ojos saltones, pétalos): para
  un reclutador frontend sirven solo si demuestran oficio y no estorban.
- Shaders de degradado de moda (mallas pastel): genéricos y pesados.
- Cargar WebGL en todas partes: el rendimiento es parte del mensaje de un frontend.
