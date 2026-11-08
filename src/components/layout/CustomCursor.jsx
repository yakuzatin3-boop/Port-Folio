import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMousePosition from "../../hooks/useMousePosition";
import useReducedMotion from "../../hooks/useReducedMotion";

const TAU = Math.PI * 2;
const MAX_PARTICLES = 220;
const STAR_TINTS = ["255,249,235", "255,151,59", "168,120,255", "125,225,255"];

/* Stars orbiting the cursor on two rings (the "galaxy"). */
const ORBIT_STARS = [
  { radius: 31, start: 0, size: 2, duration: 6, reverse: false, tint: "#ffffff", twinkle: 1.6 },
  { radius: 31, start: 120, size: 1.5, duration: 6, reverse: false, tint: "#ffd9a8", twinkle: 2.1 },
  { radius: 31, start: 240, size: 2, duration: 6, reverse: false, tint: "#c9b3ff", twinkle: 1.9 },
  { radius: 39, start: 60, size: 1.5, duration: 10, reverse: true, tint: "#9fe8ff", twinkle: 2.4 },
  { radius: 39, start: 150, size: 2, duration: 10, reverse: true, tint: "#ffffff", twinkle: 1.5 },
  { radius: 39, start: 230, size: 1.5, duration: 10, reverse: true, tint: "#ffd9a8", twinkle: 2.2 },
  { radius: 39, start: 320, size: 1, duration: 10, reverse: true, tint: "#c9b3ff", twinkle: 1.8 },
];

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const { x, y, rawX, rawY, enabled } = useMousePosition({
    stiffness: 200,
    damping: 22,
    mass: 0.6,
  });

  const [variant, setVariant] = useState("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const canvasRef = useRef(null);
  const visibleRef = useRef(false);

  /* ------------------------------------------------------------------------
   * Cursor state: visibility, hover variant, pressed.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!enabled || reduced) {
      document.body.classList.remove("has-cursor");
      return undefined;
    }

    document.body.classList.add("has-cursor");

    const onMove = () => {
      visibleRef.current = true;
      setVisible(true);
    };
    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
      setPressed(false);
    };
    const onOver = (event) => {
      const target = event.target.closest?.("[data-cursor]");
      setVariant(target ? target.dataset.cursor : "default");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver);
    };
  }, [enabled, reduced]);

  /* ------------------------------------------------------------------------
   * Stardust: a canvas that leaves a twinkling trail and bursts on click.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!enabled || reduced) return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const spawn = (px, py, { speed, life, drag, size }) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const angle = Math.random() * TAU;
      const velocity = speed * (0.4 + Math.random() * 0.8);
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life * (0.7 + Math.random() * 0.6),
        age: 0,
        drag,
        size: size * (0.6 + Math.random() * 0.9),
        tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
        twinkle: Math.random() * TAU,
      });
    };

    const onDown = () => {
      if (!visibleRef.current) return;
      const px = rawX.get();
      const py = rawY.get();
      for (let i = 0; i < 26; i += 1) {
        spawn(px, py, { speed: 240, life: 0.75, drag: 3, size: 2.2 });
      }
    };
    window.addEventListener("pointerdown", onDown, { passive: true });

    let last = { x: rawX.get(), y: rawY.get() };
    let lastTime = performance.now();
    let raf = 0;

    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const px = rawX.get();
      const py = rawY.get();
      const moved = Math.hypot(px - last.x, py - last.y);
      if (visibleRef.current && moved > 1.5) {
        const count = Math.min(3, 1 + Math.floor(moved / 14));
        for (let i = 0; i < count; i += 1) {
          const t = (i + 1) / count;
          spawn(last.x + (px - last.x) * t, last.y + (py - last.y) * t, {
            speed: 26,
            life: 0.7,
            drag: 1.5,
            size: 1.6,
          });
        }
      }
      last = { x: px, y: py };

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        const damping = Math.max(0, 1 - p.drag * dt);
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.age / p.life;
        const twinkle = 0.6 + 0.4 * Math.sin(p.twinkle + p.age * 16);
        const alpha = (1 - progress) ** 1.5 * twinkle;
        const size = p.size * (1 - progress * 0.5);

        context.shadowColor = `rgba(${p.tint},0.9)`;
        context.shadowBlur = size * 4;
        context.fillStyle = `rgba(${p.tint},${alpha})`;
        context.beginPath();
        context.arc(p.x, p.y, size, 0, TAU);
        context.fill();

        // Four-point sparkle on the bigger stars.
        if (p.size > 1.8) {
          const arm = size * 3 * (1 - progress);
          context.shadowBlur = 0;
          context.strokeStyle = `rgba(${p.tint},${alpha * 0.8})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(p.x - arm, p.y);
          context.lineTo(p.x + arm, p.y);
          context.moveTo(p.x, p.y - arm);
          context.lineTo(p.x, p.y + arm);
          context.stroke();
        }
      }
      context.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [enabled, reduced, rawX, rawY]);

  if (!enabled || reduced) return null;

  const isView = variant === "view";
  const isLink = variant === "link";
  const baseScale = isView ? 2.3 : isLink ? 1.55 : 1;
  const ringScale = pressed ? baseScale * 0.78 : baseScale;

  return (
    <div className="pointer-events-none fixed inset-0 z-[110]" aria-hidden>
      {/* Stardust trail + click burst */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Exact pointer: a tiny event horizon with a glowing rim */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: rawX, y: rawY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.span
          className="absolute -ml-[5px] -mt-[5px] block h-2.5 w-2.5 rounded-full bg-black"
          style={{
            boxShadow:
              "0 0 0 1.5px rgba(255,170,90,0.95), 0 0 10px rgba(255,150,70,0.9), 0 0 18px rgba(139,92,246,0.55)",
          }}
          animate={{ scale: isView || isLink ? 0 : pressed ? 0.7 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>

      {/* Following ring: accretion glow + orbiting galaxy stars */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="absolute -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border"
          style={{
            borderColor: "rgba(255,170,90,0.55)",
            boxShadow:
              "inset 0 0 12px rgba(168,85,247,0.35), 0 0 16px rgba(255,120,60,0.25)",
          }}
          animate={{
            scale: ringScale,
            backgroundColor: isView
              ? "rgba(255, 176, 96, 0.95)"
              : isLink
                ? "rgba(6, 3, 14, 0.4)"
                : "rgba(6, 3, 14, 0.18)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Rotating orange / violet / cyan accretion glow */}
          <motion.span
            className="absolute -inset-2 rounded-full blur-[5px]"
            style={{
              opacity: isView ? 0.4 : 0.85,
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.9) 60deg, transparent 130deg, rgba(139,92,246,0.85) 210deg, rgba(125,225,255,0.5) 260deg, transparent 310deg, rgba(255,150,70,0.55) 350deg)",
              WebkitMaskImage: "radial-gradient(circle, transparent 55%, #000 70%, transparent 100%)",
              maskImage: "radial-gradient(circle, transparent 55%, #000 70%, transparent 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: isLink ? 2.2 : 4.5, ease: "linear", repeat: Infinity }}
          />

          {/* Galaxy: stars orbiting the cursor */}
          {ORBIT_STARS.map((star, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              initial={{ rotate: star.start }}
              animate={{ rotate: star.start + (star.reverse ? -360 : 360) }}
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
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.3, 0.7] }}
                transition={{
                  duration: star.twinkle,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
              />
            </motion.span>
          ))}

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