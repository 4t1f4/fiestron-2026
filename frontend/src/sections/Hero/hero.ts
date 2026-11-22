export function initHero(
  hero: HTMLElement,
  canvas: HTMLCanvasElement,
  backgroundCanvas: HTMLCanvasElement
) {
  const canvasContext = canvas.getContext("2d");
  const backgroundContext = backgroundCanvas.getContext("2d");

  if (!canvasContext || !backgroundContext) return;

  const ctx: CanvasRenderingContext2D = canvasContext;
  const backgroundCtx: CanvasRenderingContext2D = backgroundContext;

  const offscreen = document.createElement("canvas");

  // Pixel readback happens here (title text -> particles), so hint the browser.
  const offscreenContext = offscreen.getContext("2d", {
    willReadFrequently: true,
  });

  if (!offscreenContext) return;

  const offCtx: CanvasRenderingContext2D = offscreenContext;

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
  let resizeTimer = 0;
  let disposed = false;
  let started = false;
  let heroVisible = true;

  // Below this (in px) a particle counts as "at rest".
  const REST_THRESHOLD = 0.02;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

  const pointer = {
    titleX: -1000,
    titleY: -1000,
    backgroundX: -1000,
    backgroundY: -1000,
    active: false,
  };

  const titleColors = [
    "#AF69FF",
    "#9147FF",
    "#FFFFFF",
    "#D9B8FF",
  ];


  // BACKGROUND PARTICLES (DENSE GRID WITH NO SCATTERING)

  function createBackgroundParticles() {
    const rect = backgroundCanvas.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    backgroundCanvas.width = Math.floor(width * pixelRatio);
    backgroundCanvas.height = Math.floor(height * pixelRatio);

    backgroundCtx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    backgroundDots = [];

    // Compact and dense spacing for clean matrix look

    const spacing = width < 600 ? 12 : 14;

    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        backgroundDots.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 0.3 + 0.6,
        });
      }
    }
  }

  // FIESTRON TITLE PARTICLES

  function createTitleParticles() {
    const rect = canvas.getBoundingClientRect();

    titleWidth = rect.width;
    titleHeight = rect.height;

    canvas.width = Math.floor(titleWidth * pixelRatio);
    canvas.height = Math.floor(titleHeight * pixelRatio);

    ctx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    offscreen.width = Math.max(1, Math.floor(titleWidth));
    offscreen.height = Math.max(1, Math.floor(titleHeight));

    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

    let fontSize = titleHeight * 0.48;

    offCtx.direction = "ltr";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";

    offCtx.font = `900 ${fontSize}px Orbitron, sans-serif`;

    // Same mobile threshold already used below for the particle gap.

    const isMobileTitle = titleWidth < 600;

    if (isMobileTitle) {
      // MOBILE ONLY: add a small extra gap between "F" and "I".

      const FI_GAP_EM = 0.1;

      offCtx.textAlign = "left";

      const maximumWidth = titleWidth * 0.75;

      const totalWidth =
        offCtx.measureText("FIESTRON").width + fontSize * FI_GAP_EM;

      if (totalWidth > maximumWidth) {
        fontSize *= maximumWidth / totalWidth;
      }

      offCtx.font = `900 ${fontSize}px Orbitron, sans-serif`;
      offCtx.fillStyle = "#FFFFFF";

      const fullWidth = offCtx.measureText("FIESTRON").width;
      const restWidth = offCtx.measureText("IESTRON").width;

      // Advance of "F" including any kerning with "I".

      const fAdvance = fullWidth - restWidth;

      const fiGap = fontSize * FI_GAP_EM;

      const startX = (titleWidth - (fullWidth + fiGap)) / 2;
      const centerY = titleHeight / 2;

      offCtx.fillText("F", startX, centerY);
      offCtx.fillText("IESTRON", startX + fAdvance + fiGap, centerY);

    } else {
      // DESKTOP / LAPTOP: original rendering, unchanged

      const textWidth = offCtx.measureText("FIESTRON").width;
      const maximumWidth = titleWidth * 0.75;

      if (textWidth > maximumWidth) {
        fontSize *= maximumWidth / textWidth;
      }

      offCtx.font = `900 ${fontSize}px Orbitron, sans-serif`;
      offCtx.fillStyle = "#FFFFFF";

      offCtx.fillText(
        "FIESTRON",
        titleWidth / 2,
        titleHeight / 2
      );
    }

    const imageData = offCtx.getImageData(
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

  // DRAW BACKGROUND PARTICLES WITH CORNER VIGNETTE FADE
  // Returns true while any dot is still moving.

  function drawBackgroundParticles(): boolean {
    let moving = false;

    backgroundCtx.clearRect(0, 0, width, height);

    if (pointer.active) {
      const gradient = backgroundCtx.createRadialGradient(
        pointer.backgroundX,
        pointer.backgroundY,
        0,
        pointer.backgroundX,
        pointer.backgroundY,
        220
      );

      gradient.addColorStop(0, "rgba(175, 105, 255, 0.07)");
      gradient.addColorStop(0.5, "rgba(145, 71, 255, 0.025)");
      gradient.addColorStop(1, "rgba(175, 105, 255, 0)");

      backgroundCtx.fillStyle = gradient;
      backgroundCtx.fillRect(0, 0, width, height);
    }

    const opacityGroups: Path2D[] = Array.from(
      { length: 9 },
      () => new Path2D()
    );

    for (const dot of backgroundDots) {
      if (pointer.active) {
        const dx = dot.x - pointer.backgroundX;
        const dy = dot.y - pointer.backgroundY;

        const distanceSquared = dx * dx + dy * dy;
        const forceRadius = 200;

        if (distanceSquared < forceRadius * forceRadius) {
          const distance = Math.sqrt(distanceSquared);

          if (distance > 0) {
            const force = (1 - distance / forceRadius) * 2.8;

            dot.vx += (dx / distance) * force;
            dot.vy += (dy / distance) * force;
          }
        }
      }

      dot.vx += (dot.homeX - dot.x) * 0.05;
      dot.vy += (dot.homeY - dot.y) * 0.05;

      dot.vx *= 0.80;
      dot.vy *= 0.80;

      dot.x += dot.vx;
      dot.y += dot.vy;

      if (
        Math.abs(dot.vx) > REST_THRESHOLD ||
        Math.abs(dot.vy) > REST_THRESHOLD ||
        Math.abs(dot.homeX - dot.x) > REST_THRESHOLD ||
        Math.abs(dot.homeY - dot.y) > REST_THRESHOLD
      ) {
        moving = true;
      }

      // Calculate distance from center to fade dots at edges/corners.

      const centerX = width / 2;
      const centerY = height / 2;

      const distanceFromCenter = Math.hypot(
        dot.x - centerX,
        dot.y - centerY
      );

      const maxRadius = Math.hypot(centerX, centerY) * 0.88;

      let edgeFade = 1;

      if (distanceFromCenter > maxRadius * 0.5) {
        edgeFade = Math.max(
          0,
          1 - (distanceFromCenter - maxRadius * 0.5) / (maxRadius * 0.5)
        );
      }

      let opacity = 0.35 * edgeFade;

      if (pointer.active) {
        const dx = dot.x - pointer.backgroundX;
        const dy = dot.y - pointer.backgroundY;

        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < 200 * 200) {
          const distance = Math.sqrt(distanceSquared);

          opacity = Math.max(
            opacity,
            (0.7 * (1 - distance / 200)) * edgeFade
          );
        }
      }

      const group = Math.min(
        8,
        Math.floor(opacity * 12)
      );

      opacityGroups[group].moveTo(
        dot.x + dot.radius,
        dot.y
      );

      opacityGroups[group].arc(
        dot.x,
        dot.y,
        dot.radius,
        0,
        Math.PI * 2
      );
    }

    for (let i = 0; i < opacityGroups.length; i++) {
      backgroundCtx.fillStyle =
        `rgba(175, 105, 255, ${i / 11})`;

      backgroundCtx.fill(opacityGroups[i]);
    }

    return moving;
  }

  // DRAW TITLE PARTICLES
  // Returns true while any particle is still moving.

  function drawTitleParticles(): boolean {
    let moving = false;

    ctx.clearRect(0, 0, titleWidth, titleHeight);

    const colorPaths = new Map<string, Path2D>();

    for (const color of titleColors) {
      colorPaths.set(color, new Path2D());
    }

    for (const particle of particles) {
      if (pointer.active) {
        const dx = particle.x - pointer.titleX;
        const dy = particle.y - pointer.titleY;

        const distanceSquared = dx * dx + dy * dy;
        const forceRadius = 190;

        if (distanceSquared < forceRadius * forceRadius) {
          const distance = Math.sqrt(distanceSquared);

          if (distance > 0) {
            const force = (1 - distance / forceRadius) * 3.5;

            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }
      }

      particle.vx +=
        (particle.homeX - particle.x) * 0.055;

      particle.vy +=
        (particle.homeY - particle.y) * 0.055;

      particle.vx *= 0.80;
      particle.vy *= 0.80;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (
        Math.abs(particle.vx) > REST_THRESHOLD ||
        Math.abs(particle.vy) > REST_THRESHOLD ||
        Math.abs(particle.homeX - particle.x) > REST_THRESHOLD ||
        Math.abs(particle.homeY - particle.y) > REST_THRESHOLD
      ) {
        moving = true;
      }

      const path = colorPaths.get(particle.color);

      if (path) {
        path.moveTo(
          particle.x + particle.radius,
          particle.y
        );

        path.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );
      }
    }

    for (const color of titleColors) {
      const path = colorPaths.get(color);

      if (path) {
        ctx.fillStyle = color;
        ctx.fill(path);
      }
    }

    return moving;
  }

  // ANIMATION
  // Runs only while the hero is visible AND (the pointer is over it OR
  // something is still moving). Once everything is at rest it stops, and
  // requestRender() restarts it on the next interaction.

  function animate() {
    animationFrame = 0;

    if (disposed || !heroVisible || document.hidden) return;

    const backgroundMoving = drawBackgroundParticles();
    const titleMoving = drawTitleParticles();

    if (pointer.active || backgroundMoving || titleMoving) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function requestRender() {
    if (disposed || !started || !heroVisible || document.hidden) return;
    if (animationFrame !== 0) return;

    animationFrame = requestAnimationFrame(animate);
  }

  // POINTER MOVEMENT (MOUSE / PEN) — UNCHANGED

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;

    const canvasRect = canvas.getBoundingClientRect();
    const backgroundRect = backgroundCanvas.getBoundingClientRect();

    pointer.backgroundX = event.clientX - backgroundRect.left;
    pointer.backgroundY = event.clientY - backgroundRect.top;

    pointer.titleX = event.clientX - canvasRect.left;
    pointer.titleY = event.clientY - canvasRect.top;

    pointer.active = true;

    requestRender();
  }

  function handlePointerLeave() {
    pointer.active = false;

    requestRender();
  }

  // TOUCH MOVEMENT (PHONES / TABLETS)

  function updatePointerFromTouch(event: TouchEvent) {
    const touch = event.touches[0];

    if (!touch) return;

    const canvasRect = canvas.getBoundingClientRect();
    const backgroundRect = backgroundCanvas.getBoundingClientRect();

    pointer.backgroundX = touch.clientX - backgroundRect.left;
    pointer.backgroundY = touch.clientY - backgroundRect.top;

    pointer.titleX = touch.clientX - canvasRect.left;
    pointer.titleY = touch.clientY - canvasRect.top;

    pointer.active = true;

    requestRender();
  }

  function handleTouchEnd(event: TouchEvent) {
    // Keep reacting if another finger is still down.

    if (event.touches.length > 0) {
      updatePointerFromTouch(event);
      return;
    }

    pointer.active = false;

    requestRender();
  }

  // RESIZE (debounced; skipped if the canvases did not actually change size)

  function rebuild() {
    if (disposed || !started) return;

    const backgroundRect = backgroundCanvas.getBoundingClientRect();
    const titleRect = canvas.getBoundingClientRect();

    const unchanged =
      Math.round(backgroundRect.width) === Math.round(width) &&
      Math.round(backgroundRect.height) === Math.round(height) &&
      Math.round(titleRect.width) === Math.round(titleWidth) &&
      Math.round(titleRect.height) === Math.round(titleHeight);

    if (unchanged) return;

    cancelAnimationFrame(animationFrame);
    animationFrame = 0;

    createBackgroundParticles();
    createTitleParticles();

    // Resizing a canvas clears it, so repaint immediately to avoid a flash.
    drawBackgroundParticles();
    drawTitleParticles();

    requestRender();
  }

  function handleResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuild, 150);
  }

  // VISIBILITY

  const intersectionObserver = new IntersectionObserver((entries) => {
    heroVisible = entries.some((entry) => entry.isIntersecting);

    if (heroVisible) {
      requestRender();
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  });

  intersectionObserver.observe(hero);

  function handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      requestRender();
    }
  }

  // START

  async function start() {
    await document.fonts.ready;

    if (disposed) return;

    createBackgroundParticles();
    createTitleParticles();

    started = true;

    requestRender();
  }

  hero.addEventListener("pointermove", handlePointerMove);
  hero.addEventListener("pointerleave", handlePointerLeave);

  hero.addEventListener("touchstart", updatePointerFromTouch, {
    passive: true,
  });

  hero.addEventListener("touchmove", updatePointerFromTouch, {
    passive: true,
  });

  hero.addEventListener("touchend", handleTouchEnd, {
    passive: true,
  });

  hero.addEventListener("touchcancel", handleTouchEnd, {
    passive: true,
  });

  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  start();

  // CLEANUP

  return () => {
    disposed = true;

    cancelAnimationFrame(animationFrame);
    window.clearTimeout(resizeTimer);

    intersectionObserver.disconnect();

    hero.removeEventListener("pointermove", handlePointerMove);
    hero.removeEventListener("pointerleave", handlePointerLeave);

    hero.removeEventListener("touchstart", updatePointerFromTouch);
    hero.removeEventListener("touchmove", updatePointerFromTouch);
    hero.removeEventListener("touchend", handleTouchEnd);
    hero.removeEventListener("touchcancel", handleTouchEnd);

    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}