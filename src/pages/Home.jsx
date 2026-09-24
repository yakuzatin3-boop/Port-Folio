import { useState } from "react";
import Navbar from "../components/Navbar";
import Sparkles from "../page/Sparkles";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Services from "../sections/Services";
import Projects from "../sections/Projects";
import Experience from "../sections/Experience";
import Education from "../sections/Education";
import Contact from "../sections/Contact";

function Home() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("portfolio-theme") || "dark"
  );

  const handleThemeToggle = () =>
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", next);
      return next;
    });

  return (
    <div className={`portfolio-shell ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      <Sparkles />
      <div className="page-glow page-glow-top" />
      <div className="page-glow page-glow-side" aria-hidden="true" />

      <div className="relative z-10">
        <Navbar theme={theme} onThemeToggle={handleThemeToggle} />
        <main>
          <div className="portfolio-content">
            <Hero />
            <About />
            <Skills />
            <Services />
            <Projects />
            <Experience />
            <Education />
            <Contact />
          </div>
          <div className="portfolio-content">
            <Footer />
          </div>
        </main>
        <ScrollToTop />
      </div>
    </div>
  );
}

export default Home;
