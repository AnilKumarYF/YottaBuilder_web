import { Button } from "@/components/ui/Button";
import { TextReveal, RevealOnScroll } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/content/site";
import { LiveConsole } from "./LiveConsole";

/**
 * Design B hero: a light paper panel inset inside a dark frame, so the transparent
 * white-text navbar always sits on dark. The centrepiece is a live, scripted pipeline console.
 */
export function HeroV2() {
  return (
    <section aria-labelledby="hero-v2-title" className="relative bg-abyss px-3 pt-[var(--nav-h)] pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[20px] bg-ice">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid-light opacity-70 [mask-image:linear-gradient(180deg,#000,transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-48 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-electric/[0.13] blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute top-40 -left-40 h-80 w-80 rounded-full bg-brand/[0.08] blur-[100px]" />

        <div className="container-x relative pt-14 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <RevealOnScroll y={10}>
                <p className="inline-flex items-center gap-2 rounded-full border border-line-light bg-white/80 py-1 pr-3 pl-1.5 text-[0.78rem] text-slate-ink shadow-[0_1px_2px_rgb(13_15_18/0.05)] backdrop-blur">
                  <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.62rem] tracking-wider text-white uppercase">Early access</span>
                  AI-powered SDLC platform · by YottaFlex.ai
                </p>
              </RevealOnScroll>
              <TextReveal
                id="hero-v2-title"
                as="h1"
                immediate
                delay={0.1}
                text="From client requirements to production app."
                accent="production app."
                className="mt-7 max-w-[16ch] font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance text-ink"
              />
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <RevealOnScroll delay={0.35}>
                <p className="lede max-w-md text-pretty text-slate-ink">
                  <span className="text-ink">AI-powered. Human-led. Production-ready.</span> Transform meeting notes, RFPs and requirements into deployable, traceable
                  software with YottaBuilder.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button earlyAccess magnetic size="lg">
                    Get Early Access
                  </Button>
                  <Button href="#how" variant="ghost" size="lg">
                    See how it works
                  </Button>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          <RevealOnScroll delay={0.5} y={40} className="mt-14 lg:mt-16">
            <LiveConsole />
          </RevealOnScroll>

          <dl className="mt-14 grid grid-cols-2 border-t border-line-light lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={"flex flex-col-reverse gap-1 py-6 pr-4 " + (i % 2 === 1 ? "pl-4 lg:pl-6 border-l border-line-light" : i === 2 ? "lg:pl-6 lg:border-l lg:border-line-light" : "")}>
                <dt className="text-[0.85rem] text-slate-ink">{s.label}</dt>
                <dd className="font-display text-[2.2rem] leading-none font-semibold tracking-[-0.04em] text-ink sm:text-[2.6rem]">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
            <div className="flex flex-col-reverse gap-1 border-l border-line-light py-6 pr-4 pl-4 lg:pl-6">
              <dt className="text-[0.85rem] text-slate-ink">Model · Cloud · Stack</dt>
              <dd className="font-display text-[2.2rem] leading-none font-semibold tracking-[-0.04em] text-electric-700 sm:text-[2.6rem]">Any</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
