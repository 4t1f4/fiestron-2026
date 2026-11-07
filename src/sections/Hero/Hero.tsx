import { useEffect, useRef, useState } from "react";

import { initHero } from "./hero";
import "./hero.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  const [showTheme, setShowTheme] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const titleCanvas = titleCanvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;

    if (!hero || !titleCanvas || !backgroundCanvas) {
      return;
    }

    return initHero(hero, titleCanvas, backgroundCanvas);
  }, []);

  return (
    <section
      ref={heroRef}
      className="
        relative isolate flex min-h-svh w-full
        items-center justify-center overflow-hidden
        bg-[radial-gradient(ellipse_at_50%_48%,rgba(91,12,48,0.28),transparent_55%),#080609]
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
                text-[#A99AA5]
                max-[700px]:text-[0.55rem]
                max-[700px]:tracking-[0.2em]
              "
            >
              <span className="h-px w-[35px] bg-[#FF2E93] opacity-70 max-[700px]:w-5" />

              TECH CLUB PRESENTS

              <span className="h-px w-[35px] bg-[#FF2E93] opacity-70 max-[700px]:w-5" />
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


        {/* CTA and DEJA VU theme card */}
        <div className="hero-cta-wrapper">

          <div
            className={`theme-card ${showTheme ? "theme-card-visible" : ""}`}
            aria-hidden={!showTheme}
          >
            <span className="theme-card-label">THE THEME</span>

            <h3>DEJA VU</h3>

            <p>
              You've been here before.
              <br />
              Or have you?
            </p>

            <span className="theme-card-footer">
              PAST · PRESENT · FUTURE
            </span>
          </div>

          <a
            href="#about"
            className="hero-cta"
            onMouseEnter={() => setShowTheme(true)}
            onMouseLeave={() => {
              if (!pinned) setShowTheme(false);
            }}
            onFocus={() => setShowTheme(true)}
            onBlur={() => {
              if (!pinned) setShowTheme(false);
            }}
            onClick={(e) => {
              if (!pinned) {
                e.preventDefault();
                setPinned(true);
                setShowTheme(true);
              } else {
                setPinned(false);
              }
            }}
          >
            <span className="hero-cta-text">ENTER THE LOOP</span>
            <span className="hero-cta-arrow" aria-hidden="true">
              ↗
            </span>
          </a>

        </div>
      </div>
    </section>
  );
}