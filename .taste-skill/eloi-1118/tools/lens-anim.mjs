// Fotogramas de la entrada de una lente y del cruce a otra, a cámara lenta (x0.1).
// Uso: node lens-anim.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 2600 });
await p.send('Animation.enable'); await p.send('Animation.setPlaybackRate', { playbackRate: 0.1 });
let n = 0;
const shot = async (tag) => { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`${dir}/${prefix}-${String(n++).padStart(2, '0')}-${tag}.jpg`, Buffer.from(data, 'base64')); };
const key = async (k) => { await p.send('Input.dispatchKeyEvent', k.length === 1 ? { type: 'keyDown', key: k, text: k } : { type: 'rawKeyDown', key: k, code: k, windowsVirtualKeyCode: 27 }); await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k }); };
await key('1');
for (const t of [300, 900, 1700, 3200, 7000]) { await sleep(n ? 600 : t); await shot('entra'); }
await key('3');
for (let i = 0; i < 4; i++) { await sleep(i ? 900 : 400); await shot('cruce'); }
await key('Escape');
await sleep(500); await shot('sale'); await sleep(2500); await shot('sale');
console.log(JSON.stringify(await p.eval(() => ({ capas: document.querySelectorAll('.lens-layer').length, lens: document.documentElement.dataset.lens ?? null }))));
await browser.close(); process.exit(0);
