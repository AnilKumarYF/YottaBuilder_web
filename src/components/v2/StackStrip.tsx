import { Stagger, StaggerItem, RevealOnScroll } from "@/components/ui/Reveal";

const COLUMNS = [
  { label: "AI models", items: ["Claude", "GPT", "Gemini", "Llama", "Any LLM"] },
  { label: "Cloud", items: ["AWS", "Azure", "Google Cloud", "On-premise"] },
  { label: "Delivery", items: ["GitHub", "GitLab", "Jira", "Linear", "Slack"] },
  { label: "CI/CD", items: ["GitHub Actions", "AWS CodePipeline", "GitLab CI", "Jenkins"] },
];

/** Design B: a quiet ledger of the ecosystem instead of a marquee. */
export function StackStrip() {
  return (
    <section aria-labelledby="stack-v2-title" className="bg-ice pt-16 pb-20 sm:pt-20">
      <div className="container-x">
        <RevealOnScroll className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <h2 id="stack-v2-title" className="font-display text-[1.35rem] font-semibold tracking-[-0.03em] text-ink">
            Bring your own stack.
          </h2>
          <p className="text-sm text-slate-ink">Model-agnostic · Cloud-agnostic · Stack-agnostic</p>
        </RevealOnScroll>
        <Stagger className="mt-8 grid grid-cols-2 border-t border-l border-line-light lg:grid-cols-4">
          {COLUMNS.map((c) => (
            <StaggerItem key={c.label} className="border-r border-b border-line-light bg-white/60 p-5 sm:p-6">
              <p className="eyebrow text-slate-ink">{c.label}</p>
              <ul className="mt-5 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it} className="group flex items-center gap-2.5 text-[0.95rem] font-medium tracking-[-0.01em] text-ink/75 transition-colors duration-300 hover:text-ink">
                    <span aria-hidden className="h-px w-3 bg-line-light transition-all duration-300 group-hover:w-5 group-hover:bg-electric" />
                    {it}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-4 text-[0.75rem] text-slate-ink/80">Names refer to supported models, platforms and tools. No partnership or endorsement implied.</p>
      </div>
    </section>
  );
}
