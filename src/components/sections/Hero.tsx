"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/Button";
import { TextReveal, EASE } from "@/components/ui/Reveal";
import { pipelineSteps } from "@/content/product";
import { cn } from "@/lib/cn";

/* ---------- Static isometric fallback (SSR, reduced motion, weak devices) ---------- */

function StaticCube({ className }: { className?: string }) {
  // Isometric cube centred at (200,200), half-size 150.
  const C = { x: 200, y: 200 };
  const ax = { x: 130, y: 75 }; // right-down
  const bx = { x: -130, y: 75 }; // left-down
  const up = { x: 0, y: -150 };
  const p = (o: { x: number; y: number }, a: { x: number; y: number }, u: number, b: { x: number; y: number }, v: number) =>
    `${(o.x + a.x * u + b.x * v).toFixed(1)},${(o.y + a.y * u + b.y * v).toFixed(1)}`;
  const top = { o: { x: C.x, y: C.y - 150 }, a: ax, b: bx };
  const left = { o: { x: C.x - 130, y: C.y - 75 }, a: { x: 130, y: 75 }, b: { x: -up.x, y: -up.y } };
  const right = { o: { x: C.x, y: C.y }, a: { x: 130, y: -75 }, b: { x: -up.x, y: -up.y } };
  const lines: { d: string; c: string }[] = [];
  const face = (f: typeof top, pattern: [number, number, number, "u" | "v"][], accent?: Record<number, string>) =>
    pattern.forEach(([at, from, to, dir], i) => {
      const a = dir === "u" ? p(f.o, f.a, from, f.b, at) : p(f.o, f.a, at, f.b, from);
      const b = dir === "u" ? p(f.o, f.a, to, f.b, at) : p(f.o, f.a, at, f.b, to);
      lines.push({ d: `M${a} L${b}`, c: accent?.[i] ?? (i % 3 === 0 ? "#22c3c9" : "#179aa0") });
    });
  face(top, [[0.25, 0.1, 0.75, "u"], [0.5, 0.25, 0.9, "u"], [0.75, 0.1, 0.5, "u"], [0.25, 0.5, 0.9, "v"], [0.6, 0.1, 0.4, "v"]], { 1: "#e8a33d" });
  face(left, [[0.25, 0.1, 0.6, "u"], [0.5, 0.4, 0.9, "u"], [0.75, 0.1, 0.75, "u"], [0.35, 0.3, 0.9, "v"]], { 2: "#3dd68c" });
  face(right, [[0.25, 0.3, 0.9, "u"], [0.5, 0.1, 0.6, "u"], [0.75, 0.4, 0.9, "u"], [0.65, 0.1, 0.55, "v"]], { 0: "#e8a33d" });

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id="cube-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c3c9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#22c3c9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="120" fill="url(#cube-core)" />
      <path d="M200,50 L330,125 L330,275 L200,350 L70,275 L70,125 Z M200,200 L200,350 M200,200 L330,125 M200,200 L70,125" fill="none" stroke="#9aa1ac" strokeOpacity="0.35" strokeWidth="1.2" />
      {lines.map((l, i) => (
        <path key={i} d={l.d} stroke={l.c} strokeWidth="7" strokeLinecap="square" />
      ))}
      <rect x="187" y="187" width="26" height="26" transform="rotate(45 200 200)" fill="#22c3c9" opacity="0.9" />
    </svg>
  );
}

const HeroScene = dynamic(() => import("@/components/visuals/HeroScene"), {
  ssr: false,
  loading: () => <StaticCube className="absolute inset-0 m-auto h-[78%] w-[78%] opacity-80" />,
});

function SceneSlot() {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak = (navigator.hardwareConcurrency ?? 4) <= 2;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setMode(reduce || weak || !webgl ? "static" : "3d");
  }, []);
  if (mode === "3d") return <HeroScene className="absolute inset-0" />;
  return <StaticCube className="absolute inset-0 m-auto h-[78%] w-[78%] opacity-80" />;
}

/* ---------- Floating illustrative cards ---------- */

