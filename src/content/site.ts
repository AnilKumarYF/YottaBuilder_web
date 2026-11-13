/**
 * Verified business facts, taken from the live yottabuilder.ai site (Nov 2026).
 * Do not add claims here that are not on the live site or supplied by YottaFlex.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yottabuilder.ai").replace(/\/$/, "");

export const company = {
  product: "YottaBuilder",
  legalName: "YottaFlex.ai Inc.",
  parent: "YottaFlex.ai",
  parentUrl: "https://yottaflex.ai",
  tagline: "From Client Requirements to Production App.",
  description:
    "YottaBuilder, Yottaflex.ai’s flagship product, stems from the conviction that AI must augment human expertise, acting as a vital catalyst for potential rather than a replacement.",
  phone: "+1 (804)-781-7090",
  phoneHref: "tel:+18047817090",
  email: "careers@yottaflex.ai",
  addresses: [
    { city: "Glen Allen, USA", lines: "4101 Cox Rd, Suite 340, Glen Allen, VA 23060" },
    { city: "Toronto, Canada", lines: "Suite 670-3300 Bloor Street West, Toronto, Ontario, M8X 2X2" },
    { city: "Hyderabad, India", lines: "The Business Park, Kondapur, Hyderabad, India 500084" },
    { city: "Medellín, Colombia", lines: "Cra 39 #5a-95, Ofc# 709 Edificio Avantgarde, Medellín, Colombia 050021" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/yotta-tech-ports/" },
    { label: "Facebook", href: "https://www.facebook.com/yottatechports" },
    { label: "Instagram", href: "https://www.instagram.com/yottatechports" },
  ],
  privacyUrl: "https://yottaflex.ai/privacy-policy/",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
] as const;

export const platformLinks = [
  { label: "Platform overview", href: "/platform" },
  { label: "Product walkthrough", href: "/platform#product" },
  { label: "AI + human governance", href: "/platform#governance" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Integrations", href: "/integrations" },
] as const;

/** Live-site stats (counter targets read from the Elementor markup). */
export const stats = [
  { value: 6, suffix: "", label: "Pipeline stages, input to code" },
  { value: 20, suffix: "+", label: "AI touchpoints with human oversight" },
  { value: 100, suffix: "%", label: "Traceability to requirements" },
] as const;
