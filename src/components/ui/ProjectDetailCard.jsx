import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import { EASE } from "../../lib/easing";
import { startLenis, stopLenis } from "../../lib/lenis";
import useReducedMotion from "../../hooks/useReducedMotion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Section({ label, children, className = "" }) {
  return (
    <section className={className}>
      <div className="flex items-center gap-3">
        <h3 className="mono-label text-accent">{label}</h3>
        <span className="hairline flex-1" aria-hidden="true" />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Media({ project, accent }) {
  const [loaded, setLoaded] = useState(false);

  // Covers images that finished loading from cache before onLoad was attached.
  const imgRef = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const badge = project.indexBadge ?? project.index;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-surface">
      {project.blur && (
        <img
          src={project.blur}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <img
        ref={imgRef}
        src={project.image}
        srcSet={project.srcset}
        sizes="(max-width: 1024px) 100vw, 560px"
        alt={project.alt || project.title}
        width={1600}
        height={1200}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`relative z-10 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {project.live && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3"
          style={{
            background: "linear-gradient(to top, rgba(5,5,8,0.55) 0%, rgba(5,5,8,0) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {badge && (
        <span className="mono-label absolute left-4 top-4 z-30 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-white backdrop-blur-md">
          {badge}
        </span>
      )}

      {project.live && (
        <span className="mono-label absolute bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-white backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          LIVE
        </span>
      )}
    </div>
  );
}

function Highlights({ features, accent }) {
  return (
    <Section label="Highlights" className="mt-7">
      <ul className="grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
            <span
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border"
              style={{ borderColor: `${accent}55`, backgroundColor: `${accent}14`, color: accent }}
              aria-hidden="true"
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Facts({ project, accent }) {
  const hasDetails = Boolean(project.role || project.status);
  const hasTags = project.tags?.length > 0;
  if (!hasDetails && !hasTags) return null;

  return (
    <div className={`mt-7 grid gap-4 ${hasDetails && hasTags ? "sm:grid-cols-2" : ""}`}>
      {hasDetails && (
        <div className="rounded-card border border-line bg-surface p-4">
          <dl className="space-y-3.5">
            {project.role && (
              <div>
                <dt className="mono-label text-muted">Role</dt>
                <dd className="mt-1.5 text-sm text-fg">{project.role}</dd>
              </div>
            )}
            {project.status && (
              <div>
                <dt className="mono-label text-muted">Status</dt>
                <dd className="mt-1.5 inline-flex items-center gap-2 text-sm text-fg">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}66` }}
                    aria-hidden="true"
                  />
                  {project.status}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {hasTags && (
        <div className="rounded-card border border-line bg-surface p-4">
          <p className="mono-label text-muted">Tech stack</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="mono-label rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Actions({ project }) {
  if (!project.href && !project.live) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-2.5">
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View source for ${project.title} (opens in a new tab)`}
          data-cursor="link"
          className={`group inline-flex flex-1 items-center justify-between gap-3 rounded-full bg-accent px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A] transition-transform duration-300 hover:scale-[1.02] sm:flex-none ${focusRing}`}
        >
          View source
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}

      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Live demo of ${project.title} (opens in a new tab)`}
          data-cursor="link"
          className={`group inline-flex flex-1 items-center justify-between gap-3 rounded-full border border-line bg-surface px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg transition-colors duration-300 hover:border-line-hover sm:flex-none ${focusRing}`}
        >
          Live demo
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog                                                              */
/* ------------------------------------------------------------------ */

export default function ProjectDetailCard({ project, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const reduced = useReducedMotion();
  const uid = useId();

  // Keep the latest onClose without re-running the lifecycle effect when the
  // parent passes a new inline function on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const close = useCallback(() => onCloseRef.current?.(), []);

  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    document.body.classList.add("no-scroll");
    stopLenis();

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (node) => node.getClientRects().length > 0
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.classList.remove("no-scroll");
      startLenis();

      const node = returnFocusRef.current;
      if (node && typeof node.focus === "function") {
        window.setTimeout(() => node.focus({ preventScroll: true }), 0);
      }
    };
  }, [close]);

  const accent = project.accent || "#a3e635";
  const features = project.features ?? [];
  const overview = project.overview || project.description;
  const titleId = `project-detail-${project.id}`;
  const overviewId = `${uid}-overview`;

  // Only close when the click lands on the empty area around the panel.
  const onBackdropClick = (event) => {
    if (event.target === event.currentTarget) close();
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[105] overflow-y-auto overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
      data-lenis-prevent
    >
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" aria-hidden="true" />

      <div
        className="relative flex min-h-full items-start justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6"
        onClick={onBackdropClick}
      >
        {/* No overflow-hidden on the panel: it would break the sticky close button. */}
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={overview ? overviewId : undefined}
          tabIndex={-1}
          className="relative my-auto w-full max-w-6xl rounded-card border border-line bg-bg shadow-[0_40px_120px_-24px_rgba(0,0,0,0.8)] outline-none"
          initial={{ opacity: 0, y: reduced ? 0 : 32, scale: reduced ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.98 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
        >
          {/* Sticky, zero-height rail so Close stays reachable while the dialog scrolls */}
          <div className="sticky top-0 z-40 h-0">
            <div className="flex justify-end px-3 pt-3 sm:px-4 sm:pt-4">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close project details"
                data-cursor="link"
                className={`grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-accent hover:text-[#0A0A0A] ${focusRing}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="p-4 sm:p-6 lg:pr-0">
              <Media project={project} accent={accent} />
            </div>

            <div className="min-w-0 p-5 pt-1 sm:p-8 sm:pt-4 lg:pl-8 lg:pt-9">
              <header>
                {(project.type || project.year) && (
                  <div className="flex flex-wrap items-center gap-2 pr-14">
                    {project.type && <span className="mono-label text-accent">{project.type}</span>}
                    {project.type && project.year && (
                      <span className="h-px w-6 bg-line" aria-hidden="true" />
                    )}
                    {project.year && (
                      <span
                        className="mono-label rounded-full px-2.5 py-1"
                        style={{
                          backgroundColor: `${accent}1f`,
                          border: `1px solid ${accent}55`,
                          color: accent,
                        }}
                      >
                        {project.year}
                      </span>
                    )}
                  </div>
                )}

                <h2
                  id={titleId}
                  className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-fg"
                >
                  {project.title}
                </h2>
              </header>

              {overview && (
                <Section label="Overview" className="mt-6">
                  <p id={overviewId} className="text-[15px] leading-relaxed text-muted">
                    {overview}
                  </p>
                </Section>
              )}

              {features.length > 0 && <Highlights features={features} accent={accent} />}

              <Facts project={project} accent={accent} />

              <Actions project={project} />

              <p className="mono-label mt-5 hidden text-muted/70 lg:block">
                Press <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Esc</kbd> to
                close
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}