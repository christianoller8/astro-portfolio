import { expect, test, type Page } from '@playwright/test';
import { LANGS, PAGES, PROJECTS, pageUrl, t, type Lang } from './helpers';

// Aquí no hace falta que la página se pinte entera: basta con el HTML
const load = (page: Page, url: string) => page.goto(url, { waitUntil: 'domcontentloaded' });

const attr = (page: Page, selector: string, name: string) => page.locator(selector).first().getAttribute(name);
const pathOf = (href: string | null) => new URL(href ?? '', 'http://x').pathname;

const HREFLANG = { es: 'es-ES', en: 'en-US' } as const;

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('SEO basics', () => {
  test.skip(({ isMobile }) => isMobile, 'El HTML es el mismo en móvil: se comprueba una sola vez, en escritorio');

  for (const lang of LANGS) {
    for (const { id, path } of PAGES) {
      test(`${lang} ${id}: canonical equals its own hreflang entry and its og:url`, async ({ page }) => {
        const url = pageUrl(lang, path);
        await load(page, url);

        const canonical = await attr(page, 'link[rel="canonical"]', 'href');
        const own = await attr(page, `link[rel="alternate"][hreflang="${HREFLANG[lang]}"]`, 'href');
        const other = await attr(page, `link[rel="alternate"][hreflang="${HREFLANG[lang === 'es' ? 'en' : 'es']}"]`, 'href');
        const fallback = await attr(page, 'link[rel="alternate"][hreflang="x-default"]', 'href');

        expect(canonical, 'canonical').toBeTruthy();
        expect(canonical).toBe(own);
        expect(pathOf(canonical)).toBe(url);
        // La otra versión es la misma página en el otro idioma, y la de por defecto es la española
        expect(pathOf(other)).toBe(pageUrl(lang === 'es' ? 'en' : 'es', path));
        expect(pathOf(fallback)).toBe(pageUrl('es', path));
        // Todo acaba en barra y cuelga del mismo dominio
        for (const href of [canonical, own, other, fallback]) {
          expect(href).toMatch(/^https:\/\/[^/]+\/.*\/$|^https:\/\/[^/]+\/$/);
        }
        expect(new URL(canonical ?? '').origin).toBe(new URL(other ?? '').origin);
        expect(await attr(page, 'meta[property="og:url"]', 'content')).toBe(canonical);
        expect(await page.locator('html').getAttribute('lang')).toBe(lang);
      });

      test(`${lang} ${id}: the JSON-LD parses and describes the person`, async ({ page }) => {
        await load(page, pageUrl(lang, path));
        const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
        expect(blocks.length).toBeGreaterThan(0);
        const parsed = blocks.map((text) => JSON.parse(text) as { '@context': string; '@graph': { '@type': string; name?: string; inLanguage?: string; url?: string }[] });
        for (const data of parsed) expect(data['@context']).toBe('https://schema.org');
        const graph = parsed.flatMap((data) => data['@graph']);
        const person = graph.find((node) => node['@type'] === 'Person');
        expect(person?.name).toBe('Christian Oller');
        // Solo las portadas describen además la web, en su idioma
        const site = graph.find((node) => node['@type'] === 'WebSite');
        if (id === 'home') expect(site?.inLanguage).toBe(lang === 'es' ? 'es-ES' : 'en-US');
        else expect(site).toBeUndefined();
      });
    }
  }

  // Cada página comparte una captura de sí misma, en su idioma (public/og/, generadas con og-images.mjs),
  // y el archivo existe y mide lo que dicen sus etiquetas
  const SHOTS = [
    ...PAGES.filter(({ id }) => id !== 'case').map(({ id, path }) => ({ key: id as string, path: path as string })),
    ...PROJECTS.map(({ slug }) => ({ key: slug as string, path: `/projects/${slug}/` })),
  ];
  for (const lang of LANGS) {
    for (const { key, path } of SHOTS) {
      test(`${lang} ${key}: shares a screenshot of itself`, async ({ page, request }) => {
        await load(page, pageUrl(lang, path));
        const image = await attr(page, 'meta[property="og:image"]', 'content');
        expect(pathOf(image)).toBe(`/og/${lang}-${key}.jpg`);
        expect(await attr(page, 'meta[name="twitter:image"]', 'content')).toBe(image);
        // El texto alternativo describe la captura: el retrato en la home y, en el resto, la página por
        // su nombre (un solo tramo: "Tempora", no "Proyectos / Tempora")
        const alt = await attr(page, 'meta[property="og:image:alt"]', 'content');
        if (key === 'home') expect(alt).toBe(t(lang, 'meta.og.alt'));
        else expect(alt).toMatch(new RegExp(`^${escapeRegExp(t(lang, 'meta.og.page')).replace('\\{page\\}', '[^/]+')}$`));
        expect(await attr(page, 'meta[name="twitter:image:alt"]', 'content')).toBe(alt);
        // La etiqueta apunta a la web publicada: el archivo se pide a esta, por su ruta
        const response = await request.get(pathOf(image));
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('image/jpeg');
        const size = await page.evaluate(async (src) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          return [img.naturalWidth, img.naturalHeight];
        }, pathOf(image));
        const declared = await Promise.all(['width', 'height'].map((side) => attr(page, `meta[property="og:image:${side}"]`, 'content')));
        expect(size).toEqual(declared.map(Number));
      });
    }
  }

  for (const lang of LANGS) {
    test(`${lang}: title and description are written in the page language`, async ({ page }) => {
      await load(page, pageUrl(lang, '/'));
      await expect(page).toHaveTitle(/Christian Oller/);
      const description = (await attr(page, 'meta[name="description"]', 'content')) ?? '';
      expect(description.length).toBeGreaterThan(50);
      expect(description).toMatch(lang === 'es' ? /Diseñador|diseño/i : /Designer|design/i);
    });
  }

  for (const { lang, url } of [
    { lang: 'es' as Lang, url: '/no-existe/' },
    { lang: 'en' as Lang, url: '/en/no-existe/' },
  ]) {
    test(`the 404 (${lang}) declares no canonical or alternates`, async ({ page }) => {
      await load(page, url);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
      // Sin captura propia, comparte la imagen general
      expect(pathOf(await attr(page, 'meta[property="og:image"]', 'content'))).toBe('/og-image.jpg');
      expect(JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '{}')).toHaveProperty('@graph');
    });
  }
});
