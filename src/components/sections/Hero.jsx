import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Download } from "lucide-react";
import SplitText from "../ui/SplitText";
import ScrambleText from "../ui/ScrambleText";
import MagneticButton from "../ui/MagneticButton";
import StatusDot from "../ui/StatusDot";
import Counter from "../ui/Counter";
import Portrait from "./Portrait";
import useMediaQuery from "../../hooks/useMediaQuery";
import { profile } from "../../data/profile";
import { socials } from "../../data/socials";
import { EASE } from "../../lib/easing";
import { scrollTo } from "../../lib/lenis";

const roleLabel = profile.role ?? "IT Instructor";
const headline = `${profile.hero.headlineTop} ${profile.hero.headlineBottom}`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent,currentColor)]";

function HeroMetric({ value, from, suffix, label }) {
  const isYear = value > 2000;

  return (
    <div className="min-w-0">
      <p className="display text-[clamp(1.5rem,3vw,2.25rem)] leading-none tabular-nums text-fg">
        {isYear ? value : <Counter to={value} from={from} />}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mono-label mt-2 truncate text-muted">{label}</p>
    </div>
  );
}

/** Rotating "available for work" seal around the portrait. */
function OrbitSeal({ className = "" }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        style={{ animation: "spin-slow 26s linear infinite" }}
      >
        <defs>
          <path
            id="hero-seal-path"
            d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <circle
          cx="60"
          cy="60"
          r="57"
          className="fill-[var(--glass-strong)] stroke-[var(--line)]"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="33"
          fill="none"
          className="stroke-[var(--line)]"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <text
          className="fill-[var(--muted)] font-mono"
          style={{ fontSize: 7.2, letterSpacing: "0.24em" }}
        >
          <textPath href="#hero-seal-path" startOffset="0">
            AVAILABLE FOR WORK • FULL-STACK DEVELOPER •
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[18px] leading-none text-accent">
        ✳
      </span>
    </div>
  );
}

