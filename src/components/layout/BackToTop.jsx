import { useEffect, useId, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE } from "../../lib/easing";
import { scrollToTop } from "../../lib/lenis";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TAU = Math.PI * 2;

/* Small seeded random so the "galaxy" looks the same on every render. */
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rand = makeRandom(20261108);

/* Stars orbiting the button on three rings, each ring turning at its own speed. */
const STAR_TINTS = ["#ffffff", "#ffd9a8", "#c9b3ff", "#9fe8ff"];
const ORBIT_STARS = Array.from({ length: 24 }, (_, i) => {
  const ring = i % 3;
  return {
    radius: 37 + ring * 8 + rand() * 6,
    start: rand() * 360,
    size: 1 + rand() * 2.2,
    duration: 8 + ring * 6 + rand() * 6,
    reverse: ring === 1,
    twinkle: 1.3 + rand() * 2.2,
    delay: rand() * 2,
    tint: STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)],
  };
});

/* Tiny stars sitting inside the dark core (positions in %). */
const CORE_STARS = [
  { x: 26, y: 30, size: 1.5, delay: 0 },
  { x: 72, y: 24, size: 1, delay: 0.8 },
  { x: 80, y: 62, size: 1.5, delay: 1.5 },
  { x: 30, y: 74, size: 1, delay: 0.4 },
  { x: 58, y: 80, size: 1, delay: 1.1 },
];

/* Particles thrown out when the button is clicked. */
const BURST = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * TAU + rand() * 0.3;
  const distance = 50 + rand() * 46;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 1.5 + rand() * 2.5,
    tint: STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)],
  };
});

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [burst, setBurst] = useState(0);
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (reduceMotion) {
      scrollToTop();
      return;
    }
    setBurst((n) => n + 1);
    // Let the burst be seen for a moment before the page jumps away.
    window.setTimeout(() => scrollToTop(), 140);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          data-cursor="link"
          onClick={handleClick}
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.85 }}
          transition={{ duration: 0.4, ease: EASE }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-6 right-5 z-[65] grid h-16 w-16 place-items-center rounded-full border border-line backdrop-blur-xl transition-colors duration-300 hover:border-line-hover md:bottom-8 md:right-8"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #000 0%, #04020a 52%, rgba(26,12,44,0.9) 100%)",
            boxShadow:
              "inset 0 0 14px rgba(168,85,247,0.35), 0 0 22px rgba(255,120,60,0.28), 0 0 44px rgba(139,92,246,0.18)",
          }}
        >
          {/* Rotating accretion / nebula glow around the core */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-full opacity-70 blur-[6px] transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.85) 60deg, transparent 130deg, rgba(139,92,246,0.8) 210deg, rgba(125,225,255,0.45) 260deg, transparent 310deg, rgba(255,150,70,0.5) 350deg)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 58%, #000 70%, transparent 100%)",
              maskImage: "radial-gradient(circle, transparent 58%, #000 70%, transparent 100%)",
            }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          />

          {/* Galaxy: stars orbiting the black hole */}
          {ORBIT_STARS.map((star, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
              initial={{ rotate: star.start }}
              animate={
                reduceMotion
                  ? undefined
                  : { rotate: star.start + (star.reverse ? -360 : 360) }
              }
              transition={{ duration: star.duration, ease: "linear", repeat: Infinity }}
            >
              <motion.span
                className="absolute rounded-full"
                style={{
                  left: star.radius,
                  top: -star.size / 2,
                  width: star.size,
                  height: star.size,
                  background: star.tint,
                  boxShadow: `0 0 ${star.size * 3}px ${star.tint}`,
                }}
                animate={
                  reduceMotion ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.7, 1.25, 0.7] }
                }
                transition={{
                  duration: star.twinkle,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            </motion.span>
          ))}

          {/* Progress ring with an orange -> violet glow */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb260" />
                <stop offset="55%" stopColor="#ff6a3c" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="1.5" />
            <motion.circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{
                strokeDashoffset: dashOffset,
                filter: "drop-shadow(0 0 4px rgba(255,150,70,0.9))",
              }}
            />
          </svg>

          {/* Tiny stars inside the dark core */}
          {CORE_STARS.map((star, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                boxShadow: "0 0 5px rgba(255,255,255,0.9)",
              }}
              animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + i * 0.4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}

          <ArrowUp
            size={17}
            className="relative text-fg drop-shadow-[0_0_6px_rgba(255,190,120,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5"
          />

          {/* Click burst: shockwave ring + flying particles (replays on every click) */}
          {burst > 0 && (
            <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0">
              <motion.span
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: "rgba(255,190,120,0.95)",
                  boxShadow: "0 0 18px rgba(255,150,70,0.9)",
                }}
                initial={{ scale: 0.7, opacity: 0.9 }}
                animate={{ scale: 3.4, opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: "rgba(168,85,247,0.9)" }}
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              />
              {BURST.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    background: p.tint,
                    boxShadow: `0 0 8px ${p.tint}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              ))}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}