"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "Which AI models does YottaBuilder support?",
    a: "YottaBuilder is model-agnostic. It works with Claude, GPT, Gemini, Llama or any LLM, and you can swap models anytime without rework.",
  },
  {
    q: "Where does the generated code go?",
    a: "A complete, buildable repository is pushed to GitHub or GitLab in a structured, production-ready layout with traceable commit messages. It deploys through your existing CI/CD — GitHub Actions, AWS CodePipeline, GitLab CI or Jenkins.",
  },
  {
    q: "Which clouds can we deploy to?",
    a: "AWS, Azure, Google Cloud or on-premise. Infrastructure-as-code is generated alongside the application code.",
  },
  {
    q: "Do humans stay in control?",
    a: "Yes. Multiple expert-led approval gates sit between your requirements and production code. At every gate a domain expert reviews and approves before AI proceeds.",
  },
  {
    q: "How is output traced back to requirements?",
    a: "Every function traces to a backlog item, and every block from requirement to test — so you can always see which requirement created which code.",
  },
  {
    q: "Does it work with our project management tools?",
    a: "Epics, features and stories sync bidirectionally with Jira or Linear, and Slack receives real-time notifications for generations, approval requests and deployments.",
  },
  {
    q: "Who is early access for?",
    a: "Early access is available for IT services teams and software consultancies first.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section aria-labelledby="v2-faq-title" className="relative bg-ice section-y">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="v2-faq-title" tone="light" index="05" eyebrow="FAQ" title="Questions, answered." />
        </div>
        <ul className="divide-y divide-line-light border-y border-line-light lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btn = `${id}-q${i}`;
            const panel = `${id}-a${i}`;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn("text-[1.05rem] font-medium tracking-[-0.01em] transition-colors sm:text-lg", isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink")}>{f.q}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                        isOpen ? "border-ink bg-ink text-white" : "border-line-light text-ink group-hover:border-ink/40",
                      )}
                    >
                      <span className="absolute h-[1.5px] w-3 bg-current" />
                      <span className={cn("absolute h-3 w-[1.5px] bg-current transition-transform duration-300", isOpen && "scale-y-0")} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panel}
                      role="region"
                      aria-labelledby={btn}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-slate-ink">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
