"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { governanceSteps } from "@/content/product";
import { cn } from "@/lib/cn";

const reasons = [
  { title: "Errors stop at the gate", body: "AI mistakes are caught at review points before they cascade downstream into other features." },
  { title: "Every approval is on record", body: "Each decision lands in the audit trail — what was generated, and who signed off on it." },
  { title: "Experts own the judgment", body: "AI handles volume and speed. Humans handle context, creativity and judgment." },
];

function Gate({ i }: { i: number }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative flex items-center justify-center lg:w-14 lg:shrink-0">
      <span className="absolute inset-x-0 top-1/2 hidden h-px bg-line-dark lg:block" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-line-dark lg:hidden" />
      <motion.span
        initial={{ scale: reduce ? 1 : 0, rotate: 45, opacity: reduce ? 1 : 0 }}
        whileInView={{ scale: 1, rotate: 45, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.7, delay: 0.25 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-3 h-4 w-4 border border-gold bg-abyss shadow-[0_0_18px_rgb(232_163_61/0.45)] lg:my-0"
      >
        <span className="absolute inset-[3px] bg-gold" />
      </motion.span>
    </div>
  );
}

export function GatesBand() {
  return (
    <section aria-labelledby="v2-gates-title" className="relative overflow-hidden bg-abyss section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-60 mask-fade-b" />
      <div className="container-x relative">
        <SectionHeading
          id="v2-gates-title"
          index="03"
          eyebrow="Philosophy"
          title="AI generates. Experts validate."
          accent="Experts validate."
          description="Between your requirements and production code sit multiple expert-led approval gates. At every one, a domain expert decides whether the work is good enough to move forward. That’s what makes the output trustworthy."
        />

        <ol className="mt-16 flex flex-col lg:flex-row lg:items-stretch">
          {governanceSteps.map((s, i) => {
            const human = s.n === "03";
            return (
              <li key={s.n} className="contents">
                {i > 0 && <Gate i={i} />}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative flex-1 rounded-md border p-6 sm:p-7",
                    human ? "border-gold/50 bg-gold/[0.06]" : "border-line-dark bg-white/[0.02]",
                  )}
                >
                  <p className={cn("font-mono text-[clamp(2.2rem,4vw,3.2rem)] leading-none font-medium tracking-[-0.04em]", human ? "text-gold-300" : "text-white/25")}>{s.n}</p>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{s.body}</p>
                  {human && <p className="mt-5 inline-flex rounded-xs border border-gold/40 px-2 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-gold-300 uppercase">Human gate</p>}
                </motion.div>
              </li>
            );
          })}
        </ol>

        <div className="mt-20 grid gap-10 border-t border-line-dark pt-12 lg:grid-cols-12">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-white lg:col-span-4">Why oversight matters for enterprise development</h3>
          <Stagger className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {reasons.map((r) => (
              <StaggerItem key={r.title}>
                <p className="font-medium text-white">{r.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{r.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
