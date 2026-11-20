// Miniaturas del lienzo navegable: captura la parte de arriba de cada página (1440 × 1800), en los
// dos idiomas y los dos modos, y apunta la altura real de cada una.
// Uso: node canvas-thumbs.mjs <cdp.mjs> <carpeta-salida> <origen, p. ej. http://localhost:4400>
import { writeFileSync } from 'node:fs';
const [CDP, dir, origin] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const PAGES = { home: '/', projects: '/projects/', 'p-tempora': '/projects/tempora/', 'p-vibora': '/projects/vibora/', 'p-learnish': '/projects/learnish/', 'p-vistalo': '/projects/vistalo/', about: '/about/', contact: '/contact/' };
const browser = await Browser.launch();
const sizes = {};
for (const lang of ['es', 'en']) {
  for (const theme of ['light', 'dark']) {
    for (const [key, path] of Object.entries(PAGES)) {
      const p = await browser.newPage({ width: 1440, height: 900, dsf: 1 });
      await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
      await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
      await p.goto(origin + (lang === 'en' ? '/en' : '') + path, { settleMs: 1200 });
      // Todo a la vista: sin entradas escalonadas pendientes y con las imágenes cargadas
      await p.eval(() => {
        const s = document.createElement('style');
        // La caricatura con su bocadillo va fija en la ventana: en la captura alta caería en medio de la página
        s.textContent = '[data-reveal]{opacity:1!important;transform:none!important}*{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}[data-vb]{display:none!important}';
        document.head.append(s);
        document.querySelectorAll('img[loading=lazy]').forEach((img) => { img.loading = 'eager'; });
        window.scrollTo(0, 1200); window.scrollTo(0, 0);
      });
      await sleep(1400);
      // El frame es la barra más el artboard (D23): la miniatura empieza con la barra
      const h = await p.eval(() => Math.round(document.querySelector('.artboard').offsetHeight + (document.querySelector('.toolbar')?.offsetHeight ?? 0)));
      sizes[`${lang}-${key}`] = h;
      const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: 1800, scale: 1 } });
      writeFileSync(`${dir}/${lang}-${key}-${theme}.jpg`, Buffer.from(data, 'base64'));
      await p.close?.();
    }
    console.log(lang, theme, 'ok');
  }
}
writeFileSync(`${dir}/sizes.json`, JSON.stringify(sizes, null, 1));
await browser.close(); process.exit(0);
