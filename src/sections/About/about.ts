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
    speed: number;
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

    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    stars = [];

    const count = Math.floor((width * height) / 12000);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.15 + 0.05,
      });
    }
  }

  // STAR ANIMATION

  function animate() {
    if (disposed) return;

    ctx!.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.y -= star.speed;

      if (star.y < 0) {
        star.y = height;
      }

      ctx!.beginPath();

      ctx!.arc(
        star.x,
        star.y,
        star.size,
        0,
        Math.PI * 2
      );

      ctx!.fillStyle = `rgba(255, 139, 194, ${star.alpha})`;
      ctx!.fill();
    }

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