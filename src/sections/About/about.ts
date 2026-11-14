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

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float t = uTime * 0.045;

  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Organic movement and flowing distortion
  vec2 warp = vec2(
    fbm(p * 2.0 + vec2(t, -t * 0.6)),
    fbm(p * 2.0 + vec2(4.0, t * 0.5))
  );

  vec2 flow = p + (warp - 0.5) * 1.8;

  // Multiple flowing layers
  float layer1 = fbm(flow * 3.0 + t * 0.35);
  float layer2 = fbm(flow * 4.5 - t * 0.25 + 3.0);
  float layer3 = fbm(flow * 2.0 + 7.0);

  // Broad colour transitions
  float glow1 = smoothstep(0.25, 0.85, layer1);
  float glow2 = smoothstep(0.35, 0.88, layer2);
  float glow3 = smoothstep(0.30, 0.90, layer3);

  // Fiestron colour palette
  vec3 cyberBlack = vec3(0.024, 0.016, 0.039);
  vec3 midnight = vec3(0.047, 0.027, 0.078);
  vec3 deepPlum = vec3(0.071, 0.035, 0.122);

  vec3 darkViolet = vec3(0.478, 0.184, 0.839);
  vec3 electricViolet = vec3(0.569, 0.278, 1.000);
  vec3 primaryViolet = vec3(0.686, 0.412, 1.000);
  vec3 lavender = vec3(0.851, 0.722, 1.000);

  // Base atmosphere
  vec3 color = mix(cyberBlack, midnight, glow3 * 0.65);

  // Large visible liquid-like colour regions
  color = mix(color, deepPlum, glow1 * 0.85);
  color += darkViolet * glow1 * 0.32;
  color += electricViolet * glow2 * 0.38;
  color += primaryViolet * glow3 * 0.20;

  // Flowing glass-like folds
  float folds = sin(
    flow.x * 7.0 +
    flow.y * 5.0 +
    layer1 * 5.0
  );

  float shine = pow(max(0.0, folds), 9.0);

  color += primaryViolet * shine * 0.22;

  // Secondary glossy highlights
  float secondaryShine = pow(
    max(
      0.0,
      sin(flow.y * 9.0 - flow.x * 4.0 + layer2 * 4.0)
    ),
    12.0
  );

  color += lavender * secondaryShine * 0.18;

  // Soft illuminated edges
  float edgeGlow = smoothstep(0.0, 0.8, length(p));

  color += darkViolet * edgeGlow * 0.12;

  // Subtle depth and vignette
  float vignette = 1.0 - 0.22 * dot(p, p);

  color *= clamp(vignette, 0.65, 1.0);

  // Fine atmospheric grain
  float grain = hash21(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;

  color += grain * 0.008;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function initAbout(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const context = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "default",
  });

  if (!context) {
    console.error("Unable to initialize WebGL.");
    return;
  }

  const gl: WebGLRenderingContext = context;

  let animationFrame = 0;
  let startTime = performance.now();
  let disposed = false;
  let paused = document.hidden;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Compile a shader and report errors if compilation fails.
  function createShader(
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);

    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader error:", gl.getShaderInfoLog(shader));
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

  // Link both shaders into one WebGL program.
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
    console.error("Program error:", gl.getProgramInfoLog(program));

    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return;
  }

  gl.useProgram(program);

  // Fullscreen quad
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

  if (position === -1) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return;
  }

  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, "uTime");
  const resolutionLocation = gl.getUniformLocation(program, "uResolution");

  if (timeLocation === null || resolutionLocation === null) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return;
  }

  // Match the canvas resolution to the About section.
  function resize() {
    if (disposed) return;

    const rect = section.getBoundingClientRect();

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    const width = Math.max(1, Math.floor(rect.width * pixelRatio));
    const height = Math.max(1, Math.floor(rect.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, width, height);

    gl.useProgram(program);
    gl.uniform2f(resolutionLocation, width, height);

    if (reducedMotion.matches) {
      render(0);
    }
  }

  // Draw the background.
  function render(now: number) {
    if (disposed || gl.isContextLost()) return;

    const elapsed = reducedMotion.matches
      ? 0
      : (now - startTime) / 1000;

    gl.useProgram(program);
    gl.uniform1f(timeLocation, elapsed);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Keep the liquid shapes moving smoothly.
  function animate(now: number) {
    if (disposed || paused || reducedMotion.matches) return;

    render(now);

    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    cancelAnimationFrame(animationFrame);

    if (disposed || paused) return;

    if (reducedMotion.matches) {
      render(0);
      return;
    }

    startTime = performance.now();
    animationFrame = requestAnimationFrame(animate);
  }

  // Pause the animation when the tab is not visible.
  function handleVisibility() {
    paused = document.hidden;

    if (paused) {
      cancelAnimationFrame(animationFrame);
    } else {
      startAnimation();
    }
  }

  function handleMotionChange() {
    cancelAnimationFrame(animationFrame);
    startAnimation();
  }

  const observer = new ResizeObserver(resize);

  observer.observe(section);

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", handleVisibility);
  reducedMotion.addEventListener("change", handleMotionChange);

  resize();
  startAnimation();

  // Release WebGL resources when About unmounts.
  return () => {
    disposed = true;

    cancelAnimationFrame(animationFrame);
    observer.disconnect();

    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibility);
    reducedMotion.removeEventListener("change", handleMotionChange);

    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
}