// Capturas del viewport a varias posiciones de scroll. Uso: node scroll-shots.mjs <cdp.mjs> <url> <prefijo-salida> <light|dark> <y1,y2,...>
const [CDP, url, pre, scheme, ys] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); } catch (e) {}` });
await p.goto(url, { settleMs: 1500 });
for (const y of ys.split(',')) {
  await p.eval((y) => scrollTo({ top: +y, behavior: 'instant' }), y);
  await p.wheel(40, { step: 40 });
  await sleep(1100);
  await p.screenshot({ path: `${pre}-${y}.jpg`, quality: 82 });
}
await browser.close(); process.exit(0);
