# Transición entre páginas con el personaje

- **Fecha**: 19 de noviembre de 2026.
- **De dónde sale**: idea de Christian. Sustituye al "hilo de prototipo" del plan (§4.3 B) como
  momento firma de la navegación.
- **El personaje**: su "emoji" de cuerpo entero (sudadera negra, vaqueros y zapatillas), dibujado
  por él: `docs/imgs/emoji-chris.jpg`.

## Lo que quiere

- Al cambiar de página, la página se desplaza en horizontal:
  - Hacia delante en el menú: de derecha a izquierda, con el personaje **empujando**.
  - Hacia atrás: de izquierda a derecha, con el personaje **arrastrando** (tira de la página).
- Más adelante, también de arriba abajo.
- Como la entrada de huyml.co, **pero más fluida**.

## La referencia: huyml.co (entrada)

Grabada fotograma a fotograma (`.taste-skill/huyml/hoja-entrada.jpg`, solo en local).

- Una cortina negra tapa la web. Un personaje pequeño, de perfil, la **empuja** hacia la derecha
  andando, y detrás va apareciendo la página blanca con el nombre.
- Dura unos 2,8 s. La cortina avanza a tirones, al ritmo de los pasos: por eso se ve poco fluida.
- **Cómo está hecha**: la web es de Framer y carga un archivo `.riv`, es decir, el personaje es un
  **muñeco articulado en Rive** (piezas vectoriales con huesos), no una secuencia de dibujos.

## Dos maneras de hacerlo

| | A · Fotogramas dibujados | B · Muñeco por piezas (recomendada) |
| --- | --- | --- |
| Qué dibuja Christian | Unos 16 dibujos de perfil: 8 del ciclo de empujar y 8 del de arrastrar | Un solo personaje de perfil, separado en unas 10 piezas |
| Quién anima | Él, dibujo a dibujo | Claude, moviendo las articulaciones con código |
| Fluidez | 12 dibujos por segundo: aspecto de dibujo animado clásico | 60 por segundo, y al ritmo exacto de la página |
| Empujar y arrastrar | Dos ciclos distintos | Las mismas piezas, otra pose |
| Arriba y abajo (futuro) | Más dibujos | Las mismas piezas |
| Aspecto | El más artesanal | De recortable, como la referencia |
| Peso | 16 imágenes | 10 piezas pequeñas |

**Recomendación: B.** Es lo que hace la referencia, da el movimiento más fluido (que es lo que
pide), le ahorra dibujar ciclos de andar de perfil, que es lo más difícil de la animación, y deja
hecho el personaje para más animaciones.

## Lo que hace falta para B

- **Vista**: de perfil estricto, mirando a la derecha (para la otra dirección se voltea), de pie,
  con brazos y piernas casi rectos y separados del cuerpo.
- **Piezas, cada una en su capa** y dibujada entera, también la parte que queda tapada:
  1. Cabeza (con el cuello).
  2. Torso (la sudadera, con la capucha).
  3. Cadera (el bajo de la sudadera y la cintura del pantalón).
  4. Brazo: parte de arriba.
  5. Antebrazo.
  6. Mano abierta (para empujar).
  7. Mano cerrada (para tirar).
  8. Muslo.
  9. Pierna (de la rodilla al tobillo).
  10. Zapatilla.
- El brazo y la pierna del otro lado son copias de estos.
- **En las articulaciones** (hombro, codo, muñeca, cadera, rodilla, tobillo): cada pieza acaba en
  redondo y se monta sobre la siguiente, sin sombras que crucen la unión.
- **Formato**: lo mejor, vectorial desde Figma (SVG con las capas con nombre). Si es de Procreate,
  el archivo con capas o un PNG transparente por pieza, todas en el mismo lienzo (unos
  2000 × 2500 px).
- **Opcional**: una segunda cabeza con cara de esfuerzo.

## Lo que haría falta para A

- 8 dibujos del ciclo de empujar y 8 del de arrastrar, de perfil, mirando a la derecha.
- Mismo lienzo, pies siempre sobre la misma línea, PNG transparente, unos 800 px de alto.
- Opcional: 2 o 3 dibujos de arranque y de parada.

## Diseño previsto de la transición

- El personaje va en la junta entre la página que sale y la que entra, y mira siempre hacia donde
  va la página que empuja.
- Duración: alrededor de 1 s (la de la referencia, 2,8 s, es demasiado para navegar).
- La página se mueve de forma continua; los pasos del personaje se ajustan a ese avance, no al
  revés. Eso es lo que la hace más fluida que la referencia.
