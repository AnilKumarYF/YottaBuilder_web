import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProductDemo } from "@/components/sections/ProductDemo";
import { AIHumanGovernance } from "@/components/sections/Governance";
import { EnterpriseGovernance } from "@/components/sections/EnterpriseGovernance";
import { WhyYottaBuilder } from "@/components/sections/WhyYottaBuilder";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Platform",
  description:
    "The YottaBuilder platform: an AI development lifecycle with human approval gates, requirement-to-code traceability and complete repository generation — model-, cloud- and stack-agnostic.",
  path: "/platform",
});

const lifecycle = [
  {
    k: "SDLC",
    title: "Built for a world without AI",
    body: "Requirements gathered by hand, code written line by line, tests written after the fact. AI bolted on later produces snippets with no shared context.",
  },
  {
    k: "AI-DLC",
    title: "AI embedded at every phase",
    body: "AI is embedded at every phase, with humans providing oversight, quality gates and the judgment that machines can’t.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="The platform"
        title="From SDLC to AI-DLC."
        accent="AI-DLC."
        description="YottaBuilder is the intelligent pipeline that makes the entire software development lifecycle work with AI — structured, traceable, and governed by humans at every critical gate."
      >
        <Button earlyAccess magnetic size="lg">
          Get Early Access
        </Button>
        <Button href="/how-it-works" variant="secondary" size="lg">
          See how it works
        </Button>
      </PageHero>

      <section aria-labelledby="lifecycle-title" className="relative bg-white section-y">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid-light opacity-60 mask-fade-b" />
        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <RevealOnScroll>
                <p className="eyebrow text-brand">
                  <span className="text-ink/40">01</span> &nbsp;—&nbsp; The shift
                </p>
                <h2 id="lifecycle-title" className="display-lg mt-5 text-balance text-ink">
                  The lifecycle was never designed for AI.
                </h2>
                <p className="lede mt-6 text-slate-ink">
                  The traditional software development lifecycle was built for a world without AI. The AI development lifecycle flips this — and YottaBuilder is built
                  for it from the ground up.
                </p>
              </RevealOnScroll>
            </div>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {lifecycle.map((l, i) => (
                <StaggerItem key={l.k} as="article" className={i === 1 ? "rounded-md bg-midnight p-7 text-white" : "rounded-md border border-line-light bg-ice p-7"}>
                  <p className={`font-mono text-sm ${i === 1 ? "text-electric-300" : "text-slate-ink"}`}>{l.k}</p>
                  <h3 className={`mt-4 font-display text-xl font-bold tracking-[-0.02em] ${i === 1 ? "text-white" : "text-ink"}`}>{l.title}</h3>
                  <p className={`mt-3 leading-relaxed ${i === 1 ? "text-steel" : "text-slate-ink"}`}>{l.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-light bg-line-light lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-white p-6 sm:p-8">
                <dt className="mt-2 text-sm text-slate-ink">{s.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-[-0.03em] text-brand sm:text-5xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
            <div className="flex flex-col-reverse bg-white p-6 sm:p-8">
              <dt className="mt-2 text-sm text-slate-ink">Model · Cloud · Stack</dt>
              <dd className="font-display text-4xl font-bold tracking-[-0.03em] text-electric-700 sm:text-5xl">Any</dd>
            </div>
          </dl>
        </div>
      </section>

      <ProductDemo index="02" />
      <AIHumanGovernance index="03" />
      <EnterpriseGovernance index="04" />
      <WhyYottaBuilder index="05" />
      <CTASection />
    </>
  );
}
