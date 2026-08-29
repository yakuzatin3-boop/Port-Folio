import { useEffect, useState } from "react";
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
    <section className="education-section section-grid" id="education">
      <SectionTitle number="06">WORK</SectionTitle>
      <div className="education-content">
        <h2 className="education-heading">
          <span className="education-title-main">{displayText}<span className="cursor">|</span></span>
          <span className="education-title-accent"><i>Best Experience with:</i></span>
          
        </h2>
        <p>
          Teaching and mentoring students in programming, web development, and basic C/C++ logic algorithms.
           I provide guidance on coding best practices, project development, and career growth in the IT industry.
        </p>
      </div>
    </section>
  );
}

export default Education;
