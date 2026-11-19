# Estado actual

Foto del proyecto el **19 de noviembre de 2026**, al pasar el trabajo del MacBook a la torre. Se
actualiza cuando cambie el punto en el que estamos. El detalle de cada cosa está en
[roadmap-prototipo-def.md](roadmap-prototipo-def.md).

## Dónde estamos

- Rama `prototipo-def`, subida entera a GitHub.
- **Diseño (E0–E5): hecho.** La última parada fue la rúbrica "de 10".
- **Lo siguiente: la fase técnica**, que aún no ha empezado.

## La última pregunta, sin contestar

Al terminar la rúbrica quedó abierta esta decisión de Christian:

- ¿Da el diseño por cerrado y se empieza la fase técnica, o antes se apura la prueba de densidad?
  Esa prueba no pasa al pie de la letra: pide dos tamaños de letra más el display por pantalla y
  hay entre 3 y 5 (de una escala de seis).

No se debe dar por contestada: hay que preguntárselo.

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
