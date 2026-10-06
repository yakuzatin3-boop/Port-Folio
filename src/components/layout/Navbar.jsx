import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu as MenuIcon } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import StatusDot from "../ui/StatusDot";
import MagneticButton from "../ui/MagneticButton";
import MobileMenu from "./MobileMenu";
import useScrollDirection from "../../hooks/useScrollDirection";
import { scrollTo, scrollToTop } from "../../lib/lenis";
import { navLinks, profile } from "../../data/profile";
import { SPRING_SNAP } from "../../lib/easing";

export default function Navbar() {
  const { direction, scrollY } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const scrolled = scrollY > 32;
  const hidden = direction === "down" && scrollY > 240;

  const go = (event, href) => {
    event.preventDefault();
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4"
        initial={{ y: -140 }}
        animate={{ y: hidden && !menuOpen ? -160 : 0 }}
        transition={SPRING_SNAP}
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-[1100px] items-center justify-between gap-3 rounded-full px-3 py-2 pl-5 md:px-4 md:pl-6 ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              scrollToTop();
            }}
            data-cursor="link"
            aria-label={`${profile.name} — back to top`}
            className="group flex shrink-0 items-center"
          >
            <span className="font-display text-[15px] font-bold uppercase tracking-[-0.04em] text-fg">
              VUTHIN<span className="text-accent transition-transform duration-500 inline-block group-hover:rotate-[360deg]">.</span>
            </span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                data-nav-link={link.href}
                data-cursor="link"
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                onClick={(event) => go(event, link.href)}
                className="relative px-4 py-2"
              >
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-line-hover bg-accent/10"
                    transition={SPRING_SNAP}
                  />
                )}
                <span
                  className={`mono-label relative z-10 transition-colors duration-300 ${
                    hovered === link.href ? "text-fg" : "text-muted"
                  }`}
                >
                  {link.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-2.5">
            <span className="hidden sm:block">
              <StatusDot />
            </span>
            <ThemeToggle />
            <MagneticButton
              href="#contact"
              strength={0.25}
              onClick={(event) => go(event, "#contact")}
              className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_10px_36px_-12px_var(--glow)] md:flex"
            >
              Let&apos;s talk
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </MagneticButton>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              data-cursor="link"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-glass text-fg transition-colors duration-300 hover:border-line-hover lg:hidden"
            >
              <MenuIcon size={17} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
