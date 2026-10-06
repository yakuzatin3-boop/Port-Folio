import { motion } from "framer-motion";
import { blurFadeUp, container } from "../../lib/variants";
import { STAGGER } from "../../lib/easing";

const gradientHeading = {
  backgroundImage: "linear-gradient(180deg, var(--fg) 8%, color-mix(in srgb, var(--fg) 38%, transparent) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export default function SectionHeading({
  index,
  label,
  line1,
  accent,
  aside,
  className = "",
  id,
}) {
  return (
    <motion.header
      id={id}
      variants={container(STAGGER.slow, 0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className={`scroll-mt-32 ${className}`}
    >
      <motion.div variants={blurFadeUp} className="mb-7 flex items-center gap-4">
        <span className="mono-label text-accent">
          {index} / {label}
        </span>
        <span className="hairline flex-1" />
        {aside ? <span className="mono-label hidden text-muted md:inline">{aside}</span> : null}
      </motion.div>

      <motion.h2 variants={blurFadeUp} className="display text-[clamp(2.5rem,7vw,6rem)]">
        <span style={gradientHeading}>{line1}</span>{" "}
        <span className="serif-accent">{accent}</span>
      </motion.h2>
    </motion.header>
  );
}
