import type { Metadata } from "next";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { TextReveal, RevealOnScroll } from "@/components/ui/Reveal";
import { governanceSteps } from "@/content/product";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get Early Access",
  description: "Join the waitlist for early access to YottaBuilder. Available for IT services teams and software consultancies first.",
  path: "/early-access",
});

export default function EarlyAccessPage() {
  return (
    <section aria-labelledby="ea-page-title" className="relative overflow-hidden bg-abyss pt-[calc(var(--nav-h)+4rem)] pb-24 sm:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-70 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-brand/40 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-electric/[0.06] blur-[100px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow text-electric-300">Early access</p>
          <TextReveal
            id="ea-page-title"
            as="h1"
            immediate
            text="Bring your requirements. Leave with a production app."
            accent="a production app."
            className="display-lg mt-5 text-balance text-white"
          />
          <RevealOnScroll delay={0.2}>
            <p className="lede mt-6 max-w-xl text-steel">
              Join the waitlist for early access to YottaBuilder. Available for IT services teams and software consultancies first.
            </p>
          </RevealOnScroll>
          <ol className="mt-12 space-y-0 border-l border-line-dark">
            {governanceSteps.map((s, i) => (
              <RevealOnScroll as="li" key={s.n} delay={0.25 + i * 0.06} className="relative pb-6 pl-7 last:pb-0">
                <span aria-hidden className={`absolute top-1.5 -left-[5px] h-[9px] w-[9px] rotate-45 ${s.n === "03" ? "bg-gold" : "bg-electric"}`} />
                <p className="font-mono text-xs text-steel/70">{s.n}</p>
                <p className="font-display font-bold text-white">{s.title}</p>
                <p className="text-sm text-steel">{s.body}</p>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
        <RevealOnScroll delay={0.15} className="lg:col-span-6">
          <div className="border-orbit relative rounded-xl bg-midnight p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">Request early access</h2>
            <p className="mt-2 mb-8 text-sm text-steel">Tell us a little about you and what you’re building.</p>
            <EarlyAccessForm />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
