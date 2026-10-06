import Lenis from "lenis";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

let lenis = null;
let rafId = null;

export function initLenis() {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function scrollTo(target, options = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -96, duration: 1.4, ...options });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function stopLenis() {
  lenis?.stop();
}

export function startLenis() {
  lenis?.start();
}

export function destroyLenis() {
  if (rafId) cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
  rafId = null;
}
