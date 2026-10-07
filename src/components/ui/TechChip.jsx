import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../lib/easing";

const chipVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const chipVariantReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export default function TechChip({ item }) {
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const Icon = item.icon;
  const initial = (item.name.trim()[0] || "?").toUpperCase();

  const fallback = failed
    ? Icon
      ? <Icon className="h-[19px] w-[19px]" style={{ color: item.color }} />
      : <span style={{ fontSize: "15px" }} className="mono-label font-bold text-fg">{initial}</span>
    : null;

  return (
    <motion.li
      variants={reduced ? chipVariantReduced : chipVariant}
      className="group/chip list-none"
      data-cursor="link"
    >
      <span className="skill-chip flex items-center gap-2.5 rounded-[14px] bg-chip py-[7px] pl-[7px] pr-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-16px_rgba(11,18,32,0.55)]">
        <span
          className={`chip-icon grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/chip:scale-105 group-hover/chip:brightness-110 ${
            item.darkInvert ? "logo-invert" : ""
          }`}
          style={{ backgroundColor: `${item.color}2B` }}
          aria-hidden
        >
          {fallback ? (
            fallback
          ) : item.img ? (
            <img
              src={item.img}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="h-[22px] w-[22px] object-contain"
            />
          ) : (
            <span style={{ fontSize: "15px" }} className="mono-label font-bold text-fg">{initial}</span>
          )}
        </span>
        <span className="mono-label whitespace-nowrap text-fg/85 transition-colors duration-300 group-hover/chip:text-fg">
          {item.name}
        </span>
      </span>
    </motion.li>
  );
}
