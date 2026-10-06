import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function TiltCard({ children, className = "", max = 10, glare = false, ...rest }) {
  const ref = useRef(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const tiltEnabled = finePointer && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 120, damping: 18, mass: 0.5 });
  const springY = useSpring(py, { stiffness: 120, damping: 18, mass: 0.5 });

  const rotateX = useTransform(springY, [0, 1], [max, -max]);
  const rotateY = useTransform(springX, [0, 1], [-max, max]);
  const glarePos = useTransform([springX, springY], ([gx, gy]) => `${gx * 100}% ${gy * 100}%`);
  const glareBackground = useTransform(
    glarePos,
    (pos) => `radial-gradient(420px circle at ${pos}, rgba(255,255,255,0.14), transparent 65%)`
  );

  const onMouseMove = (event) => {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
      {...rest}
    >
      {children}
      {glare && tiltEnabled && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
