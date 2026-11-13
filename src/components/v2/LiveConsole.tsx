"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Scripted, looping illustration of the YottaBuilder pipeline running on a sample project.
 * Everything here is sample data — it is labelled as such in the UI.
 */

const LOOP = 17000;
const TICK = 50;

const RFP =
  "The claims portal must let adjusters upload documents, track claim status in real time and require supervisor approval for any payout above $10k.";

// Phrases extracted as requirements, with the char index at which each is "found".
const REQS = [
  { id: "REQ-012", phrase: "upload documents", at: 62 },
  { id: "REQ-013", phrase: "track claim status in real time", at: 95 },
  { id: "REQ-014", phrase: "require supervisor approval for any payout above $10k", at: RFP.length },
];

const STAGES = [
  { key: "context", label: "Context", at: 4200 },
  { key: "epics", label: "Epics", at: 5000, count: 3, countEnd: 5800 },
  { key: "stories", label: "Stories", at: 5800, count: 9, countEnd: 6800 },
  { key: "gate", label: "Human gate · Stories", at: 6800, approvedAt: 8800, gate: true },
  { key: "tests", label: "Tests", at: 8800, count: 21, countEnd: 9800 },
  { key: "tasks", label: "Tasks", at: 9800, count: 14, countEnd: 10600 },
  { key: "code", label: "Code", at: 10600 },
] as const;

const FILES = [
  { path: "src/components/ClaimUpload.tsx", at: 10900 },
  { path: "src/services/claims.ts", at: 11300, active: true },
  { path: "tests/integration/claims.spec.ts", at: 11700 },
  { path: "infra/terraform/main.tf", at: 12100 },
];

