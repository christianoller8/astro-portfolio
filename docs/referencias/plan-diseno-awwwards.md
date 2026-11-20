# Plan de diseño y animación: portfolio de nivel Awwwards

- **Fecha**: 18 de noviembre de 2026
- **Alcance**: solo **diseño y animación**: concepto, dirección de arte, composición, movimiento,
  páginas y móvil. SEO, accesibilidad, formularios, cookies, seguridad y rendimiento fino se afinan
  después, cuando el diseño esté de 10 (lo encontrado queda anotado en §12 para no perderlo).
- **Base**:
  - christianoller.dev tal como está publicada hoy (rama `main`).
  - La propuesta de la rama `prototipo1`.
  - El [informe de la web de Eloi](informe-eloi-cotonat.md).
  - Las demás referencias de esta carpeta y los criterios de Awwwards: el diseño pesa el 40 % de la
    nota y la creatividad el 20 %.
- **Cómo se usa**:
  1. **Teoría**: este documento.
  2. **Afinar**: las decisiones de §10.
  3. **Ejecutar por etapas**, revisando cada una con la rúbrica de §11.
- **Rama de trabajo**: `prototipo-def`, creada el 18 de noviembre desde `prototipo1`.
- **Ya decidido por Christian** (las decisiones D1–D16 de §10 están cerradas):
  - Se conservan **los tonos** de la web actual: grises, blanco y negro, foto en B/N y nada de azul
    (§3.3).
  - Se conservan **los modos claro y oscuro**, con el oscuro como en la web actual (§3.7).
  - **La tarjeta 3D se quita** (§8).
  - **Una caricatura suya** es la marca y la protagonista de la intro (§3.8 y §4.3 A).
  - Bricolage, lienzo completo, hilo en cada navegación, cotas técnicas, barra agrupada, retrato
    nuevo en blanco y negro, Tempora primero, inglés para el jurado, y verde y rojo solo como estado
    (§10).

**Capturas de referencia** (solo en local, carpeta ignorada por git):
- Web publicada: [escritorio](../../.taste-skill/live-1118/home/desktop-page-01.jpg) ·
  [móvil](../../.taste-skill/live-1118/home/mobile-page-01.jpg)
- `prototipo1`: [escritorio](../../.taste-skill/p1-home/desktop-page-01.jpg)

---

## 0. Tus ideas del 18 de noviembre, ya en el plan

| Tu idea | Cómo queda | Dónde |
| --- | --- | --- |
| "Una animación de entrada como la de eloicotonat.com", con la animación del vídeo de made_byfede | Se comporta como la de Eloi (una vez por sesión, con todas sus salidas) y se ve como la del vídeo: los contornos de tu caricatura y de tu nombre se trazan a la vez, se rellenan ("se pinta el pelo") y la marca da paso a la web. | §4.3 A y [análisis del vídeo](analisis-video-intro.md) |
| "Animaciones al pasar de página, de derecha a izquierda" | Paneo horizontal: hacia delante, la página nueva entra por la derecha y la actual sale por la izquierda; hacia atrás, al revés. Siempre con el hilo de prototipo y el zoom de cámara. | §4.3 B |
| "Una caricatura como la de la referencia" (docs/imgs) | Una caricatura tuya en ese estilo (línea negra gruesa, sin color), que pasa a ser tu marca: versión reducida en la barra y versión grande en la intro. Se toma el estilo, no el dibujo ni la composición de la referencia. | §3.8 |
| "Cómo lo veo yo": una web vista por UX/UI (boceto), por un programador (código, `h1`) y por QA (tests, rendimiento, accesibilidad) | Pasa a ser la sección firma de la home y sustituye a "Del boceto al producto" y a "Cómo trabajo". Es la puerta de entrada a las lentes. | §4.3 E y §5.2 |
| "Que se vea la pasión: disfruto haciendo webs y apps, con resultados increíbles" | La frase del hero, tu foto riendo, los proyectos justo después del hero (y que se puedan tocar) y, en cada caso, "Lo que más disfruté". | §2, §5.0, §5.2 y §5.4 |

---

## 1. Punto de partida

### 1.1 christianoller.dev hoy (rama `main`)

**Cómo es**:
- Fondo gris carbón (`#2c2c2e`), titulares en Playfair Display en mayúsculas y texto en Inter.
  Monograma "CO" en un círculo.
- Tarjeta 3D colgante a la izquierda con tu foto en blanco y negro; a la derecha, "Hola, soy /
  CHRISTIAN OLLER / Designer × Developer × QA" y el botón "Contactar".
- Debajo: 4 columnas de servicios, un muro de 24 cajas de tecnologías, la frase "CREANDO
  EXPERIENCIAS DIGITALES INTUITIVAS Y MEMORABLES" con una bio, y dos proyectos destacados.

**Lo que funciona y se conserva**:
- **Sus tonos**:
  - Claro: lienzo `#e5e5e5` (el gris del lienzo de Figma), papel `#ffffff` y tinta `#1a1a1a`.
  - Oscuro: gris carbón `#2c2c2e`, superficie `#171717` y texto `#f5f5f5`.
  - Sin azul ni colores de adorno.
- **Los dos modos**, claro y oscuro, que siguen al sistema y recuerdan tu elección.
- **La foto en blanco y negro.**
- La tarjeta era un gesto lúdico que se recuerda, pero se quita (§8).

**Lo que resta en diseño**:

| Problema | Por qué resta |
| --- | --- |
| No hay concepto: "Designer × Developer × QA" y frases de plantilla ("experiencias digitales únicas", "pixel-perfect", "robustas y escalables"). | El jurado reconoce el lenguaje de plantilla. Bajan creatividad y contenido. |
| La fórmula gris carbón + serif en mayúsculas + Inter está muy vista. | Parece una plantilla "premium". Baja diseño. |
| La tarjeta 3D manda en la primera pantalla y aparta tu nombre (en móvil lo deja por debajo del pliegue). | Jerarquía invertida: lo primero que se ve es un recurso conocido, no tú. |
| Un muro de 24 cajas iguales de tecnologías. | Es ruido sin información y en móvil ocupa 12 filas. |
| Servicios en 4 columnas de texto iguales. | Composición genérica, sin protagonista. |
| Un titular en mayúsculas de 4–5 líneas. | Se lee mal y no tiene ritmo. |
| Proyectos ilustrados con capturas de plantillas ajenas. | Imagen que no es tuya: lo peor para diseño y contenido. |
| Casi nada se mueve (un elemento además del 3D) y las transiciones son las de serie. | Nada que recordar salvo la tarjeta. |
| Pantallas con mucho vacío sin propósito. | El inspector las marca como casi vacías. |

### 1.2 `prototipo1`: lo que ya mejora y lo que le falta para el 10

**Ya resuelto**:
- Idea propia: lienzo, lápiz azul y tres lentes.
- Titular grande y claro: "Christian Oller / Frontend developer".
- Fragmentos de interfaz reales de tus apps en vez de capturas ajenas.
- Escena del boceto al producto, intro, zoom entre frames y lentes calculadas.
- 0 FAIL del inspector en la home.

**Lo que le falta (solo diseño)**:

1. **El lienzo apenas se ve.** El lienzo y el artboard son casi del mismo tono (oscuro `#0c0d10`
   frente a `#16171b`; claro `#e8e9ec` frente a `#fff`, con poco margen entre ellos). Sin lienzo
   visible, el "zoom entre frames" no se entiende.
