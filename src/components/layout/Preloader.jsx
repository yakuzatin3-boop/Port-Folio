import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE, DURATION } from "../../lib/easing";
import { stopLenis, startLenis } from "../../lib/lenis";
import useReducedMotion from "../../hooks/useReducedMotion";
import { profile } from "../../data/profile";

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wiping, setWiping] = useState(false);
  const reduced = useReducedMotion();
  const started = useRef(null);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    stopLenis();

    let rafId;

    const tick = (time) => {
      if (started.current === null) started.current = time;
      const duration = reduced ? 350 : 1500;
      const progress = Math.min((time - started.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setWiping(true), 220);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove("no-scroll");
      startLenis();
    };
  }, [reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-8 md:px-12 md:py-10"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={wiping ? { clipPath: "inset(0% 0% 100% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: wiping ? (reduced ? 0.2 : DURATION.slow) : 0, ease: EASE }}
      onAnimationComplete={() => {
        if (wiping) onComplete?.();
      }}
    >
      <motion.div
        className="mono-label flex items-center justify-between text-muted"
        animate={{ opacity: wiping ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <span className="font-display text-sm font-bold tracking-[-0.04em] text-fg">
          VUTHIN<span className="text-accent">.</span>
        </span>
        <span className="hidden md:inline">Phnom Penh — Cambodia</span>
        <span>Loading</span>
      </motion.div>

      <motion.div
        className="flex items-end justify-between gap-6"
        animate={wiping ? { opacity: 0, y: -60 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="mb-4 max-w-[16ch] text-sm leading-snug text-muted md:mb-6">
          IT Instructor &amp; Full-Stack Web Developer
        </span>
        <span className="display text-[clamp(4.5rem,18vw,14rem)] leading-none tabular-nums text-fg">
          {count}
          <span className="serif-accent align-super text-[0.28em]">%</span>
        </span>
      </motion.div>

      <div className="relative h-px w-full overflow-hidden bg-line">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: `${count}%`, boxShadow: "0 0 16px var(--glow)" }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <span className="sr-only">{profile.name} portfolio loading</span>
    </motion.div>
  );
}