function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {socials.map((social, index) => {
        const external =
          !social.href.startsWith("mailto:") && !social.href.startsWith("tel:");

        return (
          <li key={social.label}>
            <a
              href={social.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={
                external ? `${social.label} (opens in a new tab)` : social.label
              }
              data-cursor="link"
              className={`mono-label group inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3.5 py-2.5 text-muted transition-colors duration-300 hover:border-line-hover hover:text-fg ${focusRing}`}
            >
              <span className="text-accent/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              {social.mono}
              <ArrowUpRight
                size={11}
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-linked polish: content drifts and fades, glow moves slower (depth).
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.92], [1, 0.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 150]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120]);

  // Cursor-tracking spotlight (desktop only).
  const spotReady = useRef(false);
  const spotX = useMotionValue(-9999);
  const spotY = useMotionValue(-9999);
  const springSpotX = useSpring(spotX, { stiffness: 120, damping: 24, mass: 0.5 });
  const springSpotY = useSpring(spotY, { stiffness: 120, damping: 24, mass: 0.5 });
  const spotlight = useTransform(
    [springSpotX, springSpotY],
    ([x, y]) =>
      `radial-gradient(560px circle at ${x}px ${y}px, var(--glow-soft), transparent 72%)`
  );

  const handlePointerMove = (event) => {
    if (reduceMotion || !finePointer || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Snap the spring on first entry so the glow doesn't sweep in from off-screen.
    if (!spotReady.current) {
      spotReady.current = true;
      springSpotX.jump(x);
      springSpotY.jump(y);
    }

    spotX.set(x);
    spotY.set(y);
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const item = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 28, filter: "blur(10px)" },
    show: reduceMotion
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: EASE },
        },
  };

  const go = (event, href) => {
    event.preventDefault();
    scrollTo(href);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen min-h-[100svh] scroll-mt-32 flex-col justify-center overflow-hidden pb-20 pt-28"
    >
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        style={{
          background: spotlight,
          opacity: reduceMotion ? 0 : 1,
        }}
      />

      {/* Ambient glows */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -right-40 top-1/4 z-0 h-[36rem] w-[36rem] rounded-full opacity-30 blur-[120px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -left-52 bottom-0 z-0 h-[28rem] w-[28rem] rounded-full opacity-20 blur-[130px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 70%)" }}
        />
      </motion.div>

      {/* Oversized brand watermark */}
      <motion.div
        aria-hidden
        style={{
          y: watermarkY,
          maskImage: "linear-gradient(to top, #000 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, #000 30%, transparent 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 -bottom-[0.16em] z-0 select-none overflow-hidden"
      >
        <span
          className="display block whitespace-nowrap text-center text-[clamp(8rem,26vw,24rem)] leading-[0.75]"
          style={{ WebkitTextStroke: "1px var(--line)", color: "transparent" }}
        >
          VUTHIN
        </span>
      </motion.div>

      <div className="container-x relative z-10 grid flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="lg:col-span-7"
        >
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Meta row */}
            <motion.div
              variants={item}
              className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <span className="inline-flex items-center rounded-full border border-line bg-glass px-3 py-2">
                <StatusDot label={profile.status} />
              </span>
              <span className="h-px w-8 bg-line" aria-hidden />
              <span className="mono-label text-muted">{profile.city}</span>
              <span className="mono-label ml-auto hidden text-muted/70 sm:inline">
                PORTFOLIO / 2026
              </span>
            </motion.div>

            <motion.p
              variants={item}
              className="mono-label mb-4 flex items-center gap-3 text-muted"
            >
              <span className="text-accent" aria-hidden>
                ✳
              </span>
              <ScrambleText text={profile.hero.greeting} trigger="inview" />
            </motion.p>

            {/* Screen readers get the clean sentence; the letter-split visuals are hidden from them */}
            <h1
              id="hero-heading"
              aria-label={headline}
              className="display text-[clamp(3rem,8.8vw,7.5rem)] text-fg"
            >
              <span
                aria-hidden
                className="block overflow-hidden whitespace-nowrap pb-[0.06em]"
              >
                <SplitText
                  text={profile.hero.headlineTop}
                  by="letter"
                  stagger={reduceMotion ? 0 : 0.045}
                  delay={reduceMotion ? 0 : 0.35}
                />
              </span>
              <span
                aria-hidden
                className="mt-1 block overflow-hidden whitespace-nowrap pb-[0.08em]"
              >
                <SplitText
                  text={profile.hero.headlineBottom}
                  as="span"
                  by="letter"
                  stagger={reduceMotion ? 0 : 0.045}
                  delay={reduceMotion ? 0 : 0.55}
                  className="serif-accent"
                />
              </span>
            </h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted md:text-base"
            >
              {profile.hero.paragraph}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="#projects"
                onClick={(event) => go(event, "#projects")}
                className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_16px_44px_-14px_var(--glow)] ${focusRing}`}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]"
                />
                <span className="relative">View projects</span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={2.5}
                  aria-hidden
                  className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </MagneticButton>

              {profile.cv && (
                <MagneticButton
                  href={profile.cv}
                  download
                  className={`group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fg transition-colors duration-300 hover:border-line-hover hover:bg-glass hover:text-accent ${focusRing}`}
                >
                  Download CV
                  <Download
                    size={14}
                    strokeWidth={2.5}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </MagneticButton>
              )}
            </motion.div>

            {/* Quick facts */}
            <motion.dl
              variants={item}
              className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-line border-y border-line"
            >
              {profile.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`py-3.5 ${
                    index === 0
                      ? "pr-4"
                      : index === profile.stats.length - 1
                        ? "pl-4"
                        : "px-4"
                  }`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <HeroMetric {...stat} />
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.nav
              variants={item}
              aria-label="Social links"
              className="mt-8 lg:hidden"
            >
              <SocialLinks />
            </motion.nav>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative order-last lg:order-none lg:col-span-5"
        >
          <motion.div
            className="relative mx-auto w-full max-w-[440px] lg:max-w-none"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 36, filter: "blur(10px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: EASE, delay: reduceMotion ? 0 : 0.35 }}
          >
            <div className="relative">
              {/* Halo + orbital rings */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <div
                  className="h-[95%] w-[95%] rounded-full opacity-70 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, var(--glow-soft), transparent 65%)",
                  }}
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <div className="h-[104%] w-[104%] rounded-full border border-line" />
                <div
                  className="absolute h-[112%] w-[112%] rounded-full border border-dashed border-line"
                  style={{ animation: "spin-slow 60s linear infinite" }}
                />
              </div>

              {/* Viewfinder corners */}
              <span
                aria-hidden
                className="absolute -left-3 -top-3 z-20 h-6 w-6 border-l border-t border-accent/60"
              />
              <span
                aria-hidden
                className="absolute -bottom-3 -right-3 z-20 h-6 w-6 border-b border-r border-accent/60"
              />

              <Portrait sectionRef={sectionRef} />

              <OrbitSeal className="absolute -right-4 -top-6 z-30 h-20 w-20 sm:h-24 sm:w-24 lg:-right-6" />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold uppercase tracking-[-0.02em] text-fg">
                  {profile.name}
                </p>
                <p className="mono-label mt-1.5 truncate text-muted">{roleLabel}</p>
              </div>
              <span className="mono-label shrink-0 text-accent">
                {profile.hero.counter ?? "©26"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom rail */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="container-x absolute inset-x-0 bottom-7 z-10 hidden items-center justify-between gap-6 lg:flex"
      >
        <nav aria-label="Social links" className="min-w-0">
          <SocialLinks />
        </nav>

        <button
          type="button"
          onClick={() => scrollTo("#about")}
          aria-label="Scroll to about section"
          data-cursor="link"
          className={`group flex items-center gap-3 ${focusRing}`}
        >
          <span
            className="relative block h-10 w-px overflow-hidden bg-line"
            aria-hidden
          >
            {!reduceMotion && (
              <motion.span
                className="absolute left-0 top-0 block h-4 w-px bg-accent"
                animate={{ y: [-16, 40] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </span>
          <span className="mono-label text-muted transition-colors duration-300 group-hover:text-accent">
            Scroll to explore
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-glass transition-colors duration-300 group-hover:border-line-hover">
            <ArrowDown
              size={13}
              aria-hidden
              className="text-muted transition-colors duration-300 group-hover:text-accent"
            />
          </span>
        </button>

        <span className="mono-label text-muted">
          {profile.city} <span className="text-line">/</span> {profile.timezone}
        </span>
      </motion.div>

      <span className="sr-only">
        {profile.name} — {profile.role}, {profile.location}
      </span>
    </section>
  );
}
