import { whyFeatures } from "@/content/product";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

const icons: Record<string, React.ReactNode> = {
  model: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 01-.6-7.95A6 6 0 0118 9a4.5 4.5 0 01-.5 9H7z" />,
  stack: <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />,
  repo: (
    <>
      <path d="M5 4.5A1.5 1.5 0 016.5 3H19v15H6.5A1.5 1.5 0 005 19.5v-15z" />
      <path d="M5 19.5A1.5 1.5 0 006.5 21H19v-3M9 7h6M9 10.5h4" />
    </>
  ),
  trace: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h6a3 3 0 010 6h-2a3 3 0 000 6h6" />
    </>
  ),
  human: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20a7 7 0 0114 0M15.5 15.5l1.8 1.8 3.2-3.6" />
    </>
  ),
  tests: <path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3M7.5 14h9" />,
  ship: <path d="M12 3c3 2 5 5.5 5 9.5L15 16H9l-2-3.5C7 8.5 9 5 12 3zM9 16l-2.5 4M15 16l2.5 4M12 16v5M12 9.5v.01" />,
};

function Icon({ k, className }: { k: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icons[k]}
    </svg>
  );
}

/** Miniature repo tree for the featured "Complete Repository Generation" card. */
function RepoVisual() {
  const rows = [
    { d: 0, n: "app/", c: "text-steel" },
    { d: 1, n: "src/components/", c: "text-electric-300" },
    { d: 1, n: "src/services/", c: "text-electric-300" },
    { d: 1, n: "tests/integration/", c: "text-teal-300" },
    { d: 1, n: "infra/terraform/", c: "text-teal-300" },
    { d: 1, n: "README.md", c: "text-steel" },
  ];
  return (
    <div aria-hidden className="mt-8 rounded-sm border border-line-dark bg-abyss/70 p-4 font-mono text-[0.75rem] leading-6">
      {rows.map((r) => (
        <div key={r.n} className={cn("flex items-center gap-2", r.c)} style={{ paddingLeft: r.d * 16 }}>
          <span className="text-steel/40">{r.d ? "├─" : "▾"}</span>
          {r.n}
        </div>
      ))}
      <div className="mt-3 flex items-center gap-2 border-t border-line-dark pt-3 text-steel">
        <span className="h-1.5 w-1.5 rounded-full bg-teal" />
        <span className="text-teal-300">a3f8c21</span> feat: initial deploy
      </div>
    </div>
  );
}

export function WhyYottaBuilder({ index = "08" }: { index?: string }) {
  const byKey = Object.fromEntries(whyFeatures.map((f, i) => [f.key, { ...f, n: i + 1 }]));
  // Grid order: featured repo (2x2), four singles, featured human (2x1), two singles.
  const order = ["repo", "model", "cloud", "stack", "trace", "human", "tests", "ship"];

  return (
    <section aria-labelledby="why-heading" className="relative overflow-hidden bg-white">
      <div className="container-x section-y relative">
        <SectionHeading
          id="why-heading"
          tone="light"
          index={index}
          eyebrow="Why YottaBuilder"
          title="Build software with intelligence. Deliver with confidence."
          accent="Deliver with confidence."
        />

        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense">
          {order.map((k) => {
            const f = byKey[k];
            const num = String(f.n).padStart(2, "0");

            if (k === "repo") {
              return (
                <StaggerItem key={k} className="sm:col-span-2 lg:row-span-2">
                  <TiltCard max={3} spotlight="rgb(34 195 201 / 0.25)" className="overflow-hidden rounded-md bg-midnight p-7 text-white shadow-[0_40px_80px_-40px_rgb(18_20_23/0.7)] sm:p-9">
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-70" />
                    <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-electric/30 blur-3xl" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="grid h-12 w-12 place-items-center rounded-sm border border-white/15 bg-white/5 text-electric-300">
                          <Icon k={k} className="h-6 w-6" />
                        </span>
                        <span className="font-mono text-xs text-steel/70">{num}</span>
                      </div>
                      <h3 className="display-md mt-8 max-w-sm text-white">{f.title}</h3>
                      <p className="mt-3 max-w-md leading-relaxed text-steel">{f.body}</p>
                      <div className="mt-auto">
                        <RepoVisual />
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            }

            if (k === "human") {
              return (
                <StaggerItem key={k} className="sm:col-span-2">
                  <TiltCard max={3} spotlight="rgb(245 201 130 / 0.22)" className="overflow-hidden rounded-md bg-brand p-7 text-white sm:p-8">
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-60" />
                    <div className="relative z-10 flex h-full flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 place-items-center rounded-sm border border-gold/50 bg-gold/15 text-gold-300">
                            <Icon k={k} className="h-6 w-6" />
                          </span>
                          <span className="font-mono text-xs text-white/60">{num}</span>
                        </div>
                        <h3 className="mt-6 font-display text-2xl font-bold tracking-[-0.02em]">{f.title}</h3>
                        <p className="mt-2 leading-relaxed text-white/80">{f.body}</p>
                      </div>
                      <div aria-hidden className="flex shrink-0 items-center gap-2 font-mono text-[0.7rem] tracking-wider uppercase">
                        <span className="rounded-xs border border-white/25 px-2 py-1 text-white/80">AI</span>
                        <span className="h-px w-5 bg-white/40" />
                        <span className="rounded-xs border border-gold bg-gold/20 px-2 py-1 text-gold-300">Gate</span>
                        <span className="h-px w-5 bg-white/40" />
                        <span className="rounded-xs border border-teal/70 px-2 py-1 text-teal-300">Ship</span>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            }

            const alt = k === "trace" || k === "tests";
            return (
              <StaggerItem key={k}>
                <TiltCard
                  max={6}
                  className={cn(
                    "rounded-md border p-6 transition-[border-color,box-shadow] duration-500 hover:shadow-[0_30px_60px_-30px_rgb(18_20_23/0.35)] sm:p-7",
                    alt ? "border-line-light bg-ice hover:border-brand/30" : "border-line-light bg-white hover:border-brand/30",
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-sm border border-brand/15 bg-brand/[0.05] text-brand transition-colors duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        <Icon k={k} />
                      </span>
                      <span className="font-mono text-xs text-slate-ink/50">{num}</span>
                    </div>
                    <h3 className="mt-6 font-display text-[1.05rem] font-bold text-ink">{f.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">{f.body}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
