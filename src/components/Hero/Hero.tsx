import { useEffect, useRef } from "react";
import { initHero } from "./hero";
import "./hero.css";

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = titleCanvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    const cursorLight = cursorLightRef.current;

    if (!hero || !canvas || !backgroundCanvas || !cursorLight) {
      return;
    }

    return initHero(hero, canvas, backgroundCanvas, cursorLight);
  }, []);

  return (
    <section className="hero" ref={heroRef}>

      <div
        className="cursor-light"
        ref={cursorLightRef}
        aria-hidden="true"
      />

      <div className="hero-content">

        <div className="hero-loop">

          <canvas
            id="background-particles"
            ref={backgroundCanvasRef}
            aria-hidden="true"
          />

          <div className="hero-branding">

            <p className="hero-eyebrow">
              <span className="eyebrow-line" />
              TECH CLUB PRESENTS
              <span className="eyebrow-line" />
            </p>

            <div className="title-container">

              <canvas
                id="particle-title"
                ref={titleCanvasRef}
                aria-hidden="true"
              />

              <h1 className="accessible-title">
                FIESTRON
              </h1>

            </div>

            <p className="hero-theme">
              <span>DEJA VU</span>
              <span className="theme-divider">—</span>
              You've Been Here Before.
            </p>

          </div>
        </div>

        <p className="hero-description">
          A moment from the past. A glitch in the present.
          An experience yet to come.
        </p>

        <a href="#events" className="hero-button">
          ENTER THE LOOP
          <span aria-hidden="true">↗</span>
        </a>

      </div>

      <div className="hero-bottom">

        <span className="hero-index">01 / 06</span>

        <div className="scroll-indicator">
          <span className="scroll-line" />
          SCROLL TO REMEMBER
        </div>

        <span className="hero-year">FIESTRON '26</span>

      </div>

    </section>
  );
}

export default Hero;