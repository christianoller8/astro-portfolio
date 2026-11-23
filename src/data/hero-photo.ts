import { getImage } from 'astro:assets';
import portraitDark from '@/assets/images/card-dark.jpg';
// Prueba (20 nov): en claro, la misma foto con su pared gris que en oscuro. Antes: card-light.webp
import portraitLight from '@/assets/images/card-dark.jpg';

/**
 * La foto del hero, en un solo sitio para que Hero.astro (el <img>) y Layout.astro (el preload del
 * <head>) pidan exactamente lo mismo: si el srcset del preload no coincide byte a byte con el del
 * <img>, el navegador descarga la foto dos veces.
 *
 * - widths: 720 y 800 son los escalones de los móviles de 1,75 y 2 de densidad (392 px * 1,75 = 686;
 *   370 px * 2 = 740), que antes saltaban de 640 a 960.
 * - sizes: el ancho real de la foto. En móvil ocupa el ancho menos los márgenes (20 px en 375 y 412,
 *   34 px en 720); a partir de 734 px de pantalla pasa a su columna (43,6 % del ancho) y se queda en
 *   unos 600 px desde los 1440. Medido en 320-2560 px; nunca por debajo de lo real, para no emborronarla.
 */
export const heroPhotoOptions = {
  widths: [640, 720, 800, 960, 1342],
  sizes: '(min-width: 1440px) 600px, (min-width: 734px) 44vw, calc(100vw - 20px)',
} as const;

export const heroPhotoSources = {
  light: portraitLight,
  dark: portraitDark,
} as const;

/** Lo que lleva el preload de cada tema: el srcset y el sizes que Astro pinta en su <img> */
export async function heroPhotoPreload() {
  const entries = await Promise.all(
    (['light', 'dark'] as const).map(async (theme) => {
      const image = await getImage({
        src: heroPhotoSources[theme],
        widths: [...heroPhotoOptions.widths],
        sizes: heroPhotoOptions.sizes,
      });
      return [theme, { srcset: image.srcSet.attribute, sizes: heroPhotoOptions.sizes }] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<'light' | 'dark', { srcset: string; sizes: string }>;
}
