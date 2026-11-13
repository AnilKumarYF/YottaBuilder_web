import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { company } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "YottaBuilder is the flagship product of YottaFlex.ai — born from the belief that AI should amplify human capability, never replace it.",
  path: "/about-us",
});

const values = [
  { n: "01", title: "Relentless Innovation", body: "Cutting-edge technology, shipped at pace." },
  { n: "02", title: "Engineering Excellence", body: "Continuous learning. No shortcuts." },
  { n: "03", title: "Generative AI Pioneers", body: "Building the future of software, today." },
  { n: "04", title: "Above and Beyond", body: "Exceeding expectations is the baseline." },
];

// The first two beliefs are verbatim from the live site. The live site repeats placeholder copy
// for the last three; these lines are taken from YottaBuilder's own product copy instead.
const beliefs = [
  {
    title: "Human-AI collaboration, not replacement",
    body: "Research consistently shows that human-AI teams outperform either alone. We build workflows for exactly this sweet spot: AI handles volume and speed, humans handle context, creativity and judgment.",
  },
  {
    title: "The human element is the product",
    body: "AI can write code. It cannot define what “good” feels like for your users. The approval gates in YottaBuilder are where human taste shapes the final product. That’s not a bottleneck — that’s the feature.",
  },
  {
    title: "Quality over speed. Always.",
    body: "Between your requirements and production code sit multiple expert-led approval gates. At every one, a domain expert decides whether the work is good enough to move forward.",
  },
  {
    title: "Traceability is trust",
    body: "Every function traces to a backlog item, and every block from requirement to test. A complete, auditable codebase — traceable end to end.",
  },
  {
    title: "No lock-in. Ever.",
    body: "Model-agnostic, cloud-agnostic, stack-agnostic. Swap Claude, GPT or Llama anytime, and deploy wherever you already run.",
  },
];

const regions = [
  { region: "North America", offices: [company.addresses[0], company.addresses[1]] },
  { region: "South America", offices: [company.addresses[3]] },
  { region: "Asia", offices: [company.addresses[2]] },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About YottaBuilder"
        title="We’re not building tools. We’re building a new way to build."
        accent="a new way to build."
        description="YottaBuilder is the flagship product of YottaFlex.ai — born from the belief that AI should amplify human capability, never replace it."
      >
        <Button href="/careers" size="lg" magnetic>
          View open roles
        </Button>
        <Button href="/platform" variant="secondary" size="lg">
          Explore the platform
        </Button>
      </PageHero>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-title" className="relative bg-white section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <p className="eyebrow text-brand">
                <span className="text-ink/40">01</span> &nbsp;—&nbsp; Our philosophy
              </p>
              <h2 id="philosophy-title" className="display-lg mt-5 text-balance text-ink">
                AI can generate code. It cannot architect a system.
              </h2>
            </RevealOnScroll>
          </div>
          <div className="space-y-6 text-[1.08rem] leading-[1.8] text-slate-ink lg:col-span-7">
            <RevealOnScroll>
              <p>
                YottaBuilder was born from a simple observation: AI can generate code, but it cannot architect a system. Humans can architect, but they can’t keep up
                with the volume AI demands. The answer isn’t AI replacing developers. It’s AI and developers together, in a workflow designed for exactly that
                partnership.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.08}>
              <p>
                We believe the software development lifecycle is being transformed not by AI replacing developers, but by AI absorbing the repetitive scaffolding so
                developers can focus on what matters: <strong className="text-ink">taste, judgment, and the craft of building something great.</strong>
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.16}>
              <p>
                YottaBuilder is a <strong className="text-brand">force multiplier</strong> — enabling small teams to ship production-quality software at the speed of
                large ones, while keeping humans firmly in control at every decision point that matters.
              </p>
            </RevealOnScroll>
          </div>
        </div>

        <RevealOnScroll className="container-x mt-20">
          <figure className="relative overflow-hidden rounded-md bg-midnight px-7 py-12 sm:px-14 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-70" />
            <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-electric/[0.06] blur-3xl" />
            <blockquote className="relative max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.2] font-bold tracking-[-0.02em] text-white">
              “Technology should not aim to replace humans, rather <span className="text-gradient-gold">amplify human capabilities.</span>”
            </blockquote>
            <figcaption className="relative mt-6 font-mono text-sm text-steel">— Doug Engelbart · The founding philosophy of YottaBuilder</figcaption>
          </figure>
        </RevealOnScroll>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="relative bg-ice section-y">
        <div className="container-x">
          <SectionHeading id="values-title" tone="light" index="02" eyebrow="Values" title="What we stand for." />
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-md border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.n} className="group relative bg-white p-7 transition-colors duration-500 hover:bg-midnight sm:p-8">
                <p className="font-mono text-sm text-electric-700">{v.n}</p>
                <h3 className="mt-10 font-display text-xl font-bold tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{v.title}</h3>
                <p className="mt-2 text-slate-ink transition-colors duration-500 group-hover:text-steel">{v.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Beliefs */}
      <section aria-labelledby="beliefs-heading" className="relative bg-white section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <SectionHeading id="beliefs-heading" tone="light" index="03" eyebrow="Core beliefs" title="The principles behind the pipeline." />
          </div>
          <ol className="space-y-4 lg:col-span-8">
            {beliefs.map((b, i) => (
              <RevealOnScroll as="li" key={b.title} delay={i * 0.04}>
                <TiltCard max={3} className="rounded-md border border-line-light bg-white p-7 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(18_20_23/0.3)] sm:p-8">
                  <div className="relative flex gap-6">
                    <span className="font-mono text-sm text-brand">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">{b.title}</h3>
                      <p className="mt-3 leading-relaxed text-slate-ink">{b.body}</p>
                    </div>
                  </div>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>

      {/* Global footprint */}
      <section aria-labelledby="footprint-title" className="relative overflow-hidden bg-midnight section-y">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60 mask-fade-b" />
        <div className="container-x relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="footprint-title"
              index="04"
              eyebrow="Global reach, zero lag"
              title="Our global footprint."
              description="With teams and infrastructure spanning three continents and four countries, we test and optimize across every major time zone — operating across North America, South America and Asia."
            />
            <RevealOnScroll delay={0.2} className="mt-10 flex items-center gap-4 text-steel">
              <p className="text-sm">
                <span className="font-semibold text-white">YottaFlex.ai</span> — builders of YottaBuilder. An AI-native product studio focused on transforming professional
                workflows through intelligent human-AI collaboration.
              </p>
            </RevealOnScroll>
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {regions.map((r) => (
              <StaggerItem key={r.region} className="glass-dark rounded-md p-6">
                <p className="eyebrow text-electric-300">{r.region}</p>
                <ul className="mt-5 space-y-5">
                  {r.offices.map((o) => (
                    <li key={o.city}>
                      <p className="font-display font-bold text-white">{o.city}</p>
                      <address className="mt-1 text-sm leading-relaxed not-italic text-steel">{o.lines}</address>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        eyebrow="Join us"
        title="Want to be part of what we’re building?"
        body="We’re always looking for curious, ambitious people who believe in the force-multiplier vision."
        secondary={{ label: "View open roles", href: "/careers" }}
      />
    </>
  );
}
