import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { EASE, SPRING_SNAP } from "../../lib/easing";
import SectionHeading from "../ui/SectionHeading";
import HoverRevealList from "../ui/HoverRevealList";
import { projects, moreWork } from "../../data/projects";
import { githubUrl } from "../../data/socials";

const views = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
];

function ProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.href ?? "#contact"}
      target={project.href ? "_blank" : undefined}
      rel={project.href ? "noreferrer" : undefined}
      aria-label={`${project.title} (opens in a new tab)`}
      data-cursor="view"
      className={`group block ${index % 2 === 1 ? "lg:mt-20" : ""}`}
      initial={{ opacity: 0, y: 48, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 2) * 0.1 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-surface">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full scale-[1.08] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40"
          aria-hidden
        />

        <span className="mono-label absolute left-4 top-4 rounded-full border border-line bg-glass px-3 py-1.5 backdrop-blur-md">
          {project.index}
        </span>

        <span
          className="mono-label absolute right-4 top-4 rounded-full px-3 py-1.5 backdrop-blur-md"
          style={{ backgroundColor: `${project.accent}1A`, color: project.accent, border: `1px solid ${project.accent}40` }}
        >
          {project.year}
        </span>

        {project.live ? (
          <span className="mono-label absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 text-accent backdrop-blur-md">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            LIVE
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
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

        <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-fg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:border-line-hover group-hover:bg-accent group-hover:text-[#0A0A0A]">
          <ArrowUpRight size={17} />
        </span>
      </div>
    </motion.a>
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

          <ul className="mt-8 border-t border-line">
            {moreWork.map((repo, index) => (
              <li key={repo.id}>
                <motion.a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${repo.title} (opens in a new tab)`}
                  data-cursor="view"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: Math.min(index, 6) * 0.04,
                  }}
                  className="group flex items-center gap-4 border-b border-line px-1 py-4 transition-colors duration-300 hover:bg-surface sm:gap-6 sm:px-3"
                >
                  <span className="mono-label w-7 shrink-0 text-muted transition-colors duration-300 group-hover:text-accent">
                    {String(index + 7).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-bold uppercase tracking-[-0.03em] text-fg transition-colors duration-300 group-hover:text-accent sm:text-lg">
                      {repo.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted sm:text-sm">
                      {repo.description}
                    </span>
                  </span>

                  {repo.live ? (
                    <span className="mono-label hidden shrink-0 items-center gap-2 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-accent sm:inline-flex">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                      LIVE
                    </span>
                  ) : null}

                  <span className="mono-label hidden w-24 shrink-0 text-right text-muted md:block">
                    {repo.language}
                  </span>
                  <span className="mono-label w-10 shrink-0 text-right text-muted">
                    {repo.year}
                  </span>

                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:border-line-hover group-hover:bg-accent group-hover:text-[#0A0A0A]">
                    <ArrowUpRight size={14} />
                  </span>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
