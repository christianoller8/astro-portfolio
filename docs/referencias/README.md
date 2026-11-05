# Referencias para el nuevo portfolio

Carpeta de consulta para la propuesta de la rama `prototipo1`. Aquí se guarda todo lo que se ha
analizado de otras webs y las ideas que salen de ese análisis, para poder revisarlo en cualquier
momento sin volver a navegar por ellas.

| Archivo | Qué contiene |
| --- | --- |
| [vistalo.md](vistalo.md) | Análisis completo de la web de Vístalo (vistalo-sl.vercel.app): idea, página a página, animaciones, transiciones, menú, contacto, técnica, accesibilidad y crítica. |
| [eloi-cotonat.md](eloi-cotonat.md) | Análisis completo de la web de Eloi Cotonat (eloicotonat.com): intro "claqueta", transiciones con dirección, secciones, páginas, técnica y crítica. |
| [carter-ogunsola.md](carter-ogunsola.md) | Carter Ogunsola (carterogunsola.com): su transición entre páginas (velo con borde ondulado, revelado sincronizado, odómetro), el about tipo HUD, lab y contacto. |
| [framer-templates.md](framer-templates.md) | Plantillas de portfolio de Framer: Canvasfolio (lienzo con cajas de selección), Wireframe (todo en boceto), Leporello, Departures, BadgeFolio, Tabfolio y patrones comunes. |
| [scrolltide.md](scrolltide.md) | Scrolltide: catálogo completo de componentes (botones, tarjetas, 3D, texto, fondos, loader), plantillas y secciones, y cuáles encajan. |
| [ideas-portfolio.md](ideas-portfolio.md) | Síntesis: qué tomar de cada web (como método, no como copia), respuestas del cuestionario, conceptos, principios de diseño y técnica. |
| [concepto.md](concepto.md) | La propuesta elegida para `prototipo1`: idea, identidad, estructura de páginas, piezas interactivas y técnica. |

## Cómo se hizo el análisis (5 de noviembre de 2026)

- Navegación real en el navegador integrado a 1440 × 900 (escritorio), con capturas en distintos
  puntos del scroll, hover y clics en el menú y los enlaces para ver las transiciones.
- Lectura del código que entrega cada web (scripts inline, CSS de `@keyframes`, reglas de
  `view-transition`, variables de color y tipografías cargadas) para entender cómo está hecho cada
  efecto, no solo cómo se ve.
- Medición con el inspector de la skill `design-taste-frontend` (Chrome sin interfaz a 1440, 768 y
  390 px). Las capturas están en `.taste-skill/ref-vistalo/` y `.taste-skill/ref-eloi/` (carpeta
  ignorada por git).

## Regla de uso

Las dos webs son de personas cercanas (la agencia de Christian y la web de su socio). El portfolio de
Christian tiene que distinguirse de ambas: se toman los métodos (una idea propia sacada de la
persona, una pieza interactiva con sentido por página, intro y transiciones con significado,
accesibilidad cuidada), nunca sus recursos visuales firmados (la sastrería de Vístalo, la cámara y
el panel de tests de Eloi).
