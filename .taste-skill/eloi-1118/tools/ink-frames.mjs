// Fotogramas del entintado del titular: congela las animaciones en varios instantes.
// Uso: node ink-frames.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> ms…
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, ...times] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 2500 });
const info = await p.eval(() => document.getAnimations().filter((a) => a.animationName === 'hero-ink').map((a) => [a.effect.target.className, a.effect.getTiming().delay, a.effect.getTiming().duration, a.playState]));
console.log('animaciones', JSON.stringify(info));
for (const ms of times) {
  await p.eval((t) => { document.getAnimations().filter((a) => a.animationName === 'hero-ink').forEach((a) => { a.pause(); a.currentTime = t; }); }, +ms).catch(async () => {
    await p.eval(`document.getAnimations().filter((a) => a.animationName === 'hero-ink').forEach((a) => { a.pause(); a.currentTime = ${+ms}; })`);
  });
  await sleep(250);
  const m = await p.eval(() => { const g = document.createRange(); g.selectNodeContents(document.querySelector('h1 .hero-role')); const a = g.getBoundingClientRect(); g.selectNodeContents(document.querySelector('.hero-over .hero-role')); const b = g.getBoundingClientRect(); return [Math.round(a.left), Math.round(a.right), Math.round(b.left), Math.round(b.right), Math.round(a.top - b.top)]; });
  console.log(ms, 'oficio real/copia', JSON.stringify(m));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: w, height: Math.min(h, 700), scale: 1 } });
  writeFileSync(`${dir}/e2-tinta-${scheme}-${w}-${String(ms).padStart(4, '0')}.jpg`, Buffer.from(data, 'base64'));
}
await browser.close(); process.exit(0);
