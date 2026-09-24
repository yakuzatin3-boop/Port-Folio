import { useMemo } from "react";

function Sparkles() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }, (_, index) => {
      const pseudoRand = (seed) => {
        const x = Math.sin(index + seed) * 10000;
        return x - Math.floor(x);
      };

      const depth = pseudoRand(11); // 0 = far/small, 1 = near/large
      // Weighted so most stars are small/background, a few are large/foreground
      const layer = depth < 0.6 ? "far" : depth < 0.88 ? "mid" : "near";
      const sizeBase = layer === "far" ? 2 : layer === "mid" ? 4 : 7;
      const sizeRange = layer === "far" ? 3 : layer === "mid" ? 4 : 5;

      const kindRoll = pseudoRand(12);
      const shape = kindRoll < 0.7 ? "point" : kindRoll < 0.92 ? "star4" : "star6";

      return {
        id: index,
        left: Math.floor(pseudoRand(1) * 100),
        top: Math.floor(pseudoRand(2) * 100),
        size: Math.floor(pseudoRand(3) * sizeRange) + sizeBase,
        floatDuration: (pseudoRand(4) * 6 + 7).toFixed(2), // 7s - 13s
        twinkleDuration: (pseudoRand(5) * 2.5 + 1.5).toFixed(2), // 1.5s - 4s
        delay: (pseudoRand(6) * 8).toFixed(2),
        moveX: Math.floor(pseudoRand(7) * (layer === "near" ? 50 : 24) - (layer === "near" ? 25 : 12)),
        moveY: Math.floor(pseudoRand(8) * (layer === "near" ? 50 : 24) - (layer === "near" ? 25 : 12)),
        rotate: Math.floor(pseudoRand(9) * 360),
        hue: Math.floor(pseudoRand(10) * 50 + 195), // cool white through pale gold
        peakOpacity: layer === "far" ? 0.55 : layer === "mid" ? 0.8 : 1,
        shape,
        layer,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* soft ambient glow so the field reads as a night sky, not scattered confetti */}
      <div className="sky-wash" />

      {stars.map((s) => (
        <span
          key={s.id}
          className={`sparkle sparkle--${s.shape} sparkle--${s.layer}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.floatDuration}s, ${s.twinkleDuration}s`,
            animationDelay: `${s.delay}s, ${s.delay}s`,
            "--move-x": `${s.moveX}px`,
            "--move-y": `${s.moveY}px`,
            "--initial-rotate": `${s.rotate}deg`,
            "--peak-opacity": s.peakOpacity,
            "--sparkle-color": `hsla(${s.hue}, 100%, 96%, 0.95)`,
            "--sparkle-glow": `hsla(${s.hue}, 90%, 78%, 0.7)`,
          }}
        />
      ))}

      <style>
        {`
          .sky-wash {
            position: absolute;
            inset: -10%;
            background:
              radial-gradient(ellipse at 20% 15%, hsla(220, 60%, 60%, 0.05), transparent 55%),
              radial-gradient(ellipse at 80% 70%, hsla(40, 70%, 65%, 0.04), transparent 55%);
            pointer-events: none;
          }

          .sparkle {
            position: absolute;
            display: block;
            pointer-events: none;
            will-change: transform, opacity, filter;
            transform-origin: center center;
            background: var(--sparkle-color, #ffffff);
            animation-name: floatSparkle, twinkle;
            animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1), ease-in-out;
            animation-iteration-count: infinite, infinite;
            animation-direction: alternate, alternate;
          }

          /* simple round point-light, used for the majority of far/background stars */
          .sparkle--point {
            border-radius: 50%;
            box-shadow:
              0 0 4px var(--sparkle-glow),
              0 0 8px var(--sparkle-glow);
          }

          /* classic 4-point sparkle */
          .sparkle--star4 {
            clip-path: polygon(
              50% 0%, 60% 40%, 100% 50%,
              60% 60%, 50% 100%, 40% 60%,
              0% 50%, 40% 40%
            );
            filter: drop-shadow(0 0 6px var(--sparkle-glow));
          }

          /* 6-point hero sparkle, reserved for the largest foreground stars */
          .sparkle--star6 {
            clip-path: polygon(
              50% 0%, 61% 35%, 93% 25%, 68% 50%,
              93% 75%, 61% 65%, 50% 100%, 39% 65%,
              7% 75%, 32% 50%, 7% 25%, 39% 35%
            );
            filter: drop-shadow(0 0 8px var(--sparkle-glow));
          }

          .sparkle--far { opacity: 0; }
          .sparkle--mid { opacity: 0; }
          .sparkle--near { opacity: 0; }

          @keyframes floatSparkle {
            0% {
              opacity: 0;
              transform:
                translate3d(0, 0, 0)
                scale(0.2)
                rotate(var(--initial-rotate));
            }
            50% {
              opacity: var(--peak-opacity, 0.9);
              transform:
                translate3d(calc(var(--move-x) * 0.5), calc(var(--move-y) * 0.5), 0)
                scale(1.05)
                rotate(calc(var(--initial-rotate) + 60deg));
            }
            100% {
              opacity: 0;
              transform:
                translate3d(var(--move-x), var(--move-y), 0)
                scale(0.3)
                rotate(calc(var(--initial-rotate) + 120deg));
            }
          }

          /* independent shimmer layered on top of the float, so stars breathe */
          @keyframes twinkle {
            0% { filter: brightness(0.8) saturate(0.9); }
            100% { filter: brightness(1.35) saturate(1.1); }
          }

          @media (prefers-reduced-motion: reduce) {
            .sparkle {
              animation: none;
              opacity: 0.45 !important;
            }
            .sky-wash { display: none; }
          }
        `}
      </style>
    </div>
  );
}

export default Sparkles;