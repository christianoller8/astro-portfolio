// La home de E4: cada proyecto antes y después de tocarlo, la trayectoria y el pie.
// Uso: node home-demos.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2600 });
let n = 0;
const shot = async (tag) => { await sleep(700); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`${dir}/${prefix}-${String(n++).padStart(2, '0')}-${tag}.jpg`, Buffer.from(data, 'base64')); };
const show = (sel) => p.eval((s) => { const el = document.querySelector(s); el?.closest('.stack-item, section, footer')?.scrollIntoView({ block: 'center' }); if (el && el.closest('.stack-item')) window.scrollBy(0, 0); return !!el; }, sel);
const click = (sel, times = 1) => p.eval(({ s, times }) => { for (let i = 0; i < times; i++) document.querySelector(s)?.click(); }, { s: sel, times });
await show('[data-demo="tempora"]'); await shot('tempora');
await click('[data-demo-add]', 2); await click('[data-demo-clock]'); await shot('tempora-tocado');
await show('[data-demo="vibora"]'); await shot('vibora');
await click('[data-demo="vibora"] [data-demo-slot]:not(.is-mine)'); await click('[data-demo-confirm]'); await shot('vibora-tocado');
await show('[data-demo="learnish"]'); await shot('learnish');
await click('[data-demo-reveal]'); await shot('learnish-respuesta'); await click('[data-demo-next="good"]'); await shot('learnish-siguiente');
await show('[data-demo="live"]'); await shot('vistalo');
await p.eval(() => document.querySelector('.path')?.scrollIntoView({ block: 'start' })); await p.eval(() => window.scrollBy(0, -80)); await shot('trayectoria');
await p.eval(() => window.scrollTo(0, document.documentElement.scrollHeight)); await shot('pie');
console.log(JSON.stringify(await p.eval(() => ({ errores: window.__errs, desborda: document.documentElement.scrollWidth > innerWidth, alto: document.documentElement.scrollHeight }))));
await browser.close(); process.exit(0);
