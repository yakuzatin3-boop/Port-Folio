import { useState, useEffect } from "react";
import Button from "../components/Button";
import profileImage from "../assets/image.png";
import travelImageTwo from "../assets/IMG_5861.JPG";
import travelImageThree from "../assets/IMG_6008.JPG";
import { socialLinks } from "../data/socialLinks";

const TYPEWRITER_TEXT = "TIM VUTHIN";
const HERO_IMAGES = [profileImage, travelImageTwo, travelImageThree];

function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let timeoutId;

    const handleTypewriter = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayText.length < TYPEWRITER_TEXT.length) {
          setDisplayText(TYPEWRITER_TEXT.substring(0, displayText.length + 1));
          timeoutId = setTimeout(handleTypewriter, 140);
        } else {
          // Pause at full word before deleting
          timeoutId = setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        // Deleting backward
        if (displayText.length > 0) {
          setDisplayText(TYPEWRITER_TEXT.substring(0, displayText.length - 1));
          timeoutId = setTimeout(handleTypewriter, 80);
        } else {
          // Pause before restarting
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
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const activeImage = HERO_IMAGES[activeImageIndex];

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">

        <h1 className="hero-title reveal-item">
          <span className="typewriter-name" aria-label={TYPEWRITER_TEXT}>
            {displayText}
            <span className="cursor" aria-hidden="true">|</span>
          </span>
          <br />
          <em>FULL-STACK</em>
          <br />
          DEVELOPER
        </h1>

        <p className="hero-intro reveal-item">
          Hi, I'm Vuthin. As a senior web developer, I focus on building robust, high-performance web applications while constantly pushing my boundaries with modern frameworks and system designs.
        </p>

        <div className="hero-actions reveal-item">
          <Button>View projects</Button>
          <a className="cv-button" href="/CV%20vuthin.pdf" download>
            Download CV <span>↓</span>
          </a>
        </div>

        <div className="hero-proof reveal-item">
          <div>
            <strong>Designing clean interfaces</strong>
            <span>UI systems focused on clarity and speed</span>
          </div>
          <div>
            <strong>Building reliable systems</strong>
            <span>REST APIs and modern web experiences</span>
          </div>
        </div>

        <div className="hero-socials reveal-item">
          {socialLinks
            ?.filter((link) => link.label !== "Email")
            .map((link) => (
              <a
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} <span>↗</span>
              </a>
            ))}
        </div>
      </div>

      <div className="hero-profile">
        <div className="hero-profile-frame">
          <img src={activeImage} alt="Tim Vuthin portrait" />
          <span className="profile-frame-label">TIM VUTHIN</span>
        </div>
        <span className="hero-profile-caption">
          IT INSTRUCTOR / DEVELOPER
          <br />
          <b>BUILD / TEACH / CREATE</b>
        </span>
      </div>

      <div className="scroll-note">
        <span className="scroll-line" /> SCROLL TO DISCOVER
      </div>
    </section>
  );
}

export default Hero;