// Captura una página con cada lente activa (arriba y a una altura de scroll dada).
// Uso: node lens-shots.mjs <cdp.mjs> <carpeta> <url> <light|dark> <ancho>x<alto> <prefijo> [scrollY]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, scrollY = '0'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
for (const lens of ['design', 'code', 'qa']) {
  const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('lens', '${lens}'); localStorage.removeItem('theme'); } catch (e) {}` });
  await p.goto(url, { settleMs: 2200 });
  if (+scrollY) { await p.eval(`window.scrollTo(0, ${+scrollY})`); await sleep(1200); }
  const info = await p.eval(() => ({ lens: document.documentElement.dataset.lens, panel: document.querySelector('[data-lens-panel]')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 260), marcas: document.querySelectorAll('.lens-layer .lm').length, ocultas: document.querySelectorAll('.lens-layer .lm-tag[hidden]').length, capas: document.querySelectorAll('.lens-layer').length, desborda: document.documentElement.scrollWidth > innerWidth }));
  console.log(lens, JSON.stringify(info));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  writeFileSync(`${dir}/${prefix}-${lens}.jpg`, Buffer.from(data, 'base64'));
}
await browser.close(); process.exit(0);
