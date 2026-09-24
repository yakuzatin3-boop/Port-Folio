import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import { experience } from "../data/experience";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Experience() {
  return (
    <section className="section-grid" id="experience">
      <SectionTitle number="05">EXPERIENCE</SectionTitle>
      <div className="experience-content">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="experience-lead">
            <i><u>Learning by doing</u></i>
          </span>
        </motion.h2>

        <motion.div
          className="experience-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {experience.map((item) => (
            <motion.article
              className="experience-item"
              key={item.title}
              variants={itemVariant}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <span className="experience-period">{item.period}</span>
              <div className="experience-copy">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
