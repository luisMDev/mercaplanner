import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, LinearSRGBColorSpace, Object3D, Shape, ShapeGeometry, type InstancedMesh } from "three";

const COUNT = 34;
// Leaf colours, from fresh green to the first yellows of autumn (sRGB, kept
// as is: the canvas does no colour conversion)
const COLORS = ["#8fbf5c", "#6f9a45", "#a9c95f", "#5f8a3c", "#c9c35a", "#d8b04a"];
// Where leaves fall, in the scene's units (the frame is about one unit high)
const TOP = 0.62;
const BOTTOM = -0.62;
const WIDTH = 1.5;

// Same numbers on every load, without calling Math.random while rendering
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A leaf: pointed at both ends, a little fuller near the stalk
function leafShape() {
  const s = new Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(0.38, -0.28, 0.3, 0.28, 0, 0.5);
  s.bezierCurveTo(-0.3, 0.28, -0.38, -0.28, 0, -0.5);
  return s;
}

type Leaf = {
  x: number;
  y: number;
  z: number;
  size: number;
  fall: number;
  sway: number;
  phase: number;
  rot: [number, number, number];
  spin: [number, number, number];
};

function makeLeaves(): Leaf[] {
  const rand = seeded(7);
  return Array.from({ length: COUNT }, (_, i) => ({
    x: (rand() - 0.5) * WIDTH,
    y: BOTTOM + rand() * (TOP - BOTTOM),
    // A few fall between the park and the store, most in front of the store
    z: i % 5 === 0 ? -0.25 - rand() * 0.2 : 0.05 + rand() * 0.4,
    size: 0.03 + rand() * 0.026,
    fall: 0.035 + rand() * 0.035,
    sway: 0.6 + rand() * 0.9,
    phase: rand() * Math.PI * 2,
    rot: [rand() * 6, rand() * 6, rand() * 6],
    spin: [(rand() - 0.5) * 2.4, (rand() - 0.5) * 2.4, (rand() - 0.5) * 1.6],
  }));
}

// Leaves falling over the store, turning and swaying as the wind carries
// them. They live in the scene's group, so they tilt with it
export function FallingLeaves() {
  const mesh = useRef<InstancedMesh>(null);
  const leaves = useMemo(() => makeLeaves(), []);
  const geometry = useMemo(() => new ShapeGeometry(leafShape()), []);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const color = new Color();
    leaves.forEach((_, i) => {
      const hex = COLORS[i % COLORS.length];
      const [r, g, b] = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255);
      m.setColorAt(i, color.setRGB(r, g, b, LinearSRGBColorSpace));
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    return () => geometry.dispose();
  }, [leaves, geometry]);

  useFrame(({ clock }, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    // A soft breeze to the right, with slow gusts
    const wind = 0.03 + Math.sin(t * 0.35) * 0.025 + Math.sin(t * 0.13 + 1) * 0.015;
    leaves.forEach((l, i) => {
      l.y -= l.fall * dt;
      l.x += (wind + Math.sin(t * l.sway + l.phase) * 0.05) * dt;
      l.rot[0] += l.spin[0] * dt;
      l.rot[1] += l.spin[1] * dt;
      l.rot[2] += l.spin[2] * dt;
      // Back to the top once fallen, and round the sides with the wind
      if (l.y < BOTTOM) l.y = TOP;
      if (l.x > WIDTH / 2) l.x -= WIDTH;
      dummy.position.set(l.x + Math.sin(t * l.sway * 1.7 + l.phase) * 0.02, l.y, l.z);
      dummy.rotation.set(l.rot[0], l.rot[1], l.rot[2]);
      dummy.scale.setScalar(l.size);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]}>
      <meshBasicMaterial side={DoubleSide} transparent opacity={0.92} depthWrite={false} />
    </instancedMesh>
  );
}
