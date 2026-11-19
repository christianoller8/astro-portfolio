// Fotogramas de la salida de la intro (iris + entrada del hero), congelando las animaciones en
// instantes concretos. Para poder pararlas, en esta prueba se anula el temporizador de limpieza.
// Uso: node intro-iris.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo> ms…
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, ...times] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); try { sessionStorage.removeItem('intro-done'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}
  const st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => (ms === 1150 ? 0 : st(fn, ms, ...a));` });
await p.goto(url, { settleMs: 200 });
for (let i = 0; i < 80; i++) { if (await p.eval(() => !!document.querySelector('.intro-screen.is-leaving'))) break; await sleep(50); }
for (const ms of times) {
  await p.eval(`document.getAnimations().filter((a) => ['intro-iris', 'ink-in'].includes(a.animationName)).forEach((a) => { a.pause(); a.currentTime = ${+ms}; })`);
  await sleep(300);
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  writeFileSync(`${dir}/${prefix}-iris-${String(ms).padStart(4, '0')}.jpg`, Buffer.from(data, 'base64'));
}
console.log('ok', await p.eval(() => document.getAnimations().filter((a) => ['intro-iris', 'ink-in'].includes(a.animationName)).length));
await browser.close(); process.exit(0);
