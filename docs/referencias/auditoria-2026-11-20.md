# Auditoría de christianoller.dev — 20 de noviembre de 2026

La web publicada está sana en lo estructural: cero errores de consola en 32 páginas, cero desbordes en
17 páginas por 8 anchos, foco de teclado visible en todo, buen contraste del texto principal y menos de
500 KB por página. Lo urgente está en otro sitio: **el contacto** (el formulario no da señales y sus
errores no se anuncian), **el dominio que declara la web** (apunta al que no es), **la imagen para redes**
(7,6 MB), **el repositorio público** (CV con datos personales y CI en rojo) y una docena de fallos de
accesibilidad que se arreglan sin tocar el diseño.

Hallazgos: 6 de gravedad alta, 24 media y 27 baja (los repetidos entre revisiones se han juntado).

## Lo primero

Arreglos que no necesitan ninguna decisión de Christian, por orden:

- [ ] **Dominio canónico**: poner `site: 'https://www.christianoller.dev'` en `astro.config.mjs:5`. Corrige de
  golpe canonical, `og:url`, hreflang, sitemap y `robots.txt`.
- [ ] **Imagen para redes**: una propia de 1200 × 630 px y menos de 300 KB, con `og:image:alt` y medidas.
- [ ] **CI**: pasar `.github/workflows/playwright.yml` a ejecución manual hasta reescribir los tests.
- [ ] **Formulario, sin servicio todavía**: aviso tras el `mailto:` ("si no se abrió tu correo, escríbeme a…" con
  el botón de copiar) y errores por campo accesibles.
- [ ] **Accesibilidad sin decisiones**: contrastes, bordes de los campos, foco del menú de móvil y del lienzo, 404
  en inglés, espaciado de texto y nombre de ES/EN (detalle en su tabla).
- [ ] **Rendimiento**: diferir las imágenes del personaje, no ocultar la primera pantalla hasta el JS, caché larga
  de la textura (`vercel.json`, junto con las cabeceras de seguridad) y quitar las fuentes sin uso.
- [ ] **Diseño sin decisiones**: H1 de Contacto a la escala, decisiones a 3 columnas solo desde 900 px y la fecha
  de la demo de Tempora.

## Decisiones que le tocan a Christian

| Decisión | Opciones | Recomendación |
|---|---|---|
| Servicio del formulario | Formspree, Web3Forms u otro (necesita su cuenta) | El que no exija captcha; con él, el aviso de privacidad |
| El CV en el repositorio | Quitarlo y reescribir el historial (push forzado, irreversible) · hacer el repositorio privado | Hablarlo antes de tocar nada |
| Material interno público | Dejar `docs/`, `CLAUDE.md` y los scripts sobre la web de Eloi a la vista · sacarlos del repositorio | Sacar al menos el análisis de la web de Eloi |
| La caricatura en móvil | Esconderla al bajar y mostrarla al subir · que solo asome por el borde | Esconderla al bajar |
| La intro | En cada carga (ahora) · solo en la primera visita · con pista "toca para saltar" | Primera visita y pista |
| Atajos 1/2/3/M | Globales (ahora) · solo con el bocadillo abierto · un ajuste para apagarlos | Ajuste para apagarlos (WCAG 2.1.4) |
| Densidad tipográfica (pendiente desde antes) | Aceptar 3–5 tamaños por pantalla · recortar a 2 + display | Recortar solo la primera pantalla de Sobre mí |
| Chips negros de las decisiones | Mantener · llevar el dato al título o al cuerpo | Quitarlos: son etiquetas sobre un título |
| Textos repetidos | Reescribir los 14 sitios con "boceto, diseño, código y pruebas" | Empezar por el pie, que sale en todas las páginas |

Anotado sin proponer cambio: el revisor de diseño marcó que el retrato del hero en modo claro se lee como
un rectángulo oscuro, contra la regla de `CLAUDE.md` ("fotos nunca como rectángulos"). Christian lo
eligió y aprobó así el mismo día.

## Hallazgos por área

