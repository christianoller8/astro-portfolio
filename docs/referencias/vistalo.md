# Vístalo — análisis de la web

- URL: https://vistalo-sl.vercel.app/
- Fecha del análisis: 5 de noviembre de 2026
- Cómo: navegación real a 1440 × 900, lectura del código servido e inspector a 1440 / 768 / 390 px
  (capturas en `.taste-skill/ref-vistalo/`).

---

## 1. Ficha rápida

| Campo | Dato |
| --- | --- |
| Qué es | Agencia creativa de dos personas para pequeños negocios: webs, fotos y vídeo, redes y Google. |
| Equipo | Christian Oller ("Programa · Diseña") y Eloi Cotonat ("Prueba · Graba"). En remoto, entre Cataluña y Andalucía. Fundada en 2025. |
| Lema | "Que se vea como es." |
| Stack | Astro 6.1.4. Sin librerías de animación (ni GSAP ni Lenis): CSS y JavaScript propio en scripts por componente. |
| Transiciones | View Transitions nativas entre documentos (`@view-transition { navigation: auto; }`). |
| Páginas | `/`, `/servicios` (+ `diseno-web`, `contenidos`, `marketing-digital`, `diseno-grafico`, `formacion`), `/proyectos`, `/nosotros`, `/contacto` (acepta `?pack=express|esencial|total`), legales. |
| Tipografías | Barlow Condensed 600/700/800 (titulares en mayúsculas), Instrument Serif normal y cursiva (palabras de acento en terracota), Inter 400–700 (texto), JetBrains Mono 400/500 (etiquetas), Fraunces 300/500, Covered By Your Grace (manuscrita). |
| Colores | Fondo oscuro `#0b0a09`; crema `#f4efe6`; superficies `#17140f`, `#141210`, `#120d0a`; acento terracota `#e4704b`. Las secciones alternan oscuro y crema. |
| Tema | Oscuro por defecto; interruptor claro/oscuro con animación (`html.theme-anim` 750 ms), guardado en `localStorage` (`vistalo-theme`). |
| Medidas (home) | 6,3 pantallas · 719 palabras · 14 imágenes · 55 encabezados · 31 tamaños de letra (10 → 360 px) · 5 familias en uso (Inter 44 %, JetBrains Mono 23 %, Barlow Condensed 22 %, Instrument Serif 9 %, Covered By Your Grace 2 %). |

---

## 2. La idea (lo mejor de la web)

El nombre lo decide todo. "Vístalo" junta *vista* (lo que se mira) y *vístelo* (ponle su mejor
traje). En `/nosotros` lo explican como una entrada de diccionario: "Vista·lo /bís·ta·lo/ ·
sustantivo + imperativo… Las dos cosas a la vez. Una promesa y una orden."

A partir de ahí, toda la web es una sastrería o tienda de ropa:

- Una **cinta métrica** hace de marquesina bajo el hero (los números de servicio son las marcas de
  la cinta).
- Los **packs son etiquetas de ropa** colgadas de una barra que se balancean: tallas S, M y L
  ("Rápido", "Casual", "De gala"), con código de barras y "Quiero este pack".
- El **proceso de trabajo se corta con tijeras** que avanzan por una línea discontinua al hacer
  scroll.
- El plan de mantenimiento se llama **Care / Care+**, como la etiqueta de cuidados de una prenda.
- El **contacto es una carta** sobre una mesa de sastre, con un **resguardo** "Nº 0427 · Guarda esta
  mitad" como el de una tintorería o un taller de arreglos.

Prueba del competidor: si pones el nombre de otra agencia, nada de esto funciona. Es una idea
propia. Lo que hay que aprender de aquí es el **método** (sacar el concepto de la identidad), no la
estética.

---

## 3. Inicio

### 3.1 Intro del logo
- El logo (la "V"/mariposa y el texto "Vístalo") se dibuja con trazo (`@keyframes
  animated-logo-draw`: `stroke-dashoffset` → 0) y después se rellena (`animated-logo-type`:
  `fill-opacity` → 1).
- Solo la primera vez por sesión (`sessionStorage['vistalo-intro-played']`). Vuelve a salir si
  recargas: lo detecta con `performance.getEntriesByType('navigation')[0].type === 'reload'`.
