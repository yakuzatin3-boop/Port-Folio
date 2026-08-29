import SectionTitle from "../components/SectionTitle";

const services = [
  {
    label: "USER SECURITY",
    title: ["Authentication", "and", "access control"],
    description: "Create secure login and permission systems that protect accounts, sessions, and sensitive features across your platform.",
  },
  {
    label: "SYSTEM INTEGRATION",
    title: ["RESTful API", "development"],
    description: "Reliable APIs that connect your apps and data in a smooth, secure, and scalable way.",
  },
  {
    label: "AUTOMATION",
    title: ["Telegram bot"],
    description: "Useful bots that send updates, handle tasks, and keep business processes moving.",
  },
  {
    label: "PAYMENTS",
    title: ["Bakong KHQR", "payments"],
    description: "Simple payment flows for fast and trusted transactions using KHQR and Bakong.",
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