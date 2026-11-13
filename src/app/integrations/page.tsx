import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { IntegrationsNetwork } from "@/components/sections/Integrations";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Integrations",
  description:
    "YottaBuilder works with the tools your team already uses: Claude, GPT, Gemini and Llama; AWS, Azure, Google Cloud and on-premise; GitHub, GitLab, Jira, Linear, Slack and your CI/CD.",
  path: "/integrations",
});

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Ecosystem"
        title="Sits at the center of your engineering ecosystem."
        accent="engineering ecosystem."
        description="Model-agnostic. Cloud-agnostic. Stack-agnostic. Native integrations into modern development workflows — from source control to deployment."
      >
        <Button earlyAccess magnetic size="lg">
          Get Early Access
        </Button>
      </PageHero>
      <IntegrationsNetwork index="01" />
      <CTASection title="Keep your workflow. Add the pipeline." />
    </>
  );
}
