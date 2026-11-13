"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { governanceSteps } from "@/content/product";
import { cn } from "@/lib/cn";

/** Gates sit after these step indexes: AI Generates → Human Reviews, Human Reviews → Production. */
const GATE_AFTER = [1, 2];

const reasons = [
  {
    title: "Errors stop at the gate",
    body: "AI mistakes are caught at review points before they cascade downstream into other features.",
    icon: (
      <path d="M12 3l8 4v5c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V7l8-4zM8.5 12l2.5 2.5 4.5-5" />
    ),
  },
  {
    title: "Every approval is on record",
    body: "Each decision lands in the audit trail — what was generated, and who signed off on it.",
    icon: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />,
  },
  {
    title: "Experts own the judgment",
    body: "AI handles volume and speed. Humans handle context, creativity and judgment — where it matters.",
    icon: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0" />,
  },
];

function StepIcon({ n }: { n: string }) {
  const paths: Record<string, React.ReactNode> = {
    "01": <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h3" />,
    "02": <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2M12 9a3 3 0 110 6 3 3 0 010-6z" />,
    "03": <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0" />,
    "04": <path d="M5 15l4 4L19 7M4 4h16" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[n]}
    </svg>
  );
}

function GateDiamond({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <motion.span
        aria-hidden
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.5 }}
        className="block h-3.5 w-3.5 border border-gold bg-gold/40 shadow-[0_0_18px_rgb(232_163_61/0.75)]"
      />
      <span className="font-mono text-[0.6rem] tracking-[0.14em] whitespace-nowrap text-gold-300 uppercase">Human gate</span>
    </span>
  );
}

export function AIHumanGovernance({ index = "04", id = "governance" }: { index?: string; id?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const fill = useTransform(progress, (v) => (reduce ? 1 : v));

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative overflow-x-clip bg-[linear-gradient(180deg,var(--color-brand)_0%,#0d2a2d_50%,var(--color-midnight)_100%)] section-y"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[30rem] w-[30rem] rounded-full bg-electric/30 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-electric/[0.06] blur-[120px]" />

      <div className="container-x relative">
        <SectionHeading
          id={`${id}-title`}
          index={index}
          eyebrow="Philosophy"
          title="AI generates. Experts validate."
          accent="Experts validate."
          description="Between your requirements and production code sit multiple expert-led approval gates. At every one, a domain expert decides whether the work is good enough to move forward. That’s what makes the output trustworthy."
        />

        {/* Timeline */}
        <div ref={track} className="relative mt-16 lg:mt-20">
          {/* Desktop horizontal line */}
          <div aria-hidden className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-[2px] bg-white/10 lg:block">
            <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-gradient-to-r from-electric-300 via-gold to-teal shadow-[0_0_16px_rgb(127_230_232/0.7)]" />
          </div>
          {/* Mobile vertical line */}
          <div aria-hidden className="absolute top-2 bottom-2 left-7 w-[2px] bg-white/10 lg:hidden">
            <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gradient-to-b from-electric-300 via-gold to-teal shadow-[0_0_16px_rgb(127_230_232/0.7)]" />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {governanceSteps.map((s, i) => {
              const human = s.n === "03";
              const done = s.n === "04";
              return (
                <li key={s.n} className="relative pl-20 lg:pl-0 lg:text-center">
                  <RevealOnScroll delay={i * 0.12}>
                    <div
                      className={cn(
                        "absolute top-0 left-0 grid h-14 w-14 place-items-center rounded-md border backdrop-blur lg:relative lg:mx-auto",
                        human
                          ? "border-gold/60 bg-gold/15 text-gold-300 shadow-[0_0_40px_-6px_rgb(232_163_61/0.65)]"
                          : done
                            ? "border-teal/50 bg-teal/10 text-teal-300"
                            : "border-white/20 bg-midnight/60 text-electric-300",
                      )}
                    >
                      <StepIcon n={s.n} />
                    </div>
                    <p className={cn("eyebrow lg:mt-6", human ? "text-gold-300" : "text-steel")}>Step {s.n}</p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-white">{s.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-steel lg:mx-auto lg:max-w-[15rem]">{s.body}</p>
                  </RevealOnScroll>
                  {GATE_AFTER.includes(i) && (
                    <>
                      <GateDiamond className="absolute top-7 -right-3 z-10 hidden translate-x-1/2 -translate-y-[7px] flex-col items-center gap-2.5 lg:flex" />
                      <GateDiamond className="mt-5 lg:hidden" />
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Why oversight matters */}
        <div className="mt-20 grid gap-10 border-t border-white/10 pt-14 lg:mt-24 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
          <RevealOnScroll>
            <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] text-white sm:text-[1.75rem]">Why oversight matters for enterprise development</h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-steel">The approval gates are where human judgment shapes the final product. That’s not a bottleneck — that’s the feature.</p>
          </RevealOnScroll>
          <Stagger className="grid gap-4 sm:grid-cols-3">
            {reasons.map((r) => (
              <StaggerItem key={r.title} className="rounded-md border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {r.icon}
                </svg>
                <h4 className="mt-4 font-display text-[1.02rem] font-bold text-white">{r.title}</h4>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-steel">{r.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
