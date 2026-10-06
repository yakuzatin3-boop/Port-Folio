import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { EASE, DURATION } from "../../lib/easing";
import useReducedMotion from "../../hooks/useReducedMotion";

const THEME_COLORS = { dark: "#0A0A0A", light: "#F6F6F2" };

export default function ThemeToggle({ className = "" }) {
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("light")
      ? "light"
      : "dark"
  );
  const [reveal, setReveal] = useState(null);

  const apply = (next) => {
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next !== "light");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const toggle = (event) => {
    const next = theme === "dark" ? "light" : "dark";

    if (reduced) {
      apply(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setReveal({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, next });
  };

  const isLight = theme === "light";

  return (
    <>
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-glass text-fg transition-colors duration-300 hover:border-line-hover ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ y: 14, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 45 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {reveal && (
          <motion.div
            key="theme-reveal"
            className="pointer-events-none fixed inset-0 z-[95]"
            initial={{ clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${reveal.x}px ${reveal.y}px)` }}
            transition={{ duration: DURATION.slow, ease: EASE }}
            onAnimationComplete={() => {
              apply(reveal.next);
              setReveal(null);
            }}
            style={{ backgroundColor: THEME_COLORS[reveal.next] }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
