import { expect, test } from '@playwright/test';
import { LANGS, PAGES, goThroughMenu, markDocument, menuLink, open, openMenuIfMobile, pageUrl, t, type Key, type Lang } from './helpers';

// Ninguna de estas pruebas mide movimiento: con "reducir movimiento" la web cambia de golpe y se ahorra esperar animaciones
test.use({ contextOptions: { reducedMotion: 'reduce' } });

const MENU: { key: Key; path: string }[] = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.projects', path: '/projects/' },
  { key: 'nav.about', path: '/about/' },
  { key: 'nav.contact', path: '/contact/' },
];

for (const lang of LANGS) {
  test.describe(`Navigation (${lang})`, () => {
    test('menu links reach every main page without reloading', async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      for (const item of MENU.slice(1)) {
        await goThroughMenu(page, lang, item.key, pageUrl(lang, item.path));
        // El enlace de la página en la que se está queda marcado
        const link = await menuLink(page, lang, item.key);
        await expect(link).toHaveAttribute('aria-current', 'page');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      }
      await goThroughMenu(page, lang, 'nav.home', pageUrl(lang, '/'));
    });

    test('the brand link goes home', async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await markDocument(page);
      await page.getByRole('link', { name: t(lang, 'aria.home') }).click();
      await expect(page).toHaveURL(pageUrl(lang, '/'));
    });
  });
}

test.describe('Language switch', () => {
  for (const { id, path } of PAGES) {
    test(`keeps the same page: ${id} (es to en and back)`, async ({ page }) => {
      await open(page, path);
      await openMenuIfMobile(page, 'es');
      await page.getByRole('link', { name: t('es', 'aria.lang.en'), exact: true }).click();
      await expect(page).toHaveURL(pageUrl('en', path));
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');

      await openMenuIfMobile(page, 'en');
      const current = page.getByRole('link', { name: t('en', 'aria.lang.en'), exact: true });
      await expect(current).toHaveAttribute('aria-current', 'true');
      await page.getByRole('link', { name: t('en', 'aria.lang.es'), exact: true }).click();
      await expect(page).toHaveURL(pageUrl('es', path));
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    });
  }
});

test.describe('Internal links', () => {
  test.skip(({ isMobile }) => isMobile, 'El HTML es el mismo en móvil: se comprueba una sola vez, en escritorio');

  const urls = [
    ...LANGS.flatMap((lang) => PAGES.map(({ id, path }) => ({ name: `${lang} ${id}`, url: pageUrl(lang, path) }))),
    { name: 'es 404', url: '/no-existe/' },
    { name: 'en 404', url: '/en/no-existe/' },
  ];
  for (const { name, url } of urls) {
    test(`every internal href ends in a slash: ${name}`, async ({ page }) => {
      await page.goto(url);
      const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''));
      const internal = hrefs.filter((href) => href.startsWith('/') && !href.startsWith('//'));
      expect(internal.length).toBeGreaterThan(3);
      const bad = internal.filter((href) => {
        const path = href.split(/[?#]/)[0];
        const last = path.split('/').pop() ?? '';
        // Los archivos (el PDF del CV) no llevan barra
        return path !== '' && !last.includes('.') && !path.endsWith('/');
      });
      expect(bad, 'enlaces internos sin barra final').toEqual([]);
    });
  }
});

test.describe('404', () => {
  for (const { lang, url, title } of [
    { lang: 'es' as Lang, url: '/no-existe/', title: 'Página no encontrada' },
    { lang: 'en' as Lang, url: '/en/does-not-exist/', title: 'Page not found' },
    { lang: 'es' as Lang, url: '/projects/no-existe/', title: 'Página no encontrada' },
    { lang: 'en' as Lang, url: '/en/projects/no-existe/', title: 'Page not found' },
  ]) {
    test(`answers 404 in ${lang}: ${url}`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      // La ruta pedida es el nombre del frame que falta
      await expect(page.locator('[data-nf-path]:visible')).toHaveText(url);
      // Y desde ahí se vuelve al inicio de su idioma
      await page.getByRole('link', { name: lang === 'es' ? 'Volver al inicio' : 'Back to home' }).click();
      await expect(page).toHaveURL(pageUrl(lang, '/'));
    });
  }
});

