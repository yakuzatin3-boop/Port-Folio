import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Phone, Globe, Check, Loader2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import MagneticButton from "../ui/MagneticButton";
import BlackHoleScene from "../ui/BlackHoleScene";
import { profile } from "../../data/profile";
import { socials } from "../../data/socials";
import { EASE } from "../../lib/easing";

const fields = [
  { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
  { id: "email", label: "Email", type: "email", placeholder: "you@company.com", required: true },
];

const inputClass =
  "peer w-full bg-transparent pb-3 pt-2 text-[15px] text-fg outline-none placeholder:text-muted/55";

function Field({ field, value, error, onChange }) {
  return (
    <label htmlFor={field.id} className="block">
      <span className="mono-label text-muted">{field.label}</span>
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />
      <span className="relative block h-px w-full overflow-hidden bg-line">
        <span
          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100 ${
            error ? "bg-red-500 scale-x-100" : "bg-accent"
          }`}
        />
      </span>
      {error ? <span className="mono-label mt-2 block text-red-500">{error}</span> : null}
    </label>
  );
}

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email";
    if (values.message.trim().length < 10) next.message = "Tell me a little more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    setTimeout(() => setStatus("success"), 850);
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setStatus("idle");
  };

  return (
    <section id="contact" className="relative section-pad scroll-mt-32 overflow-hidden border-t border-line">
      {/* Background: the black hole in full view behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[min(88vw,82vh)] w-[min(88vw,82vh)] -translate-x-1/2 -translate-y-1/2 md:left-[58%]">
          <BlackHoleScene className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      <div className="container-x relative">
        <SectionHeading index="05" label="CONTACT" line1="LET'S WORK" accent="together." />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="relative mb-12 h-44 w-44">
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full animate-[spin-slow_24s_linear_infinite]"
                aria-hidden
              >
                <defs>
                  <path
                    id="contact-circle"
                    d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
                    fill="none"
                  />
                </defs>
                <text
                  fill="var(--muted)"
                  fontSize="10.5"
                  letterSpacing="6"
                  style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                >
                  <textPath href="#contact-circle">
                    Available for work · Phnom Penh · Available for work ·
                  </textPath>
                </text>
              </svg>

              <div className="absolute inset-0 grid place-items-center">
                <MagneticButton
                  href={`mailto:${profile.email}`}
                  strength={0.4}
                  aria-label={`Email ${profile.email}`}
                  className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-accent text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_20px_60px_-18px_var(--glow)]"
                >
                  <span className="mono-label font-medium">Let&apos;s talk</span>
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </MagneticButton>
              </div>
            </div>

            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="group relative inline-block max-w-full"
            >
              <span className="display block break-all text-[clamp(1.35rem,3.4vw,2.75rem)] text-fg transition-colors duration-300 group-hover:text-accent">
                {profile.email}
              </span>
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 block h-px w-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              />
            </a>

            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              <li>
                <a
                  href={profile.phoneHref}
                  data-cursor="link"
                  className="group flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-3 text-muted transition-colors group-hover:text-fg">
                    <Phone size={14} className="text-accent" />
                    <span className="mono-label">Phone</span>
                  </span>
                  <span className="text-sm text-fg transition-colors group-hover:text-accent">
                    {profile.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="group flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-3 text-muted transition-colors group-hover:text-fg">
                    <Globe size={14} className="text-accent" />
                    <span className="mono-label">Website</span>
                  </span>
                  <span className="text-sm text-fg transition-colors group-hover:text-accent">
                    {profile.website}
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-8">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="mono-label inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-line-hover hover:text-fg"
                  >
                    <Icon size={13} style={{ color: social.color }} />
                    {social.mono}
                    <ArrowUpRight size={11} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="group relative">
              {/* Orbiting glow shadow: brightens on hover/focus, spins faster while sending */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[6px] animate-bh-spin rounded-[30px] opacity-40 transition-opacity duration-500 group-focus-within:opacity-95"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(255,150,70,0.85) 70deg, rgba(139,92,246,0.8) 150deg, transparent 240deg, rgba(255,150,70,0.4) 330deg)",
                  filter: "blur(26px)",
                  ...(status === "sending" ? { animationDuration: "2.4s", opacity: 0.95 } : null),
                }}
              />
              <div className="relative rounded-card border border-line bg-surface/70 p-6 shadow-[0_40px_100px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl backdrop-saturate-150 md:p-9">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex min-h-[380px] flex-col items-start justify-center gap-5"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-[#0A0A0A]">
                      <Check size={22} strokeWidth={2.5} />
                    </span>
                    <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)] text-fg">
                      Message <span className="serif-accent">sent.</span>
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed text-muted">
                      Thanks {values.name.split(" ")[0]} — I&apos;ll get back to you at{" "}
                      <span className="text-fg">{values.email}</span> as soon as I can.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      data-cursor="link"
                      className="mono-label mt-2 rounded-full border border-line px-5 py-3 text-fg transition-colors duration-300 hover:border-line-hover hover:text-accent"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex min-h-[380px] flex-col gap-7"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="mono-label text-muted">Project enquiry</span>
                      <span className="mono-label text-accent">Response &lt; 24h</span>
                    </div>

                    <div className="grid gap-7 sm:grid-cols-2">
                      {fields.map((field) => (
                        <Field
                          key={field.id}
                          field={field}
                          value={values[field.id]}
                          error={errors[field.id]}
                          onChange={update}
                        />
                      ))}
                    </div>

                    <label htmlFor="message" className="block">
                      <span className="mono-label text-muted">Message</span>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Tell me about the project, timeline and goals…"
                        value={values.message}
                        onChange={update}
                        aria-invalid={Boolean(errors.message)}
                        className={`${inputClass} resize-none`}
                      />
                      <span className="relative block h-px w-full overflow-hidden bg-line">
                        <span
                          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100 ${
                            errors.message ? "bg-red-500 scale-x-100" : "bg-accent"
                          }`}
                        />
                      </span>
                      {errors.message ? (
                        <span className="mono-label mt-2 block text-red-500">{errors.message}</span>
                      ) : null}
                    </label>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
                      <span className="mono-label text-muted">
                        Or email {profile.email}
                      </span>
                      <MagneticButton
                        as="button"
                        type="submit"
                        disabled={status === "sending"}
                        strength={0.25}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0A0A0A] transition-shadow duration-300 hover:shadow-[0_16px_44px_-14px_var(--glow)] disabled:cursor-wait disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            Sending
                            <Loader2 size={14} className="animate-spin" />
                          </>
                        ) : (
                          <>
                            Send message
                            <ArrowUpRight size={14} strokeWidth={2.5} />
                          </>
                        )}
                      </MagneticButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
