// Captura la barra superior (y un trozo de página) a varios anchos y mide si cabe.
// Uso: node bar-shots.mjs <cdp.mjs> <carpeta-salida> <url> <light|dark> <alto> anchos…
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, height, ...widths] = process.argv.slice(2);
const { Browser } = await import(CDP);
const browser = await Browser.launch();
for (const w of widths) {
  const mobile = +w < 600;
  const p = await browser.newPage({ width: +w, height: 800, mobile, dsf: 2 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
  await p.goto(url, { settleMs: 1500 });
  const m = await p.eval(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; };
    const inner = document.querySelector('.toolbar-inner');
    return { cabe: inner.scrollWidth <= inner.clientWidth, ancho: [inner.scrollWidth, inner.clientWidth], marca: r('.brand'), menu: r('.toolbar-nav'), vista: r('.tool-view'), prefs: r('.tool-prefs') };
  });
  console.log(w, scheme, JSON.stringify(m));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: +w, height: +height, scale: 1 } });
  writeFileSync(`${dir}/e2-barra-${scheme}-${w}.jpg`, Buffer.from(data, 'base64'));
  await p.close?.();
}
await browser.close(); process.exit(0);
