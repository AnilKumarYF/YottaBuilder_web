"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, Stagger, StaggerItem, EASE } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { comparison } from "@/content/product";
import { stats } from "@/content/site";
import { cn } from "@/lib/cn";

const WITHOUT = [
  "Scattered requirements",
  "Disconnected AI tools",
  "Model dependency",
  "Manual handoffs",
  "No complete traceability",
  "Isolated code snippets",
  "No human approval checkpoints",
] as const;

const WITH = [
  "Structured requirements",
  "Unified AI pipeline",
  "Model-agnostic architecture",
  "Automated workflows",
  "End-to-end traceability",
  "Complete repository generation",
  "Human approval at critical gates",
] as const;

// Deterministic "disorder" for the without-panel nodes.
const SCATTER = [
  { y: -18, r: -3 },
  { y: 22, r: 2.5 },
  { y: -6, r: -1.5 },
  { y: 30, r: 3.5 },
  { y: -24, r: -2 },
  { y: 12, r: 2 },
  { y: -10, r: -3.5 },
];
const GATES = new Set([2, 5]); // gold gate markers after these columns

/* ---------- Glyphs ---------- */

const Cross = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={cn("h-3.5 w-3.5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);
const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={cn("h-3.5 w-3.5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M3 8.5l3.2 3.2L13 5" />
  </svg>
);

/* ---------- Panels (shared node layout so both sides line up column-for-column) ---------- */

const nodeVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.07 } }),
};

