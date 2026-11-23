import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Tunnel from "./Tunnel";

const BUTTON_LABEL = "RE-ENTER FIESTRON";
const CAPTION = "YOU'VE BEEN HERE BEFORE";

const introStyles = `
.enter-btn {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 2.6rem;
  font-family: "Orbitron", "Sora", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.32em;
  white-space: nowrap;
  color: #ffffff;
  background: transparent;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.enter-btn:hover {
  transform: scale(1.05);
}

.enter-btn:active {
  transform: scale(0.96);
}

.enter-btn:focus-visible {
  outline: 2px solid #d9b8ff;
  outline-offset: 6px;
}

.enter-btn__body {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  border: 2px solid rgba(175, 105, 255, 0.8);
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(122, 47, 214, 0.38), rgba(12, 7, 20, 0.78));
  box-shadow: 0 0 18px rgba(175, 105, 255, 0.28), inset 0 0 14px rgba(175, 105, 255, 0.14);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.enter-btn:hover .enter-btn__body,
.enter-btn:focus-visible .enter-btn__body {
  border-color: #d9b8ff;
  background: linear-gradient(135deg, rgba(145, 71, 255, 0.55), rgba(41, 20, 67, 0.85));
}

.enter-btn__glow {
  position: absolute;
  inset: -45% -25%;
  z-index: -2;
  pointer-events: none;
  background: radial-gradient(closest-side, rgba(175, 105, 255, 0.5), transparent 72%);
  opacity: 0.5;
  animation: enter-breathe 2.4s ease-in-out infinite;
}

.enter-btn:hover .enter-btn__glow { animation-duration: 1s; }

@keyframes enter-breathe {
  0%, 100% { opacity: 0.35; transform: scale(0.94); }
  50% { opacity: 0.8; transform: scale(1.04); }
}

.enter-btn__ring {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border: 1.5px solid #af69ff;
  border-radius: 6px;
  opacity: 0;
  animation: enter-ring 2.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
}

.enter-btn__ring--2 { animation-delay: 1.3s; }

@keyframes enter-ring {
  0% { transform: scale(1, 1); opacity: 0.7; }
  100% { transform: scale(1.25, 1.7); opacity: 0; }
}

.enter-btn__shine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 45%;
  pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(217, 184, 255, 0.45), transparent);
  transform: translateX(-120%) skewX(-20deg);
  animation: enter-shine 3.4s ease-in-out infinite;
}

@keyframes enter-shine {
  0%, 55% { transform: translateX(-120%) skewX(-20deg); }
  100% { transform: translateX(330%) skewX(-20deg); }
}

.enter-btn__corner {
  position: absolute;
  width: 11px;
  height: 11px;
  pointer-events: none;
  border: 0 solid #d9b8ff;
  transition: transform 0.25s ease;
}

.enter-btn__corner--tl { top: -5px; left: -5px; border-top-width: 2px; border-left-width: 2px; }
.enter-btn__corner--tr { top: -5px; right: -5px; border-top-width: 2px; border-right-width: 2px; }
.enter-btn__corner--bl { bottom: -5px; left: -5px; border-bottom-width: 2px; border-left-width: 2px; }
.enter-btn__corner--br { bottom: -5px; right: -5px; border-bottom-width: 2px; border-right-width: 2px; }

.enter-btn:hover .enter-btn__corner--tl { transform: translate(-4px, -4px); }
.enter-btn:hover .enter-btn__corner--tr { transform: translate(4px, -4px); }
.enter-btn:hover .enter-btn__corner--bl { transform: translate(-4px, 4px); }
.enter-btn:hover .enter-btn__corner--br { transform: translate(4px, 4px); }

.enter-btn__label {
  position: relative;
  z-index: 1;
  text-shadow: 0 0 12px rgba(175, 105, 255, 0.75);
}

.enter-btn__label::before,
.enter-btn__label::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.enter-btn__label::before { color: #d9b8ff; }
.enter-btn__label::after { color: #9147ff; }

.enter-btn:hover .enter-btn__label::before,
.enter-btn:focus-visible .enter-btn__label::before {
  opacity: 0.9;
  animation: enter-glitch-a 0.5s steps(2, end) infinite;
}

.enter-btn:hover .enter-btn__label::after,
.enter-btn:focus-visible .enter-btn__label::after {
  opacity: 0.9;
  animation: enter-glitch-b 0.5s steps(2, end) infinite;
}

@keyframes enter-glitch-a {
  0% { transform: translate(-2px, 0); clip-path: inset(10% 0 62% 0); }
  25% { transform: translate(2px, 1px); clip-path: inset(58% 0 12% 0); }
  50% { transform: translate(-1px, -1px); clip-path: inset(32% 0 38% 0); }
  75% { transform: translate(2px, 0); clip-path: inset(70% 0 4% 0); }
  100% { transform: translate(-2px, 1px); clip-path: inset(4% 0 74% 0); }
}

@keyframes enter-glitch-b {
  0% { transform: translate(2px, 0); clip-path: inset(60% 0 10% 0); }
  25% { transform: translate(-2px, -1px); clip-path: inset(8% 0 66% 0); }
  50% { transform: translate(1px, 1px); clip-path: inset(44% 0 28% 0); }
  75% { transform: translate(-2px, 0); clip-path: inset(18% 0 56% 0); }
  100% { transform: translate(2px, -1px); clip-path: inset(76% 0 2% 0); }
}

.enter-btn__arrow {
  position: relative;
  z-index: 1;
  display: inline-block;
  color: #d9b8ff;
  font-size: 1.05rem;
  animation: enter-nudge 1.6s ease-in-out infinite;
}

@keyframes enter-nudge {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(4px, -4px); }
}

.enter-caption {
  margin-top: 1.5rem;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-align: center;
  color: #c5c1cf;
  animation: enter-flicker 4.5s linear infinite;
}

@keyframes enter-flicker {
  0%, 92%, 100% { opacity: 0.75; }
  93% { opacity: 0.3; }
  95% { opacity: 0.9; }
  97% { opacity: 0.45; }
}

@media (max-width: 480px) {
  .enter-btn { padding: 0.95rem 1.8rem; font-size: 0.72rem; letter-spacing: 0.24em; }
  .enter-caption { font-size: 0.55rem; letter-spacing: 0.28em; }
}

@media (prefers-reduced-motion: reduce) {
  .enter-btn__glow,
  .enter-btn__shine,
  .enter-btn__arrow,
  .enter-caption { animation: none; }
  .enter-btn__ring { display: none; }
  .enter-btn:hover .enter-btn__label::before,
  .enter-btn:hover .enter-btn__label::after { animation: none; opacity: 0; }
}
`;

