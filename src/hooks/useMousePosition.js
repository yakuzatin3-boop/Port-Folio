import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import useMediaQuery from "./useMediaQuery";

export default function useMousePosition(springConfig = { stiffness: 220, damping: 26, mass: 0.6 }) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, x, y]);

  return { x: springX, y: springY, rawX: x, rawY: y, enabled: finePointer };
}
