# Eloi Cotonat — análisis de la web

- URL: https://www.eloicotonat.com/
- Fecha del análisis: 5 de noviembre de 2026
- Cómo: navegación en el navegador integrado, lectura del código servido (scripts inline,
  `@keyframes`, reglas de `view-transition`, variables CSS) e inspector a 1440 / 768 / 390 px
  (capturas en `.taste-skill/ref-eloi/`).

---

## 1. Ficha rápida

| Campo | Dato |
| --- | --- |
| Qué es | Portfolio personal de Eloi Cotonat (Barcelona y remoto): QA y automatización de pruebas, vídeo y foto para artistas, diseño web y automatización con IA. Cofundador de Vístalo. |
| Lema | "Software que te deja dormir. Imágenes que no se olvidan." y "El ojo que encuentra el bug es el mismo que encuentra el plano." |
| Stack | Astro, scripts inline con su hash en la CSP, sin librerías de animación. View Transitions nativas. Speculation Rules para precargar páginas. Suite Playwright E2E en CI (78 tests en 15 archivos). |
| Páginas | `/`, `/trabajo/`, `/audiovisual/`, `/servicios/` (+ `qa-automatizacion`, `video-y-foto`, `diseno-web`, `automatizacion-ia`), `/notas/` (blog con RSS), `/sobre-mi/`, `/contacto/`, `/proyectos/negocio-manual/`, `/proyectos/seo-manual/`, `/proyectos/qa-suite-e2e-ci/`, `/en/`, tres CV en PDF y legales. |
| Tipografías | Outfit (titulares y texto, variable 100–900), Fraunces (serif; la cursiva marca las palabras de acento con subrayado de color) y Fira Code (mono: etiquetas, tests, código de tiempo). |
| Colores (oscuro) | Fondo `#0d0f17` (azul tinta), superficie `#161822`, texto `#f2f4f8`, acento lavanda `#99b1ff`, lila `#d9b1fc`, ámbar `#fbb36a`, verde agua `#68dfc3`, éxito `#74dca8`. Tokens "cine": `--cine-bg #0b0d14`, `--cine-cream #eee5d3`. Tiene también tema claro. |
| Idiomas | ES · CA · EN (la web en ES y EN). |
| Medidas (home) | 4,4 pantallas · 586 palabras · 13 imágenes · 13 encabezados · 14 tamaños de letra · 3 familias (Outfit 60 %, Fira Code 32 %, Fraunces 8 %) · cuerpo de 15 px. |

---

## 2. La idea

Perfil doble: **QA + cámara**. La web habla dos lenguajes y los cruza constantemente:

- El de la **cámara**: visor, "REC" parpadeando, código de tiempo a 24 fotogramas por segundo,
  iris del objetivo, claqueta, fotogramas y créditos de película en el pie.
- El del **QA**: informe de tests, pipeline "Code → E2E → CI → Deploy", puntuaciones de Lighthouse
  y "esta web se prueba sola".

La frase "El ojo que encuentra el bug es el mismo que encuentra el plano" une las dos mitades. Es
una idea propia: no sirve para ningún otro QA ni para ningún otro cámara.

---

## 3. Animación de entrada ("claqueta")

### Cuándo sale
- Solo en la **primera carga de la sesión**, si la URL no lleva ancla, si no hay
  `prefers-reduced-motion` y si no está activado el ahorro de datos (`navigator.connection.saveData`).
- Se decide en un script inline del `<head>` **antes del primer pintado** (pone `html.has-intro` y
  guarda `sessionStorage['introDone']`), así no hay parpadeo.

### Secuencia (≈ 2,55 s; todo CSS salvo el código de tiempo)
1. **Visor de cámara**: marcas en las esquinas, "REC" parpadeando (`recBlink`) y el visor que
   aparece (`introVf`).
2. **Código de tiempo** corriendo a 24 fps en JavaScript: `00:00:SS:FF`.
3. **Nombre** "Eloi Cotonat" (con "Cotonat" en cursiva de color) que se revela con `clip-path`
   (`introNameIn`), una línea que se dibuja debajo (`introRule`) y el subtítulo
   "QA · VÍDEO · WEB · IA".
4. **Flash** de cámara (`introFlash`, opacidad hasta 0,32).
5. **Iris**: un círculo se cierra (`clip-path: circle(0% at 50% 46%)`) y deja ver la web debajo
   (`introIris`).
6. Se **retira del DOM** al terminar.

Después, el hero entra con `heroIn` (sube 14 px con fundido) y `heroRule`.

---

## 4. Transiciones entre páginas ("cabezal" de montaje)

