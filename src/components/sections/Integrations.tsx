"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { integrationGroups, integrationCards, toolchain, type IntegrationGroup } from "@/content/product";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

/* ---------- Geometry (SVG viewBox 1000 x 640) ---------- */
const W = 1000;
const H = 640;
const HUB = { x: 500, y: 320 };
const toRad = (d: number) => (d * Math.PI) / 180;

/** Category accent — blue for AI, teal for deploy targets, steel for dev tooling, gold for human-facing comms. */
const ACCENT: Record<string, string> = {
  models: "#22c3c9",
  cloud: "#3dd68c",
  dev: "#7fe6e8",
  pm: "#7fe6e8",
  comms: "#f5c982",
  cicd: "#3dd68c",
};

type Layout = {
  group: IntegrationGroup;
  cx: number;
  cy: number;
  items: { name: string; x: number; y: number }[];
};

const layout: Layout[] = integrationGroups.map((group, i) => {
  const a = -90 + i * 60;
  const cx = HUB.x + 265 * Math.cos(toRad(a));
  const cy = HUB.y + 175 * Math.sin(toRad(a));
  const n = group.items.length;
  const step = 14;
  const items = group.items.map((name, j) => {
    const ia = a + (j - (n - 1) / 2) * step;
    return { name, x: HUB.x + 425 * Math.cos(toRad(ia)), y: HUB.y + 272 * Math.sin(toRad(ia)) };
  });
  return { group, cx, cy, items };
});

const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

