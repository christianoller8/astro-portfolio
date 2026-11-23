import { expect, test, type Page } from '@playwright/test';
import { LANGS, open, pageUrl, t, tf, type Lang } from './helpers';

const EMAIL = 'christianoller.dev@gmail.com';

// La etiqueta lleva un "*" detrás (aria-hidden): getByLabel compara con el texto, así que se admite
const labelled = (page: Page, text: string) => page.getByLabel(new RegExp(`^${text}\\*?$`));
const fields = (page: Page, lang: Lang) => ({
  name: labelled(page, t(lang, 'contact.name')),
  email: labelled(page, t(lang, 'contact.email')),
  message: labelled(page, t(lang, 'contact.message')),
});
const form = (page: Page) => page.locator('[data-contact-form]');
const send = (page: Page, lang: Lang) => form(page).getByRole('button', { name: t(lang, 'contact.send') });

for (const lang of LANGS) {
  test.describe(`Contact form (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, pageUrl(lang, '/contact/'));
    });

    test('an empty submit shows the error summary and marks the fields as invalid', async ({ page }) => {
      const { name, email, message } = fields(page, lang);
      await send(page, lang).click();

      const alert = form(page).getByRole('alert');
      const list = [t(lang, 'contact.name'), t(lang, 'contact.email'), t(lang, 'contact.message')].join(', ');
      await expect(alert).toHaveText(tf(lang, 'contact.err.summary', { list }));
      for (const field of [name, email, message]) await expect(field).toHaveAttribute('aria-invalid', 'true');
      // Cada campo dice qué le pasa, y el texto del error es su descripción
      await expect(form(page).getByText(t(lang, 'contact.err.name'))).toBeVisible();
      await expect(form(page).getByText(t(lang, 'contact.err.email'))).toBeVisible();
      await expect(form(page).getByText(t(lang, 'contact.err.message'))).toBeVisible();
      await expect(name).toHaveAccessibleDescription(new RegExp(t(lang, 'contact.err.name')));
      // El foco va al primer campo con error
      await expect(name).toBeFocused();
    });

    test('each field clears its error as soon as it becomes valid', async ({ page }) => {
      const { name, email, message } = fields(page, lang);
      await send(page, lang).click();
      await expect(name).toHaveAttribute('aria-invalid', 'true');

      await name.fill('Laura Vidal');
      await expect(name).not.toHaveAttribute('aria-invalid', 'true');
      await expect(email).toHaveAttribute('aria-invalid', 'true');
      await email.fill('laura@estudio.example');
      await expect(email).not.toHaveAttribute('aria-invalid', 'true');
      await expect(message).toHaveAttribute('aria-invalid', 'true');
      await message.fill('Buscamos a alguien que diseñe y programe la nueva web.');
      await expect(message).not.toHaveAttribute('aria-invalid', 'true');
      // Sin errores, el resumen se vacía
      await expect(form(page).locator('[data-alert]')).toBeEmpty();
    });

    test('the checklist lights up as the rules are met', async ({ page }) => {
      const { name, email, message } = fields(page, lang);
      const status = form(page).getByRole('status');
      await expect(form(page).locator('li.is-ok')).toHaveCount(0);
      await name.fill('Laura Vidal');
      await email.fill('laura@estudio.example');
      await message.fill('Buscamos a alguien que diseñe y programe.');
      await expect(form(page).locator('li.is-ok')).toHaveCount(3);
      await expect(status).toHaveText(t(lang, 'contact.ready'));
    });

    test('a valid submit shows the fallback message with a working copy button', async ({ page, context, browserName }) => {
      test.skip(browserName !== 'chromium', 'Los permisos del portapapeles se conceden así solo en Chromium');
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const { name, email, message } = fields(page, lang);
      await name.fill('Laura Vidal');
      await email.fill('laura@estudio.example');
      await message.fill('Buscamos a alguien que diseñe y programe la nueva web del estudio.');
      await send(page, lang).click();

      // Sin servicio de envío, la web abre el correo; el aviso dice qué ha pasado y da la dirección
      const status = form(page).getByRole('status');
      await expect(status).toContainText(t(lang, 'contact.fallback'));
      await expect(status).toContainText(EMAIL);
      for (const field of [name, email, message]) await expect(field).not.toHaveAttribute('aria-invalid', 'true');
      await expect(form(page).locator('[data-alert]')).toBeEmpty();

      const copy = form(page).locator('[data-fallback-copy]');
      await expect(copy).toBeVisible();
      await expect(copy).toHaveText(t(lang, 'footer.copy'));
      await copy.click();
      await expect(copy).toHaveText(t(lang, 'footer.copied'));
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
      // El resultado también se anuncia, en una región educada
      await expect(page.locator('[data-copy-live]')).toHaveText(t(lang, 'footer.copied'));

      // Y al escribir de nuevo, el aviso se retira
      await name.fill('Laura');
      await expect(copy).toBeHidden();
    });
  });
}

test.describe('Contact page', () => {
  test('lists the ways to reach Christian', async ({ page }) => {
    await open(page, '/contact/');
    await expect(page.getByRole('link', { name: EMAIL.replace('@', '@') }).first()).toHaveAttribute('href', `mailto:${EMAIL}`);
    await expect(page.getByRole('link', { name: 'christian-oller' })).toHaveAttribute('href', /linkedin\.com\/in\/christian-oller/);
    await expect(page.getByRole('link', { name: 'christianoller8' })).toHaveAttribute('href', /github\.com\/christianoller8/);
    // La nota de privacidad del formulario lleva a la página de privacidad
    await expect(form(page).getByRole('link', { name: t('es', 'footer.privacy') })).toHaveAttribute('href', '/privacy/');
  });

  test('the footer copy button copies the email', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await open(page, '/en/contact/');
    const copy = page.locator('footer [data-copy]');
    await copy.scrollIntoViewIfNeeded();
    await copy.click();
    await expect(copy).toHaveText(t('en', 'footer.copied'));
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });

  test('when the clipboard fails, the copy button says so instead of doing nothing', async ({ page }) => {
    // El portapapeles rechaza la escritura, como pasa sin permiso o fuera de HTTPS
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError')) },
      });
    });
    await open(page, '/contact/');
    const copy = page.locator('footer [data-copy]');
    await copy.scrollIntoViewIfNeeded();
    await copy.click();
    await expect(copy).toHaveText(t('es', 'footer.copyFailed'));
    // El fallo se anuncia en la misma región educada que el acierto
    await expect(page.locator('[data-copy-live]')).toHaveText(t('es', 'footer.copyFailed'));
    // Y el botón vuelve a su texto, para poder intentarlo otra vez
    await expect(copy).toHaveText(t('es', 'footer.copy'));
  });
});
