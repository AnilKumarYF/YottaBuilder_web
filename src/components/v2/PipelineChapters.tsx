"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { inputDocs, pipelineSteps, repoTree } from "@/content/product";
import { cn } from "@/lib/cn";

const GATES_AFTER = new Set(["Context", "Stories", "Tasks"]);

const chapters = [
  {
    n: "01",
    label: "Input",
    title: "Upload",
    body: "Drop in meeting notes, RFPs, or architecture specs. Any format, any size — YottaBuilder unifies it into one structured project context.",
    dark: false,
  },
  {
    n: "02",
    label: "Build",
    title: "Build",
    body: "AI generates epics, stories, tests and code — each level inheriting full context. Humans approve at every gate.",
    dark: true,
  },
  {
    n: "03",
    label: "Production",
    title: "Ship",
    body: "Full repository pushed to GitHub. Deploy to AWS, Azure, or GCP through your existing CI/CD — no rewiring required.",
    dark: false,
  },
] as const;

function UploadVisual() {
  return (
    <div className="relative">
      <ul className="space-y-2.5">
        {inputDocs.map((d, i) => (
          <motion.li
            key={d.name}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-sm border border-line-light bg-white px-3.5 py-2.5 shadow-[0_1px_0_rgb(13_15_18/0.03)]"
            style={{ marginLeft: `${(i % 3) * 14}px` }}
          >
            <span className="grid h-8 w-10 shrink-0 place-items-center rounded-xs bg-ice font-mono text-[0.62rem] tracking-wider text-slate-ink uppercase">{d.ext}</span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[0.8rem] text-ink">{d.name}</span>
              <span className="block text-xs text-slate-ink">{d.kind}</span>
            </span>
          </motion.li>
        ))}
      </ul>
      <div aria-hidden className="mx-auto my-3 h-6 w-px bg-gradient-to-b from-line-light to-electric" />
      <div className="rounded-sm border border-electric/40 bg-ice px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[0.72rem]">
          <span className="text-electric-700">Project context</span>
          <span className="text-slate-ink">unified</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line-light">
          <motion.div
            className="h-full origin-left bg-electric"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function BuildVisual() {
  return (
    <ol className="relative">
      {pipelineSteps.map((s, i) => (
        <li key={s}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
            className="flex items-center justify-between rounded-sm border border-line-dark bg-white/[0.03] px-3.5 py-2"
          >
            <span className="flex items-center gap-3">
              <span className="font-mono text-[0.65rem] text-steel/70">0{i + 1}</span>
              <span className="text-[0.9rem] font-medium text-white">{s}</span>
            </span>
            <span className={cn("font-mono text-[0.62rem] tracking-wider uppercase", s === "Code" ? "text-teal-300" : "text-electric-300")}>
              {s === "Code" ? "generated" : "AI"}
            </span>
          </motion.div>
          {i < pipelineSteps.length - 1 && (
            <div className="relative ml-6 flex h-5 items-center">
              <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-electric/40" />
              {GATES_AFTER.has(s) && (
                <span className="ml-[-4.5px] flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-2.5 rotate-45 border border-gold bg-gold/30" />
                  <span className="font-mono text-[0.58rem] tracking-[0.14em] text-gold-300 uppercase">Human gate</span>
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function ShipVisual() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-sm border border-line-light bg-white">
        <div className="flex items-center justify-between border-b border-line-light bg-ice px-3.5 py-2 font-mono text-[0.72rem]">
          <span className="text-ink">github.com / your-org / app</span>
          <span className="rounded-xs border border-line-light bg-white px-1.5 text-slate-ink">main</span>
        </div>
        <ul className="divide-y divide-line-light">
          {repoTree.map((r, i) => (
            <motion.li
              key={r.path}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center justify-between px-3.5 py-2"
            >
              <span className="flex items-center gap-2.5 font-mono text-[0.78rem] text-ink">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-electric-700" fill="currentColor" aria-hidden>
                  <path d="M1.5 3.5A1 1 0 012.5 2.5h3.6l1.4 1.5h6a1 1 0 011 1v7.5a1 1 0 01-1 1h-11a1 1 0 01-1-1z" />
                </svg>
                {r.path}
              </span>
              <span className="text-xs text-slate-ink">{r.note}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2.5 rounded-sm border border-line-light bg-white px-3.5 py-2 font-mono text-[0.75rem]">
        <span className="rounded-xs bg-ink px-1.5 py-0.5 text-white">a3f8c21</span>
        <span className="text-ink">feat: initial deploy</span>
      </div>
      <div className="flex items-center justify-between rounded-sm border border-teal/40 bg-teal/[0.08] px-3.5 py-2.5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="relative grid h-3 w-3 place-items-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-teal/50 motion-reduce:hidden" />
            <span className="h-2 w-2 rounded-full bg-teal" />
          </span>
          <span className="text-sm font-medium text-ink">Cloud deployment</span>
          <span className="hidden font-mono text-[0.7rem] text-slate-ink sm:inline">AWS · Azure · GCP via your CI/CD</span>
        </span>
        <span className="font-mono text-[0.65rem] tracking-wider text-[#1c7a4c] uppercase">Shipped</span>
      </div>
    </div>
  );
}

function Chapter({ index, total, children }: { index: number; total: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const last = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, last || reduce ? 1 : 0.94]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, last || reduce ? 0 : 0.35]);
  return (
    <div ref={ref} className="md:sticky md:h-[calc(100svh-var(--nav-h)-48px)] md:min-h-[34rem]" style={{ top: `calc(var(--nav-h) + 24px + ${index * 16}px)` }}>
      <motion.div style={{ scale }} className="relative h-full origin-top">
        {children}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-lg bg-ink" />
      </motion.div>
    </div>
  );
}

export function PipelineChapters() {
  const visuals = [<UploadVisual key="u" />, <BuildVisual key="b" />, <ShipVisual key="s" />];
  return (
    <section id="how" aria-labelledby="v2-how-title" className="relative bg-ice section-y">
      <div className="container-x">
        <SectionHeading
          id="v2-how-title"
          tone="light"
          index="02"
          eyebrow="How it works"
          title="Requirements in. Production app out."
          accent="Production app out."
          description="One pipeline. Three stages. Every line of code traces back to the requirement that created it."
        />
        <div className="mt-14 space-y-6 md:space-y-[12vh]">
          {chapters.map((c, i) => (
            <Chapter key={c.n} index={i} total={chapters.length}>
              <article
                aria-labelledby={`v2-chapter-${c.n}`}
                className={cn(
                  "grid h-full gap-10 overflow-hidden rounded-lg border p-6 sm:p-10 md:grid-cols-2 md:items-center lg:gap-16 lg:p-14",
                  c.dark ? "border-line-dark bg-midnight text-white shadow-[0_40px_80px_-40px_rgb(10_11_13/0.6)]" : "border-line-light bg-white shadow-[0_30px_60px_-40px_rgb(13_15_18/0.25)]",
                )}
              >
                <div>
                  <p className={cn("font-mono text-sm", c.dark ? "text-electric-300" : "text-electric-700")}>
                    {c.n} <span className={c.dark ? "text-steel/60" : "text-slate-ink/60"}>/ {c.label}</span>
                  </p>
                  <h3 id={`v2-chapter-${c.n}`} className={cn("display-lg mt-5", c.dark ? "text-white" : "text-ink")}>
                    {c.title}
                  </h3>
                  <p className={cn("lede mt-5 max-w-md", c.dark ? "text-steel" : "text-slate-ink")}>{c.body}</p>
                  <div aria-hidden className="mt-10 hidden gap-1.5 md:flex">
                    {chapters.map((_, k) => (
                      <span key={k} className={cn("h-1 w-8 rounded-full", k === i ? "bg-electric" : c.dark ? "bg-white/10" : "bg-line-light")} />
                    ))}
                  </div>
                </div>
                <div className={cn("rounded-md p-4 sm:p-6", c.dark ? "bg-abyss/60 ring-1 ring-line-dark" : "bg-ice ring-1 ring-line-light")}>{visuals[i]}</div>
              </article>
            </Chapter>
          ))}
        </div>
      </div>
    </section>
  );
}
