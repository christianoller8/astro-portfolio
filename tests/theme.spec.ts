import { expect, test, type Page } from '@playwright/test';
import { LANGS, expectTheme, isSameDocument, markDocument, menuLink, open, pageUrl, themeButton } from './helpers';

/** El color que la web declara como hoja de página (--sheet) del tema que se ve: es el de la barra del navegador */
const sheet = (page: Page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sheet').trim());
const themeColor = (page: Page) => page.locator('meta[name="theme-color"]').getAttribute('content');
const stored = (page: Page) => page.evaluate(() => localStorage.getItem('theme'));

/** Cuenta cuántas transiciones de vista lanza la web (la onda del cambio de tema) */
const countViewTransitions = (page: Page) =>
  page.addInitScript(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) document.startViewTransition = (callback) => (w.__vt++, original(callback));
  });
const transitions = (page: Page) => page.evaluate(() => (window as unknown as { __vt: number }).__vt);

test.describe('Theme', () => {
  for (const lang of LANGS) {
    test(`switching sets html.dark, aria-pressed, theme-color and persists on reload (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
      await expectTheme(page, 'light');
      const lightColor = await themeColor(page);
      expect(lightColor).toBe(await sheet(page));

      // A oscuro
      await (await themeButton(page, lang, 'dark')).click();
      await expectTheme(page, 'dark');
      await expect(page.locator('html')).not.toHaveClass(/theme-ripple/);
      const darkColor = await sheet(page);
      expect(darkColor).not.toBe(lightColor);
      await expect.poll(() => themeColor(page)).toBe(darkColor);
      expect(await stored(page)).toBe('dark');
      const dark = await themeButton(page, lang, 'dark');
      const light = await themeButton(page, lang, 'light');
      await expect(dark).toHaveAttribute('aria-pressed', 'true');
      await expect(light).toHaveAttribute('aria-pressed', 'false');

      // Se recuerda al recargar y la barra del navegador sigue al tema
      await page.reload();
      await expectTheme(page, 'dark');
      await expect.poll(() => themeColor(page)).toBe(darkColor);
      await expect(await themeButton(page, lang, 'dark')).toHaveAttribute('aria-pressed', 'true');

      // Y de vuelta a claro
      await (await themeButton(page, lang, 'light')).click();
      await expectTheme(page, 'light');
      await expect(page.locator('html')).not.toHaveClass(/theme-ripple/);
      await expect.poll(() => themeColor(page)).toBe(lightColor);
      expect(await stored(page)).toBe('light');
      await page.reload();
      await expectTheme(page, 'light');
    });
  }

  test('the chosen theme survives a page change without reload', async ({ page }) => {
    await open(page, '/');
    await (await themeButton(page, 'es', 'dark')).click();
    await expectTheme(page, 'dark');
    await expect(page.locator('html')).not.toHaveClass(/theme-ripple/);
    await markDocument(page);
    const link = await menuLink(page, 'es', 'nav.projects');
    await link.click();
    await expect(page).toHaveURL('/projects/');
    await expectTheme(page, 'dark');
    expect(await isSameDocument(page)).toBe(true);
  });

  test('without a stored choice it follows the system preference', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await open(page, '/');
    await expectTheme(page, 'dark');
    await expect(await themeButton(page, 'es', 'dark')).toHaveAttribute('aria-pressed', 'true');
    await context.close();
  });

  test('with motion allowed the switch runs a view transition', async ({ page }) => {
    await countViewTransitions(page);
    await open(page, '/');
    test.skip(!(await page.evaluate(() => typeof document.startViewTransition === 'function')), 'Este navegador no tiene transiciones de vista');
    await (await themeButton(page, 'es', 'dark')).click();
    await expectTheme(page, 'dark');
    expect(await transitions(page)).toBe(1);
  });

  test('with reduced motion no view transition is started', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await countViewTransitions(page);
    await open(page, '/');
    await (await themeButton(page, 'es', 'dark')).click();
    await expectTheme(page, 'dark');
    expect(await transitions(page)).toBe(0);
    await expect(page.locator('html')).not.toHaveClass(/theme-ripple/);
    // Y el cambio también se recuerda
    expect(await stored(page)).toBe('dark');
    await expect(await themeButton(page, 'es', 'dark')).toHaveAttribute('aria-pressed', 'true');
  });

  test('pressing the option already active does nothing', async ({ page }) => {
    await countViewTransitions(page);
    await open(page, '/');
    await (await themeButton(page, 'es', 'light')).click();
    await expectTheme(page, 'light');
    expect(await transitions(page)).toBe(0);
    expect(await stored(page)).toBeNull();
  });
});