- View Transitions nativas. La página nueva entra con un **barrido** (`clip-path: inset()` de
  izquierda a derecha, 0,36 s, `cubic-bezier(.6, 0, .3, 1)`) mientras una **línea vertical** (el
  cabezal de un editor de vídeo) cruza la pantalla pegada al borde del barrido. Para que no se
  despegue, sincronizan el `startTime` de la animación del cabezal con el de
  `::view-transition-new(root)`.
- **Con dirección**: cada página tiene un orden según el menú (Inicio, Trabajo, Audiovisual,
  Servicios, Notas, Sobre mí, Contacto; las subpáginas cuentan como "más adentro"). Si vas a una
  página posterior, el barrido va hacia delante; si vas a una anterior o vuelves con el historial,
  va hacia atrás (`vtWipeBack`, `vtHeadBack`). El origen lo sacan de la Navigation API
  (`navigation.activation.from`) o del `referrer`.
- **Subrayado del menú compartido**: la línea del enlace activo tiene
  `view-transition-name: nav-line`, así que se desliza de un enlace a otro al cambiar de página
  (`navLineIn` / `navLineOut`).
- La barra superior persiste (`view-transition-name: topnav`, 0,3 s).
- **Speculation Rules** (`prerender`, eagerness `moderate`, todas las rutas internas salvo PDF y
  descargas): las páginas ya están cargadas al hacer clic y la transición parece instantánea.
- Reduced motion: sin barrido ni cabezal.

---

## 5. Home, sección a sección

1. **Barra superior**: logo "E" con punto naranja, enlaces, EN, tema y "Hablemos ↗". Pasa a
   `scrolled` al bajar 8 px. **Barra de progreso de lectura** arriba (`scaleX`, no `width`).
2. **Hero**:
   - Chips de servicio con color (QA azul, vídeo naranja, web verde, IA lila).
   - Titular en Fraunces 600 con las cursivas subrayadas en color ("te deja dormir." en azul,
     "no se olvidan." en ámbar).
   - Texto: "Soy Eloi Cotonat. Automatizo pruebas, ruedo para artistas y construyo webs rápidas…".
   - Botones "Hablemos ↗" (relleno lavanda) y "Ver trabajo ↓".
   - **Camino para reclutadores**: "¿Contratas QA? Trayectoria, stack y CV →".
   - **Chip en vivo** "Disponible · Barcelona 07:33 HORA LOCAL" con la hora real
     (`Intl.DateTimeFormat`, zona `Europe/Madrid`, se actualiza justo al cambiar de minuto).
   - Foto recortada en blanco y negro sobre un círculo azul.
3. **Línea de tiempo** 2018 → 2022 → 2024 → Hoy con iconos y una línea que se dibuja con un color
   por tramo (`hwsLine`, `hwsOn`).
4. **"He trabajado y rodado para"**: Accenture, Vall d'Hebron (VHIR), Stockagile, Parc Sanitari SJD |
   Glaecy, MR.RPM, Supergatos (tecnología en blanco y audiovisual en ámbar).
5. **"Varios servicios, un mismo estándar"**: lista de cuatro servicios a la izquierda (pestañas,
   `data-wid`) y un panel a la derecha que cambia según el servicio:
   - QA: **informe de tests de su propia web** ("tests/e2e · informe 78 ✓": `home.spec`,
     `seo.spec`, `legibilidad.spec`, `contact.spec`, `a11y.spec`) + "78 tests · 15 archivos · móvil y
     escritorio, en cada publicación" + "Cómo se prueba esta web →".
   - Vídeo: visor "REC @elhoyfoto · calle B/N 01/05 00:00:00:00" (carrusel de fotos con código de
     tiempo).
   - Web: puntuaciones de Lighthouse en móvil (93 / 100 / 100 / 100), "SEO Manual · medido el 6 oct
     2026".
   - IA: flujo de ejemplo "Llega un email → La IA lo clasifica → Prepara un borrador → Tú lo
     revisas y envías".
6. **"Trabajo seleccionado"**: tarjetas con marco de navegador (negociomanual.com,
   seo.negociomanual.com); tarjeta de QA con el pipeline "Code → E2E → CI → Deploy" y sus checks
   animados (`plWire`, `plOk`); tarjeta audiovisual con fotogramas y botón de play.
7. **"De tu mensaje a la entrega, sin sorpresas"**: cuatro pasos con iconos y línea; chips "Sin
   permanencia · Precio cerrado antes de empezar · Barcelona y remoto · ES · CA · EN".
