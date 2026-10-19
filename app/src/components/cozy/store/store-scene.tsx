"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { TextureLoader, type Group } from "three";
import fondo from "@/assets/fondo.webp";
import depthMap from "@/assets/tienda-profundidad.webp";
import tienda from "@/assets/tienda.webp";
import { PARK_HEIGHT, STORE_CENTER, STORE_SCALE } from "./layout";
import { reliefMaterial } from "./relief-material";
import { usePointerX } from "./use-pointer-x";

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
// Centre of the store, from the middle of a frame one unit high
const STORE_Y = STORE_CENTER - 0.5;
// Distance at which a plane one unit high fills the canvas height
const DISTANCE = 0.5 / Math.tan(((FOV / 2) * Math.PI) / 180);
// The park behind the store: this far back, so turning the scene slides it
// the other way (parallax). Sized and placed to look, from the camera, like
// the flat park (layout.ts): a bit taller than the store and centred on it
const BG_DEPTH = 0.9;
const BG_FAR = (DISTANCE + BG_DEPTH) / DISTANCE;

type SceneProps = {
  // The park behind the store; off where the page has it as a backdrop
  park: boolean;
  onReady: () => void;
};

function Scene({ park: showPark, onReady }: SceneProps) {
  const [map, depth, park] = useLoader(TextureLoader, [tienda.src, depthMap.src, fondo.src]);
  const material = useMemo(() => reliefMaterial(map, depth, RELIEF), [map, depth]);
  const group = useRef<Group>(null);
  const pointerX = usePointerX();

  useEffect(onReady, [onReady]);
  useEffect(() => () => material.dispose(), [material]);

  // The store and the park turn together around the store, easing towards
  // the mouse, with a slow breathing float on top
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += (pointerX.current * TILT - g.rotation.y) * 0.06;
    g.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.006;
  });

  return (
    <group ref={group}>
      {showPark && (
        <mesh position={[0, (STORE_Y * BG_FAR) / OVERFLOW, -BG_DEPTH]} scale={(PARK_HEIGHT * BG_FAR) / OVERFLOW}>
          <planeGeometry args={[fondo.width / fondo.height, 1]} />
          <meshBasicMaterial map={park} transparent depthWrite={false} />
        </mesh>
      )}
      <mesh material={material} position={[0, STORE_Y / OVERFLOW, 0]} scale={STORE_SCALE / OVERFLOW}>
        <planeGeometry args={[ASPECT, 1, 112, 140]} />
      </mesh>
    </group>
  );
}

// The store drawing on a plane with relief from its depth map, in front of a
// park further back, turning with the mouse. Loaded on its own (three.js is
// heavy), only where it is used
export default function StoreScene(props: SceneProps) {
  return (
    <Canvas
      // linear and flat: the drawing's colours untouched, no tone mapping
      linear
      flat
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: FOV, position: [0, 0, DISTANCE] }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
