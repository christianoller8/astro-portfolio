// Métricas de carga (FCP, LCP, CLS, peso y peticiones) de varias páginas, en escritorio y en móvil simulado.
// Uso: node perf.mjs <cdp.mjs>
const [CDP] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const B = 'https://www.eloicotonat.com';
const REJECT = `try { localStorage.setItem('consent', JSON.stringify({ v: 1, a: 0, t: Date.now() })); } catch (e) {}`;
const NO_INTRO = `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`;

const COLLECT = () => new Promise((done) => {
  let lcp = 0, lcpEl = '', cls = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { lcp = e.startTime; lcpEl = e.element ? e.element.tagName.toLowerCase() + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '') : (e.url || ''); } }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => {
    const res = performance.getEntriesByType('resource');
    const nav = performance.getEntriesByType('navigation')[0];
    const kb = (f) => Math.round(res.filter(f).reduce((s, r) => s + r.transferSize, 0) / 1024);
    res.push(nav);
    done({
      fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
      lcp: Math.round(lcp), lcpEl, cls: +cls.toFixed(3),
      requests: res.length,
      totalKB: Math.round(res.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
      jsKB: kb((r) => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name)),
      fontKB: kb((r) => /\.woff2?(\?|$)/.test(r.name)),
      imgKB: kb((r) => r.initiatorType === 'img' || /\.(webp|avif|jpe?g|png|svg)(\?|$)/.test(r.name)),
      domNodes: document.getElementsByTagName('*').length,
    });
  }, 1200);
});

const browser = await Browser.launch();
const rows = [];
for (const [label, mobile] of [['escritorio', false], ['móvil (CPU ×4, 4G lenta)', true]]) {
  for (const [path, intro] of [['/', true], ['/', false], ['/trabajo/', false], ['/audiovisual/', false], ['/sobre-mi/', false], ['/contacto/', false]]) {
    const p = await browser.newPage(mobile ? { width: 390, height: 844, mobile: true, dsf: 2 } : { width: 1440, height: 900 });
    await p.send('Page.addScriptToEvaluateOnNewDocument', { source: REJECT });
    if (!intro) await p.send('Page.addScriptToEvaluateOnNewDocument', { source: NO_INTRO });
    await p.send('Network.enable');
    await p.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (mobile) {
      await p.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    }
    await p.goto(B + path, { settleMs: intro ? 3200 : 1500, timeoutMs: 45000 });
    const m = await p.eval(COLLECT);
    rows.push({ device: label, page: path + (intro ? ' (con intro)' : ''), ...m });
    await p.close();
  }
}
console.table(rows);
await browser.close();
process.exit(0);
