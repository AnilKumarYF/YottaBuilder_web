import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { RevealOnScroll, TextReveal } from "@/components/ui/Reveal";
import { governanceSteps } from "@/content/product";

export function ClosingV2() {
  const checks = governanceSteps.filter((s) => s.n !== "01").map((s) => ({ title: s.title, body: s.body }));
  return (
    <section aria-labelledby="v2-closing-title" className="relative overflow-hidden bg-abyss pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-50 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-electric/[0.08] blur-[120px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow text-electric-300">Early access</p>
          <TextReveal
            id="v2-closing-title"
            text="Ready to build production apps from your requirements?"
            accent="from your requirements?"
            className="display-lg mt-5 text-balance text-white"
          />
          <RevealOnScroll delay={0.15}>
            <p className="lede mt-6 max-w-xl text-steel">
              Bring your requirements. Keep your workflow. Let YottaBuilder orchestrate the journey from idea to production.
            </p>
          </RevealOnScroll>
          <ul className="mt-10 space-y-4">
            {checks.map((c, i) => (
              <RevealOnScroll as="li" key={c.title} delay={0.2 + i * 0.06} className="flex gap-3.5">
                <span
                  aria-hidden
                  className={
                    c.title === "Human Reviews"
                      ? "mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 bg-gold"
                      : c.title === "Production"
                        ? "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-teal"
                        : "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-electric"
                  }
                />
                <p className="text-[0.95rem] text-steel">
                  <span className="font-medium text-white">{c.title}.</span> {c.body}
                </p>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
        <RevealOnScroll delay={0.1} className="lg:col-span-6">
          <div className="border-orbit relative rounded-xl bg-midnight p-6 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.8)] sm:p-9">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">Request early access</h3>
            <p className="mt-1.5 mb-7 text-sm text-steel">Tell us a little about you and what you’re building.</p>
            <EarlyAccessForm tone="dark" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
