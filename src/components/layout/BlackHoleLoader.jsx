import { useCallback, useEffect, useRef, useState } from "react";
import BlackHoleScene from "../ui/BlackHoleScene";

/* ============================================================================
 * BlackHoleLoader
 * ----------------------------------------------------------------------------
 * Full-screen black-hole loading screen.
 * - <BlackHoleScene />: canvas stars, lensing glow, rotating orange/purple
 *   accretion disk and event-horizon core (requestAnimationFrame).
 * - Tailwind CSS: layout, image, progress bar, text, fades and the custom
 *   keyframes (bh-spin, bh-twinkle, bh-spiral-in, bh-shockwave, bh-flash)
 *   defined in src/index.css under `@theme`.
 *
 * Phases: "loading" (0-99%) -> "catch" (spiral-in) -> "flash" (shockwave +
 * fade-out) -> onComplete().
 * ==========================================================================*/

/* --------------------------------------------------------------------------
 * CONFIG — speeds, image pull strength and catch/fade timings.
 * (Disk colors/speeds live in BlackHoleScene.)
 * ------------------------------------------------------------------------ */
const CONFIG = {
  speed: {
    simulatedDuration: 3600, // ms for 0 -> 100 when no `progress` prop is given
  },
  pull: {
    // 0-100% behaviour: how strongly the image bends toward the center
    maxBend: 0.16, // fraction of the distance the image bends toward the hole
    wobble: 7, // px wobble amplitude for the image at full pull
  },
  catch: {
    spiralMs: 1900, // duration of the spiral-in (spaghettification) animation
    flashDelayMs: 300, // delay before the loader fades (lets the flash pop)
    fadeMs: 700, // loader fade-out duration
    completeBufferMs: 120, // slack before onComplete() fires
  },
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function BlackHoleLoader({ progress, imageSrc = "/image.png", onComplete }) {
  const hasProgress = progress !== undefined && progress !== null;
  const [simDisplay, setSimDisplay] = useState(0); // counter while simulating
  const [phase, setPhase] = useState("loading"); // "loading" | "catch" | "flash"

  // Derived counter: follows the prop when given, otherwise the simulation.
  const display = hasProgress ? Math.floor(clamp(progress, 0, 100)) : simDisplay;

  const restRef = useRef(null); // untransformed column (measures rest position)
  const driftRef = useRef(null); // gets the rAF drift/bend transform
  const imgRef = useRef(null); // receives the CSS spiral-in animation

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
      ? clamp((performance.now() - catchStartRef.current) / CONFIG.catch.spiralMs, 0, 1)
      : 0;
    return { pull: clamp(progressRef.current, 0, 100) / 100, catchT };
  }, []);

  /* ------------------------------------------------------------------------
   * Phase 2 -> 3: shockwave flash, loader fade-out, then onComplete().
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
   * Phase 1 -> 2: progress hit 100%. Capture the spiral geometry into CSS
   * variables, then hand the image over to the bh-spiral-in animation.
   * ---------------------------------------------------------------------- */
  const beginCatch = useCallback(() => {
    if (phaseRef.current !== "loading") return;
    phaseRef.current = "catch";
    catchStartRef.current = performance.now();

    const el = imgRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const sx = window.innerWidth / 2 - (r.left + r.width / 2);
      const sy = window.innerHeight / 2 - (r.top + r.height / 2);
      const phi = (Math.atan2(sy, sx) * 180) / Math.PI; // direction to the core
      el.style.setProperty("--bh-sx", `${sx.toFixed(1)}px`);
      el.style.setProperty("--bh-sy", `${sy.toFixed(1)}px`);
      el.style.setProperty("--bh-px", `${(-sy * 0.42).toFixed(1)}px`); // perpendicular bow => curved spiral
      el.style.setProperty("--bh-py", `${(sx * 0.42).toFixed(1)}px`);
      el.style.setProperty("--bh-phi", `${phi.toFixed(2)}deg`);
      el.style.setProperty("--bh-spiral-ms", `${CONFIG.catch.spiralMs}ms`);
    }
    setPhase("catch");
    // Safety net in case animationend never arrives.
    timersRef.current.push(window.setTimeout(beginFlash, CONFIG.catch.spiralMs + 700));
  }, [beginFlash]);

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
   * Image drift / bend (loading phase only): one rAF loop writing the inline
   * transform. CSS owns the transform once the image is caught.
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let rafId = 0;
    const start = performance.now();

    const updateImage = (t) => {
      if (phaseRef.current !== "loading") return;
      const el = driftRef.current;
      const rest = restRef.current;
      if (!el || !rest) return;

      const r = rest.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (r.left + r.width / 2);
      const dy = window.innerHeight / 2 - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.pow(clamp(progressRef.current, 0, 100) / 100, 1.5);

      // Gentle hover + drift.
      const dX = Math.sin(t * 0.55) * 9 + Math.sin(t * 0.21 + 1.7) * 5;
      const dY = Math.cos(t * 0.43) * 8 + Math.sin(t * 0.29 + 0.6) * 6;
      // Pull-driven wobble: the closer to 100%, the shakier it gets.
      const amp = pull * CONFIG.pull.wobble;
      const wX = Math.sin(t * 7.4 + 1.3) * amp;
      const wY = Math.cos(t * 8.6) * amp * 0.7;
      const bend = pull * CONFIG.pull.maxBend * dist;
      const rot = Math.sin(t * 0.8) * 1.8 + pull * Math.sin(t * 5.2) * 5;

      const x = dX + wX + (dx / dist) * bend;
      const y = dY + wY + (dy / dist) * bend;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    };

    const frame = (now) => {
      updateImage((now - start) / 1000);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

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

  // The spiral animation finishing is what triggers the flash.
  const handleSpiralEnd = (e) => {
    if (e.animationName === "bh-spiral-in") beginFlash();
  };

  const caught = phase !== "loading";

  return (
    <div
      role="status"
      className={`blackhole-loader fixed inset-0 z-[100] select-none overflow-hidden bg-black transition-opacity delay-300 duration-700 ${
        phase === "flash" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Star field + accretion disk + lensing (shared canvas scene) */}
      <BlackHoleScene className="absolute inset-0 h-full w-full" getDynamics={getDynamics} />

      {/* Rotating soft glow ring (bh-spin) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-[34vmin] -mt-[34vmin] h-[68vmin] w-[68vmin] animate-bh-spin rounded-full opacity-40 mix-blend-screen"
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

      {/* Image + progress column, floating near the edge */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center px-6 pt-[6%] md:justify-end md:px-0 md:pr-[8vw] md:pt-[16%]">
        <div ref={restRef} className="w-[min(54vw,230px)] md:w-[240px]">
          {/* Drift/bend layer: inline transform written by rAF while loading */}
          <div ref={driftRef} className="will-change-transform">
            {/* Spiral layer: CSS animation takes over the transform at 100% */}
            <div
              ref={imgRef}
              className={caught ? "animate-bh-spiral-in" : undefined}
              onAnimationEnd={handleSpiralEnd}
            >
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-7 rounded-[44px] bg-[radial-gradient(closest-side,rgba(255,140,70,0.3),rgba(139,92,246,0.16)_58%,transparent_78%)] blur-2xl"
                />
                <div className="relative aspect-square overflow-hidden rounded-[22px] border border-white/20 bg-white/5 shadow-[0_30px_80px_-28px_rgba(255,140,70,0.45)]">
                  <img
                    src={imageSrc}
                    alt=""
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar + percentage counter (fades once caught) */}
          <div
            className={`mt-5 transition-opacity duration-500 ${
              caught ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffb260] via-[#ff6a3c] to-[#a855f7] transition-[width] duration-300 ease-out"
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

      {/* Shockwave + flash pulse when the black hole catches the image */}
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
