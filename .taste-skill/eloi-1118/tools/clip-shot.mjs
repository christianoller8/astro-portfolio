// Recorte ampliado de un elemento. Uso: node clip-shot.mjs <cdp.mjs> <salida.jpg> <url> <light|dark> <WxH> <selector> [margen] [espera ms]
import { writeFileSync } from 'node:fs';
const [CDP, out, url, scheme, size, selector, margin = '40', wait = '600'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, dsf: 2 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
await p.goto(url, { settleMs: 2400 });
await sleep(+wait);
const box = await p.eval(({ selector, m }) => { const el = document.querySelector(selector); let b = el.getBoundingClientRect(); const all = [...el.querySelectorAll('img')].map((i) => i.getBoundingClientRect()).filter((r) => r.width); if (all.length) { const l = Math.min(...all.map((r) => r.left)), t = Math.min(...all.map((r) => r.top)), r = Math.max(...all.map((r) => r.right)), bt = Math.max(...all.map((r) => r.bottom)); b = { left: l, top: t, width: r - l, height: bt - t }; } return { x: Math.max(0, b.left - m), y: Math.max(0, b.top - m + scrollY), width: b.width + m * 2, height: b.height + m * 2 }; }, { selector, m: +margin });
const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { ...box, scale: 1 }, captureBeyondViewport: true });
writeFileSync(out, Buffer.from(data, 'base64'));
console.log(JSON.stringify(box));
await browser.close(); process.exit(0);
