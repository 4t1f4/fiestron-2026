import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Tunnel from "./Tunnel";

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
      <Tunnel deceleration={slowDown} />

      {/* Background overlay */}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#06040A]/30 backdrop-blur-[1px]" />

      {/* ENTER BUTTON */}

      <AnimatePresence>
        {!leaving && showEnter && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
            <motion.button
              initial={{
                opacity: 0,
                y: 16,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              onClick={handleEnter}
              aria-label="Enter Fiestron"
              className="pointer-events-auto group relative overflow-hidden rounded-md border-2 border-[#AF69FF]/75 bg-[#AF69FF]/10 px-12 py-4 font-orbitron text-sm font-bold tracking-[0.35em] text-white shadow-[0_0_18px_rgba(175,105,255,0.28),inset_0_0_14px_rgba(175,105,255,0.10)] backdrop-blur-md transition-all duration-300 hover:border-[#AF69FF] hover:bg-[#AF69FF]/20 hover:shadow-[0_0_25px_rgba(175,105,255,0.38),0_0_45px_rgba(145,71,255,0.18)] active:bg-[#AF69FF]/25 active:shadow-[0_0_28px_rgba(175,105,255,0.5)] cursor-pointer"
            >
              <span className="relative z-10">
                ENTER FIESTRON
              </span>

              {/* Animated shine */}

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#AF69FF]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full group-active:translate-x-full" />
            </motion.button>
          </div>
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