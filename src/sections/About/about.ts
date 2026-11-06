export function initAbout(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let disposed = false;

  type Star = {
    x: number;
    y: number;
    size: number;
    alpha: number;
    baseAlpha: number;
    speed: number;
    drift: number;
    phase: number;
    twinkleSpeed: number;
  };

  let stars: Star[] = [];

  // RESIZE CANVAS

  function resize() {
    const rect = section.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);

    ctx!.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    stars = [];

    const count = Math.floor((width * height) / 5500);

    for (let i = 0; i < count; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.3;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,

        size: Math.random() * 1.8 + 0.9,

        alpha: baseAlpha,
        baseAlpha,

        speed: Math.random() * 0.8 + 0.5,
        drift: Math.random() * 0.8 - 0.4,

        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
      });
    }
  }

  // CONTINUOUS STAR ANIMATION

  function animate() {
    if (disposed) return;

    ctx!.clearRect(0, 0, width, height);

    for (const star of stars) {

      // FLOAT UPWARDS

      star.y -= star.speed;

      // SIDEWAYS DRIFT

      star.phase += star.twinkleSpeed;

      star.x += star.drift + Math.sin(star.phase) * 0.15;

      // LOOP BACK WHEN OUT OF BOUNDS

      if (star.y < -5) {
        star.y = height + 5;
        star.x = Math.random() * width;
      }

      if (star.x < -5) {
        star.x = width + 5;
      }

      if (star.x > width + 5) {
        star.x = -5;
      }

      // TWINKLING

      star.alpha =
        star.baseAlpha *
        (0.35 + (Math.sin(star.phase) + 1) * 0.325);

      // DRAW PARTICLE

      ctx!.beginPath();

      ctx!.arc(
        star.x,
        star.y,
        star.size,
        0,
        Math.PI * 2
      );

      ctx!.fillStyle = `rgba(255, 139, 194, ${star.alpha})`;

      ctx!.shadowBlur = star.size > 2 ? 10 : 5;
      ctx!.shadowColor = "#FF2E93";

      ctx!.fill();
    }

    ctx!.shadowBlur = 0;

    animationFrame = requestAnimationFrame(animate);
  }

  // INITIALIZATION

  resize();
  animate();

  window.addEventListener("resize", resize);

  // CLEANUP

  return () => {
    disposed = true;

    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
  };
}