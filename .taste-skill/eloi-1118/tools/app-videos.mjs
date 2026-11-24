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
import { mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
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
};

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

async function record(name) {
  const app = APPS[name];
  const frameDir = join(RAW, name, 'frames');
  rmSync(join(RAW, name), { recursive: true, force: true });
  mkdirSync(frameDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: !process.argv.includes('--headed') });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
    ...(app.colorScheme ? { colorScheme: app.colorScheme } : {}),
  });
  await context.addInitScript(drawCursor);
  const page = await context.newPage();
  const cursor = makeCursor(page);
  let stop = null;
  try {
    await app.script({
      url: app.url,
      page,
      cursor,
      record: async () => {
        stop = await startScreencast(page, frameDir);
        await cursor.nudge(); // el navegador solo manda fotograma cuando algo cambia: así llega el primero
      },
    });
  } finally {
    const result = stop ? await stop() : null;
    await browser.close();
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
if (!process.argv.includes('--export')) await record(name);
exportWeb(name);
