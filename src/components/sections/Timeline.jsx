import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { timeline } from "../../data/timeline";
import { EASE } from "../../lib/easing";

function TimelineItem({ entry, index }) {
  const isEducation = entry.kind === "education";
  const Icon = isEducation ? GraduationCap : Briefcase;

  return (
    <motion.article
      className="relative"
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.06 }}
    >
      <span
        aria-hidden
        className="absolute -left-9 top-1.5 block h-3 w-3 rounded-full bg-accent"
        style={{ boxShadow: "0 0 0 4px var(--bg), 0 0 20px var(--glow)" }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="mono-label text-accent">{entry.period}</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
        <span className="mono-label inline-flex items-center gap-1.5 text-muted">
          <Icon size={12} />
          {isEducation ? "Education" : "Experience"}
        </span>
      </div>

      <h3 className="mt-5 font-display text-[clamp(1.5rem,3.2vw,2.35rem)] font-bold uppercase tracking-[-0.04em] text-fg">
        {entry.title}
      </h3>

      <p className="mt-2.5 text-sm font-medium text-accent">
        {entry.org}
        <span className="text-muted"> · {entry.place}</span>
      </p>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{entry.summary}</p>

      {entry.bullets.length > 0 ? (
        <ul className="mt-6 space-y-3.5 border-l border-line pl-5">
          {entry.bullets.map((bullet) => (
            <li key={bullet} className="relative text-sm leading-relaxed text-muted">
              <span
                aria-hidden
                className="absolute -left-5 top-2 block h-1.5 w-1.5 rounded-full bg-accent/70"
              />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.article>
  );
}

export default function Timeline() {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 78%", "end 62%"],
  });

  return (
    <section
      id="experience"
      className="relative section-pad scroll-mt-32 border-t border-line"
    >
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="04"
              label="TIMELINE"
              line1="EXPERIENCE &"
              accent="education."
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Where I teach, what I study, and the work that keeps both honest.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div ref={lineRef} className="relative pl-9">
            <span
              aria-hidden
              className="absolute bottom-2 left-[5.5px] top-2 w-px bg-line"
            />
            <motion.span
              aria-hidden
              className="absolute bottom-2 left-[5.5px] top-2 w-px origin-top bg-accent"
              style={{ scaleY: scrollYProgress, boxShadow: "0 0 14px var(--glow)" }}
            />

            <div className="space-y-14 md:space-y-16">
              {timeline.map((entry, index) => (
                <TimelineItem key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
