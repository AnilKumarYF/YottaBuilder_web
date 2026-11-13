"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { TextReveal, RevealOnScroll } from "@/components/ui/Reveal";
import type { TraceQuery } from "./EmbeddingScene";

const EmbeddingScene = dynamic(() => import("./EmbeddingScene"), { ssr: false, loading: () => <StaticSpace /> });

const INITIAL: TraceQuery = {
  id: "REQ-014",
  label: "Supervisor approval above $10k",
  matches: [
    { kind: "Epic", id: "EP-03" },
    { kind: "Story", id: "ST-07" },
    { kind: "Test", id: "TEST-21" },
    { kind: "Code", id: "approval.guard.ts" },
  ],
};

/** Lightweight SVG stand-in: loading state, reduced motion, or no WebGL. */
function StaticSpace() {
  const cx = 300;
  const cy = 300;
  const pts = Array.from({ length: 64 }, (_, i) => {
    const a = i * 2.39996;
    const r = 120 + ((i * 37) % 130);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.62, hit: i % 16 === 3 };
  });
  const q = { x: cx + 150, y: cy - 95 };
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="v3-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c3c9" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c3c9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="260" fill="url(#v3-glow)" />
      {[90, 180, 260].map((r) => (
        <ellipse key={r} cx={cx} cy={cy} rx={r} ry={r * 0.62} fill="none" stroke="#9aa1ac" strokeOpacity="0.12" />
      ))}
      <line x1={cx - 280} y1={cy} x2={cx + 280} y2={cy} stroke="#9aa1ac" strokeOpacity="0.18" />
      <line x1={cx} y1={cy - 280} x2={cx} y2={cy + 280} stroke="#9aa1ac" strokeOpacity="0.18" />
      {pts.map((p, i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={p.hit ? "#3dd68c" : "#9aa1ac"} strokeOpacity={p.hit ? 0.5 : 0.12} />
          <circle cx={p.x} cy={p.y} r={p.hit ? 4 : 2.2} fill={p.hit ? "#3dd68c" : i % 3 ? "#9aa1ac" : "#22c3c9"} fillOpacity={p.hit ? 1 : 0.7} />
        </g>
      ))}
      {pts
        .filter((p) => p.hit)
        .map((p, i) => (
          <path key={i} d={`M${q.x} ${q.y} Q ${(q.x + p.x) / 2 + 30} ${(q.y + p.y) / 2 - 60} ${p.x} ${p.y}`} fill="none" stroke="#3dd68c" strokeOpacity="0.7" />
        ))}
      <line x1={cx} y1={cy} x2={q.x} y2={q.y} stroke="#22c3c9" strokeWidth="3" />
      <circle cx={q.x} cy={q.y} r="34" fill="none" stroke="#7fe6e8" strokeOpacity="0.8" strokeDasharray="5 4" />
      <circle cx={q.x} cy={q.y} r="6" fill="#ffffff" />
      <circle cx={cx} cy={cy} r="5" fill="#ffffff" />
    </svg>
  );
}

const KIND_STYLE: Record<TraceQuery["matches"][number]["kind"], string> = {
  Epic: "text-electric-300",
  Story: "text-electric-300",
  Test: "text-electric-300",
  Code: "text-electric-300",
};

