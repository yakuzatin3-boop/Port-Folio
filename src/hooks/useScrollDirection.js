import { useEffect, useRef, useState } from "react";

export default function useScrollDirection(threshold = 60) {
  const [direction, setDirection] = useState("up");
  const [scrollY, setScrollY] = useState(0);
  const last = useRef(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrollY(y);

        if (Math.abs(y - last.current) > 8) {
          setDirection(y > last.current && y > threshold ? "down" : "up");
          last.current = y;
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, scrollY };
}
