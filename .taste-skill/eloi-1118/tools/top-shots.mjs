// Captura la parte de arriba de una página (sin scroll) a un ancho y en un modo dados.
// Uso: node top-shots.mjs <cdp.mjs> <salida.jpg> <url> <ancho> <light|dark>
const [CDP, out, url, width, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const mobile = +width < 600;
const p = await browser.newPage({ width: +width, height: mobile ? 844 : 900, mobile, dsf: mobile ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); } catch (e) {}` });
await p.goto(url, { settleMs: 1800 });
console.log(await p.eval(() => document.querySelector('.frame-label')?.textContent.replace(/\s+/g, ' ').trim()));
await p.screenshot({ path: out, quality: 84 });
await browser.close(); process.exit(0);
