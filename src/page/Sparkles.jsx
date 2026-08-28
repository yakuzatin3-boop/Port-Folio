import React, { useMemo } from "react";

function Sparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 50 }, (_, index) => {
      // Deterministic pseudorandom generator based on index
      const pseudoRand = (seed) => {
        const x = Math.sin(index + seed) * 10000;
        return x - Math.floor(x);
      };

      return {
        id: index,
        left: Math.floor(pseudoRand(1) * 100),
        top: Math.floor(pseudoRand(2) * 100),
        size: Math.floor(pseudoRand(3) * 8) + 4,
        duration: (pseudoRand(4) * 4 + 4).toFixed(2), // 4s - 8s for slow, graceful float
        delay: (pseudoRand(5) * 5).toFixed(2),
        moveX: Math.floor(pseudoRand(6) * 60 - 30), // Slightly larger drift range
        moveY: Math.floor(pseudoRand(7) * 60 - 30),
        rotate: Math.floor(pseudoRand(8) * 360),
        hue: Math.floor(pseudoRand(9) * 40 + 200), // Subtle blue-to-gold chromatic highlights
        isStar: index % 2 === 0,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className={sparkle.isStar ? "star-graceful" : "dot-graceful"}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`,
            "--move-x": `${sparkle.moveX}px`,
            "--move-y": `${sparkle.moveY}px`,
            "--initial-rotate": `${sparkle.rotate}deg`,
            "--sparkle-color": `hsla(${sparkle.hue}, 100%, 95%, 0.9)`,
            "--sparkle-glow": `hsla(${sparkle.hue}, 90%, 75%, 0.6)`,
          }}
        />
      ))}

      <style>
        {`
          /* =========================
             SHARED CORE STYLES
          ========================= */

          .star-graceful,
          .dot-graceful {
            position: absolute;
            display: block;
            pointer-events: none;
            will-change: transform, opacity;
            transform-origin: center center;
          }

          /* =========================
             GRACEFUL STAR
          ========================= */

          .star-graceful {
            background: var(--sparkle-color, #ffffff);
            clip-path: polygon(
              50% 0%,
              62% 38%,
              100% 50%,
              62% 62%,
              50% 100%,
              38% 62%,
              0% 50%,
              38% 38%
            );
            filter: drop-shadow(0 0 6px var(--sparkle-glow, rgba(255, 255, 255, 0.8)));
            animation: floatStar ease-in-out infinite alternate;
          }

          /* =========================
             GRACEFUL GLOWING DOT
          ========================= */

          .dot-graceful {
            border-radius: 50%;
            background: var(--sparkle-color, #ffffff);
            box-shadow:
              0 0 6px var(--sparkle-glow, rgba(255, 255, 255, 0.9)),
              0 0 12px var(--sparkle-glow, rgba(255, 255, 255, 0.5));
            animation: floatDot ease-in-out infinite alternate;
          }

          /* =========================
             KEYFRAMES (Smooth Trajectory)
          ========================= */

          @keyframes floatStar {
            0% {
              opacity: 0;
              transform:
                translate3d(0, 0, 0)
                scale(0.2)
                rotate(var(--initial-rotate));
            }
            50% {
              opacity: 0.95;
              transform:
                translate3d(calc(var(--move-x) * 0.5), calc(var(--move-y) * 0.5), 0)
                scale(1.1)
                rotate(calc(var(--initial-rotate) + 90deg));
            }
            100% {
              opacity: 0;
              transform:
                translate3d(var(--move-x), var(--move-y), 0)
                scale(0.3)
                rotate(calc(var(--initial-rotate) + 180deg));
            }
          }

          @keyframes floatDot {
            0% {
              opacity: 0;
              transform: translate3d(0, 0, 0) scale(0.3);
            }
            50% {
              opacity: 0.85;
              transform:
                translate3d(calc(var(--move-x) * 0.6), calc(var(--move-y) * 0.6), 0)
                scale(1.2);
            }
            100% {
              opacity: 0;
              transform: translate3d(var(--move-x), var(--move-y), 0) scale(0.3);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Sparkles;