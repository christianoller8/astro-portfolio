// El muñeco articulado del personaje (docs/referencias/transicion-personaje.md).
// Cada pieza es un dibujo de Christian (src/assets/character, recortado de la segunda lámina,
// docs/imgs/emoji-piezas-2.jpg). Las proporciones salen del personaje entero de perfil que trae esa
// lámina. Todas las medidas van en píxeles del dibujo; `scale` lleva cada pieza a "unidades de
// muñeco", en las que el personaje de pie mide 1000 de alto.
// - pivot: el punto del dibujo por el que la pieza se une a su padre (y sobre el que gira).
// - joints: los puntos del dibujo donde se enganchan sus hijas.

export type PartName = 'torso' | 'upperArm' | 'forearm' | 'thigh' | 'shin';

export interface Art {
  file: string;
  w: number;
  h: number;
  scale: [number, number];
  pivot: [number, number];
}
export interface Part extends Art {
  joints: Record<string, [number, number]>;
}

/** Piezas con hijas */
export const PARTS: Record<PartName, Part> = {
  torso: {
    file: 'torso', w: 294, h: 427, scale: [0.9, 0.9], pivot: [124, 372],
    joints: { neck: [182, 40], shoulder: [76, 112], hood: [150, 46], cords: [210, 80] },
  },
  upperArm: { file: 'upper-arm', w: 131, h: 323, scale: [0.8, 0.76], pivot: [64, 58], joints: { elbow: [72, 262] } },
  forearm: { file: 'forearm', w: 234, h: 133, scale: [0.8, 0.8], pivot: [52, 68], joints: { wrist: [212, 62] } },
  // El muslo trae la cadera dibujada: la articulación está bajo la cinturilla
  thigh: { file: 'thigh', w: 212, h: 428, scale: [0.7, 0.7], pivot: [104, 112], joints: { knee: [122, 362] } },
  shin: { file: 'shin', w: 141, h: 298, scale: [0.66, 0.73], pivot: [70, 52], joints: { ankle: [74, 262] } },
};

export type Face = 'calm' | 'strain' | 'relief' | 'front';
export type Hand = 'open' | 'fist' | 'grip';
export type Shoe = 'flat' | 'bent';

/** Piezas finales: caras, manos, zapatillas, capucha y cordones (cada grupo comparte articulación) */
export const ART: {
  heads: Record<Face, Art>;
  hands: Record<Hand, Art>;
  shoes: Record<Shoe, Art>;
  hood: Art;
  cords: Art[];
  dust: { file: string; w: number; h: number }[];
} = {
  heads: {
    calm: { file: 'head', w: 252, h: 330, scale: [0.96, 0.96], pivot: [120, 304] },
    strain: { file: 'head-strain', w: 225, h: 330, scale: [0.96, 0.96], pivot: [108, 306] },
    relief: { file: 'head-relief', w: 213, h: 341, scale: [0.96, 0.96], pivot: [96, 318] },
    front: { file: 'head-front', w: 214, h: 340, scale: [0.96, 0.96], pivot: [98, 318] },
  },
  hands: {
    open: { file: 'hand-open', w: 234, h: 135, scale: [0.46, 0.46], pivot: [22, 78] },
    fist: { file: 'hand-fist', w: 177, h: 129, scale: [0.46, 0.46], pivot: [18, 70] },
    grip: { file: 'hand-grip', w: 189, h: 145, scale: [0.46, 0.46], pivot: [18, 78] },
  },
  shoes: {
    flat: { file: 'shoe', w: 283, h: 170, scale: [0.7, 0.7], pivot: [78, 38] },
    bent: { file: 'shoe-bent', w: 268, h: 187, scale: [0.7, 0.7], pivot: [70, 30] },
  },
  hood: { file: 'hood', w: 218, h: 152, scale: [0.9, 0.9], pivot: [176, 118] },
  cords: [
    { file: 'cord-1', w: 29, h: 190, scale: [0.9, 0.9], pivot: [14, 6] },
    { file: 'cord-2', w: 32, h: 161, scale: [0.9, 0.9], pivot: [16, 6] },
  ],
  dust: [
    { file: 'dust-1', w: 114, h: 102 },
    { file: 'dust-2', w: 63, h: 57 },
    { file: 'dust-3', w: 178, h: 103 },
  ],
};

