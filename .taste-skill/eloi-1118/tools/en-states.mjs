// Estados interactivos en inglés: lentes, demos de proyectos, menú de móvil, lienzo, 404 y código.
const [CDP, origin] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const open = async (path, w = 1440, h = 900) => { const p = await browser.newPage({ width: w, height: h, mobile: w < 600 }); await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); } catch (e) {}` }); await p.goto(origin + path, { settleMs: 2200 }); return p; };
const text = (p, sel) => p.eval((s) => [...document.querySelectorAll(s)].map((el) => el.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | ').slice(0, 330), sel);
let p = await open('/en/');
for (const lens of ['design', 'code', 'qa']) { await p.eval((l) => document.querySelector(`[data-lens-set="${l}"]`).click(), lens); await sleep(500); console.log(`lente ${lens}:`, await text(p, '.lens-bar')); }
await p.eval(() => document.querySelector('[data-lens-clear]').click());
await p.eval(() => { document.querySelector('[data-demo-add]').click(); document.querySelector('[data-demo-clock]').click(); document.querySelector('[data-demo="vibora"] [data-demo-slot]:not(.is-mine)').click(); document.querySelector('[data-demo-confirm]').click(); document.querySelector('[data-demo-reveal]').click(); document.querySelector('[data-demo-live]').click(); });
await sleep(400);
console.log('tempora:', await text(p, '[data-demo="tempora"] .tp-row:nth-child(2), [data-demo="tempora"] .tp-stat'));
console.log('vibora:', await text(p, '[data-demo="vibora"] .vb-bar, [data-demo="vibora"] .is-mine'));
console.log('learnish:', await text(p, '[data-demo="learnish"] .ln-top, [data-demo="learnish"] .ln-progress, [data-demo="learnish"] .ln-actions'));
console.log('vistalo:', await text(p, '[data-demo="live"] .pv-bar'), '| notas:', await text(p, '.stack-try'));
await p.eval(() => document.querySelector('[data-canvas-open]').click()); await sleep(1400);
console.log('lienzo:', await text(p, '.cmap-hud, .cmap-name b, .cmap-here'));
p = await open('/en/', 390, 844);
await p.eval(() => document.getElementById('menu-btn').click()); await sleep(500);
console.log('menú móvil:', await text(p, '#mobile-menu'));
p = await open('/en/projects/tempora/');
console.log('código (comentarios):', await p.eval(() => (document.querySelector('.code-panel pre')?.textContent.match(/\/\/.*/g) ?? []).slice(0, 3)), '| líneas:', await p.eval(() => document.querySelector('.code-panel pre')?.textContent.split('\n').length));
console.log('pruebas:', await text(p, '[data-case-checks] li'));
p = await open('/en/missing-page');
console.log('404 barra:', await text(p, 'header .toolbar-nav a, header [data-lens-set] span'), '| enlaces:', await p.eval(() => [...document.querySelectorAll('header .toolbar-nav a')].map((a) => a.getAttribute('href')).join(' ')), '| lang:', await p.eval(() => document.documentElement.lang));
console.log('404 texto:', await text(p, '[data-nf-lang="en"] .nf-copy'));
p = await open('/en/contact/?estado=enviado');
console.log('contacto enviado:', await text(p, '.form-sent, .form-name, .state-name'));
await browser.close(); process.exit(0);
