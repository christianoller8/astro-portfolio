// Proyectos: lienzo, frame señalado con el ratón, lista y vuelta al lienzo.
// Uso: node projects-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); localStorage.removeItem('projects-mode'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2400 });
let n = 0;
const shot = async (tag) => { await sleep(600); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`${dir}/${prefix}-${n++}-${tag}.jpg`, Buffer.from(data, 'base64')); };
await shot('lienzo');
if (w >= 900) {
  const pt = await p.eval(() => { const b = document.querySelector('#pf-vibora').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x - 4, y: pt.y }); await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y });
  await shot('senalado');
} else { await p.eval(() => window.scrollTo(0, 900)); await shot('lienzo-2'); await p.eval(() => window.scrollTo(0, 0)); }
await p.eval(() => document.querySelector('[data-projects-mode="list"]').click()); await shot('lista');
console.log(JSON.stringify(await p.eval(() => ({ modo: document.querySelector('[data-projects]').dataset.mode, guardado: localStorage.getItem('projects-mode'), errores: window.__errs, desborda: document.documentElement.scrollWidth > innerWidth, hilos: [...document.querySelectorAll('.board-thread path.kit-thread-line')].length }))));
await p.eval(() => document.querySelector('.plist-row').click()); await sleep(2600);
console.log(JSON.stringify(await p.eval(() => ({ path: location.pathname, errores: window.__errs }))));
await p.eval(() => history.back()); await sleep(2800);
console.log(JSON.stringify(await p.eval(() => ({ path: location.pathname, modoAlVolver: document.querySelector('[data-projects]')?.dataset.mode, pulsado: document.querySelector('[data-projects-mode="list"]')?.getAttribute('aria-pressed') }))));
await browser.close(); process.exit(0);