function Floating({ children, className, y, delay = 0, amp = 8, dur = 6 }: { children: ReactNode; className?: string; y?: MotionValue<number>; delay?: number; amp?: number; dur?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div style={reduce ? undefined : { y }} className={cn("absolute", className)}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 + delay }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -amp, 0] }}
          transition={reduce ? undefined : { duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const card = "rounded-md border border-white/10 bg-midnight/75 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.8)] backdrop-blur-md";

function DocCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(card, compact ? "w-[176px] p-3" : "w-[232px] p-4")}>
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-xs bg-[#c94a4a]/20 font-mono text-[9px] font-medium text-[#ff9b9b] uppercase">pdf</span>
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] text-white">project-rfp-v3.pdf</p>
          <p className="font-mono text-[9px] tracking-wider text-steel/70 uppercase">Requirements input</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5" aria-hidden>
        <span className="block h-1.5 w-full rounded-full bg-white/10" />
        <span className="block h-1.5 w-[86%] rounded-full bg-white/10" />
        {!compact && <span className="block h-1.5 w-[64%] rounded-full bg-white/10" />}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-xs border border-electric/40 bg-electric/15 px-1.5 py-0.5 font-mono text-[10px] text-electric-300">REQ-014</span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-steel/80">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-electric-300" />
          parsing
        </span>
      </div>
    </div>
  );
}

