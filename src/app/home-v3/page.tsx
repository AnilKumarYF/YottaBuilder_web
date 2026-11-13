import type { Metadata } from "next";
import { HeroV3 } from "@/components/v3/HeroV3";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { ProblemComparison } from "@/components/sections/Problem";
import { MorphPipeline } from "@/components/v3/MorphPipeline";
import { ProductDemo } from "@/components/sections/ProductDemo";
import { GateSection } from "@/components/v3/GateSection";
import { OrbitEcosystem } from "@/components/v3/OrbitEcosystem";
import { EnterpriseGovernance } from "@/components/sections/EnterpriseGovernance";
import { WhyYottaBuilder } from "@/components/sections/WhyYottaBuilder";
import { CTASection } from "@/components/sections/CTASection";
import { DesignSwitcher } from "@/components/layout/DesignSwitcher";

// Design C — 3D / AI-themed review copy of the home page. Not indexed until it replaces "/".
export const metadata: Metadata = {
  title: "Home — Design C",
  robots: { index: false, follow: false },
};

export default function HomeV3Page() {
  return (
    <>
      <HeroV3 />
      <TechMarquee />
      <ProblemComparison />
      <MorphPipeline index="02" />
      <ProductDemo index="03" />
      <GateSection index="04" />
      <OrbitEcosystem index="05" />
      <EnterpriseGovernance index="06" />
      <WhyYottaBuilder index="07" />
      <CTASection />
      <DesignSwitcher />
    </>
  );
}
