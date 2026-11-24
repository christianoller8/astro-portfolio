import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { LANGS, PAGES, PROJECTS, expectTheme, goThroughMenu, open, pageUrl, themeButton } from './helpers';

// La CSP vive en vercel.json (la pone Vercel) y astro preview no envía cabeceras: aquí se añade a cada
// documento de la web, como hará Vercel, y se exige que ni las páginas ni lo que se hace en ellas
// provoquen un solo bloqueo. Si algo nuevo carga de otro sitio al abrir o recorrer una página (un vídeo
// o una fuente de fuera…), este test lo dice antes de publicar: hay que añadir su origen a la cabecera.
// El formulario también se envía, contra Web3Forms simulado: su origen tiene que estar en connect-src.
// El data: de script-src lo pide el router de Astro: en cada cambio de página mete un guion vacío
// (data:application/javascript,) para esperar a que acaben los módulos en línea de la página nueva.
type HeaderRule = { source: string; headers: { key: string; value: string }[] };
const rules = (JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { headers: HeaderRule[] }).headers;
const cspRule = rules.find((rule) => rule.headers.some((header) => header.key === 'Content-Security-Policy'));
const CSP = cspRule?.headers.find((header) => header.key === 'Content-Security-Policy')?.value ?? '';

/**
 * Pone la CSP en los documentos de la web y apunta cada bloqueo, venga del evento o de la consola.
 * served dice cuántos documentos la llevaron: si es 0, el test no estaría probando nada
 */
async function guard(page: Page, origin: string): Promise<{ blocked: string[]; served: () => number }> {
  const blocked: string[] = [];
  let served = 0;
  page.on('console', (message) => {
    if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) blocked.push(message.text());
  });
  await page.exposeFunction('__cspViolation', (text: string) => blocked.push(text));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      (window as unknown as { __cspViolation: (text: string) => void }).__cspViolation(`${event.effectiveDirective} <- ${event.blockedURI}`);
    });
  });
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.resourceType() !== 'document' || new URL(request.url()).origin !== origin) return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } });
    served += 1;
  });
  // La web de Vístalo (el marco en vivo) no se pide de verdad: la CSP decide antes de que salga la petición
  await page.route('https://vistalo-sl.vercel.app/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Vístalo</title>' }),
  );
  return { blocked, served: () => served };
}

