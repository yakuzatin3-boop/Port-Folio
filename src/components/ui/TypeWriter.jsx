import { useEffect, useRef, useState } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function TypeWriter({
  text,
  className = "",
  speed = 55,
  delay = 0,
  start = true,
  caret = true,
  onDone,
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduced || !start) return undefined;

    let current = 0;
    let timer;

    const tick = () => {
      current += 1;
      setCount(current);
      if (current < text.length) {
        timer = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    timer = setTimeout(tick, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, start, reduced]);

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
    if (!done) doneRef.current = false;
  }, [done, onDone]);

  const visible = reduced ? text : text.slice(0, count);
  const finished = reduced || !start || visible.length >= text.length;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{visible}</span>
      {caret && !finished ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.95em] w-[0.5ch] translate-y-[0.12em] bg-accent"
          style={{ animation: "caret-blink 1s steps(1) infinite" }}
        />
      ) : null}
    </span>
  );
}
