import { motion } from "framer-motion";
import { socialLinks } from "../data/socialLinks";
import { useState } from "react";

const contactIconMap = {
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.75 7.25A2.25 2.25 0 0 1 6 5h12a2.25 2.25 0 0 1 2.25 2.25v9.5A2.25 2.25 0 0 1 18 19H6a2.25 2.25 0 0 1-2.25-2.25v-9.5Z" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .75A11.25 11.25 0 0 0 8.91 22.5c.56.1.76-.25.76-.55v-2.09c-3.11.68-3.77-1.5-3.77-1.5-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 .1 1.95-.68 2.42-1.14.08-.7.4-1.16.73-1.42-2.46-.28-5.05-1.23-5.05-5.46 0-1.21.43-2.2 1.13-2.97-.11-.28-.49-1.42.11-2.95 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.53.22 2.67.11 2.95.7.77 1.13 1.76 1.13 2.97 0 4.24-2.59 5.18-5.07 5.45.4.35.76 1.03.76 2.07v3.08c0 .3.2.66.76.55A11.25 11.25 0 0 0 12 .75Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 21v-8.25h2.7l.4-3.15h-3.1V7.26c0-.9.25-1.52 1.54-1.52h1.64V2.8c-.28-.04-1.26-.12-2.4-.12-2.38 0-4 1.46-4 4.15V9.6H7.5v3.15h2.72V21h3.28Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Telegram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.12 4.05c.44-1.66-1.18-2.42-2.56-1.76L3.36 10.8c-1.33.62-1.3 2.46.04 3.04l4.2 1.4 1.64 4.98c.31 1.08 1.9 1.11 2.32.05l2.53-6.77 4.16 1.46c1.33.47 2.51-.95 1.87-2.16l-3.4-8.75Z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function Contact() {
  const contactLinks = socialLinks.filter((link) =>
    ["Email", "GitHub", "Facebook", "Telegram"].includes(link.label)
  );
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const telegramMessage = `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `https://t.me/Vuthin007?text=${encodeURIComponent(telegramMessage)}`;
    }, 600);
  };

  return (
    <section className="contact-section" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
        <h2>Let&apos;s make something<br /><em>meaningful.</em></h2>
      </motion.div>

      <motion.div
        className="contact-links"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {contactLinks.map((link) => (
          <motion.a
            className="contact-link"
            href={link.href}
            key={link.label}
            target={link.label === "Email" ? undefined : "_blank"}
            rel="noreferrer"
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
          >
            <span className={`contact-icon ${link.label.toLowerCase()}`}>
              {contactIconMap[link.label]}
            </span>
            <span className="contact-link-copy">
              <span>{link.label}</span>
              <b>
                {link.label === "Email"
                  ? "yakuzatin3@gmail.com"
                  : link.href.replace("https://", "").replace("web.", "")}
              </b>
            </span>
            <i>↗</i>
          </motion.a>
        ))}
      </motion.div>

      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="contact-form-row">
          <label>
            Name
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
        </div>
        <label>
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project"
            rows="6"
            required
          />
        </label>
        <div className="contact-submit-group">
          <button
            className="contact-submit"
            type="submit"
            style={submitted ? { opacity: 0.7, pointerEvents: "none" } : {}}
          >
            <span>{submitted ? "Sending..." : "Send Message"}</span>
            <span className="contact-submit-icon">↗</span>
          </button>
        </div>
      </motion.form>
    </section>
  );
}

export default Contact;
