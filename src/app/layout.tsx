import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { EarlyAccessProvider } from "@/components/layout/EarlyAccess";
import { SITE_URL, company } from "@/content/site";
import { JsonLd } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const description =
  "AI-powered. Human-led. Production-ready. YottaBuilder transforms meeting notes, RFPs and requirements into deployable, traceable software — on any model, any cloud, any stack.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "YottaBuilder — From Client Requirements to Production App", template: "%s · YottaBuilder" },
  description,
  applicationName: "YottaBuilder",
  authors: [{ name: company.legalName, url: company.parentUrl }],
  openGraph: { type: "website", siteName: "YottaBuilder", title: "YottaBuilder — From Client Requirements to Production App", description, url: SITE_URL, locale: "en_US" },
  twitter: { card: "summary_large_image", title: "YottaBuilder — From Client Requirements to Production App", description },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: company.legalName,
              url: company.parentUrl,
              logo: `${SITE_URL}/brand/yottaflex-icon-blue.png`,
              sameAs: company.social.map((s) => s.href),
              contactPoint: { "@type": "ContactPoint", telephone: company.phone, email: company.email, contactType: "customer support" },
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "YottaBuilder",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              url: SITE_URL,
              description,
              publisher: { "@type": "Organization", name: company.legalName },
            },
          ]}
        />
        <EarlyAccessProvider>
          <SmoothScroll />
          <ScrollProgress />
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </EarlyAccessProvider>
      </body>
    </html>
  );
}
