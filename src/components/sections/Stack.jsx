import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, SPRING_SNAP } from "../../lib/easing";
import SectionHeading from "../ui/SectionHeading";
import TechChip from "../ui/TechChip";
import GlassCard from "../ui/GlassCard";
import { stackGroups, filters, totalTechnologies } from "../../data/stack";

const cardVariant = (index, reduced) => ({
  hidden: reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 36, scale: 0.97, filter: "blur(14px)" },
  show: reduced
    ? { opacity: 1, transition: { duration: 0.4, ease: EASE } }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: EASE, delay: index * 0.08 },
      },
  exit: reduced
    ? { opacity: 0, transition: { duration: 0.25 } }
    : {
        opacity: 0,
        y: -20,
        scale: 0.97,
        filter: "blur(10px)",
        transition: { duration: 0.35, ease: EASE },
      },
});

const chipListVariant = (reduced) => ({
  hidden: {},
  show: {
    transition: reduced
      ? { staggerChildren: 0 }
      : { staggerChildren: 0.04, delayChildren: 0.12 },
  },
});

/** Counts up to `value` when it scrolls into view (static when reduced motion). */
function CountUp({ value, duration = 1200 }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) return undefined;

    const startCount = () => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      startCount();
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        startCount();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? value : display}
    </span>
  );
}

export default function Stack() {
  const [active, setActive] = useState("all");
  const reduced = useReducedMotion();

  const groups =
    active === "all" ? stackGroups : stackGroups.filter((group) => group.tab === active);

  return (
    <section id="skills" className="relative section-pad scroll-mt-32">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="SKILLS"
          line1="THE STACK"
          accent="behind the work."
          aside={
            <>
              <CountUp value={totalTechnologies} /> technologies
            </>
          }
        />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="mono-label max-w-md text-muted">
            Tools I reach for daily — from interface work to APIs, data and delivery.
          </p>

          <div
            role="tablist"
            aria-label="Filter technologies"
            className="flex flex-wrap items-center gap-1.5 rounded-full border border-line bg-surface p-1.5"
          >
            {filters.map((filter) => {
              const isActive = active === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(filter.id)}
                  data-cursor="link"
                  className="relative rounded-full px-3.5 py-2"
                >
                  {isActive && (
                    <motion.span
                      layoutId="stack-filter"
                      className="absolute inset-0 rounded-full bg-accent shadow-[0_10px_24px_-14px_var(--glow)]"
                      transition={SPRING_SNAP}
                    />
                  )}
                  <span
                    className={`mono-label relative z-10 transition-colors duration-300 ${
                      isActive ? "" : "text-muted hover:text-fg"
                    }`}
                    style={isActive ? { color: "var(--ink-on-accent)" } : undefined}
                  >
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {groups.map((group, index) => (
              <motion.article
                key={group.id}
                layout
                variants={cardVariant(index, reduced)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
                viewport={{ once: true, amount: 0.12 }}
                whileHover={
                  reduced
                    ? undefined
                    : {
                        y: -6,
                        transition: { type: "spring", stiffness: 260, damping: 24 },
                      }
                }
                transition={{ layout: { duration: 0.55, ease: EASE } }}
                className={active === "all" ? "" : "md:col-span-2"}
              >
                <GlassCard
                  style={{ borderRadius: 28 }}
                  className="group/card relative flex h-full flex-col overflow-hidden p-6 shadow-[0_34px_54px_-44px_rgba(11,18,32,0.55)] transition-shadow duration-500 hover:shadow-[0_46px_70px_-44px_rgba(11,18,32,0.62)] md:p-7"
                >
                  {/* accent glow, fades in on card hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-accent/15 opacity-0 blur-[64px] transition-opacity duration-500 group-hover/card:opacity-100"
                  />

                  <header className="relative mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="mono-label text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mono-label text-[color:var(--teal)]">
                          {group.eyebrow}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.04em] text-fg md:text-[1.75rem]">
                        {group.title}
                      </h3>
                    </div>
                    <span className="mono-label rounded-chip bg-surface-2 px-2.5 py-1.5 text-muted tabular-nums transition-colors duration-300 group-hover/card:bg-accent/15 group-hover/card:text-fg">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </header>

                  <motion.ul
                    variants={chipListVariant(reduced)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="relative flex flex-wrap gap-3"
                  >
                    {group.items.map((item) => (
                      <TechChip key={item.name} item={item} />
                    ))}
                  </motion.ul>
                </GlassCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
