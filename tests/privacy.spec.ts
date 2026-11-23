import { expect, test, type Page } from '@playwright/test';
import { LANGS, goThroughMenu, isSameDocument, markDocument, open, pageUrl, t, type Lang } from './helpers';

// Ninguna de estas pruebas mide movimiento: con "reducir movimiento" la web cambia de golpe y se ahorra esperar animaciones
test.use({ contextOptions: { reducedMotion: 'reduce' } });

const KEY = 'analytics-off';
const flag = (page: Page) => page.evaluate((key) => localStorage.getItem(key), KEY);
const optout = (page: Page, lang: Lang, state: 'on' | 'off') =>
  page.getByRole('button', { name: t(lang, state === 'on' ? 'privacy.optout.on' : 'privacy.optout.off'), exact: true });
const status = (page: Page) => page.locator('[data-optout-status]');

for (const lang of LANGS) {
  test.describe(`Privacy (${lang})`, () => {
    test('renders its sections and the cookie-free statement', async ({ page }) => {
      await open(page, pageUrl(lang, '/privacy/'));
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t(lang, 'privacy.title'));
      await expect(page).toHaveTitle(t(lang, 'privacy.meta.title'));
      // Seis apartados, cada uno con su título
      await expect(page.locator('.privacy-section h2')).toHaveCount(6);
      // El correo y los enlaces externos del texto
      await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
      await expect(page.locator('main a[href="https://vercel.com/legal/privacy-policy"]')).toHaveCount(1);
      await expect(page.locator('main a[href="https://www.aepd.es"]')).toHaveCount(1);
    });

    test('the opt-out button sets and clears the flag, and its status line speaks both ways', async ({ page }) => {
      await open(page, pageUrl(lang, '/privacy/'));
      await expect(status(page)).toHaveAttribute('role', 'status');
      await expect(status(page)).toHaveAttribute('aria-live', 'polite');
      expect(await flag(page)).toBeNull();
      await expect(status(page)).toBeEmpty();

      // Apagar la cuenta de visitas
      await optout(page, lang, 'on').click();
      await expect.poll(() => flag(page)).toBe('1');
      await expect(status(page)).toHaveText(t(lang, 'privacy.optout.status'));
      await expect(optout(page, lang, 'off')).toBeVisible();
      await expect(optout(page, lang, 'off')).toHaveAttribute('data-off', '');

      // Se recuerda al recargar
      await page.reload();
      await expect(optout(page, lang, 'off')).toBeVisible();
      await expect(status(page)).toHaveText(t(lang, 'privacy.optout.status'));
      expect(await flag(page)).toBe('1');

      // Volver a contarlas: la bandera desaparece y la línea lo dice
      await optout(page, lang, 'off').click();
      await expect.poll(() => flag(page)).toBeNull();
      await expect(status(page)).toHaveText(t(lang, 'privacy.optout.again'));
      await expect(optout(page, lang, 'on')).toBeVisible();
      await expect(optout(page, lang, 'on')).not.toHaveAttribute('data-off', /.*/);
    });
  });
}

test.describe('Privacy: across pages', () => {
  test('the choice survives going to another page and back without reloading', async ({ page }) => {
    await open(page, '/privacy/');
    await optout(page, 'es', 'on').click();
    await expect.poll(() => flag(page)).toBe('1');
    await markDocument(page);

    await goThroughMenu(page, 'es', 'nav.about', '/about/');
    await page.locator('footer').getByRole('link', { name: t('es', 'footer.privacy') }).click();
    await expect(page).toHaveURL('/privacy/');
    expect(await isSameDocument(page)).toBe(true);
    await expect(optout(page, 'es', 'off')).toBeVisible();
    await expect(status(page)).toHaveText(t('es', 'privacy.optout.status'));
  });

  test('the local build loads no analytics', async ({ page }) => {
    test.skip(!!process.env.VERCEL, 'En Vercel la compilación sí lleva la analítica');
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await open(page, '/');
    expect(requests.filter((url) => url.includes('_vercel'))).toEqual([]);
    expect(await page.evaluate(() => typeof (window as unknown as { webAnalyticsBeforeSend?: unknown }).webAnalyticsBeforeSend)).toBe('undefined');
  });
});
