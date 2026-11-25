import { useEffect, useRef } from "react";

// Fraction of CSS pixels the shader renders at. The background is soft and
// low-frequency, so 0.75 is visually near-identical but ~44% cheaper than 1.0.
// Raise to 1 for a sharper result.
const RENDER_SCALE = 0.75;

const vertexShader = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;   // viewport canvas size in backing pixels
uniform float uOffsetY;     // backing px from the wrapper's bottom edge to this canvas's bottom edge
uniform float uTotalH;      // full wrapper height in backing pixels

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
  float t = uTime * 0.035;

  // Position of this pixel within the full (tall) wrapper, so the pattern
  // scrolls with the page exactly like the old full-height canvas did.
  vec2 frag = vec2(gl_FragCoord.x, gl_FragCoord.y + uOffsetY);

  vec2 normalizedCoord = frag / uResolution.x;

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

  // Same vignette as before, computed over the whole wrapper
  vec2 vignette = vec2(
    (frag.x / uResolution.x - 0.5) * (uResolution.x / uTotalH),
    frag.y / uTotalH - 0.5
  );

  color *= 1.0 - 0.25 * dot(vignette, vignette);

  float grain = hash21(
    gl_FragCoord.xy + fract(uTime * 0.31) * 149.0
  ) - 0.5;

  color += grain * (1.5 / 255.0);

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

export default function NebulaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const containerEl: HTMLDivElement = container;
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
    const offsetLocation = context.getUniformLocation(program, "uOffsetY");
    const totalLocation = context.getUniformLocation(program, "uTotalH");

    const startTime = performance.now();
    let animationFrame = 0;
    let inView = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Where this viewport-sized canvas sits inside the tall wrapper
    function updateLayoutUniforms() {
      const wrapperRect = containerEl.getBoundingClientRect();
      const canvasRect = canvasEl.getBoundingClientRect();

      const scale = canvasEl.width / Math.max(1, canvasRect.width);

      const canvasBottomFromWrapperTop =
        canvasRect.top - wrapperRect.top + canvasRect.height;

      const offsetY =
        (wrapperRect.height - canvasBottomFromWrapperTop) * scale;

      context.uniform1f(offsetLocation, offsetY);
      context.uniform1f(totalLocation, Math.max(1, wrapperRect.height * scale));
    }

    function draw(now: number) {
      const elapsed = (now - startTime) / 1000;

      updateLayoutUniforms();

      context.uniform1f(timeLocation, reducedMotion.matches ? 0 : elapsed);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now: number) {
      draw(now);
      animationFrame = requestAnimationFrame(frame);
    }

    // Single place that decides whether we should be rendering
    function sync() {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      if (!inView || document.hidden) return;

      if (reducedMotion.matches) {
        draw(performance.now());
      } else {
        animationFrame = requestAnimationFrame(frame);
      }
    }

    function resize() {
      const width = Math.max(
        1,
        Math.floor(canvasEl.clientWidth * RENDER_SCALE)
      );

      const height = Math.max(
        1,
        Math.floor(canvasEl.clientHeight * RENDER_SCALE)
      );

      if (canvasEl.width !== width || canvasEl.height !== height) {
        canvasEl.width = width;
        canvasEl.height = height;
      }

      context.viewport(0, 0, width, height);
      context.uniform2f(resolutionLocation, width, height);

      if (reducedMotion.matches && inView && !document.hidden) {
        draw(performance.now());
      }
    }

    // Static frame must still follow the scroll position in reduced-motion mode
    function handleScroll() {
      if (reducedMotion.matches && inView && !document.hidden) {
        draw(performance.now());
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvasEl);

    // Stop rendering entirely while the section is off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "100px 0px" }
    );
    intersectionObserver.observe(containerEl);

    function handleVisibility() {
      sync();
    }

    resize();
    sync();

    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", sync);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("scroll", handleScroll);

            context.deleteBuffer(buffer);
          context.deleteProgram(program);
          context.deleteShader(vertex);
          context.deleteShader(fragment);
        };
      }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  );
}