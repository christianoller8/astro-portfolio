import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import { createCardTextures, type CardContent } from './cardTexture';

/**
 * The scene uses an orthographic camera so world units map 1:1 to hero pixels:
 * PX_PER_UNIT px = 1 unit when the canvas is REF_HEIGHT px tall (the canvas then scales with its
 * height, so the card keeps its proportions on every breakpoint).
 */
const PX_PER_UNIT = 187.5;
const REF_HEIGHT = 780;
const VIEW_HEIGHT = REF_HEIGHT / PX_PER_UNIT;

const CARD_WIDTH = 300 / PX_PER_UNIT;
const CARD_HEIGHT = 410 / PX_PER_UNIT;
const CARD_DEPTH = 0.04;
const CARD_RADIUS = 16 / PX_PER_UNIT;
/** Where the strap ends, in card-local coordinates (the metal ring above the clip). */
const CARD_ANCHOR_Y = CARD_HEIGHT / 2 + 0.107;
/** Card top edge at rest: 179px below the top of the canvas. */
const CARD_TOP_Y = VIEW_HEIGHT / 2 - 179 / PX_PER_UNIT;
/** The strap starts slightly above the canvas so it appears to come out of the header. */
const ANCHOR_Y = VIEW_HEIGHT / 2 + 0.1;
const CHAIN_LENGTH = ANCHOR_Y - (CARD_TOP_Y + 0.107);
const SEGMENT_LENGTH = CHAIN_LENGTH / 3;
const CARD_REST_Y = -(CHAIN_LENGTH + CARD_ANCHOR_Y);

const STRAP_WIDTH = 16 / PX_PER_UNIT;
const STRAP_TILE_LENGTH = 160 / PX_PER_UNIT;
const STRAP_SEGMENTS = 32;

const segmentProps = {
  type: 'dynamic' as const,
  canSleep: true,
  colliders: false as const,
  angularDamping: 2,
  linearDamping: 2,
};

function createCardBodyGeometry() {
  const w = CARD_WIDTH / 2;
  const h = CARD_HEIGHT / 2;
  const r = CARD_RADIUS;
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.absarc(w - r, -h + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, h - r);
  shape.absarc(w - r, h - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w + r, h);
  shape.absarc(-w + r, h - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -h + r);
  shape.absarc(-w + r, -h + r, r, Math.PI, Math.PI * 1.5, false);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: CARD_DEPTH,
    bevelEnabled: false,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -CARD_DEPTH / 2);
  return geometry;
}

/** Flat ribbon (camera-facing, in the XY plane) whose vertices are rewritten every frame. */
function createStrapGeometry() {
  const count = (STRAP_SEGMENTS + 1) * 2;
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const uv = new THREE.BufferAttribute(new Float32Array(count * 2), 2);
  position.setUsage(THREE.DynamicDrawUsage);
  uv.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setAttribute('uv', uv);
  const index: number[] = [];
  for (let i = 0; i < STRAP_SEGMENTS; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setIndex(index);
  return geometry;
}

function updateStrapGeometry(geometry: THREE.BufferGeometry, points: THREE.Vector3[]) {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute;
  const half = STRAP_WIDTH / 2;
  let length = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i > 0) length += p.distanceTo(points[i - 1]);
    const prev = points[Math.max(i - 1, 0)];
    const next = points[Math.min(i + 1, points.length - 1)];
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    // Normal to the tangent, in screen space (points to +x for a strap hanging down)
    const nx = -ty;
    const ny = tx;
    const v = 1 - length / STRAP_TILE_LENGTH;
    position.setXYZ(i * 2, p.x - nx * half, p.y - ny * half, 0);
    position.setXYZ(i * 2 + 1, p.x + nx * half, p.y + ny * half, 0);
    uv.setXY(i * 2, 0, v);
    uv.setXY(i * 2 + 1, 1, v);
  }
  position.needsUpdate = true;
  uv.needsUpdate = true;
}

/** Keeps the orthographic zoom tied to the canvas height (see PX_PER_UNIT / REF_HEIGHT). */
function CameraRig() {
  const camera = useThree((s) => s.camera);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    camera.zoom = height / VIEW_HEIGHT;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, height, invalidate]);
  return null;
}

interface BandProps {
  content: CardContent;
  onReady: () => void;
}