type Tok = { t: string; c?: string };
const CODE: Tok[][] = [
  [{ t: "// REQ-014 → ST-07 → TEST-21", c: "text-steel/70" }],
  [{ t: "export async function ", c: "text-electric-300" }, { t: "approvePayout", c: "text-white" }, { t: "(claim: Claim) {" }],
  [{ t: "  if ", c: "text-electric-300" }, { t: "(claim.amount > " }, { t: "10_000", c: "text-gold-300" }, { t: ") {" }],
  [{ t: "    await ", c: "text-electric-300" }, { t: "gates.require(" }, { t: '"supervisor"', c: "text-teal-300" }, { t: ", claim.id);" }],
  [{ t: "  }" }],
  [{ t: "  return ", c: "text-electric-300" }, { t: "claims.release(claim);" }],
  [{ t: "}" }],
];
const CODE_LEN = CODE.reduce((n, line) => n + line.reduce((m, tok) => m + tok.t.length, 0) + 1, 0);
const CODE_START = 11300;
const CODE_END = 14200;
const SHIP_AT = 14600;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export function LiveConsole() {
  const reduce = useReducedMotion();
  const [t, setT] = useState(LOOP);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setDocVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Start from zero the first time it scrolls into view (SSR + reduced motion show the finished state).
  useEffect(() => {
    if (reduce || started.current || !visible) return;
    started.current = true;
    setT(0);
  }, [visible, reduce]);

  const running = !reduce && playing && visible && docVisible && started.current;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setT((v) => (v + TICK >= LOOP ? 0 : v + TICK)), TICK);
    return () => window.clearInterval(id);
  }, [running]);

  const now = reduce ? LOOP : t;

  // ---- derived state ----
  const typed = Math.round(RFP.length * prog(now, 300, 3900));
  const reqsFound = REQS.filter((r) => typed >= r.at);
  const codeChars = Math.round(CODE_LEN * prog(now, CODE_START, CODE_END));
  const shipped = now >= SHIP_AT;
  const total = prog(now, 0, SHIP_AT);

  return (
    <div ref={root} className="relative">
      <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-midnight text-white shadow-[0_50px_120px_-40px_rgb(10_11_13/0.65),0_0_0_1px_rgb(0_0_0/0.4)]">
        {/* window chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-graphite/70 px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </span>
            <p className="truncate font-mono text-[0.7rem] text-steel">
              yottabuilder <span className="text-white/30">/</span> claims-portal <span className="text-white/30">(sample)</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-xs border border-white/10 px-2 py-0.5 font-mono text-[0.62rem] tracking-wider text-steel uppercase sm:inline-flex">
              <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", running ? "bg-electric animate-pulse-soft" : "bg-white/30")} />
              Live demo · sample project
            </span>
            {!reduce && (
              <>
                <button
                  type="button"
                  aria-pressed={!playing}
                  aria-label={playing ? "Pause demo" : "Play demo"}
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-7 w-7 place-items-center rounded-xs text-steel transition-colors hover:bg-white/10 hover:text-white"
                >
                  {playing ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <rect x="3.5" y="3" width="3" height="10" rx="0.5" />
                      <rect x="9.5" y="3" width="3" height="10" rx="0.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M4.5 3v10l8-5z" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Replay demo"
                  onClick={() => {
                    started.current = true;
                    setT(0);
                    setPlaying(true);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-xs text-steel transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M3 8a5 5 0 1 0 1.5-3.5M3 2.5v2.8h2.8" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <p className="sr-only">
          Illustrative demo with sample data: a requirements document is parsed into requirements, the pipeline generates context, epics, stories, tests,
          tasks and code with a human approval gate after stories, and the repository is shipped.
        </p>

        <div aria-hidden className="grid divide-y divide-white/[0.07] lg:grid-cols-[1.05fr_0.9fr_1.15fr] lg:divide-x lg:divide-y-0">
          {/* Requirements */}
          <Pane n="01" title="Requirements" meta="project-rfp-v3.pdf">
            <p className="min-h-[5.5rem] font-mono text-[0.76rem] leading-[1.7] text-white/80 lg:min-h-[7.5rem]">
              <Highlighted text={RFP.slice(0, typed)} found={reqsFound.map((r) => r.phrase)} />
              {typed < RFP.length && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-electric animate-pulse-soft" />}
            </p>
            <ul className="mt-4 space-y-1.5">
              {REQS.map((r) => {
                const on = reqsFound.includes(r);
                return (
                  <li
                    key={r.id}
                    className={cn(
                      "flex items-center gap-2 rounded-xs border px-2 py-1 font-mono text-[0.66rem] transition-all duration-500",
                      on ? "translate-y-0 border-electric/30 bg-electric/[0.08] opacity-100" : "translate-y-1 border-white/5 opacity-0",
                    )}
                  >
                    <span className="text-electric-300">{r.id}</span>
                    <span className="truncate text-white/60">{r.phrase}</span>
                  </li>
                );
              })}
            </ul>
          </Pane>

          {/* Pipeline */}
          <Pane n="02" title="Pipeline" meta="model-agnostic">
            <ol className="space-y-1.5">
              {STAGES.map((s) => {
                const started = now >= s.at;
                const isGate = "gate" in s && s.gate;
                const approved = isGate && now >= (s as { approvedAt: number }).approvedAt;
                const done = isGate ? approved : started && now >= s.at + 500;
                const active = started && !done;
                const count = "count" in s ? Math.round(s.count * prog(now, s.at, s.countEnd)) : null;
                return (
                  <li
                    key={s.key}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xs border px-2.5 py-1.5 text-[0.76rem] transition-colors duration-500",
                      isGate
                        ? started
                          ? approved
                            ? "border-teal/30 bg-teal/[0.07]"
                            : "border-gold/50 bg-gold/[0.09]"
                          : "border-white/5"
                        : active
                          ? "border-electric/50 bg-electric/[0.1]"
                          : done
                            ? "border-white/10 bg-white/[0.03]"
                            : "border-white/5",
                    )}
                  >
                    <StageDot isGate={Boolean(isGate)} started={started} done={Boolean(done)} approved={Boolean(approved)} />
                    <span className={cn("flex-1 truncate", started ? "text-white" : "text-white/35", isGate && started && !approved && "text-gold-300")}>
                      {s.label}
                    </span>
                    {isGate && started && (
                      <span className="flex items-center gap-1.5">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 font-mono text-[0.55rem] text-white">JR</span>
                        <span className={cn("font-mono text-[0.6rem] tracking-wider uppercase", approved ? "text-teal-300" : "text-gold-300")}>
                          {approved ? "Approved" : "Reviewing"}
                        </span>
                      </span>
                    )}
                    {count !== null && started && <span className="font-mono text-[0.68rem] tabular-nums text-steel">{count}</span>}
                  </li>
                );
              })}
            </ol>
          </Pane>

          {/* Repository */}
          <Pane n="03" title="Repository" meta="github · main">
            <ul className="space-y-1">
              {FILES.map((f) => {
                const on = now >= f.at;
                return (
                  <li
                    key={f.path}
                    className={cn(
                      "flex items-center gap-2 font-mono text-[0.68rem] transition-all duration-500",
                      on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                      f.active ? "text-electric-300" : "text-white/65",
                    )}
                  >
                    <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M4 1.5h5l3 3v10H4z" />
                    </svg>
                    <span className="truncate">{f.path}</span>
                  </li>
                );
              })}
            </ul>
            <pre className="mt-3 min-h-[9.5rem] overflow-hidden rounded-xs border border-white/[0.06] bg-abyss/70 p-3 font-mono text-[0.68rem] leading-[1.65] text-white/80">
              <StreamedCode chars={codeChars} />
            </pre>
            <div
              className={cn(
                "mt-3 flex items-center gap-2 rounded-xs border px-2.5 py-1.5 font-mono text-[0.68rem] transition-all duration-500",
                shipped ? "border-teal/35 bg-teal/[0.08] opacity-100" : "border-white/5 opacity-40",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", shipped ? "bg-teal" : "bg-white/30")} />
              <span className="text-teal-300">a3f8c21</span>
              <span className="truncate text-white/75">feat: initial deploy</span>
              <span className={cn("ml-auto tracking-wider uppercase", shipped ? "text-teal-300" : "text-white/30")}>{shipped ? "Shipped" : "Pending"}</span>
            </div>
          </Pane>
        </div>

        {/* progress */}
        <div aria-hidden className="relative h-[3px] bg-white/[0.06]">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-electric transition-transform duration-100 ease-linear" style={{ transform: `scaleX(${total})` }} />
        </div>
      </div>
      <p className="mt-3 text-center text-[0.75rem] text-slate-ink">Illustrative demo with sample data — not customer results.</p>
    </div>
  );
}

