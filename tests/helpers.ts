import { expect, type Locator, type Page } from '@playwright/test';
import { ui } from '../src/i18n/ui';

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];
export type Key = keyof (typeof ui)['es'];

/** Un texto de la interfaz, tal cual lo escribe src/i18n/ui.ts (las pruebas no copian los textos) */
export const t = (lang: Lang, key: Key): string => ui[lang][key];

/** Un texto con huecos ({name}, {slot}…) rellenados */
export const tf = (lang: Lang, key: Key, values: Record<string, string>): string =>
  t(lang, key).replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? '');

/** Las páginas principales (el caso es el de Tempora) */
export const PAGES = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects/' },
  { id: 'case', path: '/projects/tempora/' },
  { id: 'about', path: '/about/' },
  { id: 'contact', path: '/contact/' },
  { id: 'privacy', path: '/privacy/' },
] as const;

/** Los cuatro proyectos, en el orden en que salen en la web, con el título que llevan en el contenido */
export const PROJECTS = [
  { slug: 'tempora', title: 'Tempora' },
  { slug: 'vibora', title: 'Víbora' },
  { slug: 'learnish', title: 'Learnish' },
  { slug: 'vistalo', title: 'Vístalo' },
] as const;

/** Ruta de una página en un idioma: pageUrl('en', '/about/') -> /en/about/ */
export const pageUrl = (lang: Lang, path: string): string => (lang === 'es' ? path : `/en${path}`);

/** Cuenta cuántas veces se recarga el documento: la marca vive en window y una recarga la borra */
export async function markDocument(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __doc?: number }).__doc = 1;
  });
}
export async function isSameDocument(page: Page): Promise<boolean> {
  return page.evaluate(() => (window as unknown as { __doc?: number }).__doc === 1);
}

/** La página ya ejecutó su guion del <head> (el de Layout.astro, que pone html.js antes del primer pintado) y cargó las fuentes */
export async function ready(page: Page): Promise<void> {
  await expect(page.locator('html.js')).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
}

/** Abre una página y espera a que esté lista */
export async function open(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await ready(page);
}

/** Abre el menú de móvil si hace falta. Devuelve si estaba a la vista (móvil) o no (escritorio) */
export async function openMenuIfMobile(page: Page, lang: Lang): Promise<boolean> {
  const button = page.getByRole('button', { name: t(lang, 'aria.menu'), exact: true });
  if (!(await button.isVisible())) return false;
  await button.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  return true;
}

/** El enlace del menú principal (el de la barra en escritorio y el del menú desplegable en móvil) */
export async function menuLink(page: Page, lang: Lang, key: Key): Promise<Locator> {
  await openMenuIfMobile(page, lang);
  return page.getByRole('navigation', { name: t(lang, 'nav.menu') }).getByRole('link', { name: t(lang, key), exact: true });
}

/** Pulsa un enlace del menú y espera a que la ruta cambie sin recargar el documento */
export async function goThroughMenu(page: Page, lang: Lang, key: Key, expectedUrl: string): Promise<void> {
  await markDocument(page);
  const link = await menuLink(page, lang, key);
  await link.click();
  await expect(page).toHaveURL(expectedUrl);
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
  expect(await isSameDocument(page), 'el cambio de página no debe recargar el documento').toBe(true);
}

/** El selector de tema que se ve ahora (en móvil estrecho vive dentro del menú) */
export async function themeButton(page: Page, lang: Lang, theme: 'light' | 'dark'): Promise<Locator> {
  await openMenuIfMobile(page, lang);
  return page.getByRole('button', { name: t(lang, theme === 'dark' ? 'aria.theme.dark' : 'aria.theme.light'), exact: true });
}

/** html.dark según el tema */
export const expectTheme = async (page: Page, theme: 'light' | 'dark'): Promise<void> => {
  const html = page.locator('html');
  if (theme === 'dark') await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
  else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
};

/** La lente puesta ahora (html[data-lens]) */
export const currentLens = (page: Page): Promise<string | null> =>
  page.evaluate(() => document.documentElement.dataset.lens ?? null);

/** Las marcas que la lente activa ha dibujado (la capa que se va, por el fundido entre lentes, no cuenta) */
export const lensMarks = (page: Page, lens: string): Locator =>
  page.locator(`.lens-layer:not(.is-leaving)[data-kind="${lens}"] .lm:not([hidden])`);

export type QaResult = { passed: number; total: number };

/** Pone la lente QA (tecla 3) si no está puesta y lee su resultado de la barra de estado: "57/57 comprobaciones" */
async function readQa(page: Page): Promise<QaResult> {
  const html = page.locator('html');
  if ((await html.getAttribute('data-lens')) !== 'qa') await page.keyboard.press('3');
  await expect(html).toHaveAttribute('data-lens', 'qa');
  const score = page.locator('.lens-bar-stats .lb-score b');
  await expect(score).toHaveText(/^\d+\/\d+$/);
  const [passed, total] = ((await score.textContent()) ?? '0/0').split('/').map(Number);
  return { passed, total };
}

/**
 * La lente QA de la propia web es el oráculo de accesibilidad: todas sus comprobaciones tienen que pasar.
 * La lente mide una vez al ponerse, y una medida tomada con un color a medio cambiar puede ser falsa: si
 * no pasa todo, se quita y se vuelve a poner hasta agotar el tiempo. Al agotarlo, falla diciendo cuáles.
 */
export async function expectQaPasses(page: Page): Promise<void> {
  let last: QaResult = { passed: 0, total: 0 };
  try {
    await expect
      .poll(
        async () => {
          last = await readQa(page);
          if (last.passed !== last.total) {
            await page.keyboard.press('3');
            await expect(page.locator('html')).not.toHaveAttribute('data-lens', /.*/);
          }
          return last.passed === last.total && last.total > 20;
        },
        { timeout: 10_000, intervals: [0, 250, 500, 1000] },
      )
      .toBe(true);
  } catch {
    const again = await readQa(page);
    throw new Error(`La lente QA no da todo por bueno: ${again.passed}/${again.total} (mínimo esperado: más de 20 comprobaciones). Fallan: ${(await qaFailures(page)).join(' | ') || 'ninguna a la vista'}`);
  }
}

/** Los textos de las comprobaciones que fallan (los grupos de la barra con data-state="fail") */
export async function qaFailures(page: Page): Promise<string[]> {
  return page.locator('.lens-bar-stats [data-state="fail"]').allInnerTexts();
}
