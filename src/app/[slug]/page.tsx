import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { Button } from "@/components/ui/Button";
import { getPost, getPosts } from "@/lib/wp";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL, company } from "@/content/site";

/**
 * Blog posts and job openings keep their original WordPress URLs (yottabuilder.ai/<slug>/).
 */
export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const [blog, jobs] = await Promise.all([getPosts("blog"), getPosts("job")]);
  return [...(blog ?? []), ...(jobs ?? [])].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  const description = post.excerpt.slice(0, 158) || (post.kind === "job" ? `${post.title} — open role at YottaFlex.ai, Hyderabad.` : post.title);
  return pageMetadata({
    title: post.kind === "job" ? `${post.title} — Careers` : post.title,
    description,
    path: `/${post.slug}`,
    image: post.image?.src,
  });
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const isJob = post.kind === "job";

  return (
    <>
      {isJob ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: post.title,
            description: post.html ?? post.excerpt,
            datePosted: post.date,
            employmentType: "FULL_TIME",
            hiringOrganization: { "@type": "Organization", name: company.legalName, sameAs: company.parentUrl },
            jobLocation: {
              "@type": "Place",
              address: { "@type": "PostalAddress", streetAddress: "The Business Park, Kondapur", addressLocality: "Hyderabad", postalCode: "500084", addressCountry: "IN" },
            },
          }}
        />
      ) : (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            dateModified: post.modified,
            image: post.image?.src,
            mainEntityOfPage: `${SITE_URL}/${post.slug}`,
            publisher: { "@type": "Organization", name: company.legalName },
          }}
        />
      )}

      <PageHero eyebrow={isJob ? "Open role · Hyderabad · Work from office" : `Blog · ${fmt(post.date)}`} title={post.title} compact>
        {isJob ? (
          <>
            <Button href="#apply" size="lg" magnetic>
              Apply now
            </Button>
            <Button href="/careers#open-roles" variant="secondary" size="lg">
              All open roles
            </Button>
          </>
        ) : (
          <Button href="/blog" variant="secondary" size="md">
            All articles
          </Button>
        )}
      </PageHero>

      <article className="bg-white section-y">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            {!isJob && post.image && (
              <div className="relative -mt-[calc(var(--section-y)*0.4)] mb-12 aspect-[16/9] overflow-hidden rounded-md shadow-[0_40px_80px_-40px_rgb(18_20_23/0.45)]">
                <Image src={post.image.src} alt={post.image.alt} fill priority sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
              </div>
            )}
            {post.html ? (
              <div className="prose-yb" dangerouslySetInnerHTML={{ __html: post.html }} />
            ) : (
              <p className="text-slate-ink">{post.excerpt}</p>
            )}

            {isJob ? (
              <section id="apply" aria-labelledby="apply-title" className="mt-16 scroll-mt-28 rounded-md border border-line-light bg-ice p-6 sm:p-10">
                <p className="eyebrow text-electric-700">Apply</p>
                <h2 id="apply-title" className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
                  Apply for {post.title}
                </h2>
                <p className="mt-2 mb-8 text-slate-ink">All roles are work from office in Hyderabad.</p>
                <ApplyForm role={post.title} slug={post.slug} />
              </section>
            ) : (
              <div className="mt-16 flex items-center justify-between border-t border-line-light pt-8">
                <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
                  ← Back to all articles
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>

      {!isJob && <CTASection title="Ready to stop reading and start building?" />}
    </>
  );
}
