// Estados de la barra: menú de móvil abierto, lente activa, marca seleccionada.
// Uso: node bar-states.mjs <cdp.mjs> <carpeta> <url> <light|dark>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const open = async (w, h) => {
  const mobile = w < 600;
  const p = await browser.newPage({ width: w, height: h, mobile, dsf: 2 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
  await p.goto(url, { settleMs: 1500 });
  return p;
};
const shot = async (p, name, w, h) => {
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  writeFileSync(`${dir}/e2-barra-${scheme}-${name}.jpg`, Buffer.from(data, 'base64'));
};
// Menú abierto en móvil y en tablet
for (const [w, h] of [[390, 844], [768, 700]]) {
  const p = await open(w, h);
  await p.eval(() => document.getElementById("menu-btn").click());
  await sleep(1200);
  await shot(p, `menu-${w}`, w, h);
}
// Escritorio: lente Diseño activa y la marca seleccionada (foco de teclado)
const p = await open(1440, 900);
await p.eval(() => document.querySelector('.tool-view [data-lens-set="code"]').click());
await sleep(600);
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await sleep(500);
console.log('foco en', await p.eval(() => document.activeElement?.className));
await shot(p, 'estados-1440', 1440, 130);
await browser.close(); process.exit(0);
