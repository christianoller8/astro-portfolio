import { expect, test, type Locator, type Page } from '@playwright/test';
import { LANGS, PAGES, open, pageUrl, t, type Lang } from './helpers';

// Ninguna de estas pruebas mide movimiento: con "reducir movimiento" el panel y el lienzo cambian de golpe
test.use({ contextOptions: { reducedMotion: 'reduce' } });

// Los landmarks y los nombres accesibles que ve un lector de pantalla: lo que no se nota a simple vista.

const MISSING = (lang: Lang) => (lang === 'es' ? '/no-existe/' : '/en/no-existe/');

/** La región de la caricatura (aside con nombre) */
const tools = (page: Page, lang: Lang): Locator => page.getByRole('complementary', { name: t(lang, 'bubble.tools'), exact: true });
const caricature = (page: Page, lang: Lang): Locator => tools(page, lang).getByRole('button', { name: t(lang, 'bubble.title'), exact: true });

for (const lang of LANGS) {
  test.describe(`Landmarks (${lang})`, () => {
    for (const { id, path } of PAGES) {
      test(`${id}: one contentinfo landmark, outside main`, async ({ page }) => {
        await open(page, pageUrl(lang, path));
        await expect(page.getByRole('contentinfo')).toHaveCount(1);
        // (la web de ejemplo inerte de la home lleva su propio <main> de mentira: se mira el de la página)
        await expect(page.locator('main#main')).toHaveCount(1);
        // El pie no es descendiente de <main>: si lo fuera, el navegador lo dejaría sin rol (generic)
        await expect(page.locator('#main footer')).toHaveCount(0);
        await expect(page.locator('#main').getByRole('contentinfo')).toHaveCount(0);
        // Y sigue siendo el último bloque de la página, dentro del mismo artboard
        expect(await page.evaluate(() => !!document.querySelector('.artboard > footer'))).toBe(true);
      });
    }

    test('404: main but no contentinfo (it has no footer)', async ({ page }) => {
      await open(page, MISSING(lang));
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(0);
      await expect(page.locator('footer')).toHaveCount(0);
    });

    for (const { id, path } of [...PAGES.filter((p) => p.id === 'home' || p.id === 'about'), { id: '404', path: '' }]) {
      test(`${id}: the caricature button sits inside a labelled complementary landmark`, async ({ page }) => {
        await open(page, id === '404' ? MISSING(lang) : pageUrl(lang, path));
        await expect(tools(page, lang)).toHaveCount(1);
        await expect(caricature(page, lang)).toBeVisible();
        // La región tiene que estar sola: la barra de las lentes es otro aside, con otro nombre, y no se ve sin lente
        await expect(page.getByRole('complementary')).toHaveCount(1);
      });
    }
  });
}

test.describe('Shortcut keys stay out of the accessible names', () => {
  const LENSES = [
    { name: 'lens.design', key: '1' },
    { name: 'lens.code', key: '2' },
    { name: 'lens.qa', key: '3' },
  ] as const;

  for (const lang of LANGS) {
    test(`the caricature's panel names its options without the key and exposes it (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await caricature(page, lang).click();
      for (const { name, key } of LENSES) {
        const option = tools(page, lang).getByRole('button', { name: t(lang, name), exact: true });
        await expect(option).toHaveAttribute('aria-keyshortcuts', key);
        // El texto de la tecla sigue a la vista pero escondido del nombre
        await expect(option.locator('kbd')).toHaveAttribute('aria-hidden', 'true');
        await expect(option.locator('kbd')).toBeVisible();
      }
      const canvasOption = tools(page, lang).getByRole('button', { name: t(lang, 'nav.canvas'), exact: true });
      await expect(canvasOption).toHaveAttribute('aria-keyshortcuts', 'M');
      await expect(canvasOption.locator('kbd')).toHaveAttribute('aria-hidden', 'true');
    });

    test(`"normal view" is named without Esc in the panel and in the status bar (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await page.keyboard.press('3');
      await expect(page.locator('html')).toHaveAttribute('data-lens', 'qa');
      const bar = page.getByRole('complementary', { name: t(lang, 'lens.label'), exact: true });
      const barClear = bar.getByRole('button', { name: t(lang, 'lens.clear'), exact: true });
      await expect(barClear).toHaveAttribute('aria-keyshortcuts', 'Escape');
      await expect(barClear.locator('kbd')).toHaveAttribute('aria-hidden', 'true');

      await caricature(page, lang).click();
      const panelClear = tools(page, lang).getByRole('button', { name: t(lang, 'lens.clear'), exact: true });
      await expect(panelClear).toHaveAttribute('aria-keyshortcuts', 'Escape');
      await expect(panelClear.locator('kbd')).toHaveAttribute('aria-hidden', 'true');
    });

    test(`the canvas close button is named without Esc (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await page.keyboard.press('m');
      const close = page.getByRole('dialog', { name: t(lang, 'canvas.label') }).getByRole('button', { name: t(lang, 'canvas.close'), exact: true });
      await expect(close).toBeVisible();
      await expect(close).toHaveAttribute('aria-keyshortcuts', 'Escape');
      await expect(close.locator('kbd')).toHaveAttribute('aria-hidden', 'true');
    });
  }

  test('the 404 "view the canvas" button is named without M and exposes the key', async ({ page }) => {
    for (const { url, label } of [
      { url: '/no-existe/', label: 'Ver lienzo' },
      { url: '/en/no-existe/', label: 'View canvas' },
    ]) {
      await open(page, url);
      const button = page.getByRole('button', { name: label, exact: true });
      await expect(button).toHaveAttribute('aria-keyshortcuts', 'M');
      await expect(button.locator('kbd')).toHaveAttribute('aria-hidden', 'true');
      await expect(button.locator('kbd')).toBeVisible();
    }
  });
});

test.describe('Canvas frame links', () => {
  for (const lang of LANGS) {
    test(`are named by their page, without the size, and the current one says where you are (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await page.keyboard.press('m');
      const dialog = page.getByRole('dialog', { name: t(lang, 'canvas.label') });
      await expect(dialog).toBeVisible();
      const links = dialog.getByRole('link');
      await expect(links).toHaveCount(9);
      // Ningún nombre lleva la medida ("1440 × 7570")
      await expect(dialog.getByRole('link', { name: /1440|×/ })).toHaveCount(0);

      const here = t(lang, 'canvas.here');
      for (const frame of await dialog.locator('[data-canvas-frame]').all()) {
        const title = ((await frame.locator('.cmap-name b').textContent()) ?? '').trim();
        const current = (await frame.getAttribute('aria-current')) === 'page';
        await expect(dialog.getByRole('link', { name: current ? `${title} ${here}` : title, exact: true })).toHaveCount(1);
        // La medida sigue a la vista en escritorio (en móvil no se pinta) y no cuenta para el nombre
        await expect(frame.locator('.cmap-name span')).toHaveAttribute('aria-hidden', 'true');
      }
      await expect(dialog.locator('[data-canvas-frame][aria-current="page"]')).toHaveCount(1);
    });
  }
});
