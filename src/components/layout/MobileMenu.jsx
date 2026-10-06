import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { EASE, STAGGER } from "../../lib/easing";
import { scrollTo, stopLenis, startLenis } from "../../lib/lenis";
import { navLinks, profile } from "../../data/profile";
import { socials } from "../../data/socials";
import StatusDot from "../ui/StatusDot";

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      stopLenis();
    } else {
      document.body.classList.remove("no-scroll");
      startLenis();
    }
    return () => {
      document.body.classList.remove("no-scroll");
      startLenis();
    };
  }, [open]);

  const go = (event, href) => {
    event.preventDefault();
    onClose();
    setTimeout(() => scrollTo(href, { offset: -40 }), 420);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[80] bg-bg lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex h-full flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-[15px] font-bold uppercase tracking-[-0.04em]">
                VUTHIN<span className="text-accent">.</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-glass text-fg transition-colors duration-300 hover:border-line-hover"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Mobile" className="my-auto w-full">
              {navLinks.map((link, index) => (
                <div
                  key={link.href}
                  className="overflow-hidden border-b border-line py-4 first:border-t"
                >
                  <motion.a
                    href={link.href}
                    onClick={(event) => go(event, link.href)}
                    className="flex items-baseline justify-between gap-4"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{
                      delay: 0.25 + index * STAGGER.base,
                      duration: 0.7,
                      ease: EASE,
                    }}
                  >
                    <span className="display text-[clamp(2rem,10vw,3.25rem)] text-fg">
                      {link.label}
                    </span>
                    <span className="mono-label text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
            >
              <StatusDot label={profile.status} />
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
              <div className="flex flex-wrap items-center gap-5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
                  >
                    {social.mono}
                    <ArrowUpRight size={11} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
