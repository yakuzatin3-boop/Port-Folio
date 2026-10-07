import { useEffect, useRef } from "react";

/* ============================================================================
 * BlackHoleScene — the reusable canvas black hole.
 * Twinkling star field, gravitational-lensing glow, rotating orange/purple
 * accretion disk (back half, event-horizon core, front half) and a photon
 * ring. Used by <BlackHoleLoader /> (with pull/catch dynamics) and as the
 * Contact section background (ambient).
 *
 * Pass `getDynamics` to drive it per-frame:
 *   getDynamics = () => ({ pull: 0..1, catchT: 0..1 })
 * ==========================================================================*/

const CONFIG = {
  speed: {
    diskBase: 0.55, // rad/s base rotation of the accretion disk
    catchBoost: 6, // extra spin multiplier while the loader swallows the image
  },
  colors: {
    diskInner: [255, 178, 96], // hot orange at the inner edge
    diskOuter: [139, 92, 246], // violet at the outer edge
    starCool: "206,218,255",
    starWarm: "255,214,170",
  },
  pull: {
    // how strongly stars bend toward the center at pull = 1
    starSwirl: 0.5, // max extra twist (rad) applied to stars near the hole
    starWobble: 7, // px wobble amplitude for stars at full pull
    starInfall: 0.1, // fraction stars drift inward at full pull
  },
  size: {
    diskOuter: 0.3, // disk outer radius as a fraction of min(w, h)
    diskInnerRatio: 0.45, // inner radius relative to the outer radius
    coreRatio: 0.86, // event-horizon radius relative to the inner radius
    glowRatio: 1.7, // lensing-glow radius relative to the outer radius
    flatten: 0.34, // vertical squash of the disk (viewed at an angle)
    starDensity: 1200, // roughly one star per N px^2
    diskParticles: 210,
  },
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* Star field — positions are stored normalized so resize keeps the layout. */
const makeStars = (w, h) => {
  const count = clamp(Math.round((w * h) / CONFIG.size.starDensity), 150, 900);
  return Array.from({ length: count }, () => {
    const depth = Math.random(); // 0 = distant/dim, 1 = close/bright
    return {
      nx: Math.random(),
      ny: Math.random(),
      r: 0.35 + depth * 1.35,
      phase: Math.random() * Math.PI * 2,
      tw: 0.7 + Math.random() * 2.4,
      warm: Math.random() < 0.18,
      dim: 0.22 + depth * 0.78,
    };
  });
};

/* Accretion-disk particles — base color is pre-mixed from inner -> outer. */
const makeDisk = () => {
  const [r1, g1, b1] = CONFIG.colors.diskInner;
  const [r2, g2, b2] = CONFIG.colors.diskOuter;
  return Array.from({ length: CONFIG.size.diskParticles }, () => {
    const rn = Math.random();
    return {
      a: Math.random() * Math.PI * 2,
      rn,
      col: [r1 + (r2 - r1) * rn, g1 + (g2 - g1) * rn, b1 + (b2 - b1) * rn],
    };
  });
};

export default function BlackHoleScene({
  getDynamics,
  anchorRef,
  className = "absolute inset-0 h-full w-full",
}) {
  const canvasRef = useRef(null);
  const dynamicsRef = useRef(getDynamics);

  // Keep the latest callback without restarting the render loop.
  useEffect(() => {
    dynamicsRef.current = getDynamics;
  }, [getDynamics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let stars = [];
    let visible = true;
    let focus = 0.5; // vertical position of the hole as a fraction of the canvas
    const disk = makeDisk();

    // Center the hole on an anchor element (e.g. the footer watermark).
    const measureFocus = () => {
      const anchor = anchorRef?.current;
      if (!anchor) return;
      const c = canvas.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      if (c.height > 0) focus = (a.top + a.height / 2 - c.top) / c.height;
    };

    // -- paint one frame -----------------------------------------------------
    // Continuous glowing band under the particle streaks so the disk reads as
    // a solid ring of light. Drawn as a scaled half-donut with a radial
    // gradient (inner orange -> outer violet), boosted on the approaching side.
    const drawBand = (cx, cy, inner, outer, flatten, a0, a1, alphaMul, bright) => {
      const [r1, g1, b1] = CONFIG.colors.diskInner;
      const [r2, g2, b2] = CONFIG.colors.diskOuter;
      const mid = [(r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, flatten);
      const g = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
      g.addColorStop(0, `rgba(${r1 | 0},${g1 | 0},${b1 | 0},${(0.5 * alphaMul * bright).toFixed(3)})`);
      g.addColorStop(
        0.45,
        `rgba(${mid[0] | 0},${mid[1] | 0},${mid[2] | 0},${(0.34 * alphaMul * bright).toFixed(3)})`
      );
      g.addColorStop(1, `rgba(${r2 | 0},${g2 | 0},${b2 | 0},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, outer, a0, a1);
      ctx.arc(0, 0, inner, a1, a0, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const renderDiskSide = (t, cx, cy, inner, outer, flatten, lwScale, front, speedMul, bright) => {
      const a0 = front ? 0 : Math.PI;
      const a1 = front ? Math.PI : Math.PI * 2;
      const l0 = front ? Math.PI / 2 : Math.PI; // left half => doppler-boosted
      const l1 = front ? Math.PI : Math.PI * 1.5;

      drawBand(cx, cy, inner, outer, flatten, a0, a1, 1, bright);
      drawBand(cx, cy, inner, outer, flatten, l0, l1, 0.55, bright);

      ctx.lineCap = "round";
      for (const p of disk) {
        const r = inner + p.rn * (outer - inner);
        const k = Math.pow(r / inner, -1.5); // Keplerian: inner particles spin faster
        const a = p.a + t * CONFIG.speed.diskBase * k * speedMul;
        if (Math.sin(a) > 0 !== front) continue; // front arcs pass over the core

        const boost = 0.5 + 0.5 * -Math.cos(a); // doppler beaming: left side brighter
        const w = (boost - 0.5) * 0.55;
        const R = p.col[0] + (255 - p.col[0]) * w;
        const G = p.col[1] + (255 - p.col[1]) * w;
        const B = p.col[2] + (255 - p.col[2]) * w;
        const alpha = Math.min(1, (0.78 - 0.45 * p.rn) * (0.4 + 0.6 * boost) * bright);
        const streak = (0.09 + 0.2 * (1 - p.rn)) * (0.75 + 0.3 * k);

        ctx.strokeStyle = `rgba(${R | 0},${G | 0},${B | 0},${alpha.toFixed(3)})`;
        ctx.lineWidth = (0.7 + (1 - p.rn) * 2.3) * lwScale;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * flatten, 0, a, a + streak);
        ctx.stroke();
      }
    };

    const renderStars = (t, cx, cy, base, pullEff, catchT) => {
      const proxRadius = base * 0.85;
      for (const s of stars) {
        let x = s.nx * W;
        let y = s.ny * H;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.hypot(dx, dy) || 1;
        const prox = Math.max(0, 1 - dist / proxRadius); // 1 near the hole, 0 far away

        // Frame dragging: stars twist around the center as the pull strengthens.
        const twist = pullEff * (CONFIG.pull.starSwirl * prox + 0.05);
        const c = Math.cos(twist);
        const si = Math.sin(twist);
        const ox = x - cx;
        const oy = y - cy;
        x = cx + ox * c - oy * si;
        y = cy + ox * si + oy * c;

        const ddx = cx - x;
        const ddy = cy - y;
        const ddist = Math.hypot(ddx, ddy) || 1;

        // Infall + wobble toward the center.
        const inward = pullEff * (CONFIG.pull.starInfall * prox + 0.006) + catchT * 0.12 * prox;
        x += ddx * inward;
        y += ddy * inward;
        const amp = pullEff * CONFIG.pull.starWobble * (0.3 + 0.7 * prox);
        const wob = Math.sin(t * 4.6 + s.phase * 3.1) * amp;
        x += (-ddy / ddist) * wob;
        y += (ddx / ddist) * wob;

        const tw = 0.5 + 0.5 * Math.sin(t * s.tw * 2.2 + s.phase);
        const alpha =
          (0.28 + 0.62 * tw) * (0.55 + (0.45 * Math.min(s.r, 1.6)) / 1.6) * s.dim;
        const rgb = s.warm ? CONFIG.colors.starWarm : CONFIG.colors.starCool;

        // Stretch each star into an infall streak as the hole grips tighter.
        const streak = pullEff * (3 + 12 * prox) * (0.4 + 0.6 * tw);
        if (streak > 1) {
          ctx.strokeStyle = `rgba(${rgb},${(alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = s.r * 0.9;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - (ddx / ddist) * streak, y - (ddy / ddist) * streak);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Faint deep-space clouds so the void reads as space, not emptiness.
    const renderNebula = () => {
      const puffs = [
        { x: 0.22, y: 0.3, c: "110,70,200" },
        { x: 0.78, y: 0.62, c: "60,90,200" },
        { x: 0.6, y: 0.18, c: "200,90,60" },
        { x: 0.35, y: 0.8, c: "90,50,170" },
      ];
      for (const p of puffs) {
        const x = p.x * W;
        const y = p.y * H;
        // fades to zero at the nearest canvas edge so there is no hard cut
        const r = Math.max(1, Math.min(x, W - x, y, H - y));
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${p.c},0.16)`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const render = (t) => {
      if (!W || !H) return;
      measureFocus(); // keep the hole locked to the anchor as layout shifts
      const cx = W / 2;
      const cy = H * focus;
      const base = Math.min(W, H);
      const diskOuter = base * CONFIG.size.diskOuter;
      const diskInner = diskOuter * CONFIG.size.diskInnerRatio;
      const coreR = diskInner * CONFIG.size.coreRatio;
      const glowR = diskOuter * CONFIG.size.glowRatio;
      const flatten = CONFIG.size.flatten;
      const lwScale = Math.max(0.6, diskOuter / 240);

      const dyn = dynamicsRef.current ? dynamicsRef.current() : null;
      const pull = clamp(dyn?.pull ?? 0, 0, 1);
      const catchT = clamp(dyn?.catchT ?? 0, 0, 1);
      const pullEff = Math.min(pull + catchT * 0.5, 1.5);
      const speedMul = 1 + pull * 0.25 + catchT * CONFIG.speed.catchBoost;
      const bright = 1 + pull * 0.12 + catchT * 0.7;

      ctx.clearRect(0, 0, W, H);

      // 1. deep-space clouds + stars (behind everything)
      ctx.globalCompositeOperation = "source-over";
      renderNebula();
      renderStars(t, cx, cy, base, pullEff, catchT);

      // 2. gravitational-lensing glow (additive)
      ctx.globalCompositeOperation = "lighter";
      const glow = ctx.createRadialGradient(cx, cy, coreR * 0.5, cx, cy, glowR);
      glow.addColorStop(0, `rgba(255,150,70,${(0.34 * bright).toFixed(3)})`);
      glow.addColorStop(0.35, `rgba(160,90,255,${(0.18 * bright).toFixed(3)})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);

      // 3. back half of the accretion disk
      renderDiskSide(t, cx, cy, diskInner, diskOuter, flatten, lwScale, false, speedMul, bright);

      // 4. event-horizon core + photon ring
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = "rgba(255,150,70,0.85)";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.01, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.2, coreR * 0.035);
      ctx.strokeStyle = `rgba(255,196,130,${Math.min(1, 0.8 * bright).toFixed(3)})`;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.1, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, coreR * 0.05);
      ctx.strokeStyle = `rgba(150,100,255,${Math.min(1, 0.3 * bright).toFixed(3)})`;
      ctx.stroke();

      // 5. front half of the accretion disk (crosses in front of the core)
      renderDiskSide(t, cx, cy, diskInner, diskOuter, flatten, lwScale, true, speedMul, bright);
      ctx.globalCompositeOperation = "source-over";
    };

    // -- setup / resize -------------------------------------------------------
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;
      H = canvas.clientHeight || canvas.parentElement?.clientHeight || 0;
      if (!W || !H) return;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(W, H);
      measureFocus();
      render(0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Pause the loop while the canvas is scrolled out of view.
    let observer;
    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      observer.observe(canvas);
    }

    // -- animation loop --------------------------------------------------------
    let rafId = 0;
    if (!reduced) {
      const start = performance.now();
      const frame = (now) => {
        if (visible) render((now - start) / 1000);
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
    };
  }, [anchorRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
