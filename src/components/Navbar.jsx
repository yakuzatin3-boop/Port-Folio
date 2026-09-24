import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function Navbar({ theme, onThemeToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["top", "about", "stack", "projects", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((e, href) => {
    closeMenu();
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
    }
  }, []);

  return (
    <nav
      className={`site-nav ${isMenuOpen ? "menu-open" : ""} ${isScrolled ? "scrolled" : ""}`}
      aria-label="Main navigation"
    >
      <a className="brand" href="#top" aria-label="Vuthin home" onClick={(e) => handleNavClick(e, "#top")}>
        <span>
          VUTHIN<span className="brand-dot">.</span>
        </span>
      </a>

      <div className="nav-links">
        {NAV_ITEMS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href ? "active" : ""}
            onClick={(e) => handleNavClick(e, href)}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <a className="nav-contact" href="mailto:yakuzatin3@gmail.com">
          Let&apos;s talk <span>↗</span>
        </a>
      </div>

      <button
        className="mobile-menu-toggle"
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="mobile-navigation" id="mobile-navigation">
        {NAV_ITEMS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href ? "active" : ""}
            onClick={(e) => handleNavClick(e, href)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
