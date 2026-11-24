# Portfolio de Christian Oller

Portfolio personal en Astro, en reconstrucción para llegar a nivel Awwwards. Este archivo es lo que
Claude necesita saber al abrir el proyecto en cualquier equipo. El detalle vive en `docs/referencias/`.

## Empieza por aquí

1. `docs/referencias/estado-actual.md`: dónde está el trabajo hoy y qué toca ahora.
2. `docs/referencias/roadmap-prototipo-def.md`: el orden de trabajo, con casillas y una tabla de
   estado. Es la fuente de verdad de lo hecho y lo pendiente.
3. `docs/referencias/plan-diseno-awwwards.md`: el plan de diseño y las decisiones (D1–D28). Donde
   contradiga a `concepto.md`, manda el plan.

## Cómo trabajamos (decisiones de Christian)

- **Idioma**: Christian escribe en español; se le responde siempre en español.
- **Rama**: se trabaja en `prototipo-def`. `main` es la web publicada (Vercel despliega
  christianoller.dev desde ella) y solo se actualiza cuando él lo pide: se avanza hasta
  `prototipo-def` con `git push origin prototipo-def:main`, sin forzar. Lo hizo por primera vez el
  20 nov de 2026.
- **Paso a paso**: un punto del roadmap por parada. Se hace, se enseña el resultado y se espera su
  visto bueno antes del siguiente. La casilla se marca cuando él lo aprueba.
- **Commits**: Claude hace `git add .` y `git commit` al terminar cada paso, sin preguntar ni
  ofrecerlo. **Push solo cuando él lo pide.** En su conexión, un push normal ha fallado con HTTP 408:
  usar `git -c http.postBuffer=157286400 push`.
- **Primero diseño, después técnica**: SEO, accesibilidad, formularios, cookies y rendimiento van en
  la fase técnica, cuando el diseño esté cerrado.
- **CSP**: vive en `vercel.json` (la simple, elegida el 23 nov: todo desde la propia web, guiones en
  línea permitidos, iframe solo de Vístalo). Cualquier cosa nueva de otro origen (un vídeo o una
  fuente de fuera) hay que añadirla ahí. Web3Forms ya está cableado y permitido (`api.web3forms.com`
  en `connect-src` y `form-action`); el formulario funciona en cuanto Christian define
  `PUBLIC_FORM_ENDPOINT` en Vercel. `tests/csp.spec.ts` detecta lo que se carga al abrir y recorrer
  las páginas y envía el formulario contra un endpoint simulado.
- **Credenciales**: Claude nunca escribe contraseñas, tokens ni códigos de un solo uso; las cuentas y
  los inicios de sesión los hace él.
- **Fotos**: integradas en la página (luz, sombra, fundidos). Nunca como rectángulos ni recortes
  pegados.
- **Textos**: todos los textos nuevos son provisionales; se revisan juntos al final.
- **Imágenes**: los originales que él da van en `docs/imgs/`; las piezas del personaje que se generen,
  también en `docs/imgs/avatar/`.
- **Notas**: lo que se aprende o se decide se apunta en `docs/referencias/`.
- **Recordatorio pendiente**: faltan las imágenes reales de Tempora, Vibora y Learnish (hoy son
  fragmentos de interfaz hechos en HTML). Recordárselo al tocar proyectos o cuando pregunte qué falta.

## Quién es

Christian Oller, software developer (Diseñador × Desarrollador × QA) y cofundador de Vístalo con Eloi
Cotonat. Sus proyectos: **Tempora, Víbora y Learnish son aplicaciones de escritorio con versión
responsive para móvil** (ninguna es una app de móvil, aunque el contenido aún marque dos con
`format: 'mobile'`, ver estado-actual); **Vístalo es la web de su agencia creativa** con Eloi
(webs, fotos, vídeo y Google para negocios pequeños), aún en construcción. Cuida mucho el detalle visual e itera el diseño a ojo; le gusta lo mínimo pero sorprendente.
La web de Eloi (eloicotonat.com) es referencia de oficio, pero **no se copia su firma**: ver la
sección B4 de `docs/referencias/informe-eloi-cotonat.md`.

## Arrancar el proyecto

- Node 22 y **pnpm** (`pnpm-lock.yaml`; con npm falla).
- `pnpm install` · `pnpm dev` (desarrollo) · `pnpm build` y `pnpm preview --port 4400` (lo construido).
- `pnpm astro check` antes de dar algo por bueno: tiene que dar 0 errores. También `pnpm lint`, sin
  ningún problema (revisa `src/` y `tests/`; lo compilado y `.taste-skill/` quedan fuera).
- `astro preview` sirve `dist/`: tras cambiar código hay que volver a construir para verlo.

## Mapa rápido

- `src/pages/` y `src/components/pages/`: las páginas (Inicio, Proyectos, casos, Sobre mí, Contacto, 404).
- `src/components/home/`: hero, proyectos que se tocan, "Cómo lo veo yo", capas 3D y trayectoria.
- `src/components/site/` y `src/components/common/`: barra, lentes, lienzo navegable, intro y pie.
  Las lentes y el lienzo se abren desde el bocadillo de la caricatura (`ViewBubble.astro`, D27), no
  desde la barra.
- `src/components/character/`, `src/scripts/character.ts`, `src/data/character-rig.ts`: el personaje
  articulado que mueve las páginas.
- `src/scripts/`: comportamiento (lentes, lienzo, transiciones, demos, capas 3D con three.js).
- `src/styles/`: `global.css` (tokens y base), `kit.css` (piezas de herramienta) y `lenses.css`.
- `src/i18n/ui.ts`: todos los textos, en español e inglés (las mismas claves en los dos).
- `src/data/`: trayectoria (del CV), contenido de los casos y datos del sitio.
- `src/content/projects/`: los cuatro proyectos, en `es/` y `en/`.

## Herramientas de revisión

- `.taste-skill/eloi-1118/tools/`: guiones que abren la web en Chrome y la miden o la fotografían
  (lentes, desbordes a seis anchos, inglés, microinteracciones, rúbrica…). Cada uno dice arriba cómo
  se usa. El primer argumento es la ruta a `scripts/lib/cdp.mjs` de la skill `design-taste-frontend`,
  que cambia de un equipo a otro.
- El resto de `.taste-skill/` (capturas) no está en git: se queda en cada equipo.
- Las miniaturas del lienzo (`public/canvas/`) se regeneran con `canvas-thumbs.mjs` y
  `canvas-thumbs-resize.cjs` cada vez que cambia el diseño de una página. En Windows, la ruta de
  `cdp.mjs` se pasa como URL de archivo (`file:///C:/…`); el recorte usa sharp.
- Las imágenes para compartir (`public/og/`, una por página e idioma) se regeneran con
  `og-images.mjs` cuando cambia la parte de arriba de una página. Usa Playwright (Edge si no hay
  Chromium) contra la web construida en el puerto 4400; no necesita `cdp.mjs`.
- **Solo en macOS**: `.taste-skill/recorte/person.swift` (máscara de persona con Vision) y los
  comandos `sips`. En Windows no existen; si hace falta recortar otra foto, buscar alternativa.
  La foto clara del hero ya no depende de ellos: `.taste-skill/recorte/luz-gris.cjs` la monta con
  sharp a partir de `card.jpg` y de su máscara guardada (`docs/imgs/card-mascara.png`).
- La textura de papel de la página (`public/textures/`) se genera con `.taste-skill/papel/papel.cjs`.
  La página se pinta con `--sheet-bg` (hoja con textura); `--paper` es solo para las piezas de encima.
