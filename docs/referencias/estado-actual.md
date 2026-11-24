# Estado actual

Foto del proyecto el **19 de noviembre de 2026**, al pasar el trabajo del MacBook a la torre. Se
actualiza cuando cambie el punto en el que estamos. El detalle de cada cosa está en
[roadmap-prototipo-def.md](roadmap-prototipo-def.md).

## Dónde estamos

- **Publicado el 20 de noviembre de 2026**: Christian pidió pasar `prototipo-def` a `main`, que
  es lo que Vercel despliega en christianoller.dev. Fue un avance directo (`main` no tenía nada
  propio), sin forzar. La web publicada es el diseño tal como iba ese día, **con cosas sin
  terminar a sabiendas**: el formulario no envía (abre el correo), los textos de los casos son
  provisionales y las pruebas automáticas de GitHub fallan porque son de la web vieja (se
  reescribieron el 23 nov: punto 7 de la fase técnica).
  **Se sigue trabajando en `prototipo-def`**; lo que se quiera publicar se pasa a `main` cuando
  él lo pida.
- **El CV va en la web, tal cual**: la primera publicación salió sin él porque el PDF lleva su
  teléfono y su código postal; después, el mismo 20 nov, decidió subirlo así, sabiéndolo. Está en
  `public/cv/christian-oller-cv.pdf` y los botones de CV (inicio, menú de móvil y pie) salen solos
  porque el archivo existe (`hasCV` en `src/data/site.ts`). El bloque del CV de Sobre mí no vuelve:
  lo quitó él en la ronda de textos.
- Rama `prototipo-def`, subida entera a GitHub.
- **Diseño (E0–E5): hecho.** La última parada fue la rúbrica "de 10".
- **20 de noviembre, en la torre: ajustes de diseño.** En vez de cerrar el diseño, Christian pidió
  cambios, empezando por la home: el hero sin texto encima de la foto (D22) y la barra dentro de la
  página (D23), la foto clara sin sombra ni franja (D24) y la hoja con textura de papel en toda la
  página (D25) y los selectores de tema e idioma (D26). Los cinco están hechos y aprobados (ver
  "Ajustes de diseño" en el roadmap). Después retocó la foto del hero (la misma en los dos modos,
  con su pared gris y sin sombra) y dio la home por cerrada: no quiere tocarla más por ahora.
- **Idea nueva (20 nov), casi cerrada**: las lentes y el lienzo le cargaban la barra. Ya están en
  el bocadillo "¿Quieres verlo como yo?" de la caricatura, abajo a la izquierda (D27), aprobado
  con todos sus detalles (habla, guiña, sale 5 s al cargar la web). La barra queda en marca, menú,
  idioma y tema. Los proyectos van en cajas en la página de Proyectos, aprobado. Las capas 3D de
  la home funcionan y van numeradas, y al acabar esa escena la caricatura dice que toda la web se
  puede ver así (aprobado). **Solo quedan sus vídeos** cortos de cada app, para la caja grande de
  cada proyecto: cuando llegue el primero se añade el campo `video` al esquema de proyectos. Cómo
  grabarlos, exportarlos e integrarlos (estudio de poulo.site, 23 nov): `guia-videos-proyectos.md`.
- **Más retoques del 20 nov, cerrados**: la marca de la barra es una firma, "Chris" (D28; de
  momento en Rock Salt, pendiente de su firma a mano), que se escribe a máquina al cargar; el
  menú va a 16 px y marca la página con una línea bajo la palabra; los selectores resaltan la
  opción activa en gris; la transición entre páginas va sobre papel, con el canto de la página
  marcado; y el cuadro de selección al pasar el ratón está desactivado (comentado en `kit.css`).
  La intro no cambió. Detalle en "Ajustes de diseño" del roadmap.
- **Textos, primera tanda (20 nov, cerrada)**: repasó Inicio, Proyectos, Sobre mí y Contacto.
  Sobre mí cambia de titular ("Hola, soy Christian."), de foto (la de la luz circular, en blanco
  y negro) y de bio; ya no cita versiones de Angular ni a Eloi Cotonat (que sí sigue en el
  crédito del proyecto Vístalo, por decisión suya); las herramientas llevan logotipo
  (`simple-icons`); Proyectos abre siempre en cajas; el formulario de Contacto va centrado y sin
  el panel de estados. Los textos siguen siendo provisionales. Los 14 puntos, en el roadmap.
