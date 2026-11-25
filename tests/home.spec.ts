import { expect, test, type Page } from '@playwright/test';
import { LANGS, open, pageUrl, t, tf, type Lang } from './helpers';

/** La frase con la que arranca un anuncio con huecos, hasta el primero: "Turno añadido: " */
const startOf = (lang: Lang, key: Parameters<typeof t>[1]): RegExp => {
  const [head] = t(lang, key).split('{');
  return new RegExp(`^${head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
};

/** Las tarjetas de proyecto del inicio, con su posición y hasta dónde llegan */
const cards = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.stack-item')].map((li) => {
      const box = li.getBoundingClientRect();
      return { position: getComputedStyle(li).position, top: Math.round(box.top), bottom: Math.round(box.bottom) };
    }),
  );

/** Baja hasta el punto en el que la tarjeta `index` acaba de llegar a su sitio */
const scrollToCard = (page: Page, index: number, extra = 0) =>
  page.evaluate(
    ([i, plus]) => {
      const list = document.querySelector<HTMLElement>('.stack')!;
      const first = list.querySelector<HTMLElement>('.stack-item')!;
      const step = first.offsetHeight + (parseFloat(getComputedStyle(list).rowGap) || 0);
      const stick = parseFloat(getComputedStyle(first).top) || 0;
      window.scrollTo(0, list.getBoundingClientRect().top + window.scrollY + i * step - stick + plus);
    },
    [index, extra] as const,
  );

test.describe('Home: stacked project cards', () => {
  test('stick one over another on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'El apilado solo existe en escritorio con altura suficiente');
    await open(page, '/');
    await scrollToCard(page, 2, 30);
    // Con la tercera en su sitio, las tres primeras están fijadas en el mismo lugar
    await expect
      .poll(async () => {
        const [a, b, c, d] = await cards(page);
        return a.position === 'sticky' && a.top === b.top && b.top === c.top && c.bottom <= 900 && d.top >= c.bottom;
      })
      .toBe(true);
    expect((await cards(page)).length).toBe(4);
  });

  test('are a plain list on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'En móvil no hay apilado');
    await open(page, '/');
    await page.locator('.stack-item').nth(2).scrollIntoViewIfNeeded();
    const [a, b, c] = await cards(page);
    expect([a, b, c].every((card) => card.position !== 'sticky')).toBe(true);
    expect(b.top).toBeGreaterThan(a.bottom);
    expect(c.top).toBeGreaterThan(b.bottom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('are a plain list with reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Ya es una lista en móvil');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '/');
    const list = await cards(page);
    expect(list.every((card) => card.position !== 'sticky')).toBe(true);
  });
});

for (const lang of LANGS) {
  test.describe(`Home: project demos (${lang})`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
    });

    test('Tempora puts a shift in an empty cell of the rota when it is clicked, and announces it', async ({ page }) => {
      const demo = page.locator('.stack [data-demo="tempora"]');
      await demo.scrollIntoViewIfNeeded();
      const live = demo.locator('[data-demo-live-region]');
      const empty = demo.locator('[data-demo-cell]');
      const before = await empty.count();
      const name = (await empty.first().getAttribute('data-name')) ?? '';

      await empty.first().click();
      await expect(empty).toHaveCount(before - 1);
      await expect(demo.locator('.tp-shift.is-just')).toHaveCount(1);
      await expect(live).toHaveText(startOf(lang, 'demo.say.added'));
      await expect(live).toContainText(name);

      // Con el teclado, el foco pasa a la siguiente casilla vacía en vez de perderse
      await empty.first().focus();
      await page.keyboard.press('Enter');
      await expect(empty).toHaveCount(before - 2);
      await expect(empty.first()).toBeFocused();
    });

    test('Víbora picks a free hour, confirms it in the dialog and books it, and announces each step', async ({ page }) => {
      const demo = page.locator('.stack [data-demo="vibora"]');
      await demo.scrollIntoViewIfNeeded();
      const live = demo.locator('[data-demo-live-region]');
      const dialog = demo.locator('[data-demo-dialog]');
      const slots = demo.locator('[data-demo-slot]');
      const before = await slots.count();
      // Un localizador fijo a esa hora: el primer hueco libre cambia en cuanto se elige
      const slot = (await slots.first().getAttribute('data-demo-slot')) ?? '';
      const free = demo.locator(`[data-demo-slot="${slot}"]`);

      await free.click();
      await expect(free).toHaveAttribute('aria-pressed', 'true');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('[data-demo-time]')).toHaveText((await free.getAttribute('data-time')) ?? '');
      await expect(live).toHaveText(tf(lang, 'demo.say.picked', { slot }));
      // El diálogo recibe el foco en su botón principal
      await expect(dialog.locator('[data-demo-confirm]')).toBeFocused();

      // «Volver» quita la selección y devuelve el foco a la hora
      await dialog.locator('[data-demo-back]').click();
      await expect(dialog).toBeHidden();
      await expect(free).toHaveAttribute('aria-pressed', 'false');
      await expect(live).toHaveText(t(lang, 'demo.say.unpicked'));

      // Reservar: la hora deja de estar libre y el foco no se pierde
      await free.click();
      await dialog.locator('[data-demo-confirm]').click();
      await expect(dialog).toBeHidden();
      await expect(slots).toHaveCount(before - 1);
      await expect(demo.locator('.vb-slot.is-just')).toHaveCount(1);
      await expect(demo.locator('[data-demo-toast]')).toBeVisible();
      await expect(live).toHaveText(tf(lang, 'demo.say.confirmed', { slot }));
      await expect(slots.first()).toBeFocused();
    });

    test('Learnish flips the card, grades it with one of four buttons and moves on, and announces both', async ({ page }) => {
      const demo = page.locator('.stack [data-demo="learnish"]');
      await demo.scrollIntoViewIfNeeded();
      const live = demo.locator('[data-demo-live-region]');
      const word = demo.locator('[data-demo-word]');
      const answer = demo.locator('[data-demo-answer]');
      const grades = demo.locator('[data-demo-next]');
      const firstWord = await word.textContent();
      // "7 de 10": el número que sube al pasar de tarjeta se lee de la página, no se copia aquí
      const step = Number(((await demo.locator('[data-demo-progress]').textContent()) ?? '').match(/\d+/)?.[0]);
      expect(step).toBeGreaterThan(0);

      // Los cuatro botones solo salen con la tarjeta girada, como en la app
      await expect(answer).toBeHidden();
      await expect(grades.first()).toBeHidden();
      await demo.locator('[data-demo-reveal]').click();
      await expect(answer).toBeVisible();
      await expect(grades).toHaveCount(4);
      await expect(demo.locator('[data-demo-next="good"]')).toBeFocused();
      const text = (await answer.getAttribute('data-say')) ?? '';
      await expect(live).toHaveText(tf(lang, 'demo.say.answer', { answer: text }));

      await demo.locator('[data-demo-next="good"]').click();
      await expect(word).not.toHaveText(firstWord ?? '');
      const next = ((await word.textContent()) ?? '').trim();
      await expect(live).toHaveText(tf(lang, 'demo.say.card', { word: next }));
      await expect(demo.locator('[data-demo-progress]')).toHaveText(new RegExp(`^${step + 1}\\D`));
      await expect(answer).toBeHidden();
      await expect(demo.locator('[data-demo-reveal]')).toBeFocused();
    });
  });
}

test.describe('Home: 3D layers', () => {
  for (const lang of LANGS) {
    test(`the stage is a keyboard slider whose value text changes (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      const section = page.locator('[data-layers]');
      await section.scrollIntoViewIfNeeded();
      // O hay escena 3D (is-ready) o, sin WebGL, las capas planas (is-flat)
      await expect.poll(() => section.getAttribute('class'), { timeout: 20_000 }).toMatch(/is-ready|is-flat/);
      const flat = ((await section.getAttribute('class')) ?? '').includes('is-flat');
      // En CI (con SwiftShader) la escena 3D es obligatoria: caer a las capas planas es un fallo, no un salto
      if (process.env.CI) expect(flat, 'WebGL no está disponible: la escena cayó a las capas planas').toBe(false);
      if (flat) {
        test.info().annotations.push({ type: 'sin-webgl', description: 'Sin WebGL en este navegador: la escena 3D no se ha probado (solo se comprueba que caen las capas planas)' });
        test.skip(true, 'Sin WebGL: la escena se sustituye por las capas planas');
      }

      const stage = page.getByRole('slider', { name: t(lang, 'layers.label') });
      await expect(stage).toHaveAttribute('aria-valuemin', '-60');
      await expect(stage).toHaveAttribute('aria-valuemax', '60');
      const start = await stage.getAttribute('aria-valuetext');
      const startNow = Number(await stage.getAttribute('aria-valuenow'));

      await stage.focus();
      await page.keyboard.press('ArrowRight');
      await expect(stage).not.toHaveAttribute('aria-valuetext', start ?? '');
      expect(Number(await stage.getAttribute('aria-valuenow'))).toBeGreaterThan(startNow);

      // Bajando con la flecha izquierda se llega a 0 y se anuncia "De frente" (los pasos no se lo saltan)
      await page.keyboard.press('Home');
      await page.keyboard.press('End');
      await expect(stage).toHaveAttribute('aria-valuenow', '60');
      const seen = new Set<string>();
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('ArrowLeft');
        seen.add((await stage.getAttribute('aria-valuenow')) ?? '');
      }
      expect(seen.has('0'), `valores vistos: ${[...seen].join(', ')}`).toBe(true);
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowRight');
      for (let i = 0; i < 20 && (await stage.getAttribute('aria-valuenow')) !== '0'; i++) await page.keyboard.press('ArrowRight');
      await expect(stage).toHaveAttribute('aria-valuenow', '0');
      await expect(stage).toHaveAttribute('aria-valuetext', t(lang, 'layers.rotate.zero'));
      await page.keyboard.press('Home');
      await expect(stage).toHaveAttribute('aria-valuenow', '-60');
      await expect(stage).toHaveAttribute('aria-valuetext', tf(lang, 'layers.rotate.left', { n: '60' }));
      await page.keyboard.press('End');
      await expect(stage).toHaveAttribute('aria-valuenow', '60');
      await expect(stage).toHaveAttribute('aria-valuetext', tf(lang, 'layers.rotate.right', { n: '60' }));
    });
  }

  test('the gap control is labelled and reachable', async ({ page }) => {
    await open(page, '/');
    const range = page.getByRole('slider', { name: t('es', 'layers.gap') });
    await range.scrollIntoViewIfNeeded();
    await range.focus();
    await page.keyboard.press('ArrowRight');
    await expect(range).toBeFocused();
  });
});