- Se decide antes del primer pintado con un script inline que pone `html.logo-seen`.

### 3.2 Hero (oscuro, dos columnas)
- Etiqueta mono: "( WEBS · FOTOS · REDES · GOOGLE )".
- Titular: "QUE SE VEA" en Barlow Condensed enorme + "como es." en Instrument Serif cursiva
  terracota, con **máquina de escribir**:
  - Escribe y borra varias frases (`data-frases` separadas por `|`).
  - Ritmo "humano": 70 ms por letra más una variación calculada con el código del carácter;
    espera 2,6 s al terminar una frase; borra a 36 ms por letra; 420 ms entre frases.
  - Botón de pausa con `aria-pressed` (cumple WCAG 2.2.2 para movimiento automático).
  - Se para cuando sale de pantalla (IntersectionObserver) y no se ejecuta con
    `prefers-reduced-motion`.
  - Subrayado dibujado a mano bajo la cursiva (`hm-draw`).
- Foto a la derecha (portátil y móvil con una web de ejemplo sobre una mesa) que entra con
  `hm-settle` (opacidad 0 y escala 1,05 → 1).
- CTA terracota "Ver lo que hacemos →" y enlace mono "O CUÉNTANOS TU PROYECTO →".
- Cabecera: "Hablemos →" (terracota), interruptor de tema y botón "MENÚ" ancho que se encoge al
  bajar (`expanded` mientras `scrollY < 40`).
- Marquesina inclinada tipo cinta métrica con los cinco servicios numerados.

### 3.3 "Cinco servicios. Uno o todos." (crema)
- Filas grandes: miniatura + nombre en condensada + frase + flecha.
- Hover: el nombre pasa a terracota, la miniatura se colorea y la flecha se desplaza.

### 3.4 "Dos personas. Trato directo." (oscuro)
- Texto y una "etiqueta de prenda" con "Vístalo · Cómo trabajamos" y tres principios.
- Dos polaroids en blanco y negro (Christian y Eloi) colgadas y unidas por una cinta métrica, con
  "Cataluña ⟷ Andalucía" escrito a mano.

### 3.5 "Tres packs. Elige tu talla." (crema)
- Barra de colgar con tres etiquetas (crema, terracota y negro) con tabla "Incluye" en puntos
  (●●○), código de barras y botón.
- Las etiquetas **se balancean con el scroll** (`[data-rack]` y `[data-swing]`: péndulo según la
  velocidad del scroll; desactivado con reduced motion).

### 3.6 "Proyectos de ejemplo." (oscuro)
- Tarjetas sobre papel cuadriculado con mini navegador (`casalola.ejemplo`, `hornosanjuan.ejemplo`),
  sello "EJEMPLO" y etiquetas.
- Tercera tarjeta "La tuya, a medida" con el dibujo lineal de una tienda que se traza solo
  (`hm-samples-draw`).
- Dicen con claridad que son negocios inventados.

### 3.7 "Cuéntanos. Sin rodeos." (oscuro)
- Sobre de papel kraft con una carta "Hola, equipo Vístalo," y un botón con flecha.
- Pastillas de pack (magnéticas) y enlaces a LinkedIn de los dos.

### 3.8 Pie
- "Que se vea como es." + columnas (Servicios, Vístalo, Síguenos).
- **Wordmark gigante "VÍSTALO." a todo el ancho** con el punto en terracota.
- Legales y "Volver arriba ↑".
- Botón flotante de contacto (icono de sobre) en el borde derecho que persiste entre páginas.

---

## 4. Servicios (`/servicios`)

### 4.1 Hero
- "LO QUE HACEMOS, a la vista." con foto cenital de escritorio que entra con fundido.
- Indicador "SCROLL" con una línea que crece (`svc-scroll`) y marquesina de subservicios.

### 4.2 Explorador fijado de cinco servicios (la pieza más ambiciosa)
- La sección mide unas 4,4 pantallas (3979 px) y su contenido queda **fijo** mientras el scroll
  vertical recorre cinco pestañas (`role="tablist"`, `role="tab"`, `role="tabpanel"`,
  `aria-selected` y `tabindex` gestionados).