- **Auditoría (20 nov)**: hecha, con dos lotes de arreglos, ocho decisiones suyas (la caricatura se
  esconde al bajar en móvil, la intro solo la primera vez (el 21 nov la devolvió a cada carga), un
  ajuste para apagar los atajos, los
  bucles paran a los 5 s, sin chips negros, Sobre mí con menos tamaños, "Ver caso" en la home y la
  lente solo por pestaña) y el CV. Todo pasó por revisores independientes y se publicó el mismo
  día, comprobado en vivo. El detalle está en [auditoria-2026-11-20.md](auditoria-2026-11-20.md).
- **21 nov: ronda de cambios de diseño.** Christian dejó en pausa lo que queda de la auditoría
  (formulario, material interno del repositorio, textos y lo técnico menor) para hacer cambios de
  diseño; cuando diga que están todos, se retoma por ahí. El primero, aprobado: los proyectos de la
  home se apilan al hacer scroll (D29, sobre la referencia de kigo.studio). Además, la intro vuelve
  a salir en cada carga de la home: al recargar no la veía y la quiso de vuelta (la pista para
  saltarla se queda; `?intro` la fuerza aunque haya ancla). Y la 404 entra en el lienzo: un frame
  más al final de la fila de arriba, sin hilo (ningún enlace lleva a ella), y en la 404 es el frame
  "Estás aquí". En la 404 en inglés, el lienzo y el selector de idioma ya salen en inglés (antes
  salían en español: la 404 es un solo archivo que se genera en español).
  Privacidad (21 nov): analítica sin cookies con Vercel Web Analytics y página `/privacy/` en los dos
  idiomas, enlazada en el pie, bajo el formulario y en la 404. Sin banner: la web no usa cookies y
  solo guarda en el navegador las preferencias que elige el visitante. La página tiene un botón para
  no contar las visitas de ese navegador (también respeta Global Privacy Control). Todo lo de
  este día se publicó el 21 nov y se comprobó en vivo. Después, el cambio de modo claro/oscuro
  pasó a ser un círculo desde el botón (D30, sobre ky.fyi): al claro se abre, al oscuro se cierra.
  Y en el pie, al final de la última línea, "Volver arriba ↑".
- **Él mira la web en su servidor de desarrollo** (`localhost:4321`), no en la versión construida:
  si dice que algo no va, reproducirlo ahí primero.
- **Después: la fase técnica**, que aún no ha empezado.

## Densidad tipográfica (decidida el 20 nov)

- La prueba de densidad pide dos tamaños de letra más el display por pantalla, y había entre 3 y 5
  (de una escala de seis). Christian eligió recortar solo la primera pantalla de Sobre mí, que ahora
  va a dos tamaños más el display; en el resto se aceptan los 3–5 tamaños.

## Resultado de la rúbrica

Ocho pruebas pasan. La de Eloi pasa salvo el iris con el que se cierra la intro, que pidió Christian
expresamente. La de densidad no pasa al pie de la letra fuera de la primera pantalla de Sobre mí, por
decisión suya (ver arriba).

El inspector de la skill da 0 FAIL en catorce páginas a 1440, 768 y 390 px, con tres excepciones
declaradas: el nombre del frame (lo toma por una etiqueta sobre el título), la falta de imágenes
reales en páginas interiores y el texto que pasa bajo la escena fija en móvil.

## Fase técnica: lo que hay que hacer

**Auditoría de la web publicada (20 nov)**: [auditoria-2026-11-20.md](auditoria-2026-11-20.md). Tiene los
hallazgos priorizados, "Lo primero" (arreglos sin decisiones) y las decisiones pendientes de Christian. Manda
sobre la lista de abajo, que es anterior.

Por orden de urgencia (lista completa en el roadmap):

