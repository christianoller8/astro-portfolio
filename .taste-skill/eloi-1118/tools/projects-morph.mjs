// Morph desde un frame del lienzo de proyectos: fotogramas a cámara lenta y vuelta.
import { writeFileSync } from 'node:fs';
const [CDP, dir, url] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('projects-mode'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2400 });
await p.send('Animation.enable'); await p.send('Animation.setPlaybackRate', { playbackRate: 0.15 });
await p.eval(() => document.querySelector('#pf-vibora').click());
for (let i = 0; i < 4; i++) { await sleep(i ? 1100 : 900); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 }); writeFileSync(`${dir}/morph-${i}.jpg`, Buffer.from(data, 'base64')); }
await p.send('Animation.setPlaybackRate', { playbackRate: 1 }); await sleep(1500);
console.log(JSON.stringify(await p.eval(() => ({ path: location.pathname, clases: document.documentElement.className, errores: window.__errs }))));
await browser.close(); process.exit(0);
