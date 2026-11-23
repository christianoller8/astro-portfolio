import { expect, test, type Locator, type Page } from '@playwright/test';
import { LANGS, PROJECTS, open, pageUrl, t, type Lang } from './helpers';

// Ninguna de estas pruebas mide movimiento: con "reducir movimiento" la web cambia de golpe y se ahorra esperar animaciones
test.use({ contextOptions: { reducedMotion: 'reduce' } });

/** Los nueve frames del lienzo, por la ruta que llevan en data-canvas-frame (sin idioma ni barra final) */
const FRAME_PATHS = ['/', '/projects', '/about', '/contact', ...PROJECTS.map((p) => `/projects/${p.slug}`), '/404'];

const canvas = (page: Page): Locator => page.locator('[data-canvas]');
const frames = (page: Page): Locator => page.locator('[data-canvas-frame]');
const frame = (page: Page, path: string): Locator => page.locator(`[data-canvas-frame="${path}"]`);
const here = (page: Page): Locator => page.locator('[data-canvas-frame][aria-current="page"]');
const html = (page: Page): Locator => page.locator('html');

/** Abre el lienzo con la tecla M y espera a que la cámara esté a la vista */
async function openWithKey(page: Page): Promise<void> {
  await page.keyboard.press('m');
  await expect(html(page)).toHaveClass(/canvas-open/);
  await expect(canvas(page)).toBeVisible();
  // Hasta que no ha terminado de abrirse (clase is-open, que se pone un cuadro después) un cierre llega
  // antes que la apertura y esta lo deshace; y en escritorio la cámara sale hacia el archivo entero en
  // otro cuadro. Dos cuadros de animación después, las dos cosas han pasado
  await expect(canvas(page)).toHaveClass(/is-open/);
  await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))));
}

for (const lang of LANGS) {
  test.describe(`Canvas map (${lang})`, () => {
    test('M opens it with the nine frames, the 404 among them, and M closes it', async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      await openWithKey(page);
      await expect(page.getByRole('dialog', { name: t(lang, 'canvas.label') })).toBeVisible();
      await expect(frames(page)).toHaveCount(9);
      const paths = await frames(page).evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.canvasFrame));
      expect(paths).toEqual(FRAME_PATHS);
      // Cada frame lleva a su página, en el idioma en el que se está
      const hrefs = await frames(page).evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      expect(hrefs).toEqual(FRAME_PATHS.map((path) => pageUrl(lang, path === '/' ? '/' : `${path}/`)));
      // La página de detrás queda inerte mientras el lienzo está abierto
      await expect(page.locator('#main')).toHaveJSProperty('inert', true);

      await page.keyboard.press('m');
      await expect(html(page)).not.toHaveClass(/canvas-open/);
      await expect(canvas(page)).toBeHidden();
      await expect(page.locator('#main')).toHaveJSProperty('inert', false);
    });

    test('"you are here" is the current page', async ({ page }) => {
      for (const { url, path } of [
        { url: pageUrl(lang, '/'), path: '/' },
        { url: pageUrl(lang, '/about/'), path: '/about' },
        { url: pageUrl(lang, '/projects/vibora/'), path: '/projects/vibora' },
      ]) {
        await open(page, url);
        await openWithKey(page);
        await expect(here(page)).toHaveCount(1);
        await expect(here(page)).toHaveAttribute('data-canvas-frame', path);
        await expect(here(page).locator('.cmap-here')).toHaveText(t(lang, 'canvas.here'));
        await page.keyboard.press('Escape');
        await expect(canvas(page)).toBeHidden();
      }
    });

    test('clicking a frame navigates to that page', async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      await openWithKey(page);
      await frame(page, '/about').click();
      await expect(page).toHaveURL(pageUrl(lang, '/about/'));
      await expect(html(page)).toHaveAttribute('lang', lang);
      await expect(canvas(page)).toBeHidden();
      await expect(html(page)).not.toHaveClass(/canvas-open/);
    });

    test('clicking the frame you are on just closes it', async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await openWithKey(page);
      await frame(page, '/about').click();
      await expect(canvas(page)).toBeHidden();
      await expect(page).toHaveURL(pageUrl(lang, '/about/'));
    });
  });
}

