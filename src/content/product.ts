/**
 * Product copy. Source: live yottabuilder.ai home page, tightened for clarity.
 * Capabilities listed here all appear on the live site.
 */

export const comparison = [
  {
    topic: "Requirements",
    without: { title: "Scattered across agile tools", body: "Disconnected AI tools with no shared context. No single source of truth anywhere." },
    with: { title: "Structured AI pipeline from day one", body: "Requirements flow through a structured pipeline, from raw input to validated context." },
  },
  {
    topic: "Operations",
    without: { title: "Locked to one model", body: "Switching AI costs months of rework. Zero visibility into what was generated." },
    with: { title: "Model-agnostic with a full audit trail", body: "Swap Claude, GPT or Llama anytime. A complete compliance trail is built in." },
  },
  {
    topic: "Generation",
    without: { title: "Prompt, copy, paste, pray", body: "Code snippets with no traceability to what was actually required." },
    with: { title: "Every block traces from requirement to test", body: "AI generates code with full lineage. Every function is traceable to a backlog item." },
  },
  {
    topic: "Quality",
    without: { title: "No human checkpoint", body: "AI errors cascade downstream. By the time you notice, three features are broken." },
    with: { title: "Human approval at every critical gate", body: "Built-in decision points where humans review and approve before AI proceeds." },
  },
  {
    topic: "Integration",
    without: { title: "Snippets ≠ a working codebase", body: "Isolated fragments that don’t form a buildable, deployable repository." },
    with: { title: "Full repository, not fragments", body: "Outputs a complete, buildable codebase with a proper file structure for GitHub." },
  },
  {
    topic: "Where this leads",
    without: { title: "Technical debt from day one", body: "A pile of disconnected AI outputs someone has to stitch together manually — if they even can." },
    with: { title: "Production-ready from the start", body: "A complete, auditable, deployable codebase. Built by AI, governed by humans, traceable end to end." },
  },
] as const;

export const pipelineSteps = ["Requirements", "Context", "Epics", "Stories", "Tests", "Tasks", "Code"] as const;

export const inputDocs = [
  { ext: "docx", name: "client-meeting-notes.docx", kind: "Meeting notes" },
  { ext: "pdf", name: "project-rfp-v3.pdf", kind: "RFP document" },
  { ext: "md", name: "architecture-decisions.md", kind: "Architecture spec" },
  { ext: "docx", name: "client-requirements.docx", kind: "Client requirements" },
  { ext: "pdf", name: "project-overview.pdf", kind: "Project documentation" },
] as const;

export const repoTree = [
  { path: "src/components/", note: "UI components" },
  { path: "src/services/", note: "Service layer" },
  { path: "tests/integration/", note: "Integration tests" },
  { path: "infra/terraform/", note: "Infrastructure as code" },
] as const;

export const governanceSteps = [
  { n: "01", title: "Requirements", body: "Your raw inputs — any format, any size." },
  { n: "02", title: "AI Generates", body: "Context → Epics → Stories → Tests → Tasks → Code." },
  { n: "03", title: "Human Reviews", body: "Multiple expert-led gates. Specialists validate every stage." },
  { n: "04", title: "Production", body: "Traceable, tested code shipped to your stack." },
] as const;

export const shiftStages = [
  { title: "Traditional development", body: "Disconnected tools, manual handoffs, no AI.", level: 0 },
  { title: "AI-assisted development", body: "AI snippets, no structure. No shared context.", level: 1 },
  { title: "Disconnected AI tools", body: "Copilot-assisted, but no pipeline holding it together.", level: 2 },
  { title: "Partially automated workflows", body: "Some automation, no traceability.", level: 3 },
  { title: "Structured AI development", body: "Structured backlog, manual code.", level: 4 },
  { title: "YottaBuilder", body: "Unified pipeline, AI + human, full traceability.", level: 5 },
] as const;

export type IntegrationGroup = { key: string; label: string; items: string[]; note: string };

