// Estados en un tema: pie, menú de móvil, lentes sobre una página larga y lienzo.
// Uso: node states-shots.mjs <cdp.mjs> <carpeta> <origen> <light|dark> <prefijo>
import { writeFileSync } from 'node:fs';
const [CDP, dir, origin, scheme, prefix] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const open = async (path, w = 1440, h = 900, lens = '') => { const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 }); await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] }); await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { ${lens ? `localStorage.setItem('lens', '${lens}')` : `localStorage.removeItem('lens')`}; localStorage.removeItem('theme'); } catch (e) {}` }); await p.goto(origin + path, { settleMs: 2400 }); return p; };
const shot = async (p, name) => { await sleep(500); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 }); writeFileSync(`${dir}/${prefix}-${name}.jpg`, Buffer.from(data, 'base64')); };
let p = await open('/'); await p.eval(() => window.scrollTo(0, document.documentElement.scrollHeight)); await shot(p, '1-pie');
p = await open('/about/', 1440, 900, 'design'); await p.eval(() => window.scrollTo(0, 1250)); await shot(p, '2-lente-diseno');
p = await open('/projects/tempora/', 1440, 900, 'qa'); await p.eval(() => window.scrollTo(0, 2900)); await shot(p, '3-lente-qa');
p = await open('/contact/', 1440, 900, 'code'); await shot(p, '4-lente-codigo');
p = await open('/', 390, 844); await p.eval(() => document.getElementById('menu-btn').click()); await shot(p, '5-menu-movil');
p = await open('/about/', 390, 844, 'qa'); await p.eval(() => window.scrollTo(0, 900)); await shot(p, '6-lente-movil');
await browser.close(); process.exit(0);
