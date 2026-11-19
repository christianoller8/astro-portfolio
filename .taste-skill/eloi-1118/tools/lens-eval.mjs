// Evalúa una expresión en una página con una lente activa. Uso: node lens-eval.mjs <cdp> <url> <light|dark> <WxH> <lente> '<expresión JS>'
const [CDP, url, scheme, size, lens, expr] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: w < 600 ? 2 : 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('lens', '${lens}'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 2400 });
console.log(JSON.stringify(await p.eval(new Function(`return (${expr})`)), null, 1));
await browser.close(); process.exit(0);