function Pane({ n, title, meta, children }: { n: string; title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 p-4 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[0.64rem] tracking-[0.14em] text-steel uppercase">
          <span className="text-white/35">{n}</span>
          {title}
        </p>
        <p className="truncate font-mono text-[0.62rem] text-white/30">{meta}</p>
      </div>
      {children}
    </div>
  );
}

function StageDot({ isGate, started, done, approved }: { isGate: boolean; started: boolean; done: boolean; approved: boolean }) {
  if (isGate)
    return (
      <span
        className={cn(
          "h-2 w-2 shrink-0 rotate-45 transition-colors duration-500",
          approved ? "bg-teal" : started ? "bg-gold" : "border border-white/25",
        )}
      />
    );
  return (
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full transition-colors duration-500",
        done ? "bg-electric" : started ? "bg-electric animate-pulse-soft" : "border border-white/25",
      )}
    />
  );
}

function Highlighted({ text, found }: { text: string; found: string[] }) {
  if (!found.length) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    let best: { i: number; p: string } | null = null;
    for (const p of found) {
      const i = rest.indexOf(p);
      if (i >= 0 && (!best || i < best.i)) best = { i, p };
    }
    if (!best) {
      parts.push(rest);
      break;
    }
    parts.push(rest.slice(0, best.i));
    parts.push(
      <mark key={key++} className="rounded-[2px] bg-electric/20 px-0.5 text-electric-300">
        {best.p}
      </mark>,
    );
    rest = rest.slice(best.i + best.p.length);
  }
  return <>{parts}</>;
}

function StreamedCode({ chars }: { chars: number }) {
  let left = chars;
  return (
    <>
      {CODE.map((line, li) => {
        if (left <= 0) return null;
        const out = line.map((tok, ti) => {
          if (left <= 0) return null;
          const s = tok.t.slice(0, left);
          left -= s.length;
          return (
            <span key={ti} className={tok.c}>
              {s}
            </span>
          );
        });
        left -= 1;
        return (
          <span key={li} className="block whitespace-pre">
            {out}
          </span>
        );
      })}
    </>
  );
}
