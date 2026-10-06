import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE } from "../../lib/easing";
import { scrollToTop } from "../../lib/lenis";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          data-cursor="link"
          onClick={() => scrollToTop()}
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.85 }}
          transition={{ duration: 0.45, ease: EASE }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed bottom-6 right-5 z-[65] grid h-16 w-16 place-items-center rounded-full border border-line bg-glass backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 hover:border-line-hover md:bottom-8 md:right-8"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden>
            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="1.5" />
            <motion.circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <ArrowUp
            size={17}
            className="relative text-fg transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