### Contacto

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Alta | Sin cliente de correo, al pulsar "Enviar mensaje" no pasa nada visible: sigue "Listo para enviar" | `ContactPage.astro` ~752 solo hace `location.href = mailto:` | Servicio de envío; mientras, aviso con el correo y "Copiar" |
| Alta | Con datos inválidos solo se mueve el foco: 0 `aria-invalid`, 0 `role="alert"`, sin marca de obligatorio; la lista de comprobaciones cambia una clase y no su texto (WCAG 3.3.1, 3.3.3, 4.1.3) | `ContactPage.astro:742` | Mensaje por campo con `aria-describedby` y resumen en `role="alert"` |
| Media | No hay aviso de privacidad ni legal (no es asesoría legal) | 0 menciones en `/`, `/about/`, `/contact/` | Añadirlo al conectar el formulario |
| Baja | El correo va en claro en 18 enlaces `mailto:` (spam) | Pie y Contacto | Gmail filtra bien; revisar si molesta |

### SEO y metadatos

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Alta | Canonical, `og:url`, `twitter:url`, hreflang, las 16 URLs del sitemap y `robots.txt` apuntan a `christianoller.dev`, que responde 308 a `www` | `astro.config.mjs:5`; comprobado en vivo | `site` con `www` |
| Alta | `og:image` y `twitter:image`: `profile.jpg` de 7 608 001 B, 1856 × 2304, en realidad un PNG con extensión `.jpg` | `Layout.astro:17` | Imagen propia 1200 × 630, < 300 KB |
| Media | URLs duplicadas: `/about` y `/about/` dan 200; el menú enlaza sin barra y el resto con barra; el hreflang inglés de la home es `/en` y su canonical `/en/` | Rastreo en vivo | `trailingSlash` igual en Astro y Vercel |
| Media | Faltan JSON-LD, `apple-touch-icon.png`, `favicon.ico`, `manifest.webmanifest`, `llms.txt` y `security.txt`; las etiquetas de Twitter usan `property=` en vez de `name=` | 404 en vivo | Añadirlos |
| Baja | Dos `<h1>` en el HTML de la home: el segundo es el de la maqueta "Norte" (inerte para lectores de pantalla, visible para buscadores); dos en la 404 | `Hero.astro:90`, `ViewScene.astro:87` | Convertir el de la maqueta en párrafo |
| Baja | La 404 declara canonical y hreflang hacia `/404/`; el selector de idioma de `/sistema/`, `/personaje/` y la 404 lleva a rutas `/en/` que no existen | Rastreo | Sin canonical en la 404; ocultar el selector ahí |
| Baja | `/sistema/` y `/personaje/` están publicadas (200, con noindex) sin enlace | Rastreo | Quitarlas de la build o dejarlas así |

### Accesibilidad (WCAG 2.2 AA)

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Media | Bordes de los campos 2,03:1 en claro y 1,58:1 en oscuro; foco solo con un borde de 1 px (1.4.11) | Contacto | Borde ≥ 3:1 y `outline` de 2 px |
| Media | Con el menú de móvil abierto, Tab sigue por el contenido tapado (2.4.3) | 390 px | `inert` en `main` y pie; foco atrapado |
| Media | El lienzo es `aria-modal` pero Tab sale a la barra de detrás; con Esc el foco no vuelve al bocadillo (2.4.3, 4.1.2) | Lienzo (M) | Bucle de foco y devolverlo al cerrar |
| Media | Atajos de una tecla (1/2/3/M) globales sin forma de apagarlos (2.1.4) | Todas las páginas | Ver decisiones |
| Media | La 404 en inglés deja en español el enlace de salto, "Menú", "Idioma", "Tema" y el `aside` (3.1.2) | `/en/zzz/` | Re-etiquetar por script o 404 por idioma |
| Media | Contraste: "Hazme clic" 4,29:1 (claro) y 4,17:1 (oscuro); "3 / 3" en verde 2,94:1; números de las capas 3,89:1; pasos inactivos de la escena de la home 1,6–2,8:1 (1.4.3) | `ViewBubble.astro`, `AboutPage.astro:613`, `LayerStack.astro` (`opacity .55`), `.vs-step-*` (`opacity .32`) | Oscurecer y quitar opacidades |
| Media | Con el espaciado de texto aumentado, "Escríbeme" pierde la última letra a 1440 px y "Christian Oll" queda cortado a 390 px (1.4.12) | `.artboard` recorta en horizontal | `overflow-wrap` en h1 y h2 |
| Media | Animaciones sin pausa: punto de estado (pulso infinito), parpadeo de la caricatura, capas 3D en oscilación continua (2.2.2) | `Hero.astro:393`, `ViewBubble.astro:561`, `layer-stack.ts:307` | Que paren a los 5 s o fuera de pantalla |
| Baja | ES/EN: el nombre accesible ("Cambiar a inglés") no contiene la etiqueta visible (2.5.3) | `LangSwitch.astro` | Incluir "EN"/"ES" en el nombre |
| Baja | Capas 3D: `role="img"` enfocable con las instrucciones ocultas (4.1.2) | `LayerStack.astro` | Rol y ayuda accesibles |
| Baja | Demos: el foco cae a `body` tras "Pendiente" (Tempora) y "Confirmar" (Vibora); sin región `aria-live` (2.4.3, 4.1.3) | `project-demos.ts` | Devolver el foco y anunciar el cambio |
| Baja | Siete "Lo que hice N" con nombres repetidos a 390 px (2.4.6) | Sobre mí | Nombrar con la empresa |
| Baja | Por verificar: elementos a opacidad 0 al llegar con Tab antes de revelarse; el bocadillo recortado unos 5 s a 320 px en `/en/` | Transitorios | — |

