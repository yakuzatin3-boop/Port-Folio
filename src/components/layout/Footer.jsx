import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import LiveClock from "../ui/LiveClock";
import StatusDot from "../ui/StatusDot";
import BlackHoleScene from "../ui/BlackHoleScene";
import { navLinks, profile } from "../../data/profile";
import { socials } from "../../data/socials";
import { scrollTo, scrollToTop } from "../../lib/lenis";

function ColumnTitle({ children }) {
  return <p className="mono-label mb-5 text-muted">{children}</p>;
}

const watermarkTextStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(5rem,22vw,22rem)",
  fontWeight: 700,
  letterSpacing: "-0.05em",
};

export default function Footer() {
  const watermarkRef = useRef(null);

  return (
    <footer className="relative overflow-hidden border-t border-line pb-8 pt-16 md:pt-24">
      {/* Full-footer black hole: the hole centers itself on the VUTHIN watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <BlackHoleScene anchorRef={watermarkRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <ColumnTitle>Sitemap</ColumnTitle>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    data-cursor="link"
                    className="link-underline group inline-flex items-baseline gap-3 text-sm text-muted transition-colors duration-300 hover:text-fg"
                  >
                    <span className="mono-label text-accent tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Elsewhere</ColumnTitle>
            <ul className="space-y-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="link-underline group inline-flex items-center gap-2.5 text-sm text-muted transition-colors duration-300 hover:text-fg"
                    >
                      <Icon size={14} style={{ color: social.color }} />
                      {social.label}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="link"
                  className="link-underline inline-flex items-center gap-2.5 text-sm text-muted transition-colors duration-300 hover:text-fg"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <ColumnTitle>Local time</ColumnTitle>
            <LiveClock className="md:text-right" />
            <div className="mt-6 flex items-center gap-3 md:justify-end">
              <StatusDot />
              <span className="mono-label text-muted">Open to work</span>
            </div>
          </div>
        </div>

        <div
          ref={watermarkRef}
          className="footer-watermark relative mt-16 h-[calc(clamp(5rem,22vw,22rem)*0.8)] md:mt-24"
        >
          {/* Name sits on top of the scene: translucent dark fill keeps the
              hole visible through the letters, white stroke keeps them readable */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(10, 10, 10, 0.45)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1.5"
              style={watermarkTextStyle}
            >
              VUTHIN
            </text>
          </svg>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-line pt-6 text-center md:flex-row md:text-left">
          <p className="mono-label text-muted">
            © {new Date().getFullYear()} {profile.name} — All rights reserved
          </p>

          <p className="mono-label text-muted">{profile.website}</p>

          <button
            type="button"
            onClick={() => scrollToTop()}
            data-cursor="link"
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-line-hover hover:text-accent"
          >
            <span className="mono-label">Back to top</span>
            <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
