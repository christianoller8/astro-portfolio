import { expect, test, type Page } from '@playwright/test';
import { LANGS, open, pageUrl, t } from './helpers';

// La intro sale en cada carga de la home, salvo en un navegador automatizado (las pruebas): ?intro la
// fuerza. Lo decide el guion del <head> de Layout.astro, y src/scripts/intro.ts lleva las fases con las
// clases is-filled (la marca se rellena) e is-leaving (el iris se cierra)
const INTRO = /(^|\s)intro(\s|$)/; // html.intro, sin confundirla con html.intro-seen, que se queda

for (const lang of LANGS) {
  test.describe(`Intro (${lang})`, () => {
    test('?intro plays the intro, with its hint, and hands over to the page on its own', async ({ page }) => {
      // Sin esperar a la carga: la intro dura unos segundos y hay que verla desde el principio
      await page.goto(`${pageUrl(lang, '/')}?intro`, { waitUntil: 'commit' });
      const html = page.locator('html');
      const screen = page.locator('[data-intro-screen]');
      await expect(html).toHaveClass(INTRO);
      await expect(screen).toBeVisible();

      // La pista dice cómo saltarla: tocar en pantallas táctiles, clic o tecla en el resto
      const touch = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
      await expect(screen.locator(touch ? '.intro-hint-touch' : '.intro-hint-pointer')).toHaveText(
        t(lang, touch ? 'intro.skip.touch' : 'intro.skip.pointer'),
      );
      await expect(screen.locator(touch ? '.intro-hint-pointer' : '.intro-hint-touch')).toBeHidden();

      // Sola: la marca se rellena y la pantalla se va (la secuencia entera no llega a 5 s)
      await expect(screen).toHaveClass(/is-filled/);
      await expect(html).not.toHaveClass(INTRO, { timeout: 10_000 });
      await expect(html).not.toHaveClass(/(^|\s)inking(\s|$)/);
      await expect(screen).toBeHidden();
    });
  });
}

test.describe('Intro skip', () => {
  // El reloj de la página se para antes de cargarla: la intro no avanza sola, así que si se va, es
  // por la tecla o el clic. Después se adelanta a mano para que acabe la salida
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T09:00:00') });
    await page.clock.pauseAt(new Date('2026-01-01T09:00:01'));
    await open(page, '/?intro');
    await expect(page.locator('html')).toHaveClass(INTRO);
    await expect(page.locator('[data-intro-screen]')).not.toHaveClass(/is-filled|is-leaving/);
  });

  const expectSkipped = async (page: Page) => {
    const screen = page.locator('[data-intro-screen]');
    await expect(screen).toHaveClass(/is-leaving/);
    await page.clock.runFor(2000);
    await expect(page.locator('html')).not.toHaveClass(INTRO);
    await expect(screen).toBeHidden();
  };

  test('a key press skips straight to the exit', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expectSkipped(page);
  });

  test('a click or a tap skips straight to the exit', async ({ page, hasTouch }) => {
    // En móvil un toque de verdad (eventos táctiles); en escritorio, un clic
    if (hasTouch) await page.touchscreen.tap(20, 20);
    else await page.mouse.click(20, 20);
    await expectSkipped(page);
  });
});

test.describe('Intro rules', () => {
  // Todas las demás pruebas cuentan con esto: sin ?intro, el navegador automatizado va directo a la página
  test('without ?intro, an automated browser goes straight to the page', async ({ page }) => {
    await open(page, '/');
    await expect(page.locator('html')).not.toHaveClass(INTRO);
    await expect(page.locator('[data-intro-screen]')).toBeHidden();
  });

  test('?intro does nothing outside the home', async ({ page }) => {
    await open(page, '/about/?intro');
    await expect(page.locator('html')).not.toHaveClass(INTRO);
    await expect(page.locator('[data-intro-screen]')).toHaveCount(0);
  });
});
