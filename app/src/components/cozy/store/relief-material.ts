import { ShaderMaterial, type Texture } from "three";

// Pushes each vertex of a flat plane towards the camera by the depth map
// (light is near), so the drawing gets relief when the plane tilts
const vertexShader = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float depth = texture2D(uDepth, uv).r;
    vec3 p = position;
    p.z += (depth - 0.5) * uStrength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// The drawing as is; the transparent background is dropped
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(uMap, vUv);
    if (color.a < 0.02) discard;
    gl_FragColor = color;
  }
`;

export function reliefMaterial(map: Texture, depth: Texture, strength: number) {
  return new ShaderMaterial({
    uniforms: { uMap: { value: map }, uDepth: { value: depth }, uStrength: { value: strength } },
    vertexShader,
    fragmentShader,
    transparent: true,
  });
}
