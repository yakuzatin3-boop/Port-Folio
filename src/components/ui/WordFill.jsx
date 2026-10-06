import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export default function WordFill({ text, className = "", start = "start 0.85", end = "start 0.35" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [start, end],
  });

  const words = text.split(" ");
  const segment = 1 / words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const from = i * segment;
        const to = Math.min(from + segment * 1.6, 1);
        return (
          <Fragment key={`${word}-${i}`}>
            <Word progress={scrollYProgress} range={[from, Math.max(to, from + 0.001)]}>
              {word}
            </Word>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </p>
  );
}
