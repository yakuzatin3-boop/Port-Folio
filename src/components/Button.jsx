function Button({ children, href = "#projects" }) {
  return <a className="primary-button" href={href}>{children} <span>↗</span></a>;
}

export default Button;
