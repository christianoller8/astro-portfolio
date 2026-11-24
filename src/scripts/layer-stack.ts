// "En capas" (LayerStack.astro): la web de ejemplo de "Cómo lo veo yo", separada en sus cuatro capas
// (boceto, diseño, código y pruebas) y puesta en el espacio con three.js (decisión D18 del plan).
// - Las cuatro capas se pintan aquí, en lienzos 2D, midiendo el HTML real de la web de ejemplo: no
//   son imágenes guardadas, así que siguen al tema claro/oscuro y a cualquier cambio de la demo.
// - three.js se carga solo cuando la sección se acerca a la pantalla, y solo se dibuja mientras se ve.
// - Sin WebGL, las mismas cuatro capas se enseñan planas, una al lado de otra.
import { sketchElements } from './sketch';

const DESIGN_WIDTH = 1280;
const LAYERS = ['sketch', 'design', 'code', 'qa'] as const;
type Layer = (typeof LAYERS)[number];

const alpha = (color: string) => {
  const parts = color.match(/[\d.]+/g) ?? [];
  return color === 'transparent' ? 0 : parts.length > 3 ? Number(parts[3]) : 1;
};

/** Monta, fuera de la pantalla y a 1280 px, una copia de la web de ejemplo para medirla */
function mount(source: HTMLElement) {
  const frame = source.closest<HTMLElement>('[data-view-frame]');
  const host = document.createElement('div');
  // Fuera de la vista, pero sin visibility:hidden: los hijos la heredarían y no se podría leer su estilo
  host.style.cssText = `position:absolute;top:0;left:-200vw;width:${DESIGN_WIDTH}px;opacity:0;pointer-events:none;`;
  host.setAttribute('aria-hidden', 'true');
  // El marco se copia vacío (da el contenedor para las unidades cqi) y dentro va la copia de la demo
  const shell = (frame?.cloneNode(false) as HTMLElement | undefined) ?? document.createElement('div');
  shell.removeAttribute('data-view-frame');
  shell.style.cssText = `position:relative;width:${DESIGN_WIDTH}px;`;
  const demo = source.cloneNode(true) as HTMLElement;
  demo.removeAttribute('data-view-demo');
  shell.append(demo);
  host.append(shell);
  document.body.append(host);
  return { host, demo };
}

/** Las líneas de un texto tal como las ha partido el navegador: cada una con su caja */
function linesOf(node: Text) {
  const lines: { text: string; left: number; right: number; top: number; height: number }[] = [];
  const range = document.createRange();
  for (const match of node.data.matchAll(/\S+/g)) {
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);
    const box = range.getBoundingClientRect();
    if (!box.width) continue;
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.top - box.top) < box.height / 2) {
      last.text += ` ${match[0]}`;
      last.right = box.right;
    } else lines.push({ text: match[0], left: box.left, right: box.right, top: box.top, height: box.height });
  }
  return lines;
}