2. **El nombre del frame solo aparece en la lente Diseño**, así que la metáfora no se lee si no se
   activa nada.
3. **El hero es correcto pero previsible**: texto arriba a la izquierda y foto abajo a la derecha.
   Además, la foto no está dirigida (es la antigua, con la luz roja).
4. **El azul tiene el mismo matiz que el de Eloi.** Queda resuelto al volver a tus tonos (§3.3).
5. **La letra a mano (Architects Daughter) y la lente QA están demasiado cerca** del modo revisión
   de Eloi (§9).
6. **Por debajo del hero, las secciones aún no son "pósters"**: varias se parecen entre sí y
   ninguna tiene un momento propio.
7. **Falta tu trayectoria real** (Vueling, Inology, SM Medioambientales y Pukkas). Está en `main` y
   se perdió en `prototipo1`.
8. **No hay un gesto propio de navegación**: ni lienzo navegable ni transición de la tarjeta de
   proyecto a su caso.
9. **Bricolage Grotesque es muy popular desde 2024.** Es buena, pero hay que usarla con intención
   (sus ejes variables, §3.2) para que no parezca "la de moda".

---

## 2. La tesis de diseño

> **Tu portfolio es tu archivo de diseño abierto en tu herramienta.** Cada página es un frame
> sobre un lienzo. Se ve terminado (tinta), se puede mirar por dentro (las lentes) y se recorre
> como un prototipo (los frames están conectados por hilos).

**El mensaje**: *"Disfruto haciendo webs y apps. Se nota en el resultado."* La pasión se demuestra,
no se declara:
- Tu foto riendo.
- Los proyectos justo después del hero, y que se puedan tocar.
- El detalle en cada pantalla.
- En cada caso, lo que más disfrutaste resolviendo.

- **Prueba del competidor**: Eloi es cámara y cuaderno; Vístalo, sastrería; tú eres **la
  herramienta**: lienzo, frames, selección, medidas, hilos de prototipo, capas y código. Nadie de tu
  entorno ocupa ese territorio, y es exactamente tu oficio (diseñas en Figma, programas y pruebas).
- **Doble lectura**:
  - **5 segundos para el reclutador**: quién eres, qué haces, tus proyectos y tu CV, sin activar
    nada.
  - **5 minutos para el jurado**: lentes, lienzo, hilos y detalles.
  - Por defecto la página está limpia; la profundidad aparece cuando el visitante la pide.

### Diez principios

1. **Una idea en todas partes**: cada recurso visual sale de la herramienta (frames, selección,
   cotas, hilos y capas). Nada de decoración ajena a ella.
2. **Limpio por defecto, profundo bajo demanda**: la tinta es el producto y el lápiz y las lentes
   son capas.
3. **Un protagonista por pantalla**: cada pantalla, vista como captura, se entiende como un póster.
4. **La tipografía es imagen**: display grande y preciso; la letra entra en las animaciones.
5. **El color es información**: la interfaz es monocroma. El grafito marca lo que está en
   construcción y el verde y el rojo son solo estados. El único color de verdad es el de los
   proyectos. Nunca adorno.
6. **Movimiento con causa**: cada animación explica un cambio de estado (seleccionar, medir,
   entintar) o de lugar (la cámara del lienzo).
7. **Nada inventado**: cada imagen es trabajo real o un dibujo del propio sistema.
8. **Detalle de verdad**: medidas, coordenadas y nombres de capa reales, calculados en el
   navegador.
9. **Calma**: la suavidad y la velocidad pesan más que el espectáculo.
10. **Distinto de Eloi y de Vístalo**: comprobado pieza a pieza (§9).

---

## 3. Dirección de arte

### 3.1 El objeto: lienzo y frames

- **Lienzo visible**, con tus tonos:
  - En claro, lienzo `#e5e5e5` y papel `#ffffff`. Entre ellos hay 1,26:1: se distinguen sin
    esfuerzo, igual que en Figma.
  - En oscuro, lienzo gris carbón `#2c2c2e` y papel `#171717` (1,29:1): el frame oscuro se recorta
    sobre el carbón.
  - Se ve un margen de lienzo alrededor del artboard: 24–40 px en escritorio y 8–12 px en móvil.
- **Nombre del frame siempre visible**, fuera del artboard, arriba a la izquierda, como en Figma:
  "Inicio" y su tamaño real ("1440 × 4210"), que se actualiza al cambiar el tamaño de la ventana. Es
  parte del concepto, no una etiqueta decorativa.
- **El artboard es el único contenedor**:
  - Esquinas rectas y sin sombra grande (en Figma un frame no flota).
  - Dentro no hay tarjetas con borde: las secciones se separan por composición, no por cajas.

### 3.2 Tipografía

- **Una familia para todo**: Bricolage Grotesque variable, con sus tres ejes: tamaño óptico 12–96,
  anchura 75–100 y peso 200–800. Hoy se carga solo con el eje óptico (`opsz.css`); hay que pasar a
  `standard.css` para tener también la anchura.
- **Los ejes como recurso del concepto**:
  - **Lápiz**: peso 200 y anchura 75 (fino y estrecho, como un trazo).
  - **Tinta**: peso 650–700 y anchura 100.
  - El "entintado" de los titulares anima esos ejes (§4.3). Es una animación tipográfica propia,
    ligera y que nadie de tu entorno tiene.
- **Mono** (IBM Plex Mono) solo para código y para las medidas de las lentes. **Sin letra
  manuscrita** (§9).
- **Escala de seis pasos**: 14 · 17 · 22 · 32 · 56 · display (8–14 vw).
- **Reglas**:
  - Display con tracking −0,045 em e interlineado 0,9.
  - Texto a 17–18 px con interlineado 1,55.
  - Como máximo, dos tamaños más el display en cada pantalla.
- **Decidido** (D6): Bricolage Grotesque con sus tres ejes.

### 3.3 Color: tus tonos (decidido)

Se conservan los tonos de la web actual, y encajan con el concepto sin tocarlos: `#e5e5e5` es justo
el gris del lienzo de Figma. Además, resuelven el choque con Eloi: sus azules (226–228°) tenían el
mismo matiz que el lápiz azul de `prototipo1` (230–231°).

| Rol | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| Lienzo | `#e5e5e5` | `#2c2c2e` | Fondo de la herramienta y barra superior. |
| Papel | `#ffffff` | `#171717` | Artboard. |
| Tinta | `#1a1a1a` (17,4:1) | `#f5f5f5` (16,4:1) | Todo el texto, la selección y el botón principal. |
| Secundario | `#4a4a4a` (8,9:1) | `#a3a3a3` (7,1:1) | Texto secundario y etiquetas de medida. |
| Borde | `#d4d4d4` | `#3a3a3c` | Separaciones mínimas, solo si hacen falta. En oscuro se aclara: tu `#262626` no se ve sobre el frame `#171717`. |
| Tinte (nuevo) | `#f2f2f2` | `#222222` | Fondos suaves dentro del frame (botón secundario, bloques). |
| **Grafito** (nuevo) | `#8e8e93` (3,3:1) | `#7c7c82` (4,3:1) | El "lápiz": trazos de boceto, guías, cotas e hilos. Solo gráficos, nunca texto. |
| Estado (funcional) | `#16a34a` | `#22c55e` | Solo el punto de "Disponible" y las comprobaciones que pasan. En claro va un paso más oscuro, porque `#22c55e` se queda en 2,3:1 sobre blanco. |
| Fallo (funcional) | `#dc2626` | `#f87171` | Solo los fallos dentro de la lente QA. |

