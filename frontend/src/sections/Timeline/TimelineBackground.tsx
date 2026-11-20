import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;

// Fiestron palette (brand hex values converted to 0..1)
const vec3 cyberBlack = vec3(0.024, 0.016, 0.039); // #06040A
const vec3 deepPlum   = vec3(0.071, 0.035, 0.122); // #12091F
const vec3 darkViolet = vec3(0.478, 0.184, 0.839); // #7A2FD6
const vec3 primary    = vec3(0.686, 0.412, 1.000); // #AF69FF
const vec3 lavender   = vec3(0.851, 0.722, 1.000); // #D9B8FF

float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(1.6, 1.2, -1.2, 1.6);

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = rotation * p;
    amplitude *= 0.5;
  }

  return value;
}

float ridges(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float weight = 1.0;
  mat2 rotation = mat2(1.6, 1.2, -1.2, 1.6);

  for (int i = 0; i < 4; i++) {
    float n = noise(p);
    float ridge = 1.0 - abs(2.0 * n - 1.0);
    ridge *= ridge;

    value += amplitude * ridge * (0.35 + 0.65 * weight);

    weight = ridge;
    p = rotation * p;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  // Maintain the pattern across tall and wide sections
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float t = uTime * 0.035;

  vec2 normalizedCoord =
    gl_FragCoord.xy / min(uResolution.x, uResolution.y);

  vec2 p = (normalizedCoord - 0.5) * 3.0;

  vec2 q = vec2(
    fbm(p * 0.55 + t * vec2(0.7, 0.45)),
    fbm(p * 0.55 + vec2(4.7, 2.3) - t * vec2(0.4, 0.65))
  );

  vec2 warped = p + 3.4 * (q - 0.5);

  float field = ridges(
    warped + t * vec2(0.12, -0.08)
  );

  float breath = 0.5 + 0.5 * sin(uTime * 0.3);

  float body = smoothstep(0.18, 0.48, field);

  float crest = smoothstep(0.42, 0.68, field);
  crest *= crest;

  // Start from the section's own cyber black and lift gently to deep plum
  vec3 color = cyberBlack;
  color += (deepPlum - cyberBlack) * body;

  // Violet body of the ridges. Blue stays the dominant channel,
  // which is what keeps this violet instead of drifting toward pink.
  color += darkViolet * crest * (0.16 + 0.04 * breath);

  // Brighter violet and white-lavender only on the very crests
  color += primary * crest * crest * 0.07;
  color += lavender * pow(crest, 4.0) * 0.05;

  // Hue-preserving soft limit: scale all channels together
  // (a per-channel curve would squash blue and push the hue toward pink).
  float peak = max(color.r, max(color.g, color.b));
  float limited = 0.6 * (1.0 - exp(-peak / 0.6));
  color *= limited / max(peak, 0.0001);

  // Soft vignette
  vec2 vignette = (vUv - 0.5) * vec2(aspect, 1.0);

  color *= 1.0 - 0.25 * dot(vignette, vignette);

  // Subtle animated grain
  float grain = hash21(
    gl_FragCoord.xy + fract(uTime * 0.31) * 149.0
  ) - 0.5;

  color += grain * (1.5 / 255.0);

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

export default function TimelineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const canvas: HTMLCanvasElement = canvasElement;

    const context = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!context) {
      console.error("WebGL is not supported.");
      return;
    }

    const gl: WebGLRenderingContext = context;

    function createShader(
      type: number,
      source: string
    ): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertex = createShader(gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();

    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");

    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "uTime");
    const resolutionLocation = gl.getUniformLocation(
      program,
      "uResolution"
    );

    let animationFrame = 0;
    let startTime = performance.now();
    let paused = document.hidden;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function render(now: number) {
      if (paused) return;

      const elapsed = (now - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform1f(timeLocation, reducedMotion.matches ? 0 : elapsed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(render);
      }
    }

    function resize() {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        1.5
      );

      const width = Math.max(
        1,
        Math.floor(canvas.clientWidth * pixelRatio)
      );

      const height = Math.max(
        1,
        Math.floor(canvas.clientHeight * pixelRatio)
      );

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);

      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, width, height);

      if (reducedMotion.matches && !paused) {
        render(performance.now());
      }
    }

    function startAnimation() {
      cancelAnimationFrame(animationFrame);

      if (paused) return;

      if (reducedMotion.matches) {
        render(performance.now());
      } else {
        startTime = performance.now();
        animationFrame = requestAnimationFrame(render);
      }
    }

    function handleVisibility() {
      paused = document.hidden;

      if (paused) {
        cancelAnimationFrame(animationFrame);
      } else {
        startAnimation();
      }
    }

    function handleMotionChange() {
      startAnimation();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const section = canvas.closest(".timeline-section");

    if (section) {
      observer.observe(section);
    }

    resize();
    startAnimation();

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    reducedMotion.addEventListener(
      "change",
      handleMotionChange
    );

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      reducedMotion.removeEventListener(
        "change",
        handleMotionChange
      );

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}