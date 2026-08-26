import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Navbar({ theme, onThemeToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`site-nav ${isMenuOpen ? "menu-open" : ""}`} aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="Vuthin home"><span>VUTHIN<span className="brand-dot">.</span></span></a>
      <div className="nav-links">
        <a href="#top" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="#stack" onClick={closeMenu}>Skills</a><a href="#projects" onClick={closeMenu}>Projects</a><a href="#contact" onClick={closeMenu}>Contact</a>
      </div>
      <div className="nav-actions"><ThemeToggle theme={theme} onToggle={onThemeToggle} /><a className="nav-contact" href="mailto:yakuzatin03@gmail.com">Let&apos;s talk <span>↗</span></a></div>
      <button className="mobile-menu-toggle" type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}>
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="mobile-navigation" id="mobile-navigation">
        <a href="#top" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="#stack" onClick={closeMenu}>Skills</a><a href="#projects" onClick={closeMenu}>Projects</a><a href="#contact" onClick={closeMenu}>Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;
