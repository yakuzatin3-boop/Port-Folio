import { Fragment } from "react";
import { motion } from "framer-motion";
import { EASE, STAGGER } from "../../lib/easing";

export default function SplitText({
  text,
  as = "span",
  by = "word",
  className = "",
  delay = 0,
  stagger = STAGGER.base,
  once = true,
  viewportAmount = 0.4,
}) {
  const MotionTag = motion[as] ?? motion.span;

  const words = text.split(" ");
  const items =
    by === "letter"
      ? words.map((word) => ({ chars: [...word] }))
      : words.map((word) => ({ chars: [word] }));

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const child = {
    hidden: { y: "110%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: viewportAmount }}
    >
      {items.map((word, wi) => (
        <Fragment key={`${word.chars.join("")}-${wi}`}>
          <span className="inline-block overflow-hidden align-bottom">
            {word.chars.map((char, ci) => (
              <motion.span key={ci} className="inline-block will-change-transform" variants={child}>
                {char}
              </motion.span>
            ))}
          </span>
          {wi < items.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </MotionTag>
  );
}