export const integrationGroups: IntegrationGroup[] = [
  { key: "models", label: "AI Models", items: ["Claude", "GPT", "Gemini", "Llama"], note: "Model-agnostic — bring any LLM and swap anytime." },
  { key: "cloud", label: "Cloud", items: ["AWS", "Azure", "Google Cloud", "On-Premise"], note: "Infrastructure-as-code generated alongside application code." },
  { key: "dev", label: "Development", items: ["GitHub", "GitLab"], note: "Generated code pushed to your repo with a full PR workflow and traceable commits." },
  { key: "pm", label: "Project Management", items: ["Jira", "Linear"], note: "Epics, features and stories sync bidirectionally with your PM tool." },
  { key: "comms", label: "Communication", items: ["Slack"], note: "Real-time notifications for generations, approval requests and deployments." },
  { key: "cicd", label: "CI/CD", items: ["GitHub Actions", "AWS CodePipeline", "GitLab CI", "Jenkins"], note: "Code arrives deployment-ready with test coverage built in." },
];

export const integrationCards = [
  { title: "GitHub / GitLab", body: "Generated code pushed directly to your repo in a structured, production-ready layout. Full PR workflow with traceable commit messages." },
  { title: "CI/CD Pipelines", body: "Native hooks for GitHub Actions, AWS CodePipeline, GitLab CI and Jenkins. Code arrives deployment-ready with test coverage built in." },
  { title: "Jira / Linear", body: "Epics, features and stories sync bidirectionally with your PM tool. Your backlog is always up to date." },
  { title: "AWS / Azure / GCP", body: "Infrastructure-as-code generated alongside application code. Deploy to any cloud with the right IaC tool for your team." },
  { title: "Slack", body: "Real-time notifications for generation completions, approval requests and deployment events in your team channels." },
  { title: "More coming", body: "Confluence, Notion, Figma, Azure DevOps, Bitbucket and more. API-first design means custom integrations are always possible." },
] as const;

export const toolchain = [
  "Node.js · Python · Go · Java",
  "React · Vue · Angular · Next.js",
  "PostgreSQL · DynamoDB · MongoDB",
  "Docker · Kubernetes · Lambda",
  "Terraform · CDK · Pulumi",
] as const;

export const marqueeItems = [
  { name: "Claude", cat: "Model" },
  { name: "GPT", cat: "Model" },
  { name: "Gemini", cat: "Model" },
  { name: "Llama", cat: "Model" },
  { name: "GitHub", cat: "Source" },
  { name: "GitLab", cat: "Source" },
  { name: "Jira", cat: "PM" },
  { name: "Linear", cat: "PM" },
  { name: "AWS", cat: "Cloud" },
  { name: "Azure", cat: "Cloud" },
  { name: "Google Cloud", cat: "Cloud" },
] as const;

export const enterpriseControls = [
  { key: "rbac", title: "Role-based access control", body: "Role-based access for enterprise teams, so the right people own the right decisions." },
  { key: "sso", title: "Single sign-on", body: "Single sign-on for enterprise teams." },
  { key: "audit", title: "Audit logs", body: "A complete compliance trail of what was generated, by which model, and who approved it." },
  { key: "gates", title: "Approval gates", body: "Built-in decision points where humans review and approve before AI proceeds." },
  { key: "trace", title: "Requirement traceability", body: "Every function traces to a backlog item, and every block from requirement to test." },
  { key: "oversight", title: "Human oversight", body: "Domain experts decide whether work is good enough to move forward — at every gate." },
] as const;

export const whyFeatures = [
  { key: "model", title: "Model Agnostic", body: "Claude, GPT, Gemini, Llama or any LLM. Switch without rework." },
  { key: "cloud", title: "Cloud Agnostic", body: "AWS, Azure, Google Cloud or on-premise — deploy where you already run." },
  { key: "stack", title: "Stack Agnostic", body: "Node.js, Python, Go, Java, React, Vue, Angular and the infra you prefer." },
  { key: "repo", title: "Complete Repository Generation", body: "A buildable codebase with proper structure — not isolated fragments." },
  { key: "trace", title: "Requirement Traceability", body: "Every function maps back to the backlog item and requirement that created it." },
  { key: "human", title: "Human Approval", body: "Expert-led gates between every critical stage. AI never ships unreviewed." },
  { key: "tests", title: "Automated Testing", body: "Tests are generated before code, so coverage is built in from the start." },
  { key: "ship", title: "Production Delivery", body: "Pushed to GitHub and deployed through your existing CI/CD. No rewiring." },
] as const;