function TraceHUD({ q }: { q: TraceQuery }) {
  return (
    <div className="glass-dark w-full rounded-md p-4 font-mono text-[0.72rem] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] sm:w-[21rem] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="tracking-[0.12em] text-steel uppercase">Requirement → context trace</p>
        <span className="flex items-center gap-1.5 text-[0.62rem] tracking-wider text-teal uppercase">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-teal" />
          Live
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mt-4 flex items-baseline gap-2">
            <span className="rounded-xs border border-electric/40 bg-electric/10 px-1.5 py-0.5 text-electric-300">{q.id}</span>
            <span className="truncate font-sans text-[0.82rem] text-white">{q.label}</span>
          </p>
          <ul className="mt-4 space-y-2">
            {q.matches.map((m, i) => (
              <motion.li
                key={m.kind}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.12, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <span aria-hidden className="h-px w-4 bg-teal/60" />
                <span className={`w-11 text-[0.62rem] tracking-wider uppercase ${KIND_STYLE[m.kind]}`}>{m.kind}</span>
                <span className="truncate text-white/90">{m.id}</span>
                <span className="ml-auto text-[0.62rem] tracking-wider text-teal uppercase">traced</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 border-t border-line-dark pt-3 text-[0.62rem] text-steel/70">Illustrative visualisation · sample identifiers</p>
    </div>
  );
}

export function HeroV3() {
  const [mode, setMode] = useState<"pending" | "webgl" | "static">("pending");
  const [query, setQuery] = useState<TraceQuery>(INITIAL);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 2;
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      gl = false;
    }
    setMode(!reduce && !weak && gl ? "webgl" : "static");
  }, []);

  return (
    <section aria-labelledby="hero-v3-title" className="relative isolate overflow-hidden bg-abyss pt-[var(--nav-h)] lg:min-h-[100svh]">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-iso-grid opacity-50 [mask-image:radial-gradient(70%_60%_at_60%_45%,#000,transparent)]" />
        <div className="absolute top-[18%] right-[8%] h-[34rem] w-[34rem] rounded-full bg-electric/[0.10] blur-[140px]" />
        <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-brand/50 blur-[120px]" />
      </div>

      <p className="sr-only">
        Animated visualisation: requirements are embedded as vectors in a semantic space, and the nearest epics, stories, tests and code files are traced back to each requirement.
      </p>

      <div className="relative z-10 container-x flex flex-col pt-12 pb-6 sm:pt-16 lg:min-h-[calc(100svh-var(--nav-h))] lg:justify-center lg:pt-0 lg:pb-24">
        <div className="max-w-[38rem]">
          <RevealOnScroll y={10}>
            <p className="eyebrow flex items-center gap-3 text-steel">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
              </span>
              AI-powered SDLC platform · by YottaFlex.ai
            </p>
          </RevealOnScroll>
          <TextReveal
            id="hero-v3-title"
            as="h1"
            immediate
            delay={0.1}
            text="From Client Requirements to Production App."
            accent="Production App."
            className="mt-6 font-display text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance text-white"
          />
          <RevealOnScroll delay={0.35}>
            <p className="lede mt-7 max-w-xl text-pretty text-steel">
              <span className="text-white">AI-powered. Human-led. Production-ready.</span> Transform meeting notes, RFPs and requirements into deployable, traceable
              software with YottaBuilder.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.5}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button earlyAccess magnetic size="lg">
                Get Early Access
              </Button>
              <Button href="/platform" variant="secondary" size="lg">
                Explore the Platform
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* visual: below copy on mobile, bleeding right on desktop */}
      <div aria-hidden className="relative h-[420px] w-full sm:h-[500px] lg:absolute lg:top-[var(--nav-h)] lg:right-[-3vw] lg:bottom-0 lg:h-auto lg:w-[64%]">
        {mode === "webgl" ? (
          <EmbeddingScene className="absolute inset-0" onQuery={setQuery} tipLabel={tipRef} />
        ) : mode === "static" ? (
          <div className="absolute inset-0 grid place-items-center p-6">
            <StaticSpace />
          </div>
        ) : null}

        {/* query tip label, positioned by the scene */}
        {mode === "webgl" && (
          <div ref={tipRef} className="pointer-events-none absolute top-0 left-0 opacity-0 will-change-transform">
            <span className="absolute bottom-3 left-3 rounded-xs border border-electric/40 bg-abyss/80 px-2 py-1 font-mono text-[0.68rem] whitespace-nowrap text-electric-300 backdrop-blur-sm">
              {query.id} · embedded
            </span>
          </div>
        )}

        {/* left fade keeps copy legible where the scene bleeds under it */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-abyss to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-abyss to-transparent" />

        <div className="absolute right-4 bottom-4 left-4 sm:right-8 sm:bottom-10 sm:left-auto lg:right-[calc(3vw+2.5rem)]">
          <TraceHUD q={query} />
        </div>
      </div>
    </section>
  );
}
