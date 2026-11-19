// Una página por secciones (cada <section> y el pie). Uso: node page-sections.mjs <cdp.mjs> <carpeta> <url> <light|dark> <WxH> <prefijo> [selector]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, scheme, size, prefix, selector = 'main section'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}; window.__errs = []; addEventListener('error', (e) => window.__errs.push(e.message));` });
await p.goto(url, { settleMs: 2400 });
const tops = await p.eval((sel) => { const ys = [0]; for (const el of document.querySelectorAll(sel)) { const b = el.getBoundingClientRect(); const top = b.top + scrollY; for (let y = top; y < top + b.height - 200; y += innerHeight * 0.85) ys.push(Math.round(y - 60)); } return [...new Set(ys)].sort((a, b) => a - b).filter((y, i, all) => i === 0 || y - all[i - 1] > innerHeight * 0.4); }, selector);
let n = 0;
for (const y of tops) { await p.eval((v) => window.scrollTo(0, v), y); await sleep(750); const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 }); writeFileSync(`${dir}/${prefix}-${String(n++).padStart(2, '0')}.jpg`, Buffer.from(data, 'base64')); }
console.log(JSON.stringify(await p.eval(() => ({ errores: window.__errs, desborda: document.documentElement.scrollWidth > innerWidth, alto: document.documentElement.scrollHeight }))), n, 'capturas');
await browser.close(); process.exit(0);