Los contrastes están medidos sobre el papel de cada modo.

- **El concepto pasa del "lápiz azul" al grafito**: del boceto en grafito a la tinta.
  - Es más fiel a tu web de siempre.
  - La diferencia entre lápiz y tinta la marcan el tono y el grosor del trazo, no un color.
  - Esto cambia, para `prototipo-def`, lo que decía [concepto.md](concepto.md).
- **Regla**: la interfaz es monocroma y **el color solo vive dentro de los frames de los
  proyectos** (Tempora, Vibora, Learnish y Vístalo, con sus paletas). Sobre un lienzo gris, cada
  proyecto destaca como un diseño a color dentro de Figma.
- **Un portfolio monocromo puede ganar perfectamente.** Sin color, la nota la deciden la
  tipografía, la composición, la imagen y el movimiento, que es justo donde se centra este plan.

### 3.4 Composición y retícula

- **Retícula**: 12 columnas dentro del artboard, márgenes de 5–7 vw y bloques asimétricos (7/12 y
  5/12; el display a 10–12 columnas).
- **Una pantalla, un protagonista**: en escritorio, cada sección es un "frame interno" de casi una
  pantalla, con su elemento dominante.
- **Fuera**: filas de tarjetas iguales con icono, eyebrows, numeraciones decorativas, chips
  repartidos y líneas finas separándolo todo (justo lo que le resta a Eloi y lo que el inspector
  castiga).

### 3.5 Imagen

- **Retrato dirigido** (decisión D8):
  - En **blanco y negro**, como en tu web actual: plano medio, fondo neutro y luz suave.
  - Se presenta como una **capa seleccionada**: cuadro de selección con tiradores, nombre de archivo
    y tamaño.
  - Siempre en su rectángulo, **nunca recortado sobre el fondo**: la silueta recortada en blanco y
    negro es el recurso de Eloi.
- **Fragmentos reales de tus apps** como imagen principal de cada proyecto (ya existen).
- **Bocetos generados desde la propia página**, no ilustraciones.
- **Capturas reales de Vístalo**. Nada de fotos de banco ni de capturas de plantillas.

### 3.6 Kit gráfico de herramienta

El vocabulario visual de toda la web. **Aparece por estados** (hover, foco, lentes, transición,
lienzo), **nunca como decoración fija**: la página en reposo es tinta limpia.

| Pieza | Dónde aparece |
| --- | --- |
| **Nombre de frame** + tamaño | Siempre, fuera del artboard. |
| **Selección**: cuadro de 1 px en tinta, 8 tiradores de 6 × 6 (papel por dentro, tinta por fuera) y píldora "W × H" | Hover y foco de tarjetas, retrato, lente Diseño. |
| **Cotas**: distancias entre bloques con su valor en px o en token | Lente Diseño y escena del boceto. |
| **Guías**: líneas de construcción que salen de los bordes | Intro y lente Diseño. |
| **Hilos de prototipo**: curva con punto de origen y flecha | Transición entre páginas, lienzo navegable, "siguiente proyecto". |
| **Cursores**: el nativo; mano en el lienzo; cruceta con coordenadas en la lente Diseño | Según el estado. |
| **Panel de capas**: el árbol de componentes | Lente Código. |
| **Insignias con valor**: "Contraste 8,4:1 ✓", "Objetivo táctil 44 px ✓" | Lente QA y escena del boceto, con estética de panel de DevTools. |

### 3.7 Modos claro y oscuro (decidido)

- Se conservan los dos con el comportamiento de ahora: siguen al sistema y recuerdan la elección.
- **Claro**: lienzo `#e5e5e5` y frames blancos, como en Figma.
- **Oscuro**: lienzo gris carbón `#2c2c2e` y frames `#171717`, como en tu web actual. El grafito y la
  tinta clara se leen bien sobre el frame oscuro.
- Se diseñan a la vez: cada pantalla se revisa en los dos modos.

### 3.8 La caricatura (marca)

> **Actualizado el 18 de noviembre**: la caricatura definitiva la ha dibujado Christian
> (`docs/imgs/caricatura-chris.jpeg`): una cabeza a mano, con el pelo a brochazos, cejas marcadas y
> la barba en gris. La marca es esa cabeza con **"made by" pequeño y "chris" grande**, en Bricolage
> Grotesque (la letra de la web), con más aire entre la cara y las letras. Eligió "chris" porque es
> más cercano y así le llaman. Lo que sigue en este apartado describe el encargo original; del
> dibujo de Claude solo se mantiene la exigencia técnica: un SVG con cada forma por separado.

Referencia: [idea-logo-reducido.png](../imgs/idea-logo-reducido.png) e
[idea-logo-ampliado.png](../imgs/idea-logo-ampliado.png) (la marca de made_byfede).

- **Qué se toma**: el estilo.
  - Cabeza dibujada con línea negra gruesa y uniforme, extremos redondeados, pelo como masa negra,
    cara blanca y rasgos mínimos.
  - Sin sombras ni color: encaja con tus tonos y con el paso de grafito a tinta.
- **Qué no se toma**: su dibujo (pelo rizado y gafas), su composición ni la frase "made by". La
  caricatura tiene que ser **tuya** y reconocible.
- **Tus rasgos** (sacados de tus fotos):
  - Pelo corto, con degradado en los lados y algo más largo arriba.
  - Cejas oscuras y marcadas.
  - La sonrisa grande con dientes de tu foto en blanco y negro.
  - Barba corta y cuidada, con bigote.
  - Orejas visibles y cara ovalada.
  - Sin gafas, lo que además te separa de la referencia.
- **Versiones**:
  - **Reducida**: solo la cabeza, para la barra superior, el favicon y el avatar. Con menos detalle,
    para que se lea a 16–32 px.
  - **Grande**: la cabeza con "Christian Oller" en Bricolage al lado. Es la que se dibuja en la
    intro.
- **Construcción** (la que pide la animación del vídeo de referencia):
  - SVG de 512 × 512 hecho con **formas cerradas y rellenas**: el pelo, la barba, las cejas, el
    contorno de la cara (una línea gruesa convertida en forma), las orejas, los ojos y la sonrisa.
  - Cada forma en su propio trazado y con nombre. En la intro se traza su contorno y después se
    rellena.
- **En la web**:
  - En la barra, al pasar el ratón por la caricatura aparece la selección con tiradores, como en el
    resto de la web.
  - En la 404 puede reaparecer buscando el frame perdido.
  - **La foto real en blanco y negro sigue en el hero y en Sobre mí.** La caricatura es tu "boceto";
    la foto, tu "tinta".
- **Quién la dibuja** (D14): Claude hace la primera versión en SVG a partir de tus fotos y la
  afinamos juntos.

---

## 4. Sistema de movimiento

### 4.1 Principios

1. **El movimiento es la herramienta trabajando**: seleccionar, medir, entintar, hacer zoom y
   recorrer el lienzo.
2. **Se mueve la cámara, no el decorado**: en las transiciones se mueve la vista del lienzo; el
   contenido no "baila".
3. **Rápido en la mano, lento en la cámara**: las microinteracciones duran 200 ms o menos y los
   movimientos de cámara, 600–900 ms.
