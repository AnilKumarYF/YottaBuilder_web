import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem, RevealOnScroll } from "@/components/ui/Reveal";
import { getPosts } from "@/lib/wp";
import { company } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Find your shortest path to impact. Join the YottaFlex.ai team building YottaBuilder — open roles in engineering, product and operations, based in Hyderabad.",
  path: "/careers",
});

const perks = [
  { title: "Outsized Impact", body: "Small team, big product. Your contributions ship directly to production and shape real workflows for real development teams." },
  { title: "Hyderabad HQ", body: "Based out of our Hyderabad office. Work alongside the core team every day — great energy, fast decisions, in-person collaboration." },
  { title: "AI Environment", body: "We use YottaBuilder to build YottaBuilder. You’ll work with cutting-edge AI tools every single day — not as novelties." },
  { title: "Equity & Growth", body: "Competitive compensation with meaningful equity. We’re early — the people who join now will have the most to gain as we grow." },
  { title: "Learn Constantly", body: "Conference budget, learning stipend, and a team that reads, debates and experiments with new ideas every week." },
  { title: "True Ownership", body: "Bring bold ideas, question old approaches, experiment freely, and move fast to turn concepts into real, measurable results." },
];

export default async function CareersPage() {
  const jobs = await getPosts("job");

  return (
    <>
      <PageHero
        eyebrow="Careers at YottaFlex.ai"
        title="Find your shortest path to impact."
        accent="path to impact."
        description="Your career isn’t a ladder, it’s a graph. We help you navigate the fastest route from where you are to where you want to be — through real projects, real ownership and real growth."
      >
        <Button href="#open-roles" size="lg" magnetic>
          View open roles
        </Button>
        <Button href="/about-us" variant="secondary" size="lg">
          Learn about us
        </Button>
      </PageHero>

      <section aria-labelledby="why-title" className="relative bg-white section-y">
        <div className="container-x">
          <SectionHeading
            id="why-title"
            tone="light"
            index="01"
            eyebrow="Why YottaFlex.ai"
            title="Work at the frontier."
            description="You won’t just use AI — you’ll shape how the entire industry uses it to build software."
          />
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-md border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <StaggerItem key={p.title} as="article" className="group relative bg-white p-7 transition-colors duration-500 hover:bg-ice sm:p-8">
                <span aria-hidden className="absolute top-0 left-0 h-[2px] w-0 bg-electric transition-all duration-700 ease-out-expo group-hover:w-full" />
                <p className="font-mono text-xs text-brand">0{i + 1}</p>
                <h3 className="mt-6 font-display text-xl font-bold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-ink">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="open-roles" aria-labelledby="roles-title" className="relative scroll-mt-24 bg-ice section-y">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="roles-title"
              tone="light"
              index="02"
              eyebrow="Open roles"
              title="Current openings."
              description="We’re hiring across engineering, product and go-to-market. All roles are work from office in Hyderabad."
            />
            {jobs && <p className="font-mono text-sm text-slate-ink">{jobs.length} open {jobs.length === 1 ? "role" : "roles"}</p>}
          </div>

          {jobs && jobs.length > 0 ? (
            <ul className="mt-12 divide-y divide-line-light overflow-hidden rounded-md border border-line-light bg-white">
              {jobs.map((j, i) => (
                <RevealOnScroll as="li" key={j.slug} delay={Math.min(i, 6) * 0.04} y={14}>
                  <Link
                    href={`/${j.slug}`}
                    className="group grid gap-3 p-6 transition-colors duration-300 hover:bg-midnight focus-visible:bg-midnight sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-8"
                  >
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-ink transition-colors group-hover:text-white group-focus-visible:text-white sm:text-xl">
                        {j.title}
                      </h3>
                      {j.excerpt && (
                        <p className="mt-2 line-clamp-2 max-w-3xl text-[0.95rem] text-slate-ink transition-colors group-hover:text-steel group-focus-visible:text-steel">
                          {j.excerpt}
                        </p>
                      )}
                      <p className="mt-3 font-mono text-xs text-brand transition-colors group-hover:text-electric-300">Hyderabad · Work from office</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors group-hover:text-white">
                      View job
                      <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                        <path d="M2 8h11M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </Link>
                </RevealOnScroll>
              ))}
            </ul>
          ) : (
            <div className="mt-12 rounded-md border border-line-light bg-white p-8">
              <p className="font-display text-lg font-bold text-ink">{jobs ? "No open roles right now." : "We couldn’t load open roles right now."}</p>
              <p className="mt-2 text-slate-ink">
                Reach out directly at{" "}
                <a href={`mailto:${company.email}`} className="font-semibold text-brand underline underline-offset-4">
                  {company.email}
                </a>{" "}
                — we read every message.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        eyebrow="Let’s build the future together"
        title="Apply for a role or reach out directly."
        body="We read every message."
        secondary={{ label: "Learn about us", href: "/about-us" }}
      />
    </>
  );
}
