import Marquee from "../ui/Marquee";
import { marqueeRows } from "../../data/stack";

export default function MarqueeStrip() {
  const [rowOne, rowTwo] = marqueeRows;

  return (
    <section
      aria-label="Technology stack"
      className="relative border-y border-line bg-surface/40 py-7 md:py-9"
    >
      <div className="fade-x">
        <Marquee
          items={rowOne.items}
          duration={52}
          itemClassName="display text-[clamp(1.35rem,3vw,2.35rem)] text-fg/65"
        />
      </div>
      <div className="fade-x mt-4 md:mt-5">
        <Marquee
          items={rowTwo.items}
          reverse
          duration={64}
          separator="✳"
          itemClassName="display text-[clamp(1.35rem,3vw,2.35rem)] text-fg/25"
        />
      </div>
    </section>
  );
}
