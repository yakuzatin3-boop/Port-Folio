import { motion } from "framer-motion";
import { EASE } from "../../lib/easing";

const chipVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function TechChip({ item }) {
  const Icon = item.icon;

  return (
    <motion.li
      variants={chipVariant}
      className="group/chip list-none"
      data-cursor="link"
    >
      <span className="flex h-full items-center gap-2.5 rounded-chip border border-line bg-surface-2 px-2.5 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-line-hover hover:shadow-[0_12px_32px_-16px_var(--glow)]">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] text-[15px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/chip:scale-110"
          style={{
            backgroundColor: `${item.color}1F`,
            color: item.color,
            border: `1px solid ${item.color}33`,
          }}
          aria-hidden
        >
          <Icon />
        </span>
        <span className="mono-label whitespace-nowrap text-fg/85 transition-colors duration-300 group-hover/chip:text-fg">
          {item.name}
        </span>
      </span>
    </motion.li>
  );
}
