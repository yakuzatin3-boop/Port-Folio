export default function StatusDot({ label, className = "", size = 8 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-accent"
          style={{ animation: "pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite" }}
          aria-hidden
        />
        <span
          className="relative inline-flex rounded-full bg-accent"
          style={{ width: size, height: size, boxShadow: "0 0 12px var(--glow)" }}
          aria-hidden
        />
      </span>
      {label ? <span className="mono-label text-muted">{label}</span> : null}
    </span>
  );
}