- Izquierda: lista de servicios; el activo se rellena de terracota.
- Derecha: contador "01 / 05", barra segmentada que se llena (variable `--fill` por segmento),
  "Baja para el siguiente", flechas ↑ ↓, número fantasma gigante y **una escena ilustrada distinta
  por servicio**:
  - Contenidos: polaroids con cinta adhesiva y pie manuscrito "Horno San Juan ✓".
  - Formación: pizarra con **textura de tiza hecha con filtros SVG** (`feTurbulence` +
    `feDisplacementMap`) y el texto "Taller · martes 10 h / Fotos con el móvil / Responder reseñas /
    Publicar sin miedo / → ¡ya lo hago yo!".
- Clic en una pestaña: scroll suave hasta su tramo. Teclado: flechas, Inicio y Fin.
- En pantallas pequeñas o con reduced motion deja de fijarse y pasa a reproducción automática
  (`is-playing`, avanza con `animationend`).
- Se pausa fuera de pantalla (`is-live`).

### 4.3 Resto de la página
- Cinta métrica entre secciones y los mismos packs que en inicio.
- **"Tu web, siempre a punto." (Care / Care+)** con un fragmento de interfaz de verdad: monitor
  "tunegocio.com · EN LÍNEA · disponibilidad últimos 30 días" con barras verdes y una lista
  (Hosting, dominio y SSL — activo; Copia de seguridad — hoy 03:00; Actualizaciones de seguridad —
  al día; Cambios menores — incluidos; Soporte — por email). Un interruptor Care / Care+ activa
  ítems extra.
- Frase gigante de transición "¿Y cómo se hace, exactamente?" con las palabras subiendo una a una.
- **"Cuatro pasos. Cero sorpresas."**: unas tijeras recorren una línea discontinua al hacer scroll
  (variable `--p` de 0 a 1, clase `is-cutting` mientras hay scroll) y cada paso (Hablamos,
  Presupuesto, Producción, Entrega) se ilumina cuando pasan.
- "Otros servicios" y CTA final crema.

### 4.4 Efectos globales de `/servicios`
- **Banda de color de la cabecera**: la franja de la cabecera cambia de color según la sección que
  tiene debajo (crema u oscuro) y lo hace cortada justo en el borde de la sección (`--band-a`,
  `--band-b` y `--band-cut` calculados en `requestAnimationFrame`).
- **Titulares partidos en palabras** (`span.sw > span.swi` con índice `--wi`): cada palabra sube
  con un pequeño retraso al entrar en pantalla.
- **Cursor propio con texto**: un círculo que sigue al ratón con inercia (interpolación 0,22) y
  muestra el texto de `data-cursor` (por ejemplo "Ver"). Solo con ratón (`hover: hover` y
  `pointer: fine`).
- **Pastillas magnéticas**: se desplazan hacia el puntero (25 % en X, 35 % en Y).
- **Marquesinas que reaccionan al scroll**: su `playbackRate` cambia con la velocidad y la
  dirección del scroll (si subes, giran al revés).

### 4.5 Subpáginas de servicio
- `/servicios/diseno-web`: "Diseño web que trabaja."; móvil "9:41 Casa Lola" con reseñas y métrica
  de PageSpeed; filas "Cinco formas de ayudarte" con **vista previa flotante al pasar el ratón**
  (`data-float-rows`, `data-preview`); **demo "Una web, todas las pantallas"**: botones Escritorio
  1200 px / Tablet 768 px / Móvil 375 px que redimensionan una web de ejemplo dentro de un marco
  (`data-web-demo`, `data-device`, `data-width`). Enseña "responsive" sin explicarlo.
- `/servicios/contenidos`: chips de color tipo Pantone ("Casa Lola · Teja · 7580 C"), tarjeta de
  visita "85 × 55", ficha de Google "panadería cerca de mí — nº1, primero en el mapa".

---

## 5. Proyectos (`/proyectos`)

- Hero "LO QUE HEMOS HECHO, a la vista." con texto honesto (todavía no hay casos de clientes) y
  filtros en pastillas con contador (Todos 3, Diseño web 3, Contenidos 2, Marketing digital 1).
