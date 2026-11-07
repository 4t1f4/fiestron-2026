import { useEffect, useRef } from "react";

import { initAbout } from "./about";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./about.css";

gsap.registerPlugin(ScrollTrigger);

// Wrap every character separately for typing animation.
function typed(text: string) {
  return Array.from(text).map((char, index) => (
    <span className="terminal-char" key={index}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const terminal = terminalRef.current;

    if (!section || !canvas || !terminal) return;

    // Animated WebGL background
    const cleanupCanvas = initAbout(section, canvas);

    const chars = terminal.querySelectorAll(".terminal-char");
    const cursor = terminal.querySelector(".token-cursor");

    // Hide terminal characters initially
    gsap.set(chars, {
      autoAlpha: 0,
    });

    if (cursor) {
      gsap.set(cursor, {
        autoAlpha: 0,
      });
    }

    // Terminal typing animation
    const typingTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: terminal,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    typingTimeline.to(chars, {
      autoAlpha: 1,
      duration: 0.01,
      stagger: 0.018,
      ease: "none",
    });

    if (cursor) {
      typingTimeline.to(cursor, {
        autoAlpha: 1,
        duration: 0.1,
      });
    }

    return () => {
      cleanupCanvas?.();

      typingTimeline.scrollTrigger?.kill();
      typingTimeline.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative isolate flex min-h-screen w-full
        items-center justify-center overflow-hidden
        px-6 py-24
        bg-[#080609]
        font-body
        max-[768px]:px-4 max-[768px]:py-16
      "
    >
      {/* Animated WebGL Background */}
      <canvas
        ref={canvasRef}
        className="
          about-canvas
          pointer-events-none absolute inset-0
          z-0 h-full w-full
        "
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-[1] flex w-full max-w-[900px] flex-col items-center text-center">

        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-[35px] bg-[#FF2E93] opacity-70" />

          <span className="text-[0.7rem] font-semibold tracking-[0.35em] text-[#A99AA5]">
            ABOUT US
          </span>

          <span className="h-px w-[35px] bg-[#FF2E93] opacity-70" />
        </div>

        {/* Title */}
        <h2
          className="
            mb-4 font-heading font-black
            text-[clamp(1.8rem,4vw,3rem)]
            tracking-[0.08em] text-[#F5F0F5]
            drop-shadow-[0_0_20px_rgba(255,46,147,0.25)]
            max-[768px]:text-[clamp(1.5rem,6vw,2.2rem)]
          "
        >
          WHERE CODE MEETS CHAOS
        </h2>

        {/* Subtitle */}
        <p
          className="
            mb-12 max-w-[580px]
            text-[0.95rem] font-light leading-[1.8]
            text-[#A99AA5]
            max-[768px]:mb-8 max-[768px]:text-[0.85rem]
          "
        >
          The flagship tech symposium of K.C. College's Department of
          Computer Science. Three days of innovation, 25 years of
          legacy, and endless digital horizons.
        </p>

        {/* Code Editor */}
        <div
          className="
            mb-10 w-full overflow-hidden rounded-lg
            border border-[rgba(255,46,147,0.25)]
            bg-[rgba(12,9,15,0.82)]
            text-left
            shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(157,78,221,0.08)]
            backdrop-blur-[16px]
          "
        >
          {/* Editor Top Bar */}
          <div
            className="
              flex items-center justify-between
              border-b border-[rgba(255,255,255,0.06)]
              bg-[rgba(255,255,255,0.02)]
              px-5 py-[0.85rem]
              max-[768px]:px-[0.85rem] max-[768px]:py-3
            "
          >
            {/* Window Dots */}
            <div className="flex gap-2">
              <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F56]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#FFBD2E]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#27C93F]" />
            </div>

            {/* Filename */}
            <div
              className="
                font-heading text-[0.72rem]
                tracking-[0.08em] text-[#A99AA5]
                max-[768px]:text-[0.6rem]
              "
            >
              fiestron.config.ts
            </div>

            {/* College Branding */}
            <div
              className="
                font-heading text-[0.62rem] font-semibold
                tracking-[0.15em] text-[#9D4EDD]
                max-[768px]:text-[0.5rem]
                max-[420px]:hidden
              "
            >
              K.C. COLLEGE
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className="
              code-body overflow-x-auto p-6
              font-mono text-[0.85rem] leading-[1.9]
              text-[#F5F0F5] whitespace-pre
              max-[768px]:p-4 max-[768px]:text-[0.75rem]
            "
          >
            <code className="block">

              <div className="code-line">
                <span className="text-[#6E5B6E] italic">
                  {typed("// fiestron.config.ts — System Configuration")}
                </span>
              </div>

              <div className="code-line">
                <span className="font-semibold text-[#FF2E93]">
                  {typed("const")}
                </span>
                {typed(" ")}
                <span className="text-[#9D4EDD]">
                  {typed("fiestron")}
                </span>
                {typed(" = {")}
              </div>

              <div className="code-line">
                {typed("  host: ")}
                <span className="text-[#00F0FF]">
                  {typed('"Department of Computer Science"')}
                </span>
                {typed(",")}
              </div>

              <div className="code-line">
                {typed("  institution: ")}
                <span className="text-[#00F0FF]">
                  {typed('"Kishinchand Chellaram College"')}
                </span>
                {typed(",")}
              </div>

              <div className="code-line">
                {typed("  tagline: ")}
                <span className="text-[#00F0FF]">
                  {typed('"Where code meets chaos"')}
                </span>
                {typed(",")}
              </div>

              <div className="code-line">
                {typed("  legacyYears: ")}
                <span className="text-[#FF8BC2]">
                  {typed("25")}
                </span>
                {typed(", ")}
                <span className="text-[#6E5B6E] italic">
                  {typed("// established excellence")}
                </span>
              </div>

              <div className="code-line">
                {typed("  events: ")}
                <span className="text-[#00F0FF]">
                  {typed('"30+ technical & tactical battles"')}
                </span>
                {typed(",")}
              </div>

              <div className="code-line">
                {typed("  tracks: [")}
                <span className="text-[#00F0FF]">
                  {typed('"Coding"')}
                </span>
                {typed(", ")}
                <span className="text-[#00F0FF]">
                  {typed('"AI"')}
                </span>
                {typed(", ")}
                <span className="text-[#00F0FF]">
                  {typed('"Gaming"')}
                </span>
                {typed(", ")}
                <span className="text-[#00F0FF]">
                  {typed('"Design"')}
                </span>
                {typed("],")}
              </div>

              <div className="code-line">
                {typed("};")}
              </div>

              <div className="code-line">
                <span className="text-[#FFBE0B]">
                  {typed("initialize")}
                </span>
                {typed("(fiestron); ")}
                <span className="token-cursor">_</span>
              </div>

            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-[1.2rem] max-[768px]:gap-3">

          <a
            href="#register"
            className="
              inline-flex items-center justify-center gap-4
              rounded-[3px] border border-[rgba(255,46,147,0.6)]
              bg-[rgba(255,46,147,0.08)]
              px-[1.8rem] py-[0.9rem]
              text-[0.72rem] font-semibold tracking-[0.2em]
              text-[#F5F0F5]
              transition-all duration-300
              hover:-translate-y-[3px]
              hover:bg-[rgba(255,46,147,0.18)]
              hover:shadow-[0_0_20px_rgba(255,46,147,0.25)]
              max-[420px]:px-[1.2rem] max-[420px]:py-[0.8rem]
              max-[420px]:text-[0.65rem]
              motion-reduce:transition-none
            "
          >
            REGISTER NOW

            <span className="text-[#FF2E93]" aria-hidden="true">
              ↗
            </span>
          </a>

          <a
            href="#contact"
            className="
              inline-flex items-center justify-center
              rounded-[3px] border border-[rgba(157,78,221,0.4)]
              bg-transparent
              px-[1.8rem] py-[0.9rem]
              text-[0.72rem] font-semibold tracking-[0.2em]
              text-[#A99AA5]
              transition-all duration-300
              hover:-translate-y-[3px]
              hover:border-[rgba(157,78,221,0.8)]
              hover:bg-[rgba(157,78,221,0.08)]
              hover:text-[#F5F0F5]
              max-[420px]:px-[1.2rem] max-[420px]:py-[0.8rem]
              max-[420px]:text-[0.65rem]
              motion-reduce:transition-none
            "
          >
            CONTACT US
          </a>

        </div>
      </div>
    </section>
  );
}