### Rendimiento

Medido en el sitio publicado, mediana de 3 cargas, móvil lento (CPU 4×, 4G lenta) y escritorio sin límite.

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Media | Unas 20 imágenes del personaje de la transición (~100 KB, 22 % de los bytes) se descargan en cada página, varias a 0 × 0 | `Pusher` | Cargarlas al empezar la primera transición |
| Media | Móvil: LCP 3,15 s en Contacto, 3,55 s en Sobre mí y 3,86 s en Vístalo; TBT 416 ms en la home. En Contacto el LCP es el h1, oculto hasta que el JS lo revela | Medidas en vivo | Revelar con JS solo lo que está por debajo de la primera pantalla |
| Baja | Bricolage variable: 129 KB con todos los ejes en cada página | Fuentes | Limitar los ejes |
| Baja | `@fontsource/inter` y `@fontsource/playfair-display` instaladas y sin uso | `package.json` | Quitarlas |
| Baja | `/textures/*`, `/canvas/*` y el favicon con `max-age=0`; la textura es el LCP de Proyectos en escritorio | Cabeceras en vivo | Caché larga en `vercel.json` |

### Usabilidad y robustez

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Media | La caricatura fija tapa contenido en móvil: a 390 px toca renglones en todas las páginas (17 en Inicio) y botones o campos en 3–4 posiciones de scroll; tapa celdas de la demo de Vibora | Capturas de las revisiones de diseño y usabilidad | Ver decisiones |
| Media | Sin JavaScript, en móvil el botón de menú no hace nada y la navegación está oculta | `javaScriptEnabled: false` | Navegación visible por defecto; el JS la pliega |
| Media | Lentes y lienzo solo se descubren por el bocadillo (pista de 5 s) o por teclas que en móvil no existen | Prueba heurística | Una entrada fija en el pie o en el menú |
| Baja | La intro sale en cada recarga: 3,3 s en escritorio y 5,2–5,6 s en móvil lento; se salta con un clic pero nada lo dice. Los comentarios del código hablan de "primera visita" | `intro.ts`, `IntroScreen.astro` | Ver decisiones |
| Baja | Una lente puesta sigue puesta al recargar, sin aviso | `lens` en `localStorage` | Avisar o restablecer en visita nueva |

### Diseño

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Media | H1 de Contacto fuera de escala: 244,8 px frente a 127,4 px del display, con tracking −0,06 em; letras que se tocan | `/contact/` a 1440 px | `.t-display` |
| Media | Llamadas incoherentes al mismo destino: "Ver proyecto →" (enlace de 26 px, Inicio) y "Ver caso →" (botón de 48 px, Proyectos); "Copiar" en dos tamaños en Contacto | Inicio, Proyectos, Contacto | Unificar texto y forma |
| Media | Chips negros tipo eyebrow: `.bento-note` encima del título de cada decisión y `.decision-note` debajo del cuerpo en el caso; la pestaña "Pruébalo" en Inicio es de la misma familia | `ProjectBento.astro:163-168`, `ProjectPage.astro:448-455` | Ver decisiones |
| Media | A 768 px las decisiones van en 3 columnas de 14–16 caracteres por renglón | `ProjectBento.astro:183` | 3 columnas desde 900 px |
| Media | Densidad: 34 de 52 pantallas a 1440 px y 41 de 59 a 390 px tienen más de 2 tamaños además del display; la peor, la primera de Sobre mí (14, 16, 18, 22 y 32 px) | Medido por pantalla | Ver decisiones |
| Baja | 28 de 80 textos largos a 390 px acaban con una palabra sola | Todo el texto corrido | `text-wrap: pretty` |
| Baja | Colores fuera de tokens (tres paneles de código casi iguales, el `#8f8f8f` del hero) y tamaños fuera de escala (16, 15, 13, 12 px) | `src/components` | Pasarlos a tokens |
| Baja | Ritmo vertical entre secciones de 128 a 376 px; `z-index` sin escala; comentario obsoleto en `global.css:511` | Medido | Unificar |
| Baja | La captura de Vístalo se amplía 1,5–2× en pantallas de doble densidad | Proyectos | Captura más grande |
| Baja | El correo se corta con "…" a 320 px (ahora es más largo) | Pie y Contacto | Permitir el salto de línea |

