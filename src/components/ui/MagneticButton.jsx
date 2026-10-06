import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  href,
  onClick,
  as = "button",
  ...rest
}) {
  const ref = useRef(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.8 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const enabled = finePointer && !reduced;

  const onMouseMove = (event) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px * rect.width * strength);
    y.set(py * rect.height * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : as === "span" ? motion.span : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY, rotateX, rotateY, transformPerspective: 800 }}
      whileHover={enabled ? { scale: 1.05 } : undefined}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