- Con "reducir movimiento": un fundido, sin personaje.

## Lo construido (19 nov)

Christian eligió B y pasó las piezas en una lámina: `docs/imgs/emoji-piezas.jpg` (las 10 piezas y
la cabeza de esfuerzo, de perfil, con rótulos).

- **Piezas**: `.taste-skill/personaje/piezas.cjs` detecta cada dibujo de la lámina, quita el fondo
  blanco y los rótulos y guarda un PNG transparente por pieza en `src/assets/character/`. El blanco
  de la piel y de la suela se conserva; el borde se trata como línea negra con transparencia, para
  que no quede filo blanco sobre fondos oscuros.
- **Copia de las imágenes del avatar** en `docs/imgs/avatar/` (lo pidió Christian el 19 nov): las
  once piezas recortadas, la hoja de piezas sobre gris (`piezas-recortadas.jpg`) y los ciclos en
  ocho fases (`ciclos-ocho-fases.jpg`). La web usa las de `src/assets/character/`; si se
  regeneran las piezas, hay que volver a copiarlas aquí.
- **Muñeco**: `src/data/character-rig.ts` (escala, pivote y articulaciones de cada pieza) y
  `src/components/character/Character.astro` (las piezas anidadas por sus articulaciones). El brazo
  y la pierna de detrás son copias, un punto más oscuras.
- **Movimiento**: `src/scripts/character.ts`. Tres poses: de pie, empujando (inclinado, brazos
  estirados, palmas abiertas) y arrastrando (echado atrás, puños, andando de espaldas). El ciclo de
  andar dobla la rodilla en el paso, levanta el talón al impulsar y apoya siempre la suela más baja
  en el suelo, de ahí sale el bote del cuerpo.
- **Transición**: las páginas son frames en fila sobre el lienzo, con un hueco entre uno y otro
  donde va el personaje (`Pusher.astro`). Al navegar panea todo a la vez: las dos páginas y el
  hueco se mueven en el compositor con la misma curva (`global.css`, `::view-transition-*`), y
  `frames.ts` mueve las piernas al paso de ese avance. Hacia delante empuja la página que sale;
  hacia atrás tira de la que entra.
  - Duración: 1350 ms. Entre cuatro y seis pasos, según el ancho.
  - Tamaño del personaje: el 46 % del alto de la ventana (como mucho el 60 % del ancho en móvil).
  - En oscuro lleva un filo claro alrededor, como la pegatina de la marca.
  - Con "reducir movimiento" o sin View Transitions, no hay paneo ni personaje.
- **Página de pruebas**: `/personaje` (fuera de buscadores): el muñeco de pie y en sus dos ciclos.
  Con `?fase=120` se congela en una fase.
- **Capturas** (a cámara lenta): `.taste-skill/def/e3-transicion-ida.jpg`,
  `e3-transicion-vuelta.jpg` y `e3-transicion-movil.jpg`.

## Lo que falta para la excelencia (pedido a Christian el 19 nov)

Imprescindible:

1. **Las piezas sueltas y sin rótulos**, cada una en su archivo con fondo transparente (o el archivo
   con capas), al doble de tamaño. Ahora salen de un JPEG de 2000 px: en pantallas retina se quedan
   justas y el JPEG deja algo de ruido en los bordes.
2. **Todas a la misma escala**, o un dibujo del personaje entero de perfil ya montado. Las
   proporciones entre piezas están puestas a ojo a partir del dibujo de frente.
3. **La pierna (de rodilla a tobillo) recta**. Está dibujada con la rodilla doblada, y al girar
   hace un bulto en la rodilla.
4. **Una mano agarrando**, vista de lado, con los dedos rodeando un canto. El puño cerrado no
   agarra nada.

Para subir el detalle:

5. La capucha y los cordones como piezas aparte, para que boten.
6. Una zapatilla con la puntera doblada (el momento de impulsar).
7. Más caras: ojos cerrados de esfuerzo, alivio al terminar y una mirando al frente.
8. Efectos en su estilo: gotas de sudor y dos o tres nubecillas de polvo en los pies.

## Segunda lámina y muñeco rehecho (19 nov)

Christian pasó una segunda lámina, `docs/imgs/emoji-piezas-2.jpg`, con casi todo lo pedido: el
personaje entero de perfil, cuatro caras, el torso sin capucha, la capucha y los cordones aparte,
brazo, antebrazo, cuatro manos (abierta, dos puños y una agarrando), muslo con cadera, la pierna
entera recta, zapatilla normal y con la puntera doblada, gotas de sudor y nubecillas de polvo.

