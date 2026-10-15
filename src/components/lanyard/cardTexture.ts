import * as THREE from 'three';

/** Everything is authored at 1x CSS px (300 x 410 card) and rendered at 2x for sharpness. */
const S = 2;
export const CARD_W = 300 * S;
export const CARD_H = 410 * S;
const RADIUS = 16 * S;

/** Strap tile: 16px wide band (drawn at 2x), repeated along its length. */
export const STRAP_TILE_W = 16 * S;
export const STRAP_TILE_H = 160 * S;

export interface CardContent {
  name: string;
  role: string;
  site: string;
  status: string;
  photoUrl: string;
}

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draws `img` into the rect using object-fit: cover semantics, anchored near the top (faces). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) * 0.2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawSlot(ctx: CanvasRenderingContext2D) {
  // Lanyard slot (the hole the clip goes through)
  ctx.save();
  roundedRect(ctx, CARD_W / 2 - 28 * S, 17 * S, 56 * S, 7 * S, 3.5 * S);
  ctx.fillStyle = '#080808';
  ctx.fill();
  ctx.restore();
}

function drawEdge(ctx: CanvasRenderingContext2D) {
  ctx.save();
  roundedRect(ctx, 1, 1, CARD_W - 2, CARD_H - 2, RADIUS - 1);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.stroke();
  ctx.restore();
}

function drawFront(
  ctx: CanvasRenderingContext2D,
  content: CardContent,
  photo: HTMLImageElement | null,
) {
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.save();
  roundedRect(ctx, 0, 0, CARD_W, CARD_H, RADIUS);
  ctx.clip();

  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Subtle diagonal sheen
  const sheen = ctx.createLinearGradient(CARD_W, 0, 0, CARD_H);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.16, 'rgba(255,255,255,0.075)');
  sheen.addColorStop(0.4, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.75, 'rgba(255,255,255,0.05)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  drawSlot(ctx);

  // Photo, inset 16px
  const px = 16 * S;
  const py = 36 * S;
  const pw = CARD_W - 32 * S;
  const ph = 272 * S;
  ctx.save();
  roundedRect(ctx, px, py, pw, ph, 8 * S);
  ctx.clip();
  if (photo && photo.naturalWidth > 0) {
    ctx.filter = 'grayscale(1)';
    drawCover(ctx, photo, px, py, pw, ph);
    ctx.filter = 'none';
  } else {
    ctx.fillStyle = '#27272a';
    ctx.fillRect(px, py, pw, ph);
  }
  ctx.restore();

  // Divider + availability status (the gap between photo and divider is intentionally blank)
  ctx.fillStyle = 'rgba(255,255,255,0.09)';
  ctx.fillRect(px, 362 * S, pw, 1 * S);

  ctx.save();
  ctx.shadowColor = 'rgba(34,197,94,0.7)';
  ctx.shadowBlur = 8 * S;
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(19 * S, 384 * S, 5 * S, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#d4d4d8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `500 ${12 * S}px ${SANS}`;
  ctx.fillText(content.status, 31 * S, 384 * S);

  ctx.restore();
  drawEdge(ctx);
}

function drawBack(ctx: CanvasRenderingContext2D, content: CardContent) {
  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.save();
  roundedRect(ctx, 0, 0, CARD_W, CARD_H, RADIUS);
  ctx.clip();
  ctx.fillStyle = '#161616';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  drawSlot(ctx);

  // Initials monogram
  const initials = content.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  ctx.fillStyle = '#f5f5f5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${72 * S}px ${SERIF}`;
  ctx.fillText(initials, CARD_W / 2, CARD_H / 2 - 10 * S);

  ctx.fillStyle = '#737373';
  ctx.font = `500 ${11 * S}px ${SANS}`;
  ctx.fillText(content.site, CARD_W / 2, CARD_H - 34 * S);
  ctx.restore();

  drawEdge(ctx);
}

/**
 * Strap tile: dark band with small vertical letter-spaced text reading top to bottom.
 * Text starts a little below the tile start so it is not clipped by the hero's top edge.
 */
function drawStrap(ctx: CanvasRenderingContext2D, site: string) {
  ctx.clearRect(0, 0, STRAP_TILE_W, STRAP_TILE_H);
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(0, 0, STRAP_TILE_W, STRAP_TILE_H);
  // Light edge so the band stays visible on dark backgrounds
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fillRect(0, 0, 1.5 * S, STRAP_TILE_H);
  ctx.fillRect(STRAP_TILE_W - 1.5 * S, 0, 1.5 * S, STRAP_TILE_H);

  ctx.save();
  ctx.translate(STRAP_TILE_W / 2, 31 * S);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#b4b4b8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `500 ${7.5 * S}px ${SANS}`;
  const spacing = 1.6 * S;
  let x = 0;
  for (const char of site) {
    ctx.fillText(char, x, 0);
    x += ctx.measureText(char).width + spacing;
  }
  ctx.restore();
}

/** Soft drop shadow, drawn through canvas shadowBlur (the rect itself is kept off-canvas). */
function createShadowTexture() {
  const w = 512;
  const h = 700;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const rw = 300;
    const rh = 410;
    const off = 2000;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = off;
    roundedRect(ctx, (w - rw) / 2 - off, (h - rh) / 2, rw, rh, 16);
    ctx.fillStyle = '#000';
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Builds the card front/back, strap and shadow textures from 2D canvases. They are drawn
 * immediately with a placeholder and redrawn once the photo and web fonts are available.
 */
export function createCardTextures(content: CardContent) {
  const front = document.createElement('canvas');
  const back = document.createElement('canvas');
  const strap = document.createElement('canvas');
  front.width = back.width = CARD_W;
  front.height = back.height = CARD_H;
  strap.width = STRAP_TILE_W;
  strap.height = STRAP_TILE_H;
  const fctx = front.getContext('2d');
  const bctx = back.getContext('2d');
  const sctx = strap.getContext('2d');
  if (!fctx || !bctx || !sctx) throw new Error('2D canvas unavailable');

  const frontTexture = makeTexture(front);
  const backTexture = makeTexture(back);
  const strapTexture = makeTexture(strap);
  strapTexture.wrapT = THREE.RepeatWrapping;
  const shadowTexture = createShadowTexture();

  let photo: HTMLImageElement | null = null;
  let disposed = false;

  const redraw = () => {
    if (disposed) return;
    drawFront(fctx, content, photo);
    drawBack(bctx, content);
    drawStrap(sctx, content.site);
    frontTexture.needsUpdate = true;
    backTexture.needsUpdate = true;
    strapTexture.needsUpdate = true;
  };

  redraw();

  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    photo = img;
    redraw();
  };
  img.src = content.photoUrl;

  if (document.fonts) {
    Promise.all([document.fonts.load(`600 40px ${SERIF}`), document.fonts.load(`500 12px ${SANS}`)])
      .then(redraw)
      .catch(() => {});
  }

  return {
    frontTexture,
    backTexture,
    strapTexture,
    shadowTexture,
    dispose() {
      disposed = true;
      img.onload = null;
      frontTexture.dispose();
      backTexture.dispose();
      strapTexture.dispose();
      shadowTexture.dispose();
    },
  };
}
