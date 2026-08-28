import { socialLinks } from "../data/socialLinks";
import { useState } from "react";

function Contact() {
  const contactLinks = socialLinks.filter((link) => ["Email", "GitHub", "Facebook", "Telegram"].includes(link.label));
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `https://t.me/Vuthin007?text=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact-section" id="contact">
      <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
      <h2>Let&apos;s make something<br /><em>meaningful.</em></h2>
      <div className="contact-links">
        {contactLinks.map((link) => (
          <a className="contact-link" href={link.href} key={link.label} target={link.label === "Email" ? undefined : "_blank"} rel="noreferrer">
            <span>{link.label}</span>
            <b>{link.label === "Email" ? "yakuzatin3@gmail.com" : link.href.replace("https://", "").replace("web.", "")}</b>
            <i>↗</i>
          </a>
        ))}
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <label>
            Name
            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </label>
        </div>
        <label>
          Message
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project" rows="6" required />
        </label>
        <button className="contact-submit" type="submit">Send via Telegram <span>↗</span></button>
      </form>
    </section>
  );
}

export default Contact;
