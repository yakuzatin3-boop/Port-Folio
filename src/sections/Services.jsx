import SectionTitle from "../components/SectionTitle";
import "./Services.css";

const services = [
  {
    label: "USER SECURITY",
    title: ["Authentication", "and", "access control"],
    description: "Implement robust authentication systems and fine-grained access controls to protect user accounts, secure sessions, and restrict sensitive features.",
  },
  {
    label: "SYSTEM INTEGRATION",
    title: ["RESTful API", "development"],
    description: "Design and build scalable REST APIs that seamlessly connect applications, manage data flow, and enable secure communication between systems.",
  },
  {
    label: "AUTOMATION",
    title: ["Telegram bot", "development"],
    description: "Create intelligent Telegram bots that automate notifications, handle routine tasks, and streamline business workflows for improved efficiency.",
  },
  {
    label: "PAYMENTS",
    title: ["Bakong KHQR", "payments"],
    description: "Integrate secure payment solutions using KHQR and Bakong, enabling smooth and reliable transactions for your customers.",
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
          <span>simple systems.</span>
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