function CodeCard() {
  const k = "text-[#c792ea]";
  const f = "text-[#7fe6e8]";
  const s = "text-teal-300";
  const c = "text-steel/55";
  return (
    <div className={cn(card, "w-[300px] overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2">
        <span className="font-mono text-[10px] text-steel">src/services/approvals.ts</span>
        <span className="flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </span>
      </div>
      <pre className="px-3.5 py-3 font-mono text-[10.5px] leading-[1.7] text-white/85">
        <code>
          <span className={c}>{"// REQ-014 → STORY-31 → TEST-88"}</span>
          {"\n"}
          <span className={k}>export async function</span> <span className={f}>approve</span>(id: <span className={s}>string</span>) {"{"}
          {"\n"}
          {"  "}
          <span className={k}>const</span> doc = <span className={k}>await</span> repo.<span className={f}>get</span>(id);
          {"\n"}
          {"  "}
          <span className={k}>return</span> gate.<span className={f}>review</span>(doc);
          {"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}

function GateCard() {
  return (
    <div className={cn(card, "w-[226px] border-gold/35 p-4")}>
      <div className="flex items-center gap-2">
        <span className="relative grid h-5 w-5 place-items-center">
          <span className="absolute h-3 w-3 rotate-45 border border-gold" />
          <span className="h-1.5 w-1.5 animate-pulse-soft rotate-45 bg-gold" />
        </span>
        <p className="font-mono text-[10px] tracking-[0.14em] text-gold-300 uppercase">Approval gate</p>
      </div>
      <p className="mt-2.5 text-[13px] leading-snug font-medium text-white">Stories ready · awaiting reviewer</p>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        <span className="rounded-xs bg-gold/90 px-2 py-1 text-[10px] font-semibold text-abyss">Approve</span>
        <span className="rounded-xs border border-white/15 px-2 py-1 text-[10px] text-steel">Request changes</span>
      </div>
    </div>
  );
}

function CommitChip() {
  return (
    <div className={cn(card, "flex items-center gap-2.5 border-teal/30 px-3 py-2")}>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-teal" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M2 12h6.5M15.5 12H22" />
      </svg>
      <span className="font-mono text-[11px] text-teal-300">a3f8c21</span>
      <span className="font-mono text-[11px] text-white/85">feat: initial deploy</span>
    </div>
  );
}

/* ---------- Pipeline strip ---------- */

function PipelineStrip() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const last = pipelineSteps.length - 1;

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setActive((v) => (v + 1) % pipelineSteps.length), 1100);
    return () => clearInterval(id);
  }, [reduce, inView]);

  return (
    <ol ref={ref} aria-label="The YottaBuilder pipeline" className="flex flex-wrap items-center gap-x-1 gap-y-2 font-mono text-[10.5px] tracking-[0.14em] uppercase sm:text-[11px]">
      {pipelineSteps.map((s, k) => {
        const on = !reduce && k === active;
        return (
          <li key={s} className="flex items-center gap-1">
            <span
              className={cn(
                "relative isolate rounded-xs px-2 py-1 transition-colors duration-500",
                on ? (k === last ? "text-teal-300" : "text-white") : reduce || k < active ? "text-steel" : "text-steel/55",
              )}
            >
              {on && (
                <motion.span
                  layoutId="hero-pipe-hl"
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className={cn("absolute inset-0 -z-10 rounded-xs ring-1", k === last ? "bg-teal/15 ring-teal/50" : "bg-electric/20 ring-electric/50")}
                />
              )}
              {s}
            </span>
            {k < last && (
              <svg viewBox="0 0 16 8" className="h-2 w-3.5 text-steel/40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M0 4h14M11 1l3 3-3 3" />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Hero ---------- */

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yScene = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const copyO = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss pt-[var(--nav-h)] text-white">
      {/* Lighting + texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_35%,#121417_0%,#0a0b0d_62%)]" />
        <div className="absolute top-[8%] right-[-10%] h-[620px] w-[620px] rounded-full bg-electric/25 blur-[120px]" />
        <div className="absolute top-[40%] right-[18%] h-[260px] w-[260px] rounded-full bg-electric/[0.06] blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[520px] w-[520px] rounded-full bg-brand/35 blur-[120px]" />
        <div className="absolute inset-0 bg-iso-grid [mask-image:radial-gradient(70%_60%_at_65%_45%,#000_20%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-abyss" />
      </div>

      <div className="container-x relative grid flex-1 items-center gap-6 pt-10 pb-8 lg:grid-cols-12 lg:gap-8 lg:pt-6">
        {/* Copy */}
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyO }} className="relative z-10 lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="eyebrow flex items-center gap-3 text-steel"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            AI-powered SDLC platform · by YottaFlex.ai
          </motion.p>

          <TextReveal
            id="hero-title"
            as="h1"
            immediate
            delay={0.15}
            text="From Client Requirements to Production App."
            accent="Production App."
            className="mt-6 max-w-[15ch] font-display text-[clamp(2.55rem,4.5vw,4.4rem)] leading-[1.0] font-bold tracking-[-0.035em] text-balance text-white"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
            className="lede mt-7 max-w-xl text-pretty text-steel"
          >
            <span className="text-white">AI-powered. Human-led. Production-ready.</span> Transform meeting notes, RFPs and requirements into deployable, traceable software with YottaBuilder.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button earlyAccess magnetic size="lg">
              Get Early Access
            </Button>
            <Button href="/platform" variant="secondary" size="lg">
              Explore the Platform
            </Button>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <div className="relative h-[380px] sm:h-[460px] lg:col-span-5 lg:-mr-[2vw] lg:h-[min(640px,72svh)]" aria-hidden>
          <motion.div style={reduce ? undefined : { y: yScene }} className="absolute inset-0 lg:-inset-x-16 lg:-inset-y-10">
            <SceneSlot />
          </motion.div>

          {/* Mobile: two compact cards, kept at the edges */}
          <Floating className="top-1 left-0 lg:hidden" amp={5} delay={0.1}>
            <DocCard compact />
          </Floating>
          <Floating className="right-0 bottom-2 lg:hidden" amp={5} delay={0.4}>
            <CommitChip />
          </Floating>

          {/* Desktop: full narrative — doc in, gate, code, commit out */}
          <Floating className="top-[4%] left-[-2%] hidden lg:block" y={yA} delay={0}>
            <DocCard />
          </Floating>
          <Floating className="top-[12%] right-[-2%] hidden lg:block xl:right-[-6%]" y={yC} delay={0.25} dur={7}>
            <GateCard />
          </Floating>
          <Floating className="bottom-[14%] left-[-6%] hidden lg:block" y={yB} delay={0.45} dur={6.5}>
            <CodeCard />
          </Floating>
          <Floating className="right-[2%] bottom-[5%] hidden lg:block" y={yA} delay={0.65} dur={5.5}>
            <CommitChip />
          </Floating>
        </div>
        <p className="sr-only">Illustration: a requirements document flows through AI generation and a human approval gate into committed, production-ready code.</p>
      </div>

      {/* Pipeline + scroll cue */}
      <div className="container-x relative pb-8">
        <div className="flex items-end justify-between gap-6 border-t border-line-dark pt-5">
          <PipelineStrip />
          <div aria-hidden className="hidden shrink-0 items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-steel/70 uppercase md:flex">
            Scroll
            <span className="relative block h-9 w-px overflow-hidden bg-white/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold"
                animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
