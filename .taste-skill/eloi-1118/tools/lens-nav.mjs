// La lente al cambiar de página: se activa, se navega con el menú y se mira qué queda.
const [CDP, url] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('lens', 'code'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2400 });
const state = () => p.eval(() => ({ path: location.pathname, lens: document.documentElement.dataset.lens, capas: document.querySelectorAll('.lens-layer').length, marcas: document.querySelectorAll('.lens-layer .lm:not([hidden])').length, barra: document.querySelector('[data-lens-stats]').textContent.replace(/\s+/g, ' ').slice(-70), errores: window.__errs }));
console.log(JSON.stringify(await state()));
await p.eval(() => [...document.querySelectorAll('.toolbar-nav a')].find((a) => /about/.test(a.href)).click());
await sleep(4200);
console.log(JSON.stringify(await state()));
await p.eval(() => document.querySelector('[data-canvas-open]').click()); await sleep(1500);
console.log(JSON.stringify(await p.eval(() => ({ lienzo: document.documentElement.classList.contains('canvas-open'), capaVisible: getComputedStyle(document.querySelector('.lens-layer')).opacity, barra: getComputedStyle(document.querySelector('.lens-bar')).visibility }))));
await browser.close(); process.exit(0);
