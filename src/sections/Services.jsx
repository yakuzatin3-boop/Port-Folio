import SectionTitle from "../components/SectionTitle";

const services = [
  {
    title: "RESTful API development",
    code: "API",
    category: "BACKEND SYSTEMS",
    description: "Backend endpoints that let websites and apps securely exchange data with a reliable, predictable structure.",
    tags: ["Laravel", "Express", "NestJS"],
  },
  {
    title: "Secure JWT authentication",
    code: "AUTH",
    category: "ACCESS CONTROL",
    description: "Login and authorization systems that protect user accounts, sessions, and private application features.",
    tags: ["JWT", "Roles", "Sessions"],
  },
  {
    title: "Telegram Bot integrations",
    code: "BOT",
    category: "AUTOMATION",
    description: "Automated Telegram assistants that send updates, receive commands, and connect chat workflows to your systems.",
    tags: ["Telegram", "Webhooks", "Events"],
  },
  {
    title: "Bakong KHQR payments",
    code: "PAY",
    category: "PAYMENT FLOWS",
    description: "Cambodian QR payment flows that help customers pay quickly while your system tracks each transaction.",
    tags: ["KHQR", "Bakong", "Webhooks"],
  },
];

function Services() {
  return (
    <section className="services-section section-grid" id="services">
      <SectionTitle number="03">WHAT I BUILD</SectionTitle>
      <div className="services-content">
        <h2>
          Useful systems,
          <br />
          <span>built with intent.</span>
        </h2>
        <div className="service-list">
          {services.map((service, index) => (
            <div className="service-item" key={service.title}>
              <span className="service-number">0{index + 1}</span>
              <span className="service-mark">{service.code}</span>
              <div className="service-copy">
                <small>{service.category}</small>
                <strong>{service.title}</strong>
                <p>{service.description}</p>
                <div className="service-tags">
                  {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <b aria-hidden="true">↗</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
