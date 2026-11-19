// Movimiento del personaje (docs/referencias/transicion-personaje.md): poses y ciclos de andar,
// en ángulos del mundo, y la función que los aplica al muñeco de Character.astro.
import { ROOT, ankleOf, bone, handContact, lowestSole, rotate, type Hand, type Limbs, type Pose } from '@/data/character-rig';

const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);

/** De pie, mirando a la derecha */
export function standing(): Pose {
  const limbs: Limbs = { upperArm: 3, forearm: 80, hand: 84, thigh: 0, shin: 0, shoe: 0 };
  return { torso: 0, head: 0, hood: 0, cords: 0, near: { ...limbs }, far: { ...limbs, upperArm: -5, forearm: 74, hand: 78 } };
}

/** Una pierna del ciclo de andar. `phase` en grados */
function leg(phase: number, mean: number, swing: number, flex: number): Pick<Limbs, 'thigh' | 'shin' | 'shoe' | 'bent'> {
  const thigh = mean + swing * sin(phase);
  // La rodilla se dobla mientras la pierna viaja hacia delante (el muslo va de atrás adelante)
  const lift = Math.max(0, -cos(phase));
  const shin = thigh + 5 + flex * lift ** 1.3;
  // El talón se levanta al final del apoyo y la puntera sube al llegar delante
  const push = Math.max(0, sin(phase));
  const bent = push > 0.62 && cos(phase) > -0.55;
  const shoe = shin * 0.35 + 26 * push ** 2 - 14 * Math.max(0, -sin(phase)) ** 2 - (bent ? 20 : 0);
  return { thigh, shin, shoe, bent };
}

/** Empujando: inclinado hacia delante, los brazos estirados y las palmas contra la página */
export function pushing(phase: number): Pose {
  const strain = sin(phase * 2);
  const torso = 31 + 1.6 * strain;
  const arm = (off: number) => ({ upperArm: -64 + off + 2 * strain, forearm: -7 + off * 0.5, hand: -78 + off });
  return {
    torso,
    head: 12 - 2 * strain,
    // La capucha y los cordones van con retraso: cuelgan y botan con cada paso
    hood: torso * 0.55 + 5 * sin(phase * 2 - 70),
    cords: 9 * sin(phase * 2 - 110) - 4,
    near: { ...arm(0), ...leg(phase, 15, 31, 64) },
    far: { ...arm(-7), ...leg(phase + 180, 15, 31, 64) },
  };
}

/**
 * Arrastrando: camina hacia delante, muy inclinado, con los dos brazos estirados hacia atrás
 * agarrando el canto de la página que lleva a rastras.
 */
export function pulling(phase: number): Pose {
  const strain = sin(phase * 2);
  const torso = 36 + 1.8 * strain;
  const arm = (off: number) => ({ upperArm: 62 + off + 2 * strain, forearm: 168 + off * 0.5, hand: 176 + off, flip: true });
  return {
    torso,
    head: 16 - 2 * strain,
    hood: torso * 0.55 + 5 * sin(phase * 2 - 70),
    cords: 10 * sin(phase * 2 - 110) - 8,
    near: { ...arm(0), ...leg(phase, 17, 30, 62) },
    far: { ...arm(8), ...leg(phase + 180, 17, 30, 62) },
  };
}

/**
 * Aplica una pose al muñeco: cada pieza recibe su giro respecto a su padre.
 * Con `pin`, el personaje se coloca de modo que la mano de delante quede justo en el origen: así
 * las manos no se separan del canto de la página aunque el cuerpo se mueva.
 */
