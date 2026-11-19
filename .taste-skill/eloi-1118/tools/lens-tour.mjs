// Una lente en varias alturas de scroll y, opcionalmente, con el ratón sobre una pieza.
// Uso: node lens-tour.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo> <lente> <scrolls: 0,900,…> [selector para el ratón]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, lens, scrolls = '0', hoverSel = ''] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('lens', '${lens}'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 2400 });
let n = 0;
for (const y of scrolls.split(',').map(Number)) {
  await p.eval(`window.scrollTo(0, ${y})`); await sleep(900);
  if (hoverSel && n === 0) {
    const pt = await p.eval((sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, hoverSel);
    if (pt) { await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x - 3, y: pt.y }); await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y }); await sleep(300); }
  }
  const info = await p.eval(() => ({ y: scrollY, marcas: document.querySelectorAll('.lens-layer .lm:not([hidden])').length, ocultas: document.querySelectorAll('.lens-layer .lm-tag[hidden]').length, tip: document.querySelector('.lm-tip')?.textContent, desborda: document.documentElement.scrollWidth > innerWidth, barra: document.querySelector('[data-lens-stats]')?.scrollWidth + '/' + document.querySelector('[data-lens-stats]')?.clientWidth }));
  console.log(lens, JSON.stringify(info));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  writeFileSync(`${dir}/${prefix}-${lens}-${n++}.jpg`, Buffer.from(data, 'base64'));
}
await browser.close(); process.exit(0);
