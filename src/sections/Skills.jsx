import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import { skills } from "../data/skills";
import {
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiExpress,
  SiFlutter,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiPostman,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const skillIcons = {
  Laravel: SiLaravel,
  Express: SiExpress,
  NestJS: SiNestjs,
  "React.jsx": SiReact,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  "Tailwind CSS": SiTailwindcss,
  Bootstrap: SiBootstrap,
  Flutter: SiFlutter,
  "C/C++": SiCplusplus,
  Git: SiGit,
  GitHub: SiGithub,
  "VS Code": VscVscode,
  Postman: SiPostman,
};

const skillColors = {
  Laravel: ["#FF2D20", "rgba(255, 45, 32, .14)"],
  Express: ["#F7DF1E", "rgba(247, 223, 30, .14)"],
  NestJS: ["#E0234E", "rgba(224, 35, 78, .14)"],
  "React.jsx": ["#61DAFB", "rgba(97, 218, 251, .14)"],
  MySQL: ["#4479A1", "rgba(68, 121, 161, .16)"],
  MongoDB: ["#47A248", "rgba(71, 162, 72, .14)"],
  JavaScript: ["#F7DF1E", "rgba(247, 223, 30, .14)"],
  HTML: ["#E34F26", "rgba(227, 79, 38, .14)"],
  CSS: ["#1572B6", "rgba(21, 114, 182, .14)"],
  "Tailwind CSS": ["#06B6D4", "rgba(6, 182, 212, .14)"],
  Bootstrap: ["#7952B3", "rgba(121, 82, 179, .14)"],
  Flutter: ["#54C5F8", "rgba(84, 197, 248, .14)"],
  "C/C++": ["#00599C", "rgba(0, 89, 156, .14)"],
  Git: ["#F05032", "rgba(240, 80, 50, .14)"],
  GitHub: ["#F8FAFC", "rgba(248, 250, 252, .12)"],
  "VS Code": ["#23A8F2", "rgba(35, 168, 242, .14)"],
  Postman: ["#FF6C37", "rgba(255, 108, 55, .14)"],
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const pillVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function Skills() {
  return (
    <section className="section-grid" id="stack">
      <SectionTitle>MY TOOLKIT</SectionTitle>
      <div className="stack-content">
        <motion.div
          className="stack-heading-row"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            The stack
            <br />
            <span className="accent">behind the work.</span>
          </h2>
        </motion.div>

        <motion.div
          className="skills-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {skills.map((skill) => (
            <motion.span
              className="skill-pill"
              key={skill}
              variants={pillVariant}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <span
                className="skill-icon"
                style={{
                  "--skill-color": skillColors[skill][0],
                  "--skill-bg": skillColors[skill][1],
                }}
              >
                {(() => {
                  const Icon = skillIcons[skill];
                  return <Icon aria-hidden="true" size={15} />;
                })()}
              </span>
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
