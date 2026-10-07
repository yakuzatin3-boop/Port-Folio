import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { EASE, SPRING_SNAP } from "../../lib/easing";
import SectionHeading from "../ui/SectionHeading";
import HoverRevealList from "../ui/HoverRevealList";
import { projects, moreWork } from "../../data/projects";
import { githubUrl } from "../../data/socials";
import TiltCard from "../ui/TiltCard";

const views = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
];

function ProjectCard({ project, index }) {
  return (
    <TiltCard
      as="a"
      href={project.href ?? "#contact"}
      target={project.href ? "_blank" : undefined}
      rel={project.href ? "noreferrer" : undefined}
      aria-label={`${project.title} (opens in a new tab)`}
      data-cursor="view"
      className={`group block ${index % 2 === 1 ? "lg:mt-20" : ""}`}
      image={project.image}
      srcset={project.srcset}
      fallback={project.fallback}
      blur={project.blur}
      alt={project.alt || project.title}
      index={index}
      accent={project.accent}
      hasLive={!!project.live}
      indexBadge={project.index}
      year={project.year}
      arrowIcon={<ArrowUpRight size={17} />}
    >
      <div className="min-w-0">
        <span className="mono-label text-muted">{project.type}</span>
        <h3 className="mt-3 font-display text-[clamp(1.35rem,2.4vw,2rem)] font-bold uppercase tracking-[-0.04em] text-fg transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="mono-label rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-muted transition-colors duration-300 group-hover:border-line-hover"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

export default function Projects() {
  const [view, setView] = useState("grid");

  return (
    <section id="projects" className="relative section-pad scroll-mt-32">
      <div className="container-x">
        <SectionHeading index="03" label="PROJECTS" line1="SELECTED" accent="work." />

        <div className="mb-10 flex items-center justify-between gap-4">
          <p className="mono-label text-muted">2025 — 2026</p>

          <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface p-1.5">
            {views.map((option) => {
              const isActive = view === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setView(option.id)}
                  aria-label={`${option.label} view`}
                  aria-pressed={isActive}
                  data-cursor="link"
                  className="relative flex items-center gap-2 rounded-full px-3.5 py-2"
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-view"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={SPRING_SNAP}
                    />
                  )}
                  <Icon
                    size={13}
                    className={`relative z-10 ${isActive ? "text-[#0A0A0A]" : "text-muted"}`}
                  />
                  <span
                    className={`mono-label relative z-10 ${
                      isActive ? "text-[#0A0A0A]" : "text-muted hover:text-fg"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-2"
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <HoverRevealList
                items={projects.map((project) => ({
                  id: project.id,
                  title: project.title,
                  year: project.year,
                  type: project.type,
                  image: project.image,
                  href: project.href ?? "#contact",
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 border-t border-line pt-10 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mono-label text-muted">MORE WORK</p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.4rem)] font-bold uppercase tracking-[-0.04em] text-fg">
                SELECTED <span className="serif-accent">work all.</span>
              </h3>
            </div>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="mono-label group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-muted transition-colors duration-300 hover:border-line-hover hover:text-fg"
            >
              {moreWork.length} MORE REPOS
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
          >
            {moreWork.map((project, index) => (
              <TiltCard
                key={project.id}
                as="a"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} (opens in a new tab)`}
                data-cursor="view"
                className="group block"
                image={project.image}
                srcset={project.srcset}
                fallback={project.fallback}
                blur={project.blur}
                alt={project.alt || project.title}
                index={index}
                accent={project.accent}
                hasLive={!!project.live}
                indexBadge={String(index + 7).padStart(2, "0")}
                year={project.year}
                arrowIcon={<ArrowUpRight size={17} />}
              >
                <div className="min-w-0">
                  <span className="mono-label text-muted">{project.type}</span>
                  <h3 className="mt-3 font-display text-[clamp(1.25rem,2vw,1.75rem)] font-bold uppercase tracking-[-0.04em] text-fg transition-colors duration-300 group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <li
                        key={tag}
                        className="mono-label rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-muted transition-colors duration-300 group-hover:border-line-hover"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
