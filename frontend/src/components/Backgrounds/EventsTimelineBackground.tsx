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

const vec3 cyberBlack = vec3(0.024, 0.016, 0.039);
const vec3 deepPlum = vec3(0.071, 0.035, 0.122);
const vec3 darkViolet = vec3(0.478, 0.184, 0.839);
const vec3 primary = vec3(0.686, 0.412, 1.000);
const vec3 lavender = vec3(0.851, 0.722, 1.000);

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

  vec3 color = cyberBlack;
  color += (deepPlum - cyberBlack) * body;

  color += darkViolet * crest * (0.16 + 0.04 * breath);

  color += primary * crest * crest * 0.07;
  color += lavender * pow(crest, 4.0) * 0.05;

  float peak = max(color.r, max(color.g, color.b));
  float limited = 0.6 * (1.0 - exp(-peak / 0.6));
  color *= limited / max(peak, 0.0001);

  vec2 vignette = (vUv - 0.5) * vec2(aspect, 1.0);

  color *= 1.0 - 0.25 * dot(vignette, vignette);

  float grain = hash21(
    gl_FragCoord.xy + fract(uTime * 0.31) * 149.0
  ) - 0.5;

  color += grain * (1.5 / 255.0);

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

export default function EventsTimelineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasEl: HTMLCanvasElement = canvas;

    const gl = canvasEl.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      console.error("WebGL is not supported.");
      return;
    }

    const context: WebGLRenderingContext = gl;

    function createShader(
      type: number,
      source: string
    ): WebGLShader | null {
      const shader = context.createShader(type);

      if (!shader) return null;

      context.shaderSource(shader, source);
      context.compileShader(shader);

      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error(context.getShaderInfoLog(shader));
        context.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertex = createShader(context.VERTEX_SHADER, vertexShader);
    const fragment = createShader(context.FRAGMENT_SHADER, fragmentShader);

    if (!vertex || !fragment) {
      if (vertex) context.deleteShader(vertex);
      if (fragment) context.deleteShader(fragment);
      return;
    }

    const program = context.createProgram();

    if (!program) {
      context.deleteShader(vertex);
      context.deleteShader(fragment);
      return;
    }

    context.attachShader(program, vertex);
    context.attachShader(program, fragment);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      console.error(context.getProgramInfoLog(program));

      context.deleteProgram(program);
      context.deleteShader(vertex);
      context.deleteShader(fragment);

      return;
    }

    context.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = context.createBuffer();

    if (!buffer) {
      context.deleteProgram(program);
      context.deleteShader(vertex);
      context.deleteShader(fragment);
      return;
    }

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

    const position = context.getAttribLocation(program, "position");

    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    const timeLocation = context.getUniformLocation(program, "uTime");
    const resolutionLocation = context.getUniformLocation(
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

      context.useProgram(program);

      context.uniform1f(
        timeLocation,
        reducedMotion.matches ? 0 : elapsed
      );

      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);

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
        Math.floor(canvasEl.clientWidth * pixelRatio)
      );

      const height = Math.max(
        1,
        Math.floor(canvasEl.clientHeight * pixelRatio)
      );

      if (canvasEl.width !== width || canvasEl.height !== height) {
        canvasEl.width = width;
        canvasEl.height = height;
      }

      context.viewport(0, 0, width, height);

      context.useProgram(program);
      context.uniform2f(resolutionLocation, width, height);

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
    observer.observe(canvasEl);

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

      context.deleteBuffer(buffer);
      context.deleteProgram(program);
      context.deleteShader(vertex);
      context.deleteShader(fragment);
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