const svgImage = (svg: SVGSVGElement, width: number, height: number) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    copy.setAttribute('width', String(width));
    copy.setAttribute('height', String(height));
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(copy))}`;
  });

/** Pinta las cuatro capas de la web de ejemplo. Devuelve un lienzo por capa y su proporción. */
async function paintLayers(source: HTMLElement, scale: number) {
  const { host, demo } = mount(source);
  await document.fonts?.ready;
  const base = demo.getBoundingClientRect();
  const W = Math.round(base.width * scale);
  const H = Math.round(base.height * scale);
  const root = getComputedStyle(document.documentElement);
  const token = (name: string) => root.getPropertyValue(name).trim();
  const ink = token('--ink'), paper = token('--paper'), graphite = token('--graphite'), ok = token('--ok');
  const mono = `500 ${13 * scale}px ${token('--font-mono') || 'ui-monospace, monospace'}`;
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - base.left) * scale, y: (r.top - base.top) * scale, w: r.width * scale, h: r.height * scale };
  };
  const make = () => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    return { canvas, ctx: canvas.getContext('2d')! };
  };
  /** Las capas de anotaciones son hojas casi transparentes, con su borde */
  const sheet = (ctx: CanvasRenderingContext2D) => {
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(scale, scale, W - 2 * scale, H - 2 * scale);
    ctx.globalAlpha = 1;
  };

  // --- Diseño: la página terminada, repintada pieza a pieza desde sus estilos calculados ---
  const design = make();
  // El fondo de la página de ejemplo puede estar en la demo o en su marco
  const ground = [demo, demo.parentElement].map((el) => (el ? getComputedStyle(el).backgroundColor : '')).find((color) => color && alpha(color) > 0);
  design.ctx.fillStyle = ground ?? paper;
  design.ctx.fillRect(0, 0, W, H);
  const images: Promise<void>[] = [];
  const walk = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const b = box(el);
    const ctx = design.ctx;
    if (el instanceof SVGSVGElement) {
      images.push(svgImage(el, b.w, b.h).then((image) => void (image && ctx.drawImage(image, b.x, b.y, b.w, b.h))));
      return;
    }
    if (el !== demo && alpha(cs.backgroundColor) > 0) {
      ctx.fillStyle = cs.backgroundColor;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      const width = parseFloat(cs[`border${side}Width`]) * scale;
      if (!width || cs[`border${side}Style`] === 'none' || !alpha(cs[`border${side}Color`])) continue;
      ctx.fillStyle = cs[`border${side}Color`];
      if (side === 'Top') ctx.fillRect(b.x, b.y, b.w, width);
      else if (side === 'Bottom') ctx.fillRect(b.x, b.y + b.h - width, b.w, width);
      else if (side === 'Left') ctx.fillRect(b.x, b.y, width, b.h);
      else ctx.fillRect(b.x + b.w - width, b.y, width, b.h);
    }
    for (const child of el.childNodes) {
      if (child instanceof Text && child.data.trim()) {
        const size = parseFloat(cs.fontSize) * scale;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
        ctx.fillStyle = cs.color;
        ctx.textBaseline = 'middle';
        for (const line of linesOf(child)) {
          const x = (line.left - base.left) * scale;
          const y = (line.top - base.top + line.height / 2) * scale;
          const width = (line.right - line.left) * scale;
          // El ancho máximo ajusta el texto a lo que mide en la página (interletraje, ancho variable)
          ctx.fillText(line.text, x, y, width);
          if (cs.textDecorationLine.includes('underline')) ctx.fillRect(x, y + size * 0.55, width, Math.max(1, size * 0.06));
        }
      } else if (child instanceof Element) walk(child);
    }
  };
  walk(demo);
  await Promise.all(images);

  // --- Boceto: los mismos trazos a lápiz de la escena, sobre papel ---
  const sketch = make();
  sketch.ctx.fillStyle = paper;
  sketch.ctx.fillRect(0, 0, W, H);
  sketch.ctx.strokeStyle = graphite;
  sketch.ctx.lineWidth = 1.8 * scale;
  sketch.ctx.lineCap = 'round';
  sketch.ctx.lineJoin = 'round';
  sketch.ctx.scale(scale, scale);
  for (const path of sketchElements(demo, 31).querySelectorAll('path')) sketch.ctx.stroke(new Path2D(path.getAttribute('d') ?? ''));
  sketch.ctx.setTransform(1, 0, 0, 1, 0, 0);

  // --- Código: cada bloque con su etiqueta real ---
  const code = make();
  sheet(code.ctx);
  code.ctx.font = mono;
  code.ctx.textBaseline = 'middle';
  for (const el of demo.querySelectorAll('[data-tag]')) {
    const b = box(el);
    const label = `<${el.tagName.toLowerCase()}>`;
    code.ctx.setLineDash([6 * scale, 5 * scale]);
    code.ctx.strokeStyle = ink;
    code.ctx.lineWidth = 1.5 * scale;
    code.ctx.strokeRect(b.x, b.y, b.w, b.h);
    code.ctx.setLineDash([]);
    const width = code.ctx.measureText(label).width + 14 * scale;
    const height = 22 * scale;
    code.ctx.fillStyle = ink;
    code.ctx.fillRect(b.x, b.y - (b.y > height ? height : 0), width, height);
    code.ctx.fillStyle = paper;
    code.ctx.fillText(label, b.x + 7 * scale, b.y - (b.y > height ? height : 0) + height / 2);
  }

  // --- Pruebas: lo comprobado, con su marca ---
  const qa = make();
  sheet(qa.ctx);
  for (const el of demo.querySelectorAll('h1, [data-view-cta], [data-view-art], .demo-nav, h2')) {
    const b = box(el);
    const pad = 5 * scale;
    qa.ctx.strokeStyle = ok;
    qa.ctx.lineWidth = 3 * scale;
    qa.ctx.strokeRect(b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2);
    const s = 22 * scale;
    const x = b.x + b.w + pad - s, y = b.y - pad - s;
    qa.ctx.fillStyle = ok;
    qa.ctx.fillRect(x, Math.max(0, y), s, s);
    qa.ctx.strokeStyle = paper;
    qa.ctx.lineWidth = 3 * scale;
    qa.ctx.beginPath();
    qa.ctx.moveTo(x + s * 0.24, Math.max(0, y) + s * 0.54);
    qa.ctx.lineTo(x + s * 0.43, Math.max(0, y) + s * 0.72);
    qa.ctx.lineTo(x + s * 0.78, Math.max(0, y) + s * 0.3);
    qa.ctx.stroke();
  }

  host.remove();
  return { aspect: W / H, canvases: { sketch: sketch.canvas, design: design.canvas, code: code.canvas, qa: qa.canvas } as Record<Layer, HTMLCanvasElement> };
}

async function start(section: HTMLElement, signal: AbortSignal) {
  const stage = section.querySelector<HTMLElement>('[data-layers-stage]');
  const source = document.querySelector<HTMLElement>('[data-view-demo]');
  const labels = [...section.querySelectorAll<HTMLElement>('[data-layers-label]')];
  const range = section.querySelector<HTMLInputElement>('[data-layers-gap]');
  if (!stage || !source) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);

  let painted = await paintLayers(source, scale);
  if (signal.aborted) return;

  /** Sin WebGL: las cuatro capas, planas */
  const flat = () => {
    section.classList.add('is-flat');
    const list = section.querySelector<HTMLElement>('[data-layers-flat]');
    list?.querySelectorAll('canvas').forEach((old) => old.remove());
    list?.querySelectorAll<HTMLElement>('[data-layer]').forEach((item) => item.prepend(painted.canvases[item.dataset.layer as Layer]));
  };

  let THREE: typeof import('three');
  let renderer: import('three').WebGLRenderer;
  try {
    THREE = await import('three');
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (error) {
    // Dos motivos posibles: three.js no se pudo descargar o el navegador no da un contexto WebGL
    // (aceleración gráfica desactivada). Queda dicho en la consola para saber cuál
    console.warn('[layers] sin 3D, se enseñan las capas planas:', error);
    flat();
    return;
  }
  if (signal.aborted) return renderer.dispose();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const group = new THREE.Group();
  scene.add(group);

  const height = 1;
  const width = painted.aspect;
  const geometry = new THREE.PlaneGeometry(width, height);
  const textures = {} as Record<Layer, import('three').CanvasTexture>;
  const meshes = LAYERS.map((name, i) => {
    const texture = new THREE.CanvasTexture(painted.canvases[name]);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures[name] = texture;
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    );
    // Se pintan de atrás adelante: boceto, diseño, código y pruebas
    mesh.renderOrder = i;
    group.add(mesh);
    return mesh;
  });

  // Estado: giro (lo cambia el arrastre), separación (el control) y lo que se ve ahora
  const view = { yaw: 0.44, pitch: 0.24, gap: 0.03 };
  const target = { yaw: 0.44, pitch: 0.24, gap: 0.03 };
  let visible = false;
  let raf = 0;
  const corner = new THREE.Vector3();

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  /**
   * La cámara se aleja lo justo para que el montón, con su giro y su separación, quepa entero: mira
   * las cuatro esquinas de cada hoja y se queda con la distancia que pide la más exigente.
   */
  const probe = new THREE.Vector3();
  const frame = () => {
    const half = Math.tan((camera.fov * Math.PI) / 360);
    let distance = 0;
    for (const mesh of meshes) {
      for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
        probe.set((sx * width) / 2, (sy * height) / 2, 0).applyMatrix4(mesh.matrixWorld);
        distance = Math.max(distance, probe.z + Math.abs(probe.x) / (half * camera.aspect), probe.z + Math.abs(probe.y) / half);
      }
    }
    // Un margen alrededor y, arriba, sitio para las cuatro etiquetas apiladas: la escena baja un poco
    const z = distance * 1.14;
    camera.position.set(0, z * half * 0.13, z);
  };
  // La oscilación continua de las capas (WCAG 2.2.2: un movimiento que dura más de 5 s sin parar
  // tiene que poder pararse). Christian decidió el 20 nov que se pare a los 5 s sin que nadie las
  // toque (al verse la sección, al arrastrar, con el teclado o con el control de separación) y que
  // vuelva a moverse al tocarlas. Se apaga y se enciende con un fundido (swayK), no de golpe.
  const SWAY_MS = 5000;
  let lastPoke = performance.now();
  let swayK = 0;
  const poke = () => {
    lastPoke = performance.now();
    wake();
  };
  const draw = (time: number) => {
    raf = 0;
    const ease = reduce ? 1 : 0.085;
    view.yaw += (target.yaw - view.yaw) * ease;
    view.pitch += (target.pitch - view.pitch) * ease;
    view.gap += (target.gap - view.gap) * ease;
    const swaying = !reduce && time - lastPoke < SWAY_MS;
    swayK += ((swaying ? 1 : 0) - swayK) * 0.05;
    if (!swaying && swayK < 0.0005) swayK = 0;
    const sway = Math.sin(time / 2600) * 0.035 * swayK;
    group.rotation.set(view.pitch, view.yaw + sway, 0);
    meshes.forEach((mesh, i) => (mesh.position.z = (i - (meshes.length - 1) / 2) * view.gap));
    group.updateMatrixWorld();
    frame();
    renderer.render(scene, camera);
    // Los nombres de las capas siguen a la esquina de arriba de cada hoja
    const w = stage.clientWidth, h = stage.clientHeight;
    meshes.forEach((mesh, i) => {
      const label = labels[i];
      if (!label) return;
      corner.set(-width / 2, height / 2, 0).applyMatrix4(mesh.matrixWorld).project(camera);
      label.style.transform = `translate(${((corner.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-corner.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
    });
    // Con todo quieto (sin oscilación, sin giro ni separación en camino) no hace falta seguir
    // pintando: lo despierta wake() al tocarlas, al cambiar de tamaño o de tema
    const settled =
      swayK === 0 &&
      Math.abs(target.yaw - view.yaw) < 1e-4 &&
      Math.abs(target.pitch - view.pitch) < 1e-4 &&
      Math.abs(target.gap - view.gap) < 1e-4;
    if (visible && !settled) raf = requestAnimationFrame(draw);
  };
  function wake() {
    if (!raf) raf = requestAnimationFrame(draw);
  }

  // Al entrar en pantalla, las capas se separan
  const gapOf = (value: number) => 0.03 + value * 0.62;
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (entry.intersectionRatio > 0.35) target.gap = gapOf(Number(range?.value ?? 55) / 100);
        poke();
      }
    },
    { threshold: [0, 0.35, 0.6] },
  ).observe(stage);

  range?.addEventListener(
    'input',
    () => {
      target.gap = gapOf(Number(range.value) / 100);
      poke();
    },
    { signal },
  );

  // Arrastrar gira el montón (en táctil, solo a los lados: el scroll vertical sigue siendo de la página)
  let drag: { x: number; y: number; yaw: number; pitch: number } | null = null;
  stage.addEventListener(
    'pointerdown',
    (event) => {
      drag = { x: event.clientX, y: event.clientY, yaw: target.yaw, pitch: target.pitch };
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
      poke();
    },
    { signal },
  );
  stage.addEventListener(
    'pointermove',
    (event) => {
      if (!drag) return;
      target.yaw = Math.max(-1.05, Math.min(1.05, drag.yaw + (event.clientX - drag.x) * 0.006));
      if (event.pointerType === 'mouse') target.pitch = Math.max(-0.5, Math.min(0.6, drag.pitch + (event.clientY - drag.y) * 0.005));
      poke();
    },
    { signal },
  );
  const release = () => {
    drag = null;
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', release, { signal });
  stage.addEventListener('pointercancel', release, { signal });
  // El escenario es un control deslizante del giro (role="slider", ±60°): su valor y su texto se
  // actualizan al girar, con el ratón, el dedo o el teclado, para que un lector de pantalla diga cuánto
  const announce = () => {
    const degrees = Math.round((target.yaw * 180) / Math.PI);
    const clamped = Math.max(-60, Math.min(60, degrees));
    stage.setAttribute('aria-valuenow', String(clamped));
    // Texto humano: sin signo ni guion, la dirección va en palabras (positivo = hacia la derecha)
    const side = clamped < 0 ? stage.dataset.textLeft : stage.dataset.textRight;
    const text = clamped === 0 ? stage.dataset.textZero : side?.replace('{n}', String(Math.abs(clamped)));
    if (text) stage.setAttribute('aria-valuetext', text);
  };
  announce();
  stage.addEventListener('pointermove', () => drag && announce(), { signal });
  stage.addEventListener(
    'keydown',
    (event) => {
      // Flechas (las de arriba y abajo también, como cualquier slider), Inicio y Fin para los extremos
      const limit = 1.05;
      let next = target.yaw;
      // Pasos de 7° en grados enteros, y al cruzar el 0 se para en él: así "De frente" se alcanza y se
      // anuncia desde el teclado (con pasos de 0,12 rad el valor pasaba de 2 a -5 sin pisar el 0)
      const STEP = 7;
      const here = Math.round((target.yaw * 180) / Math.PI);
      const move = (delta: number) => {
        const to = here + delta;
        const crossed = here !== 0 && Math.sign(to) !== Math.sign(here);
        return ((crossed ? 0 : to) * Math.PI) / 180;
      };
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = move(-STEP);
      else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = move(STEP);
      else if (event.key === 'Home') next = -limit;
      else if (event.key === 'End') next = limit;
      else return;
      event.preventDefault();
      target.yaw = Math.max(-limit, Math.min(limit, next));
      announce();
      poke();
    },
    { signal },
  );

  const resizes = new ResizeObserver(() => {
    resize();
    wake();
  });
  resizes.observe(stage);

  // Al cambiar de tema, las capas se vuelven a pintar con los colores nuevos
  const themes = new MutationObserver(async () => {
    painted = await paintLayers(source, scale);
    if (signal.aborted) return;
    for (const name of LAYERS) {
      textures[name].image = painted.canvases[name];
      textures[name].needsUpdate = true;
    }
    wake();
  });
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  signal.addEventListener('abort', () => {
    cancelAnimationFrame(raf);
    resizes.disconnect();
    themes.disconnect();
    geometry.dispose();
    for (const mesh of meshes) (mesh.material as import('three').Material).dispose();
    for (const name of LAYERS) textures[name].dispose();
    renderer.dispose();
    renderer.domElement.remove();
  });

  resize();
  section.classList.add('is-ready');
  wake();
}

let controller: AbortController | undefined;
document.addEventListener('astro:page-load', () => {
  controller?.abort();
  const section = document.querySelector<HTMLElement>('[data-layers]');
  if (!section) return;
  controller = new AbortController();
  const { signal } = controller;
  // La escena (y three.js) solo se cargan cuando la sección está cerca de verse
  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      near.disconnect();
      start(section, signal);
    },
    { rootMargin: '700px 0px' },
  );
  near.observe(section);
  signal.addEventListener('abort', () => near.disconnect());
  document.addEventListener('astro:before-swap', () => controller?.abort(), { once: true });
});