1. **Formulario**: Web3Forms está cableado (23 nov): `method="post"`, antispam sin captcha con el
   campo cebo `botcheck`, asunto igual que el del mailto, y `api.web3forms.com` ya permitido en la
   CSP (`connect-src` y `form-action`). Funciona en cuanto Christian define `PUBLIC_FORM_ENDPOINT`
   (`https://api.web3forms.com/submit/<clave>`) en Vercel; sin la variable, abre el correo. La
   privacidad y la nota bajo el botón cambian solas según la variable. Christian creó su cuenta de
   Web3Forms con su Gmail (aparte de la de Vístalo) y la variable ya está en Vercel (Config,
   Production y Preview). La primera prueba en vivo falló: el navegador lo vio como error de CORS y,
   al diagnosticarlo, la API respondió 429 (límite por IP durante una hora, sin cabeceras CORS). Desde
   entonces la web separa la clave de la variable (`src/data/form-endpoint.ts`) y envía a `/submit`
   con `access_key` en un campo oculto, el método que Web3Forms documenta para JavaScript. Falta
   repetir la prueba en vivo.
2. **SEO**: hecho lo de la auditoría (dominio con `www`, `hreflang`, sitemap, barras finales,
   JSON-LD y `llms.txt`). Desde el 23 nov cada página comparte su propia imagen: la parte de
   arriba de la página en oscuro, en su idioma (`public/og/`, 1200 × 630, unos 90 KB). Las genera
   `og-images.mjs` y `Layout.astro` elige la de cada ruta; la 404 y las internas usan la general.
   En la de la home se ocultan los botones del hero, que caían cortados en el borde.
3. **Accesibilidad**: los fallos de la auditoría están arreglados (ver su tabla). Revisión con lector
   de pantalla hecha el 24 nov: una pasada automática de toda la lista de `prueba-nvda.md` sobre el
   árbol de accesibilidad de Chromium (casi todo bien) y Christian con NVDA en Edge los puntos que
   solo NVDA puede decir ("funciona correctamente"). Quedan de la pasada automática: la lista de
   requisitos del formulario (`#c-checks`) solo cambia de color al cumplirse; el giro de las capas 3D
   avanza de 0,12 rad y nunca dice "De frente"; el resumen "Faltan datos…" no se actualiza al
   corregir un campo; al poner una lente no se anuncia cuál. Y cuatro detalles de estructura: el pie
   está dentro de `<main>` (no hay `contentinfo`), el bocadillo queda fuera de los puntos de
   referencia, algunos nombres llevan la tecla del atajo ("Diseño 1") y el lienzo no es modal.
4. **Rendimiento** (23 nov, medido con Lighthouse en local): escritorio ya daba 99–100. Para móvil,
   tres arreglos: la foto del hero del tema activo se precarga desde el `<head>` (sigue bajando una
   sola), la del hero y las de proyecto piden el tamaño en que se ven (`src/data/hero-photo.ts` y
   `project-image.ts`) y el CSS va dentro de cada página (`inlineStylesheets: 'always'`). Móvil pasó
   de 88–91 a 91–94 (FCP entre 0,3 y 1 s antes, LCP entre 0,15 y 0,3 s). Lo que cuesta el CSS
   dentro, medido: unos 21 KB más por página y, con la CPU frenada, entre 40 y 100 ms más antes de
   que arranque el cambio de página; si algún día pesa, se vuelve a `'auto'`. Las piezas del
   personaje se quedan como estaban (achicarlas ahorraba 9 KB y podía emborronarlas). Sin tocar:
   three.js (177 KB comprimido, solo al acercarse a su sección), la fuente Bricolage (129 KB; una
   más ligera cambiaría el dibujo, decide él) y `profile.jpg`, que pesa 7,6 MB en origen.
