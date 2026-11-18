# Análisis del vídeo de referencia de la intro

- **Vídeo**: `docs/videos/animacion-entrada.mov` (11,2 s, 860 × 1514, grabación con el móvil de un
  portátil; es un reel de made_byfede titulado "Animación de carga para tu portfolio").
- **Fecha**: 18 de noviembre de 2026.
- **Para qué**: Christian quiere esta misma animación como intro, con su caricatura y su nombre.
- **Cómo**: fotogramas extraídos cada 50 ms (y cada 33 ms en el trazado) con Chrome sin interfaz.
  Hojas de contactos en `.taste-skill/video/` (solo en local): `hoja-b1.jpg` y `hoja-b2.jpg` (primera
  pasada), `hoja-c.jpg` (segunda) y `hoja-d.jpg` (primer plano del trazado).

## Qué es

Una **pantalla de carga**: el logo (la cabeza y el texto "made by fede") se dibuja en contorno sobre
fondo oscuro, se rellena y da paso a la web. En el vídeo sale dos veces (1,7–4,3 s y 6,3–7,9 s).

## La secuencia, medida en la primera pasada

| Tiempo | Dura | Qué pasa |
| --- | --- | --- |
| 0 ms | — | La pantalla se queda en el color de fondo, vacía. |
| 0–800 ms | 800 ms | **Trazado**: aparecen a la vez muchos trazos finos, repartidos por la cabeza y por todas las letras, y crecen hasta cerrar cada contorno. |
| 800–1700 ms | 900 ms | **Espera en contorno**: el logo completo, solo en línea fina. Es el tiempo de carga (en la segunda pasada esta espera dura unos 200 ms). |
| 1700–1900 ms | 200 ms | **Relleno**: el pelo, la cara y las letras se rellenan con un fundido. Es el momento de "se pinta el pelo". |
| 1900–2300 ms | 400 ms | **Espera con el logo terminado.** |
| 2300–2550 ms | 250 ms | **Salida**: la pantalla de carga se funde y debajo aparece la web. El logo se desvanece en su sitio, sin moverse. |

Total: unos 2,5 s con carga lenta y unos 1,5 s con carga rápida.

## Cómo está hecho (lo que explica que se vea así)

1. **El logo son formas rellenas, no líneas.** Las líneas gruesas del dibujo (el contorno de la cara,
   las gafas) son formas cerradas. Por eso, en la fase de contorno, cada línea gruesa se ve como una
   línea doble: se está trazando el borde de la forma.
2. **Todos los contornos se dibujan a la vez**, no una parte detrás de otra. No hay un "lápiz" que
   recorra el dibujo: a los 70 ms ya hay trocitos de trazo en el pelo, en las gafas y en cada letra.
3. **Cada contorno crece desde varios puntos**, porque las formas tienen varios subtrazados (el borde
   exterior y los huecos interiores) y cada uno empieza en su propio origen.
4. **Ritmo del trazado**: casi constante, con una frenada suave al final. A un tercio del tiempo hay
   dibujado un tercio; a los dos tercios, unos dos tercios.
5. **La línea** es fina y uniforme (alrededor del 1,5 % de la altura del logo), con extremos
   redondeados, del mismo color que el relleno final.
6. **El texto también se traza en contorno** y luego se rellena, igual que el dibujo.
7. **El relleno es un fundido** de opacidad de unos 200 ms; no es un barrido ni un "pintado" con
   dirección. El contorno se queda debajo.
8. **Composición**: fondo liso, logo centrado y pequeño (ocupa cerca de un tercio del ancho), sin
   ningún otro elemento.

## Cómo se traduce a tu intro

**Igual que en el vídeo**:
- Fondo liso con la caricatura y "Christian Oller" centrados, y nada más.
- Todos los contornos se trazan a la vez en 800 ms, con línea fina.
- Espera en contorno mientras carga la web (mínimo 300 ms, para que se vea).
- Relleno con un fundido de 200 ms: se pintan el pelo, la barba y las letras.
- Espera breve con la marca terminada (400 ms).

**Lo que cambia, y por qué**:

| En el vídeo | En tu web | Motivo |
| --- | --- | --- |
| Cabeza con rizos y gafas, "made by fede" | Tu caricatura y "Christian Oller" | Es tu marca. |
| Contorno y relleno del mismo color | Contorno en grafito y relleno en tinta | Es tu idea: del lápiz a la tinta. Se puede dejar todo en tinta si lo prefieres idéntico. |
| El logo se desvanece en su sitio | La marca viaja a la barra superior (D16) | Lo elegiste así. Se puede volver al fundido del vídeo: se decide al construirla en E3. |
| Siempre que carga la página | Solo la primera visita de la sesión | Como la de Eloi: no molesta al navegar. |
| Blanco sobre oscuro | Según el modo: tinta sobre lienzo claro, o claro sobre lienzo carbón | Tus dos modos. |

**Se descarta de mi propuesta anterior**:
- Dibujar las partes una detrás de otra (contorno, pelo, orejas…): en el vídeo va todo a la vez.
- Las coordenadas de la punta del lápiz: no hay una punta que seguir.

## Qué exige a la caricatura

- **Formas cerradas y rellenas**: el pelo, la barba, las cejas, el contorno de la cara (como una
  línea gruesa convertida en forma), las orejas, los ojos y la sonrisa. Así el contorno sale con esa
  línea doble y el relleno "pinta" cada pieza.
- **Cada forma, un trazado**, con el mismo grosor de línea en la fase de contorno.
- **El nombre**, en Bricolage: el texto SVG admite la misma animación de contorno y relleno, así que
  no hace falta convertirlo a trazados.
- **Dos tamaños**: la versión grande es la de la intro y la reducida, con menos detalle, la de la
  barra.

## Técnica prevista

- SVG en línea. Cada forma lleva `pathLength="1"`, y el trazado es una animación de
  `stroke-dashoffset` de 1 a 0, la misma para todas, de 800 ms.
- El relleno es una transición de `fill-opacity` de 0 a 1 en 200 ms.
- La espera en contorno termina cuando la página está lista (fuentes e imagen del hero), con un
  mínimo de 300 ms y un máximo de 1,5 s.
- Con `prefers-reduced-motion` no hay intro.
