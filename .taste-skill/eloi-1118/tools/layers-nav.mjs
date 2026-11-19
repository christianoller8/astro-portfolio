// La escena 3D al navegar: se abre, se sale de la página, se vuelve y se mira que no queden errores ni lienzos sueltos.
const [CDP, origin] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message)); addEventListener('unhandledrejection', (e) => window.__errs.push(String(e.reason)));` });
await p.goto(origin + '/', { settleMs: 2400 });
const t0 = await p.eval(() => performance.getEntriesByType('resource').filter((r) => /three/.test(r.name)).length);
await p.eval(() => document.querySelector('[data-layers]').scrollIntoView({ block: 'center' })); await sleep(3500);
const t1 = await p.eval(() => performance.getEntriesByType('resource').filter((r) => /three/.test(r.name)).map((r) => Math.round(r.transferSize / 1024) + ' KB'));
console.log('three antes de acercarse:', t0, '| después:', t1);
await p.eval(() => [...document.querySelectorAll('.toolbar-nav a')].find((a) => /about/.test(a.href)).click()); await sleep(4200);
console.log(JSON.stringify(await p.eval(() => ({ path: location.pathname, lienzos3d: document.querySelectorAll('[data-layers] canvas').length, errores: window.__errs }))));
await p.eval(() => history.back()); await sleep(4200);
await p.eval(() => document.querySelector('[data-layers]').scrollIntoView({ block: 'center' })); await sleep(3000);
console.log(JSON.stringify(await p.eval(() => ({ path: location.pathname, clases: document.querySelector('[data-layers]').className, lienzos3d: document.querySelectorAll('[data-layers-stage] canvas').length, errores: window.__errs }))));
// Tema: las capas se repintan
await p.eval(() => document.querySelector('.theme-toggle-btn').click()); await sleep(1500);
console.log(JSON.stringify(await p.eval(() => ({ oscuro: document.documentElement.classList.contains('dark'), errores: window.__errs }))));
await browser.close(); process.exit(0);