test.describe('Canvas map: opening from the caricature', () => {
  test('Escape closes it and focus returns to the caricature', async ({ page }) => {
    await open(page, '/about/');
    const toggle = page.getByRole('button', { name: t('es', 'bubble.title'), exact: true });
    await toggle.click();
    await page.locator('[data-vb-panel] [data-canvas-open]').click();
    await expect(canvas(page)).toBeVisible();
    await expect(here(page)).toHaveAttribute('data-canvas-frame', '/about');
    // La caricatura se esconde mientras el lienzo está abierto
    await expect(page.locator('[data-vb]')).toBeHidden();

    await page.keyboard.press('Escape');
    await expect(canvas(page)).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(page.locator('[data-vb]')).toBeVisible();
  });

  test('the close button leaves it too', async ({ page }) => {
    await open(page, '/');
    await openWithKey(page);
    await canvas(page).getByRole('button', { name: new RegExp(t('es', 'canvas.close')) }).click();
    await expect(canvas(page)).toBeHidden();
    await expect(html(page)).not.toHaveClass(/canvas-open/);
  });

  test('keeps the top bar usable while open', async ({ page, isMobile }) => {
    await open(page, '/en/');
    await openWithKey(page);
    // La barra de arriba no queda inerte: el lienzo empieza debajo de ella
    await expect(page.locator('header.toolbar')).toHaveJSProperty('inert', false);
    await expect(page.locator('#main')).toHaveJSProperty('inert', true);
    if (isMobile) return;
    await page.getByRole('button', { name: t('en', 'aria.theme.dark'), exact: true }).click();
    await expect(html(page)).toHaveClass(/(^|\s)dark(\s|$)/);
    await expect(canvas(page)).toBeVisible();
  });
});

test.describe('Canvas map on the 404', () => {
  for (const { lang, url } of [
    { lang: 'es' as Lang, url: '/no-existe/' },
    { lang: 'en' as Lang, url: '/en/does-not-exist/' },
  ]) {
    test(`the 404 frame is the one you are on, in ${lang}`, async ({ page }) => {
      await open(page, url);
      await openWithKey(page);
      await expect(frames(page)).toHaveCount(9);
      await expect(here(page)).toHaveCount(1);
      await expect(here(page)).toHaveAttribute('data-canvas-frame', '/404');
      await expect(here(page).locator('.cmap-here')).toHaveText(t(lang, 'canvas.here'));
    });
  }

  test('on an English 404 the frames, links and texts are in English', async ({ page }) => {
    await open(page, '/en/does-not-exist/');
    await openWithKey(page);
    await expect(canvas(page)).toHaveAttribute('aria-label', t('en', 'canvas.label'));
    const names = await frames(page).evaluateAll((els) => els.map((el) => el.querySelector('.cmap-name b')?.textContent ?? ''));
    expect(names).toEqual([
      t('en', 'nav.home'),
      t('en', 'nav.projects'),
      t('en', 'nav.about'),
      t('en', 'nav.contact'),
      ...PROJECTS.map((p) => `${t('en', 'nav.projects')} / ${p.title}`),
      '404',
    ]);
    const hrefs = await frames(page).evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(hrefs.every((href) => href.startsWith('/en/'))).toBe(true);
    expect(hrefs.at(-1)).toBe('/en/404/');
    const thumbs = await frames(page).evaluateAll((els) => els.flatMap((el) => [...el.querySelectorAll('img')].map((img) => img.getAttribute('src') ?? '')));
    expect(thumbs.every((src) => src.startsWith('/canvas/en-'))).toBe(true);
    await expect(canvas(page).locator('.cmap-hint--mouse')).toHaveText(t('en', 'canvas.hint'));
    await expect(canvas(page).locator('[data-canvas-fit]')).toHaveText(t('en', 'canvas.fit'));
    await expect(canvas(page).locator('[data-canvas-close]')).toContainText(t('en', 'canvas.close'));
  });

  test('entering a frame from an English 404 opens the English page', async ({ page }) => {
    await open(page, '/en/does-not-exist/');
    await openWithKey(page);
    await frame(page, '/projects').click();
    await expect(page).toHaveURL('/en/projects/');
    await expect(html(page)).toHaveAttribute('lang', 'en');
  });

  test('a Spanish 404 keeps its canvas in Spanish', async ({ page }) => {
    await open(page, '/no-existe/');
    await openWithKey(page);
    const names = await frames(page).evaluateAll((els) => els.map((el) => el.querySelector('.cmap-name b')?.textContent ?? ''));
    expect(names.slice(0, 4)).toEqual([t('es', 'nav.home'), t('es', 'nav.projects'), t('es', 'nav.about'), t('es', 'nav.contact')]);
  });
});
