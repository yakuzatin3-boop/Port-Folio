import { useEffect, useState } from "react";

import GridBackground from "./components/layout/GridBackground";
import BlackHoleLoader from "./components/layout/BlackHoleLoader";
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

      {/* Usage: simulates 0->100%, swallows the image, flashes, then reveals
          the main content. Also accepts progress={n} to drive it yourself:
          <BlackHoleLoader progress={p} onComplete={() => setLoading(false)} /> */}
      {!ready && <BlackHoleLoader onComplete={() => setReady(true)} />}

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
