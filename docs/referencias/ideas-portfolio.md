# Ideas para el nuevo portfolio de Christian (rama `prototipo1`)

Documento vivo: se actualiza con las respuestas del cuestionario, las fotos y el CV.

---

## 1. Punto de partida

**Lo que pide Christian (5 nov 2026)**: un portfolio diferente, fresco, con novedades, moderno,
interactivo y que sorprenda, **sin perder el minimalismo** ("que no se vea la página cargada").
Después enviará fotos y su CV para integrarlos.

**Lo que ya existe en el proyecto**:
- Astro 5 + Tailwind 4 + islas de React, ES/EN (`src/i18n/ui.ts`), tema claro/oscuro.
- Tarjeta 3D colgante (react-three-fiber + rapier) con foto, nombre, roles y disponibilidad.
- Logo `<chris/>` con la barra en verde `#3d9a48`.
- `playwright.config.ts` y carpeta `tests/`.
- Formulario de contacto con Formspree sin configurar (`YOUR_FORM_ID`).

**Referencias analizadas**: [vistalo.md](vistalo.md) y [eloi-cotonat.md](eloi-cotonat.md).

---

## 2. Lo que se toma de cada referencia (como método)

| De Vístalo | De Eloi |
| --- | --- |
| La idea sale de la identidad (el traje sale del nombre). | La intro cuenta el oficio y sale una vez por sesión, con todas las salidas. |
| Una pieza interactiva con sentido por página (demo de dispositivos, firma, resguardo). | Transición con dirección según el menú y subrayado del menú compartido. |
| Transiciones nativas con elementos persistentes. | Speculation Rules: navegación instantánea. |
| Interacciones que demuestran el servicio en lugar de contarlo. | Camino directo para reclutadores, CV por perfil, casos NDA sin capturas. |
| Accesibilidad completa (reduced motion, teclado, pausa). | Hora local y disponibilidad en vivo; pie como créditos. |

**Lo que NO se toma**: la estética de ninguna de las dos (sastrería, cinta métrica, cámara, REC,
iris, panel de tests) ni sus tics (etiquetas mono por todas partes, numeraciones 01/02/03,
cajas con borde, cinco tipografías). Christian tiene que tener su propio lenguaje, distinto de la
web de su agencia y de la de su socio.

---

## 3. Inventario de lo que solo tiene Christian (borrador; completar con el CV)

- **Tres oficios en una persona**: diseña (Figma, Procreate), programa (Angular v8–v21, Astro,
  React, Next.js, WordPress, Tailwind) y prueba (Cypress, Jasmine, Postman). Vístalo lo resume así:
  "Escribe el código y dibuja cada pantalla. De la idea a la web terminada, sin pasarla de mano en
  mano."
- **Dibuja a mano** (Procreate): puede haber bocetos reales de sus proyectos.
- **Angular de la v8 a la v21**: muchas versiones de sí mismo (una trayectoria contable en releases).
- **Logo `<chris/>`**: una etiqueta de código que se cierra sola.
- **Tarjeta-acreditación 3D**: ya es una seña reconocible.
- **Cofundador de Vístalo** (2025) con Eloi Cotonat.
- Frase actual: "De la idea a un producto que funciona."
- Pendiente del cuestionario/CV: ciudad, empresas, años, proyectos reales, objetivo del portfolio.

---

## 4. Conceptos propuestos

### A. "Tres lentes" (propuesta de pieza central)
Un interruptor fijo con tres posiciones, **Diseño · Código · QA**, que cambia cómo se ve toda la
web sin cambiar el contenido:
- **Diseño**: aparece la capa de diseño: marcos de artboard con su nombre, medidas entre bloques,
  retícula, muestras de color y tipografía, anotaciones a mano.
- **Código**: cada bloque enseña su etiqueta (`<section>`, `<h1>`, `<nav>`), sus clases y su
  jerarquía, como un inspector.
- **QA**: cada pieza enseña sus comprobaciones (contraste, texto alternativo, tamaño táctil,
  enlaces) con un resumen calculado de verdad en el navegador, no inventado.
- Por defecto la web está limpia y minimalista; las capas solo aparecen si el visitante quiere.
- Teclado, `localStorage` para recordar la lente, control abajo en móvil.
- Prueba del competidor: Vístalo tiene la sastrería, Eloi la cámara y los tests; nadie junta
  diseño + código + QA así. Encaja con "Designer × Developer × QA".

### B. Intro "del boceto al producto"
- 2–2,5 s, solo la primera vez por sesión: un trazo a mano dibuja el boceto de la portada (cajas y
  garabatos), los trazos se convierten en la interfaz real y aparece un check "listo". Cuenta su
  proceso: diseñar → programar → probar.
- Alternativa: el logo `<chris/>` se escribe como código, "compila" y la barra se convierte en el
  cursor del titular.

