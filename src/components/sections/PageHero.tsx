import type { ReactNode } from "react";
import { RevealOnScroll, TextReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Drifting isometric wireframe — stacked cube outlines in blue, a single gold node. */
function IsoAccent() {
  return (
    <svg viewBox="0 0 400 400" className="ph-drift h-full w-full" fill="none" aria-hidden>
      <g stroke="#22c3c9" strokeOpacity="0.45" strokeWidth="1">
        <polygon points="200,40 330,115 330,265 200,340 70,265 70,115" />
        <path d="M200 190V340M200 190L70 115M200 190L330 115" />
      </g>
      <g stroke="#9aa1ac" strokeOpacity="0.22" strokeWidth="0.8" strokeDasharray="3 6">
        <polygon points="200,90 287,140 287,240 200,290 113,240 113,140" />
        <path d="M200 190V290M200 190L113 140M200 190L287 140" />
      </g>
      <g stroke="#9aa1ac" strokeOpacity="0.12" strokeWidth="0.8">
        <polygon points="200,0 365,95 365,285 200,380 35,285 35,95" />
      </g>
      <circle cx="200" cy="190" r="4" fill="#e8a33d" />
      <circle cx="330" cy="115" r="3" fill="#3dd68c" />
      <circle cx="70" cy="265" r="3" fill="#22c3c9" />
    </svg>
  );
}

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
  visual,
  compact = false,
  id = "page-title",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
  visual?: ReactNode;
  compact?: boolean;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-abyss text-white">
      <style>{`
        @keyframes ph-drift { 0%,100% { transform: translate3d(0,0,0) rotate(0deg) } 50% { transform: translate3d(-12px,14px,0) rotate(4deg) } }
        .ph-drift { animation: ph-drift 16s ease-in-out infinite; transform-origin: 50% 50%; }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-abyss via-midnight/70 to-midnight" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-iso-grid opacity-70 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-[-10%] -z-10 h-[520px] w-[620px] rounded-full bg-brand/45 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute top-10 right-[-6%] -z-10 h-72 w-72 rounded-full bg-electric/20 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute right-[22%] bottom-0 -z-10 h-40 w-40 rounded-full bg-electric/[0.06] blur-[90px]" />

      <div
        className={cn(
          "container-x relative grid items-center gap-12",
          compact ? "pt-[calc(var(--nav-h)+3.5rem)] pb-14 sm:pb-16" : "pt-[calc(var(--nav-h)+4.5rem)] pb-20 sm:pt-[calc(var(--nav-h)+6rem)] sm:pb-28",
          !compact && "lg:grid-cols-[1.25fr_0.75fr]",
        )}
      >
        <div className="max-w-3xl">
          <RevealOnScroll y={10}>
            <p className="eyebrow flex items-center gap-3 text-steel">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              {eyebrow}
            </p>
          </RevealOnScroll>
          <TextReveal
            id={id}
            as="h1"
            immediate
            delay={0.1}
            text={title}
            accent={accent}
            className={cn("mt-5 text-balance text-white", compact ? "display-lg" : "display-xl")}
          />
          {description && (
            <RevealOnScroll delay={0.3}>
              <p className="lede mt-6 max-w-2xl text-pretty text-steel">{description}</p>
            </RevealOnScroll>
          )}
          {children && (
            <RevealOnScroll delay={0.4}>
              <div className="mt-9 flex flex-wrap items-center gap-3">{children}</div>
            </RevealOnScroll>
          )}
        </div>

        {!compact &&
          (visual ? (
            <RevealOnScroll delay={0.2} className="relative">
              {visual}
            </RevealOnScroll>
          ) : (
            <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[380px] lg:block">
              <IsoAccent />
            </div>
          ))}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
    </section>
  );
}
