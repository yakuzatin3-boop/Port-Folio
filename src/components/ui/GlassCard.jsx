export default function GlassCard({ children, className = "", interactive = true, ...rest }) {
  return (
    <div
      className={`relative rounded-card border border-line bg-surface transition-[border-color,transform] duration-500 ${
        interactive ? "hover:border-line-hover" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
