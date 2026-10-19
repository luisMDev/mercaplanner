"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { TextureLoader, type Mesh } from "three";
import depthMap from "@/assets/tienda-profundidad.webp";
import tienda from "@/assets/tienda.webp";
import { reliefMaterial } from "./relief-material";

const ASPECT = tienda.width / tienda.height;
// How far the light parts of the depth map come forward, in plane heights
const RELIEF = 0.16;
// Largest turn following the mouse left and right, in radians (about 12°).
// Only sideways: moving the mouse up and down does not tilt it
const TILT = 0.21;
const FOV = 25;
// The canvas overflows the drawing by this much (store-illustration.tsx), so
// the tilted corners are not cut; the plane shrinks back to the drawing's size
const OVERFLOW = 1.08;

// Horizontal mouse position across the whole window, from -1 to 1
function usePointerX() {
  const pointer = useRef(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function ReliefPlane({ onReady }: { onReady: () => void }) {
  const [map, depth] = useLoader(TextureLoader, [tienda.src, depthMap.src]);
  const material = useMemo(() => reliefMaterial(map, depth, RELIEF), [map, depth]);
  const mesh = useRef<Mesh>(null);
  const pointerX = usePointerX();

  useEffect(onReady, [onReady]);
  useEffect(() => () => material.dispose(), [material]);

  // Eases towards the mouse, with a slow breathing float on top
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += (pointerX.current * TILT - m.rotation.y) * 0.06;
    m.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.006;
  });

  return (
    <mesh ref={mesh} material={material} scale={1 / OVERFLOW}>
      <planeGeometry args={[ASPECT, 1, 112, 140]} />
    </mesh>
  );
}

// The store drawing on a plane with relief from its depth map, tilting with
// the mouse. Loaded on its own (three.js is heavy), only where it is used
export default function StoreScene({ onReady }: { onReady: () => void }) {
  // Distance at which a plane one unit high fills the canvas height
  const distance = 0.5 / Math.tan(((FOV / 2) * Math.PI) / 180);
  return (
    <Canvas
      // linear and flat: the drawing's colours untouched, no tone mapping
      linear
      flat
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: FOV, position: [0, 0, distance] }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ReliefPlane onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
