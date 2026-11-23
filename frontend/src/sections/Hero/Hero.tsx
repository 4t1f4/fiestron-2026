import { useEffect, useRef, useState } from "react";

import { initHero } from "./hero";
import "./hero.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  
  const [mobileCardOpen, setMobileCardOpen] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const titleCanvas = titleCanvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;

    if (!hero || !titleCanvas || !backgroundCanvas) {
      return;
    }

    return initHero(hero, titleCanvas, backgroundCanvas);
  }, []);

  const scrollToAbout = () => {
    const target = document.getElementById("about");
    if (!target) return false;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    return true;
  };

  
  const handleLoopClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const isTouchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;

    if (isTouchDevice && !mobileCardOpen) {
      event.preventDefault();
      setMobileCardOpen(true);
      return;
    }

    const scrolled = scrollToAbout();
    if (scrolled) {
      event.preventDefault();
    }

    setMobileCardOpen(false);
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
      {/* Main hero layout */}
      <div className="relative z-[1] flex w-full flex-col items-center px-6 py-[8rem] text-center">

        {/* Particle title stage */}
        <div
          className="
            relative isolate
            w-[min(calc(100%_+_10rem),1400px)]
            px-[clamp(1.5rem,5vw,5rem)]
            py-[2.5rem]
          "
        >
          {/* Ambient particle layer */}
          <canvas
            ref={backgroundCanvasRef}
            id="background-particles"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            aria-hidden="true"
          />

          <div className="relative z-[1] flex flex-col items-center text-center">
            {/* Club presenter tag */}
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

            {/* Particle display typography */}
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

        {/* Loop CTA and theme preview */}
        <div className="hero-cta-wrapper">
          <a
            href="#about"
            className="hero-loop"
            aria-label={
              mobileCardOpen
                ? "Enter the loop again and scroll to the About section"
                : "Enter the loop and scroll to the About section"
            }
            onClick={handleLoopClick}
          >
            <span className="hero-loop-glow" aria-hidden="true" />
            <span className="hero-loop-pulse" aria-hidden="true" />

            <span className="hero-loop-core" aria-hidden="true">
              <span className="hero-loop-label">
                {mobileCardOpen ? "TAP AGAIN TO ENTER" : "ENTER THE LOOP"}
              </span>
              <span className="hero-loop-arrow">↓</span>
            </span>
          </a>

          {/* Placed right after .hero-loop so CSS can pair hover/focus/active/data-open states */}
          <div
            className="theme-card"
            data-open={mobileCardOpen ? "true" : "false"}
          >
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
              ITERATION ∞ · TAP AGAIN TO ENTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}