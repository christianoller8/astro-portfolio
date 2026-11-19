// El hero con cada lente activa, para comprobar que no se descoloca.
// Uso: node hero-lens.mjs <cdp.mjs> <carpeta> <url> <light|dark>
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
for (const lens of ['design', 'code', 'qa']) {
  const p = await browser.newPage({ width: 1440, height: 900, dsf: 1 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.setItem('lens', '${lens}'); localStorage.removeItem('theme'); } catch (e) {}` });
  await p.goto(url, { settleMs: 2200 });
  const foto = await p.eval(() => { const b = document.querySelector('.hero-portrait').getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; });
  console.log(lens, JSON.stringify(foto));
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 84 });
  writeFileSync(`${dir}/e2-hero-lente-${lens}-${scheme}.jpg`, Buffer.from(data, 'base64'));
}
await browser.close(); process.exit(0);
