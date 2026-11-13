"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, TextReveal } from "@/components/ui/Reveal";
import { inputDocs, pipelineSteps, repoTree } from "@/content/product";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/** Steps after which a human approval gate sits (index into pipelineSteps). */
const GATES_AFTER = new Set([1, 3, 5]); // Context→Epics, Stories→Tests, Tasks→Code

const STAGES = [
  {
    n: "01",
    kicker: "Input",
    title: "Upload",
    body: "Drop in meeting notes, RFPs, or architecture specs. Any format, any size — YottaBuilder unifies it into one structured project context.",
  },
  {
    n: "02",
    kicker: "Build",
    title: "YottaBuilder",
    body: "AI generates epics, stories, tests and code — each level inheriting full context. Humans approve at every gate.",
  },
  {
    n: "03",
    kicker: "Ship",
    title: "Production",
    body: "Full repository pushed to GitHub. Deploy to AWS, Azure, or GCP through your existing CI/CD — no rewiring required.",
  },
] as const;

const extColor: Record<string, string> = {
  pdf: "text-[#ff9b8a] border-[#ff9b8a]/30 bg-[#ff9b8a]/10",
  docx: "text-electric-300 border-electric-300/30 bg-electric/10",
  md: "text-teal-300 border-teal/30 bg-teal/10",
};

function StageHeader({ i }: { i: number }) {
  const s = STAGES[i];
  return (
    <header className="mb-5">
      <p className="eyebrow flex items-center gap-2 text-steel">
        <span className="text-gold-300">{s.n}</span>
        <span aria-hidden className="h-px w-5 bg-steel/40" />
        {s.kicker}
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-white">{s.title}</h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-steel">{s.body}</p>
    </header>
  );
}

