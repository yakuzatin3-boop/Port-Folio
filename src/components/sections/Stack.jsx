import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, SPRING_SNAP } from "../../lib/easing";
import SectionHeading from "../ui/SectionHeading";
import TechChip from "../ui/TechChip";
import GlassCard from "../ui/GlassCard";
import { stackGroups, filters, totalTechnologies } from "../../data/stack";

const cardVariant = (index) => ({
  hidden: { opacity: 0, y: 36, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE, delay: index * 0.08 },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    transition: { duration: 0.35, ease: EASE },
  },
});

const spans = {
  frontend: "md:col-span-2 lg:col-span-7",
  backend: "md:col-span-1 lg:col-span-5",
  database: "md:col-span-1 lg:col-span-4",
  tools: "md:col-span-2 lg:col-span-8",
};

export default function Stack() {
  const [active, setActive] = useState("all");

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
          aside={`${totalTechnologies} technologies`}
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
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={SPRING_SNAP}
                    />
                  )}
                  <span
                    className={`mono-label relative z-10 transition-colors duration-300 ${
                      isActive ? "text-[#0A0A0A]" : "text-muted hover:text-fg"
                    }`}
                  >
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {groups.map((group, index) => (
              <motion.article
                key={group.id}
                layout
                variants={cardVariant(index)}
                initial="hidden"
                whileInView="show"
                exit="hidden"
                viewport={{ once: true, amount: 0.12 }}
                transition={{ layout: { duration: 0.55, ease: EASE } }}
                className={active === "all" ? spans[group.id] : "md:col-span-2 lg:col-span-12"}
              >
                <GlassCard interactive={false} className="flex h-full flex-col p-6 md:p-7">
                  <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="mono-label text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.04em] text-fg md:text-[1.75rem]">
                        {group.title}
                      </h3>
                    </div>
                    <span className="mono-label rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-muted tabular-nums">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </header>

                  <motion.ul
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="flex flex-wrap gap-2.5"
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
