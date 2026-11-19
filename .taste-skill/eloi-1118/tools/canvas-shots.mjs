// Prueba el lienzo navegable: lo abre con la tecla M, captura el vuelo y el reposo, entra en un frame.
// Uso: node canvas-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo> [ruta-del-frame-al-que-entrar]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, enter = '/about'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 1600 });
const shot = async (name) => { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`${dir}/${prefix}-${name}.jpg`, Buffer.from(data, 'base64')); };
const key = async (k, code, vk) => { await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
await key('m', 'KeyM', 77);
await sleep(60); await shot('1-salida');
await sleep(380); await shot('2-vuelo');
await sleep(1500); await shot('3-abierto');
console.log(JSON.stringify(await p.eval(() => { const o = document.querySelector('[data-canvas]'); return { hidden: o.hidden, open: o.classList.contains('is-open'), k: o.style.getPropertyValue('--k'), aqui: document.querySelector('.cmap-frame[aria-current]')?.dataset.canvasFrame, cargadas: [...o.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth).length, pulsado: document.querySelector('[data-canvas-open]')?.getAttribute('aria-pressed') }; })));
// Pasa el ratón por un frame y entra en él
const c = await p.eval((path) => { const f = document.querySelector(`[data-canvas-frame="${path}"]`); const b = f.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, enter);
await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y, button: 'none' });
await sleep(250); await shot('4-seleccion');
await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 });
await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x, y: c.y, button: 'left', clickCount: 1 });
await sleep(420); await shot('5-entrando');
await sleep(1500); await shot('6-llegada');
console.log(JSON.stringify(await p.eval(() => ({ url: location.pathname, cls: document.documentElement.className, hidden: document.querySelector('[data-canvas]').hidden, inert: document.querySelector('main').inert }))));
await browser.close(); process.exit(0);
