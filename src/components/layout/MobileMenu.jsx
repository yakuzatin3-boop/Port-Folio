import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { EASE, STAGGER } from "../../lib/easing";
import { scrollTo, stopLenis, startLenis } from "../../lib/lenis";
import { navLinks, profile } from "../../data/profile";
import { socials } from "../../data/socials";
import StatusDot from "../ui/StatusDot";

const TAU = Math.PI * 2;

/* Seeded random so the galaxy looks the same on every render. */
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rand = makeRandom(20261108);

const STAR_TINTS = ["#ffffff", "#ffd9a8", "#c9b3ff", "#9fe8ff"];

/* A spiral galaxy: stars laid out along three arms, in % of the rotating layer. */
const GALAXY = Array.from({ length: 150 }, (_, i) => {
  const arm = i % 3;
  const t = Math.pow(rand(), 0.75);
  const angle = (arm * TAU) / 3 + t * 3.4 + (rand() - 0.5) * 0.55;
  const r = 5 + t * 45;
  return {
    left: 50 + Math.cos(angle) * r,
    top: 50 + Math.sin(angle) * r,
    size: 1 + rand() * 2.2,
    tint: STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)],
    twinkle: i % 4 === 0,
    duration: 1.6 + rand() * 2.6,
    delay: rand() * 3,
  };
});

/* The iris opens and closes from where the close button sits (top right). */
const IRIS_ORIGIN = "calc(100% - 44px) 44px";
const IRIS_CLOSED = `circle(0% at ${IRIS_ORIGIN})`;
const IRIS_OPEN = `circle(150% at ${IRIS_ORIGIN})`;

export default function MobileMenu({ open, onClose }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      stopLenis();
    } else {
      document.body.classList.remove("no-scroll");
      startLenis();
    }
    return () => {
      document.body.classList.remove("no-scroll");
      startLenis();
    };
  }, [open]);

  const go = (event, href) => {
    event.preventDefault();
    onClose();
    setTimeout(() => scrollTo(href, { offset: -40 }), 420);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[80] overflow-hidden bg-bg lg:hidden"
          initial={{ clipPath: IRIS_CLOSED }}
          animate={{ clipPath: IRIS_OPEN }}
          exit={{ clipPath: IRIS_CLOSED }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* ------------------------------------------------------------
           * Background: spiral galaxy + black hole (decorative only)
           * ---------------------------------------------------------- */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* Deep space tint */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 85%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(255,140,60,0.16), transparent 50%)",
              }}
            />

            {/* Rotating galaxy: nebula arms + stars */}
            <motion.div
              className="absolute left-1/2 top-1/2 -ml-[55vmax] -mt-[55vmax] h-[110vmax] w-[110vmax]"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 240, ease: "linear", repeat: Infinity }}
            >
              <div
                className="absolute inset-0 rounded-full blur-[40px]"
                style={{
                  opacity: 0.55,
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.45) 50deg, transparent 120deg, rgba(139,92,246,0.5) 190deg, rgba(125,225,255,0.3) 245deg, transparent 300deg, rgba(255,150,70,0.3) 345deg)",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 4%, #000 22%, #000 40%, transparent 70%)",
                  maskImage:
                    "radial-gradient(circle, transparent 4%, #000 22%, #000 40%, transparent 70%)",
                }}
              />
              {GALAXY.map((star, i) =>
                star.twinkle && !reduceMotion ? (
                  <motion.span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      width: star.size,
                      height: star.size,
                      background: star.tint,
                      boxShadow: `0 0 ${star.size * 3}px ${star.tint}`,
                    }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                    transition={{
                      duration: star.duration,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: star.delay,
                    }}
                  />
                ) : (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      width: star.size,
                      height: star.size,
                      background: star.tint,
                      opacity: 0.55,
                    }}
                  />
                )
              )}
            </motion.div>

            {/* Black hole with a spinning accretion ring (partly off screen) */}
            <div className="absolute -right-[24vmin] top-[16%] h-[64vmin] w-[64vmin]">
              <motion.span
                className="absolute inset-0 rounded-full blur-[10px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.95) 60deg, transparent 130deg, rgba(139,92,246,0.9) 210deg, rgba(125,225,255,0.5) 260deg, transparent 310deg, rgba(255,150,70,0.6) 350deg)",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 46%, #000 56%, transparent 76%)",
                  maskImage: "radial-gradient(circle, transparent 46%, #000 56%, transparent 76%)",
                }}
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              />
              <span
                className="absolute inset-[22%] rounded-full bg-black"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(255,170,90,0.8), 0 0 40px 8px rgba(255,120,60,0.45), 0 0 90px 20px rgba(139,92,246,0.3)",
                }}
              />
            </div>
          </div>

          {/* ------------------------------------------------------------
           * Foreground content
           * ---------------------------------------------------------- */}
          <div className="relative z-10 flex h-full flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-[15px] font-bold uppercase tracking-[-0.04em]">
                VUTHIN
                <span
                  className="text-accent"
                  style={{ textShadow: "0 0 10px rgba(255,150,70,0.9)" }}
                >
                  .
                </span>
              </span>
              <motion.button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                whileTap={{ scale: 0.88, rotate: 90 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-glass text-fg transition-colors duration-300 hover:border-line-hover"
                style={{
                  boxShadow:
                    "inset 0 0 10px rgba(168,85,247,0.35), 0 0 16px rgba(255,120,60,0.3)",
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            <nav aria-label="Mobile" className="my-auto w-full">
              {navLinks.map((link, index) => (
                <div
                  key={link.href}
                  className="overflow-hidden border-b border-line py-4 first:border-t"
                >
                  <motion.a
                    href={link.href}
                    onClick={(event) => go(event, link.href)}
                    className="flex items-baseline justify-between gap-4"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    whileTap={{ x: 10 }}
                    transition={{
                      delay: 0.25 + index * STAGGER.base,
                      duration: 0.7,
                      ease: EASE,
                    }}
                  >
                    <span className="display text-[clamp(2rem,10vw,3.25rem)] text-fg">
                      {link.label}
                    </span>
                    <span
                      className="mono-label text-accent"
                      style={{ textShadow: "0 0 10px rgba(255,150,70,0.7)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
            >
              <StatusDot label={profile.status} />
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
              <div className="flex flex-wrap items-center gap-5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
                  >
                    {social.mono}
                    <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}