function WithoutPanel() {
  return (
    <div className="relative h-full bg-[#ededea] px-6 pt-16 pb-10 xl:px-10">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(67_67_67/0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
      <p className="eyebrow absolute top-6 left-6 flex items-center gap-2 text-charcoal xl:left-10">
        <Cross className="text-[#b45b5b]" /> Without YottaBuilder
      </p>
      <ol className="relative grid grid-cols-7 gap-3">
        {WITHOUT.map((t, i) => (
          <motion.li
            key={t}
            custom={i}
            variants={nodeVariants}
            className="relative flex h-[150px] items-center"
          >
            <div className="w-full rounded-sm border border-dashed border-charcoal/30 bg-white/70 p-3.5 grayscale" style={{ transform: `translateY(${SCATTER[i].y}px) rotate(${SCATTER[i].r}deg)` }}>
              <span className="font-mono text-[10px] text-charcoal/50">0{i + 1}</span>
              <p className="mt-1.5 text-[13px] leading-snug font-medium text-charcoal">{t}</p>
            </div>
            {i < WITHOUT.length - 1 && (
              <svg aria-hidden viewBox="0 0 24 8" className="absolute top-1/2 -right-3 h-2 w-3 text-charcoal/30" fill="none" stroke="currentColor" strokeDasharray="2 3">
                <path d="M0 4h10M16 4h8" />
              </svg>
            )}
          </motion.li>
        ))}
      </ol>
      <p className="relative mt-8 max-w-md text-sm text-slate-ink">Fragmented tools, manual stitching and no checkpoint between a prompt and production.</p>
    </div>
  );
}

function WithPanel() {
  return (
    <div className="relative h-full bg-midnight px-6 pt-16 pb-10 xl:px-10">
      <div aria-hidden className="absolute inset-0 bg-iso-grid opacity-80" />
      <div aria-hidden className="absolute -top-20 right-10 h-60 w-80 rounded-full bg-electric/25 blur-3xl" />
      <p className="eyebrow absolute top-6 right-6 flex items-center gap-2 text-white xl:right-10">
        <Check className="text-teal" /> With YottaBuilder
      </p>
      <ol className="relative grid grid-cols-7 gap-3">
        <span aria-hidden className="absolute top-1/2 right-6 left-6 h-px -translate-y-1/2 bg-gradient-to-r from-electric/30 via-electric to-teal/70" />
        {WITH.map((t, i) => (
          <motion.li key={t} custom={i} variants={nodeVariants} className="relative flex h-[150px] items-center">
            <div className="relative w-full rounded-sm border border-electric/40 bg-abyss/80 p-3.5 shadow-[0_10px_30px_-12px_rgb(34_195_201/0.6)]">
              <span className={cn("font-mono text-[10px]", i === WITH.length - 1 ? "text-gold-300" : "text-electric-300")}>0{i + 1}</span>
              <p className="mt-1.5 text-[13px] leading-snug font-medium text-white">{t}</p>
            </div>
            {GATES.has(i) && (
              <span aria-hidden className="absolute top-1/2 -right-[11px] z-10 grid h-4 w-4 -translate-y-1/2 rotate-45 place-items-center border border-gold bg-midnight">
                <span className="h-1.5 w-1.5 bg-gold" />
              </span>
            )}
          </motion.li>
        ))}
      </ol>
      <p className="relative mt-8 ml-auto max-w-md text-right text-sm text-steel">
        One structured pipeline with <span className="text-gold-300">human approval gates</span> between critical stages.
      </p>
    </div>
  );
}

/* ---------- Desktop: draggable before/after slider ---------- */

function CompareSlider() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const inView = useInView(box, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const hinted = useRef(false);

  useEffect(() => {
    if (!inView || reduce || hinted.current) return;
    hinted.current = true;
    const c = animate(88, 50, { duration: 1.6, ease: EASE, delay: 0.5, onUpdate: (v) => !dragging.current && setPos(v) });
    return () => c.stop();
  }, [inView, reduce]);

  const fromClient = useCallback((x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromClient(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging.current && fromClient(e.clientX);
  const onUp = () => (dragging.current = false);
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="relative">
      <div
        ref={box}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative grid cursor-ew-resize touch-pan-y overflow-hidden rounded-md border border-line-light shadow-[0_40px_80px_-40px_rgb(18_20_23/0.45)] select-none"
      >
        <div className="[grid-area:1/1]">
          <WithPanel />
        </div>
        <div className="[grid-area:1/1]" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <WithoutPanel />
        </div>

        {/* Handle */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgb(11_59_63/0.25),0_0_24px_rgb(34_195_201/0.8)]" style={{ left: `${pos}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare without and with YottaBuilder"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(100 - pos)}% showing With YottaBuilder`}
          onKeyDown={onKey}
          className="absolute top-1/2 z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-brand text-white shadow-[0_8px_30px_rgb(11_59_63/0.55)] transition-transform hover:scale-105"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[11px] tracking-[0.14em] text-slate-ink/70 uppercase">Drag or use arrow keys to compare</p>
    </motion.div>
  );
}

/* ---------- Mobile: segmented toggle ---------- */

function CompareToggle() {
  const [mode, setMode] = useState<"without" | "with">("with");
  const items = mode === "with" ? WITH : WITHOUT;
  const dark = mode === "with";
  return (
    <div>
      <div role="group" aria-label="Compare" className="grid grid-cols-2 rounded-sm border border-line-light bg-white p-1">
        {(["without", "with"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn("relative h-11 rounded-xs text-sm font-semibold transition-colors", mode === m ? "text-white" : "text-slate-ink")}
          >
            {mode === m && <motion.span layoutId="cmp-toggle" className={cn("absolute inset-0 rounded-xs", m === "with" ? "bg-brand" : "bg-charcoal")} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{m === "with" ? "With YottaBuilder" : "Without"}</span>
          </button>
        ))}
      </div>
      <div className={cn("relative mt-4 overflow-hidden rounded-md border p-5 transition-colors duration-500", dark ? "border-electric/30 bg-midnight" : "border-line-light bg-[#ededea]")}>
        {dark && <div aria-hidden className="absolute inset-0 bg-iso-grid opacity-70" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={mode}
            initial={{ opacity: 0, x: dark ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dark ? -24 : 24 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative space-y-2.5"
            aria-live="polite"
          >
            {items.map((t, i) => (
              <li
                key={t}
                className={cn(
                  "flex items-center gap-3 rounded-sm border px-3.5 py-3 text-[0.92rem] font-medium",
                  dark ? "border-electric/30 bg-abyss/70 text-white" : "border-dashed border-charcoal/30 bg-white/70 text-charcoal",
                )}
                style={dark ? undefined : { transform: `translateX(${(SCATTER[i].r * 2).toFixed(0)}px)` }}
              >
                <span className={cn("font-mono text-[10px]", dark ? "text-electric-300" : "text-charcoal/50")}>0{i + 1}</span>
                <span className="flex-1">{t}</span>
                {dark ? <Check className={GATES.has(i) || i === items.length - 1 ? "text-gold" : "text-teal"} /> : <Cross className="text-[#b45b5b]" />}
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Detail rows ---------- */

function DetailAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-line-light rounded-md border border-line-light bg-white md:hidden">
      {comparison.map((row, i) => {
        const isOpen = open === i;
        const id = `cmp-row-${i}`;
        return (
          <li key={row.topic}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span>
                  <span className="eyebrow block text-brand">{row.topic}</span>
                  <span className="mt-1 block font-display font-bold text-ink">{row.with.title}</span>
                </span>
                <span aria-hidden className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xs border border-line-light text-brand transition-transform duration-500", isOpen && "rotate-45")}>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 px-5 pb-5">
                    <div className="flex gap-3 text-sm">
                      <Cross className="mt-0.5 text-[#b45b5b]" />
                      <p className="text-slate-ink">
                        <span className="font-semibold text-charcoal">{row.without.title}.</span> {row.without.body}
                      </p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <Check className="mt-0.5 text-teal" />
                      <p className="text-slate-ink">
                        <span className="font-semibold text-ink">{row.with.title}.</span> {row.with.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function DetailGrid() {
  return (
    <div className="hidden overflow-hidden rounded-md border border-line-light bg-white md:block">
      <div className="grid grid-cols-[minmax(140px,0.6fr)_1fr_1fr] border-b border-line-light bg-ice/70 px-8 py-4">
        <span className="eyebrow text-slate-ink">Dimension</span>
        <span className="eyebrow flex items-center gap-2 text-charcoal">
          <Cross className="text-[#b45b5b]" /> Without YottaBuilder
        </span>
        <span className="eyebrow flex items-center gap-2 text-brand">
          <Check className="text-teal" /> With YottaBuilder
        </span>
      </div>
      <Stagger as="ol">
        {comparison.map((row) => (
          <StaggerItem
            as="li"
            key={row.topic}
            className="group grid grid-cols-[minmax(140px,0.6fr)_1fr_1fr] gap-8 border-b border-line-light px-8 py-6 transition-colors duration-300 last:border-b-0 hover:bg-ice/60"
          >
            <h3 className="font-mono text-[12px] tracking-[0.12em] text-brand uppercase">{row.topic}</h3>
            <div>
              <p className="font-semibold text-charcoal/80">{row.without.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ink/80">{row.without.body}</p>
            </div>
            <div className="relative">
              <span aria-hidden className="absolute top-0 -left-4 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-electric to-teal transition-transform duration-500 group-hover:scale-y-100" />
              <p className="font-semibold text-ink">{row.with.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ink">{row.with.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

/* ---------- Stats ---------- */

function StatsBand() {
  return (
    <Stagger className="grid grid-cols-2 border-y border-line-light lg:grid-cols-4">
      {stats.map((s, i) => (
        <StaggerItem key={s.label} className={cn("px-2 py-8 sm:px-6 lg:py-10", i % 2 === 1 && "border-l border-line-light", i >= 2 && "border-t border-line-light lg:border-t-0", i === 2 && "lg:border-l")}>
          <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-bold tracking-[-0.04em] text-brand">
            <AnimatedCounter value={s.value} suffix={s.suffix} />
          </p>
          <p className="mt-3 max-w-[16rem] text-sm text-slate-ink">{s.label}</p>
        </StaggerItem>
      ))}
      <StaggerItem className="border-t border-l border-line-light px-2 py-8 sm:px-6 lg:border-t-0 lg:py-10">
        <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-bold tracking-[-0.04em] text-electric-700">Any</p>
        <p className="mt-3 text-sm text-slate-ink">Model · Cloud · Stack</p>
      </StaggerItem>
    </Stagger>
  );
}

/* ---------- Section ---------- */

export function ProblemComparison() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative overflow-hidden bg-ice section-y">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-iso-grid-light [mask-image:linear-gradient(180deg,#000,transparent)]" />
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="problem-title"
            index="01"
            eyebrow="The problem"
            title="AI tools generate snippets. We generate systems."
            accent="We generate systems."
            tone="light"
            description="Most teams bolt AI onto broken workflows. YottaBuilder is the intelligent pipeline that makes the entire SDLC actually work."
            className="lg:col-span-8"
          />
          <RevealOnScroll delay={0.2} className="lg:col-span-4">
            <p className="border-l-2 border-electric pl-4 text-sm leading-relaxed text-slate-ink">
              The traditional SDLC was built for a world without AI. The AI Development Lifecycle embeds AI at every phase, with humans providing oversight, quality gates and the judgment machines can’t.
            </p>
          </RevealOnScroll>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="hidden lg:block">
            <CompareSlider />
          </div>
          <div className="lg:hidden">
            <CompareToggle />
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <RevealOnScroll>
            <h3 className="eyebrow mb-6 text-brand">From SDLC to AI-DLC — side by side</h3>
          </RevealOnScroll>
          <DetailGrid />
          <DetailAccordion />
        </div>

        <div className="mt-16 lg:mt-24">
          <StatsBand />
        </div>
      </div>
    </section>
  );
}
