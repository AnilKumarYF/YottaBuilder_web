"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { shiftStages } from "@/content/product";
import { cn } from "@/lib/cn";

const LAST = shiftStages.length - 1;
const YB = shiftStages[LAST];

export function ShiftTimeline({ index = "05" }: { index?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 80%", "end 50%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const fill = useTransform(smooth, (v) => (reduce ? 1 : v));

  const sel = selected !== null ? shiftStages[selected] : null;

  return (
    <section aria-labelledby="shift-title" className="relative overflow-x-clip bg-white section-y">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-iso-grid-light opacity-60 mask-fade-b" />
      <div className="container-x relative">
        <SectionHeading
          id="shift-title"
          tone="light"
          index={index}
          eyebrow="The shift"
          title="Move beyond disconnected AI tools."
          accent="disconnected AI tools."
          description="Most teams aren’t choosing between “AI” and “no AI”. They’re stuck in the middle — using AI tools that don’t talk to each other, with no pipeline holding it together. Where does your team sit on this spectrum?"
        />

        <p className="mt-10 font-mono text-[0.72rem] tracking-[0.14em] text-slate-ink uppercase" id="shift-hint">
          You are here? <span className="normal-case tracking-normal text-slate-ink/80">— select the stage closest to your team.</span>
        </p>

        <div ref={track} className="relative mt-6">
          {/* ---------- Desktop: maturity staircase ---------- */}
          <div className="hidden lg:block">
            <ol className="grid grid-cols-6 items-end gap-3" aria-describedby="shift-hint">
              {shiftStages.map((s, i) => {
                const yb = i === LAST;
                const on = selected === i;
                const height = 7 + s.level * 2.6; // rem
                return (
                  <li key={s.title} className="flex flex-col">
                    <RevealOnScroll delay={i * 0.07} y={16}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelected(on ? null : i)}
                        className={cn(
                          "group relative flex w-full flex-col rounded-t-md border p-4 text-left transition-[border-color,box-shadow,background-color] duration-300",
                          yb
                            ? "border-brand bg-brand text-white shadow-[0_30px_60px_-24px_rgb(11_59_63/0.7)]"
                            : on
                              ? "border-electric bg-electric/[0.06] shadow-[0_20px_40px_-24px_rgb(34_195_201/0.6)]"
                              : "border-line-light bg-ice hover:border-brand/40",
                        )}
                        style={{ minHeight: `${height}rem` }}
                      >
                        <span className={cn("font-mono text-[0.65rem] tracking-wider", yb ? "text-gold-300" : "text-brand/70")}>0{i + 1}</span>
                        <span className={cn("mt-2 font-display text-[0.98rem] leading-snug font-bold tracking-[-0.01em]", yb ? "text-white" : "text-ink")}>{s.title}</span>
                        <span className={cn("mt-auto pt-3 text-[0.78rem] leading-snug", yb ? "text-white/80" : "text-slate-ink")}>{s.body}</span>
                        {yb && (
                          <span aria-hidden className="absolute -top-2 right-4 h-4 w-4 rotate-45 border border-gold bg-gold shadow-[0_0_18px_rgb(232_163_61/0.7)]" />
                        )}
                        {on && !yb && <span aria-hidden className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 bg-electric" />}
                      </button>
                    </RevealOnScroll>
                  </li>
                );
              })}
            </ol>
            {/* Baseline progress */}
            <div aria-hidden className="relative h-[3px] bg-line-light">
              <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-gradient-to-r from-steel via-electric to-brand" />
            </div>
            <div aria-hidden className="mt-3 flex justify-between font-mono text-[0.62rem] tracking-[0.14em] text-slate-ink/70 uppercase">
              <span>Manual · disconnected</span>
              <span>Unified · AI + human · traceable</span>
            </div>
          </div>

          {/* ---------- Mobile / tablet: vertical spine ---------- */}
          <div className="relative lg:hidden">
            <div aria-hidden className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-line-light">
              <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gradient-to-b from-steel via-electric to-brand" />
            </div>
            <ol className="space-y-3" aria-describedby="shift-hint">
              {shiftStages.map((s, i) => {
                const yb = i === LAST;
                const on = selected === i;
                return (
                  <li key={s.title} className="relative pl-10">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-5 left-[6px] h-3 w-3 rotate-45 border",
                        yb ? "border-gold bg-gold shadow-[0_0_14px_rgb(232_163_61/0.6)]" : on ? "border-electric bg-electric" : "border-steel bg-white",
                      )}
                    />
                    <RevealOnScroll delay={0.04 * i} y={14}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelected(on ? null : i)}
                        className={cn(
                          "w-full rounded-md border p-4 text-left transition-colors duration-300",
                          yb ? "border-brand bg-brand text-white" : on ? "border-electric bg-electric/[0.06]" : "border-line-light bg-ice",
                        )}
                      >
                        <span className={cn("font-mono text-[0.65rem] tracking-wider", yb ? "text-gold-300" : "text-brand/70")}>0{i + 1}</span>
                        <span className={cn("mt-1 block font-display text-[1.05rem] font-bold", yb ? "text-white" : "text-ink")}>{s.title}</span>
                        <span className={cn("mt-1 block text-[0.85rem]", yb ? "text-white/80" : "text-slate-ink")}>{s.body}</span>
                      </button>
                    </RevealOnScroll>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Contrast readout */}
        <div className="mt-10 min-h-[6.5rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {sel && selected !== LAST ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid overflow-hidden rounded-md border border-line-light sm:grid-cols-2"
              >
                <div className="bg-ice p-5">
                  <p className="font-mono text-[0.65rem] tracking-[0.14em] text-slate-ink uppercase">Your team today</p>
                  <p className="mt-2 font-display font-bold text-ink">{sel.title}</p>
                  <p className="mt-1 text-[0.9rem] text-slate-ink">{sel.body}</p>
                </div>
                <div className="relative bg-midnight p-5">
                  <span aria-hidden className="absolute top-5 right-5 h-2.5 w-2.5 rotate-45 bg-gold" />
                  <p className="font-mono text-[0.65rem] tracking-[0.14em] text-gold-300 uppercase">With YottaBuilder</p>
                  <p className="mt-2 font-display font-bold text-white">{YB.title}</p>
                  <p className="mt-1 text-[0.9rem] text-steel">{YB.body}</p>
                </div>
              </motion.div>
            ) : selected === LAST ? (
              <motion.p key="yb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-md border border-brand/30 bg-brand/[0.05] p-5 text-[0.95rem] text-ink">
                <span className="font-display font-bold">Unified pipeline, AI + human, full traceability.</span>{" "}
                <span className="text-slate-ink">That’s the destination YottaBuilder is built for.</span>
              </motion.p>
            ) : (
              <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-1 text-[0.9rem] text-slate-ink">
                Tap a stage above to compare it with YottaBuilder’s unified pipeline.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
