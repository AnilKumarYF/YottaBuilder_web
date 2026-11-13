"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type RefObject } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { governanceSteps } from "@/content/product";
import { cn } from "@/lib/cn";

const GateScene = dynamic(() => import("./GateScene"), { ssr: false, loading: () => <GateFallback /> });

/**
 * Mount a WebGL scene only when its section nears the viewport, and only on
 * clients that can run it. Shared by the Design C 3D sections.
 */
export function useLazyCanvas(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [capable, setCapable] = useState<boolean | null>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    let ok = true;
    try {
      const c = document.createElement("canvas");
      ok = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    const lowPower = (navigator.hardwareConcurrency ?? 4) <= 2;
    setCapable(ok && !lowPower);
    setMobile(window.matchMedia("(max-width: 1023px)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return { mount: near && capable === true, fallback: capable === false, mobile };
}

function GateFallback() {
  return (
    <svg viewBox="0 0 800 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="gf-in" x1="0" x2="1">
          <stop offset="0" stopColor="#22c3c9" stopOpacity="0" />
          <stop offset="1" stopColor="#22c3c9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gf-out" x1="0" x2="1">
          <stop offset="0" stopColor="#3dd68c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3dd68c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[-60, -25, 10, 45, 80].map((d, i) => (
        <path key={i} d={`M40 ${150 + d} C 200 ${150 - d}, 300 ${150 + d * 0.4}, 400 150`} stroke="url(#gf-in)" strokeWidth="1.5" fill="none" />
      ))}
      {[-36, -18, 0, 18, 36].map((d, i) => (
        <path key={i} d={`M400 150 C 470 150, 500 ${150 + d}, 760 ${150 + d}`} stroke="url(#gf-out)" strokeWidth="1.5" fill="none" />
      ))}
      <ellipse cx="400" cy="150" rx="22" ry="88" fill="none" stroke="#e8a33d" strokeWidth="3" />
      <ellipse cx="400" cy="150" rx="30" ry="104" fill="none" stroke="#e8a33d" strokeOpacity="0.35" />
    </svg>
  );
}

export function GateSection({ index = "04" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { mount, fallback, mobile } = useLazyCanvas(ref);

  return (
    <section ref={ref} aria-labelledby="v3-gates-title" className="relative overflow-hidden bg-midnight section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-50 mask-fade-b" />
      <div className="container-x relative">
        <SectionHeading
          id="v3-gates-title"
          index={index}
          eyebrow="Philosophy"
          title="AI generates. Experts validate."
          accent="Experts validate."
          description="Between your requirements and production code sit multiple expert-led approval gates. At every one, a domain expert decides whether the work is good enough to move forward. That’s what makes the output trustworthy."
        />
      </div>

      <div className="relative mt-10 h-[360px] w-full lg:mt-6 lg:h-[520px]">
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[90px]" />
        {mount ? <GateScene className="absolute inset-0" mobile={mobile} /> : fallback ? <GateFallback /> : null}
        <p className="sr-only">
          Animation: a noisy stream of AI-generated work flows into an amber human approval gate. Approved work leaves in ordered green lanes toward production;
          a small share is rejected and falls away.
        </p>
      </div>

      <div className="container-x relative">
        <div aria-hidden className="grid grid-cols-3 border-t border-line-dark pt-4 font-mono text-[0.68rem] tracking-[0.14em] uppercase sm:text-xs">
          <span className="flex items-center gap-2 text-electric-300">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" /> AI generates
          </span>
          <span className="flex items-center justify-center gap-2 text-gold-300">
            <span className="h-2 w-2 rotate-45 bg-gold" /> Human gate
          </span>
          <span className="flex items-center justify-end gap-2 text-teal">
            Production <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          </span>
        </div>

        <Stagger as="ol" className="mt-14 grid gap-px overflow-hidden rounded-md border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-4">
          {governanceSteps.map((s) => {
            const human = s.n === "03";
            return (
              <StaggerItem as="li" key={s.n} className={cn("relative p-6", human ? "bg-gold/[0.08]" : "bg-midnight")}>
                {human && <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gold" />}
                <p className={cn("font-mono text-xs", human ? "text-gold-300" : "text-steel/70")}>Step {s.n}</p>
                <p className={cn("mt-3 text-lg font-semibold tracking-[-0.02em]", human ? "text-gold-300" : "text-white")}>{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{s.body}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