8. **Pie**: "¿Tienes un proyecto entre manos? Hablemos ↗" en grande; **créditos de película**
   ("Dirección y cámara: Eloi Cotonat / Pruebas: 78 tests E2E / Hecho con: Astro y Playwright /
   Desde: Barcelona"); disponibilidad con hora local; columnas (Páginas, Servicios, Últimas notas,
   CV en PDF ×3, En otros sitios) y "↑ Arriba".

---

## 6. Otras páginas

- **/trabajo/**: "Webs, QA y audiovisual, caso a caso". Cifras (2 webs propias, 3 equipos de QA,
  4 proyectos audiovisuales, 78 tests en esta web). **Casos bajo confidencialidad sin capturas**:
  "Trabajo interno de cada empresa: no publico capturas, sí lo que hice y con qué" (buen recurso
  para trabajos con NDA). Cierre "Rodado por mí. Probado por mí." con Lighthouse 96–98 / 100 / 100.
- **/audiovisual/**: "Cámara, foto y vídeo para artistas y creadores". Reel con REC y código de
  tiempo; filtros por tipo (Todo 17, Videoclip 2, Directo 4, Cámara 4, Foto 7); **vídeos que se
  reproducen al pasar el ratón** y con sonido al hacer clic; lightbox propio con anterior/siguiente;
  enlaces a YouTube.
- **/servicios/** y subpáginas: "¿Esto te suena?" (problemas del cliente), qué incluye, qué
  entrego y cómo trabajamos (diagnóstico, plan, automatización…).
- **/notas/**: blog con RSS, tiempo de lectura y etiquetas. Artículos reales: por qué tu web tarda
  tres segundos, qué automatizar y qué no, cómo se prueba sola esta web, Cypress o Playwright,
  checklist para rodar un directo.
- **/sobre-mi/**: "IT de profesión, cámara de toda la vida". Datos rápidos (Base, Experiencia,
  En QA, Idiomas), **tres CV según lo que busques** (QA, audiovisual, marketing y web), **"La
  historia en cuatro actos"** (Acto I 2016 delante de la cámara… Acto IV 2024 detrás de la cámara)
  y "Qué gana tu proyecto con un perfil dual".
- **/contacto/**: email protegido (guardado en base64 al revés y que solo se enseña tras pasar
  hCaptcha: "Comprueba que eres una persona y te lo enseño"), botón de copiar con confirmación,
  "Qué pasa después" en tres pasos, y un formulario con **las reglas de validación visibles en
  mono** ("nombre: no vacío · email: formato válido · mensaje: ≥ 10 caracteres"), como si fueran
  tests. La verificación anti-bots aparece al empezar a escribir.

---

## 7. Detalles técnicos finos

- Animaciones pausadas fuera de pantalla con `[data-anim-zone]` → clase `is-off` (margen de 160 px).
- Variable `--nav-h` con la altura real de la barra para que las anclas aterricen justo debajo.
- Reveal global: `.reveal` → `is-visible` (umbral 0,04).
- Eventos de conversión sin cookies (Vercel Analytics / Umami) deducidos del propio enlace:
  `cv_download`, `email_click`, `reel_play`, `path_cta`, `service_cta`, `social_click`.
- Datos estructurados schema.org (Person, WebSite, ItemList).
- La propia web pasa una suite Playwright en GitHub Actions antes de publicar (contacto, navegación,
  SEO, legibilidad, contraste AAA con axe-core y errores de consola).

---

## 8. Lo que mejoraría (crítica honesta)

1. **Densidad**: muchas cajas con borde, chips, etiquetas mono, numeración 01–04 y fondo de
   cuadrícula. Se ve "cargada", justo lo que Christian quiere evitar.
2. **Hero con demasiadas piezas**: cuatro chips + titular + texto + dos botones + enlace + chip de
   hora compitiendo a la vez.
3. **Texto pequeño**: cuerpo a 15 px y 14 tamaños de letra distintos.
4. **Intro en móvil**: tapa el titular unos 2,5 s (aceptable porque solo sale una vez por sesión).

---

## 9. Qué se puede aprender para el portfolio (como método, no como copia)

- Una intro que cuenta quién eres (el visor y la claqueta son su oficio), corta, una vez por sesión
  y con todas las salidas (reduced motion, ahorro de datos, ancla en la URL).
- Transiciones con dirección según el orden del menú y subrayado del menú compartido entre páginas.
- Precarga con Speculation Rules.
- Hora local en vivo y disponibilidad.
- Un camino directo para reclutadores y CV por perfil.
- Casos bajo NDA contados sin capturas.
- El pie como créditos (cierre con personalidad).
- **No copiar** el lenguaje de cámara (visor, REC, iris, código de tiempo) ni el panel "esta web se
  prueba sola": son la firma de Eloi. Christian necesita su propio lenguaje.
