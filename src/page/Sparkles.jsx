import { useMemo } from "react";

function Sparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => ({
      id: index,
      left: (index * 37) % 100,
      top: (index * 61) % 100,
      size: (index * 13) % 8 + 4,
      duration: (index * 7) % 4 + 3,
      delay: (index * 11) % 5,
      moveX: (index * 17) % 40 - 20,
      moveY: (index * 23) % 40 - 20,
      isStar: index % 2 === 0,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className={sparkle.isStar ? "star" : "sparkle-dot"}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`,
            "--move-x": `${sparkle.moveX}px`,
            "--move-y": `${sparkle.moveY}px`,
          }}
        />
      ))}

      <style>
        {`
          /* =========================
             STAR
          ========================= */

          .star {
            position: absolute;
            display: block;
            background: white;
            clip-path: polygon(
              50% 0%,
              58% 42%,
              100% 50%,
              58% 58%,
              50% 100%,
              42% 58%,
              0% 50%,
              42% 42%
            );

            filter:
              drop-shadow(0 0 3px white)
              drop-shadow(0 0 7px rgba(255,255,255,0.8));

            animation-name: starFloat;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          /* =========================
             SMALL GLOWING DOT
          ========================= */

          .sparkle-dot {
            position: absolute;
            display: block;
            border-radius: 9999px;
            background: white;

            box-shadow:
              0 0 5px white,
              0 0 10px rgba(255,255,255,0.7),
              0 0 18px rgba(255,255,255,0.4);

            animation-name: dotFloat;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          /* =========================
             STAR ANIMATION
          ========================= */

          @keyframes starFloat {
            0% {
              opacity: 0;
              transform:
                translate(0, 0)
                scale(0.3)
                rotate(0deg);
            }

            25% {
              opacity: 1;
              transform:
                translate(
                  calc(var(--move-x) * 0.3),
                  calc(var(--move-y) * 0.3)
                )
                scale(1)
                rotate(45deg);
            }

            50% {
              opacity: 0.4;
              transform:
                translate(
                  var(--move-x),
                  var(--move-y)
                )
                scale(1.5)
                rotate(90deg);
            }

            75% {
              opacity: 1;
              transform:
                translate(
                  calc(var(--move-x) * 0.5),
                  calc(var(--move-y) * 0.5)
                )
                scale(0.8)
                rotate(135deg);
            }

            100% {
              opacity: 0;
              transform:
                translate(0, 0)
                scale(0.3)
                rotate(180deg);
            }
          }

          /* =========================
             DOT ANIMATION
          ========================= */

          @keyframes dotFloat {
            0% {
              opacity: 0;
              transform:
                translate(0, 0)
                scale(0.5);
            }

            30% {
              opacity: 1;
            }

            50% {
              opacity: 0.3;
              transform:
                translate(
                  var(--move-x),
                  var(--move-y)
                )
                scale(1.4);
            }

            70% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              transform:
                translate(0, 0)
                scale(0.5);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Sparkles;