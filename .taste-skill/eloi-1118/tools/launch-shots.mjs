// Capturas del lanzamiento (roadmap, Lanzamiento): las pantallas que se enseñan de cada página, a
// 1440 px y en móvil, en oscuro. Por defecto en inglés (--lang es para el español).
// Contra la web construida (pnpm build y pnpm preview --port 4400).
//
// Uso, desde la raíz del repo:
//   node .taste-skill/eloi-1118/tools/launch-shots.mjs [--lang en|es] [--url http://127.0.0.1:4400]
//
// Salida (fuera de git), una carpeta por idioma:
//   videos-raw/capturas/<lang>/1440/NN-nombre.png   1440 × 900 a 2x (2880 × 1800)
//   videos-raw/capturas/<lang>/movil/NN-nombre.png  390 × 844 a 3x (1170 × 2532)
// Va con Edge instalado (channel msedge). En un navegador automatizado la intro no sale: el hero se
// captura ya asentado.
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const option = (flag, fallback) => {
  const at = process.argv.indexOf(flag);
  return at > 0 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LANG = option('--lang', 'en');
const ORIGIN = option('--url', 'http://127.0.0.1:4400');
const PREFIX = LANG === 'en' ? '/en' : '';
const OUT = join(ROOT, 'videos-raw', 'capturas', LANG);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DEVICES = {
  1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  movil: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

// section: lo que queda arriba de la pantalla; offset, lo que se deja por encima (un número, o uno
// por dispositivo: en móvil el título de "Cómo lo veo yo" quedaba bajo el degradado de la barra).
// lens: lente puesta (se guarda en sessionStorage y se recarga). canvas: el lienzo abierto.
// only: la captura sale solo en ese dispositivo.
const SHOTS = [
  { name: 'inicio', path: '/' },
  { name: 'inicio-lente-codigo', path: '/', lens: 'code', only: '1440' },
  { name: 'inicio-lente-qa', path: '/', lens: 'qa', only: '1440' },
  { name: 'inicio-proyectos', path: '/', section: '.projects' },
  { name: 'inicio-como-lo-veo', path: '/', section: '[data-view-scene]', offset: { movil: 56 } },
  { name: 'inicio-capas', path: '/', section: '[data-layers]', offset: 80 },
  { name: 'inicio-trayectoria', path: '/', section: '.path' },
  { name: 'lienzo', path: '/', canvas: true },
  { name: 'proyectos', path: '/projects/' },
  { name: 'proyectos-tempora', path: '/projects/', section: 'article.bento:has([data-morph-title="tempora"])', offset: 96 },
  { name: 'caso-tempora', path: '/projects/tempora/' },
  { name: 'sobre-mi', path: '/about/' },
  { name: 'contacto', path: '/contact/' },
];

async function shoot(context, shot, device, file) {
  const page = await context.newPage();
  await page.goto(`${ORIGIN}${PREFIX}${shot.path}`, { waitUntil: 'load' });
  if (shot.lens) {
    await page.evaluate((lens) => sessionStorage.setItem('lens', lens), shot.lens);
    await page.reload({ waitUntil: 'load' });
  }
  await page.evaluate(() => document.fonts.ready);
  await wait(1200);

  if (shot.section) {
    await page.evaluate(({ selector, offset }) => {
      const top = document.querySelector(selector).getBoundingClientRect().top + scrollY - offset;
      scrollTo({ top, behavior: 'instant' });
    }, { selector: shot.section, offset: typeof shot.offset === 'object' ? (shot.offset[device] ?? 0) : (shot.offset ?? 0) });
    // Las capas 3D esperan a three.js; el resto, a que entren las piezas
    if (shot.section === '[data-layers]') {
      await page.waitForFunction(() => /is-ready|is-flat/.test(document.querySelector('[data-layers]')?.className ?? ''), null, { timeout: 15_000 });
    }
    await wait(1600);
  }

  if (shot.canvas) {
    const toggle = page.locator('[data-vb-toggle]:visible').first();
    if (await toggle.count()) {
      await toggle.click();
      await page.locator('[data-vb-panel] [data-canvas-open]').click();
    } else {
      await page.keyboard.press('m');
    }
    await page.waitForFunction(() => document.documentElement.classList.contains('canvas-open'), null, { timeout: 5_000 });
    await wait(1800);
  }

  // El ratón, fuera de la página: ningún hover a medias en la captura
  await page.mouse.move(0, 0);
  await page.screenshot({ path: file });
  await page.close();
}

const browser = await chromium.launch({ channel: 'msedge' });
for (const [device, settings] of Object.entries(DEVICES)) {
  const dir = join(OUT, device);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({ ...settings, colorScheme: 'dark' });
  let n = 0;
  for (const shot of SHOTS) {
    if (shot.only && shot.only !== device) continue;
    n += 1;
    const file = join(dir, `${String(n).padStart(2, '0')}-${shot.name}.png`);
    await shoot(context, shot, device, file);
    console.log(`${LANG}/${device}: ${String(n).padStart(2, '0')}-${shot.name}`);
  }
  await context.close();
}
await browser.close();
