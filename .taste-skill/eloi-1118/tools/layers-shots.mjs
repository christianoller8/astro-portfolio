// La vista en capas (three.js): reposo, girada y con la separación al mínimo y al máximo.
// Uso: node layers-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message)); addEventListener('unhandledrejection', (e) => window.__errs.push(String(e.reason)));` });
await p.goto(url, { settleMs: 2400 });
const shot = async (name) => { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 82 }); writeFileSync(`${dir}/${prefix}-${name}.jpg`, Buffer.from(data, 'base64')); };
await p.eval(() => document.querySelector('[data-layers]').scrollIntoView({ block: 'center' }));
await sleep(4500);
console.log(JSON.stringify(await p.eval(() => { const s = document.querySelector('[data-layers]'); const c = s.querySelector('canvas'); return { clases: s.className, lienzo: c ? [c.width, c.height] : null, etiquetas: [...s.querySelectorAll('[data-layers-label]')].map((l) => l.style.transform), errores: window.__errs, desborda: document.documentElement.scrollWidth > innerWidth }; })));
await shot('1-reposo');
const c = await p.eval(() => { const r = document.querySelector('[data-layers-stage]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y });
await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 });
await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x + 170, y: c.y + 30, button: 'left' });
await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x + 170, y: c.y + 30, button: 'left', clickCount: 1 });
await sleep(1500); await shot('2-girada');
await p.eval(() => { const r = document.querySelector('[data-layers-gap]'); r.value = '0'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await sleep(1600); await shot('3-juntas');
await p.eval(() => { const r = document.querySelector('[data-layers-gap]'); r.value = '100'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await sleep(1600); await shot('4-abiertas');
await browser.close(); process.exit(0);
