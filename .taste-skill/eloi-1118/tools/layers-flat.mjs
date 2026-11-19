// La vista en capas sin WebGL: se anula el contexto 3D antes de cargar y se mira la alternativa plana.
import { writeFileSync } from 'node:fs';
const [CDP, out, url] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/.test(type) ? null : get.call(this, type, ...rest); }; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message)); addEventListener('unhandledrejection', (e) => window.__errs.push(String(e.reason)));` });
await p.goto(url, { settleMs: 2400 });
await p.eval(() => document.querySelector('[data-layers]').scrollIntoView({ block: 'center' })); await sleep(3500);
console.log(JSON.stringify(await p.eval(() => ({ clases: document.querySelector('[data-layers]').className, lienzos: document.querySelectorAll('[data-layers-flat] canvas').length, errores: window.__errs }))));
const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(out, Buffer.from(data, 'base64'));
await browser.close(); process.exit(0);