5. **Seguridad**: las cabeceras están en `vercel.json`, y desde el 23 nov también la CSP. Christian
   eligió la simple: todo desde la propia web, con los guiones y estilos en línea permitidos (con
   hashes habría que rehacer la lista cada vez que cambia uno de los 12 guiones en línea), imágenes
   también en `data:` (los SVG del CSS) y el iframe solo de `vistalo-sl.vercel.app`. `script-src`
   lleva `data:` porque el router de Astro mete en cada cambio de página un guion vacío
   `data:application/javascript,`. No se pone en `/cv/`: con `object-src 'none'` el visor de PDF de
   Safari (y a veces el de Chrome) se queda en blanco. `tests/csp.spec.ts` la añade a cada página
   (astro preview no envía cabeceras) y exige cero bloqueos. Pendiente: mirar la consola de la web
   publicada tras subirla, porque la analítica de Vercel solo existe allí (carga de la propia web).
   En los despliegues de prueba de Vercel la barra de comentarios (`vercel.live`) queda bloqueada.
6. **Analítica** sin cookies: hecha el 21 nov con Vercel Web Analytics (sin banner), junto con la
   página de privacidad. Publicada el 21 nov y comprobada en vivo: el script carga una vez y cada
   página envía una visita (en las pruebas se cortan los envíos para no contar visitas falsas, y
   el script de Vercel ignora los navegadores automatizados y sin interfaz). Christian la activó en
   el panel de Vercel el mismo día y vio llegar su primera visita. Al conectar
   el formulario, hay que reescribir el apartado "Si me escribes" de la privacidad.
7. **Tests de Playwright**: reescritos el 23 nov para esta versión (`pnpm test`, carpeta `tests/`):
   unas 300 pruebas en escritorio y móvil, en los dos idiomas (navegación, tema, lentes, lienzo,
   demos, contacto, privacidad, SEO, la intro y accesibilidad de cada página con la lente QA como
   juez). El workflow de GitHub vuelve a lanzarse en cada push a `main` y `prototipo-def`.
   Destaparon que la lente QA contaba el titular escondido de la 404 (arreglado). En este equipo
   usan Edge (no hay navegadores de Playwright instalados); en CI, el Chromium de Playwright. El
   mismo día se añadieron la intro (`?intro`) y el fallo del portapapeles; las pruebas de saltar la
   intro paran el reloj de la página (`page.clock`), así que solo pasan si la tecla o el toque la
   saltan de verdad. Quedan sin prueba Vístalo en vivo (con los vídeos, porque esa caja va a
   cambiar) y arrastrar o hacer zoom en el lienzo (solo si se toca `canvas.ts`).
8. **Otros**: la 404 responde 404 en Vercel (comprobado el 20 nov) y el manifest ya está. Renovar
   `public/.well-known/security.txt` antes del 19 nov de 2027, cuando caduca. `pnpm lint` da 0
   problemas desde el 23 nov: antes revisaba también lo compilado y `.taste-skill/` (8.862 errores);
   en el código había 18, arreglados. En los dos `href="#"` hechos a propósito (la web de ejemplo
   inerte de "Cómo lo veo yo" y "Volver arriba") la regla se desactiva con su motivo escrito.

Después, el **lanzamiento**: publicar en christianoller.dev, grabar el vídeo de los momentos firma y
enviar a Awwwards la URL en inglés.

## Lo que falta de Christian

- **Formulario**: elegir servicio y crear la cuenta.
- **Analítica** (activada el 21 nov): para que no cuenten sus propias visitas, "No contar mis
  visitas" en `/privacy/`, una vez en cada navegador que use.
- **Aviso legal**: solo hace falta si cobra proyectos a través de la web (LSSI); pendiente de que lo
  diga.
- **Contenido real de los casos**: sus frases de "Lo que más disfruté", decisiones, un fragmento de
  código real de cada proyecto, año, stack y enlaces. Lo que hay ahora lo escribió Claude.
- **Imágenes reales** de Tempora, Vibora y Learnish, y la sesión de fotos nueva en blanco y negro.
- **Angular** (resuelto el 20 nov): la web ya no cita versiones, solo "Angular". Él ha tocado
  todas y no quiere un rango. (El PDF del CV sí dice v8–v18: es suyo y no se ha tocado.)
- **Textos**: revisar todos; los nuevos son provisionales.

## Cambios recientes que conviene saber