/** Recorre la página hasta abajo, para que entre todo lo que se carga al acercarse */
const scrollThrough = (page: Page) =>
  page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight * 0.8) {
      scrollTo({ top: y, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

// Todas las páginas: los cuatro casos y la 404 (una ruta que no existe)
const TARGETS = [
  ...PAGES.filter(({ id }) => id !== 'case').map(({ id, path }) => ({ id: id as string, path: path as string })),
  ...PROJECTS.map(({ slug }) => ({ id: slug as string, path: `/projects/${slug}/` })),
  { id: '404', path: '/no-existe/' },
];

test.describe('Content Security Policy', () => {
  test('vercel.json declares a policy that locks every source to the site', () => {
    for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'"]) {
      expect(CSP).toContain(directive);
    }
  });

  // Va en todas las rutas menos en el CV: con object-src 'none' el visor de PDF de Safari (y a veces el
  // de Chrome) se queda en blanco al abrir el PDF directamente. Vercel lee source con path-to-regexp;
  // este patrón concreto se comporta igual como expresión regular de JavaScript
  test('the policy covers every page but not the CV PDF', () => {
    const covered = (path: string) => new RegExp(`^${cspRule?.source ?? ''}$`).test(path);
    for (const path of ['/', '/en/', '/projects/tempora/', '/no-existe/', '/og/es-home.jpg']) expect(covered(path), path).toBe(true);
    expect(covered('/cv/christian-oller-cv.pdf')).toBe(false);
  });

  for (const lang of LANGS) {
    for (const { id, path } of TARGETS) {
      test(`${lang} ${id}: loads and scrolls through without a CSP violation`, async ({ page, baseURL }) => {
        const { blocked, served } = await guard(page, new URL(baseURL ?? '').origin);
        await open(page, pageUrl(lang, path));
        expect(served(), 'la página tiene que llegar con la CSP puesta').toBeGreaterThan(0);
        await scrollThrough(page);
        await page.waitForTimeout(400);
        expect(blocked).toEqual([]);
      });
    }
  }

  // El vídeo de muestra de /sistema/ es del mismo origen: default-src 'self' lo admite sin media-src.
  // Se espera a que se reproduzca de verdad (el Chromium de Playwright sin H.264 solo prueba la petición)
  test('the sample video on /sistema/ loads and plays within the policy', async ({ page, baseURL }) => {
    const { blocked, served } = await guard(page, new URL(baseURL ?? '').origin);
    await open(page, '/sistema/');
    expect(served(), 'la página tiene que llegar con la CSP puesta').toBeGreaterThan(0);
    await page.locator('[data-video]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-video] video')).toHaveAttribute('src', /muestra\.mp4$/);
    const playable = await page.locator('[data-video] video').evaluate((el: HTMLVideoElement) => el.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '');
    if (playable) await expect.poll(() => page.locator('[data-video] video').evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 8000 }).toBeGreaterThan(0.3);
    await page.waitForTimeout(400);
    expect(blocked).toEqual([]);
  });

  test('lenses, 3D layers, canvas, theme switch, page changes and the live Vístalo frame stay within the policy', async ({ page, baseURL }) => {
    const { blocked } = await guard(page, new URL(baseURL ?? '').origin);
    const header = page.waitForResponse((response) => response.request().resourceType() === 'document');
    await open(page, '/');
    expect((await (await header).allHeaders())['content-security-policy']).toBe(CSP);

    // Las tres lentes, y fuera
    const html = page.locator('html');
    for (const [key, lens] of [['1', 'design'], ['2', 'code'], ['3', 'qa']] as const) {
      await page.keyboard.press(key);
      await expect(html).toHaveAttribute('data-lens', lens);
    }
    await page.keyboard.press('3');
    await expect(html).not.toHaveAttribute('data-lens', /.*/);

    // Las capas 3D: three.js se carga al acercarse a su sección
    const layers = page.locator('[data-layers]');
    await layers.scrollIntoViewIfNeeded();
    await expect.poll(() => layers.getAttribute('class'), { timeout: 20_000 }).toMatch(/is-ready|is-flat/);

    // El cambio de tema (el círculo)
    await (await themeButton(page, 'es', 'dark')).click();
    await expectTheme(page, 'dark');

    // El lienzo, y desde él a otra página: vuelo de cámara y cambio de página sin recarga
    await page.keyboard.press('m');
    await expect(page.locator('[data-canvas]')).toHaveClass(/is-open/);
    await page.locator('[data-canvas-frame="/about"]').click();
    await expect(page).toHaveURL(/\/about\/$/);

    // Por el menú a Proyectos, y el marco con la web de Vístalo en vivo
    await goThroughMenu(page, 'es', 'nav.projects', '/projects/');
    const live = page.locator('[data-demo-live]:visible').first();
    await live.scrollIntoViewIfNeeded();
    await live.click();
    await expect(page.locator('[data-demo-stage] iframe').first()).toBeAttached();
    await page.waitForTimeout(600);

    expect(blocked).toEqual([]);
  });

  // El build local no tiene endpoint: se apunta el formulario a Web3Forms (clave falsa) y se intercepta la red.
  // La CSP decide antes que Playwright: si connect-src no admitiera el origen, el fetch se bloquearía
  // y saldría la violación (y el estado "enviado" no aparecería)
  test('sending the contact form to Web3Forms stays within the policy', async ({ page, baseURL }) => {
    const { blocked } = await guard(page, new URL(baseURL ?? '').origin);
    let posted = 0;
    await page.route('https://api.web3forms.com/**', (route) => {
      posted += 1;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await open(page, '/contact/');
    // Lo que pinta producción: /submit y la clave (aquí, falsa) en un campo oculto
    await page.evaluate((url) => {
      const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
      if (!form) return;
      form.setAttribute('data-endpoint', url);
      form.setAttribute('action', url);
      form.prepend(Object.assign(document.createElement('input'), { type: 'hidden', name: 'access_key', value: '00000000-0000-4000-8000-000000000000' }));
    }, 'https://api.web3forms.com/submit');
    await page.locator('[data-contact-form] input[name="name"]').fill('Laura Vidal');
    await page.locator('[data-contact-form] input[name="email"]').fill('laura@estudio.example');
    await page.locator('[data-contact-form] textarea[name="message"]').fill('Buscamos a alguien que diseñe y programe la nueva web.');
    await page.locator('[data-contact-form] button[type="submit"]').click();
    await expect(page.locator('[data-form-sent]')).toBeVisible();
    expect(posted).toBe(1);
    expect(blocked).toEqual([]);
  });
});
