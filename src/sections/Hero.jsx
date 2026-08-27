import Button from "../components/Button";
import profileImage from "../assets/image.png";
import { socialLinks } from "../data/socialLinks";
import { useState } from "react";
import { useEffect } from "react";
function Hero() {

  const text = "TIM VUTHIN";

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && displayText.length < text.length) {
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1));
      }, 150);
    } else if (!isDeleting && displayText.length === text.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length - 1));
      }, 100);
    } else if (isDeleting && displayText.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow reveal-item">
          👋 HELLO, I&apos;M
        </p>
        <h1 className="hero-title reveal-item">
          <span className="typewriter-name">
            {displayText}
            <span className="cursor">|</span>
          </span>
          <br />
          <em>FULL STACK</em>
          <br />
          DEVELOPER
        </h1>
        <p className="hero-intro reveal-item">
          I build modern web applications and digital experiences with clean,
          scalable, and beautiful code.
        </p>
        <div className="hero-actions reveal-item">
          <Button>View projects</Button>
          <a className="cv-button" href="/CV%20vuthin.pdf" download>
            Download CV <span>↓</span>
          </a>
        </div>
        <div className="hero-socials reveal-item">
          {socialLinks.filter((link) => link.label !== "Email").map((link) => (
            <a
              href={link.href}
              key={link.label}
              target={link.label === "Email" ? undefined : "_blank"}
              rel="noreferrer"
            >
              {link.label} <span>↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="hero-profile">
        <div className="hero-profile-frame">
          <img src={profileImage} alt="Vuthin in a black-and-white portrait" />
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
