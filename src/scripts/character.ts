// Movimiento del personaje (docs/referencias/transicion-personaje.md): poses y ciclos de andar,
// en ángulos del mundo, y la función que los aplica al muñeco de Character.astro.
import { lowestSole, type Limbs, type Pose } from '@/data/character-rig';

const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);

/** De pie, mirando a la derecha */
export function standing(): Pose {
  const limbs: Limbs = { upperArm: 4, forearm: 82, hand: 86, thigh: 0, shin: 0, shoe: 0 };
  return { torso: 0, head: 0, hip: 0, near: { ...limbs }, far: { ...limbs, upperArm: -4 } };
}

/** Una pierna del ciclo de andar. `phase` en grados; `back` anda de espaldas (el pie lleva otro juego) */
function leg(phase: number, mean: number, swing: number, flex: number) {
  const thigh = mean + swing * sin(phase);
  // La rodilla se dobla mientras la pierna viaja hacia delante (el muslo va de atrás adelante)
  const lift = Math.max(0, -cos(phase));
  const shin = thigh + 6 + flex * lift ** 1.3;
  // El talón se levanta al final del apoyo y la puntera sube al llegar delante
  const shoe = shin * 0.35 + 24 * Math.max(0, sin(phase)) ** 2 - 14 * Math.max(0, -sin(phase)) ** 2;
  return { thigh, shin, shoe };
}

/** Empujando: inclinado hacia delante, los brazos estirados y las palmas contra la página */
export function pushing(phase: number): Pose {
  const strain = sin(phase * 2);
  const torso = 31 + 1.5 * strain;
  const arm = (off: number) => ({ upperArm: -66 + off + 2 * strain, forearm: -6 + off * 0.5, hand: -72 + off });
  return {
    torso,
    head: 10 - 2 * strain,
    hip: 12,
    near: { ...arm(0), ...leg(phase, 16, 31, 62) },
    far: { ...arm(-7), ...leg(phase + 180, 16, 31, 62) },
  };
}

/** Arrastrando: echado hacia atrás, los puños agarrando el borde, andando de espaldas */
export function pulling(phase: number): Pose {
  const strain = sin(phase * 2);
  const torso = -24 - 1.5 * strain;
  const arm = (off: number) => ({ upperArm: -74 + off - 2 * strain, forearm: -6 + off * 0.5, hand: -4 + off });
  return {
    torso,
    head: -12 + 2 * strain,
    hip: -10,
    near: { ...arm(0), ...leg(-phase, -22, 23, 46) },
    far: { ...arm(-6), ...leg(-phase + 180, -22, 23, 46) },
  };
}

/** Aplica una pose al muñeco: cada pieza recibe su giro respecto a su padre */
export function applyPose(chr: HTMLElement, pose: Pose) {
  const set = (name: string, deg: number) => {
    const el = chr.querySelector<HTMLElement>(`[data-j="${name}"]`);
    if (el) el.style.transform = `rotate(${deg.toFixed(2)}deg)`;
  };
  set('torso', pose.torso);
  set('head', pose.head - pose.torso);
  set('hip', pose.hip);
  for (const side of ['near', 'far'] as const) {
    const limbs = pose[side];
    set(`${side}.upperArm`, limbs.upperArm - pose.torso);
    set(`${side}.forearm`, limbs.forearm - limbs.upperArm);
    set(`${side}.hand`, limbs.hand - limbs.forearm);
    set(`${side}.thigh`, limbs.thigh);
    set(`${side}.shin`, limbs.shin - limbs.thigh);
    set(`${side}.shoe`, limbs.shoe - limbs.shin);
  }
  // La cadera sube o baja para que la suela más baja toque el suelo: así el cuerpo bota al andar
  const root = chr.querySelector<HTMLElement>('[data-j="root"]');
  if (root) root.style.transform = `translateY(calc(${(-lowestSole(pose)).toFixed(1)} * var(--u)))`;
}
