function MarqueeRow({ items, separator, itemClassName }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`mx-4 flex items-center gap-4 whitespace-nowrap md:mx-6 md:gap-6 ${itemClassName}`}
        >
          {item}
          <span className="serif-accent select-none text-[1.5em] leading-none opacity-70" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee({
  items,
  reverse = false,
  duration = 46,
  className = "",
  itemClassName = "",
  separator = "✦",
}) {
  return (
    <div className={`marquee ${className}`}>
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` }}
      >
        <MarqueeRow items={items} separator={separator} itemClassName={itemClassName} />
        <MarqueeRow items={items} separator={separator} itemClassName={itemClassName} />
      </div>
    </div>
  );
}
