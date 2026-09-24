import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";

const services = [
  {
    label: "FRONTEND",
    title: "React UI Development",
    description: "Build interactive and responsive user interfaces with React, creating seamless experiences that work perfectly on all devices.",
  },
  {
    label: "BACKEND",
    title: "Node.js API Development",
    description: "Design scalable server-side solutions and robust APIs using Node.js, handling complex business logic and data management efficiently.",
  },
  {
    label: "INTEGRATIONS",
    title: "Payment & Bot Systems",
    description: "Implement payment solutions like KHQR and Bakong, plus intelligent Telegram bots for automation and business process optimization.",
  },
  {
    label: "DATABASE",
    title: "Data Architecture",
    description: "Design efficient database schemas and implement secure data storage solutions that scale with your application growth.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Services() {
  return (
    <section className="section-grid" id="services">
      <SectionTitle number="03">WHAT I BUILD</SectionTitle>
      <div className="services-content">
        <motion.h2
          className="services-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <i><u>I build the project.</u></i>
        </motion.h2>

        <motion.div
          className="service-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((service) => (
            <motion.article
              className="service-item"
              key={service.label}
              variants={cardVariant}
              whileHover={{ x: 6, transition: { duration: 0.25 } }}
            >
              <div className="service-header">
                <small>{service.label}</small>
                <span className="service-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="service-copy">
                <strong>{service.title}</strong>
                <p>{service.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