function InputStage() {
  return (
    <div className="flex h-full flex-col">
      <StageHeader i={0} />
      <ul className="space-y-2.5" aria-label="Example input documents">
        {inputDocs.map((d) => (
          <li
            key={d.name}
            data-doc
            className="flex items-center gap-3 rounded-sm border border-line-dark bg-abyss/60 px-3 py-2.5 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)]"
          >
            <span className={cn("grid h-8 w-11 shrink-0 place-items-center rounded-xs border font-mono text-[0.65rem] uppercase", extColor[d.ext])}>{d.ext}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[0.78rem] text-white/90">{d.name}</span>
              <span className="block text-[0.72rem] text-steel/80">{d.kind}</span>
            </span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-electric-300" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-sm border border-electric/30 bg-electric/[0.07] p-3" data-intake>
        <div className="flex items-center justify-between font-mono text-[0.7rem] text-electric-300">
          <span>Structured project context</span>
          <span data-intake-label>unified</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div data-intake-bar className="h-full origin-left rounded-full bg-gradient-to-r from-electric to-electric-300" />
        </div>
      </div>
    </div>
  );
}

function BuildStage() {
  return (
    <div className="flex h-full flex-col">
      <StageHeader i={1} />
      <ol className="relative" aria-label="AI generation pipeline">
        {pipelineSteps.map((step, i) => (
          <li key={step} data-node className="relative">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-sm border border-line-dark bg-abyss/60 px-3 py-2">
              <span data-node-glow aria-hidden className="absolute inset-0 bg-gradient-to-r from-electric/25 to-transparent" />
              <span className="relative font-mono text-[0.68rem] text-steel/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative flex-1 text-[0.88rem] font-medium text-white">{step}</span>
              <span className="relative font-mono text-[0.62rem] tracking-wider text-electric-300 uppercase">{i === pipelineSteps.length - 1 ? "generated" : "ai"}</span>
              <span aria-hidden className="relative h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_var(--color-electric)]" />
            </div>
            {i < pipelineSteps.length - 1 && (
              <div className="relative ml-6 flex h-6 items-center" aria-hidden={!GATES_AFTER.has(i)}>
                <svg viewBox="0 0 2 24" preserveAspectRatio="none" className="h-full w-[2px] overflow-visible">
                  <line x1="1" y1="0" x2="1" y2="24" stroke="rgb(154 161 172 / 0.18)" strokeWidth="2" />
                  <line data-connector x1="1" y1="0" x2="1" y2="24" stroke="var(--color-electric)" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" />
                </svg>
                {GATES_AFTER.has(i) && (
                  <span data-gate className="ml-4 inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-wider text-gold-300 uppercase">
                    <span aria-hidden className="h-2.5 w-2.5 rotate-45 border border-gold bg-gold/30 shadow-[0_0_12px_rgb(232_163_61/0.6)]" />
                    Human gate
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ShipStage() {
  return (
    <div className="flex h-full flex-col">
      <StageHeader i={2} />
      <div className="overflow-hidden rounded-sm border border-line-dark bg-abyss/70">
        <div data-repo-row className="flex items-center gap-2.5 border-b border-line-dark px-3 py-2.5">
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-white" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="font-mono text-[0.75rem] text-white/90">github.com / your-org / app</span>
          <span className="ml-auto rounded-xs border border-line-dark px-1.5 py-0.5 font-mono text-[0.62rem] text-steel">main</span>
        </div>
        <ul className="px-3 py-2" aria-label="Generated repository structure">
          {repoTree.map((r) => (
            <li data-repo-row key={r.path} className="flex items-center gap-2.5 py-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-electric-300" fill="currentColor" aria-hidden>
                <path d="M1.5 3A1.5 1.5 0 013 1.5h3.2l1.6 1.6H13A1.5 1.5 0 0114.5 4.6v7.9A1.5 1.5 0 0113 14H3a1.5 1.5 0 01-1.5-1.5z" />
              </svg>
              <span className="font-mono text-[0.78rem] text-white/90">{r.path}</span>
              <span className="ml-auto text-[0.7rem] text-steel/70">{r.note}</span>
            </li>
          ))}
        </ul>
        <div data-repo-row className="flex items-center gap-2 border-t border-line-dark px-3 py-2.5 font-mono text-[0.72rem]">
          <span className="rounded-xs bg-teal/15 px-1.5 py-0.5 text-teal-300">a3f8c21</span>
          <span className="text-white/85">feat: initial deploy</span>
        </div>
      </div>
      <div data-deploy className="mt-4 flex items-center gap-3 rounded-sm border border-teal/30 bg-teal/[0.07] px-3 py-3">
        <span className="relative grid h-7 w-7 place-items-center rounded-full border border-teal/40">
          <span aria-hidden className="h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_var(--color-teal)] animate-pulse-soft" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.85rem] font-medium text-white">Cloud deployment</span>
          <span className="block font-mono text-[0.68rem] text-steel">AWS · Azure · GCP via your CI/CD</span>
        </span>
        <span className="font-mono text-[0.68rem] tracking-wider text-teal-300 uppercase">Shipped</span>
      </div>
    </div>
  );
}

export function HowItWorks({ index = "02" }: { index?: string }) {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const cols = q("[data-stage-col]");
      gsap.set(cols.slice(1), { opacity: 0.32 });
      gsap.set(q("[data-doc]"), { opacity: 0, x: -48 });
      gsap.set(q("[data-intake-bar]"), { scaleX: 0 });
      gsap.set(q("[data-node-glow]"), { opacity: 0 });
      gsap.set(q("[data-connector]"), { opacity: 0 });
      gsap.set(q("[data-gate]"), { opacity: 0, scale: 0.6, transformOrigin: "left center" });
      gsap.set(q("[data-repo-row]"), { opacity: 0, y: 12 });
      gsap.set(q("[data-deploy]"), { opacity: 0, y: 12 });
      gsap.set(q("[data-rail-fill]"), { scaleX: 0 });
      gsap.set(q("[data-rail-dot]"), { backgroundColor: "rgb(154 161 172 / 0.25)" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: el,
          start: "top top+=84",
          end: "+=2200",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.to(q("[data-rail-fill]"), { scaleX: 1, ease: "none", duration: 10 }, 0);
      tl.to(q("[data-rail-dot]")[0], { backgroundColor: "#22c3c9", duration: 0.2 }, 0);
      // Stage 1 — documents enter intake
      tl.to(q("[data-doc]"), { opacity: 1, x: 0, stagger: 0.25, duration: 0.6 }, 0.1);
      tl.to(q("[data-intake-bar]"), { scaleX: 1, duration: 1 }, 1.4);
      // Stage 2 — pipeline lights up
      tl.to(cols[1], { opacity: 1, duration: 0.5 }, 2.4);
      tl.to(q("[data-rail-dot]")[1], { backgroundColor: "#22c3c9", duration: 0.2 }, 2.6);
      const nodes = q("[data-node-glow]");
      const connectors = q("[data-connector]");
      nodes.forEach((n, i) => {
        tl.to(n, { opacity: 1, duration: 0.35 }, 2.8 + i * 0.5);
        if (connectors[i]) tl.to(connectors[i], { opacity: 1, duration: 0.25 }, 3.0 + i * 0.5);
      });
      tl.to(q("[data-gate]"), { opacity: 1, scale: 1, stagger: 1, duration: 0.35, ease: "back.out(2)" }, 3.6);
      // Stage 3 — ship
      tl.to(cols[2], { opacity: 1, duration: 0.5 }, 6.4);
      tl.to(q("[data-rail-dot]")[2], { backgroundColor: "#3dd68c", duration: 0.2 }, 6.6);
      tl.to(q("[data-repo-row]"), { opacity: 1, y: 0, stagger: 0.25, duration: 0.5 }, 6.7);
      tl.to(q("[data-deploy]"), { opacity: 1, y: 0, duration: 0.6 }, 8.6);
      tl.to({}, { duration: 0.8 }, 9.2);
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="how-it-works-title" id="how-it-works" className="relative overflow-x-clip bg-midnight">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-80" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-electric/[0.06] blur-[120px]" />

      <div className="container-x relative pt-[var(--section-y)]">
        <SectionHeading
          id="how-it-works-title"
          index={index}
          eyebrow="How it works"
          title="Requirements in. Production app out."
          accent="Production app out."
          description="One pipeline. Three stages. Every line of code traces back to the requirement that created it."
        />
      </div>

      <div ref={pinRef} className="relative">
        <div className="container-x relative py-10 lg:py-8">
          {/* Progress rail (desktop) */}
          <div aria-hidden className="relative mb-8 hidden lg:block">
            <div className="relative h-px bg-white/10">
              <div data-rail-fill className="absolute inset-0 origin-left bg-gradient-to-r from-electric via-electric-300 to-teal" />
            </div>
            <div className="absolute inset-x-0 -top-[5px] grid grid-cols-3">
              {STAGES.map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span data-rail-dot className="h-[11px] w-[11px] rounded-full border border-white/30 bg-electric" />
                  <span className="eyebrow text-steel">
                    {s.n} · {s.kicker}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {[InputStage, BuildStage, ShipStage].map((Stage, i) => (
              <RevealOnScroll key={i} delay={i * 0.08} className="h-full">
                <div
                  data-stage-col
                  className="glass-dark relative h-full rounded-md p-5 sm:p-6"
                >
                  {i < 2 && (
                    <span aria-hidden className="absolute top-1/2 -right-[19px] z-10 hidden h-px w-[14px] bg-gradient-to-r from-electric to-transparent lg:block" />
                  )}
                  <Stage />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x relative pt-6 pb-[var(--section-y)]">
        <TextReveal
          as="p"
          text="From raw requirements to deployable code — in hours, not months."
          accent="hours, not months."
          className="max-w-3xl font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight font-bold tracking-[-0.02em] text-white"
        />
      </div>
    </section>
  );
}
