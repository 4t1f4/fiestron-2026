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

  const handleEnter = (event: React.MouseEvent) => {
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
      className="fixed inset-0 overflow-hidden bg-[#080609] cursor-pointer select-none"
    >
      <Tunnel deceleration={slowDown} />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#080609]/30 backdrop-blur-[1px]" />

      <AnimatePresence>
        {!leaving && showEnter && (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
            <motion.button
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleEnter}
              aria-label="Enter Fiestron"
              className="pointer-events-auto group relative overflow-hidden rounded-md border border-[#E4369A]/70 bg-[#0C0810]/75 px-12 py-4 font-orbitron text-sm font-bold tracking-[0.35em] text-white backdrop-blur-md transition-all duration-500 hover:border-[#E4369A] hover:bg-[#59153C] hover:shadow-[0_0_30px_rgba(228,54,154,0.4)] cursor-pointer"
            >
              <span className="relative z-10">ENTER FIESTRON</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E4369A]/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-30 bg-[#080609]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}