import Link from "next/link";
import { company, nav, platformLinks } from "@/content/site";
import { Logo, YottaFlexMark } from "@/components/ui/Logo";

function SocialIcon({ label }: { label: string }) {
  const p = { viewBox: "0 0 24 24", className: "h-[18px] w-[18px]", fill: "currentColor", "aria-hidden": true } as const;
  if (label === "LinkedIn")
    return (
      <svg {...p}>
        <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z" />
      </svg>
    );
  if (label === "Facebook")
    return (
      <svg {...p}>
        <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0014.3 4.3c-2.3 0-3.8 1.4-3.8 3.95v2.25H8v3h2.5V21z" />
      </svg>
    );
  return (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-abyss text-steel" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-50 mask-fade-b" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />

      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{company.description}</p>
            <a href={company.parentUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 text-xs text-steel/80 transition-colors hover:text-white">
              <span className="eyebrow text-[0.65rem]">A product of</span>
              <YottaFlexMark />
            </a>
          </div>

          <nav aria-label="Footer — company" className="lg:col-span-2">
            <p className="eyebrow text-white/90">Company</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — platform" className="lg:col-span-2">
            <p className="eyebrow text-white/90">Platform</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              {platformLinks.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/early-access" className="text-electric-300 transition-colors hover:text-electric">
                  Get Early Access
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="eyebrow text-white/90">Contact</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              <li>
                <a href={company.phoneHref} className="transition-colors hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-white">
                  {company.email}
                </a>
              </li>
            </ul>
            <ul className="mt-6 grid gap-4 text-[0.82rem] leading-relaxed sm:grid-cols-2">
              {company.addresses.map((a) => (
                <li key={a.city}>
                  <span className="block font-medium text-white/85">{a.city}</span>
                  <address className="not-italic text-steel/80">{a.lines}</address>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-line-dark pt-8 text-[0.82rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {year} {company.legalName} All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={company.privacyUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <ul className="flex items-center gap-1" aria-label="Social media">
              {company.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YottaFlex on ${s.label}`}
                    className="grid h-10 w-10 place-items-center rounded-sm text-steel transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <SocialIcon label={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
