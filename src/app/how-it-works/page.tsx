import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AIHumanGovernance } from "@/components/sections/Governance";
import { ShiftTimeline } from "@/components/sections/Shift";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How It Works",
  description:
    "One pipeline, three stages: upload requirements, build with AI and human approval gates, and ship a complete, traceable repository through your existing CI/CD.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="One pipeline. Three stages. Total traceability."
        accent="Total traceability."
        description="Requirements go in. A complete, tested, deployable repository comes out — with expert approval at every critical gate and every line traceable back to the requirement that created it."
      >
        <Button earlyAccess magnetic size="lg">
          Get Early Access
        </Button>
        <Button href="/platform#product" variant="secondary" size="lg">
          Explore the product
        </Button>
      </PageHero>
      <HowItWorks index="01" />
      <AIHumanGovernance index="02" />
      <ShiftTimeline index="03" />
      <CTASection />
    </>
  );
}
