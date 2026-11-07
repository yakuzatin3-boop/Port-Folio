import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Download } from "lucide-react";
import SplitText from "../ui/SplitText";
import ScrambleText from "../ui/ScrambleText";
import MagneticButton from "../ui/MagneticButton";
import StatusDot from "../ui/StatusDot";
import Portrait from "./Portrait";
import { profile } from "../../data/profile";
import { socials } from "../../data/socials";
import { EASE } from "../../lib/easing";
import { scrollTo } from "../../lib/lenis";

const roleLabel = profile.role ?? "IT Instructor";
const headline = `${profile.hero.headlineTop} ${profile.hero.headlineBottom}`;

export default function Hero() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-linked polish: content drifts and fades, glow moves slower (depth).
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);

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

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent,currentColor)]";

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen min-h-[100svh] scroll-mt-32 flex-col justify-center overflow-hidden pb-24 pt-32 md:pt-36"
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full opacity-30 blur-[120px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
        />
      </motion.div>

      <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div style={{ y: contentY }} className="lg:col-span-7">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-8 flex flex-wrap items-center gap-3">
              <StatusDot label={profile.status} />
              <span className="hidden h-px w-10 bg-line md:block" aria-hidden />
              <span className="mono-label text-muted">{profile.city}</span>
            </motion.div>

            <motion.p variants={item} className="mono-label mb-5 text-muted">
              <ScrambleText text={profile.hero.greeting} trigger="inview" />
            </motion.p>

            {/* Screen readers get the clean sentence; the letter-split visuals are hidden from them */}
            <h1
              id="hero-heading"
              aria-label={headline}
              className="display text-[clamp(3rem,9vw,8rem)] text-fg"
            >
              <span aria-hidden className="block overflow-hidden pb-[0.06em]">
                <SplitText
                  text={profile.hero.headlineTop}
                  by="letter"
                  stagger={reduceMotion ? 0 : 0.045}
                  delay={reduceMotion ? 0 : 0.35}
                />
              </span>
              <span aria-hidden className="mt-1 block overflow-hidden pb-[0.08em]">
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
              className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted md:text-base"
            >
              {profile.hero.paragraph}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="#projects"
                onClick={(event) => go(event, "#projects")}
                className={`inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_16px_44px_-14px_var(--glow)] ${focusRing}`}
              >
                View projects
                <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden />
              </MagneticButton>

              {profile.cv && (
                <MagneticButton
                  href={profile.cv}
                  download
                  className={`inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fg transition-colors duration-300 hover:border-line-hover hover:text-accent ${focusRing}`}
                >
                  Download CV
                  <Download size={14} strokeWidth={2.5} aria-hidden />
                </MagneticButton>
              )}
            </motion.div>

            <motion.nav
              variants={item}
              aria-label="Social links"
              className="mt-11 max-w-xl"
            >
              <div className="hairline mb-5" />
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {socials.map((social) => {
                  const external = !social.href.startsWith("mailto:") && !social.href.startsWith("tel:");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        aria-label={external ? `${social.label} (opens in a new tab)` : social.label}
                        data-cursor="link"
                        className={`mono-label group inline-flex items-center gap-1.5 text-muted transition-colors duration-300 hover:text-accent ${focusRing}`}
                      >
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
            </motion.nav>
          </motion.div>
        </motion.div>

        <div className="relative order-last lg:order-none lg:col-span-5">
          <Portrait sectionRef={sectionRef} />

          <motion.div
            className="mt-6 flex items-center justify-between gap-4 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : 1.15 }}
          >
            <span className="mono-label text-muted">
              {profile.name} <span className="text-line">/</span> {roleLabel}
            </span>
            {profile.hero.counter && (
              <span className="mono-label text-accent">{profile.hero.counter}</span>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: fadeOut }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.button
          type="button"
          onClick={() => scrollTo("#about")}
          aria-label="Scroll to about section"
          data-cursor="link"
          className={`group flex flex-col items-center gap-3 ${focusRing}`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : 1.4 }}
        >
          <span className="mono-label text-muted transition-colors duration-300 group-hover:text-accent">
            Scroll
          </span>
          <span className="relative block h-14 w-px overflow-hidden bg-line" aria-hidden>
            {!reduceMotion && (
              <motion.span
                className="absolute left-0 top-0 block h-5 w-px bg-accent"
                animate={{ y: [-20, 56] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
          <ArrowDown
            size={13}
            aria-hidden
            className="text-muted transition-colors duration-300 group-hover:text-accent"
          />
        </motion.button>
      </motion.div>

      <span className="sr-only">
        {profile.name} — {profile.role}, {profile.location}
      </span>
    </section>
  );
}