/** Dónde se engancha cada cosa a la raíz (la articulación de la cadera), en unidades de muñeco */
export const ROOT = {
  waist: [-4, 18] as [number, number], // base del torso (el bajo de la sudadera) respecto a la cadera
  legFar: [8, 0] as [number, number],
  legNear: [-8, 0] as [number, number],
};

/** Una pose: ángulos en grados y en el mundo (0 = como está dibujada la pieza) */
export interface Pose {
  torso: number;
  head: number;
  hood: number;
  cords: number;
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
  /** La zapatilla con la puntera doblada (el momento de impulsar) */
  bent?: boolean;
  /** La mano, volteada: para cuando el brazo va hacia atrás y la mano quedaría boca abajo */
  flip?: boolean;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
export const rotate = ([x, y]: [number, number], deg: number): [number, number] => {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
};
const scaled = (art: Art, [x, y]: [number, number]): [number, number] => [x * art.scale[0], y * art.scale[1]];
/** Vector del pivote de una pieza a una de sus articulaciones, ya escalado */
export const bone = (name: PartName, joint: string): [number, number] => {
  const part = PARTS[name];
  const [jx, jy] = part.joints[joint];
  return scaled(part, [jx - part.pivot[0], jy - part.pivot[1]]);
};

/**
 * Dónde toca la mano de delante, respecto a la cadera (x, en unidades de muñeco).
 * - Mano abierta: el punto de la palma más adelantado (lo que apoya contra el canto).
 * - Mano que agarra: el hueco entre los dedos y la palma (por donde pasa el canto).
 */
export function handContact(pose: Pose, hand: Hand): number {
  const side = pose.near;
  const shoulder = rotate(bone('torso', 'shoulder'), pose.torso);
  const elbow = rotate(bone('upperArm', 'elbow'), side.upperArm);
  const wrist = rotate(bone('forearm', 'wrist'), side.forearm);
  const base = ROOT.waist[0] + shoulder[0] + elbow[0] + wrist[0];
  const art = ART.hands[hand];
  const reach = (point: [number, number]) => {
    const local = scaled(art, [point[0] - art.pivot[0], point[1] - art.pivot[1]]);
    return rotate(side.flip ? [local[0], -local[1]] : local, side.hand)[0];
  };
  if (hand === 'grip') return base + reach([124, 74]);
  // Puntas de los dedos, centro de la palma y talón de la mano
  return base + Math.max(...([[226, 58], [150, 124], [60, 126]] as [number, number][]).map(reach));
}

/** Tobillo de una pierna respecto a la cadera, en unidades de muñeco (y hacia abajo) */
export function ankleOf(side: Limbs, hip: [number, number]): [number, number] {
  const knee = rotate(bone('thigh', 'knee'), side.thigh);
  const shin = rotate(bone('shin', 'ankle'), side.shin);
  return [hip[0] + knee[0] + shin[0], hip[1] + knee[1] + shin[1]];
}

/** Altura de la suela más baja respecto a la cadera: sirve para apoyar el pie en el suelo */
export function lowestSole(pose: Pose): number {
  let low = 0;
  const shoe = ART.shoes.flat;
  for (const [side, hip] of [[pose.near, ROOT.legNear], [pose.far, ROOT.legFar]] as const) {
    const ankle = ankleOf(side, hip);
    // Talón y puntera de la zapatilla, en su dibujo
    for (const point of [[24, 164], [262, 164]] as [number, number][]) {
      const local = rotate(scaled(shoe, [point[0] - shoe.pivot[0], point[1] - shoe.pivot[1]]), side.shoe);
      low = Math.max(low, ankle[1] + local[1]);
    }
  }
  return low;
}
