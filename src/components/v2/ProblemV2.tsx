"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { comparison } from "@/content/product";

/** Design B: editorial, scroll-led contrast of SDLC without vs with YottaBuilder. */
export function ProblemV2() {
  const list = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section aria-labelledby="problem-v2-title" className="relative bg-white section-y">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeading
            id="problem-v2-title"
            tone="light"
            index="01"
            eyebrow="The problem"
            title="AI tools generate snippets. We generate systems."
            accent="We generate systems."
            description="Most teams bolt AI onto broken workflows. YottaBuilder is the intelligent pipeline that makes the entire SDLC actually work."
          />
          <RevealOnScroll delay={0.2} className="mt-8 hidden gap-6 text-[0.8rem] text-slate-ink lg:flex">
            <span className="flex items-center gap-2">
              <Cross /> Without YottaBuilder
            </span>
            <span className="flex items-center gap-2">
              <Check /> With YottaBuilder
            </span>
          </RevealOnScroll>
        </div>

        <div className="relative lg:col-span-7">
          <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line-light">
            <motion.div style={reduce ? undefined : { scaleY: fill }} className="absolute inset-0 origin-top bg-electric" />
          </div>
          <ol ref={list} className="space-y-0">
            {comparison.map((row, i) => (
              <RevealOnScroll as="li" key={row.topic} y={28} amount={0.4} className="relative border-b border-line-light py-9 pl-8 last:border-b-0 sm:pl-10">
                <span aria-hidden className="absolute top-[2.65rem] -left-[3.5px] h-2 w-2 rotate-45 border border-electric bg-white" />
                <p className="font-mono text-[0.7rem] tracking-[0.14em] text-slate-ink uppercase">
                  <span className="text-ink/35">0{i + 1}</span> &nbsp;{row.topic}
                </p>
                <div className="mt-4 flex items-start gap-3 text-[0.9rem] text-slate-ink/80">
                  <Cross className="mt-[0.3em]" />
                  <p>
                    <span className="sr-only">Without YottaBuilder: </span>
                    <span className="line-through decoration-slate-ink/30">{row.without.title}.</span> {row.without.body}
                  </p>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <Check className="mt-[0.45em]" />
                  <div>
                    <h3 className="font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-tight font-semibold tracking-[-0.03em] text-ink">
                      <span className="sr-only">With YottaBuilder: </span>
                      {row.with.title}
                    </h3>
                    <p className="mt-2 max-w-xl leading-relaxed text-slate-ink">{row.with.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={"grid h-4 w-4 shrink-0 place-items-center rounded-full bg-electric/15 text-electric-700 " + className}>
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />
      </svg>
    </span>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={"grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-slate-ink/70 " + className}>
      <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3l6 6M9 3l-6 6" />
      </svg>
    </span>
  );
}
