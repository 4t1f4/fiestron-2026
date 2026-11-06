export function initHero(
  hero: HTMLElement,
  canvas: HTMLCanvasElement,
  backgroundCanvas: HTMLCanvasElement,
  cursorLight: HTMLDivElement
) {
  const ctx = canvas.getContext("2d");
  const backgroundCtx = backgroundCanvas.getContext("2d");

  if (!ctx || !backgroundCtx) return;

  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");

  if (!offCtx) return;

  type Particle = {
    x: number;
    y: number;
    homeX: number;
    homeY: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  };

  type BackgroundDot = {
    x: number;
    y: number;
    homeX: number;
    homeY: number;
    vx: number;
    vy: number;
    radius: number;
  };

  let particles: Particle[] = [];
  let backgroundDots: BackgroundDot[] = [];

  let width = 0;
  let height = 0;

  let titleWidth = 0;
  let titleHeight = 0;

  let animationFrame = 0;
  let disposed = false;

  const pointer = {
    heroX: -1000,
    heroY: -1000,

    titleX: -1000,
    titleY: -1000,

    backgroundX: -1000,
    backgroundY: -1000,

    active: false,
  };

  const titleColors = [
    "#FF2E93",
    "#FF1744",
    "#F5F0F5",
    "#9D4EDD",
  ];

  // BACKGROUND PARTICLES

  function createBackgroundParticles() {
    const rect = backgroundCanvas.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    backgroundCanvas.width = Math.floor(width * pixelRatio);
    backgroundCanvas.height = Math.floor(height * pixelRatio);

    backgroundCtx!.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    backgroundDots = [];

    const spacing = width < 600 ? 25 : 32;

    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        backgroundDots.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 0.8 + 0.7,
        });
      }
    }
  }

  // FIESTRON PARTICLE TYPOGRAPHY

  function createTitleParticles() {
    const rect = canvas.getBoundingClientRect();

    titleWidth = rect.width;
    titleHeight = rect.height;

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.floor(titleWidth * pixelRatio);
    canvas.height = Math.floor(titleHeight * pixelRatio);

    ctx!.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    offscreen.width = Math.max(1, Math.floor(titleWidth));
    offscreen.height = Math.max(1, Math.floor(titleHeight));

    offCtx!.clearRect(
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    let fontSize = titleHeight * 0.75;

    offCtx!.direction = "ltr";
    offCtx!.textAlign = "center";
    offCtx!.textBaseline = "middle";

    offCtx!.font = `900 ${fontSize}px Orbitron, sans-serif`;

    const textWidth = offCtx!.measureText("FIESTRON").width;
    const maximumWidth = titleWidth * 0.88;

    if (textWidth > maximumWidth) {
      fontSize *= maximumWidth / textWidth;
    }

    offCtx!.font = `900 ${fontSize}px Orbitron, sans-serif`;
    offCtx!.fillStyle = "#FFFFFF";

    offCtx!.fillText(
      "FIESTRON",
      titleWidth / 2,
      titleHeight / 2
    );

    const imageData = offCtx!.getImageData(
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    particles = [];

    const gap = titleWidth < 600 ? 3 : 4;

    for (let y = 0; y < offscreen.height; y += gap) {
      for (let x = 0; x < offscreen.width; x += gap) {
        const index = (y * offscreen.width + x) * 4;
        const alpha = imageData.data[index + 3];

        if (alpha > 100) {
          particles.push({
            x,
            y,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            radius: Math.random() * 0.9 + 0.8,
            color:
              titleColors[
                Math.floor(Math.random() * titleColors.length)
              ],
          });
        }
      }
    }
  }

  // DRAW BACKGROUND PARTICLES

  function drawBackgroundParticles() {
    backgroundCtx!.clearRect(0, 0, width, height);

    for (const dot of backgroundDots) {
      if (pointer.active) {
        const dx = dot.x - pointer.backgroundX;
        const dy = dot.y - pointer.backgroundY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 175;

        if (distance < forceRadius && distance > 0) {
          const force = (1 - distance / forceRadius) * 1.7;

          dot.vx += (dx / distance) * force;
          dot.vy += (dy / distance) * force;
        }
      }

      dot.vx += (dot.homeX - dot.x) * 0.025;
      dot.vy += (dot.homeY - dot.y) * 0.025;

      dot.vx *= 0.88;
      dot.vy *= 0.88;

      dot.x += dot.vx;
      dot.y += dot.vy;

      let opacity = 0.25;

      if (pointer.active) {
        const dx = dot.x - pointer.backgroundX;
        const dy = dot.y - pointer.backgroundY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 220) {
          opacity = Math.max(
            opacity,
            0.8 * (1 - distance / 220)
          );
        }
      }

      backgroundCtx!.beginPath();

      backgroundCtx!.arc(
        dot.x,
        dot.y,
        dot.radius,
        0,
        Math.PI * 2
      );

      backgroundCtx!.fillStyle = `rgba(255, 100, 175, ${opacity})`;

      backgroundCtx!.fill();
    }

    // PINK SPOTLIGHT

    if (pointer.active) {
      const gradient = backgroundCtx!.createRadialGradient(
        pointer.backgroundX,
        pointer.backgroundY,
        0,
        pointer.backgroundX,
        pointer.backgroundY,
        220
      );

      gradient.addColorStop(0, "rgba(255, 46, 147, 0.07)");
      gradient.addColorStop(0.5, "rgba(157, 78, 221, 0.025)");
      gradient.addColorStop(1, "rgba(255, 46, 147, 0)");

      backgroundCtx!.fillStyle = gradient;

      backgroundCtx!.fillRect(
        0,
        0,
        width,
        height
      );
    }
  }

  // DRAW TITLE PARTICLES

  function drawTitleParticles() {
    ctx!.clearRect(0, 0, titleWidth, titleHeight);

    for (const particle of particles) {
      if (pointer.active) {
        const dx = particle.x - pointer.titleX;
        const dy = particle.y - pointer.titleY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 145;

        if (distance < forceRadius && distance > 0) {
          const force = (1 - distance / forceRadius) * 1.8;

          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx +=
        (particle.homeX - particle.x) * 0.035;

      particle.vy +=
        (particle.homeY - particle.y) * 0.035;

      particle.vx *= 0.84;
      particle.vy *= 0.84;

      particle.x += particle.vx;
      particle.y += particle.vy;

      ctx!.beginPath();

      ctx!.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx!.fillStyle = particle.color;
      ctx!.shadowBlur = 5;
      ctx!.shadowColor = particle.color;

      ctx!.fill();
    }

    ctx!.shadowBlur = 0;
  }

  // MAIN ANIMATION

  function animate() {
    if (disposed) return;

    drawBackgroundParticles();
    drawTitleParticles();

    animationFrame = requestAnimationFrame(animate);
  }

  // CURSOR MOVEMENT

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;

    const heroRect = hero.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const backgroundRect = backgroundCanvas.getBoundingClientRect();

    pointer.heroX = event.clientX - heroRect.left;
    pointer.heroY = event.clientY - heroRect.top;

    pointer.backgroundX =
      event.clientX - backgroundRect.left;

    pointer.backgroundY =
      event.clientY - backgroundRect.top;

    pointer.titleX = event.clientX - canvasRect.left;
    pointer.titleY = event.clientY - canvasRect.top;

    pointer.active = true;

    cursorLight.style.left = `${pointer.heroX}px`;
    cursorLight.style.top = `${pointer.heroY}px`;
    cursorLight.style.opacity = "1";
  }

  function handlePointerLeave() {
    pointer.active = false;
    cursorLight.style.opacity = "0";
  }

  // RESIZE

  function handleResize() {
    if (disposed) return;

    cancelAnimationFrame(animationFrame);

    createBackgroundParticles();
    createTitleParticles();

    animate();
  }

  // INITIALIZATION

  async function start() {
    await document.fonts.ready;

    if (disposed) return;

    createBackgroundParticles();
    createTitleParticles();

    animate();
  }

  hero.addEventListener("pointermove", handlePointerMove);
  hero.addEventListener("pointerleave", handlePointerLeave);

  window.addEventListener("resize", handleResize);

  start();

  // CLEANUP FOR REACT

  return () => {
    disposed = true;

    cancelAnimationFrame(animationFrame);

    hero.removeEventListener("pointermove", handlePointerMove);
    hero.removeEventListener("pointerleave", handlePointerLeave);

    window.removeEventListener("resize", handleResize);

    cursorLight.style.opacity = "0";
  };
}