function Band({ content, onReady }: BandProps) {
  const strap = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const { vec, ang, rot, lerped } = useMemo(
    () => ({
      vec: new THREE.Vector3(),
      ang: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      lerped: [new THREE.Vector3(), new THREE.Vector3()] as const,
    }),
    [],
  );
  const lerpedInit = useRef(false);
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = 'chordal';
    return c;
  }, []);

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  const bodyGeometry = useMemo(createCardBodyGeometry, []);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT), []);
  const shadowGeometry = useMemo(
    () => new THREE.PlaneGeometry((512 / 300) * CARD_WIDTH, (700 / 410) * CARD_HEIGHT),
    [],
  );
  const strapGeometry = useMemo(createStrapGeometry, []);
  const textures = useMemo(() => createCardTextures(content), [content]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_ANCHOR_Y, 0],
  ]);

  useEffect(() => {
    document.body.style.cursor = dragged ? 'grabbing' : hovered ? 'grab' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useEffect(
    () => () => {
      textures.dispose();
      bodyGeometry.dispose();
      planeGeometry.dispose();
      shadowGeometry.dispose();
      strapGeometry.dispose();
    },
    [textures, bodyGeometry, planeGeometry, shadowGeometry, strapGeometry],
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    if (dragged) {
      // Orthographic camera: pointer (NDC) maps linearly to world units on the z = 0 plane.
      const cam = state.camera;
      vec.set(
        cam.position.x + (state.pointer.x * state.size.width) / 2 / cam.zoom,
        cam.position.y + (state.pointer.y * state.size.height) / 2 / cam.zoom,
        0,
      );
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: 0,
      });
    }

    // Smooth the two middle joints so the strap looks fluid
    const mids = [j1.current, j2.current];
    if (!lerpedInit.current) {
      mids.forEach((body, i) => lerped[i].copy(body.translation()));
      lerpedInit.current = true;
    }
    mids.forEach((body, i) => {
      const target = body.translation();
      const distance = Math.max(0.1, Math.min(1, lerped[i].distanceTo(target as THREE.Vector3)));
      // Clamp the factor: a long frame (throttled tab) would otherwise extrapolate wildly
      lerped[i].lerp(target as THREE.Vector3, Math.min(1, delta * (10 + distance * 40)));
    });

    // From the fixed anchor (top) down to the ring on the card
    curve.points[0].copy(fixed.current.translation() as THREE.Vector3);
    curve.points[1].copy(lerped[0]);
    curve.points[2].copy(lerped[1]);
    curve.points[3].copy(j3.current.translation() as THREE.Vector3);
    updateStrapGeometry(strapGeometry, curve.getPoints(STRAP_SEGMENTS));

    // Keep the card from spinning endlessly around its vertical axis
    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  const seg = SEGMENT_LENGTH;

  return (
    <>
      <group position={[0, ANCHOR_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        {/* Slight horizontal offsets give a small swing when the scene starts */}
        <RigidBody position={[0.01, -seg, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} density={8} />
        </RigidBody>
        <RigidBody position={[0.02, -seg * 2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} density={8} />
        </RigidBody>
        <RigidBody position={[0.03, -seg * 3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} density={8} />
        </RigidBody>
        <RigidBody
          position={[0.04, CARD_REST_Y, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, 0.02]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              setDragged(false);
            }}
            onPointerCancel={() => setDragged(false)}
            onPointerDown={(e) => {
              if (!card.current) return;
              (e.target as Element).setPointerCapture(e.pointerId);
              const offset = new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(card.current.translation() as THREE.Vector3));
              offset.z = 0;
              setDragged(offset);
            }}
          >
            {/* Soft drop shadow (not pickable) */}
            <mesh
              geometry={shadowGeometry}
              position={[0, -0.12, -0.05]}
              raycast={() => null}
              renderOrder={-1}
            >
              <meshBasicMaterial
                map={textures.shadowTexture}
                transparent
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh geometry={bodyGeometry}>
              <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh geometry={planeGeometry} position={[0, 0, CARD_DEPTH / 2 + 0.0005]}>
              <meshBasicMaterial
                map={textures.frontTexture}
                transparent
                alphaTest={0.5}
                toneMapped={false}
              />
            </mesh>
            <mesh
              geometry={planeGeometry}
              position={[0, 0, -CARD_DEPTH / 2 - 0.0005]}
              rotation={[0, Math.PI, 0]}
            >
              <meshBasicMaterial
                map={textures.backTexture}
                transparent
                alphaTest={0.5}
                toneMapped={false}
              />
            </mesh>
            {/* Strap end, gray clip and metal ring the strap hangs from */}
            <mesh position={[0, CARD_HEIGHT / 2 + 0.144, 0.03]}>
              <boxGeometry args={[0.12, 0.05, 0.02]} />
              <meshBasicMaterial color="#1c1c1c" toneMapped={false} />
            </mesh>
            <mesh position={[0, CARD_HEIGHT / 2 + 0.0375, 0.03]}>
              <boxGeometry args={[0.25, 0.075, 0.02]} />
              <meshBasicMaterial color="#86868b" toneMapped={false} />
            </mesh>
            <mesh position={[0, CARD_ANCHOR_Y, 0.05]}>
              <torusGeometry args={[0.032, 0.009, 12, 28]} />
              <meshBasicMaterial color="#c4c4c9" toneMapped={false} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={strap} geometry={strapGeometry} frustumCulled={false}>
        <meshBasicMaterial map={textures.strapTexture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </>
  );
}

export interface LanyardSceneProps {
  content: CardContent;
  /** When false the render loop and physics are paused (offscreen / hidden tab). */
  active: boolean;
  onReady: () => void;
  onFail: () => void;
}

export default function LanyardScene({ content, active, onReady, onFail }: LanyardSceneProps) {
  return (
    <Canvas
      orthographic
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.style.touchAction = 'pan-y';
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <CameraRig />
      <ambientLight intensity={Math.PI * 0.9} />
      <directionalLight position={[-2, 4, 6]} intensity={Math.PI * 1.1} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Band content={content} onReady={onReady} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
