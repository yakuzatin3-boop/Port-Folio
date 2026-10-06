import { useEffect, useState } from "react";

const formatters = {
  time: new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Phnom_Penh",
  }),
  date: new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh",
  }),
};

export default function LiveClock({ withDate = true, className = "" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold tabular-nums leading-none tracking-[-0.04em] text-fg">
        {formatters.time.format(now)}
        <span className="ml-2 align-middle font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          ICT
        </span>
      </p>
      {withDate ? (
        <p className="mono-label mt-2.5 text-muted">{formatters.date.format(now)}</p>
      ) : null}
    </div>
  );
}