- **Recorte**: `.taste-skill/personaje/piezas2.cjs` (`detectar.cjs` lista y numera los dibujos de
  una lámina). Arreglos propios: a la mano que agarra se le quitan las rayas del canto; de la
  pierna entera se usa la mitad de abajo (de la rodilla al tobillo); las gotas de sudor son
  demasiado pequeñas en la lámina y se dibujan en SVG con el mismo trazo.
- **Proporciones**: medidas en el personaje de perfil de la lámina (cabeza 24 %, hombro al 30 %,
  cadera al 58 %, rodilla al 75 %, tobillo al 90 %). Ya no van a ojo.
- **Muñeco** (`character-rig.ts`, `Character.astro`): desaparece la pieza de cadera (va dibujada
  en el muslo); la pierna es recta, sin el bulto de la rodilla; el antebrazo va por delante del
  brazo para tapar el corte del codo.
- **Variantes** por atributo: cara (`calm`, `strain`, `relief`, `front`), manos (`open`, `fist`,
  `grip`) y zapatilla (`flat`, `bent`).
- **Detalle nuevo**:
  - La capucha y los cordones van con retraso respecto al cuerpo: botan con cada paso.
  - La zapatilla de la puntera doblada entra en el momento de impulsar.
  - Al empujar, palmas abiertas; al tirar, las manos que agarran. La cara es la de esfuerzo con
    los ojos cerrados.
  - Una nubecilla de polvo cada vez que un pie termina su apoyo, y un par de gotas de sudor por
    ciclo (`animate()` en `character.ts`).
- **Sin usar todavía**: las caras de alivio y de frente (quedan listas para la 404, el pie o un
  estado de reposo) y el puño.
- **Copia en `docs/imgs/avatar/`**: las piezas nuevas; las de la primera lámina pasan a
  `docs/imgs/avatar/v1/`.

Lo que aún mejoraría el resultado, sin ser imprescindible: la misma lámina a más resolución (las
piezas dan lo justo para pantallas retina al tamaño máximo) y una cara de esfuerzo de perfil
estricto, para alternarla con la de ojos cerrados.

## Ajustes tras verlo Christian (19 nov)

Le gustó mucho, con tres pegas:

1. **Las manos quedaban separadas de la página.** Ahora la posición del personaje se calcula en
   cada instante a partir de dónde cae la mano (`handContact()` en `character-rig.ts`): la palma, al
   empujar, o el hueco de la mano que agarra, al arrastrar, quedan siempre justo en el canto del
   frame, un punto montadas sobre la página. Ya no hay distancias puestas a ojo.
2. **No distinguía el arrastre del empuje**, porque en los dos el personaje miraba a la izquierda.
   Ahora, al volver, mira a la derecha (hacia donde va), camina hacia delante muy inclinado y lleva
   la página a rastras con los dos brazos estirados hacia atrás. La mano se voltea para que no quede
   boca abajo.
3. **"He perdido la animación de entrada".** No estaba rota: solo salía una vez por sesión. Ahora
   sale **cada vez que se carga la home** (al entrar o al recargar), y no al llegar a ella navegando
   desde otra página. Cambia lo que decía el plan (una vez por sesión, como Eloi).

Hojas de muestra, también en `docs/imgs/avatar/`: `transicion-ida.jpg`, `transicion-vuelta.jpg`,
`transicion-movil.jpg` y `ciclos-ocho-fases.jpg`.

## Cambio de idioma (19 nov)

Idea de Christian: que el cambio de idioma también tenga dirección, para que se sienta que empujas
para ir a un idioma y que vuelves al que tenías con la otra animación.

- **ES → EN**: avanza. El personaje empuja la página en español y entra la inglesa.
- **EN → ES**: regresa. El personaje arrastra la página en español de vuelta.
- Vale en cualquier página, no solo en la home. Sustituye a lo que decía el plan para el idioma
  (un fundido del texto sin mover la maqueta).
- Está en `frames.ts`: si cambia el idioma, manda el idioma; si no, el orden del menú.
- Muestra: `docs/imgs/avatar/transicion-idioma.jpg`.

## Velocidad (19 nov)

Christian la quiso "un pelín más lenta": la duración pasa de 1350 ms a **1600 ms** (`--dur-pan` en
`global.css`; `frames.ts` la lee de ahí, así que es el único sitio que hay que tocar).
