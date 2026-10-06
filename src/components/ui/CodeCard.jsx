import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";

const LINES = [
  { key: "role", value: '"full-stack"', highlight: true },
  { key: "stack", value: '["react", "nestjs"]', brackets: true },
  { key: "status", value: '"available"', highlight: true },
];

function renderValue(line, count) {
  const shown = line.value.slice(0, count);

  if (!line.brackets) {
    return <span className={line.highlight ? "text-accent" : "text-fg/85"}>{shown}</span>;
  }

  const open = shown.indexOf("[");
  const close = shown.indexOf("]");
  const inner = open === -1 ? "" : shown.slice(open + 1, close === -1 ? undefined : close);
  const rest = close === -1 ? "" : shown.slice(close);

  return (
    <span className="text-fg/55">
      [<span className="text-accent">{inner}</span>
      {rest}
    </span>
  );
}

export default function CodeCard({ className = "" }) {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(reduced);
  const [step, setStep] = useState(reduced ? LINES.length - 1 : 0);
  const [char, setChar] = useState(reduced ? LINES[0].value.length : 0);

  const done = step >= LINES.length - 1 && char >= LINES[step].value.length;

  useEffect(() => {
    if (reduced || done) return undefined;

    let timer;

    if (!started) {
      timer = setTimeout(() => setStarted(true), 700);
      return () => clearTimeout(timer);
    }

    const line = LINES[step];

    if (char < line.value.length) {
      timer = setTimeout(() => setChar((c) => c + 1), 38);
    } else if (step < LINES.length - 1) {
      timer = setTimeout(() => {
        setStep((s) => s + 1);
        setChar(0);
      }, 340);
    }

    return () => clearTimeout(timer);
  }, [started, step, char, reduced, done]);

  const caret = done || char < LINES[step].value.length;

  return (
    <motion.div
      className={`rounded-2xl border border-line bg-glass p-4 backdrop-blur-xl backdrop-saturate-150 ${className}`}
      animate={reduced ? {} : { y: [0, -9, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="mono-label ml-auto text-muted/70">status.ts</span>
      </div>

      <div className="space-y-1.5 font-mono text-[12px] leading-relaxed">
        {LINES.slice(0, step + 1).map((line, index) => {
          const active = index === step;
          const count = active ? char : line.value.length;
          const showCaret = active && caret;

          return (
            <div key={line.key} className="flex gap-2">
              <span className="w-[54px] shrink-0 select-none text-right text-muted/60">
                {line.key}:
              </span>
              <span className="min-w-0">
                {renderValue(line, count)}
                {showCaret ? (
                  <span
                    className="ml-px inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent"
                    style={{ animation: "caret-blink 1s steps(1) infinite" }}
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
