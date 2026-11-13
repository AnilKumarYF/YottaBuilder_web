import type { Metadata } from "next";
import { HeroV2 } from "@/components/v2/HeroV2";
import { StackStrip } from "@/components/v2/StackStrip";
import { ProblemV2 } from "@/components/v2/ProblemV2";
import { PipelineChapters } from "@/components/v2/PipelineChapters";
import { GatesBand } from "@/components/v2/GatesBand";
import { PlatformBento } from "@/components/v2/PlatformBento";
import { FAQ } from "@/components/v2/FAQ";
import { ClosingV2 } from "@/components/v2/ClosingV2";
import { DesignSwitcher } from "@/components/layout/DesignSwitcher";

// Design B — review copy of the home page. Not indexed until it replaces "/".
export const metadata: Metadata = {
  title: "Home — Design B",
  robots: { index: false, follow: false },
};

export default function HomeV2Page() {
  return (
    <>
      <HeroV2 />
      <StackStrip />
      <ProblemV2 />
      <PipelineChapters />
      <GatesBand />
      <PlatformBento />
      <FAQ />
      <ClosingV2 />
      <DesignSwitcher />
    </>
  );
}
