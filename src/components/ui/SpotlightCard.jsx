import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function SpotlightCard({ children, className = "", radius = 480, ...rest }) {
  const ref = useRef(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const x = useSpring(mx, { stiffness: 180, damping: 24, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 24, mass: 0.4 });

  const background = useTransform([x, y], ([px, py]) =>
    `radial-gradient(${radius}px circle at ${px}px ${py}px, var(--glow-soft), transparent 70%)`
  );

  const onMouseMove = (event) => {
    if (reduced || !finePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  };

  const onMouseLeave = () => {
    mx.set(-9999);
    my.set(-9999);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden ${className}`}
      {...rest}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
