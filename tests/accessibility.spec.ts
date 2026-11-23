import { expect, test } from '@playwright/test';
import { LANGS, PAGES, expectQaPasses, open, pageUrl, type Lang } from './helpers';

// Todas las páginas principales, y la 404 (la ruta no existe, así que se pide una cualquiera)
const TARGETS = [
  ...PAGES.map(({ id, path }) => ({ id, url: (lang: Lang) => pageUrl(lang, path) })),
  { id: '404', url: (lang: Lang) => (lang === 'es' ? '/no-existe/' : '/en/no-existe/') },
];

for (const lang of LANGS) {
  test.describe(`Accessibility basics (${lang})`, () => {
    for (const { id, url } of TARGETS) {
      test(`${id}: language, one h1 and image alts`, async ({ page }) => {
        await open(page, url(lang));

        // El idioma de la página es el que dice la ruta (en la 404 lo pone el guion al cargar)
        await expect(page.locator('html')).toHaveAttribute('lang', lang);

        // Un único h1 que se vea: no cuentan los que están ocultos ni los de las ilustraciones inertes
        const h1s = await page.evaluate(
          () => [...document.querySelectorAll('h1')].filter((h) => !h.closest('[hidden], [inert], [aria-hidden="true"]')).length,
        );
        expect(h1s, 'h1 visibles').toBe(1);

        // Toda imagen lleva el atributo alt (vacío si es decorativa)
        const withoutAlt = await page.evaluate(() =>
          [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).map((img) => img.getAttribute('src') ?? ''),
        );
        expect(withoutAlt, 'imágenes sin alt').toEqual([]);
      });

      // La lente QA de la propia web (tecla 3) es el oráculo: todas sus comprobaciones tienen que pasar
      const qa = async ({ page }: { page: import('@playwright/test').Page }) => {
        await open(page, url(lang));
        await expectQaPasses(page);
      };
      // En la 404 esta prueba destapó que la lente contaba también el titular escondido del otro idioma
      // (arreglado el 23 nov en src/scripts/lenses.ts: runChecks ya descarta lo que está en [hidden])
      test(`${id}: the QA lens passes every check`, qa);
    }
  });
}
