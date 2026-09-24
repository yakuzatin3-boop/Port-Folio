import { socialLinks } from "../data/socialLinks";

function Footer() {
  return (
    <footer className="site-footer">
      <span>© 2026 YAKUZ</span>
      <span>MADE WITH CURIOSITY / PHNOM PENH</span>
      <div style={{ display: "flex", gap: "20px" }}>
        {socialLinks.map((link) => (
          <a
            href={link.href}
            key={link.label}
            target={link.label === "Email" ? undefined : "_blank"}
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  );
}

export default Footer;
