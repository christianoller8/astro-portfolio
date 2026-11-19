// Graba la transición entre páginas a cámara lenta (alarga --dur-pan) en fotogramas seguidos.
// Uso: node nav-frames.mjs <cdp.mjs> <carpeta> <url-inicial> <selector-del-enlace> <light|dark> <ancho>x<alto> <prefijo> [lento ms]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, link, scheme, size, prefix, slow = '5000'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 1500 });
// La hoja de estilos del <head> se cambia en cada navegación: el ajuste va en línea en <html>, y se repone tras el swap
await p.eval(`(() => { const set = () => document.documentElement.style.setProperty('--dur-pan', '${slow}ms'); set(); document.addEventListener('astro:after-swap', set); })()`);
const errors = [];
await p.eval(`window.addEventListener('error', (e) => { (window.__errs = window.__errs || []).push(String(e.message)); })`);
await p.eval(`document.querySelector(${JSON.stringify(link)}).click()`);
const t0 = Date.now();
const frames = [];
while (Date.now() - t0 < +slow + 900) {
  const at = Date.now() - t0;
  try { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); frames.push([at, data]); } catch (e) { errors.push(String(e).slice(0, 80)); }
  await sleep(40);
}
frames.forEach(([at, data]) => writeFileSync(`${dir}/${prefix}-${String(at).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64')));
console.log('fotogramas', frames.length, frames.map((f) => f[0]).join(' '));
console.log(JSON.stringify(await p.eval(() => ({ url: location.pathname, cls: document.documentElement.className, errs: window.__errs || [] }))), errors.slice(0, 3));
await browser.close(); process.exit(0);
