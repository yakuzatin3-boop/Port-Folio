import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "../../lib/easing";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function HoverRevealList({ items = [] }) {
  const [active, setActive] = useState(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 });

  const onMouseMove = (event) => {
    mx.set(event.clientX);
    my.set(event.clientY);
  };

  return (
    <div className="relative" onMouseMove={enabled ? onMouseMove : undefined}>
      <div className="border-t border-line">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={item.href ?? "#projects"}
            target={item.href?.startsWith("http") ? "_blank" : undefined}
            rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
            data-cursor="view"
            onMouseEnter={() => setActive(item)}
            onMouseLeave={() => setActive(null)}
            className="group relative flex items-center gap-6 border-b border-line py-7 md:gap-10 md:py-9"
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="relative flex-1 overflow-hidden">
              <motion.span
                className="block text-[clamp(1.5rem,4.5vw,3rem)] font-medium tracking-tight text-muted transition-colors duration-300 group-hover:text-fg"
                initial={false}
                animate={{ x: active?.id === item.id ? 16 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {item.title}
              </motion.span>
            </span>

            <span className="hidden text-xs uppercase tracking-[0.2em] text-muted md:block">{item.year}</span>

            <ArrowUpRight
              size={22}
              className="shrink-0 text-muted transition-all duration-400 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
            />
          </a>
        ))}
      </div>

      <AnimatePresence>
        {enabled && active && (
          <motion.div
            key="preview"
            className="pointer-events-none fixed left-0 top-0 z-[75]"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-line">
              <img src={active.image} alt="" className="h-[230px] w-full object-cover" draggable={false} />
              <div className="glass-strong flex items-center justify-between gap-4 px-4 py-3">
                <span className="truncate text-xs text-fg">{active.type}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent">{active.year}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
