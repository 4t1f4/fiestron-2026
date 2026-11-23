import { useEffect, useRef } from "react";

import { initHero } from "./hero";
import "./hero.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const titleCanvas = titleCanvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;

    if (!hero || !titleCanvas || !backgroundCanvas) {
      return;
    }

    return initHero(hero, titleCanvas, backgroundCanvas);
  }, []);

  
  const goToAbout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("about");


    if (!target) return;

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={heroRef}
      className="
        relative isolate flex min-h-svh w-full
        items-center justify-center overflow-hidden
        bg-[radial-gradient(ellipse_at_50%_48%,rgba(145,71,255,0.20),transparent_55%),#06040A]
      "
    >
      {/* Main hero content */}

      <div className="relative z-[1] flex w-full flex-col items-center px-6 py-[8rem] text-center">

        {/* Particle title area */}

        <div
          className="
            relative isolate
            w-[min(calc(100%_+_10rem),1400px)]
            px-[clamp(1.5rem,5vw,5rem)]
            py-[2.5rem]
          "
        >

          {/* Background particles */}

          <canvas
            ref={backgroundCanvasRef}
            id="background-particles"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            aria-hidden="true"
          />

          <div className="relative z-[1] flex flex-col items-center text-center">

            {/* Eyebrow */}

            <p
              className="
                mb-4 flex items-center gap-4
                text-[0.7rem] font-semibold tracking-[0.35em]
                text-[#C5C1CF]
                max-[700px]:text-[0.55rem]
                max-[700px]:tracking-[0.2em]
              "
            >
              <span className="h-px w-[35px] bg-[#AF69FF] opacity-70 max-[700px]:w-5" />

              TECH CLUB PRESENTS

              <span className="h-px w-[35px] bg-[#AF69FF] opacity-70 max-[700px]:w-5" />
            </p>

            {/* Particle typography */}

            <div
              className="
                relative aspect-[3.2/1] w-full max-w-[1200px]
                max-[700px]:aspect-[2.1/1]
              "
            >
              <canvas
                ref={titleCanvasRef}
                id="particle-title"
                className="absolute inset-0 block h-full w-full"
                aria-hidden="true"
              />

              <h1 className="sr-only">FIESTRON</h1>
            </div>

          </div>
        </div>

        {/* LOOP PORTAL BUTTON + DEJA VU THEME CARD */}

        <div className="hero-cta-wrapper">

          <a
            href="#about"
            className="hero-loop"
            aria-label="Enter the loop and scroll to the About section"
            onClick={goToAbout}
          >
            <span className="hero-loop-glow" aria-hidden="true" />
            <span className="hero-loop-pulse" aria-hidden="true" />

            <span className="hero-loop-core" aria-hidden="true">
              <span className="hero-loop-label">ENTER THE LOOP</span>
              <span className="hero-loop-arrow">↓</span>
            </span>
          </a>

          {/* Theme card: sits right after the button so CSS can react to hover/focus */}

          <div className="theme-card">
            <div className="theme-card-top">
              <span className="theme-card-label">
                <i className="theme-card-dot" aria-hidden="true" />
                // THE THEME
              </span>

              <span className="theme-card-tag">LOOP_2026</span>
            </div>

            <h3 className="theme-title" data-text="DEJA VU">
              DEJA VU
            </h3>

            <p className="theme-line">You've been here before.</p>
            <p className="theme-line theme-line-flicker">Or have you?</p>

            <div className="theme-timeline" aria-hidden="true">
              <span className="theme-track" />

              <span className="theme-node">PAST</span>
              <span className="theme-node">PRESENT</span>
              <span className="theme-node">FUTURE</span>
            </div>

            <span className="theme-card-footer">
              ITERATION ∞ · PRESS TO ENTER
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}