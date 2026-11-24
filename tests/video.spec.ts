import { expect, test, type Locator, type Page } from '@playwright/test';
import { open, t } from './helpers';

// El vídeo de muestra de /sistema/ prueba el componente ProjectVideo antes de que haya vídeos reales:
// se pide al acercarse, se mueve mientras se ve, se para al salir y se puede pausar con el teclado.
const PAGE = '/sistema/';
const SAMPLE = '/videos/sistema/muestra.mp4';

const box = (page: Page) => page.locator('[data-video]');
const media = (page: Page) => page.locator('[data-video] video');
const toggle = (page: Page) => page.locator('[data-video-toggle]');
const state = (video: Locator) => video.evaluate((el: HTMLVideoElement) => ({ paused: el.paused, time: el.currentTime }));

// El Chromium que baja Playwright no trae H.264 (el Edge de Windows sí): sin códec no hay nada que reproducir
async function requireH264(page: Page) {
  const ok = await media(page).evaluate((el: HTMLVideoElement) => el.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '');
  test.skip(!ok, 'este navegador no reproduce H.264');
}

test.describe('Project video', () => {
  test('has no source until the box approaches the viewport, then serves it as video/mp4', async ({ page }) => {
    await open(page, PAGE);
    const video = media(page);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('src', /.*/);
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.networkState)).not.toBe(2);

    await box(page).scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute('src', SAMPLE);
    const response = await page.request.get(SAMPLE);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('video/mp4');
  });

  test('plays while visible, pauses when scrolled away and resumes on return', async ({ page }) => {
    await open(page, PAGE);
    await requireH264(page);
    const video = media(page);
    await box(page).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await state(video)).paused).toBe(false);
    await expect.poll(async () => (await state(video)).time, { timeout: 8000 }).toBeGreaterThan(0.3);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(async () => (await state(video)).paused).toBe(true);

    await box(page).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await state(video)).paused).toBe(false);
  });

  test('the button pauses and resumes from the keyboard and its name follows the state', async ({ page }) => {
    await open(page, PAGE);
    await requireH264(page);
    const video = media(page);
    const button = toggle(page);
    await box(page).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await state(video)).paused).toBe(false);
    await expect(button).toHaveAccessibleName(t('es', 'video.pause'));

    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAccessibleName(t('es', 'video.play'));
    expect((await state(video)).paused).toBe(true);
    // Parado a mano, seguir a la vista no lo arranca
    await page.waitForTimeout(500);
    expect((await state(video)).paused).toBe(true);

    await page.keyboard.press('Space');
    await expect(button).toHaveAccessibleName(t('es', 'video.pause'));
    await expect.poll(async () => (await state(video)).paused).toBe(false);
  });

  test('with reduced motion it does not autoplay and the button offers to play', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, PAGE);
    await requireH264(page);
    const video = media(page);
    await box(page).scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute('src', SAMPLE);
    await page.waitForTimeout(700);
    expect(await state(video)).toEqual({ paused: true, time: 0 });
    await expect(toggle(page)).toHaveAccessibleName(t('es', 'video.play'));

    // Quien lo pide, lo ve
    await toggle(page).click();
    await expect.poll(async () => (await state(video)).paused).toBe(false);
    await expect(toggle(page)).toHaveAccessibleName(t('es', 'video.pause'));
  });

  test('has an accessible name, a poster and a keyboard-reachable button', async ({ page }) => {
    await open(page, PAGE);
    const video = media(page);
    await expect(video).toHaveAccessibleName(/\S/);
    await expect(video).toHaveAttribute('poster', '/videos/sistema/muestra.jpg');
    const poster = await page.request.get('/videos/sistema/muestra.jpg');
    expect(poster.headers()['content-type']).toBe('image/jpeg');
    await expect(video).toHaveJSProperty('muted', true);
    await expect(video).toHaveJSProperty('loop', true);
    const button = toggle(page);
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('type', 'button');
    const size = await button.boundingBox();
    expect(size?.width).toBeGreaterThanOrEqual(44);
  });
});