- **20 nov, selectores (D26)**: tema e idioma usan la pieza `.seg` de `kit.css` (bandeja con dos
  opciones y una marca bajo la activa). Por debajo de 480 px van en el menú de móvil, no en la
  barra. La barra va justa: antes de añadirle algo, medir a 1024 y a 1360 px en español.
- **20 nov, hoja con textura (D25)**: la página ya no es un color plano. `--sheet` es la hoja (gris
  `#d6d6d6` en claro) y se pinta con `--sheet-bg`, que lleva la textura de papel
  (`public/textures/`, generada con `.taste-skill/papel/papel.cjs`). `--paper` queda para las
  piezas que van encima. La hoja la pinta el `body`, de borde a borde: el artboard va sin fondo y
  ya no hay lienzo a los lados. **Lo que tenga que tapar algo con "la página" (la barra, el menú
  de móvil) usa `--sheet-bg`, nunca `--paper`.** La barra termina en un fundido, no en una línea.
  Una mezcla (`mix-blend-mode`) dentro de un elemento con máscara o con entrada escalonada queda
  aislada: hay que ponerla en el elemento de fuera (pasó con el retrato de Sobre mí).
- **20 nov, foto del hero**: los dos modos usan `card-dark.jpg`, la foto de la luz roja con su
  pared gris y sin la sombra de la figura. Se genera con `.taste-skill/recorte/sin-sombra.cjs` a
  partir de `card.jpg` y de la máscara guardada en `docs/imgs/card-mascara.png`. La versión
  recortada sobre transparente (`card-light.webp`, de `luz-gris.cjs`) fue la foto clara de D24 y
  D25 y ya no se usa. En claro el fundido de la foto se nota más que en oscuro (ver el roadmap).
- **20 nov**: la barra es la primera fila del artboard y el nombre del frame ya no va encima de él
  (sale en la barra de estado de las lentes, en el lienzo y en la 404). En el hero, texto y foto van
  en columnas separadas.
- **Inspector tras el 20 nov**: la excepción `eyebrow` sigue haciendo falta, pero ya no por el
  nombre del frame: el inspector toma las versiones de la trayectoria ("v7.0" encima de "Vístalo")
  por etiquetas sobre un título; antes quedaban tapadas por la misma excepción. Y hay una nueva,
  `headline-lines`: el H1 del hero ocupa tres líneas ("Christian Oller" / "Software" / "developer")
  por D22. La alternativa, "Software developer" en una línea, obliga a bajar el titular a unos 85 px.
- **20 nov, lienzo navegable**: en la home nunca se marcaba "Estás aquí" y el lienzo se abría ya
  alejado, porque la ruta "/" se quedaba en "" al quitarle la barra final (`canvas.ts`). Arreglado.
  Además, la cámara coloca la miniatura de la página actual justo encima de la página real (la
  miniatura empieza con la barra).
- **20 nov**: las miniaturas del lienzo se regeneraron en la torre (Windows). El primer argumento de
  las herramientas de `.taste-skill/eloi-1118/tools/` se pasa como URL de archivo
  (`file:///C:/…/scripts/lib/cdp.mjs`) y el recorte usa sharp en vez de jimp.

- La trayectoria (`src/data/experience.ts`) sale ahora del CV: siete etapas, con Accenture y
  Vall d'Hebron, más formación e idiomas.
- El título de Contacto pasó de "Hablemos" a "Escríbeme" para alejarse de la firma de Eloi.
- La monoespaciada queda solo para código y valores medidos; los rótulos van en la letra de texto.
- Los tamaños de letra de las páginas se redujeron a la escala de seis del sistema.

## Al abrir el proyecto en otro equipo

1. Instalar Git, Node 22 y pnpm, y clonar el repositorio.
2. `git switch prototipo-def`, `pnpm install` y `pnpm build`.
3. Abrir la carpeta en Claude Code. `CLAUDE.md` se carga solo y trae las reglas de trabajo.
4. Lo que **no** viaja con GitHub: la conversación anterior, las capturas de `.taste-skill/` y la
   memoria que Claude guardaba en el otro equipo (su contenido está recogido en `CLAUDE.md`).
