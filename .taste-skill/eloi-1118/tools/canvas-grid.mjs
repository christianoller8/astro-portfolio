// El lienzo en móvil (rejilla): lo abre desde el menú y captura.
// Uso: node canvas-grid.mjs <cdp.mjs> <salida.jpg> <url> <light|dark>
import { writeFileSync } from 'node:fs';
const [CDP, out, url, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 390, height: 844, mobile: true, dsf: 2 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 1500 });
await p.eval(() => { document.getElementById('menu-btn').click(); });
await sleep(500);
await p.eval(() => { document.querySelector('#mobile-menu [data-canvas-open]').click(); });
await sleep(1600);
console.log(JSON.stringify(await p.eval(() => { const o = document.querySelector('[data-canvas]'); return { hidden: o.hidden, menu: document.getElementById('mobile-menu').hidden, desborda: document.documentElement.scrollWidth > innerWidth, alto: o.scrollHeight, y: Math.round(o.scrollTop) }; })));
const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
writeFileSync(out, Buffer.from(data, 'base64'));
await browser.close(); process.exit(0);