/* Gentle curve between two points (bows away from the hub). */
function curve(x1: number, y1: number, x2: number, y2: number, bow = 0.12) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx - dy * bow).toFixed(1)} ${(my + dx * bow).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function NetworkDiagram({ active, setActive }: { active: string | null; setActive: (k: string | null) => void }) {
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  const dim = (k: string) => active !== null && active !== k;

  return (
    <div className="relative mx-auto aspect-[1000/640] w-full max-w-[1100px]" onPointerLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`${gid}-hub`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c3c9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#22c3c9" stopOpacity="0" />
          </radialGradient>
          <filter id={`${gid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbits */}
        <ellipse cx={HUB.x} cy={HUB.y} rx={265} ry={175} fill="none" stroke="rgb(154 161 172 / 0.10)" strokeDasharray="2 6" />
        <ellipse cx={HUB.x} cy={HUB.y} rx={425} ry={272} fill="none" stroke="rgb(154 161 172 / 0.06)" strokeDasharray="2 8" />
        <circle cx={HUB.x} cy={HUB.y} r={150} fill={`url(#${gid}-hub)`} />

        {layout.map(({ group, cx, cy, items }, gi) => {
          const color = ACCENT[group.key];
          const on = active === group.key;
          const spoke = curve(HUB.x, HUB.y, cx, cy, 0.08);
          return (
            <g key={group.key} style={{ opacity: dim(group.key) ? 0.18 : 1, transition: "opacity 400ms" }}>
              <motion.path
                d={spoke}
                fill="none"
                stroke={color}
                strokeOpacity={on ? 0.9 : 0.45}
                strokeWidth={on ? 1.6 : 1.1}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, delay: 0.1 + gi * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* traveling pulse */}
              <path d={spoke} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="2 22" className="animate-dash" filter={`url(#${gid}-glow)`} opacity={on ? 1 : 0.7} />
              {items.map((it, ii) => {
                const d = curve(cx, cy, it.x, it.y, 0.1);
                return (
                  <g key={it.name}>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeOpacity={on ? 0.75 : 0.28}
                      strokeWidth={on ? 1.3 : 1}
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.9, delay: 0.6 + gi * 0.08 + ii * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    />
                    {on && <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 18" className="animate-dash" />}
                  </g>
                );
              })}
              <circle cx={cx} cy={cy} r={on ? 7 : 5} fill="#0a0b0d" stroke={color} strokeWidth={1.5} style={{ transition: "r 300ms" }} />
            </g>
          );
        })}
      </svg>

      {/* Hub */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(HUB.x, HUB.y)}>
        <div className="border-orbit relative flex flex-col items-center gap-2 rounded-md bg-abyss/90 px-5 py-4 shadow-[0_0_60px_-10px_rgb(34_195_201/0.7)]">
          <Image src="/brand/yottabuilder-logo.png" alt="YottaBuilder" width={727} height={114} className="h-5 w-auto" />
          <span className="font-mono text-[0.62rem] tracking-[0.14em] text-steel uppercase">by YottaFlex.ai</span>
        </div>
      </div>

      {/* Category buttons + item chips */}
      {layout.map(({ group, cx, cy, items }) => {
        const color = ACCENT[group.key];
        const on = active === group.key;
        return (
          <div key={group.key} className="contents">
            <button
              type="button"
              aria-pressed={on}
              onPointerEnter={() => setActive(group.key)}
              onFocus={() => setActive(group.key)}
              onClick={() => setActive(on ? null : group.key)}
              className={cn(
                "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-sm border px-3 py-1.5 font-mono text-[0.68rem] font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-[opacity,background-color,border-color,color] duration-300",
                on ? "bg-white/10 text-white" : "bg-abyss/90 text-steel hover:text-white",
                dim(group.key) && "opacity-40",
              )}
              style={{ ...pct(cx, cy + (cy < HUB.y ? -22 : 22)), borderColor: on ? color : "rgb(154 161 172 / 0.22)" }}
            >
              {group.label}
            </button>
            {items.map((it) => (
              <span
                key={it.name}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-xs border bg-midnight/95 px-2.5 py-1 text-[0.78rem] font-medium whitespace-nowrap text-white transition-[opacity,border-color,box-shadow] duration-300",
                  dim(group.key) ? "opacity-25" : "opacity-100",
                )}
                style={{
                  ...pct(it.x, it.y),
                  borderColor: on ? color : "rgb(154 161 172 / 0.16)",
                  boxShadow: on ? `0 0 24px -6px ${color}` : "none",
                }}
              >
                {it.name}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function MobileList() {
  const [open, setOpen] = useState<string | null>(integrationGroups[0].key);
  return (
    <ul className="divide-y divide-line-dark border-y border-line-dark">
      {integrationGroups.map((g) => {
        const on = open === g.key;
        const panelId = `int-panel-${g.key}`;
        return (
          <li key={g.key}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={panelId}
              onClick={() => setOpen(on ? null : g.key)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: ACCENT[g.key] }} />
                <span className="font-display text-lg font-bold text-white">{g.label}</span>
                <span className="font-mono text-xs text-steel">{g.items.length}</span>
              </span>
              <svg viewBox="0 0 16 16" className={cn("h-4 w-4 text-steel transition-transform duration-300", on && "rotate-45")} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M8 2v12M2 8h12" />
              </svg>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((it) => (
                        <li key={it} className="rounded-xs border border-line-dark bg-white/[0.03] px-3 py-1.5 text-sm text-white">
                          {it}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm leading-relaxed text-steel">{g.note}</p>
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

const cardIcons: Record<string, React.ReactNode> = {
  "GitHub / GitLab": <path d="M6 3v12a3 3 0 003 3h3M6 3a2 2 0 100 .01M18 6a2 2 0 100 .01M18 8v2a4 4 0 01-4 4h-2m0 0l2-2m-2 2l2 2" />,
  "CI/CD Pipelines": <path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 3v4h-4M6 21v-4h4" />,
  "Jira / Linear": <path d="M4 5h16M4 12h10M4 19h6M17 15l2 2 3-4" />,
  "AWS / Azure / GCP": <path d="M7 18a4 4 0 01-.6-7.95A6 6 0 0118 9a4.5 4.5 0 01-.5 9H7zM12 11v5m-2-2l2 2 2-2" />,
  Slack: <path d="M5 6h14v9H9l-4 4V6zM9 10h6M9 13h3" />,
  "More coming": <path d="M12 5v14M5 12h14M4 4h4M16 20h4" />,
};

export function IntegrationCards() {
  return (
    <Stagger className="grid gap-px overflow-hidden rounded-md border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
      {integrationCards.map((c, i) => (
        <StaggerItem key={c.title} className="bg-midnight">
          <TiltCard max={4} className="p-7 transition-[background-color,box-shadow] duration-500 hover:bg-[#10282b] hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] sm:p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-sm border border-line-dark bg-abyss text-electric-300 transition-colors duration-500 group-hover:border-electric/50 group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {cardIcons[c.title]}
                  </svg>
                </span>
                <span className="font-mono text-xs text-steel/60">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-white">{c.title}</h3>
              <p className="mt-2.5 text-[0.93rem] leading-relaxed text-steel">{c.body}</p>
            </div>
          </TiltCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function IntegrationsNetwork({ index = "06", showCards = true }: { index?: string; showCards?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const current = integrationGroups.find((g) => g.key === active) ?? null;
  const title = "Works with the tools your team already uses.";

  return (
    <section aria-labelledby="integrations-heading" className="relative overflow-hidden bg-gradient-to-b from-midnight to-abyss text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 left-1/2 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />

      <div className="container-x section-y relative">
        <SectionHeading
          id="integrations-heading"
          index={index}
          eyebrow="Integrations"
          title={title}
          accent="your team already uses."
          description="Model-agnostic. Cloud-agnostic. Stack-agnostic. Bring your own everything — YottaBuilder orchestrates it all."
        />

        {/* Desktop network */}
        <RevealOnScroll className="mt-16 hidden lg:block" amount={0.15}>
          <NetworkDiagram active={active} setActive={setActive} />
          <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-5">
            <div role="group" aria-label="Highlight an integration category" className="flex flex-wrap justify-center gap-2">
              {integrationGroups.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={active === g.key}
                  onClick={() => setActive(active === g.key ? null : g.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors duration-300",
                    active === g.key ? "border-white/40 bg-white/10 text-white" : "border-line-dark text-steel hover:text-white",
                  )}
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT[g.key] }} />
                  {g.label}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="glass-dark min-h-[4.5rem] w-full max-w-2xl rounded-md px-6 py-4 text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={current?.key ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="text-[0.95rem] leading-relaxed text-steel">
                  {current ? (
                    <>
                      <span className="font-semibold text-white">{current.label}:</span> {current.note}
                    </>
                  ) : (
                    "Hover or select a category to trace how it connects to the YottaBuilder pipeline."
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </RevealOnScroll>

        {/* Mobile / tablet list */}
        <div className="mt-12 lg:hidden">
          <MobileList />
        </div>

        {showCards && (
          <>
            <div className="mt-24">
              <IntegrationCards />
            </div>
            <RevealOnScroll className="mt-10">
              <div className="flex flex-col gap-4 rounded-md border border-line-dark bg-abyss/60 p-6 md:flex-row md:items-center md:gap-8">
                <p className="eyebrow shrink-0 text-electric-300">Your toolchain</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8rem] text-steel">
                  {toolchain.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </>
        )}

        <p className="mt-8 text-xs text-steel/60">Names refer to supported models, platforms and tools. No partnership or endorsement implied.</p>
      </div>
    </section>
  );
}
