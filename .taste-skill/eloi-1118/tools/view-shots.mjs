// Captura "Cómo lo veo yo" en sus cuatro fases: lleva cada texto al centro de la pantalla.
// Uso: node view-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 1800 });
for (let i = 0; i < 4; i++) {
  const info = await p.eval((i) => {
    const step = document.querySelectorAll('[data-view-step]')[i];
    const stage = document.querySelector('.vs-stage');
    const wide = matchMedia('(min-width: 1024px)').matches;
    const box = step.getBoundingClientRect();
    // El comienzo del texto, un poco por encima de la línea de lectura
    const target = wide ? innerHeight * 0.3 : stage.getBoundingClientRect().height + 56 + 40;
    window.scrollTo(0, scrollY + box.top + (wide ? (box.height - 160) / 2 : 0) - target);
    return null;
  }, i);
  await sleep(1900);
  const state = await p.eval(() => ({ phase: document.querySelector('[data-view-scene]').dataset.phase, marks: document.querySelectorAll('.vs-mark').length, checks: [...document.querySelectorAll('[data-view-checks] li')].map((li) => li.textContent.trim()) }));
  console.log(i, JSON.stringify(state));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 84 });
  writeFileSync(`${dir}/${prefix}-${scheme}-${w}-${i}.jpg`, Buffer.from(data, 'base64'));
}
console.log('desborda', await p.eval(() => document.documentElement.scrollWidth > innerWidth));
await browser.close(); process.exit(0);