4. **Una coreografía por pantalla.**
5. **Nunca secuestrar el scroll** ni añadir un scroll suavizado artificial.
6. **Solo se anima** `transform`, `opacity`, `clip-path`, trazos SVG y los ejes de la fuente.
7. **Cada momento tiene su versión quieta** (el detalle de reduced motion se afina en la fase
   técnica, pero el estado final se diseña ahora).

### 4.2 Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Entradas y selección |
| `--ease-camera` | `cubic-bezier(.65, 0, .35, 1)` | Zoom y paneo del lienzo |
| `--ease-in` | `cubic-bezier(.55, 0, 1, .45)` | Salidas rápidas |
| `--spring` | `linear(0, .35 12%, .81 28%, 1.03 44%, 1.01 60%, 1)` | Tiradores, indicadores y cambio de lente (muelle con un poco de rebote) |
| `--dur-micro` | 140 ms | Hover y pulsación |
| `--dur-ui` | 260 ms | Paneles y lentes |
| `--dur-ink` | 600 ms | Entintado de titulares |
| `--dur-camera` | 800 ms | Zoom entre frames |
| `--dur-intro` | 1,8 s como máximo | Intro completa |
| `--stagger` | 50 ms | Grupos (máximo 6 elementos; a partir de ahí, en bloque) |
| `--dist` | 12 px | Desplazamiento de las entradas |

### 4.3 Momentos firma

Son cinco, cada uno con su papel. No se añade ninguno más.

**A. Intro "te dibujo"** (solo en la primera visita de la sesión)

La animación es **la del vídeo de referencia** que eligió Christian, analizada en
[analisis-video-intro.md](analisis-video-intro.md), con su caricatura y su nombre.

**De la intro de Eloi se toma el comportamiento**: sale una vez por sesión, se decide antes del
primer pintado y tiene las mismas salidas (ancla en la URL, reduced motion, ahorro de datos y
cualquier tecla o clic).

| Tiempo | Qué pasa |
| --- | --- |
| 0 ms | Lienzo liso, vacío. |
| 0–800 ms | **Trazado**: todos los contornos de la caricatura y de "made by chris" se dibujan a la vez, con línea fina de grafito. |
| 800 ms → carga | **Espera en contorno** mientras carga la web: mínimo 300 ms y máximo 1,5 s. |
| +200 ms | **Relleno**: el pelo, la barba y las letras se rellenan de tinta con un fundido. |
| +400 ms | **Espera** con la marca terminada. |
| +850 ms | **Salida** (19 nov, sustituye a D16): el iris se cierra sobre la marca y deja ver la home, y las piezas del hero entran escalonadas (suben 14 px con un fundido). Es la mecánica de la intro de eloicotonat.com, que Christian pidió expresamente; no se copian el visor, el REC ni el flash, que son el lenguaje de cámara de Eloi. |

- **Duración total**: unos 2,5 s con carga normal.
- **Visitas siguientes**: sin intro; el titular se entinta en 600 ms.

**B. Navegación: zoom entre frames con hilo de prototipo**

| Tiempo | Qué pasa |
| --- | --- |
| 0–220 ms | La cámara se aleja: el artboard baja a 0,8 de escala, aparece su nombre y se ve el lienzo alrededor. |
| 220–420 ms | Del enlace pulsado sale un hilo de prototipo (curva de grafito con flecha) hacia el borde derecho, o hacia el izquierdo si vas hacia atrás. |
| 420–640 ms | **Paneo horizontal**: hacia delante, la página actual sale por la izquierda y la nueva entra por la derecha siguiendo el hilo (de derecha a izquierda). Hacia atrás, al revés. La dirección sale del orden del menú (eso ya existe). |
| 640–860 ms | Zoom de entrada a escala 1. El nombre del frame queda fuera, arriba. |

- Hacia atrás, lo mismo invertido. La barra superior no se mueve.
- Diferencia con Eloi: él barre la pantalla con un cabezal de editor de vídeo; tú mueves la cámara
  sobre un lienzo y conectas frames, como en un prototipo de Figma.

**C. El lienzo navegable** (el "wow" que falta)

- **Apertura**: con la tecla M o el botón "Ver lienzo", la cámara se aleja de la página actual
  hasta ver el archivo entero.
- **Lo que se ve**: todos los frames (Inicio, Proyectos, los 4 casos, Sobre mí y Contacto)
  colocados como en un archivo de Figma, con los hilos de prototipo entre ellos. El frame actual
  lleva "Estás aquí".
- **Interacción**:
  - Arrastrar para moverse y rueda o pellizco para el zoom.
  - Al pasar por un frame, se selecciona con su nombre y su tamaño.
  - Al hacer clic, zoom de entrada y navegación.
- **Miniaturas**: son capturas reales de cada página.
- **Por qué**: convierte la metáfora en algo que se usa. Es la pieza que un jurado recuerda.

**D. De la tarjeta al caso** (morph)

- La imagen del proyecto (su fragmento de interfaz) crece hasta ser la cabecera del caso, el
  título viaja hasta el H1 y el resto se funde.
- 600–700 ms con `--ease-camera`. Al volver, la tarjeta regresa a su sitio.

**E. "Cómo lo veo yo"** (escena fijada en la home; tu idea, que sustituye a "Del boceto al producto")

**Planteamiento**: "Tú ves una web. Yo la veo así." Una web real y terminada, dentro de un frame, que
al hacer scroll pasa por tus tres miradas:

| Estado | Lo que se ve | Cómo se construye |
| --- | --- | --- |
| 0. La web | La web terminada, en tinta. | Una web de ejemplo neutra (D15), diseñada para la sección y hecha en HTML real. |
| 1. Como UX/UI | Se deshace en boceto: cajas de grafito donde estaba cada bloque, cotas entre ellos y la retícula. | Los trazos se generan desde el DOM, como en la intro. |
| 2. Como programador | Aparecen las etiquetas (`<header>`, `<h1>`, `<button>`), el árbol de componentes y un fragmento de código del bloque. | Leído del propio DOM. |
| 3. Como QA | Comprobaciones con su valor: contraste, tamaño táctil, `alt`, orden de encabezados, peso de la página y tiempo de carga. | Calculadas en vivo, como la lente QA. |