test.describe('Home: hero', () => {
  // La foto del hero es el LCP y va en lazy: Layout.astro precarga la del tema activo con el mismo
  // srcset que su <img>. Si no coincidieran, el navegador la descargaría dos veces; y la del otro tema
  // no debe pedirse nunca. El tema activo es el guardado (localStorage 'theme') y, sin él, el del sistema:
  // el preload tiene que seguir esa elección, no el esquema del sistema.
  const themeCases = [
    { stored: null, system: 'light' },
    { stored: null, system: 'dark' },
    { stored: 'light', system: 'dark' },
    { stored: 'dark', system: 'light' },
  ] as const;
  for (const { stored, system } of themeCases) {
    const theme = stored ?? system;
    test(`downloads a single hero photo, the preloaded one (${stored ? `stored ${stored}, system ${system}` : `system ${system}`})`, async ({ page }) => {
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.resourceType() === 'image' && new URL(request.url()).pathname.startsWith('/_astro/card-')) requests.push(request.url());
      });
      await page.emulateMedia({ colorScheme: system });
      if (stored) await page.addInitScript((value) => localStorage.setItem('theme', value), stored);
      await page.goto('/');
      expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark');
      const photo = page.locator(`.hero-photo-img--${theme}`);
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

      // El preload existe, va con prioridad alta y su srcset y sizes son los del <img> visible
      const preload = page.locator('head link[rel="preload"][as="image"]');
      await expect(preload).toHaveCount(1);
      await expect(preload).toHaveAttribute('fetchpriority', 'high');
      await expect(preload).toHaveAttribute('imagesrcset', (await photo.getAttribute('srcset')) ?? '');
      await expect(preload).toHaveAttribute('imagesizes', (await photo.getAttribute('sizes')) ?? '');

      // Una sola petición (la del otro tema, oculto y en lazy, no se pide), la que eligió el preload (su
      // initiator es el <link>, no el <img>) y la misma que acabó pintando el <img>
      const shown = await photo.evaluate((img: HTMLImageElement) => img.currentSrc);
      expect(shown).not.toBe('');
      expect(requests).toEqual([shown]);
      const initiators = await page.evaluate(
        (url) => performance.getEntriesByType('resource').filter((entry) => entry.name === url).map((entry) => (entry as PerformanceResourceTiming).initiatorType),
        shown,
      );
      expect(initiators).toEqual(['link']);
    });
  }

  for (const lang of LANGS) {
    test(`its calls to action lead to the right places (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      await expect(page.getByRole('link', { name: t(lang, 'hero.cta.projects') })).toHaveAttribute('href', pageUrl(lang, '/projects/'));
      // El primero es el del hero; el pie lleva otro igual
      const cv = page.getByRole('link', { name: t(lang, 'hero.cta.cv') }).first();
      await expect(cv).toHaveAttribute('download', '');
      await expect(cv).toHaveAttribute('href', /\/cv\/.+\.pdf$/);
    });

    test(`each role button turns on its lens (${lang})`, async ({ page }) => {
      await open(page, pageUrl(lang, '/'));
      // En móvil, la barra de estado de las lentes lleva otro selector con los mismos nombres
      const roles = page.getByRole('list', { name: t(lang, 'hero.roles.label') });
      for (const lens of ['design', 'code', 'qa'] as const) {
        const role = roles.getByRole('button', { name: t(lang, `hero.roles.${lens}`), exact: true });
        await role.click();
        await expect(page.locator('html')).toHaveAttribute('data-lens', lens);
        await expect(role).toHaveAttribute('aria-pressed', 'true');
      }
      // Pulsar el que está puesto lo quita
      await roles.getByRole('button', { name: t(lang, 'hero.roles.qa'), exact: true }).click();
      await expect(page.locator('html')).not.toHaveAttribute('data-lens', /.*/);
    });
  }
});
