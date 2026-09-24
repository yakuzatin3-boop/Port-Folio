import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import { projects } from "../data/projects";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Projects() {
  return (
    <section className="section-grid" id="projects">
      <SectionTitle number="04">SELECTED PROJECTS</SectionTitle>
      <div className="projects-content">
        <motion.div
          className="projects-heading-row"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Ideas into
            <br />
            <span className="accent">interfaces.</span>
          </h2>
          <p>PROJECTS 2026</p>
        </motion.div>

        <motion.div
          className="project-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {projects.map((project) => (
            <motion.a
              className="project-item"
              href={project.href}
              key={project.title}
              target="_blank"
              rel="noreferrer"
              variants={cardVariant}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <div className="project-preview">
                <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
                <span>LIVE PREVIEW</span>
              </div>
              <div className="project-details">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="project-url">
                  {project.href.replace("https://", "").replace(/\/$/, "")}
                </p>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <span className="project-arrow">↗</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
