import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { repoTree } from "@/content/product";
import { cn } from "@/lib/cn";

function Card({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" | "amber" }) {
  return (
    <StaggerItem className={className}>
      <TiltCard
        max={2.5}
        spotlight={tone === "dark" ? "rgb(34 195 201 / 0.12)" : tone === "amber" ? "rgb(232 163 61 / 0.12)" : "rgb(34 195 201 / 0.08)"}
        className={cn(
          "flex flex-col overflow-hidden rounded-md border p-6 transition-shadow duration-500 sm:p-7",
          tone === "dark" && "border-line-dark bg-midnight text-white hover:shadow-[0_30px_60px_-30px_rgb(10_11_13/0.6)]",
          tone === "light" && "border-line-light bg-white hover:shadow-[0_30px_60px_-34px_rgb(13_15_18/0.3)]",
          tone === "amber" && "border-gold/40 bg-[#fdf6ea] hover:shadow-[0_30px_60px_-34px_rgb(154_101_18/0.35)]",
        )}
      >
        <div className="relative flex h-full flex-col">{children}</div>
      </TiltCard>
    </StaggerItem>
  );
}

const Label = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <p className={cn("font-mono text-[0.68rem] tracking-[0.12em] uppercase", dark ? "text-electric-300" : "text-electric-700")}>{children}</p>
);

export function PlatformBento() {
  return (
    <section aria-labelledby="v2-platform-title" className="relative bg-white section-y">
      <div className="container-x">
        <SectionHeading
          id="v2-platform-title"
          tone="light"
          index="04"
          eyebrow="Platform"
          title="Built for controlled, traceable development."
          accent="traceable development."
          description="Every generation, review and approval is accountable — so engineering leaders can adopt AI without giving up control."
        />

        <Stagger className="mt-14 grid auto-rows-auto gap-4 lg:grid-cols-6">
          {/* Agnostic */}
          <Card className="lg:col-span-4">
            <Label>No lock-in</Label>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink">Model, cloud and stack agnostic.</h3>
            <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line-light bg-line-light sm:grid-cols-3">
              {[
                { k: "Models", v: "Claude, GPT, Gemini, Llama or any LLM. Switch without rework." },
                { k: "Cloud", v: "AWS, Azure, Google Cloud or on-premise." },
                { k: "Stack", v: "Node.js, Python, Go, Java, React, Vue, Angular — and the infra you prefer." },
              ].map((c) => (
                <div key={c.k} className="bg-ice p-4">
                  <p className="text-sm font-semibold text-ink">{c.k}</p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-ink">{c.v}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Testing */}
          <Card className="lg:col-span-2">
            <Label>Quality</Label>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">Automated testing</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">Tests are generated before code, so coverage is built in from the start.</p>
            <div className="mt-auto pt-6 font-mono text-[0.72rem]">
              {["Stories", "Tests", "Code"].map((s, i) => (
                <span key={s} className={cn("inline-flex items-center", i > 0 && "ml-1.5")}>
                  {i > 0 && <span className="mr-1.5 text-slate-ink/50">→</span>}
                  <span className={cn("rounded-xs border px-1.5 py-0.5", s === "Tests" ? "border-electric/50 bg-electric/10 text-electric-700" : "border-line-light text-slate-ink")}>{s}</span>
                </span>
              ))}
            </div>
          </Card>

          {/* Repo */}
          <Card tone="dark" className="lg:col-span-3 lg:row-span-2">
            <Label dark>Output</Label>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Complete repository generation</h3>
            <p className="mt-2 max-w-sm text-[0.92rem] leading-relaxed text-steel">A buildable codebase with proper structure — not isolated fragments.</p>
            <div className="mt-6 flex-1 rounded-sm border border-line-dark bg-abyss/70 p-4 font-mono text-[0.78rem] leading-7">
              <p className="text-steel">app/</p>
              {repoTree.map((r) => (
                <p key={r.path} className="flex justify-between gap-4 pl-4">
                  <span className="text-electric-300">├─ {r.path}</span>
                  <span className="hidden text-steel/60 sm:inline">{r.note}</span>
                </p>
              ))}
              <p className="mt-3 border-t border-line-dark pt-3 text-steel">
                <span className="text-teal">●</span> a3f8c21 <span className="text-white">feat: initial deploy</span>
              </p>
            </div>
          </Card>

          {/* Traceability */}
          <Card className="lg:col-span-3">
            <Label>Lineage</Label>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">Requirement traceability</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">Every function traces to a backlog item, and every block from requirement to test.</p>
            <div className="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-[0.72rem]">
              {["REQ-014", "EP-03", "ST-07", "TEST-88", "approvals.ts"].map((t, i) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-ink/50">→</span>}
                  <span className={cn("rounded-xs border px-1.5 py-0.5", i === 4 ? "border-ink bg-ink text-white" : "border-line-light bg-ice text-ink")}>{t}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-[0.7rem] text-slate-ink/70">Sample identifiers</p>
          </Card>

          {/* Human */}
          <Card tone="amber" className="lg:col-span-3">
            <p className="font-mono text-[0.68rem] tracking-[0.12em] text-gold-700 uppercase">Human oversight</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">Approval gates at every critical stage</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">
              Built-in decision points where humans review and approve before AI proceeds. Domain experts decide whether work is good enough to move forward.
            </p>
            <div aria-hidden className="mt-auto flex items-center gap-2 pt-6 font-mono text-[0.65rem] tracking-wider uppercase">
              <span className="rounded-xs border border-line-light bg-white px-2 py-1 text-slate-ink">AI</span>
              <span className="h-px flex-1 bg-gold/40" />
              <span className="rounded-xs border border-gold bg-gold/20 px-2 py-1 text-gold-700">Gate</span>
              <span className="h-px flex-1 bg-gold/40" />
              <span className="rounded-xs border border-line-light bg-white px-2 py-1 text-slate-ink">Ship</span>
            </div>
          </Card>

          {/* Enterprise */}
          <Card className="lg:col-span-4">
            <Label>Enterprise controls</Label>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">Role-based access, single sign-on and audit logs</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ul className="space-y-2.5 text-[0.9rem] text-slate-ink">
                {["Role-based access control", "Single sign-on", "Audit logs of what was generated, by which model, and who approved it"].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-electric-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M3 8.5l3 3 7-7" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="rounded-sm border border-line-light bg-ice p-3 font-mono text-[0.68rem] leading-6 text-slate-ink">
                <p className="mb-1 flex justify-between text-[0.6rem] tracking-[0.12em] uppercase">
                  <span>Audit trail</span>
                  <span>Sample</span>
                </p>
                <p>
                  14:02 · <span className="text-gold-700">gate:stories</span> · approved
                </p>
                <p>
                  13:47 · <span className="text-electric-700">gen:tests</span> · 42 cases
                </p>
                <p>
                  13:12 · <span className="text-ink">trace:REQ-118</span> → ST-204
                </p>
              </div>
            </div>
          </Card>

          {/* Delivery */}
          <Card className="lg:col-span-2">
            <Label>Delivery</Label>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">Production delivery</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">Pushed to GitHub and deployed through your existing CI/CD. No rewiring.</p>
            <p className="mt-auto flex items-center gap-2 pt-6 font-mono text-[0.7rem] text-[#1c7a4c]">
              <span aria-hidden className="h-2 w-2 rounded-full bg-teal" /> Shipped
            </p>
          </Card>
        </Stagger>
      </div>
    </section>
  );
}
