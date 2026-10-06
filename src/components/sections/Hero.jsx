import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const go = (event, href) => {
    event.preventDefault();
    scrollTo(href);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen scroll-mt-32 flex-col justify-center overflow-hidden pb-24 pt-32 md:pt-36"
    >
      <div className="container-x grid flex-1 grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.div variants={item} className="mb-8 flex flex-wrap items-center gap-3">
            <StatusDot label={profile.status} />
            <span className="hidden h-px w-10 bg-line md:block" aria-hidden />
            <span className="mono-label text-muted">{profile.city}</span>
          </motion.div>

          <motion.p variants={item} className="mono-label mb-5 text-muted">
            <ScrambleText text={profile.hero.greeting} trigger="inview" />
          </motion.p>

          <h1 className="display text-[clamp(3rem,9vw,8rem)] text-fg">
            <span className="block overflow-hidden pb-[0.06em]">
              <SplitText text={profile.hero.headlineTop} by="letter" stagger={0.045} delay={0.35} />
            </span>
            <span className="mt-1 block overflow-hidden pb-[0.08em]">
              <SplitText
                text={profile.hero.headlineBottom}
                as="span"
                by="letter"
                stagger={0.045}
                delay={0.55}
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
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_16px_44px_-14px_var(--glow)]"
            >
              View projects
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </MagneticButton>

            <MagneticButton
              href={profile.cv}
              download
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-fg transition-colors duration-300 hover:border-line-hover hover:text-accent"
            >
              Download CV
              <Download size={14} strokeWidth={2.5} />
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-11 max-w-xl">
            <div className="hairline mb-5" />
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="mono-label group inline-flex items-center gap-1.5 text-muted transition-colors duration-300 hover:text-accent"
                >
                  {social.mono}
                  <ArrowUpRight
                    size={11}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="relative order-first lg:order-none lg:col-span-5">
          <Portrait sectionRef={sectionRef} />

          <motion.div
            className="mt-6 flex items-center justify-between gap-4 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.15 }}
          >
            <span className="mono-label text-muted">
              {profile.name} <span className="text-line">/</span> IT Instructor
            </span>
            <span className="mono-label text-accent">02 / 03</span>
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
          className="group flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1.4 }}
        >
          <span className="mono-label text-muted transition-colors duration-300 group-hover:text-accent">
            Scroll
          </span>
          <span className="relative block h-14 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute left-0 top-0 block h-5 w-px bg-accent"
              animate={{ y: [-20, 56] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <ArrowDown
            size={13}
            className="text-muted transition-colors duration-300 group-hover:text-accent"
          />
        </motion.button>
      </motion.div>

      <span className="sr-only">
        {profile.name} â€” {profile.role}, {profile.location}
      </span>
    </section>
  );
}
