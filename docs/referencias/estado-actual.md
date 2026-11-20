# Estado actual

Foto del proyecto el **19 de noviembre de 2026**, al pasar el trabajo del MacBook a la torre. Se
actualiza cuando cambie el punto en el que estamos. El detalle de cada cosa está en
[roadmap-prototipo-def.md](roadmap-prototipo-def.md).

## Dónde estamos

- Rama `prototipo-def`, subida entera a GitHub.
- **Diseño (E0–E5): hecho.** La última parada fue la rúbrica "de 10".
- **20 de noviembre, en la torre: ajustes de diseño.** En vez de cerrar el diseño, Christian pidió
  cambios, empezando por la home: el hero sin texto encima de la foto (D22) y la barra dentro de la
  página (D23), la foto clara sin sombra ni franja (D24) y la hoja con textura de papel en toda la
  página (D25), ya aprobados. Después, los selectores de tema e idioma (D26): hechos y a la espera
  de su visto bueno (ver "Ajustes de diseño" en el roadmap).
- **Después: la fase técnica**, que aún no ha empezado.

## La pregunta que sigue abierta

- La prueba de densidad no pasa al pie de la letra: pide dos tamaños de letra más el display por
  pantalla y hay entre 3 y 5 (de una escala de seis). Christian ha preferido seguir con cambios de
  diseño antes de cerrar; la decisión sobre la densidad sigue pendiente. Hay que preguntárselo.

## Resultado de la rúbrica

Ocho pruebas pasan. La de Eloi pasa salvo el iris con el que se cierra la intro, que pidió Christian
expresamente. La de densidad es la que no pasa del todo.

El inspector de la skill da 0 FAIL en catorce páginas a 1440, 768 y 390 px, con tres excepciones
declaradas: el nombre del frame (lo toma por una etiqueta sobre el título), la falta de imágenes
reales en páginas interiores y el texto que pasa bajo la escena fija en móvil.

## Fase técnica: lo que hay que hacer

Por orden de urgencia (lista completa en el roadmap):

1. **Formulario**: hoy no envía; abre el correo con el mensaje escrito. Falta el servicio de envío y
   un antispam sin captcha. El estado "enviado" ya está diseñado.
2. **SEO**: dominio canónico con `www`, `hreflang`, sitemap, JSON-LD, imagen para compartir por
   página y `llms.txt`.
3. **Accesibilidad**: versión quieta de cada momento, teclado, foco y contraste. Falta una revisión
   con lector de pantalla.
4. **Rendimiento**: precargar la foto del hero del tema activo, `profile.jpg` pesa 7,6 MB en origen
   y three.js son 173 KB (solo se descarga al acercarse a su sección).
5. **Seguridad**: CSP y cabeceras. El marco de Vístalo carga su web desde otro dominio.
6. **Analítica** sin cookies.
7. **Tests de Playwright**: lentes, navegación, formulario y accesibilidad.
8. **Otros**: comprobar la 404 en Vercel y el manifest.

Después, el **lanzamiento**: publicar en christianoller.dev, grabar el vídeo de los momentos firma y
enviar a Awwwards la URL en inglés.

## Lo que falta de Christian

- **Formulario y analítica**: elegir servicio y crear las cuentas.
- **Contenido real de los casos**: sus frases de "Lo que más disfruté", decisiones, un fragmento de
  código real de cada proyecto, año, stack y enlaces. Lo que hay ahora lo escribió Claude.
- **Imágenes reales** de Tempora, Vibora y Learnish, y la sesión de fotos nueva en blanco y negro.
- **Angular**: su CV dice v8–v18 y la web dice hasta la v21. Hay que confirmar cuál es.
- **CV público**: el repositorio es público e incluye el PDF con su teléfono y su código postal.
  Preguntado; sin respuesta todavía.
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
- **20 nov, foto clara (D24 y D25)**: sin la franja roja ni la sombra, con fondo transparente
  (`card-light.webp`) y un velo claro detrás. Se genera en cualquier equipo con
  `.taste-skill/recorte/luz-gris.cjs` y la máscara guardada en `docs/imgs/card-mascara.png` (sacada
  de la foto anterior con `mascara-diferencia.cjs`). Para esta foto ya no hace falta `person.swift`.
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
