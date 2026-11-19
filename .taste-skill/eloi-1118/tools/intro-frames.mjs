// Graba la intro en fotogramas reales (capturas seguidas con su instante) y los guarda.
// Uso: node intro-frames.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo> [duración ms]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, total = '3200'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
// La intro se salta con navigator.webdriver: aquí se quita para poder verla
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); try { sessionStorage.removeItem('intro-done'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
const nav = p.send('Page.navigate', { url });
const t0 = Date.now();
await nav;
const frames = [];
while (Date.now() - t0 < +total) {
  const at = Date.now() - t0;
  try {
    const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
    frames.push([at, data]);
  } catch (e) {}
  await sleep(20);
}
console.log('fotogramas', frames.length, 'instantes', frames.map((f) => f[0]).join(' '));
frames.forEach(([at, data]) => writeFileSync(`${dir}/${prefix}-${String(at).padStart(4, '0')}.jpg`, Buffer.from(data, 'base64')));
const state = await p.eval(() => ({ cls: document.documentElement.className, screen: getComputedStyle(document.querySelector('[data-intro-screen]')).display, opacity: [...document.querySelectorAll('[data-ink]')].map((e) => getComputedStyle(e).opacity).join(',') }));
console.log(JSON.stringify(state));
await browser.close(); process.exit(0);
