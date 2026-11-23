/**
 * La captura de un proyecto (hoy, la de Vístalo) y el ancho al que se ve en cada sitio. Medido en
 * 320-2560 px; los sizes nunca quedan por debajo de lo real (la imagen saldría borrosa) y van unos
 * puntos por encima. La fuente mide 1440 px.
 *
 * - stack: la tarjeta del inicio (en 375 px son 291; 328 en 412; 1157 en 1440 y 1144 desde los 1600)
 * - list: las cajas de /projects/ y su vista de lienzo (en 412 px son 352; 693 en 1440; 686 desde 1920)
 * - case: la cabecera de la página del caso (352 en 412; 1197 en 1440; 1184 desde 1600)
 * - next: el "siguiente caso" del pie de la página del caso (en 1440 px son 544, el tope)
 */
export const projectImageWidths = [480, 640, 800, 960, 1200, 1440];

export const projectImageSizes = {
  stack: '(min-width: 1440px) 1160px, (min-width: 600px) 85vw, calc(100vw - 64px)',
  list: '(min-width: 1100px) min(51vw, 700px), 88vw',
  case: '(min-width: 1440px) 1200px, 88vw',
  next: '(min-width: 1024px) min(43vw, 550px), 88vw',
} as const;

export type ProjectImageFit = keyof typeof projectImageSizes;
