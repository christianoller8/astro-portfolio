# Referencias para el nuevo portfolio

Carpeta de consulta para la propuesta de la rama `prototipo1`. Aquí se guarda todo lo que se ha
analizado de otras webs y las ideas que salen de ese análisis, para poder revisarlo en cualquier
momento sin volver a navegar por ellas.

| Archivo | Qué contiene |
| --- | --- |
| [vistalo.md](vistalo.md) | Análisis completo de la web de Vístalo (vistalo-sl.vercel.app): idea, página a página, animaciones, transiciones, menú, contacto, técnica, accesibilidad y crítica. |
| [informe-eloi-cotonat.md](informe-eloi-cotonat.md) | **Referencia vigente sobre Eloi (18 nov 2026)**: informe en profundidad de eloicotonat.com (estructura, colores, tipografía, movimiento con tiempos exactos, página a página, ingeniería, rendimiento medido), lectura con los criterios de Awwwards, choques con `prototipo1` y propuesta para llevar el portfolio a ese nivel, con la lista de componentes y animaciones que conviene buscar. |
| [eloi-cotonat.md](eloi-cotonat.md) | Instantánea del 5 nov 2026 de la web de Eloi (intro "claqueta", transiciones con dirección, secciones, técnica y crítica). Superada por el informe: la web ha cambiado desde entonces. |
| [carter-ogunsola.md](carter-ogunsola.md) | Carter Ogunsola (carterogunsola.com): su transición entre páginas (velo con borde ondulado, revelado sincronizado, odómetro), el about tipo HUD, lab y contacto. |
| [framer-templates.md](framer-templates.md) | Plantillas de portfolio de Framer: Canvasfolio (lienzo con cajas de selección), Wireframe (todo en boceto), Leporello, Departures, BadgeFolio, Tabfolio y patrones comunes. |
| [scrolltide.md](scrolltide.md) | Scrolltide: catálogo completo de componentes (botones, tarjetas, 3D, texto, fondos, loader), plantillas y secciones, y cuáles encajan. |
| [ideas-portfolio.md](ideas-portfolio.md) | Síntesis: qué tomar de cada web (como método, no como copia), respuestas del cuestionario, conceptos, principios de diseño y técnica. |
| [concepto.md](concepto.md) | La propuesta elegida para `prototipo1`: idea, identidad, estructura de páginas, piezas interactivas y técnica. |
| [roadmap-prototipo-def.md](roadmap-prototipo-def.md) | **Orden de trabajo de `prototipo-def`**: estado de cada etapa, lo que necesito de Christian y las tareas marcables de E0 a E5, la fase técnica y el lanzamiento. |
| [analisis-video-intro.md](analisis-video-intro.md) | Análisis fotograma a fotograma del vídeo de referencia de la intro (`docs/videos/animacion-entrada.mov`): secuencia medida, cómo está hecha, cómo se traduce a la intro de Christian y qué exige a la caricatura. |
| [plan-diseno-awwwards.md](plan-diseno-awwwards.md) | **Plan vigente (18 nov 2026) para la rama `prototipo-def`**, centrado solo en diseño y animación: diagnóstico de christianoller.dev y de `prototipo1`, tesis, dirección de arte (con los tonos y los dos modos de la web actual), sistema de movimiento con tiempos, página a página, móvil, decisiones abiertas y rúbrica "de 10". Sustituye a `concepto.md` donde se contradicen (por ejemplo, el lápiz pasa de azul a grafito y la tarjeta 3D se quita). |

## Cómo se hizo el análisis (5 de noviembre de 2026)

- Navegación real en el navegador integrado a 1440 × 900 (escritorio), con capturas en distintos
  puntos del scroll, hover y clics en el menú y los enlaces para ver las transiciones.
- Lectura del código que entrega cada web (scripts inline, CSS de `@keyframes`, reglas de
  `view-transition`, variables de color y tipografías cargadas) para entender cómo está hecho cada
  efecto, no solo cómo se ve.
- Medición con el inspector de la skill `design-taste-frontend` (Chrome sin interfaz a 1440, 768 y
  390 px). Las capturas están en `.taste-skill/ref-vistalo/` y `.taste-skill/ref-eloi/` (carpeta
  ignorada por git).

### Segunda pasada sobre la web de Eloi (18 de noviembre de 2026)

- Descarga y lectura del código de las 32 páginas del sitemap (CSS, scripts y módulos), capturas de
  cada estado interactivo con Chrome sin interfaz (intro fotograma a fotograma, transición a cámara
  lenta, modo revisión, pestañas, hovers, galería, móvil, tema claro y oscuro), medición de carga y
  de contraste, y criterios oficiales de Awwwards.
- Capturas y hojas de contactos en `.taste-skill/eloi-1118/` (ignorada por git). Los scripts que las
  generan están en `.taste-skill/eloi-1118/tools/`: `extract.mjs` y `cssfmt.mjs` (sacan y formatean
  CSS, scripts y estructura), `outline.py` (texto de cada página), `capture.mjs` (estados
  interactivos), `sheet.mjs` (hojas de contactos) y `perf.mjs` (FCP, LCP, CLS y peso). Usan la
  librería de Chrome de la skill (`scripts/lib/cdp.mjs`) y sirven para repetir el análisis con
  cualquier otra web de referencia.

## Transición con el personaje

- [transicion-personaje.md](transicion-personaje.md): la idea de Christian para el cambio de página
  (su personaje empuja o arrastra la página), el análisis de la referencia (huyml.co) y qué dibujos
  hacen falta.

## Regla de uso

Las dos webs son de personas cercanas (la agencia de Christian y la web de su socio). El portfolio de
Christian tiene que distinguirse de ambas: se toman los métodos (una idea propia sacada de la
persona, una pieza interactiva con sentido por página, intro y transiciones con significado,
accesibilidad cuidada), nunca sus recursos visuales firmados (la sastrería de Vístalo, la cámara y
el panel de tests de Eloi).
