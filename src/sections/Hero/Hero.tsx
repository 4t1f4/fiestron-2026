import { useEffect, useRef } from "react";
import { initHero } from "./hero";
import "./hero.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const titleCanvas = titleCanvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    const cursorLight = cursorLightRef.current;

    if (!hero || !titleCanvas || !backgroundCanvas || !cursorLight) {
      return;
    }

    return initHero(hero, titleCanvas, backgroundCanvas, cursorLight);
  }, []);

  return (
    <section
      ref={heroRef}
      className="
        relative isolate flex min-h-svh w-full
        items-center justify-center overflow-hidden
        bg-[radial-gradient(ellipse_at_50%_48%,rgba(91,12,48,0.28),transparent_55%),#080609]
        [@media(hover:hover)_and_(pointer:fine)]:cursor-none
      "
    >
      {/* Interactive cursor spotlight */}
      <div
        ref={cursorLightRef}
        className="cursor-light absolute left-0 top-0 z-20 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

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
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-[1] flex flex-col items-center text-center">

            {/* Eyebrow */}
            <p className="
              mb-4 flex items-center gap-4
              text-[0.7rem] font-semibold tracking-[0.35em]
              text-[#A99AA5]
              max-[700px]:text-[0.55rem]
              max-[700px]:tracking-[0.2em]
            ">
              <span className="h-px w-[35px] bg-[#FF2E93] opacity-70 max-[700px]:w-5" />
              TECH CLUB PRESENTS
              <span className="h-px w-[35px] bg-[#FF2E93] opacity-70 max-[700px]:w-5" />
            </p>

            {/* Particle typography */}
            <div className="
              relative aspect-[3.2/1] w-full max-w-[1200px]
              max-[700px]:aspect-[2.1/1]
            ">
              <canvas
                ref={titleCanvasRef}
                id="particle-title"
                className="absolute inset-0 block h-full w-full"
                aria-hidden="true"
              />

              <h1 className="sr-only">
                FIESTRON
              </h1>
            </div>

            {/* Theme */}
            <p className="
              mt-2 flex flex-wrap items-center justify-center
              gap-[0.7rem] text-[clamp(1rem,2vw,1.45rem)]
              font-normal tracking-[0.04em] text-[#F5F0F5]
            ">
              <span className="
                font-['Orbitron'] text-[0.95em] font-bold
                tracking-[0.16em] text-[#FF2E93]
                drop-shadow-[0_0_18px_rgba(255,46,147,0.35)]
              ">
                DEJA VU
              </span>

              <span className="text-[#9D4EDD]">
                —
              </span>

              You've Been Here Before.
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="
          mt-6 max-w-[480px]
          text-[0.95rem] font-light leading-[1.8]
          text-[#A99AA5]
          max-[700px]:max-w-[330px]
          max-[700px]:text-[0.85rem]
        ">
          A moment from the past. A glitch in the present.
          An experience yet to come.
        </p>

        {/* CTA */}
        <a
          href="#about"
          className="
            mt-10 inline-flex items-center justify-center gap-6
            rounded-[3px] border border-[rgba(255,46,147,0.55)]
            bg-[rgba(255,46,147,0.04)]
            px-6 py-4
            text-[0.72rem] font-semibold tracking-[0.2em]
            text-[#F5F0F5]
            transition-all duration-300
            hover:-translate-y-[3px]
            hover:bg-[rgba(255,46,147,0.12)]
            hover:shadow-[0_0_20px_rgba(255,46,147,0.15),0_0_35px_rgba(157,78,221,0.1)]
          "
        >
          ENTER THE LOOP

          <span className="text-base text-[#FF2E93]" aria-hidden="true">
            ↗
          </span>
        </a>

      </div>
    </section>
  );
}