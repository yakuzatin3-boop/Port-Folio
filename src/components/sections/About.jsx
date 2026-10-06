import { GraduationCap, Languages, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import SpotlightCard from "../ui/SpotlightCard";
import WordFill from "../ui/WordFill";
import Counter from "../ui/Counter";
import LiveClock from "../ui/LiveClock";
import { profile } from "../../data/profile";
import { blurFadeUp, container } from "../../lib/variants";
import { STAGGER } from "../../lib/easing";

const card =
  "rounded-card border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-hover md:p-7";

function CardLabel({ children, icon: Icon }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {Icon ? <Icon size={13} strokeWidth={2.2} className="text-accent" /> : null}
      <span className="mono-label text-muted">{children}</span>
    </div>
  );
}

function Stat({ value, from, suffix, label }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="display text-[clamp(2rem,4.5vw,3.25rem)] leading-none tabular-nums text-fg">
        <Counter to={value} from={from} />
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="mono-label text-muted">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative section-pad scroll-mt-32">
      <div className="container-x">
        <SectionHeading index="01" label="ABOUT" line1="A BIT ABOUT" accent="me." />

        <motion.div
          variants={container(STAGGER.slow, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12"
        >
          <SpotlightCard
            variants={blurFadeUp}
            radius={560}
            className={`${card} md:col-span-2 lg:col-span-7 lg:row-span-2`}
          >
            <CardLabel>Profile</CardLabel>
            <WordFill
              text={profile.bio}
              className="text-[clamp(1.05rem,1.55vw,1.35rem)] leading-[1.55] text-fg/85"
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5">
              <span className="mono-label text-muted">{profile.website}</span>
              <span className="mono-label text-muted">{profile.phone}</span>
              <span className="mono-label text-accent">{profile.timezone}</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            variants={blurFadeUp}
            radius={460}
            className={`${card} md:col-span-2 lg:col-span-5`}
          >
            <CardLabel>By the numbers</CardLabel>
            <div className="grid grid-cols-3 gap-4">
              {(profile.stats ?? []).map((stat) => (
                <Stat key={stat.label} {...stat} />
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard
            variants={blurFadeUp}
            radius={380}
            className={`${card} lg:col-span-3`}
          >
            <CardLabel icon={Briefcase}>Currently</CardLabel>
            <p className="font-display text-xl font-bold uppercase tracking-[-0.03em] text-fg">
              {profile.current.role}
            </p>
            <p className="mt-1.5 text-sm font-medium text-accent">@ {profile.current.org}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {profile.current.detail}
            </p>
          </SpotlightCard>

          <SpotlightCard
            variants={blurFadeUp}
            radius={380}
            className={`${card} lg:col-span-2`}
          >
            <CardLabel icon={GraduationCap}>Education</CardLabel>
            <p className="font-display text-lg font-bold uppercase leading-tight tracking-[-0.03em] text-fg">
              {profile.education.degree}
            </p>
            <p className="mt-2.5 text-sm text-accent">{profile.education.detail}</p>
          </SpotlightCard>

          <SpotlightCard
            variants={blurFadeUp}
            radius={480}
            className={`${card} lg:col-span-6`}
          >
            <CardLabel icon={Languages}>Languages</CardLabel>
            <ul className="divide-y divide-line">
              {(profile.languages ?? []).map((language) => (
                <li
                  key={language.name}
                  className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <span className="font-display text-2xl font-bold uppercase tracking-[-0.03em] text-fg">
                    {language.name}
                  </span>
                  <span className="mono-label text-accent">{language.level}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard
            variants={blurFadeUp}
            radius={480}
            className={`${card} lg:col-span-6`}
          >
            <CardLabel icon={MapPin}>Location</CardLabel>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
              <div>
                <p className="font-display text-2xl font-bold uppercase tracking-[-0.03em] text-fg">
                  {profile.location}
                </p>
                <p className="mono-label mt-3 text-muted">Local time</p>
              </div>
              <LiveClock className="text-left md:text-right" />
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
