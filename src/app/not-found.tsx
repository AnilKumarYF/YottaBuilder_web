import Link from "next/link";
import { nav } from "@/content/site";

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative flex min-h-[80svh] items-center overflow-hidden bg-abyss pt-[var(--nav-h)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-70 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/40 blur-[120px]" />
      <div className="container-x relative py-24">
        <p className="font-mono text-sm text-electric-300">404 · requirement not found</p>
        <h1 id="nf-title" className="display-xl mt-5 max-w-3xl text-white">
          This page isn’t in the backlog.
        </h1>
        <p className="lede mt-6 max-w-xl text-steel">The page you’re looking for may have moved. Try one of these instead.</p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="inline-flex h-11 items-center rounded-sm border border-white/15 px-4 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
