"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { integrationGroups } from "@/content/product";
import { cn } from "@/lib/cn";
import { useLazyCanvas } from "./GateSection";
import type { OrbitRingMeta } from "./OrbitScene";

const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });

const note = (k: string) => integrationGroups.find((g) => g.key === k)?.note ?? "";
const items = (...keys: string[]) => keys.flatMap((k) => integrationGroups.find((g) => g.key === k)?.items ?? []);

const RINGS: (OrbitRingMeta & { note: string })[] = [
  { key: "models", label: "AI Models", items: items("models"), color: "#22c3c9", note: note("models") },
  { key: "cloud", label: "Cloud", items: items("cloud"), color: "#7fe6e8", note: note("cloud") },
  { key: "delivery", label: "Delivery", items: items("dev", "pm", "comms"), color: "#d2d5da", note: `${note("dev")} ${note("pm")} ${note("comms")}` },
  { key: "cicd", label: "CI/CD", items: items("cicd"), color: "#3dd68c", note: note("cicd") },
];

function OrbitFallback() {
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" aria-hidden>
      {RINGS.map((r, i) => (
        <ellipse key={r.key} cx="300" cy="200" rx={90 + i * 48} ry={30 + i * 20} fill="none" stroke={r.color} strokeOpacity="0.35" transform={`rotate(${-12 + i * 9} 300 200)`} />
      ))}
      <polygon points="300,150 343,175 343,225 300,250 257,225 257,175" fill="#0e7f84" stroke="#7fe6e8" />
    </svg>
  );
}

export function OrbitEcosystem({ index = "05" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);
  const labels = useRef<Record<string, HTMLElement | null>>({});
  const { mount, fallback, mobile } = useLazyCanvas(ref);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>("models");
  const current = RINGS.find((r) => r.key === active);

  return (
    <section ref={ref} aria-labelledby="v3-int-title" className="relative overflow-hidden bg-abyss section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 mask-fade-b" />
      <div className="container-x relative">
        <SectionHeading
          id="v3-int-title"
          index={index}
          eyebrow="Integrations"
          title="Works with the tools your team already uses."
          accent="your team already uses."
          description="Model-agnostic. Cloud-agnostic. Stack-agnostic. Bring your own everything — YottaBuilder orchestrates it all."
        />
      </div>

      <div className="relative mx-auto mt-8 h-[340px] w-full max-w-[1400px] sm:h-[420px] lg:mt-4 lg:h-[600px]">
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[100px]" />
        {mount ? (
          <OrbitScene className="absolute inset-0" active={active} labels={labels} showLabels={!mobile} rings={RINGS} mobile={mobile} />
        ) : fallback ? (
          <OrbitFallback />
        ) : null}

        {/* Projected node labels (desktop). Positioned imperatively by the scene each frame. */}
        {mount && !mobile && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {RINGS.flatMap((r) =>
              r.items.map((name) => (
                <span
                  key={`${r.key}:${name}`}
                  ref={(el) => {
                    labels.current[`${r.key}:${name}`] = el;
                  }}
                  style={{ opacity: 0, color: r.color }}
                  className="absolute top-0 left-0 rounded-xs border border-white/10 bg-abyss/75 px-2 py-0.5 font-mono text-[0.68rem] whitespace-nowrap backdrop-blur-sm transition-opacity duration-300 will-change-transform"
                >
                  {name}
                </span>
              )),
            )}
          </div>
        )}

        {/* Core label */}
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 translate-y-[78px] flex-col items-center gap-1 lg:flex">
          <Image src="/brand/yottabuilder-logo.png" alt="" width={727} height={114} className="h-4 w-auto opacity-90" />
          <span className="font-mono text-[0.6rem] tracking-[0.18em] text-steel/70 uppercase">by YottaFlex.ai</span>
        </div>
        <p className="sr-only">
          Animation: the YottaBuilder core with four orbiting rings of supported tools — AI models, cloud platforms, delivery tools and CI/CD.
        </p>
      </div>

      <div className="container-x relative">
        {/* Desktop legend + detail */}
        <div className="hidden lg:block">
          <div role="group" aria-label="Highlight an integration ring" className="flex flex-wrap justify-center gap-2" onMouseLeave={() => setActive(null)}>
            {RINGS.map((r) => {
              const on = active === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(r.key)}
                  onFocus={() => setActive(r.key)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(on ? null : r.key)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2.5 rounded-full border px-4 text-sm transition-colors",
                    on ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 text-steel hover:text-white",
                  )}
                >
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                  {r.label}
                  <span className="font-mono text-xs text-steel/70">{r.items.length}</span>
                </button>
              );
            })}
          </div>
          <div aria-live="polite" className="mx-auto mt-5 min-h-[3.5rem] max-w-2xl text-center text-[0.95rem] leading-relaxed text-steel">
            <AnimatePresence mode="wait">
              <motion.p key={active ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                {current ? (
                  <>
                    <span className="font-semibold text-white">{current.label}: </span>
                    {current.items.join(", ")}. {current.note}
                  </>
                ) : (
                  "Hover or focus a ring to see how it plugs into the YottaBuilder pipeline."
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile list */}
        <ul className="divide-y divide-line-dark overflow-hidden rounded-md border border-line-dark lg:hidden">
          {RINGS.map((r) => {
            const expanded = open === r.key;
            return (
              <li key={r.key}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`v3-ring-${r.key}`}
                  onClick={() => setOpen(expanded ? null : r.key)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left text-white"
                >
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />
                  <span className="flex-1 font-medium">{r.label}</span>
                  <span className="font-mono text-xs text-steel/70">{r.items.length}</span>
                  <span aria-hidden className={cn("text-steel transition-transform duration-300", expanded && "rotate-45")}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`v3-ring-${r.key}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5">
                        <ul className="flex flex-wrap gap-2">
                          {r.items.map((it) => (
                            <li key={it} className="rounded-xs border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/85">
                              {it}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm leading-relaxed text-steel">{r.note}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <RevealOnScroll>
          <p className="mt-10 text-center text-xs text-steel/60">Names refer to supported models, platforms and tools. No partnership or endorsement implied.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
