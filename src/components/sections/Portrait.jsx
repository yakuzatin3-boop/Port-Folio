import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CodeCard from "../ui/CodeCard";
import useReducedMotion from "../../hooks/useReducedMotion";
import { profile } from "../../data/profile";

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 120, damping: 20 };

export default function Portrait({ sectionRef }) {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef ?? rootRef,
    offset: ["start start", "end start"],
  });

  const [factor, setFactor] = useState(1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const sync = () => setFactor(wide.matches ? 1 : 0.5);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    if (!fine.matches || !wide.matches) return undefined;
    const onMove = (event) => {
      mouseX.set(((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12);
      mouseY.set(((event.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 12);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, mouseX, mouseY]);

  const k = reduced ? 0 : factor;

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -80 * k]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const cardY = useTransform(scrollYProgress, [0, 1], [0, -140 * k]);
  const cardX = useTransform(scrollYProgress, [0, 1], [0, -30 * k]);

  const portraitRotate = useTransform(springX, [-12, 12], [-3, 3]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto h-[60vh] w-full max-w-[420px] lg:h-[85vh] lg:max-w-none"
    >
      {/* Portrait photo */}
      <motion.div
        className="absolute inset-0"
        style={{ y: portraitY, scale: portraitScale, opacity: portraitOpacity }}
      >
        <motion.div className="h-full w-full" style={{ x: springX, y: springY, rotate: portraitRotate }}>
          <motion.div
            className="h-full w-full"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, filter: "blur(12px)" }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: EASE, delay: reduced ? 0 : 0.1 }}
          >
            <img
              src="/profile.png"
              alt={`${profile.name}, ${profile.role}`}
              loading="eager"
              decoding="async"
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
              style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.45))" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Glass code card overlapping the bottom-left */}
      <motion.div
        className="absolute bottom-[6%] left-0 z-10 w-[240px] sm:w-[256px] lg:-left-10 lg:w-[272px]"
        style={{ y: cardY, x: cardX }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.5 }}
        >
          <CodeCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
