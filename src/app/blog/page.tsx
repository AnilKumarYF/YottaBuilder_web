import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { getPosts } from "@/lib/wp";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Where ideas compound. Articles on AI, automation, data engineering and modern software delivery from the YottaFlex.ai team.",
  path: "/blog",
});

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default async function BlogPage() {
  const posts = await getPosts("blog");
  const [feature, ...rest] = posts ?? [];

  return (
    <>
      <PageHero eyebrow="Blog" title="Where ideas compound." accent="ideas compound." description="Perspectives on AI, automation, data and software delivery from the team building YottaBuilder." compact />

      <section aria-labelledby="latest-title" className="bg-white section-y">
        <div className="container-x">
          <h2 id="latest-title" className="eyebrow text-brand">
            <span className="text-ink/40">01</span> &nbsp;—&nbsp; Latest articles
          </h2>

          {!posts || posts.length === 0 ? (
            <p className="mt-10 rounded-md border border-line-light bg-ice p-8 text-slate-ink">
              {posts ? "No articles yet — check back soon." : "We couldn’t load articles right now. Please try again shortly."}
            </p>
          ) : (
            <>
              {feature && (
                <RevealOnScroll className="mt-10">
                  <Link href={`/${feature.slug}`} className="group grid overflow-hidden rounded-md border border-line-light bg-ice lg:grid-cols-2">
                    <div className="relative aspect-[16/9] overflow-hidden bg-midnight lg:aspect-auto lg:min-h-[22rem]">
                      {feature.image && (
                        <Image
                          src={feature.image.src}
                          alt={feature.image.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                          priority
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-7 sm:p-10">
                      <p className="font-mono text-xs text-slate-ink">
                        <time dateTime={feature.date}>{fmt(feature.date)}</time> · Featured
                      </p>
                      <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.02em] text-balance text-ink sm:text-3xl">{feature.title}</h3>
                      {feature.excerpt && <p className="mt-4 line-clamp-3 leading-relaxed text-slate-ink">{feature.excerpt}</p>}
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        Read article
                        <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                          <path d="M2 8h11M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </RevealOnScroll>
              )}

              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <RevealOnScroll as="li" key={p.slug} delay={(i % 3) * 0.06}>
                    <Link href={`/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-md border border-line-light bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(18_20_23/0.35)]">
                      <div className={cn("relative aspect-[16/9] overflow-hidden", !p.image && "bg-midnight bg-iso-grid")}>
                        {p.image && (
                          <Image
                            src={p.image.src}
                            alt={p.image.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="font-mono text-xs text-slate-ink">
                          <time dateTime={p.date}>{fmt(p.date)}</time>
                        </p>
                        <h3 className="mt-3 font-display text-lg leading-snug font-bold tracking-[-0.015em] text-ink transition-colors group-hover:text-brand">{p.title}</h3>
                        {p.excerpt && <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-slate-ink">{p.excerpt}</p>}
                        <span className="mt-auto pt-5 text-sm font-semibold text-brand">Read more</span>
                      </div>
                    </Link>
                  </RevealOnScroll>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <CTASection title="Ready to stop reading and start building?" />
    </>
  );
}