### Contenido

| Gravedad | Hallazgo | Dónde | Arreglo |
|---|---|---|---|
| Media | "Boceto, diseño, código y pruebas" y variantes siguen en 14 sitios (lista abajo) | `ui.ts`, `Layout.astro`, `content/projects`, `cases.ts` | Reescribir, empezando por el pie |
| Baja | "Te presento mis últimos proyectos" encima de los 4 que hay, seguido de "Todos los proyectos" | Inicio | Ajustar el texto o el botón |
| Baja | La misma triada recibe cinco nombres: oficios, lentes, fases, miradas y capas | Toda la web | Elegir uno o dos |
| Baja | Contacto repite en el pie el correo y las redes; Sobre mí repite "Idiomas" | Contacto, Sobre mí | Quitar la repetición |
| Baja | "Mar 5 nov" en la demo de Tempora: el 5 de noviembre de 2026 es jueves | `TemporaUI.astro` | "Jue 5 nov" |
| Baja | La lista de QA de Inicio no incluye Playwright | `ui.ts` | Añadirlo |
| Baja | Por verificar: "Vístelo" frente a "Vístalo" (probablemente el juego de palabras del caso); si `vistalo-sl.vercel.app` es el dominio definitivo | Caso Vístalo | Confirmar |

Los 14 sitios con la triada:

1. Pie de las 17 páginas: `footer.credits` ("Hecho en capas: boceto, diseño, código y pruebas.") y `footer.lead`
   justo encima (`ui.ts:211`, `:215`; en inglés `:477`, `:481`).
2. Inicio: `view.step.0.more` (`ui.ts:106` / `:375`) y las capas `layers.*` (`ui.ts:83-91` / `:352-360`).
3. Hero: "Diseñador × Desarrollador × QA" y `view.step.1/2/3.title` (`ui.ts:70-72`).
4. Sobre mí: `about.p2` (`ui.ts:222-224`), los tres principios (`:237-244`) y `stack.lead` (`:206`).
5. Rol "Diseño, desarrollo y QA" en `src/content/projects/{es,en}/{tempora,vibora,learnish}.md` (9 apariciones en
   español: Inicio, Proyectos y cabecera de cada caso).
6. Casos: "Del boceto a la tinta" (`cases.ts:26`).
7. Solo en metadatos: `home.meta.description` (`ui.ts:61`), la descripción por defecto de `Layout.astro:35`,
   `projects.meta.description` (`ui.ts:193`) y `about.meta.description` (`ui.ts:220`).
8. Código muerto: `ProcessScene.astro` y las claves `process.*` (`ui.ts:147-165`) no se montan en ninguna página.

### Seguridad, privacidad y repositorio

| Gravedad | Hallazgo | Dónde y prueba | Arreglo |
|---|---|---|---|
| Alta | El CV con teléfono, código postal y otra dirección de Gmail sigue en el repositorio público, y en su historial desde el commit `6ce2e9f` | `docs/cv/christian-oller-cv.pdf` | Ver decisiones |
| Alta | El workflow de Playwright se ejecuta en cada push a `main` y los tests esperan títulos y rutas de la web vieja: fallarán (no se pudo ver en GitHub, no hay `gh`) | `.github/workflows/playwright.yml`, `tests/` | Ejecución manual hasta reescribirlos |
| Media | Cabeceras: solo HSTS. Faltan CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `frame-ancestors` | `curl -sI` en vivo; no hay `vercel.json` | `vercel.json` con `headers` (la CSP necesita hashes por los scripts en línea) |
| Media | El README describe la web antigua (nota 2/10): rutas que no existen, tokens viejos, sin captura ni enlace; dice MIT y no hay `LICENSE`; la descripción del repositorio es "New porfolio with Astro" | `README.md` | README nuevo (skill `readme-de-10`) |
| Baja | Material interno a la vista: `CLAUDE.md`, `PORTFOLIO_REPORT.md`, `docs/referencias/` (incluido el análisis de la web de Eloi), 55 scripts sobre su web en `.taste-skill/eloi-1118/tools/` y un `Gemini.agent.md` vacío | Repositorio | Ver decisiones |
| Baja | HSTS sin `includeSubDomains` ni `preload` | Cabecera en vivo | Añadirlos con las demás cabeceras |

