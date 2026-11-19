// Un caso entero, apartado por apartado. Uso: node case-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2400 });
let n = 0;
const shot = async (tag) => { await sleep(700); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 }); writeFileSync(`${dir}/${prefix}-${String(n++).padStart(2, '0')}-${tag}.jpg`, Buffer.from(data, 'base64')); };
const go = (sel, block = 'start', dy = -70) => p.eval(({ sel, block, dy }) => { const el = document.querySelector(sel); if (!el) return false; el.scrollIntoView({ block }); window.scrollBy(0, dy); return true; }, { sel, block, dy });
await shot('cabecera');
if (await go('.case-problem')) await shot('problema');
if (await go('[data-case-screen]', 'end', -h * 0.55)) { await shot('boceto-1'); await p.eval((d) => window.scrollBy(0, d), h * 0.22); await shot('boceto-2'); await p.eval((d) => window.scrollBy(0, d), h * 0.3); await shot('boceto-3'); }
if (await go('.case-decisions')) await shot('decisiones');
if (await go('.case-code')) await shot('codigo');
if (await go('.case-tests')) await shot('pruebas');
if (await go('.case-result')) await shot('resultado');
if (await go('.case-enjoyed')) await shot('disfrute');
if (await go('.case-next', 'center', 0)) await shot('siguiente');
console.log(JSON.stringify(await p.eval(() => ({ errores: window.__errs, desborda: document.documentElement.scrollWidth > innerWidth, alto: document.documentElement.scrollHeight, pruebas: [...document.querySelectorAll('[data-case-checks] li, .tests li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim() + (li.querySelector('[data-state=fail]') ? ' ✗' : '')) }))));
await browser.close(); process.exit(0);