### C. Transición "zoom entre frames"
- Cada página es un frame de un lienzo (como en Figma). Al navegar, la página actual se aleja hasta
  verse como un artboard con su nombre, se desplaza hasta el siguiente frame y entra con zoom.
- View Transitions nativas, dirección según el orden del menú y logo y menú persistentes.

### D. Proyectos "antes / después"
- Cada caso con un deslizador boceto ↔ diseño ↔ resultado (o una captura que se construye capa a
  capa al hacer scroll).
- Casos con NDA: contar el qué y el cómo sin capturas.

### E. Contacto "brief que pasa sus checks"
- El formulario es un brief con comprobaciones visibles que se encienden mientras escribes (email
  válido, mensaje con contenido, tipo de proyecto elegido); al enviar, "3/3 — enviado" con una
  microanimación.
- Alternativa: un comentario sobre un lienzo de diseño (pin con avatar e hilo).

---

## 5. Principios de diseño

- Una o dos familias tipográficas y escala cerrada (cinco tamaños como máximo), con mucho aire.
- Monocromo con un solo acento (posiblemente el verde del logo).
- Una pieza viva por página, no veinte.
- Movimiento con propósito: intro, transición, lentes y entradas cortas. Todo con reduced motion.
- Sin etiquetas mono repartidas por todas partes ni numeraciones decorativas.

---

## 6. Técnica prevista

- Astro + Tailwind 4 (se quedan), sin GSAP: CSS y JavaScript propio.
- View Transitions nativas (decidir si se sustituye `<ClientRouter />` por
  `@view-transition { navigation: auto; }`).
- Speculation Rules para precargar.
- Tarjeta 3D según la respuesta del cuestionario.
- Ampliar los tests de Playwright que ya existen.

---

## 7. Cuestionario (enviado el 5 nov 2026)

Preguntas: objetivo del portfolio, perfil que debe pesar más, ideas que le atraen, intro, tarjeta
3D, identidad (logo y color), nivel de sorpresa, páginas, proyectos reales, bocetos disponibles,
cómo recibir los mensajes, CV, papel de Vístalo, datos y enlaces, y qué evitar.

### Respuestas de Christian (5 nov 2026)

| Pregunta | Respuesta |
| --- | --- |
| Objetivo | **Que me contrate una empresa** (reclutadores y tech leads). |
| Faceta que pesa más | **Desarrollo frontend**. |
| Ideas que le atraen | **Tres lentes (Diseño, Código, QA)**, **Zoom entre frames**, **Boceto que se construye al hacer scroll**. |
| Intro | **Boceto que se convierte en web**. |
| Tarjeta 3D | Decide Claude. |
| Identidad | **Identidad nueva** (no conservar `<chris/>` ni el verde por obligación). |
| Nivel de sorpresa | **4 de 5**. |
| Páginas | Inicio, Proyectos, Sobre mí, Contacto. |
| Bocetos propios | **No tiene** → los bocetos se dibujan en código (SVG con trazo a mano). |
| Contacto | **Formulario que llegue a su email**. |
| CV | **Un CV en PDF**. |
| Vístalo | **Como un proyecto más**. |
| Ubicación | Córdoba (Andalucía), pero prefiere venderse **en remoto** (no destacar la ciudad). |

**Proyectos** (personales, todavía sin clientes):
- **TEMPORA**: app para sanitarios con turnos, registro de tiempo y tablas de trabajadores.
- **VIBORA**: app que gestiona reservas de pádel.
- **LEARNISH**: app para aprender inglés.
- **Vístalo**: la web de su agencia (la única web publicada que puede enseñar por ahora). Quiere
  hacer más webs con WordPress, Astro, etc.

**Referencias nuevas que le gustan** (analizadas en archivos propios de esta carpeta):
- Transición entre páginas de https://carterogunsola.com/about → [carter-ogunsola.md](carter-ogunsola.md)
- Webs e ideas de las plantillas de Framer → [framer-templates.md](framer-templates.md)
- Webs de https://www.scrolltide.co/#library y componentes de https://www.scrolltide.co/components
  → [scrolltide.md](scrolltide.md)

Pide expresamente guardar toda la información de inspiración en esta carpeta.

### Consecuencias para el diseño
- El público es **técnico y de selección** (reclutadores, tech leads): la primera pantalla debe decir
  en cinco segundos quién es, qué hace (frontend) y cómo contactarle o descargar el CV.
- El frontend manda: las piezas interactivas tienen que demostrar oficio de frontend (rendimiento,
  accesibilidad, estado, animación fina), no solo verse bonitas.
- Sin bocetos reales: el "boceto" se dibuja en SVG con un trazo a mano coherente en toda la web.
- Proyectos personales: presentarlos como productos (problema, solución, decisiones técnicas,
  pantallas dibujadas en código como fragmentos de interfaz reales), sin inventar clientes ni cifras.
- Remoto: "Disponible en remoto · España (CET)" en lugar de la ciudad.
