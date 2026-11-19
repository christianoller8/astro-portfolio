// Fotogramas de la prueba de trazado de la marca.
const [CDP, B, OUT] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1100, height: 700 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await p.goto(B + '/sistema/', { settleMs: 1200 });
const c = await p.eval(() => { document.querySelector('.brand-hero').scrollIntoView({ block: 'center', behavior: 'instant' }); const b = document.querySelector('[data-car-play]').getBoundingClientRect(); return { x: b.left + 20, y: b.top + 10 }; });
await sleep(300);
for (const type of ['mousePressed', 'mouseReleased']) await p.send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
const t0 = Date.now();
for (const t of [250, 550, 950, 1250, 1700]) { await sleep(Math.max(0, t - (Date.now() - t0))); await p.screenshot({ path: `${OUT}/e1-marca-trazo-${String(t).padStart(4, '0')}.jpg`, quality: 80 }); }
await browser.close(); process.exit(0);