export default function Intro() {
  const navigate = useNavigate();

  const [showEnter, setShowEnter] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [slowDown, setSlowDown] = useState(false);

  useEffect(() => {
    const speedTimer = setTimeout(() => {
      setSlowDown(true);
    }, 3500);

    const enterTimer = setTimeout(() => {
      setShowEnter(true);
    }, 4000);

    return () => {
      clearTimeout(speedTimer);
      clearTimeout(enterTimer);
    };
  }, []);

  const revealEnter = () => {
    if (!showEnter && !leaving) {
      setSlowDown(true);
      setShowEnter(true);
    }
  };

  const handleEnter = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (leaving) return;

    setLeaving(true);

    setTimeout(() => {
      navigate("/home");
    }, 1100);
  };

  return (
    <div
      onClick={revealEnter}
      className="fixed inset-0 overflow-hidden bg-[#06040A] cursor-pointer select-none"
    >
      <style>{introStyles}</style>

      <Tunnel deceleration={slowDown} />

      
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#06040A]/30" />

      {/* ENTER BUTTON + CAPTION TOGETHER */}
      <AnimatePresence>
        {!leaving && showEnter && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
          >
            <button
              type="button"
              onClick={handleEnter}
              aria-label="Enter Fiestron"
              className="enter-btn pointer-events-auto"
            >
              <span className="enter-btn__glow" aria-hidden="true" />
              <span className="enter-btn__ring" aria-hidden="true" />
              <span
                className="enter-btn__ring enter-btn__ring--2"
                aria-hidden="true"
              />

              <span className="enter-btn__body" aria-hidden="true">
                <span className="enter-btn__shine" />
              </span>

              <span
                className="enter-btn__corner enter-btn__corner--tl"
                aria-hidden="true"
              />
              <span
                className="enter-btn__corner enter-btn__corner--tr"
                aria-hidden="true"
              />
              <span
                className="enter-btn__corner enter-btn__corner--bl"
                aria-hidden="true"
              />
              <span
                className="enter-btn__corner enter-btn__corner--br"
                aria-hidden="true"
              />

              <span className="enter-btn__label" data-text={BUTTON_LABEL}>
                {BUTTON_LABEL}
              </span>

              <span className="enter-btn__arrow" aria-hidden="true">
                ↗
              </span>
            </button>

            <p className="enter-caption" aria-hidden="true">
              {CAPTION}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXIT TRANSITION */}
      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-30 bg-[#06040A]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}