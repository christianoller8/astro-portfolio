// Captura de la sección Marca: medidas de los SVG y primer plano de la cabeza.
const [CDP, B, OUT, tag] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900, dsf: 2 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await p.goto(B + '/sistema/', { settleMs: 1200 });
console.log(JSON.stringify(await p.eval(() => [...document.querySelectorAll('.brand-tile, .brand-tile svg, .brand-hero svg')].map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return `${e.tagName} ${e.getAttribute('class')?.slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)} h:${c.height} ar:${c.aspectRatio}`; }))));
const clip = await p.eval(() => { const el = document.querySelector('.brand-hero'); el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left - 20, y: r.top + scrollY - 20, width: r.width + 40, height: r.height + 40, scale: 1 }; });
await sleep(400);
const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip });
(await import('node:fs')).writeFileSync(`${OUT}/e1-marca-${tag}.jpg`, Buffer.from(data, 'base64'));
await browser.close(); process.exit(0);
