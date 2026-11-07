import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../lib/easing";
import { stopLenis, startLenis } from "../../lib/lenis";
import useReducedMotion from "../../hooks/useReducedMotion";
import { profile } from "../../data/profile";

const EXIT_EASE = [0.76, 0, 0.24, 1];

export default function Preloader({ onComplete, onExitStart }) {
  const [count, setCount] = useState(0);
  const [wiping, setWiping] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    stopLenis();

    let rafId;
    let started = null;

    const tick = (time) => {
      if (started === null) started = time;
      const duration = reduced ? 350 : 1500;
      const progress = Math.min((time - started) / duration, 1);
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

  useEffect(() => {
    if (wiping) onExitStart?.();
  }, [wiping, onExitStart]);

  return (
    <motion.div
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-bg px-6 py-8 md:px-12 md:py-10"
      initial={{ y: 0, opacity: 1 }}
      animate={wiping ? (reduced ? { y: 0, opacity: 0 } : { y: "-100%" }) : { y: 0, opacity: 1 }}
      transition={{ duration: wiping ? (reduced ? 0.35 : 0.9) : 0, ease: reduced ? EASE : EXIT_EASE }}
      onAnimationComplete={() => {
        if (wiping) onComplete?.();
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="preloader-blob preloader-blob-1" />
        <span className="preloader-blob preloader-blob-2" />
        <span className="preloader-blob preloader-blob-3" />
        <span className="preloader-blob preloader-blob-4" />
        <div className="preloader-grain" />
      </div>

      <motion.div
        className="mono-label relative z-20 flex items-center justify-between text-muted"
        animate={{ opacity: wiping ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <span className="font-display text-sm font-bold tracking-[-0.04em] text-fg">
          VUTHIN<span className="text-accent">.</span>
        </span>
        <span className="hidden md:inline">Phnom Penh — Cambodia</span>
        <span>Loading</span>
      </motion.div>

      <motion.span
        className="preloader-count display absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-[clamp(3.25rem,15vw,5.5rem)] leading-none tabular-nums text-fg md:left-auto md:right-12 md:translate-x-0 md:text-[clamp(3.5rem,9vw,9rem)] lg:text-[clamp(4.5rem,13.5vw,12.5rem)]"
        animate={{ opacity: wiping ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {count}
        <span className="serif-accent align-super text-[0.28em]">%</span>
      </motion.span>

      <motion.div
        className="relative z-20 mt-auto flex items-end justify-between gap-6"
        animate={wiping ? { opacity: 0, y: -60 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="mb-4 max-w-[16ch] md:mb-6">
          <span className="mb-3 block size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--glow)]" />
          <span className="block text-sm leading-snug text-muted">IT Instructor &amp; Full-Stack Web Developer</span>
        </div>
      </motion.div>

      <div className="relative z-20 h-px w-full overflow-hidden bg-line">
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
