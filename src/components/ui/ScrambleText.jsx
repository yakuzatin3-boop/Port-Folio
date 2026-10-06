import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#@$&01";

export default function ScrambleText({
  text,
  className = "",
  speed = 26,
  trigger = "hover",
  as = "span",
  onScrambleEnd,
}) {
  const [display, setDisplay] = useState(text);
  const elementRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  const scramble = () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timeoutRef.current);
    frameRef.current = 0;
    const total = text.length * 3;

    const tick = () => {
      const progress = frameRef.current / total;
      const revealed = Math.floor(progress * text.length);

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealed) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      frameRef.current += 1;
      if (frameRef.current <= total) {
        timeoutRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(tick);
        }, speed);
      } else {
        setDisplay(text);
        onScrambleEnd?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
    },
    []
  );

  useEffect(() => {
    const el = elementRef.current;
    if (!el || trigger !== "inview") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text]);

  const handlers = trigger === "hover" ? { onMouseEnter: scramble, onFocus: scramble } : {};
  const Tag = as;

  return (
    <Tag ref={elementRef} className={className} aria-label={text} {...handlers}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
