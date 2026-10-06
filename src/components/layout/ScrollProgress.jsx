import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
      }}
      aria-hidden
    />
  );
}
