// Captura un elemento (o la página entera) de una URL a un ancho dado, en claro u oscuro.
// Uso: node shot.mjs <cdp.mjs> <url> <salida.jpg> [selector] [ancho] [light|dark]
const [CDP, url, out, selector = '', width = '1440', scheme = 'light'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const mobile = +width < 600;
const page = await browser.newPage({ width: +width, height: mobile ? 844 : 900, mobile, dsf: mobile ? 2 : 1 });
await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); } catch (e) {}` });
await page.goto(url, { settleMs: 1200 });
await page.wheel(20000, { step: 500, pauseMs: 30 });
await sleep(500);
let clip;
if (selector) {
  clip = await page.eval((s) => {
    const el = document.querySelector(s); if (!el) return null;
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top + scrollY), width: innerWidth, height: Math.min(r.height, 4000) };
  }, selector);
  if (!clip) { console.error('No existe ' + selector); await browser.close(); process.exit(1); }
  await sleep(700);
}
if (clip) {
  const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 82, captureBeyondViewport: true, clip: { ...clip, scale: 1 } }, 45000);
  (await import('node:fs')).writeFileSync(out, Buffer.from(data, 'base64'));
} else await page.screenshot({ path: out, quality: 82, fullPage: true });
console.log('ok', out, clip ? `${clip.width}x${Math.round(clip.height)}` : 'página entera');
await browser.close();
process.exit(0);
