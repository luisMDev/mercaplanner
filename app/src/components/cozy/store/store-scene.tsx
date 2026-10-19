"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { TextureLoader, type Group } from "three";
import parkDepthMap from "@/assets/fondo-profundidad.webp";
import fondo from "@/assets/fondo.webp";
import depthMap from "@/assets/tienda-profundidad.webp";
import tienda from "@/assets/tienda.webp";
import { PARK_CENTER, PARK_HEIGHT, STORE_CENTER, STORE_SCALE } from "./layout";
import { FallingLeaves } from "./falling-leaves";
import { reliefMaterial } from "./relief-material";
import { usePointerX } from "./use-pointer-x";

const ASPECT = tienda.width / tienda.height;
// How far the light parts of each depth map come forward, in plane heights
const RELIEF = 0.26;
const PARK_RELIEF = 0.55;
// How fast the scene catches up with the mouse, per frame (slow and calm)
const EASE = 0.02;
// Largest turn following the mouse left and right, in radians (about 12°).
// Only sideways: moving the mouse up and down does not tilt it
const TILT = 0.21;
const FOV = 25;
// The canvas is this much taller than the frame (12% over and under it,
// store-illustration.tsx), so the store reaching over the frame and the
// tilted corners are not cut; the planes shrink back to the frame's scale
const OVERFLOW = 1.24;
// Centre of the store, from the middle of a frame one unit high
const STORE_Y = STORE_CENTER - 0.5;
// Distance at which a plane one unit high fills the canvas height
const DISTANCE = 0.5 / Math.tan(((FOV / 2) * Math.PI) / 180);
// The park behind the store: this far back, so turning the scene slides it
// the other way (parallax). Sized and placed to look, from the camera, like
// the flat park (layout.ts): a bit taller than the store, a little above it
const BG_DEPTH = 0.6;
const BG_FAR = (DISTANCE + BG_DEPTH) / DISTANCE;

type SceneProps = { onReady: () => void };

function Scene({ onReady }: SceneProps) {
  const [map, depth, park, parkDepth] = useLoader(TextureLoader, [
    tienda.src,
    depthMap.src,
    fondo.src,
    parkDepthMap.src,
  ]);
  const material = useMemo(() => reliefMaterial(map, depth, RELIEF), [map, depth]);
  const parkMaterial = useMemo(() => reliefMaterial(park, parkDepth, PARK_RELIEF), [park, parkDepth]);
  const group = useRef<Group>(null);
  const pointerX = usePointerX();

  useEffect(onReady, [onReady]);
  useEffect(
    () => () => {
      material.dispose();
      parkMaterial.dispose();
    },
    [material, parkMaterial],
  );

  // The store and the park turn together around the store, easing towards
  // the mouse
  useFrame(() => {
    const g = group.current;
    if (g) g.rotation.y += (pointerX.current * TILT - g.rotation.y) * EASE;
  });

  return (
    <group ref={group}>
      <mesh
        material={parkMaterial}
        position={[0, ((PARK_CENTER - 0.5) * BG_FAR) / OVERFLOW, -BG_DEPTH]}
        scale={(PARK_HEIGHT * BG_FAR) / OVERFLOW}
      >
        <planeGeometry args={[fondo.width / fondo.height, 1, 96, 72]} />
      </mesh>
      <mesh material={material} position={[0, STORE_Y / OVERFLOW, 0]} scale={STORE_SCALE / OVERFLOW}>
        <planeGeometry args={[ASPECT, 1, 112, 140]} />
      </mesh>
      <FallingLeaves />
    </group>
  );
}

// The store drawing on a plane with relief from its depth map, in front of the
// park, further back and with its own relief, and leaves falling over both,
// all turning with the mouse. Loaded on its own (three.js is
// heavy), only where it is used
export default function StoreScene(props: SceneProps) {
  return (
    <Canvas
      // linear and flat: the drawing's colours untouched, no tone mapping
      linear
      flat
      dpr={[1, 1.5]}
      // Its own size, not the scaled one (store-illustration.tsx), and not
      // measured again on every scroll
      resize={{ offsetSize: true, scroll: false }}
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
