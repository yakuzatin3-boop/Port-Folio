import { EASE, STAGGER, DURATION } from "./easing";

export const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.35, ease: EASE } },
};

export const blurFadeUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(14px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  exit: { opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.4, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: EASE } },
};

export const clipReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 24px)" },
  show: { clipPath: "inset(0% 0% 0% 0% round 24px)", transition: { duration: 1, ease: EASE } },
};

export const lineGrow = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.4, ease: EASE } },
};

export const container = (stagger = STAGGER.base, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const listItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const letterReveal = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

export const riseFade = (index = 0, delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: delay + index * 0.08 },
  },
});
