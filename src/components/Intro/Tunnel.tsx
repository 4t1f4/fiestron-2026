import { useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Colours used throughout the Fiestron tunnel
const COLORS = {
  background: "#01040A",
  darkPlum: "#0C0810",
  burgundy: "#59153C",
  wineMagenta: "#98286E",
  neonPink: "#E4369A",
};

// Pass the tunnel's position and depth information to the fragment shader
const vertexShader = `
varying vec2 vUv;
varying float vDepth;

void main() {
  vUv = uv;

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;

  gl_Position = projectionMatrix * mv;
}
`;

// Creates the glowing rings, tunnel lighting and depth effect
const fragmentShader = `
uniform float uTime;
uniform float uRings;

uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uBase;
uniform vec3 uFog;

varying vec2 vUv;
varying float vDepth;

void main() {

  // Animate the rings so they appear to move through the tunnel
  float rings = fract(vUv.x * uRings - uTime * 1.6);
  float line = smoothstep(0.94, 1.0, rings);

  // Add subtle lines running along the tunnel
  float ribs = smoothstep(0.92, 1.0, fract(vUv.y * 24.0));

  // Create a moving pulse of light between the rings
  float pulse = 1.0 - smoothstep(
    0.0,
    0.15,
    fract(vUv.x * 12.0 - uTime * 0.28)
  );

  // Blend the burgundy and plum shades to give the tunnel some depth
  float illumination =
    0.5 + 0.5 * sin(vUv.y * 6.2832);

  vec3 color = mix(
    uFog,
    uBase,
    0.38 + illumination * 0.62
  );

  // Add a soft wine-magenta glow to the tunnel walls
  color += uB * (0.08 + illumination * 0.16);

  // Make the moving circular rings stand out with neon pink
  color += uA * line * (0.55 + pulse * 1.6);

  // Give the rings a little extra glow
  color += uA * line * 0.12;

  // Add subtle magenta lighting along the tunnel
  color += uB * ribs * 0.35;

  // Fade the tunnel into darkness as it gets further away
  float fog = smoothstep(4.0, 38.0, vDepth);

  color = mix(color, uFog, fog);

  gl_FragColor = vec4(color, 1.0);
}
`;

// Handles the tunnel shape, lighting and camera movement
function TunnelScene() {

  // Build a curved path for the tunnel
  const curve = useMemo(() => {

    const points: THREE.Vector3[] = [];
    const segments = 16;

    for (let i = 0; i < segments; i++) {

      const angle = (i / segments) * Math.PI * 2;
      const radius = 80 + Math.sin(angle * 3) * 14;

      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 4) * 9,
          Math.sin(angle) * radius
        )
      );
    }

    return new THREE.CatmullRomCurve3(
      points,
      true,
      "catmullrom",
      0.5
    );

  }, []);

  // Turn the curved path into the actual tunnel
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 900, 3.4, 42, true),
    [curve]
  );

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  // Set up the values used to control the tunnel's shader effects
  const uniforms = useMemo(
    () => ({

      uTime: {
        value: 0,
      },

      uRings: {
        value: Math.round(curve.getLength() / 2.2),
      },

      // Main neon pink used for the glowing rings
      uA: {
        value: new THREE.Color(COLORS.neonPink),
      },

      // Wine-magenta shade used for the tunnel lighting
      uB: {
        value: new THREE.Color(COLORS.wineMagenta),
      },

      // Base colour of the tunnel walls
      uBase: {
        value: new THREE.Color(COLORS.burgundy),
      },

      // Dark shade used for the background and distance fade
      uFog: {
        value: new THREE.Color(COLORS.darkPlum),
      },

    }),
    [curve]
  );

  // Apply the custom shader to the tunnel
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader,
        fragmentShader,
        uniforms,
        toneMapped: false,
      }),
    [uniforms]
  );

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  // Keep track of the camera's position and movement
  const state = useMemo(
    () => ({
      progress: 0,
      tilt: new THREE.Vector2(),
      position: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
    }),
    []
  );

  // Update the tunnel and camera on every frame
  useFrame(({ camera, pointer }, delta) => {

    const dt = Math.min(delta, 0.05);

    // Keep the glowing rings moving
    uniforms.uTime.value += dt;

    // Slowly move the camera along the tunnel path
    state.progress =
      (state.progress + dt * 0.018) % 1;

    curve.getPointAt(
      state.progress,
      state.position
    );

    // Find a point slightly ahead so the camera knows where to look
    curve.getPointAt(
      (state.progress + 0.01) % 1,
      state.ahead
    );

    // Update the camera position and direction
    camera.position.copy(state.position);
    camera.lookAt(state.ahead);

    // Let the camera respond smoothly to mouse movement
    state.tilt.lerp(pointer, 0.05);

    camera.rotateZ(-state.tilt.x * 0.35);
    camera.rotateX(state.tilt.y * 0.15);

  });

  return (
    <mesh
      geometry={geometry}
      material={material}
    />
  );
}

// Displays the tunnel across the entire screen
export default function Tunnel() {

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background: COLORS.background,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 0],
          fov: 70,
          near: 0.1,
          far: 120,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "low-power",
        }}
      >
        <TunnelScene />
      </Canvas>
    </div>
  );
}