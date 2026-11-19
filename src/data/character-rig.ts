// El muñeco articulado del personaje (docs/referencias/transicion-personaje.md).
// Cada pieza es un dibujo de Christian (src/assets/character, recortado de docs/imgs/emoji-piezas.jpg).
// Todas las medidas van en píxeles del dibujo original; `scale` lleva cada pieza a "unidades de
// muñeco", en las que el personaje de pie mide unas 1000 de alto.
// - pivot: el punto del dibujo por el que la pieza se une a su padre (y sobre el que gira).
// - joints: los puntos del dibujo donde se enganchan sus hijas.
// - rest: el giro, en grados, que deja el dibujo "colgando hacia abajo" (el antebrazo y las manos
//   están dibujados en horizontal).

export type PartName =
  | 'head'
  | 'torso'
  | 'hip'
  | 'upperArm'
  | 'forearm'
  | 'hand'
  | 'thigh'
  | 'shin'
  | 'shoe';

export interface Part {
  file: string;
  w: number;
  h: number;
  scale: [number, number];
  pivot: [number, number];
  joints?: Record<string, [number, number]>;
}

export const PARTS: Record<PartName, Part> = {
  head: { file: 'head', w: 365, h: 468, scale: [0.6, 0.6], pivot: [128, 418] },
  torso: {
    file: 'torso',
    w: 455,
    h: 728,
    scale: [0.56, 0.56],
    pivot: [235, 640],
    joints: { neck: [268, 78], shoulder: [205, 232] },
  },
  hip: { file: 'hip', w: 315, h: 437, scale: [0.5, 0.5], pivot: [158, 170] },
  upperArm: { file: 'upper-arm', w: 207, h: 431, scale: [0.46, 0.46], pivot: [104, 78], joints: { elbow: [108, 368] } },
  forearm: { file: 'forearm', w: 407, h: 185, scale: [0.46, 0.46], pivot: [66, 96], joints: { wrist: [368, 84] } },
  hand: { file: 'hand-open', w: 292, h: 200, scale: [0.4, 0.4], pivot: [36, 100] },
  thigh: { file: 'thigh', w: 284, h: 558, scale: [0.34, 0.38], pivot: [142, 96], joints: { knee: [142, 462] } },
  shin: { file: 'shin', w: 303, h: 743, scale: [0.4, 0.32], pivot: [136, 92], joints: { ankle: [150, 686] } },
  shoe: { file: 'shoe', w: 377, h: 243, scale: [0.42, 0.42], pivot: [92, 44] },
};

/** Variantes que comparten articulación con la pieza base */
export const VARIANTS = {
  headEffort: { file: 'head-effort', w: 361, h: 426, scale: [0.6, 0.6] as [number, number], pivot: [126, 398] as [number, number] },
  handFist: { file: 'hand-fist', w: 230, h: 181, scale: [0.4, 0.4] as [number, number], pivot: [30, 100] as [number, number] },
};

/** Dónde se engancha cada cosa a la raíz (la cadera), en unidades de muñeco */
export const ROOT = {
  waist: [0, -62] as [number, number], // base del torso respecto a la articulación de la cadera
  legFar: [6, 0] as [number, number],
  legNear: [-6, 0] as [number, number],
};

/** Ángulos de una pose, en grados y en el mundo (0 = como está dibujada la pieza) */
export interface Pose {
  torso: number;
  head: number;
  hip: number;
  near: Limbs;
  far: Limbs;
}
export interface Limbs {
  upperArm: number;
  forearm: number;
  hand: number;
  thigh: number;
  shin: number;
  shoe: number;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const rot = ([x, y]: [number, number], deg: number): [number, number] => {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
};
const sc = (part: Part, [x, y]: [number, number]): [number, number] => [x * part.scale[0], y * part.scale[1]];
/** Vector del pivote de una pieza a una de sus articulaciones, ya escalado */
export const bone = (name: PartName, joint: string): [number, number] => {
  const part = PARTS[name];
  const [jx, jy] = part.joints![joint];
  return sc(part, [jx - part.pivot[0], jy - part.pivot[1]]);
};

/** Altura (y, hacia abajo) de la suela más baja respecto a la cadera: sirve para apoyar el pie en el suelo */
export function lowestSole(pose: Pose): number {
  let low = 0;
  for (const side of [pose.near, pose.far]) {
    const knee = rot(bone('thigh', 'knee'), side.thigh);
    const ankleBone = rot(bone('shin', 'ankle'), side.shin);
    const ankle: [number, number] = [knee[0] + ankleBone[0], knee[1] + ankleBone[1]];
    // Talón y puntera de la zapatilla, en su dibujo
    for (const point of [[30, 236], [350, 236]] as [number, number][]) {
      const shoe = PARTS.shoe;
      const local = rot(sc(shoe, [point[0] - shoe.pivot[0], point[1] - shoe.pivot[1]]), side.shoe);
      low = Math.max(low, ankle[1] + local[1]);
    }
  }
  return low;
}