test.describe('Skip link', () => {
  for (const lang of LANGS) {
    test(`is the first focusable element and jumps to the content (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: t(lang, 'aria.skip') });
      await expect(skip).toBeFocused();
      await expect(skip).toHaveAttribute('href', '#main');
      await expect(skip).toBeInViewport();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main$/);
    });
  }
});

test.describe('Back to top', () => {
  // La página de Sobre mí es larga y no lleva escena fija: el salto es fácil de medir
  const scrollY = (page: import('@playwright/test').Page) => page.evaluate(() => Math.round(window.scrollY));

  for (const lang of LANGS) {
    test(`mouse: reaches the top, leaves no hash and does not move focus (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      const link = page.locator('[data-back-top]');
      await link.scrollIntoViewIfNeeded();
      await expect(link).toHaveText(new RegExp(t(lang, 'footer.top')));
      expect(await scrollY(page)).toBeGreaterThan(500);
      await link.click();
      await expect.poll(() => scrollY(page), { timeout: 5000 }).toBe(0);
      await expect(page).not.toHaveURL(/#/);
      await expect(page.getByRole('link', { name: t(lang, 'aria.skip') })).not.toBeFocused();
    });
  }

  test('keyboard: reaches the top and focus lands on the skip link', async ({ page }) => {
    // Esta sí mide el movimiento: el deslizamiento de vuelta arriba acaba antes de mover el foco
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await open(page, '/about/');
    const link = page.locator('[data-back-top]');
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => scrollY(page), { timeout: 5000 }).toBe(0);
    await expect(page).not.toHaveURL(/#/);
    await expect(page.getByRole('link', { name: t('es', 'aria.skip') })).toBeFocused();
    // Con el foco ahí, el siguiente Tab sigue desde el principio de la página
    await page.keyboard.press('Tab');
    await expect(page.locator('header a, header button').first()).toBeFocused();
  });

  test('reduced motion: goes to the top at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '/about/');
    const link = page.locator('[data-back-top]');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect.poll(() => scrollY(page)).toBe(0);
  });
});

test.describe('Mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'El menú desplegable solo existe por debajo de 1024 px');

  for (const lang of LANGS) {
    test(`opens, closes and makes the page behind inert (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      const open_ = page.getByRole('button', { name: t(lang, 'aria.menu'), exact: true });
      const menu = page.locator('#mobile-menu');
      const main = page.locator('#main');

      await expect(menu).toBeHidden();
      await expect(main).toHaveJSProperty('inert', false);
      await open_.click();
      await expect(menu).toBeVisible();
      await expect(page.locator('html')).toHaveClass(/menu-open/);
      await expect(main).toHaveJSProperty('inert', true);
      // El botón dice lo que hará ahora y avisa de que está desplegado
      const close = page.getByRole('button', { name: t(lang, 'aria.close'), exact: true });
      await expect(close).toHaveAttribute('aria-expanded', 'true');
      // Los cuatro enlaces y la descarga del CV están dentro
      for (const item of MENU) await expect(menu.getByRole('link', { name: t(lang, item.key), exact: true })).toBeVisible();
      await expect(menu.getByRole('link', { name: t(lang, 'nav.cv.download') })).toBeVisible();

      await close.click();
      await expect(menu).toBeHidden();
      await expect(main).toHaveJSProperty('inert', false);
      await expect(open_).toHaveAttribute('aria-expanded', 'false');
    });
  }

  test('Escape closes it and focus returns to the menu button', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: t('es', 'aria.menu'), exact: true }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.getByRole('button', { name: t('es', 'aria.menu'), exact: true })).toBeFocused();
    await expect(page.locator('#main')).toHaveJSProperty('inert', false);
  });

  test('choosing a page closes the menu and leaves the new page usable', async ({ page }) => {
    await open(page, '/');
    await goThroughMenu(page, 'es', 'nav.about', '/about/');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.locator('#main')).toHaveJSProperty('inert', false);
  });
});