- **Texto**: a la izquierda, una frase corta por estado ("Como diseñador, veo la estructura", "Como
  programador, veo el código", "Como QA, veo lo que puede fallar").
- **Capa fantasma**: el estado anterior se queda medio segundo, para que se vea la transformación.
- **Puente a las lentes**: al final, "Puedes ver toda esta web así", y se resalta el control de
  lentes de la barra. La sección es el tráiler de las lentes.
- **Móvil**: los cuatro estados apilados, cada uno con su transformación al entrar en pantalla.
- **Tempora** conserva su recorrido del boceto al producto dentro de su caso (§5.4).

**Las lentes, al activarse**: las cajas de selección crecen desde el centro de cada elemento (160
ms, escalonadas 20 ms, como mucho 30 a la vez), las cotas se dibujan como trazo y aparecen las
cifras. Al cambiar de lente, cruce de 200 ms.

### 4.4 Microinteracciones

| Elemento | Hover / foco | Pulsación | Duración |
| --- | --- | --- | --- |
| Enlace de texto | El subrayado fino de grafito se entinta (más grueso, en tinta) de izquierda a derecha. | — | 200 ms |
| Botón principal (tinta) | El fondo se aclara un paso y la flecha avanza 3 px. | Escala 0,98 | 140 ms |
| Botón secundario | Fondo grafito claro. | Escala 0,98 | 140 ms |
| Tarjeta de proyecto | Selección con tiradores, píldora "W × H" y nombre de la capa; la imagen se acerca un 2 %. | — | 160 ms (muelle) |
| Enlace activo del menú | Un pequeño cuadrado de selección se desliza al nuevo enlace al cambiar de página. | — | con la transición |
| Interruptor de lentes | El indicador se desliza al segmento elegido. | — | 260 ms (muelle) |
| Modo claro / oscuro | En dos tiempos: primero cambia el lienzo y después los frames. | — | 300 ms |
| Idioma | El texto cambia con un fundido sin mover la maqueta. | — | 200 ms |
| Retrato | Selección con su nombre de archivo y tamaño. | — | 160 ms |
| Copiar el email | Una píldora "Copiado" sale desde el puntero. | — | 200 ms |
| Botón de CV | El icono del documento sale 4 px hacia abajo y vuelve, como si se imprimiera. | — | 260 ms |
| Foco con teclado | El mismo cuadro de selección que el hover (coherencia). | — | — |

### 4.5 Scroll

- Scroll nativo.
- **Entradas**:
  - Los titulares de sección se entintan (ejes de la fuente) al entrar en pantalla.
  - Los párrafos aparecen con 8 px de desplazamiento y fundido.
  - Las imágenes de proyecto se revelan con un `clip-path` de abajo arriba, como un frame que se
    rellena.
- **Sin parallax en el texto.**
- **Escenas fijadas**: una en la home (la del boceto) y, opcionalmente, una por caso.

### 4.6 Lo que nunca hará la web

Cargador con porcentaje · cursor-burbuja · botones magnéticos · texto que se desordena por todas
partes · marquesinas infinitas · inclinación 3D de tarjetas · partículas · scroll secuestrado ·
animaciones en bucle mientras se lee.

---

## 5. Página a página

### 5.0 Mapa de la web

**En todas las páginas**:
- La barra superior: caricatura reducida y nombre · Inicio, Proyectos, Sobre mí y Contacto · lentes
  y "Ver lienzo" · ES/EN · modo · CV.
- La transición de derecha a izquierda con el hilo de prototipo.
- El lienzo navegable (tecla M) y las lentes (teclas 1, 2 y 3).
- El pie como reverso del artboard.
- La intro, solo en la primera visita.

**Páginas y secciones, en orden** (igual en español y en inglés, `/en/…`):

- **Inicio** (`/`)
  1. Hero: nombre, oficio y la frase "Disfruto haciendo webs y apps. Se nota en el resultado.", tu
     foto riendo en B/N, "Ver proyectos", "Descargar CV" y disponibilidad.
  2. **Proyectos**: los 4, con Tempora primero, en frames grandes en los que se puede tocar la app.
  3. **Cómo lo veo yo**: la web que se transforma, con las tecnologías de cada mirada.
  4. Trayectoria resumida: las últimas versiones y un enlace a la cronología de Sobre mí.
  5. Contacto.
- **Proyectos** (`/projects`)
  1. Lienzo de proyectos: 4 frames con hilos hacia sus casos.
  2. Vista en lista, para leer rápido.
- **Caso** (`/projects/tempora`, `vibora`, `learnish` y `vistalo`)
  1. Cabecera (morph desde la tarjeta) · 2. Problema · 3. Boceto que se entinta · 4. Decisiones ·
     5. Código · 6. Pruebas · 7. Resultado · 8. Lo que más disfruté · 9. Siguiente proyecto.
- **Sobre mí** (`/about`)
  1. Cabecera: foto, bio y datos rápidos.
  2. **Cronología** completa (el historial de versiones).
  3. Cómo trabajo: 3 principios con un ejemplo cada uno.
  4. Herramientas: todo tu stack, agrupado por lente.
  5. Idiomas y CV.
- **Contacto** (`/contact`)
  1. Frase grande · 2. Email, LinkedIn y GitHub · 3. Formulario como componente.
- **404**: frame no encontrado, con tu caricatura buscándolo e hilos a las páginas que existen.

**Dónde va cada cosa**:
- **Foto**: en el hero de Inicio y en Sobre mí.
- **Tecnologías**: dentro de "Cómo lo veo yo" (cada mirada enseña sus herramientas) y completas en
  Sobre mí. Nunca como muro de logos.
- **Últimos proyectos**: en Inicio y en Proyectos.
- **Cronología**: resumida en Inicio y completa en Sobre mí.

### 5.1 Barra superior (la barra de herramientas)

- **Contenido**:
  - Izquierda: la marca, que es tu caricatura reducida + "Christian Oller", con selección al pasar el
    ratón (§3.8).
  - Centro: Inicio, Proyectos, Sobre mí y Contacto.
  - Derecha, en un solo grupo: las lentes y "Ver lienzo"; después ES/EN, el tema y el CV.
- **Aspecto**: color de lienzo (no de papel), para que se lea como la interfaz de la herramienta.
- **Movimiento**: quieta en todas las transiciones.
- **Densidad**: agrupada (D11), para que no se cargue.

### 5.2 Inicio, pantalla a pantalla

1. **Hero**:
   - Display a todo el ancho, en dos líneas ("Christian Oller" / "Frontend developer"), ocupando
     cerca del 60 % del alto.
   - El retrato como capa seleccionada a la derecha, montado sobre la segunda línea, como una capa
     por encima del texto en un archivo de diseño. **Tu foto riendo** (`profile.jpg` o la de la
     sesión nueva): la pasión se ve antes de leer nada.
   - Debajo: la frase "Disfruto haciendo webs y apps. Se nota en el resultado.", "Ver proyectos",
     "Descargar CV" y "Remoto · España (CET) · 17:55".
   - Movimiento: la intro en la primera visita y, en las siguientes, solo el entintado del titular
     (600 ms).
2. **Proyectos** (justo después del hero: primero los resultados):
   - Cuatro frames grandes (uno por pantalla, o dos en pantallas anchas), con Tempora primero.
   - **Se pueden tocar**: cada frame lleva una mini interacción real de la app:
     - Tempora: añadir un turno.
     - Vibora: reservar una pista.
     - Learnish: responder una pregunta.
     - Vístalo: la web real dentro de su marco.
   - Por proyecto: nombre, una línea de resultado, rol, año y stack en una línea.
   - Hover con selección y clic con morph.
3. **Cómo lo veo yo**: la escena fijada con tus tres miradas sobre una web (momento E). Cada mirada
   enseña las tecnologías que usas en ella:
   - UX/UI: Figma y Procreate.
   - Programador: Angular, React, Next.js, Astro, TypeScript, Tailwind y SASS.
   - QA: Cypress, Karma/Jasmine y Postman.
4. **Trayectoria resumida**:
   - Las últimas "versiones" en una línea cada una (Vístalo, Inology, Vueling…) y un enlace a la
     cronología completa de Sobre mí.
5. **Contacto y pie** (el reverso del artboard):
   - Una frase grande, el email (copiable), LinkedIn, GitHub y el CV.
   - El wordmark "Christian Oller" gigante al final.
   - Una línea de créditos: "Hecho en capas: boceto, diseño, código y pruebas".

### 5.3 Proyectos (índice)

- Vista de lienzo con los 4 proyectos: frames a distinto tamaño según su formato (móvil o
  escritorio) y hilos hacia sus casos.
- Una alternativa en lista, para quien quiera leer.

### 5.4 Caso (plantilla)

Cada bloque es un frame del proceso con su propia composición:

1. **Cabecera** (destino del morph): nombre, frase, rol, año, stack y enlaces.
2. **El problema**: 2–3 frases en grande.
3. **Boceto**: la pantalla clave en grafito, que se entinta al hacer scroll. En Tempora, aquí vive su
   recorrido completo del boceto al producto.
4. **Decisiones**: 2–3, con cotas y anotaciones de herramienta.
5. **Código**: un fragmento real con el componente al lado.
6. **Pruebas**: qué se probó, en insignias.
7. **Resultado**: las pantallas finales a gran tamaño, en móvil y escritorio.
8. **Lo que más disfruté**: una o dos frases tuyas sobre lo que más te gustó resolver y lo que
   aprendiste. Es donde más se nota la pasión.
9. **Siguiente proyecto**: un hilo de prototipo hacia el siguiente frame.

### 5.5 Sobre mí

- **Retrato** grande como capa (una foto distinta de la del hero) y la bio en texto grande, en 3–4
  frases.
- **Cronología completa**, como el historial de versiones de la herramienta:
  - Vístalo (2025, cofundador), Inology (jun 2023 – mar 2024), SM Medioambientales (sep – nov 2023),
    Vueling (mar – may 2023) y Pukkas (ene – ago 2022).
  - Cada una con tu papel, lo que hiciste y su stack.
  - La evolución de Angular (v8 → v21) como hilo conductor.
  - Tu formación, cuando llegue el CV.
- **Tres principios**, cada uno con un pequeño ejemplo visual (un boceto, un componente, un test),
  no tres tarjetas iguales.
- **Herramientas por lente**, agrupadas y sin muro de logos.
- **Idiomas y CV.**

### 5.6 Contacto (solo diseño)

- Una gran frase, el email copiable y los enlaces.
- El formulario se presenta como un componente dentro de su frame, con sus estados dibujados
  (vacío, escribiendo, válido y enviado). Que funcione se afina en la fase técnica.

### 5.7 404

- "**Frame no encontrado**": en el lienzo, un frame vacío con borde discontinuo y la ruta como
  nombre, con hilos hacia los frames que sí existen. Tu caricatura asoma buscándolo.

---

## 6. Móvil

- **Lienzo**: visible con 8–12 px de margen y el nombre del frame encima.
- **Hero**: display a 15–17 vw en 2–3 líneas, retrato debajo como capa y botones al alcance del
  pulgar.
- **Lentes**: en la bandeja inferior (ya existe).
- **Lienzo navegable**: una rejilla de frames a 2 columnas con pellizco para el zoom.
- **Transiciones**: zoom corto (450–500 ms); el hilo de prototipo, vertical o ninguno.
- **Escena del boceto**: estados apilados, cada uno con su entintado.
- **Proyectos**: un frame por pantalla, con el mismo morph.
- **Regla**: a 390 px tiene que verse diseñado, no "apilado".

---

## 7. Integrar · cambiar · mejorar (resumen)

**Se conserva de la web actual**: los tonos, los dos modos y la foto en blanco y negro.

| Integrar (nuevo) | Cambiar (sustituir) | Mejorar (pulir) |
| --- | --- | --- |
| Lienzo visible con nombre de frame siempre a la vista | Lápiz azul de `prototipo1` → tus tonos de siempre, con grafito para el boceto | Separación entre lienzo y papel (con tus tonos) |
| Lienzo navegable (M / "Ver lienzo") | Letra a mano → cotas y rotulación de herramienta | Jerarquía y composición del hero |
| Hilo de prototipo en la navegación | Lente QA de rotulador → insignias con valores, estilo DevTools | Secciones como pósters, una protagonista cada una |
| Morph de la tarjeta al caso | Tarjeta 3D: se quita (§8) | Escena del boceto: estados más claros y capa fantasma |
| Entintado tipográfico con los ejes de Bricolage | Playfair + Inter (de `main`) → la tipografía de §3.2, con tus tonos | Microinteracciones coherentes (hover = foco = selección) |
| Kit gráfico de herramienta (selección, cotas, guías) | Muro de 24 tecnologías → herramientas por lente | Móvil: composición propia a 390 px |
| Historial de versiones con tu trayectoria real | "Designer × Developer × QA" y frases de plantilla → textos propios | Tokens de movimiento únicos para toda la web |
| "Cómo lo veo yo": tus tres miradas sobre una web | Capturas de plantillas → tus fragmentos de interfaz y Vístalo | — |
| 404 "Frame no encontrado" | — | — |
| Retrato dirigido como capa seleccionada | — | — |
| Caricatura: marca e intro | Marca de cuadrado de selección → tu caricatura | — |

---

## 8. La tarjeta 3D: se quita (decidido)

Pediste ponerla en otra página solo si allí tenía sentido, y no lo tiene en ninguna:

- **No habla del concepto**: es una acreditación de evento, no un objeto de la herramienta (lienzo,
  frames, capas). Ni en Sobre mí, ni en Contacto, ni en el lienzo navegable cuenta algo que no cuente
  mejor tu retrato como capa seleccionada.
- **Es un recurso muy visto**: es la misma técnica (three.js + rapier + meshline) que la acreditación
  3D del evento de Vercel, que hoy circula como componente listo para usar. Un jurado la reconoce.
- **Pesa 1 MB de JavaScript** en escritorio para un solo elemento, y competiría con la intro y las
  lentes.

**En la ejecución** (rama `prototipo-def`):
- Se borran `src/components/lanyard/` y las dependencias que solo usa la tarjeta (`three`, los
  paquetes `@react-three/*` y `meshline`; también React, si ninguna otra isla lo necesita).
- **Se queda tu foto en blanco y negro**, ahora como capa seleccionada (§3.5).

---

## 9. Distancia con Eloi (en diseño)

Detalle completo en el [informe, sección B2](informe-eloi-cotonat.md#b2-dónde-se-pisan-tu-prototipo1-y-su-web).

| De Eloi | Riesgo en `prototipo1` | Qué hacemos |
| --- | --- | --- |
| Cobalto y lavanda (226–228°) | Tu lápiz azul (230–231°) | Resuelto: vuelven tus tonos, sin azul |
| Letra Caveat, notas y recuadros a mano | Architects Daughter en las notas del boceto | Decidido: cotas técnicas, sin letra a mano |
| Modo revisión con marcas rojas numeradas y archivos `.spec` | Lente QA | Insignias con valores medidos, estilo DevTools |
| Bordes de película en los márgenes | Unas posibles reglas en los bordes | Reglas solo dentro de la lente Diseño |
| Etiqueta flotante con el nombre de la página en la transición | Nombre del frame durante el zoom | El nombre vive fuera del artboard, como en Figma |
| Gran "Hablemos ↗" en el pie | Pie como reverso del artboard | Reverso + wordmark; nada de créditos de película |
| Intro "claqueta": visor, REC, código de tiempo, flash e iris | Intro con tu caricatura | Misma estructura y duración; el lenguaje es tuyo (grafito, tinta, coordenadas del lápiz y cámara del lienzo) |

---

## 10. Decisiones

### Cerradas (18 de noviembre)

| # | Decisión | Elegido |
| --- | --- | --- |
| D1 | Tarjeta 3D | Se quita (§8). |
| D2 | Color | Tus tonos de siempre, con grafito para el boceto (§3.3). |
| D3 | Anotaciones | Cotas técnicas, sin letra a mano. |
| D4 | Lienzo navegable | Completo: arrastre y zoom en escritorio, rejilla en móvil. |
| D5 | Hilo de prototipo | En cada navegación. |
| D6 | Tipografía | Bricolage Grotesque con sus tres ejes. |
| D7 | Modos | Claro y oscuro, como ahora (§3.7). |
| D8 | Retrato | Sesión nueva en blanco y negro. Mientras tanto, `profile.jpg`, que ya es de estudio y en B/N. |
| D9 | Primer proyecto | Tempora. |
| D10 | Demo de lentes | Sí: se convierte en "Cómo lo veo yo" (§4.3 E). |
| D11 | Barra superior | Agrupada. |
| D12 | Idioma para el jurado | Inglés. |
| D13 | Color funcional | Verde y rojo solo como estado. |
| D14 | Quién dibuja la caricatura | Claude hace una primera versión en SVG a partir de tus fotos y la afinamos juntos. |
| D15 | Web de "Cómo lo veo yo" | Una web de ejemplo neutra, diseñada para la sección. |
| D16 | Final de la intro | ~~La caricatura viaja a la barra.~~ Cambiado el 19 nov: sale con el iris de eloicotonat.com (cierre en círculo sobre la marca) y el hero entra escalonado. |
| D19 | Marca | La caricatura de Christian + "made by chris" en Bricolage Grotesque. Descartadas las 10 parejas de Adobe Fonts y "Christian Oller" como texto de la marca. |
| D20 | Oficio del titular (18 nov) | "Software developer" en lugar de "Frontend developer": ya no hace solo webs ni solo frontend. Los tres oficios, "Diseñador × Desarrollador × QA" (viene de su portfolio anterior), van encima del nombre y cada uno activa su lente. |
| D22 | Texto y foto del hero, separados (20 nov) | Christian no quiere letras encima de la foto. En escritorio el texto (oficios, nombre, oficio, frase y botones) vive en su columna, hasta el 54 % del ancho, y la foto en la suya, desde el 58 %. El titular baja de unos 150 px a 118 px a 1440 y "Software developer" va en dos líneas ("Software" / "developer"): en una sola tendría que bajar a 85 px. En móvil la foto sigue arriba y el texto empieza donde ella ya es transparente. Sustituye al "oficio que cruza la chaqueta" de D21; la foto y los colores no cambian. |
| D23 | Barra dentro de la página (20 nov) | La barra deja de ser una franja aparte en color de lienzo: es la primera fila del artboard (papel, el ancho del frame, contenido alineado con las secciones) y se queda quieta en el paneo, como antes. El nombre del frame ya no va encima del artboard: sale en la barra de estado de las lentes, en el lienzo (M) y en la 404, donde el frame es lo que falta. El lienzo sigue a la vista en los márgenes de los lados, en el paneo y en "Ver lienzo". Cambia §3.1 ("nombre del frame siempre visible") y §5.1 ("color de lienzo"). |
| D21 | Retrato del hero (18–19 nov) | Sustituye a "capa seleccionada en su rectángulo" (§3.5 y §5.2), que Christian vio como "una foto plana ahí tirada". La foto es la de la luz roja **en los dos modos** y va fundida en el fondo, sin caja ni panel, como en la página "nosotros" de Vístalo. En oscuro, la foto tal cual (`card.jpg`) se desvanece en el papel oscuro. En claro, el hero es claro y se usa una **versión "de día" de esa misma foto** (`card-light.jpg`): la pared pasa a blanco y se conservan la franja de luz roja y la sombra en la pared, que son las que evitan que la figura quede "de pegote". Descartado por él, en este orden: hero oscuro también en claro; una foto distinta por modo (`profile.jpg` en claro); panel oscuro con borde recto en claro; la figura recortada sola sobre blanco ("casi", pero "pegote"). **Cambiado el 20 nov (D24)**: la versión clara ya no lleva franja ni sombra; va sobre gris. |
| D24 | Foto clara del hero, sobre gris (20 nov) | Sustituye a la versión "de día" de D21. Christian quiso quitar la sombra y la franja de luz roja de la pared, y un fondo algo más gris que el blanco. `card-light.jpg` es ahora la figura de `card.jpg` sobre un gris claro (#e0e0e0 en lo más hondo, detrás de los hombros) que se abre a blanco hacia arriba y hacia los lados. Arriba, donde la foto asoma bajo la barra, ya es papel, así que no hay corte, y las máscaras del hero no cambian. El gris hace de pared: es lo que evita el "pegote" de la figura sola sobre blanco. La luz roja de la cara se queda (es de la foto) y el texto no cambia de color, porque desde D22 no pisa la foto. **Aprobada el 20 nov; con D25 el fondo de la foto pasa a ser transparente** (`card-light.webp`) para que se vea la hoja. |
| D25 | Hoja con textura de papel (20 nov) | Christian vio en carterogunsola.com/writing un fondo que le gusta en los dos modos y lo quiso en toda la página, **fijo, sin la estela que allí deja el ratón**. La página deja de ser un color plano: es una hoja (`--sheet`) con una textura de papel propia (trama de puntos de imprenta, manchas muy suaves y grano), que es una imagen que se repite, no un shader. En claro la hoja pasa de blanco a gris (`#d6d6d6`); en oscuro conserva su tono (`#171717`) y gana la trama. `--paper` se queda como la superficie limpia de las piezas (tarjetas, campos, ventanas de interfaz), que ahora resaltan sobre la hoja. De la referencia se toma la idea, no el código, y no se añaden sus líneas de pliegue: aquí cruzarían titulares y tarjetas. Cambia §3.3 (el papel ya no es blanco) y arrastra: lienzo claro más oscuro que la hoja (`#c6c6c6`), bordes (`#b6b6b6`) y grafito (`#74747a`) más oscuros en claro para conservar su contraste, y las dos fotos de persona en claro se funden con la hoja (la del hero, con fondo transparente; la de Sobre mí, multiplicada). La foto del hero en oscuro no cambia. **La hoja cubre la página de borde a borde** (pedido el mismo día): ya no hay márgenes de lienzo a los lados; el lienzo queda para el paneo entre páginas, "Ver lienzo", la 404 y las franjas de Proyectos y Contacto. Cambia §3.1 (el frame ya no se ve sobre el lienzo en reposo). **La barra no termina en línea recta**: al hacer scroll, lo que pasa por debajo se desvanece en una franja de la misma hoja. Aprobada el 20 nov. |
| D26 | Selectores de tema e idioma (20 nov) | De la misma web de referencia le gustó el selector de día y noche y quiso el mismo para ES / EN. Los dos son ahora una sola pieza (`.seg`): una bandeja con las dos opciones a la vista y una marca bajo la activa, que se desliza de una a otra. Se copia la idea, no la forma: **esquinas rectas y sin sombra**, como el resto de la barra (elegido por Christian frente a "redondeados como los suyos"), a juego con la bandeja de lentes. No se aplica a los botones de acción (CV, Ver proyectos, Ver lienzo): la pieza es para elegir entre dos estados. Por debajo de 480 px no caben en la barra y van dentro del menú. Sustituye al icono único de tema y a las dos siglas sueltas de §5.1. |
| D27 | Lentes y lienzo en el bocadillo "Cómo lo veo yo" (20 nov) | A Christian las lentes y el lienzo le gustan, pero en la barra le cargaban toda la web. Salen de la barra de escritorio y van en un solo elemento: **su caricatura, fija abajo a la izquierda, con un bocadillo de cómic** ("Cómo lo veo yo"). Al pulsarla se abre con Diseño, Código, QA y Ver lienzo, cada uno con su tecla (1, 2, 3 y M, las de siempre), y con "Vista normal" cuando hay una lente puesta. La idea del bocadillo es suya; se descartó un riel lateral como el índice de secciones de poulo.site (no dice qué hace) y se probó a media altura a la izquierda, donde pisa el titular. El bocadillo va dibujado con la tinta de la caricatura, que es un dibujo suyo, y en la letra de la web (se compararon Balsamiq Sans y Comic Neue: habrían sido una tercera familia). No es el cuaderno a mano de Eloi (B4): no hay rotulador, notas ni letra manuscrita. El bocadillo solo se ve con la página arriba del todo y al pasar el ratón o enfocar la caricatura; con la página movida o una lente puesta queda la cabeza sola, para no tapar contenido. Las lentes siguen funcionando en toda la web. Cambia §5.1: la barra queda en marca, menú y preferencias (idioma y tema; el botón de CV también salió, porque el CV ya está en el hero, en Sobre mí y en el pie). **Ajustes del mismo día**: la frase pasa a ser una invitación, "¿Quieres verlo como yo?" ("Want to see it my way?"), propuesta por Christian; el bocadillo cerrado toma la forma del abierto (rectángulo de esquinas blandas, no óvalo); y las lentes y el lienzo salen también del menú de móvil, así que el bocadillo es la única entrada en todos los tamaños. Pendiente: una segunda cara, contenta (ojos en U invertida), que dibuja él, para que no sea la misma de la marca. |
| D28 | La marca de la barra es una firma (20 nov) | Con la caricatura en el bocadillo de abajo (D27), tenerla también arriba a la izquierda con "made by chris" le resultó repetitivo: sale además en la intro. La marca de la barra pasa a ser **"Chris" escrito a mano**. De doce letras de prueba eligió la tercera, **Rock Salt, "de momento"**. No se carga como tercera familia: la palabra está guardada como imagen (`src/assets/images/brand/chris.webp`, hecha con `.taste-skill/letras/firma.mjs`) y se usa de máscara, así toma la tinta de cada modo. **Lo recomendado y pendiente: sustituirla por su propia firma**, escrita con rotulador y trazada como la caricatura; una fuente de rotulador la tiene cualquiera y se acerca al cuaderno de Eloi (B4), una firma suya en un solo sitio no. La intro sigue dibujando la caricatura con "made by chris": queda por decidir si pasa a escribir la firma. Cambia §3.8 (la marca) y §5.1. |

### Abierta

| # | Decisión | Opciones | Mi recomendación |
| --- | --- | --- | --- |
| D18 | Algo de three.js (lo pide Christian; se mira al final, en E5) | Una pieza 3D propia del concepto · nada | **Decidido el 19 nov: la vista explosionada**, como cierre de "Cómo lo veo yo" (las cuatro capas de la web de ejemplo en el espacio). Antes: Ideas que encajarían: los frames del lienzo navegable en perspectiva 3D, o las capas de un proyecto separándose en el espacio ("vista explosionada"). La tarjeta colgante no vuelve. |
| D17 | Laboratorio: una página con experimentos que haces por gusto | Sí, más adelante · no | Más adelante, cuando lo principal esté de 10: es la prueba más clara de que disfrutas. |

---

## 11. Cómo trabajaremos y cuándo estará "de 10"

### Etapas de diseño

La lista detallada de tareas, con casillas para ir marcando, está en
[roadmap-prototipo-def.md](roadmap-prototipo-def.md).

| Etapa | Qué se hace | Se da por terminada cuando… |
| --- | --- | --- |
| **E0** | Cerrar D14–D16 y limpiar: quitar la tarjeta 3D, la letra a mano y el azul, y recuperar la trayectoria. (El vídeo de referencia de la intro se deja para el final.) | Las decisiones están cerradas y la limpieza, hecha. |
| **E1** | Sistema: tokens nuevos (color, tipo, espacio, movimiento), el kit gráfico y la caricatura (reducida y grande), en una página interna de muestra donde se ve todo junto. | La página de muestra pasa la rúbrica 5 y 6. |
| **E2** | Barra, lienzo visible y hero. | La primera pantalla pasa toda la rúbrica. |
| **E3** | Momentos firma: intro con la caricatura, transición con hilo, "Cómo lo veo yo", lienzo navegable y morph. | Grabados a 0,25× no tienen saltos ni solapes raros. |
| **E4** | Resto de la home, casos y páginas. | Cada pantalla es un póster con su protagonista. |
| **E5** | Móvil y pulido de las microinteracciones. | A 390 px se ve diseñado. |
| Fase técnica | SEO, accesibilidad, formularios, cookies, rendimiento y tests (§12). | Después de E5. |

### Rúbrica "de 10"

1. **Prueba del competidor**: ¿podría ser la web de otra persona? Tiene que ser que no.
2. **Prueba del póster**: cada pantalla, en captura, tiene un protagonista claro.
3. **Prueba de los 5 segundos**: quién eres, qué haces, tus proyectos y tu CV, sin activar nada.
4. **Prueba de cámara lenta**: cada momento firma, grabado a 0,25×, es limpio.
5. **Prueba de coherencia**: hover, foco, selección, lentes y transiciones hablan el mismo idioma.
6. **Prueba de densidad**: como máximo dos tamaños más el display por pantalla, y ni eyebrows, ni
   numeraciones, ni chips repartidos.
7. **Prueba de Eloi**: nada de la lista B4 del informe.
8. **Inspector de la skill**: 0 FAIL a 1440, 768 y 390 px.
9. **Prueba del móvil**: diseñado, no apilado.
10. **Prueba de memoria**: lo que alguien recuerda al día siguiente debería ser "el lienzo" y "las
    lentes".

---

## 12. Aparcado para la fase técnica

Encontrado al revisar la web publicada; no es de diseño y se afina después:

- **Formulario**: el de producción envía a `formspree.io/f/YOUR_FORM_ID`, sin configurar, así que
  los mensajes no llegan.
- **Proyectos de ejemplo inventados** publicados en producción (EcoMarket Marketplace, TaskFlow
  Analytics, SkyLink Intranet), con clientes inventados. Es también un tema de contenido y conviene
  retirarlo pronto.
- **Dominio**: `canonical`, `hreflang` y el sitemap apuntan a christianoller.dev sin www, que
  redirige a www.christianoller.dev. Además, el `hreflang` del inglés va sin barra final (`/en`).
- **Otros pendientes técnicos**:
  - La 404 es la de serie de Vercel.
  - La escena 3D pesa 1 MB de JavaScript en escritorio (desaparece al quitar la tarjeta).
  - No hay datos estructurados, cabeceras de seguridad, manifest ni `llms.txt`.
- **Accesibilidad**: el contraste de las etiquetas de proyecto en `main` es de 2,9:1, y falta
  diseñar la versión de reduced motion de cada momento.
- **Contacto**: "Córdoba, España" en la página de contacto (decidiste presentarte en remoto) y un
  asunto del formulario pensado para clientes (UI/UX, identidad de marca) cuando el objetivo es que
  te contrate una empresa.
- **Resto de la fase técnica**: SEO, cookies y analítica sin cookies, tests de Playwright y
  presupuesto de rendimiento (ver la sección B5 del informe de Eloi).
