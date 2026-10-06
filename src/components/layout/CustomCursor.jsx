import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMousePosition from "../../hooks/useMousePosition";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const { x, y, rawX, rawY, enabled } = useMousePosition({
    stiffness: 200,
    damping: 22,
    mass: 0.6,
  });

  const [variant, setVariant] = useState("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || reduced) {
      document.body.classList.remove("has-cursor");
      return undefined;
    }

    document.body.classList.add("has-cursor");

    const onMove = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onOver = (event) => {
      const target = event.target.closest?.("[data-cursor]");
      setVariant(target ? target.dataset.cursor : "default");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver);
    };
  }, [enabled, reduced]);

  if (!enabled || reduced) return null;

  const isView = variant === "view";
  const isLink = variant === "link";
  const ringScale = isView ? 2.3 : isLink ? 1.55 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[110]" aria-hidden>
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: rawX, y: rawY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.span
          className="absolute -ml-[3px] -mt-[3px] block h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ scale: isView || isLink ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>

      <motion.div
        className="absolute left-0 top-0"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="absolute -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-accent/70"
          animate={{
            scale: ringScale,
            backgroundColor: isView ? "rgba(163, 230, 53, 0.95)" : "rgba(163, 230, 53, 0)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <AnimatePresence>
            {isView && (
              <motion.span
                className="absolute font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#0A0A0A]"
                initial={{ opacity: 0, scale: 1.9 }}
                animate={{ opacity: 1, scale: 0.42 }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.25 }}
              >
                View
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
