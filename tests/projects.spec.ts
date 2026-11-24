import { expect, test, type Page } from '@playwright/test';
import { LANGS, PROJECTS, open, pageUrl, t } from './helpers';

const projectsRoot = (page: Page) => page.locator('[data-projects]');
const modeButton = (page: Page, lang: 'es' | 'en', mode: 'boxes' | 'canvas') =>
  page.getByRole('button', { name: t(lang, `projects.mode.${mode}`), exact: true });

for (const lang of LANGS) {
  test.describe(`Projects (${lang})`, () => {
    test('opens in boxes with the four projects', async ({ page }) => {
      await open(page, pageUrl(lang, '/projects/'));
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'boxes');
      await expect(modeButton(page, lang, 'boxes')).toHaveAttribute('aria-pressed', 'true');
      await expect(modeButton(page, lang, 'canvas')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('.pboxes > li')).toHaveCount(4);
      await expect(page.locator('.pp-canvas')).toBeHidden();
      for (const { slug, title } of PROJECTS) {
        const link = page.getByRole('link', { name: `${t(lang, 'projects.case')}: ${title}` });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', pageUrl(lang, `/projects/${slug}/`));
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });

    test('switches to the canvas view and back, and does not remember it', async ({ page }) => {
      await open(page, pageUrl(lang, '/projects/'));
      await modeButton(page, lang, 'canvas').click();
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'canvas');
      await expect(modeButton(page, lang, 'canvas')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.pp-canvas')).toBeVisible();
      await expect(page.locator('.pboxes')).toBeHidden();
      // Los hilos de prototipo, de cada frame a su nota, están dibujados
      await expect.poll(() => page.locator('.board-thread:has(path)').count()).toBe(4);

      await modeButton(page, lang, 'boxes').click();
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'boxes');
      await expect(page.locator('.pboxes')).toBeVisible();

      // La vista elegida no se recuerda: al recargar, cajas
      await modeButton(page, lang, 'canvas').click();
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'canvas');
      await page.reload();
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'boxes');
    });

    test('"View case" opens the case from the boxes and from the canvas', async ({ page }) => {
      const { slug, title } = PROJECTS[1];
      await open(page, pageUrl(lang, '/projects/'));
      await page.getByRole('link', { name: `${t(lang, 'projects.case')}: ${title}` }).click();
      await expect(page).toHaveURL(pageUrl(lang, `/projects/${slug}/`));
      await expect(page.getByRole('heading', { level: 1 })).toContainText(title);

      // Y de vuelta con el historial, otra vez a las cajas
      await page.goBack();
      await expect(page).toHaveURL(pageUrl(lang, '/projects/'));
      await expect(projectsRoot(page)).toHaveAttribute('data-mode', 'boxes');

      await modeButton(page, lang, 'canvas').click();
      await expect(page.locator('.pp-canvas')).toBeVisible();
      await page.getByRole('link', { name: `${t(lang, 'projects.case')}: ${title}` }).click();
      await expect(page).toHaveURL(pageUrl(lang, `/projects/${slug}/`));
    });
  });
}

test.describe('Project cases', () => {
  for (const { slug, title } of PROJECTS) {
    test(`${title}: the case renders and leads back and forward`, async ({ page }) => {
      await open(page, `/projects/${slug}/`);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
      await expect(page.getByRole('link', { name: t('es', 'project.back') }).first()).toHaveAttribute('href', '/projects/');
      const next = page.getByRole('link', { name: new RegExp(t('es', 'project.next')) });
      await expect(next.first()).toHaveAttribute('href', /^\/projects\/[a-z]+\/$/);
    });
  }

  test('the next project link goes to another case', async ({ page }) => {
    await open(page, '/en/projects/tempora/');
    const next = page.getByRole('link', { name: new RegExp(t('en', 'project.next')) }).first();
    const href = (await next.getAttribute('href')) ?? '';
    expect(href).toMatch(/^\/en\/projects\/[a-z]+\/$/);
    expect(href).not.toBe('/en/projects/tempora/');
    await next.click();
    await expect(page).toHaveURL(href);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  // Con vídeo, la caja enseña la grabación en lugar de la demo (la demo que se toca sigue en la home,
  // home.spec.ts la prueba)
  test('the boxes show the recorded video, with its poster and what it shows', async ({ page }) => {
    await open(page, '/projects/');
    for (const slug of ['tempora', 'learnish', 'vistalo']) {
      const video = page.locator(`.pboxes video[poster="/videos/posters/${slug}.jpg"]`);
      await expect(video).toHaveCount(1);
      await expect(video).toHaveAttribute('aria-label', /.{20,}/);
    }
    await expect(page.locator('.pboxes [data-demo="tempora"]')).toHaveCount(0);
  });
});
