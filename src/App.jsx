import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import GridBackground from "./components/layout/GridBackground";
import Preloader from "./components/layout/Preloader";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import BackToTop from "./components/layout/BackToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/sections/Hero";
import MarqueeStrip from "./components/sections/MarqueeStrip";
import About from "./components/sections/About";
import Stack from "./components/sections/Stack";
import Projects from "./components/sections/Projects";
import Timeline from "./components/sections/Timeline";
import Contact from "./components/sections/Contact";

import { initLenis, destroyLenis } from "./lib/lenis";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initLenis();
    return destroyLenis;
  }, []);

  return (
    <>
      <GridBackground />
      <ScrollProgress />
      <CustomCursor />

      <AnimatePresence>
        {!ready && <Preloader key="preloader" onComplete={() => setReady(true)} />}
      </AnimatePresence>

      {ready && (
        <>
          <Navbar />
          <main id="top">
            <Hero />
            <MarqueeStrip />
            <About />
            <Stack />
            <Projects />
            <Timeline />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}

export default App;
