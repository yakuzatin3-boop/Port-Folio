import SectionTitle from "../components/SectionTitle";
import "./Services.css";

const services = [
  {
    label: "FRONTEND",
    title: ["React", "UI Development"],
    description: "Build interactive and responsive user interfaces with React, creating seamless experiences that work perfectly on all devices.",
  },
  {
    label: "BACKEND",
    title: ["Node.js", "API Development"],
    description: "Design scalable server-side solutions and robust APIs using Node.js, handling complex business logic and data management efficiently.",
  },
  {
    label: "INTEGRATIONS",
    title: ["Payment", "and Bot Systems"],
    description: "Implement payment solutions like KHQR and Bakong, plus intelligent Telegram bots for automation and business process optimization.",
  },
  {
    label: "DATABASE",
    title: ["Data Management", "and Architecture"],
    description: "Design efficient database schemas and implement secure data storage solutions that scale with your application growth.",
  },
];

function Services() {
  return (
    <section className="services-section section-grid" id="services">
      <SectionTitle>WHAT I BUILD</SectionTitle>
      <div className="services-content">
        <h2 className="services-heading">
          I build
          <br />
          <span>the project.</span>
        </h2>
        <div className="service-list">
          {services.map((service) => (
            <article className="service-item" key={service.label}>
              <div className="service-header">
                <small className="service-label">{service.label}</small>
                <b className="service-arrow" aria-hidden="true">↗</b>
              </div>
              <div className="service-copy">
                <h3 className="service-title">
                  {service.title.map((line, index) => (
                    <span key={index} className="service-title-line">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="service-description">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;