import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Colours used throughout the Fiestron tunnel
const COLORS = {
  background: "#01040A",
  darkPlum: "#0C0810",
  burgundy: "#59153C",
  wineMagenta: "#98286E",
  neonPink: "#E4369A",
};

// Convert hex colours to linear RGB for accurate shader rendering
function displayColor(hex: string): THREE.Color {
  return new THREE.Color().setStyle(
    hex,
    THREE.LinearSRGBColorSpace
  );
}

// Vertex shader
const vertexShader = /* glsl */ `
varying vec2 vUv;
varying float vDepth;

void main() {
  vUv = uv;

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;

  gl_Position = projectionMatrix * mv;
}
`;

// Fragment shader
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uRings;

uniform vec3 uA;
uniform vec3 uBase;
uniform vec3 uFog;

varying vec2 vUv;
varying float vDepth;

void main() {

  // Animated neon rings
  float rings = fract(vUv.x * uRings - uTime * 1.6);
  float line = smoothstep(0.94, 1.0, rings);

  // Longitudinal tunnel ribs
  float ribs = smoothstep(0.92, 1.0, fract(vUv.y * 24.0));

  // Travelling light pulse
  float pulse = 1.0 - smoothstep(
    0.0,
    0.15,
    fract(vUv.x * 12.0 - uTime * 0.28)
  );

  // Tunnel illumination
  float illumination =
    0.5 + 0.5 * sin(vUv.y * 6.2832);

  // Base tunnel colour
  vec3 color = mix(
    uFog,
    uBase,
    0.38 + illumination * 0.62
  );

  // Bright neon pink rings
  color += uA * line * (0.55 + pulse * 1.6);

  // Additional ring glow
  color += uA * line * 0.12;

  // Burgundy tunnel ribs
  color += uBase * ribs * 0.35;

  // Distance fog
  float fog = smoothstep(4.0, 38.0, vDepth);

  color = mix(color, uFog, fog);

  gl_FragColor = vec4(color, 1.0);
}
`;

function TunnelScene({
  deceleration,
}: {
  deceleration: boolean;
}) {
  const { camera, size, pointer } = useThree();

  // Responsive camera
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov =
        size.width < 480
          ? 88
          : size.width < 768
          ? 80
          : 70;

      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);

  // Create curved tunnel path
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

  // Create tunnel geometry
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 900, 3.4, 42, true),
    [curve]
  );

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },

      uRings: {
        value: Math.round(curve.getLength() / 2.2),
      },

      // Neon pink
      uA: {
        value: displayColor(COLORS.neonPink),
      },

      // Tunnel base
      uBase: {
        value: displayColor(COLORS.burgundy),
      },

      // Background fog
      uFog: {
        value: displayColor(COLORS.background),
      },
    }),
    [curve]
  );

  // Shader material
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

  // Dispose material
  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  // Camera movement state
  const state = useMemo(
    () => ({
      progress: 0,
      tilt: new THREE.Vector2(),
      position: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
      motionSpeed: 1,
    }),
    []
  );

  // Animate tunnel
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Gradually decelerate
    const targetSpeed = deceleration ? 0.18 : 1;

    state.motionSpeed = THREE.MathUtils.damp(
      state.motionSpeed,
      targetSpeed,
      1.15,
      dt
    );

    // Move shader rings
    uniforms.uTime.value += dt * state.motionSpeed;

    // Move camera through tunnel
    state.progress =
      (state.progress + dt * 0.018 * state.motionSpeed) % 1;

    curve.getPointAt(
      state.progress,
      state.position
    );

    curve.getPointAt(
      (state.progress + 0.01) % 1,
      state.ahead
    );

    camera.position.copy(state.position);
    camera.lookAt(state.ahead);

    // Mouse / pointer interaction
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

// Main tunnel component
export default function Tunnel({
  deceleration = false,
}: {
  deceleration?: boolean;
}) {
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
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
      >
        <TunnelScene deceleration={deceleration} />
      </Canvas>
    </div>
  );
}