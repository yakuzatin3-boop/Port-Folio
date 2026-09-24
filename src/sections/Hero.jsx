import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import profileImage from "../assets/image.png";
import travelImageTwo from "../assets/IMG_5861.JPG";
import travelImageThree from "../assets/IMG_6008.JPG";
import { socialLinks } from "../data/socialLinks";

const TYPEWRITER_TEXT = "TIM VUTHIN";
const HERO_IMAGES = [profileImage, travelImageTwo, travelImageThree];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let timeoutId;
    const handleTypewriter = () => {
      if (!isDeleting) {
        if (displayText.length < TYPEWRITER_TEXT.length) {
          setDisplayText(TYPEWRITER_TEXT.substring(0, displayText.length + 1));
          timeoutId = setTimeout(handleTypewriter, 140);
        } else {
          timeoutId = setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(TYPEWRITER_TEXT.substring(0, displayText.length - 1));
          timeoutId = setTimeout(handleTypewriter, 80);
        } else {
          setIsDeleting(false);
          timeoutId = setTimeout(handleTypewriter, 400);
        }
      }
    };
    timeoutId = setTimeout(handleTypewriter, 140);
    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveImageIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="hero-section" id="top">
      <motion.div
        className="hero-copy"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="hero-eyebrow" variants={fadeUp}>
          <span className="hero-status-dot" /> AVAILABLE FOR WORK
        </motion.p>

        <motion.h1 className="hero-title" variants={fadeUp}>
          <span className="typewriter-name" aria-label={TYPEWRITER_TEXT}>
            {displayText}
            <span className="cursor" aria-hidden="true">|</span>
          </span>
          <br />
          <em>FULL-STACK</em>
          <br />
          DEVELOPER
        </motion.h1>

        <motion.p className="hero-intro" variants={fadeUp}>
          I build robust, high-performance web applications with modern frameworks.
          From clean interfaces to scalable backends — turning ideas into production-ready products.
        </motion.p>

        <motion.div className="hero-actions" variants={fadeUp}>
          <Button>View projects</Button>
          <a className="cv-button" href="/Tim_Vuthin_CV%20(4).pdf" download>
            Download CV <span>↓</span>
          </a>
        </motion.div>

        <motion.div className="hero-proof" variants={fadeUp}>
          <div>
            <strong>Designing clean interfaces</strong>
            <span>UI systems focused on clarity and speed</span>
          </div>
          <div>
            <strong>Building reliable systems</strong>
            <span>REST APIs and modern web experiences</span>
          </div>
        </motion.div>

        <motion.div className="hero-socials" variants={fadeUp}>
          {socialLinks
            ?.filter((link) => link.label !== "Email")
            .map((link) => (
              <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                {link.label} <span>↗</span>
              </a>
            ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-profile"
        variants={slideRight}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="hero-profile-frame"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={HERO_IMAGES[activeImageIndex]} alt="Tim Vuthin portrait" />
          <span className="profile-frame-label">TIM VUTHIN</span>
          <span className="profile-frame-index">
            {String(activeImageIndex + 1).padStart(2, "0")} / {String(HERO_IMAGES.length).padStart(2, "0")}
          </span>
        </motion.div>
        <span className="hero-profile-caption">
          IT INSTRUCTOR / DEVELOPER
          <br />
          <b>BUILD / TEACH / CREATE</b>
        </span>
      </motion.div>

      <motion.div
        className="scroll-note"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
      >
        <span className="scroll-line" /> SCROLL TO DISCOVER
      </motion.div>
    </section>
  );
}

export default Hero;
