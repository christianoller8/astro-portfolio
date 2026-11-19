// Captura la primera pantalla (sin scroll) a varios tamaños y mide el hero.
// Uso: node hero-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <prefijo> ancho×alto…
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, prefix, ...sizes] = process.argv.slice(2);
const { Browser } = await import(CDP);
const browser = await Browser.launch();
for (const size of sizes) {
  const [w, h] = size.split('x').map(Number);
  const mobile = w < 600;
  const p = await browser.newPage({ width: w, height: h, mobile, dsf: mobile ? 2 : 1 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
  await p.goto(url, { settleMs: 1800 });
  const m = await p.eval(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
    const range = (s) => { const e = document.querySelector(s); const g = document.createRange(); g.selectNodeContents(e); const b = g.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; };
    return { hero: r('.hero'), nombre: range('h1 .hero-name'), oficio: range('h1 .hero-role'), foto: r('.hero-photo'), copy: r('.hero-copy'), estado: document.querySelector('.hero-status')?.textContent.replace(/\s+/g, ' ').trim(), roles: r('.hero-roles'), desborda: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(size, scheme, JSON.stringify(m));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
  writeFileSync(`${dir}/${prefix}-${scheme}-${w}.jpg`, Buffer.from(data, 'base64'));
}
await browser.close(); process.exit(0);
