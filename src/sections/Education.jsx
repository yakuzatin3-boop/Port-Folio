import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

const TYPEWRITER_TEXT = "IT-INSTRUCTOR";

function Education() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
      } else if (displayText.length > 0) {
        setDisplayText(TYPEWRITER_TEXT.substring(0, displayText.length - 1));
        timeoutId = setTimeout(handleTypewriter, 80);
      } else {
        setIsDeleting(false);
        timeoutId = setTimeout(handleTypewriter, 400);
      }
    };
    timeoutId = setTimeout(handleTypewriter, 140);
    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting]);

  return (
    <section className="section-grid" id="education">
      <SectionTitle number="06">WORK</SectionTitle>
      <div className="education-content">
        <motion.h2
          className="education-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="education-title-main">
            {displayText}<span className="cursor">|</span>
          </span>
          <span className="education-title-accent">
            <i>Best Experience with:</i>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Teaching and mentoring students in programming, web development,
          and basic C/C++ logic algorithms. I provide guidance on coding best
          practices, project development, and career growth in the IT industry.
        </motion.p>
      </div>
    </section>
  );
}

export default Education;
