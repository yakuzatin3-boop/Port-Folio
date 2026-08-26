import { useEffect, useState } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", updatePosition);
    return () => window.removeEventListener("pointermove", updatePosition);
  }, []);
  return position;
}