export function applyPose(chr: HTMLElement, pose: Pose, pin?: Hand) {
  const parts = (chr as HTMLElement & { __parts?: Map<string, HTMLElement> }).__parts ?? new Map<string, HTMLElement>();
  if (!parts.size) {
    chr.querySelectorAll<HTMLElement>('[data-j]').forEach((el) => parts.set(el.dataset.j!, el));
    (chr as HTMLElement & { __parts?: Map<string, HTMLElement> }).__parts = parts;
  }
  const set = (name: string, deg: number) => {
    const el = parts.get(name);
    if (el) el.style.transform = `rotate(${deg.toFixed(2)}deg)`;
  };
  set('torso', pose.torso);
  set('head', pose.head - pose.torso);
  set('hood', pose.hood - pose.torso);
  set('cord.0', pose.cords - pose.torso);
  set('cord.1', pose.cords * 0.8 - pose.torso);
  for (const side of ['near', 'far'] as const) {
    const limbs = pose[side];
    set(`${side}.upperArm`, limbs.upperArm - pose.torso);
    set(`${side}.forearm`, limbs.forearm - limbs.upperArm);
    const hand = parts.get(`${side}.hand`);
    if (hand) hand.style.transform = `rotate(${(limbs.hand - limbs.forearm).toFixed(2)}deg)${limbs.flip ? ' scaleY(-1)' : ''}`;
    set(`${side}.thigh`, limbs.thigh);
    set(`${side}.shin`, limbs.shin - limbs.thigh);
    set(`${side}.shoe`, limbs.shoe - limbs.shin);
    const shoe = parts.get(`${side}.shoe`);
    if (shoe) shoe.dataset.shoe = limbs.bent ? 'bent' : 'flat';
  }
  // La cadera sube o baja para que la suela más baja toque el suelo: así el cuerpo bota al andar
  const root = parts.get('root');
  const shift = pin ? -handContact(pose, pin) : 0;
  if (root) root.style.transform = `translate(calc(${shift.toFixed(1)} * var(--u)), calc(${(-lowestSole(pose)).toFixed(1)} * var(--u)))`;
}

/** Clona un molde de efecto (polvo o sudor) y lo suelta en un punto del muñeco, en sus unidades */
function emit(chr: HTMLElement, kind: 'dust' | 'sweat', x: number, y: number, vars: Record<string, string | number>) {
  const moulds = chr.querySelectorAll<HTMLElement | SVGElement>(`.chr-bank [data-fx="${kind}"]`);
  const mould = moulds[Math.floor(Math.random() * moulds.length)];
  if (!mould) return;
  const fx = mould.cloneNode(true) as HTMLElement;
  fx.removeAttribute('data-fx');
  fx.setAttribute('class', `chr-fx chr-fx-${kind}`);
  fx.style.left = `calc(${x.toFixed(1)} * var(--u))`;
  fx.style.top = `calc(${y.toFixed(1)} * var(--u))`;
  if (kind === 'dust') fx.style.setProperty('--w', String((mould as HTMLElement).dataset.w ?? 110));
  for (const [name, value] of Object.entries(vars)) fx.style.setProperty(name, String(value));
  fx.addEventListener('animationend', () => fx.remove(), { once: true });
  chr.append(fx);
}

const last = new WeakMap<HTMLElement, number>();
const turns = (phase: number, at: number) => Math.floor((phase - at) / 360);

/**
 * Un instante de un ciclo: pone la pose y, cuando toca, suelta los efectos.
 * - Polvo: cada vez que un pie termina su apoyo (dos veces por ciclo).
 * - Sudor: una gota por ciclo, desde la frente.
 */
export function animate(chr: HTMLElement, mode: 'pushing' | 'pulling', phase: number) {
  const pose = mode === 'pushing' ? pushing(phase) : pulling(phase);
  const pin: Hand = mode === 'pushing' ? 'open' : 'grip';
  applyPose(chr, pose, pin);
  // Todo lo demás se coloca respecto a la cadera, que ahora está desplazada
  const shift = -handContact(pose, pin);

  const before = last.get(chr);
  last.set(chr, phase);
  if (before === undefined || Math.abs(phase - before) > 120) return;
  const ground = lowestSole(pose);
  // El pie que termina su apoyo levanta polvo hacia atrás
  const back = -1;
  for (const [side, hip, offset] of [[pose.near, ROOT.legNear, 0], [pose.far, ROOT.legFar, 180]] as const) {
    if (turns(phase + offset, 100) !== turns(before + offset, 100)) {
      const ankle = ankleOf(side, hip);
      emit(chr, 'dust', shift + ankle[0] + back * 30, 0, { '--dx': back * (60 + Math.random() * 30) });
    }
  }
  if (turns(phase, 30) !== turns(before, 30)) {
    const neck = rotate(bone('torso', 'neck'), pose.torso);
    const brow = rotate([70, -190], pose.head);
    const x = shift + ROOT.waist[0] + neck[0] + brow[0], y = -ground + ROOT.waist[1] + neck[1] + brow[1];
    emit(chr, 'sweat', x, y, { '--dx': -(70 + Math.random() * 50), '--dy': -(50 + Math.random() * 40), '--r': '-38deg' });
    emit(chr, 'sweat', x - 20, y + 14, { '--dx': -(120 + Math.random() * 40), '--dy': -(10 + Math.random() * 30), '--r': '-66deg' });
  }
}
