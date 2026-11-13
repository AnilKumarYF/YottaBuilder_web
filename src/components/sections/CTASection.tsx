import { Button } from "@/components/ui/Button";
import { RevealOnScroll, TextReveal } from "@/components/ui/Reveal";

/** Isometric hexagonal wireframe (generic cube geometry — not the brand mark). */
function HexWire({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} fill="none" aria-hidden>
      <polygon points="0,-86 74,-43 74,43 0,86 -74,43 -74,-43" stroke="currentColor" strokeWidth="0.8" />
      <polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />
      <path d="M0 0V86M0 0L-74 -43M0 0L74 -43" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.7" />
      <circle r="2.5" fill="currentColor" />
    </svg>
  );
}

export function CTASection({
  title = "Ready to build production apps from your requirements?",
  body = "Bring your requirements. Keep your workflow. Let YottaBuilder orchestrate the journey from idea to production.",
  eyebrow = "Early access",
  secondary,
}: {
  title?: string;
  body?: string;
  eyebrow?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-abyss text-white">
      <style>{`
        @keyframes cta-spin { to { transform: rotate(360deg) } }
        @keyframes cta-spin-r { to { transform: rotate(-360deg) } }
        .cta-spin { animation: cta-spin 90s linear infinite; }
        .cta-spin-r { animation: cta-spin-r 120s linear infinite; }
      `}</style>
      {/* lighting */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/40 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 right-[12%] h-56 w-56 rounded-full bg-electric/[0.06] blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      {/* geometry */}
      <HexWire className="cta-spin pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] text-electric/25" />
      <HexWire className="cta-spin-r pointer-events-none absolute -right-16 -bottom-32 h-[360px] w-[360px] text-white/10" />
      <HexWire className="cta-spin pointer-events-none absolute top-16 right-[18%] hidden h-28 w-28 text-steel/20 md:block" />

      <div className="container-x relative py-[clamp(5rem,12vw,9rem)]">
        <div className="border-orbit relative mx-auto max-w-4xl rounded-xl bg-midnight/60 px-6 py-14 text-center backdrop-blur-sm sm:px-14 sm:py-20">
          <RevealOnScroll y={10}>
            <p className="eyebrow flex items-center justify-center gap-3 text-electric-300">
              <span aria-hidden className="h-px w-8 bg-gold/50" />
              {eyebrow}
              <span aria-hidden className="h-px w-8 bg-gold/50" />
            </p>
          </RevealOnScroll>
          <TextReveal id="cta-heading" as="h2" text={title} className="display-lg mx-auto mt-6 max-w-3xl text-balance text-white" />
          <RevealOnScroll delay={0.15}>
            <p className="lede mx-auto mt-6 max-w-2xl text-steel">{body}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button earlyAccess magnetic size="lg">
                Get Early Access
              </Button>
              {secondary && (
                <Button href={secondary.href} variant="secondary" size="lg">
                  {secondary.label}
                </Button>
              )}
            </div>
            <p className="mt-6 text-sm text-steel/80">Available for IT services teams and software consultancies first.</p>
          </RevealOnScroll>
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-dark to-transparent" />
    </section>
  );
}
