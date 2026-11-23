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

// El build local no tiene PUBLIC_FORM_ENDPOINT: se simula el de producción apuntando el formulario a
// Web3Forms (con una clave falsa) y se intercepta la red, sin enviar nada de verdad
const ENDPOINT = 'https://api.web3forms.com/submit/test-access-key';

for (const lang of LANGS) {
  test.describe(`Contact form with a sending service (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, pageUrl(lang, '/contact/'));
      await page.evaluate((endpoint) => {
        const target = document.querySelector<HTMLFormElement>('[data-contact-form]');
        target?.setAttribute('data-endpoint', endpoint);
        target?.setAttribute('action', endpoint);
      }, ENDPOINT);
    });

    const fill = async (page: Page) => {
      const { name, email, message } = fields(page, lang);
      await name.fill('Laura Vidal');
      await email.fill('laura@estudio.example');
      await message.fill('Buscamos a alguien que diseñe y programe la nueva web.');
      return { name, email, message };
    };

    test('a valid submit posts the message to Web3Forms and shows the sent state', async ({ page }) => {
      let post: { method: string; body: string } | undefined;
      await page.route('https://api.web3forms.com/**', (route) => {
        post = { method: route.request().method(), body: route.request().postData() ?? '' };
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      });
      await fill(page);
      await send(page, lang).click();

      await expect(form(page).locator('[data-form-sent-title]')).toHaveText(t(lang, 'contact.sent.title'));
      expect(post?.method).toBe('POST');
      const body = post?.body ?? '';
      expect(body).toContain('name="name"');
      expect(body).toContain('Laura Vidal');
      expect(body).toContain('laura@estudio.example');
      expect(body).toContain('Buscamos a alguien que diseñe y programe la nueva web.');
      // El asunto es el mismo que el del mailto: el texto fijo y el tema elegido
      const topic = await form(page).locator('input[name="topic"]:checked').inputValue();
      expect(body).toContain(`${t(lang, 'contact.mailto.subject')} · ${topic}`);
      // El cebo no se marca: un bot lo marcaría, y entonces Web3Forms descarta el mensaje
      expect(body).not.toContain('name="botcheck"');
    });

    test('when the service answers with an error, the page says so and keeps what was typed', async ({ page }) => {
      await page.route('https://api.web3forms.com/**', (route) =>
        route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
      );
      const { name, email, message } = await fill(page);
      await send(page, lang).click();

      await expect(form(page).getByRole('status')).toContainText(t(lang, 'contact.error'));
      await expect(form(page).getByRole('status')).toContainText(EMAIL);
      await expect(form(page).locator('[data-form-sent]')).toBeHidden();
      await expect(name).toHaveValue('Laura Vidal');
      await expect(email).toHaveValue('laura@estudio.example');
      await expect(message).toHaveValue('Buscamos a alguien que diseñe y programe la nueva web.');
      // Y se puede volver a intentar
      await expect(send(page, lang)).toBeEnabled();
    });

    test('a 200 answer with success false still counts as an error', async ({ page }) => {
      await page.route('https://api.web3forms.com/**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
      );
      const { name } = await fill(page);
      await send(page, lang).click();

      await expect(form(page).getByRole('status')).toContainText(t(lang, 'contact.error'));
      await expect(form(page).getByRole('status')).toContainText(EMAIL);
      await expect(form(page).locator('[data-form-sent]')).toBeHidden();
      await expect(name).toHaveValue('Laura Vidal');
    });

    test('a 200 answer that is not JSON still counts as sent', async ({ page }) => {
      await page.route('https://api.web3forms.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/plain', body: 'ok' }));
      await fill(page);
      await send(page, lang).click();
      await expect(form(page).locator('[data-form-sent-title]')).toHaveText(t(lang, 'contact.sent.title'));
    });

    test('the script takes over validation while the markup leaves it to the browser', async ({ page, request, baseURL }) => {
      expect(await form(page).evaluate((element) => (element as HTMLFormElement).noValidate)).toBe(true);
      // Sin JavaScript no hay nadie que ponga noValidate: el navegador valida los campos required
      const html = await (await request.get(new URL(pageUrl(lang, '/contact/'), baseURL).href)).text();
      const tag = html.match(/<form[^>]*data-contact-form[^>]*>/)?.[0] ?? '';
      expect(tag).not.toBe('');
      expect(tag).not.toMatch(/novalidate/i);
    });

    test('the honeypot lives inside the form, hidden and out of the tab order', async ({ page }) => {
      const trap = form(page).locator('input[name="botcheck"]');
      await expect(trap).toHaveCount(1);
      await expect(trap).toBeHidden();
      await expect(trap).toHaveAttribute('tabindex', '-1');
      // Un campo oculto no recibe el foco, ni con el teclado ni con el código
      await trap.evaluate((input) => (input as HTMLInputElement).focus());
      expect(await page.evaluate(() => document.activeElement?.getAttribute('name'))).not.toBe('botcheck');
    });

    test('the form always posts, so a failed script never turns the message into a GET with it in the URL', async ({ page }) => {
      await expect(form(page)).toHaveAttribute('method', 'post');
    });
  });
}
