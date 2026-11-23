import { expect, test, type Locator, type Page } from '@playwright/test';
import { LANGS, currentLens, goThroughMenu, isSameDocument, lensMarks, markDocument, open, pageUrl, t, type Lang } from './helpers';

const LENSES = [
  { key: '1', id: 'design' },
  { key: '2', id: 'code' },
  { key: '3', id: 'qa' },
] as const;

/** La caricatura de abajo a la izquierda: abre el panel con las lentes y el lienzo */
const caricature = (page: Page, lang: Lang): Locator => page.getByRole('button', { name: t(lang, 'bubble.title'), exact: true });
const panel = (page: Page): Locator => page.locator('[data-vb-panel]');
const row = (page: Page, lens: string): Locator => page.locator(`[data-vb-panel] [data-lens-set="${lens}"]`);
const lensBar = (page: Page): Locator => page.locator('.lens-bar');

async function openPanel(page: Page, lang: Lang): Promise<void> {
  await caricature(page, lang).click();
  await expect(caricature(page, lang)).toHaveAttribute('aria-expanded', 'true');
  await expect(panel(page)).toBeVisible();
}

for (const lang of LANGS) {
  test.describe(`Lenses by keyboard (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, pageUrl(lang, '/about/'));
    });

    test('keys 1, 2 and 3 apply each lens and a second press removes it', async ({ page }) => {
      for (const { key, id } of LENSES) {
        await page.keyboard.press(key);
        await expect(page.locator('html')).toHaveAttribute('data-lens', id);
        await expect(lensBar(page)).toBeVisible();
        await expect(page.locator('[data-lens-title]')).toHaveText(t(lang, `lens.${id}`));
        await expect(lensMarks(page, id).first()).toBeAttached();
        expect(await lensMarks(page, id).count(), `marcas de la lente ${id}`).toBeGreaterThan(0);

        await page.keyboard.press(key);
        await expect(page.locator('html')).not.toHaveAttribute('data-lens', /.*/);
        await expect(lensBar(page)).toBeHidden();
      }
    });

    test('pressing another key switches lens without going through the normal view', async ({ page }) => {
      await page.keyboard.press('1');
      await expect(page.locator('html')).toHaveAttribute('data-lens', 'design');
      await page.keyboard.press('2');
      await expect(page.locator('html')).toHaveAttribute('data-lens', 'code');
      await expect(lensMarks(page, 'code').first()).toBeAttached();
      // La capa de la lente anterior se retira cuando acaba el fundido
      await expect(page.locator('.lens-layer')).toHaveCount(1);
    });

    test('Escape clears the lens and its marks', async ({ page }) => {
      await page.keyboard.press('2');
      await expect(lensMarks(page, 'code').first()).toBeAttached();
      await page.keyboard.press('Escape');
      await expect.poll(() => currentLens(page)).toBeNull();
      await expect(page.locator('.lens-layer')).toHaveCount(0);
      await expect(lensBar(page)).toBeHidden();
    });

    test('the status bar exit button also clears it', async ({ page }) => {
      await page.keyboard.press('1');
      await expect(lensBar(page)).toBeVisible();
      await lensBar(page).getByRole('button', { name: new RegExp(t(lang, 'lens.clear')) }).click();
      await expect.poll(() => currentLens(page)).toBeNull();
      await expect(lensBar(page)).toBeHidden();
    });
  });
}

test.describe('Caricature panel', () => {
  test.beforeEach(async ({ page }) => {
    await open(page, '/about/');
  });

  test('opens with the keyboard, moves with the arrows and Escape returns to the caricature', async ({ page }) => {
    await caricature(page, 'es').focus();
    await page.keyboard.press('Enter');
    await expect(caricature(page, 'es')).toHaveAttribute('aria-expanded', 'true');
    // El foco entra en la primera fila
    await expect(row(page, 'design')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(row(page, 'code')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(row(page, 'qa')).toBeFocused();
    // Las flechas dan la vuelta, como una lista de opciones
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('switch', { name: t('es', 'bubble.shortcuts') })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(row(page, 'design')).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByRole('switch', { name: t('es', 'bubble.shortcuts') })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(caricature(page, 'es')).toHaveAttribute('aria-expanded', 'false');
    await expect(caricature(page, 'es')).toBeFocused();
    await expect(panel(page)).toBeHidden();
    await expect.poll(() => currentLens(page)).toBeNull();
  });

  test('choosing a lens with the keyboard applies it and closes the panel', async ({ page }) => {
    await caricature(page, 'es').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await expect(row(page, 'code')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'code');
    await expect(caricature(page, 'es')).toHaveAttribute('aria-expanded', 'false');
    // Con una lente puesta el panel la marca como pulsada y abre en ella
    await caricature(page, 'es').click();
    await expect(row(page, 'code')).toHaveAttribute('aria-pressed', 'true');
    await expect(row(page, 'code')).toBeFocused();
    // Escape con el panel abierto lo cierra pero no quita la lente
    await page.keyboard.press('Escape');
    await expect(panel(page)).toBeHidden();
    await expect.poll(() => currentLens(page)).toBe('code');
    // "Vista normal" aparece solo con una lente puesta, y la quita
    await caricature(page, 'es').click();
    await page.locator('[data-vb-panel] [data-lens-clear]').click();
    await expect.poll(() => currentLens(page)).toBeNull();
  });

  test('clicking outside closes the panel', async ({ page }) => {
    await openPanel(page, 'es');
    await page.mouse.click(300, 300);
    await expect(caricature(page, 'es')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Keyboard shortcuts switch', () => {
  test('turns the 1, 2, 3 and M keys off while Escape keeps working', async ({ page }) => {
    await open(page, '/about/');
    await openPanel(page, 'es');
    const toggle = page.getByRole('switch', { name: t('es', 'bubble.shortcuts') });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    const hints = page.locator('[data-vb-panel] kbd[data-key-hint]');
    await expect(hints.first()).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('html')).toHaveAttribute('data-shortcuts', 'off');
    expect(await page.evaluate(() => localStorage.getItem('shortcuts'))).toBe('off');
    // Las teclas sueltas ya no se anuncian (WCAG 2.1.4)
    await expect(hints.first()).toBeHidden();
    await expect(row(page, 'design')).not.toHaveAttribute('aria-keyshortcuts', /.+/);
    // El interruptor es un ajuste: el panel sigue abierto
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel(page)).toBeHidden();

    // Las teclas no hacen nada…
    for (const key of ['1', '2', '3', 'm']) await page.keyboard.press(key);
    await expect.poll(() => currentLens(page)).toBeNull();
    await expect(page.locator('html')).not.toHaveClass(/canvas-open/);

    // …pero la lente se sigue pudiendo poner con el panel, y Escape sigue quitándola
    await openPanel(page, 'es');
    await row(page, 'design').click();
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'design');
    await page.keyboard.press('Escape');
    await expect.poll(() => currentLens(page)).toBeNull();

    // El ajuste se recuerda al recargar, y se vuelve a encender desde el mismo sitio
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-shortcuts', 'off');
    await page.keyboard.press('1');
    await expect.poll(() => currentLens(page)).toBeNull();
    await openPanel(page, 'es');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).not.toHaveAttribute('data-shortcuts', /.*/);
    await page.keyboard.press('Escape');
    await page.keyboard.press('1');
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'design');
  });
});

test.describe('Lens across pages', () => {
  test('survives a soft navigation in the same tab and is gone in a new tab', async ({ page, context }) => {
    await open(page, '/');
    await page.keyboard.press('1');
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'design');
    await markDocument(page);

    await goThroughMenu(page, 'es', 'nav.about', '/about/');
    expect(await isSameDocument(page)).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'design');
    await expect(lensBar(page)).toBeVisible();
    await expect(lensMarks(page, 'design').first()).toBeAttached();
    expect(await page.evaluate(() => sessionStorage.getItem('lens'))).toBe('design');

    // Cambiar de lente en la página nueva sigue funcionando
    await page.keyboard.press('3');
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'qa');

    // Se recuerda mientras dure la pestaña (sessionStorage), así que sobrevive a una recarga…
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-lens', 'qa');

    // …pero otra pestaña empieza con la web normal
    const other = await context.newPage();
    await open(other, '/about/');
    await expect.poll(() => currentLens(other)).toBeNull();
    await other.close();
  });
});