- **Galería horizontal guiada por el scroll vertical** (`[data-hs]`):
  - La sección se fija y la fila de tarjetas se mueve en horizontal mientras bajas. Su altura es
    el recorrido horizontal más el alto de la pantalla.
  - Movimiento suavizado con interpolación (valor actual → objetivo en `requestAnimationFrame`).
  - Barra de progreso inferior (`scaleX`) y clase `is-moved` al empezar.
  - Detalles finos: la rueda horizontal del trackpad se traduce a scroll vertical; las flechas
    ← → avanzan el 40 % del ancho; si un elemento enfocado queda fuera, la página salta para
    centrarlo; se desactiva en pantallas estrechas o verticales (media query `(min-width: 900px)
    and (min-aspect-ratio: 5/4) and (min-height: 540px)`) y se apila en vertical.
  - Al filtrar se lanza `hs:refresh`, que recalcula y vuelve al principio.
- Tarjetas: captura de la web en un marco, etiqueta ("PORTFOLIO", "MEDIO PROPIO"), título en
  condensada, dominio en mono, categorías en terracota, descripción y "VER EL PROYECTO →".
- Proyectos actuales: Portfolio Christian Oller (christianoller.dev), Portfolio Eloi Cotonat
  (eloicotonat.com) y Negocio Manual (negociomanual.com).
- Indicador "Baja para ver los proyectos →".

---

## 6. Contacto (`/contacto`) — la página más creativa

