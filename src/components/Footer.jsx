import { socialLinks } from "../data/socialLinks";

function Footer() {
  return (
    <footer className="site-footer p-10">
      <span>© 2026 YAKUZ</span>
      <span>MADE WITH CURIOSITY / PHNOM PENH</span>
      <div>
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
