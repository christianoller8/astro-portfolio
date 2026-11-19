// Captura la fila de pruebas del personaje en varias fases del ciclo.
// Uso: node chr-shots.mjs <cdp.mjs> <carpeta> <url-base> <prefijo> fases…
import { writeFileSync } from 'node:fs';
const [CDP, dir, base, prefix, ...phases] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
for (const ph of phases) {
  const p = await browser.newPage({ width: 1440, height: 900, dsf: 1 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('theme'); localStorage.removeItem('lens'); } catch (e) {}` });
  await p.goto(`${base}?fase=${ph}`, { settleMs: 1200 });
  const box = await p.eval(() => { const b = document.querySelector('.lab-row').getBoundingClientRect(); return [b.left, b.top + scrollY, b.width, b.height]; });
  const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 86, captureBeyondViewport: true, clip: { x: box[0], y: box[1], width: box[2], height: box[3], scale: 1 } });
  writeFileSync(`${dir}/${prefix}-${String(ph).padStart(3, '0')}.jpg`, Buffer.from(data, 'base64'));
}
console.log('ok');
await browser.close(); process.exit(0);