- **Fondo**: foto a pantalla completa de una mesa de sastre (tijeras, cinta métrica), fija.
- **La carta**: papel crema con membrete (logo + "Agencia creativa · webs, fotos y Google / En
  remoto · Cataluña y Andalucía").
  - **Fecha de hoy escrita en español** ("5 de noviembre de 2026").
  - Saludo formal tachado ("Muy señores míos:") y sustituido por otro manuscrito ("Hola, equipo
    Vístalo,").
  - Campos como líneas de carta: Asunto (casillas: Pack Rápido, Pack Casual, Pack De gala,
    Mantenimiento, Aún no lo sé, Un servicio suelto), De (email), Negocio, Teléfono, Mensaje
    (área de texto que crece sola), "Un saludo,", firma opcional y nombre.
- **Firma a pluma** en un `<canvas>`:
  - Grosor variable según la velocidad y el ángulo del trazo (como una plumilla a 45°).
  - Presión real si se usa lápiz óptico.
  - Tinta azul con pequeñas variaciones de tono por trazo (`hsl(228 49% ~32%)`).
  - Estado "tinta húmeda" mientras dibujas, botón "Borrar firma", nitidez con `devicePixelRatio` y
    redibujado al cambiar el tamaño de la ventana.
- **Resguardo en vivo** sujeto con un clip: Nº 0427, Trabajo (el negocio o el nombre que vas
  escribiendo), Asunto (la casilla marcada), Estado ("Escribiendo…" → "Lista para enviar" →
  "Enviada"), código de barras "*0427*" y "Guarda esta mitad". El pie de la carta dice "Una
  respuesta, sin newsletter · aún sin firmar" y cambia a "firmada" cuando firmas.
- `?pack=` en la URL marca la casilla correspondiente (los botones "Quiero este pack" llevan aquí).
- Validación con mensajes en el tono de la marca: "La carta está en blanco: cuéntanos algo.",
  "Falta un email válido para poder contestarte."
- Confirmación: "Gracias. Te contestamos pronto. Te escribirá una de las dos personas que verás en
  tu proyecto… Christian y Eloi", con "Escribir otra carta" y un sello con la fecha.

---

## 7. Nosotros (`/nosotros`)

- "Detrás de Vístalo hay dos": Christian ("Programa. Diseña. Escribe el código y dibuja cada
  pantalla. De la idea a la web terminada, sin pasarla de mano en mano.") y Eloi ("Prueba. Graba.
  Rompe la web antes de que lo haga un cliente y hace la foto y el vídeo que la hacen tuya.").
- Marquesina de valores: Código, Diseño, Pruebas, Foto, Vídeo, Sin humo, Sin ataduras, Cero
  intermediarios.
- Historia (2025 →): ya habían trabajado juntos en dos empresas antes de montar Vístalo.
- Etimología del nombre y misión "Que los negocios buenos se vean como son."
- Cursor con texto (`data-cursor`).

---

## 8. Transiciones entre páginas

- Nativas del navegador: `@view-transition { navigation: auto; }`.
- La página que sale **sube un 50 % y se oscurece** (`translateY(-50%)` + `brightness`); la nueva
  **entra desde abajo** (`translateY(100%)` y `scale(1.2)` → posición y escala normales).
  Duración 0,9 s con la curva `cubic-bezier(.25, .74, .22, .99)`.
- La barra superior, el botón de menú y el botón flotante tienen su propio `view-transition-name`
  con duración 0, así que no se mueven durante la transición.
- Los eventos `pageswap` y `pagereveal` ponen `html.vt-run` mientras dura, con un manejo de errores
  cuidadoso (`then(done, done)` y `catch` en `ready`, para que una transición saltada no deje
  errores sin capturar).
- Con `prefers-reduced-motion`: `@view-transition { navigation: none; }`.

---

## 9. Menú

- Pantalla completa con **columnas verticales tipo acordeón**: la activa se expande (oscura, con el
  nombre grande y un texto fantasma con contorno detrás) y enseña una foto de fondo; las demás son
  columnas crema con el nombre centrado. Al pasar el ratón por otra, se expande y cambia la foto.
- Cursor propio dentro del menú (`.ov-cursor`, interpolación 0,2).
- Accesible: Escape cierra y devuelve el foco al botón; `inert` y `aria-hidden` cuando está
  cerrado; bloquea el scroll del body.
- Las imágenes del menú se descodifican en `requestIdleCallback` para que el hover sea instantáneo.
- Pie del menú: LinkedIn de los dos y "En remoto · Cataluña y Andalucía".

---

## 10. Accesibilidad y rendimiento (lo que está bien hecho)

- `prefers-reduced-motion` respetado en todo: intro, máquina de escribir, explorador, rack, tijeras,
  cursor, marquesinas y transiciones.
- Pausa en el movimiento automático y pausas fuera de pantalla con IntersectionObserver.
- ARIA correcto en pestañas, menú y firma (el `aria-label` pasa a "Firma dibujada").
- Sin librerías pesadas: todo con CSS y JavaScript propio.

---

## 11. Lo que mejoraría (crítica honesta)

1. **Demasiadas tipografías**: cinco o seis familias (Barlow Condensed, Instrument Serif, Inter,
   JetBrains Mono, Fraunces y Covered By Your Grace). Con dos o tres mantendría el carácter.
2. **Escala tipográfica abierta**: 31 tamaños distintos en la home y 55 encabezados.
3. **Etiquetas mono repetidas**: "( SERVICIOS )", "( QUIÉNES SOMOS )", "O CUÉNTANOS TU PROYECTO →"…
   el recurso aparece en cada sección y pierde fuerza.
4. **Fallo en móvil (390 px)**: el subtítulo del logo "AGENCIA CREATIVA" queda cortado ("AGEN…")
   por el interruptor de tema.
5. **Proyectos inventados** (Casa Lola, Horno San Juan): están bien avisados, pero no son prueba
   real. Cuando haya clientes, sustituirlos.
6. **Densidad**: 6,3 pantallas en la home con muchas piezas distintas (marquesina, polaroids, rack,
   sobre…). Funciona para una agencia, pero un portfolio minimalista necesita menos piezas y más
   aire.

---

## 12. Qué se puede aprender para el portfolio (como método, no como copia)

- Sacar la idea de la identidad (como el traje de Vístalo sale del nombre).
- Una pieza interactiva con sentido por página (máquina de escribir con pausa, explorador fijado,
  demo de dispositivos, firma, resguardo).
- Transiciones nativas con elementos persistentes que no se mueven.
- Interacciones que demuestran el servicio en vez de contarlo (la demo de dispositivos).
- Accesibilidad completa: reduced motion, teclado, pausas.
- **No copiar** sus recursos visuales (cinta métrica, etiquetas, carta, tijeras, resguardo): son la
  firma de Vístalo y el portfolio de Christian tiene que distinguirse de la web de su agencia.
