// Las microinteracciones del catálogo (plan §4.4), una captura por cada una.
// Uso: node micro-shots.mjs <cdp.mjs> <carpeta> <origen> <light|dark>
import { writeFileSync } from 'node:fs';
const [CDP, dir, origin, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const open = async (path) => { const p = await browser.newPage({ width: 1440, height: 900, dsf: 2 }); await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] }); await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); localStorage.removeItem('projects-mode'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` }); await p.goto(origin + path, { settleMs: 2400 }); return p; };
const clip = async (p, name, sel, pad = 40, extra = {}) => { const b = await p.eval(({ sel, pad }) => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: Math.max(0, r.left - pad), y: Math.max(0, r.top - pad), width: r.width + pad * 2, height: r.height + pad * 2 }; }, { sel, pad }); if (!b) return console.log('no está', sel); await sleep(120); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 86, clip: { ...b, ...extra, scale: 1 } }); writeFileSync(`${dir}/${name}.jpg`, Buffer.from(data, 'base64')); };
const hover = async (p, sel) => { const pt = await p.eval((s) => { const el = document.querySelector(s); el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel); await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x - 2, y: pt.y }); await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y }); return pt; };
const tab = async (p) => { await p.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); };
const slow = async (p, rate) => { await p.send('Animation.enable'); await p.send('Animation.setPlaybackRate', { playbackRate: rate }); };

let p = await open('/projects/tempora/');
await slow(p, 0.2); await hover(p, '.back.link'); await sleep(450); await clip(p, '01-enlace-medio', '.back.link', 24); await sleep(900); await clip(p, '01-enlace-fin', '.back.link', 24);
p = await open('/');
await hover(p, '.hero-copy .btn-primary'); await sleep(300); await clip(p, '02-boton-principal', '.hero-actions, .hero-copy', 16);
await hover(p, '.hero-copy .btn-quiet'); await sleep(120); await clip(p, '03-boton-secundario-cv', '.hero-copy .btn-quiet', 24);
await hover(p, '.stack-item [data-sel]'); await sleep(400); await clip(p, '04-tarjeta', '.stack-item [data-sel]', 46);
await slow(p, 0.15); await p.eval(() => document.querySelector('header [data-lens-set="design"]').click()); await sleep(300); await p.eval(() => document.querySelector('header [data-lens-set="qa"]').click()); await sleep(700); await clip(p, '06-lentes-deslizando', 'header .lens-switch', 16); await sleep(2200); await clip(p, '06-lentes-fin', 'header .lens-switch', 16);
await p.eval(() => document.querySelector('[data-lens-clear]').click()); await slow(p, 1);
p = await open('/');
await slow(p, 0.1); await p.eval(() => document.querySelector('.theme-toggle-btn').click()); await sleep(900); { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); writeFileSync(`${dir}/07-tema-primer-tiempo.jpg`, Buffer.from(data, 'base64')); } await sleep(2600); { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); writeFileSync(`${dir}/07-tema-fin.jpg`, Buffer.from(data, 'base64')); }
p = await open('/about/');
await hover(p, '.about-photo-sel'); await sleep(400); await clip(p, '09-retrato', '.about-photo-sel', 40);
p = await open('/contact/');
await p.send('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] }).catch(() => {});
const pt = await hover(p, '.data-action'); await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 1 }); await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 1 }); await sleep(260); await clip(p, '10-copiado', '.data-row', 50); console.log('aviso:', await p.eval(() => document.querySelector('.kit-toast')?.textContent ?? 'sin aviso'), '| botón:', await p.eval(() => document.querySelector('.data-action').textContent.trim()));
p = await open('/');
for (let i = 0; i < 4; i++) await tab(p); await sleep(400); console.log('foco en:', await p.eval(() => document.activeElement?.textContent.trim().slice(0, 20)), '| cuadro:', await p.eval(() => document.querySelector('.kit-focus')?.className)); await clip(p, '12-foco-menu', '.toolbar-nav', 20);
for (let i = 0; i < 12; i++) await tab(p); await sleep(400); console.log('foco en:', await p.eval(() => document.activeElement?.textContent.trim().slice(0, 24))); { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); writeFileSync(`${dir}/12-foco-pagina.jpg`, Buffer.from(data, 'base64')); }
p = await open('/');
await slow(p, 0.12); await p.eval(() => [...document.querySelectorAll('.toolbar-nav a')].find((a) => /contact/.test(a.href)).click()); await sleep(2600); await clip(p, '05-menu-deslizando', '.toolbar-nav', 14); await slow(p, 1); await sleep(2500);
console.log('llegó a:', await p.eval(() => location.pathname), '| errores:', await p.eval(() => window.__errs));
await browser.close(); process.exit(0);
