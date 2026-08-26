import { useState } from "react";
import Navbar from "../components/Navbar";
import Sparkles from "../components/Sparkles";
import CursorGlow from "../components/CursorGlow";
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
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "dark");
  const handleThemeToggle = () => setTheme((currentTheme) => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("portfolio-theme", nextTheme);
    return nextTheme;
  });

  return (
    <div className={`portfolio-shell ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      <Sparkles />
      <div className="page-glow page-glow-top" />
      <CursorGlow />
      <div className="relative z-10">
        <Navbar theme={theme} onThemeToggle={handleThemeToggle} />
        <main className="site-main p-10">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>
        <div className="p-10">
            <Footer />
        <ScrollToTop />
        </div>
      </div>
    </div>
  );
}

export default Home;
