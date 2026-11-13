import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { ProblemComparison } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductDemo } from "@/components/sections/ProductDemo";
import { AIHumanGovernance } from "@/components/sections/Governance";
import { ShiftTimeline } from "@/components/sections/Shift";
import { IntegrationsNetwork } from "@/components/sections/Integrations";
import { EnterpriseGovernance } from "@/components/sections/EnterpriseGovernance";
import { WhyYottaBuilder } from "@/components/sections/WhyYottaBuilder";
import { CTASection } from "@/components/sections/CTASection";
import { pageMetadata } from "@/lib/seo";
import { DesignSwitcher } from "@/components/layout/DesignSwitcher";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "YottaBuilder — From Client Requirements to Production App",
    description:
      "AI-powered. Human-led. Production-ready. Transform meeting notes, RFPs and requirements into deployable, traceable software with YottaBuilder.",
    path: "/",
  }),
  title: { absolute: "YottaBuilder — From Client Requirements to Production App" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <ProblemComparison />
      <HowItWorks />
      <ProductDemo />
      <AIHumanGovernance />
      <ShiftTimeline />
      <IntegrationsNetwork showCards={false} />
      <EnterpriseGovernance />
      <WhyYottaBuilder />
      <CTASection />
      <DesignSwitcher />
    </>
  );
}
