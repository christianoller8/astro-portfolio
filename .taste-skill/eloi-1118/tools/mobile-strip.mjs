// Una página entera a 390 px, pantalla a pantalla (sin solapes), para revisarla como tira.
// Uso: node mobile-strip.mjs <cdp.mjs> <carpeta> <url> <light|dark> <prefijo> [ancho=390] [alto=844]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, prefix, width = '390', height = '844'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const w = +width, h = +height;
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: true, dsf: 1.5 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); localStorage.removeItem('projects-mode'); } catch (e) {}` });
await p.goto(url, { settleMs: 2400 });
const total = await p.eval(() => document.documentElement.scrollHeight);
const step = h - 56; // la barra queda fija arriba: se descuenta para no repetir contenido
let n = 0;
for (let y = 0; y < total - 60; y += step) {
  await p.eval((v) => window.scrollTo(0, v), y); await sleep(650);
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
  writeFileSync(`${dir}/${prefix}-${String(n++).padStart(2, '0')}.jpg`, Buffer.from(data, 'base64'));
}
console.log(prefix, 'alto', total, 'pantallas', n);
await browser.close(); process.exit(0);
