// Graba los vídeos de las tarjetas de proyecto con Playwright y los exporta con ffmpeg.
//
// Uso, desde la raíz del repo y con la app ya arrancada:
//   node .taste-skill/eloi-1118/tools/app-videos.mjs <app>            graba y exporta
//   node .taste-skill/eloi-1118/tools/app-videos.mjs <app> --export   solo vuelve a exportar el máster
//   node .taste-skill/eloi-1118/tools/app-videos.mjs <app> --headed   graba con la ventana a la vista
//
// Cómo graba:
// - Ventana de 1280×800 con escala 1,25: el vídeo sale a 1600×1000 con la interfaz al 125 %, como
//   pide docs/referencias/guia-videos-proyectos.md.
// - Un cursor dibujado sigue al ratón de Playwright, que se mueve con un arco leve y aceleración
//   suave; cada clic deja un aro que se abre y se apaga.
// - Los fotogramas los da el propio navegador (Page.startScreencast), con su hora exacta; ffmpeg los
//   junta a 60 fps. Da igual lo que haya encima de la ventana.
// - Salida: videos-raw/<app>/ (fotogramas) y videos-raw/<app>.mp4 (máster), fuera de git;
//   public/videos/<app>.mp4 y public/videos/posters/<app>.jpg, los de la web (guía, sección 8).
//
// Learnish se graba sobre una copia de sus datos, para no tocar el progreso real. En LEARNISH/server:
//   LEARNISH_PORT=5318 LEARNISH_DATA_DIR=<carpeta con una copia de data/learnish.db> LEARNISH_NO_BROWSER=1 node src/main.js
// Calificar una tarjeta cambia esa copia: para repetir la toma, vuelve a copiar la base y reinicia.
import { existsSync, mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const RAW = join(ROOT, 'videos-raw');
const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 1.25;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const APPS = {
  learnish: {
    url: process.env.LEARNISH_URL ?? 'http://127.0.0.1:5318',
    fade: 'black',
    // Vocabulario → mazo de phrasal verbs → girar la tarjeta → «Bien» → entra la siguiente
    async script({ url, page, cursor, record }) {
      await page.goto(`${url}/#/flashcards`, { waitUntil: 'networkidle' });
      const study = page.locator('a, button', { hasText: 'Estudiar 10 tarjetas' }).first();
      await study.waitFor();
      await cursor.place(960, 360);
      await wait(600);
      await record();
      await wait(1000);
      await cursor.moveTo(study);
      await wait(260);
      await cursor.click();
      const reveal = page.getByRole('button', { name: 'Ver la respuesta', exact: true });
      await reveal.waitFor();
      await wait(1100);
      await cursor.moveTo(reveal);
      await wait(220);
      await cursor.click();
      await wait(1500);
      await cursor.moveTo(page.getByRole('button', { name: /^Bien/ }));
      await wait(260);
      await cursor.click();
      await wait(1700);
    },
  },
  tempora: {
    url: process.env.TEMPORA_URL ?? 'http://localhost:4200',
    loginPath: '/auth/login',
    fade: 'white',
    // Cuadrante de junio de 2026 (el del seed) → dos turnos nuevos pulsando su casilla.
    // cleanup los quita después, así que el cuadrante queda como estaba y la toma se puede repetir.
    takes: [['Laura García', 3, 'Mañana'], ['Ana López', 3, 'Tarde']],
    cell(page, name, day) {
      return page.getByRole('row').filter({ hasText: name }).getByRole('gridcell').nth(day - 1);
    },
    async script({ page, cursor, record }) {
      if (!page.url().includes('/shifts')) await page.getByRole('link', { name: 'Turnos' }).click();
      await page.locator('select').nth(0).selectOption('2026');
      await page.locator('select').nth(1).selectOption({ label: 'Junio' });
      await page.getByRole('button', { name: 'Buscar' }).click();
      await this.cleanup({ page });
      await cursor.place(1040, 250);
      await wait(500);
      await record();
      await wait(1300);
      const dialog = page.getByRole('dialog');
      for (const [name, day, shift] of this.takes) {
        await cursor.moveTo(this.cell(page, name, day));
        await wait(220);
        await cursor.click();
        await dialog.waitFor();
        await wait(500);
        await cursor.moveTo(dialog.getByText(shift, { exact: true }));
        await wait(200);
        await cursor.click();
        await wait(350);
        await cursor.moveTo(dialog.getByRole('button', { name: 'Confirmar' }));
        await wait(200);
        await cursor.click();
        await dialog.waitFor({ state: 'hidden' });
        await wait(900);
      }
      await wait(900);
    },
    async cleanup({ page }) {
      for (const [name, day] of this.takes) {
        const cell = this.cell(page, name, day);
        await cell.waitFor();
        if ((await cell.textContent()).trim() === '+') continue;
        await cell.click();
        await page.getByRole('button', { name: 'Quitar turno' }).click();
        await page.getByRole('button', { name: 'Sí, quitar' }).click();
        await page.getByRole('dialog').waitFor({ state: 'hidden' });
        await wait(400);
      }
    },
  },
  vistalo: {
    url: process.env.VISTALO_URL ?? 'https://vistalo-sl.vercel.app',
    fade: 'black',
    cursor: false, // estilo A de la guía: scroll limpio, sin cursor
    // Portada → servicios → packs → «Hablemos» con la transición entre páginas → la carta
    async script({ url, page, record, scroll }) {
      await page.goto(`${url}/`, { waitUntil: 'networkidle' });
      await record();
      await wait(2600);
      await scroll('#territorios', 1400);
      await wait(1200);
      await scroll('#packs', 2200);
      await wait(1600);
      await page.locator('header a[href="/contacto"]').first().click();
      await page.waitForURL(/\/contacto/);
      await wait(3000);
    },
  },
};

// Scroll suave hasta un elemento o una altura, con aceleración de entrada y salida
function makeScroll(page) {
  return (target, ms) => page.evaluate(({ target, ms }) => new Promise((resolve) => {
    const to = typeof target === 'number' ? target : document.querySelector(target).getBoundingClientRect().top + scrollY;
    const from = scrollY;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const e = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      scrollTo({ top: from + (to - from) * e, behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  }), { target, ms });
}

// Cursor dibujado en la página: una flecha blanca con borde y un aro en cada clic.
// Va por CSSOM y atributos SVG, así que no lo bloquea una CSP sin 'unsafe-inline'.
function drawCursor() {
  const NS = 'http://www.w3.org/2000/svg';
  const install = () => {
    if (document.getElementById('__rec-cursor')) return;
    const root = document.documentElement;
    const cursor = document.createElementNS(NS, 'svg');
    cursor.id = '__rec-cursor';
    cursor.setAttribute('viewBox', '0 0 20 28');
    cursor.setAttribute('width', '27');
    cursor.setAttribute('height', '38');
    const arrow = document.createElementNS(NS, 'path');
    arrow.setAttribute('d', 'M1.5 1.5 L1.5 22.5 L6.8 17.6 L10.4 26 L14 24.4 L10.5 16.2 L17.6 16.2 Z');
    arrow.setAttribute('fill', '#ffffff');
    arrow.setAttribute('stroke', '#111111');
    arrow.setAttribute('stroke-width', '1.4');
    arrow.setAttribute('stroke-linejoin', 'round');
    cursor.append(arrow);
    Object.assign(cursor.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      zIndex: '2147483647',
      pointerEvents: 'none',
      overflow: 'visible',
      transform: 'translate(-80px, -80px)',
      filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35))',
    });
    root.append(cursor);
    addEventListener('mousemove', (event) => {
      cursor.style.transform = `translate(${event.clientX - 2}px, ${event.clientY - 2}px)`;
    }, true);
    addEventListener('mousedown', (event) => {
      const ring = document.createElement('div');
      Object.assign(ring.style, {
        position: 'fixed',
        left: `${event.clientX - 20}px`,
        top: `${event.clientY - 20}px`,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.25)',
        zIndex: '2147483646',
        pointerEvents: 'none',
      });
      root.append(ring);
      ring.animate(
        [{ transform: 'scale(0.35)', opacity: 0.95 }, { transform: 'scale(1.35)', opacity: 0 }],
        { duration: 480, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
      ).onfinish = () => ring.remove();
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}

// Ratón con arco leve y aceleración suave (ease-in-out cúbico), un paso cada ~10 ms
function makeCursor(page) {
  const pos = { x: VIEWPORT.width / 2, y: VIEWPORT.height / 2 };
  const center = async (target) => {
    if (typeof target.x === 'number') return target;
    await target.waitFor({ state: 'visible' });
    const box = await target.boundingBox();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };
  return {
    async place(x, y) {
      pos.x = x;
      pos.y = y;
      await page.mouse.move(x, y);
    },
    async moveTo(target, ms) {
      const to = await center(target);
      const from = { ...pos };
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      const duration = ms ?? Math.min(1000, Math.max(420, 260 + dist * 0.75));
      const bend = Math.min(60, dist * 0.08);
      const nx = dist ? -dy / dist : 0;
      const ny = dist ? dx / dist : 0;
      const start = Date.now();
      for (;;) {
        const t = Math.min(1, (Date.now() - start) / duration);
        const e = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        const arc = Math.sin(Math.PI * e) * bend;
        await page.mouse.move(from.x + dx * e + nx * arc, from.y + dy * e + ny * arc);
        if (t === 1) break;
        await wait(10);
      }
      pos.x = to.x;
      pos.y = to.y;
    },
    async click() {
      await page.mouse.down();
      await wait(90);
      await page.mouse.up();
    },
    async nudge() {
      await page.mouse.move(pos.x + 1, pos.y);
      await page.mouse.move(pos.x, pos.y);
    },
  };
}

// Fotogramas del navegador con su hora; devuelve la función que para y entrega la lista
async function startScreencast(page, dir) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const file = join(dir, `f${String(frames.length + 1).padStart(5, '0')}.jpg`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push({ file, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: Math.round(VIEWPORT.width * SCALE),
    maxHeight: Math.round(VIEWPORT.height * SCALE),
    everyNthFrame: 1,
  });
  return async () => {
    const end = Date.now() / 1000;
    await cdp.send('Page.stopScreencast');
    await cdp.detach();
    return { frames, end };
  };
}

function ffmpeg(args) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffmpeg falló:\n${(result.stderr || '').slice(-1200)}`);
}

function duration(file) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Number(result.stdout.trim());
}

// Máster a 60 fps constantes: cada fotograma dura hasta que llega el siguiente
function writeMaster(name, frames, end) {
  if (frames.length < 2) throw new Error('Apenas han llegado fotogramas: ¿se ha movido algo en la página?');
  const list = join(RAW, name, 'frames', 'list.ffconcat');
  const lines = ['ffconcat version 1.0'];
  frames.forEach((frame, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : end;
    lines.push(`file '${basename(frame.file)}'`, `duration ${Math.max(0.001, next - frame.t).toFixed(4)}`);
  });
  lines.push(`file '${basename(frames.at(-1).file)}'`);
  writeFileSync(list, lines.join('\n'));
  ffmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', list, '-fps_mode', 'cfr', '-r', '60',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', join(RAW, `${name}.mp4`)]);
}

// Exportación de la guía (sección 8) con fundido de entrada y salida para el bucle
function exportWeb(name) {
  const app = APPS[name];
  const master = join(RAW, `${name}.mp4`);
  const out = join(ROOT, 'public', 'videos', `${name}.mp4`);
  const poster = join(ROOT, 'public', 'videos', 'posters', `${name}.jpg`);
  mkdirSync(dirname(poster), { recursive: true });
  const length = duration(master);
  const color = app.fade ?? 'black';
  const fades = `fade=t=in:st=0:d=0.3:color=${color},fade=t=out:st=${Math.max(0, length - 0.4).toFixed(2)}:d=0.4:color=${color}`;
  ffmpeg(['-y', '-i', master, '-vf', `scale=1600:-2,fps=30,${fades}`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out]);
  ffmpeg(['-y', '-ss', '0.5', '-i', out, '-frames:v', '1', '-q:v', '3', poster]);
  const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`;
  console.log(`${name}: ${duration(out).toFixed(1)} s · ${kb(out)} → public/videos/${name}.mp4 · póster ${kb(poster)}`);
}

// Apps con sesión (Tempora la guarda solo en memoria: recargar = volver al login). --login abre un
// Edge aparte con puerto de depuración y perfil en videos-raw/.profiles/<app> (fuera de git);
// Christian entra una vez y la grabación se engancha a esa misma ventana, sin recargarla. Por eso
// sus guiones navegan con clics y nunca con page.goto. La ventana la cierra él al terminar.
const DEBUG_PORT = 9333;
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find((path) => existsSync(path));

async function openContext(name, headed) {
  const app = APPS[name];
  if (app.loginPath) {
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${DEBUG_PORT}`).catch(() => {
      throw new Error(`No hay ventana abierta: antes, node .taste-skill/eloi-1118/tools/app-videos.mjs ${name} --login`);
    });
    const context = browser.contexts()[0];
    const page = context.pages().find((candidate) => candidate.url().startsWith(app.url));
    if (!page) throw new Error(`La ventana de depuración no está en ${app.url}`);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: VIEWPORT.width, height: VIEWPORT.height, deviceScaleFactor: SCALE, mobile: false });
    const close = async () => {
      await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
      await cdp.detach().catch(() => {});
    };
    return { context, page, close };
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: !headed });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
    ...(app.colorScheme ? { colorScheme: app.colorScheme } : {}),
  });
  return { context, page: await context.newPage(), close: () => browser.close() };
}

async function login(name) {
  const app = APPS[name];
  if (!EDGE) throw new Error('No encuentro msedge.exe');
  spawn(EDGE, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${join(RAW, '.profiles', name)}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1340,920',
    // que siga pintando aunque la tapen otras ventanas
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
    '--disable-features=CalculateNativeWinOcclusion',
    `${app.url}${app.loginPath}`,
  ], { detached: true, stdio: 'ignore' }).unref();
  let browser = null;
  for (let i = 0; i < 40 && !browser; i++) {
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${DEBUG_PORT}`).catch(() => null);
    if (!browser) await wait(500);
  }
  if (!browser) throw new Error('Edge no ha abierto el puerto de depuración');
  const pages = browser.contexts()[0].pages();
  const page = pages.find((candidate) => candidate.url().startsWith(app.url)) ?? pages[0];
  console.log(`${name}: inicia sesión en la ventana de Edge y déjala abierta (espero hasta 10 minutos)…`);
  await page.waitForURL((url) => !url.pathname.startsWith(app.loginPath), { timeout: 600_000 });
  console.log(`${name}: sesión iniciada; la ventana se queda abierta para grabar`);
  process.exit(0);
}

async function record(name) {
  const app = APPS[name];
  const frameDir = join(RAW, name, 'frames');
  rmSync(join(RAW, name), { recursive: true, force: true });
  mkdirSync(frameDir, { recursive: true });
  const { context, page, close } = await openContext(name, process.argv.includes('--headed'));
  if (app.cursor !== false) {
    await context.addInitScript(drawCursor);
    await page.evaluate(drawCursor); // la ventana de --login ya está cargada: el script de inicio no le llega
  }
  const cursor = makeCursor(page);
  let stop = null;
  try {
    await app.script.call(app, {
      url: app.url,
      page,
      cursor,
      scroll: makeScroll(page),
      record: async () => {
        stop = await startScreencast(page, frameDir);
        await cursor.nudge(); // el navegador solo manda fotograma cuando algo cambia: así llega el primero
      },
    });
  } finally {
    const result = stop ? await stop() : null;
    if (app.cleanup) await app.cleanup({ page }).catch((error) => console.warn(`${name}: no he podido deshacer la toma: ${error.message}`));
    await close();
    if (result) {
      writeMaster(name, result.frames, result.end);
      console.log(`${name}: ${result.frames.length} fotogramas → videos-raw/${name}.mp4`);
    }
  }
}

const [name] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!APPS[name]) {
  console.error(`Uso: node .taste-skill/eloi-1118/tools/app-videos.mjs <${Object.keys(APPS).join('|')}> [--export] [--headed]`);
  process.exit(1);
}
if (process.argv.includes('--login')) await login(name);
else {
  if (!process.argv.includes('--export')) await record(name);
  exportWeb(name);
}
// La conexión con la ventana de --login mantiene vivo el proceso: se sale a mano, sin cerrar Edge
process.exit(0);
