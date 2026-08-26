import { socialLinks } from "../data/socialLinks";

function Contact() {
  const contactLinks = socialLinks.filter((link) => ["Email", "GitHub", "Facebook"].includes(link.label));

  return <section className="contact-section" id="contact"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let&apos;s make something<br /><em>meaningful.</em></h2><div className="contact-links">{contactLinks.map((link) => <a className="contact-link" href={link.href} key={link.label} target={link.label === "Email" ? undefined : "_blank"} rel="noreferrer"><span>{link.label}</span><b>{link.label === "Email" ? "yakuzatin3@gmail.com" : link.href.replace("https://", "").replace("web.", "")}</b><i>↗</i></a>)}</div></section>;
}

export default Contact;