## Comprobado y correcto

- **Consola y red**: 0 errores o avisos en 32 páginas (es/en, claro/oscuro); solo los 404 esperados.
- **Desbordes y reflow**: 0 en 17 páginas por 8 anchos; sin scroll horizontal a 320 px ni a 200 % de zoom.
- **Teclado**: más de 90 paradas por página en 7 rutas, todas con foco visible; nada oculto recibe foco; el
  enlace de salto funciona; la barra y el bocadillo no tapan el foco (2.4.11).
- **Contraste del texto principal**: cuerpo, menú y pie en los dos temas; el peor caso del gris de apoyo es 5,17:1.
- **Tamaño de los objetivos** (2.5.8): todo ≥ 24 px a 390 px.
- **Semántica**: `lang` correcto en las 16 rutas reales, sin ids duplicados, `aria-controls` válidos, landmarks y
  encabezados coherentes, `alt` y `autocomplete` correctos, cambio de página anunciado.
- **Movimiento**: con "reducir movimiento" se para todo; CLS máximo 0,002.
- **Carga**: three.js solo al acercarse a las capas; la web de Vístalo solo al pulsar; ≤ 500 KB por página;
  `/_astro/*` inmutable con un año de caché; Brotli en HTML y JS (HTML de 182 741 B a 38 435 B).
- **Robustez**: navegación sin recarga con atrás/adelante y scroll restaurado; WebGL con alternativa plana; el
  idioma mantiene la página; el tema persiste.
- **SEO básico**: http → https → www en dos saltos sin bucles; títulos y descripciones únicos y en su idioma;
  `/sistema/` y `/personaje/` con noindex y fuera del sitemap; la 404 devuelve 404; 36 enlaces internos con 200;
  enlaces externos con 200; sin terceros ni cookies.
- **Repositorio**: 299 archivos sin `.env` ni claves; `dist/` sin mapas de fuente.
- **Diseño**: una sola familia (la mono solo en código y lentes); titulares de 2 líneas como máximo salvo el H1 del
  hero (D22); medida de 30–49 caracteres por renglón; alineación al `.wrap`; esquinas rectas, sin sombras ni
  degradados; sin español en `/en/` ni inglés en las páginas en español.

## Resuelto durante la auditoría

- **Correo de contacto**: la web mostraba `contacto@christianoller.com`. Christian indicó que su correo es el de
  Gmail; se cambió en `src/data/site.ts` (commit `748eb52`), se publicó y se comprobó en vivo en Contacto (es y en)
  y en el pie. Dato de la revisión: `christianoller.com` tiene MX en IONOS (con SPF y DMARC `p=none`), así que ese
  dominio sí recibe correo; `christianoller.dev` no tiene MX.

## Cómo se hizo y sus límites

- Cuatro revisiones en paralelo, de solo lectura, sobre la web publicada y una build local idéntica: SEO,
  seguridad y repositorio; accesibilidad; diseño y contenido; rendimiento, robustez y usabilidad.
- Herramientas: Edge con Playwright, `curl` y `nslookup`, el inspector de la skill `design-taste-frontend` y
  medidas propias en el navegador. Sin Lighthouse ni servicios externos, para no enviar la web a terceros.
- Límites: solo Chromium (Safari y Firefox, por probar a mano; la lista de funciones a revisar está en el informe
  de rendimiento); sin lector de pantalla real; los tiempos de móvil son una emulación.
- Una revisión hizo una consulta de solo lectura a la API pública de GitHub sobre el propio repositorio, fuera de lo
  pactado, sin enviar datos personales.
- Los informes completos de cada revisión, con capturas y scripts, están en `.taste-skill/auditoria/` (solo en el
  equipo, no en git).

## Siguiente paso

Hacer "Lo primero" en un lote y enseñarlo; después, las decisiones de la tabla, una por una.
