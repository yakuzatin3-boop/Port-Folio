import { useCallback, useEffect, useRef, useState } from "react";
import BlackHoleScene from "../ui/BlackHoleScene";
import { BLACK_HOLE_BLAST_DURATION, createBlackHoleBlast } from "../ui/transitionStages";

/* ============================================================================
 * BlackHoleLoader
 * ----------------------------------------------------------------------------
 * Full-screen black-hole loading screen.
 * - <BlackHoleScene />: canvas stars, lensing glow, rotating accretion disk
 *   and event-horizon core.
 * - createBlackHoleBlast(): the black-hole implosion and explosion.
 * - Tailwind CSS: layout, progress, labels and the loader fade.
 *
 * Phases: "loading" (0-99%) -> "catch" (black-hole blast) ->
 * "flash" (shockwave + fade-out) -> onComplete().
 * ==========================================================================*/

/* --------------------------------------------------------------------------
 * CONFIG — simulated loading and catch/fade timings.
 * (Disk colors/speeds live in BlackHoleScene.)
 * ------------------------------------------------------------------------ */
const CONFIG = {
  speed: {
    simulatedDuration: 3000, // ms for 0 -> 100 when no `progress` prop is given
  },
  catch: {
    stageDurationMs: BLACK_HOLE_BLAST_DURATION,
    flashDelayMs: 100, // delay before the loader fades (lets the flash pop)
    fadeMs: 500, // loader fade-out duration (keep in sync with duration-500 below)
    completeBufferMs: 80, // slack before onComplete() fires
  },
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function BlackHoleLoader({ progress, onComplete }) {
  const hasProgress = progress !== undefined && progress !== null;
  const [simDisplay, setSimDisplay] = useState(0); // counter while simulating
  const [phase, setPhase] = useState("loading"); // "loading" | "catch" | "flash"

  // Derived counter: follows the prop when given, otherwise the simulation.
  const display = hasProgress ? Math.floor(clamp(progress, 0, 100)) : simDisplay;

  const stageCanvasRef = useRef(null);

  const progressRef = useRef(0); // live progress, readable from rAF without re-render
  const phaseRef = useRef("loading");
  const catchStartRef = useRef(0);
  const doneRef = useRef(false);
  const timersRef = useRef([]);
  const onCompleteRef = useRef(onComplete);

  // Keep the callback fresh without re-triggering effects.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Per-frame pull/catch values handed to the canvas scene.
  const getDynamics = useCallback(() => {
    const catchT = catchStartRef.current
      ? clamp((performance.now() - catchStartRef.current) / CONFIG.catch.stageDurationMs, 0, 1)
      : 0;
    return { pull: clamp(progressRef.current, 0, 100) / 100, catchT };
  }, []);

  /* ------------------------------------------------------------------------
   * Phase 2 -> 3: after the canvas sequence, flash and fade out the loader.
   * ---------------------------------------------------------------------- */
  const beginFlash = useCallback(() => {
    if (phaseRef.current !== "catch") return;
    phaseRef.current = "flash";
    setPhase("flash");
    timersRef.current.push(
      window.setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onCompleteRef.current?.();
      }, CONFIG.catch.flashDelayMs + CONFIG.catch.fadeMs + CONFIG.catch.completeBufferMs)
    );
  }, []);

  /* ------------------------------------------------------------------------
   * Phase 1 -> 2: progress hit 100%. Hand the image over to the canvas stage.
   * ---------------------------------------------------------------------- */
  const beginCatch = useCallback(() => {
    if (phaseRef.current !== "loading") return;
    phaseRef.current = "catch";
    catchStartRef.current = performance.now();
    setPhase("catch");

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) beginFlash();
  }, [beginFlash]);

  useEffect(() => {
    if (phase !== "catch") return undefined;
    const canvas = stageCanvasRef.current;
    if (!canvas) {
      beginFlash();
      return undefined;
    }
    const stage = createBlackHoleBlast({ canvas, onDone: beginFlash });
    return () => stage.destroy();
  }, [phase, beginFlash]);

  /* ------------------------------------------------------------------------
   * Progress: either follow the `progress` prop or simulate 0 -> 100%.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    if (hasProgress) {
      const p = clamp(progress, 0, 100);
      progressRef.current = p;
      if (p >= 100) beginCatch();
      return undefined;
    }

    let rafId = 0;
    let lastShown = -1;
    const start = performance.now();

    const step = (now) => {
      const raw = Math.min((now - start) / CONFIG.speed.simulatedDuration, 1);
      const eased = 1 - Math.pow(1 - raw, 2.2);
      // Small non-monotonic stalls so the counter feels like real loading.
      const wiggle = Math.max(0, Math.sin(raw * Math.PI * 5) * 1.4 * (1 - raw));
      progressRef.current = Math.max(progressRef.current, Math.max(0, eased * 100 - wiggle));

      const shown = Math.min(100, Math.floor(progressRef.current));
      if (shown !== lastShown) {
        lastShown = shown;
        setSimDisplay(shown);
      }
      if (progressRef.current >= 100) {
        beginCatch();
        return;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasProgress, progress, beginCatch]);

  /* ------------------------------------------------------------------------
   * Cleanup: timers, scroll lock.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    document.body.classList.add("no-scroll");
    const timers = timersRef.current;
    return () => {
      document.body.classList.remove("no-scroll");
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
    };
  }, []);

  const caught = phase !== "loading";

  return (
    <div
      role="status"
      className={`blackhole-loader fixed inset-0 z-[100] select-none overflow-hidden bg-black transition-opacity delay-100 duration-500 ${
        phase === "flash" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Star field + accretion disk + lensing (shared canvas scene) */}
      <BlackHoleScene className="absolute inset-0 h-full w-full" getDynamics={getDynamics} />

      {/* Rotating soft glow ring (bh-spin) — bigger than before (68vmin -> 90vmin) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-[45vmin] -mt-[45vmin] h-[90vmin] w-[90vmin] animate-bh-spin rounded-full opacity-50 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.5) 55deg, transparent 130deg, rgba(139,92,246,0.45) 210deg, transparent 300deg, rgba(255,150,70,0.3) 350deg)",
          WebkitMaskImage: "radial-gradient(circle, transparent 58%, #000 68%, transparent 84%)",
          maskImage: "radial-gradient(circle, transparent 58%, #000 68%, transparent 84%)",
          filter: "blur(10px)",
        }}
      />

      {/* Decorative CSS sparkles (bh-twinkle) layered over the canvas stars */}
      {[
        { style: { top: "14%", left: "12%" }, delay: "0s", size: "h-1.5 w-1.5" },
        { style: { top: "22%", right: "18%" }, delay: "1.1s", size: "h-1 w-1" },
        { style: { bottom: "18%", left: "20%" }, delay: "0.6s", size: "h-1 w-1" },
        { style: { bottom: "26%", right: "14%" }, delay: "1.7s", size: "h-1.5 w-1.5" },
        { style: { top: "46%", left: "6%" }, delay: "2.3s", size: "h-1 w-1" },
      ].map((star, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pointer-events-none absolute animate-bh-twinkle rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] ${star.size}`}
          style={{ ...star.style, animationDelay: star.delay }}
        />
      ))}

      {phase === "catch" && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches && (
        <canvas
          ref={stageCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}

      {/* Progress counter, centered opposite the black hole */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 md:justify-end md:px-[8vw]">
        <div className="w-[min(54vw,230px)] md:w-[140px]">
          {/* Progress bar + percentage counter (fades once caught) */}
          <div
            className={`mt-5 transition-opacity duration-300 ${
              caught ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffb260] via-[#ff6a3c] to-[#a855f7] transition-[width] duration-200 ease-out"
                style={{ width: `${display}%`, boxShadow: "0 0 14px rgba(255,150,70,0.75)" }}
              />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="text-white/45">{display >= 100 ? "Swallowing" : "Loading"}</span>
              <span className="text-sm tabular-nums text-white/90">{display}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shockwave + flash pulse after the black hole explodes */}
      {phase === "flash" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-[23vmax] -mt-[23vmax] h-[46vmax] w-[46vmax] animate-bh-shockwave rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,170,80,0.55) 26%, rgba(139,92,246,0.25) 45%, transparent 66%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 animate-bh-flash bg-white"
          />
        </>
      )}

      <span className="sr-only">Loading {display}%</span>
    </div>
  );
}