// Imágenes para compartir (og:image): la parte de arriba de cada página a 1200 × 630, en modo oscuro y
// en los dos idiomas, como la general (public/og-image.jpg). Van a public/og/<idioma>-<página>.jpg y
// Layout.astro elige la de cada página por su ruta. Hay que volver a lanzarlo cuando cambie el diseño
// de la parte de arriba de una página, igual que las miniaturas del lienzo.
// Uso, con la web construida y servida (pnpm build y pnpm preview --port 4400):
//   node .taste-skill/eloi-1118/tools/og-images.mjs [origen, por defecto http://127.0.0.1:4400]
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const origin = process.argv[2] ?? 'http://127.0.0.1:4400';
const out = fileURLToPath(new URL('../../../public/og/', import.meta.url));
// La clave es la que Layout.astro saca de la ruta: el último tramo, o "home" en la portada
const PAGES = {
  home: '/',
  projects: '/projects/',
  tempora: '/projects/tempora/',
  vibora: '/projects/vibora/',
  learnish: '/projects/learnish/',
  vistalo: '/projects/vistalo/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
};
// Retoques por página: en la home, los botones del hero caen justo en el borde de abajo y salían
// cortados por la mitad; sin ellos, el titular y la frase cierran la imagen
const EXTRA = { home: '.hero-actions{visibility:hidden!important}' };

mkdirSync(out, { recursive: true });
// Como en las pruebas: el Chromium de Playwright si está instalado y, si no, Edge
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));
// Un navegador automatizado no ve la intro, y el almacenamiento empieza vacío (sin lente ni tema guardados)
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'dark' });

for (const lang of ['es', 'en']) {
  for (const [key, path] of Object.entries(PAGES)) {
    const page = await context.newPage();
    await page.goto(origin + (lang === 'en' ? '/en' : '') + path, { waitUntil: 'load' });
    // Todo en su sitio: sin entradas escalonadas a medias, y sin la caricatura ni su bocadillo, que van
    // fijos en la esquina (lo mismo que canvas-thumbs.mjs)
    await page.addStyleTag({
      content:
        '[data-reveal]{opacity:1!important;transform:none!important}*{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}[data-vb]{display:none!important}.stack-card{animation:none!important;opacity:1!important;transform:none!important}' +
        (EXTRA[key] ?? ''),
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    // Nada a medias en lo que se ve: si algo sigue con opacidad menor que 1, se avisa (menos el cursor
    // de la firma, que se apaga a propósito cuando acaba de escribirse)
    const faded = await page.evaluate(() =>
      [...document.querySelectorAll('.artboard *, .toolbar *')]
        .filter((el) => {
          if (el.matches('.brand-caret')) return false;
          const box = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return box.top < innerHeight && box.height > 20 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '1';
        })
        .slice(0, 3)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 30)} ${getComputedStyle(el).opacity}`),
    );
    // La imagen se guarda igual, pero el guion acaba con error para que no pase desapercibido
    if (faded.length) {
      console.log('AVISO opacidad a medias', lang, key, JSON.stringify(faded));
      process.exitCode = 1;
    }
    const file = `${out}${lang}-${key}.jpg`;
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
    console.log(`${lang}-${key}.jpg`, Math.round(statSync(file).size / 1024), 'KB');
    await page.close();
  }
}
await browser.close();
