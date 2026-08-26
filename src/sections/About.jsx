import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Server, Smartphone } from "lucide-react";
import profileImage from "../assets/IMG_20260801_100600_534.jpg";

const features = [
  {
    icon: Code2,
    title: "Frontend",
    description: "React, JavaScript, Tailwind CSS",
  },
  {
    icon: Server,
    title: "Backend",
    description: "Node.js, Express, Laravel, NestJS",
  },
  { icon: Database, title: "Database", description: "MongoDB, MySQL" },
  {
    icon: Smartphone,
    title: "Mobile",
    description: "Flutter and responsive applications",
  },
];

function About() {
  return (
    <section className="about-modern-section" id="about">
      <div className="about-modern-heading">
        <p className="eyebrow">GET TO KNOW ME</p>
        <h2>
          About <span>Me.</span>
        </h2>
        <div className="heading-rule" />
      </div>
      <div className="about-modern-grid">
        <motion.div
          className="about-photo-wrap"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="about-photo-frame"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={profileImage} alt="Yakuzatin in a suit" />
          </motion.div>
          <motion.div
            className="about-photo-outline"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          className="about-modern-copy"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="about-kicker">WHO I AM</p>
          <h3>
            I&apos;m a passionate <span>Full Stack Developer.</span>
          </h3>
          <p>
            I&apos;m an IT Programing who enjoys creating modern, responsive, and user-friendly
            applications. I love turning ideas into real-world digital
            experiences.
          </p>
          <p>
            My focus is building clean frontend interfaces, powerful backend
            APIs, and scalable applications using modern technologies.
          </p>
          <a className="about-cta" href="#contact">
            Let&apos;s work together <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
      <div className="about-features">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.article
            className="about-feature"
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <div className="about-feature-icon">
              <Icon size={24} />
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default About;
