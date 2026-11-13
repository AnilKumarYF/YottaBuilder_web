"use client";

import dynamic from "next/dynamic";
import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pipelineSteps } from "@/content/product";
import { cn } from "@/lib/cn";

const MorphScene = dynamic(() => import("./MorphScene"), { ssr: false, loading: () => <div className="h-full w-full" /> });

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
    title: "Build",
    body: "AI generates epics, stories, tests and code — each level inheriting full context. Humans approve at every gate.",
  },
  {
    n: "03",
    kicker: "Production",
    title: "Ship",
    body: "Full repository pushed to GitHub. Deploy to AWS, Azure, or GCP through your existing CI/CD — no rewiring required.",
  },
] as const;

type Mode = "pinned" | "static-desktop" | "mobile" | null;

function Chips({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="Pipeline steps">
      {pipelineSteps.map((p, i) => (
        <Fragment key={p}>
          <li
            className={cn(
              "rounded-sm border px-2.5 py-1 font-mono text-[0.68rem] tracking-wide transition-colors duration-500",
              i <= step ? "border-electric/50 bg-electric/10 text-electric-300" : "border-white/10 text-steel/70",
            )}
          >
            {p}
          </li>
          {p === "Stories" && (
            <li
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[0.68rem] tracking-wide transition-colors duration-500",
                step >= 3 ? "border-gold/50 bg-gold/10 text-gold-300" : "border-white/10 text-steel/70",
              )}
            >
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-current" />
              Human gate
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.65rem] tracking-wider text-steel uppercase">
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-electric" />
        AI work
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
        Human gate
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal" />
        Shipped
      </li>
    </ul>
  );
}

export function MorphPipeline({ index = "02" }: { index?: string }) {
  const [mode, setMode] = useState<Mode>(null);
  const [stage, setStage] = useState(0);
  const [step, setStep] = useState(0);
  const progressRef = useRef(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pick layout mode from viewport + motion preference.
  useEffect(() => {
    const mqD = window.matchMedia("(min-width: 1024px)");
    const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => setMode(mqD.matches ? (mqR.matches ? "static-desktop" : "pinned") : "mobile");
    compute();
    mqD.addEventListener("change", compute);
    mqR.addEventListener("change", compute);
    return () => {
      mqD.removeEventListener("change", compute);
      mqR.removeEventListener("change", compute);
    };
  }, []);

  // Desktop: pin and scrub 0 → 2 without re-rendering per tick.
  useEffect(() => {
    if (mode !== "pinned" || !pinRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: "+=250%",
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress * 2;
        progressRef.current = p;
        const s = p < 0.5 ? 0 : p < 1.5 ? 1 : 2;
        setStage((prev) => (prev === s ? prev : s));
        const c = Math.min(6, Math.round(p * 3));
        setStep((prev) => (prev === c ? prev : c));
        if (railRef.current) railRef.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    stRef.current = st;
    return () => {
      st.kill();
      stRef.current = null;
      progressRef.current = 0;
    };
  }, [mode]);

  // Mobile: one sticky canvas steps through shapes as each stage block reaches mid-screen.
  useEffect(() => {
    if (mode !== "mobile") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.stage);
          setStage(i);
          setStep(i * 3);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [mode]);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (mode === "pinned" && st) {
      const y = st.start + (i / 2) * (st.end - st.start) + 1;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      setStage(i);
      setStep(i * 3);
    }
  };

  return (
    <section
      id="how"
      aria-labelledby="v3-how-title"
      className="relative overflow-x-clip bg-[linear-gradient(180deg,var(--color-abyss)_0%,var(--color-midnight)_100%)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-50" />

      <div className="container-x relative pt-[var(--section-y)]">
        <SectionHeading
          id="v3-how-title"
          index={index}
          eyebrow="How it works"
          title="Requirements in. Production app out."
          accent="Production app out."
          description="One pipeline. Three stages. Every line of code traces back to the requirement that created it."
        />
      </div>

      {/* Desktop (pinned or reduced-motion static) */}
      <div className="hidden lg:block">
        <div ref={pinRef} className="relative h-[100svh] min-h-[640px]">
          <div className="container-x grid h-full grid-cols-12 items-center gap-10">
            <div className="col-span-5">
              <div className="flex gap-8">
                <div className="relative w-px shrink-0 self-stretch bg-white/10">
                  <div
                    ref={railRef}
                    className="absolute inset-0 origin-top bg-electric"
                    style={{ transform: mode === "pinned" ? "scaleY(0)" : `scaleY(${stage / 2})` }}
                  />
                  {STAGES.map((s, i) => (
                    <button
                      key={s.n}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Show stage ${s.n}: ${s.title}`}
                      aria-current={stage === i ? "step" : undefined}
                      className={cn(
                        "absolute left-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
                        i === 0 ? "top-0" : i === 1 ? "top-1/2" : "top-full",
                      )}
                    >
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full border transition-colors duration-500",
                          stage >= i ? "border-electric bg-electric" : "border-white/30 bg-abyss",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="relative min-h-[300px] flex-1">
                  {STAGES.map((s, i) => (
                    <div
                      key={s.n}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-700 ease-out-expo",
                        stage === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                      )}
                    >
                      <p className="font-mono text-sm text-electric-300">
                        {s.n} / {s.kicker}
                      </p>
                      <h3 className="display-md mt-3 text-white">{s.title}</h3>
                      <p className="lede mt-4 max-w-md text-steel">{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <Chips step={step} />
              </div>
            </div>

            <div className="relative col-span-7 h-[min(78svh,720px)]">
              <div aria-hidden className="pointer-events-none absolute inset-[10%] rounded-full bg-electric/10 blur-[110px]" />
              {(mode === "pinned" || mode === "static-desktop") && (
                <MorphScene className="absolute inset-0" progressRef={mode === "pinned" ? progressRef : undefined} progress={stage} />
              )}
              <p className="sr-only">
                Animated illustration: requirement documents transform into a neural network with human approval gates, then into a shipped code repository.
              </p>
              <p className="absolute top-2 right-2 font-mono text-[0.65rem] tracking-[0.14em] text-steel uppercase">
                Stage 0{stage + 1} · {STAGES[stage].title}
              </p>
              <div className="absolute right-2 bottom-2">
                <Legend />
              </div>
            </div>
          </div>
        </div>
        <div className="pb-[var(--section-y)]" />
      </div>

      {/* Mobile / tablet */}
      <div className="container-x relative pb-[var(--section-y)] lg:hidden">
        <div className="sticky top-[calc(var(--nav-h)+8px)] z-0 mt-8 h-[42svh] min-h-[260px]">
          {mode === "mobile" && <MorphScene className="absolute inset-0" progress={stage} />}
          <p className="sr-only">
            Animated illustration: requirement documents transform into a neural network with human approval gates, then into a shipped code repository.
          </p>
          <p className="absolute top-1 left-0 font-mono text-[0.62rem] tracking-[0.14em] text-steel uppercase">
            Stage 0{stage + 1} · {STAGES[stage].title}
          </p>
        </div>
        <div className="relative z-10">
          {STAGES.map((s, i) => (
            <div
              key={s.n}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              data-stage={i}
              className="flex min-h-[60svh] items-end py-6"
            >
              <div className="glass-dark w-full rounded-md p-6">
                <p className="font-mono text-sm text-electric-300">
                  {s.n} / {s.kicker}
                </p>
                <h3 className="display-md mt-2 text-white">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-steel">{s.body}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 space-y-5">
            <Chips step={step} />
            <Legend />
          </div>
        </div>
      </div>
    </section>
  );
}
