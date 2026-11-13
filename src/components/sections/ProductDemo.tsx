"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------------------
   Illustrative sample data only — every value below is fictional.
   -------------------------------------------------------------------------- */

const TABS = [
  { key: "dashboard", label: "Dashboard", glyph: "◇" },
  { key: "requirements", label: "Requirements", glyph: "01" },
  { key: "context", label: "Context", glyph: "02" },
  { key: "epics", label: "Epics", glyph: "03" },
  { key: "stories", label: "Stories", glyph: "04" },
  { key: "tests", label: "Tests", glyph: "05" },
  { key: "code", label: "Code", glyph: "06" },
  { key: "review", label: "Review", glyph: "07" },
  { key: "deploy", label: "Deploy", glyph: "08" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function Tag({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "gold" | "teal" | "muted" }) {
  const t = {
    blue: "border-electric/35 bg-electric/10 text-electric-300",
    gold: "border-gold/40 bg-gold/10 text-gold-300",
    teal: "border-teal/35 bg-teal/10 text-teal-300",
    muted: "border-line-dark bg-white/[0.03] text-steel",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-xs border px-1.5 py-0.5 font-mono text-[0.62rem] tracking-wide uppercase", t)}>{children}</span>;
}

function PanelTitle({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h4 className="font-display text-[1.05rem] font-bold tracking-[-0.01em] text-white">{title}</h4>
      {meta}
    </div>
  );
}

function Dashboard() {
  const cards = [
    { k: "Requirements", v: "3 files", tone: "blue" as const },
    { k: "Epics", v: "6", tone: "blue" as const },
    { k: "Stories", v: "24", tone: "blue" as const },
    { k: "Test cases", v: "68", tone: "blue" as const },
    { k: "Approval gates", v: "4 / 5", tone: "gold" as const },
    { k: "Deploy", v: "Staging", tone: "teal" as const },
  ];
  return (
    <div>
      <PanelTitle title="Project overview" meta={<Tag tone="muted">sample data</Tag>} />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-sm border border-line-dark bg-white/[0.03] p-3"
          >
            <p className="font-mono text-[0.62rem] tracking-wider text-steel uppercase">{c.k}</p>
            <p className={cn("mt-1.5 font-display text-xl font-bold", c.tone === "gold" ? "text-gold-300" : c.tone === "teal" ? "text-teal-300" : "text-white")}>{c.v}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-sm border border-line-dark bg-white/[0.02] p-3">
        <div className="flex items-center justify-between font-mono text-[0.66rem] text-steel">
          <span>Pipeline progress</span>
          <span>Stage 7 of 8</span>
        </div>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
              className={cn("h-1.5 flex-1 origin-left rounded-full", i < 6 ? "bg-electric" : i === 6 ? "bg-gold" : "bg-white/10")}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-steel">
          Waiting on <span className="text-gold-300">human review</span> before code is merged.
        </p>
      </div>
    </div>
  );
}

function Requirements() {
  const files = [
    { ext: "docx", name: "kickoff-meeting-notes.docx", size: "48 KB", p: 100 },
    { ext: "pdf", name: "claims-portal-rfp.pdf", size: "2.1 MB", p: 100 },
    { ext: "md", name: "architecture-decisions.md", size: "12 KB", p: 72 },
  ];
  return (
    <div>
      <PanelTitle title="Uploaded requirements" meta={<Tag>3 sources</Tag>} />
      <ul className="space-y-2.5">
        {files.map((f, i) => (
          <li key={f.name} className="rounded-sm border border-line-dark bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-11 shrink-0 place-items-center rounded-xs border border-electric/30 bg-electric/10 font-mono text-[0.62rem] text-electric-300 uppercase">{f.ext}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[0.78rem] text-white/90">{f.name}</span>
                <span className="block text-[0.7rem] text-steel">{f.size}</span>
              </span>
              {f.p === 100 ? <Tag tone="teal">parsed</Tag> : <Tag>parsing</Tag>}
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-electric to-electric-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: f.p / 100 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 rounded-sm border border-dashed border-white/15 px-3 py-4 text-center text-[0.78rem] text-steel">Drop meeting notes, RFPs or specs — any format</div>
    </div>
  );
}

function Context() {
  const groups = [
    { k: "Actors", items: ["Policyholder", "Claims adjuster", "Supervisor"] },
    { k: "Domain entities", items: ["Claim", "Policy", "Document", "Payout"] },
    { k: "Constraints", items: ["Audit every status change", "Role-based access", "Upload ≤ 25 MB"] },
    { k: "Integrations", items: ["Identity provider", "Document storage", "Notifications"] },
  ];
  let n = 0;
  return (
    <div>
      <PanelTitle title="Extracted project context" meta={<Tag>unified</Tag>} />
      <div className="space-y-3.5">
        {groups.map((g) => (
          <div key={g.k}>
            <p className="font-mono text-[0.62rem] tracking-wider text-steel uppercase">{g.k}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <motion.span
                  key={it}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * n++ }}
                  className="rounded-xs border border-electric/25 bg-electric/[0.08] px-2 py-1 text-[0.75rem] text-white/90"
                >
                  {it}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Epics() {
  const epics = [
    { id: "EP-01", t: "Claim submission", s: 5, src: "REQ-003, REQ-004" },
    { id: "EP-02", t: "Document management", s: 4, src: "REQ-007" },
    { id: "EP-03", t: "Adjuster review workflow", s: 6, src: "REQ-011 – REQ-014" },
    { id: "EP-04", t: "Notifications", s: 3, src: "REQ-019" },
    { id: "EP-05", t: "Access control & audit", s: 4, src: "REQ-021" },
    { id: "EP-06", t: "Reporting", s: 2, src: "REQ-025" },
  ];
  return (
    <div>
      <PanelTitle title="Generated epics" meta={<Tag tone="teal">gate 1 approved</Tag>} />
      <ul className="divide-y divide-line-dark rounded-sm border border-line-dark">
        {epics.map((e, i) => (
          <motion.li key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-3 py-2.5">
            <span className="font-mono text-[0.7rem] text-electric-300">{e.id}</span>
            <span className="flex-1 text-[0.85rem] text-white/90">{e.t}</span>
            <span className="hidden font-mono text-[0.62rem] text-steel/80 sm:inline">{e.src}</span>
            <span className="font-mono text-[0.68rem] text-steel">{e.s} stories</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Stories() {
  return (
    <div>
      <PanelTitle title="ST-07 · Adjuster approves claim" meta={<div className="flex gap-1.5"><Tag>EP-03</Tag><Tag tone="muted">REQ-014</Tag></div>} />
      <div className="rounded-sm border border-line-dark bg-white/[0.03] p-4 text-[0.88rem] leading-relaxed text-white/90">
        <p>
          <span className="text-steel">As a</span> claims adjuster, <span className="text-steel">I want</span> to approve or reject a submitted claim with a reason,{" "}
          <span className="text-steel">so that</span> the policyholder is notified and every decision is auditable.
        </p>
      </div>
      <p className="mt-4 font-mono text-[0.62rem] tracking-wider text-steel uppercase">Acceptance criteria</p>
      <ul className="mt-2 space-y-2">
        {[
          "Only users with the Adjuster role can change a claim’s status.",
          "A rejection requires a reason of at least 10 characters.",
          "Status changes are written to the audit log with actor and timestamp.",
          "The policyholder receives a notification within the same transaction.",
        ].map((c, i) => (
          <motion.li key={c} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="flex gap-2.5 text-[0.82rem] text-steel">
            <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-electric" />
            {c}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Tests() {
  const tests = [
    { id: "TC-031", g: "a claim in “Submitted” state", w: "an Adjuster approves it", t: "status becomes “Approved” and an audit entry is created" },
    { id: "TC-032", g: "a user without the Adjuster role", w: "they attempt to approve", t: "the request is rejected with 403" },
    { id: "TC-033", g: "a rejection with a 4-character reason", w: "it is submitted", t: "validation fails with a helpful message" },
  ];
  return (
    <div>
      <PanelTitle title="Test cases · ST-07" meta={<Tag>written before code</Tag>} />
      <ul className="space-y-2.5">
        {tests.map((t, i) => (
          <motion.li key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-sm border border-line-dark bg-white/[0.03] p-3 font-mono text-[0.72rem] leading-relaxed">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-electric-300">{t.id}</span>
              <Tag tone="teal">passing</Tag>
            </div>
            <p className="text-steel">
              <span className="text-gold-300">Given</span> {t.g}
            </p>
            <p className="text-steel">
              <span className="text-gold-300">When</span> {t.w}
            </p>
            <p className="text-steel">
              <span className="text-gold-300">Then</span> {t.t}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

type Seg = [cls: string, text: string];
const K = "text-[#c792ea]";
const F = "text-[#7fe6e8]";
const S = "text-[#c3e88d]";
const T = "text-teal-300";
const C = "text-steel/60 italic";
const P = "text-white/85";
const CODE: { trace?: string; segs: Seg[] }[] = [
  { trace: "REQ-014 → ST-07", segs: [[C, "// Generated for ST-07 · Adjuster approves claim"]] },
  { segs: [[K, "export async function "], [F, "approveClaim"], [P, "(ctx: "], [T, "AuthContext"], [P, ", id: "], [T, "string"], [P, ") {"]] },
  { trace: "AC-1", segs: [[P, "  "], [F, "requireRole"], [P, "(ctx, "], [S, '"adjuster"'], [P, ");"]] },
  { segs: [[P, "  "], [K, "const "], [P, "claim = "], [K, "await "], [P, "claims."], [F, "get"], [P, "(id);"]] },
  { segs: [[P, "  "], [K, "if "], [P, "(claim.status !== "], [S, '"submitted"'], [P, ") "], [K, "throw new "], [T, "InvalidState"], [P, "();"]] },
  { trace: "AC-3", segs: [[P, "  "], [K, "await "], [P, "audit."], [F, "record"], [P, "({ actor: ctx.user, action: "], [S, '"approve"'], [P, ", id });"]] },
  { trace: "AC-4", segs: [[P, "  "], [K, "await "], [P, "notify."], [F, "policyholder"], [P, "(claim, "], [S, '"approved"'], [P, ");"]] },
  { segs: [[P, "  "], [K, "return "], [P, "claims."], [F, "update"], [P, "(id, { status: "], [S, '"approved"'], [P, " });"]] },
  { segs: [[P, "}"]] },
];

function Code() {
  return (
    <div>
      <PanelTitle title="src/services/claims/approve.ts" meta={<Tag>traceable</Tag>} />
      <div className="overflow-x-auto rounded-sm border border-line-dark bg-abyss/80 py-3" tabIndex={0} aria-label="Sample generated code">
        <pre className="min-w-max font-mono text-[0.72rem] leading-[1.75]">
          {CODE.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex">
              <span className="w-8 shrink-0 pr-3 text-right text-steel/40 select-none">{i + 1}</span>
              <code className="flex-1 pr-4">
                {line.segs.map(([c, t], j) => (
                  <span key={j} className={c}>
                    {t}
                  </span>
                ))}
              </code>
              <span className="w-28 shrink-0 pr-3 text-right">{line.trace && <span className="rounded-xs bg-electric/15 px-1.5 py-0.5 text-[0.6rem] text-electric-300">{line.trace}</span>}</span>
            </motion.div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function Review() {
  const reviewers = [
    { i: "AR", role: "Solution architect", s: "approved" },
    { i: "MK", role: "QA lead", s: "approved" },
    { i: "SN", role: "Domain expert", s: "pending" },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-sm border border-gold/40 bg-gold/[0.08] px-3 py-2.5">
        <span aria-hidden className="h-3 w-3 shrink-0 rotate-45 border border-gold bg-gold/40 shadow-[0_0_14px_rgb(232_163_61/0.7)]" />
        <span className="flex-1 text-[0.85rem] font-medium text-gold-300">Approval required · Gate 5 — code review</span>
        <Tag tone="gold">human</Tag>
      </div>
      <ul className="space-y-2">
        {reviewers.map((r) => (
          <li key={r.i} className="flex items-center gap-3 rounded-sm border border-line-dark bg-white/[0.03] px-3 py-2.5">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-brand font-mono text-[0.68rem] font-medium text-white ring-1 ring-white/15">
              {r.i}
            </span>
            <span className="flex-1 text-[0.82rem] text-white/90">{r.role}</span>
            {r.s === "approved" ? <Tag tone="teal">approved</Tag> : <Tag tone="gold">reviewing</Tag>}
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-sm border border-line-dark bg-white/[0.02] p-3 text-[0.78rem] text-steel">
        <p>
          <span className="text-white/90">ST-07</span> · 1 file changed · 3 tests added · traced to <span className="text-electric-300">REQ-014</span>
        </p>
      </div>
      {/* Visual-only controls in the illustration — not interactive */}
      <div aria-hidden className="mt-4 flex gap-2">
        <span className="inline-flex h-8 items-center rounded-xs bg-teal/20 px-3 font-mono text-[0.68rem] text-teal-300 ring-1 ring-teal/40">Approve</span>
        <span className="inline-flex h-8 items-center rounded-xs px-3 font-mono text-[0.68rem] text-steel ring-1 ring-white/15">Request changes</span>
      </div>
    </div>
  );
}

function Deploy() {
  const steps = [
    { k: "Build", s: "done" },
    { k: "Unit & integration tests", s: "done" },
    { k: "Infrastructure (Terraform)", s: "done" },
    { k: "Deploy to staging", s: "done" },
    { k: "Production release", s: "awaiting approval" },
  ];
  return (
    <div>
      <PanelTitle title="Deployment · your CI/CD" meta={<Tag tone="muted">commit a3f8c21</Tag>} />
      <ol className="relative space-y-2.5">
        {steps.map((s, i) => {
          const done = s.s === "done";
          return (
            <motion.li key={s.k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 rounded-sm border border-line-dark bg-white/[0.03] px-3 py-2.5">
              <span
                aria-hidden
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full border",
                  done ? "border-teal/50 bg-teal/15 text-teal-300" : "border-gold/50 bg-gold/10 text-gold-300",
                )}
              >
                {done ? (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />
                  </svg>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-soft" />
                )}
              </span>
              <span className="flex-1 text-[0.84rem] text-white/90">{s.k}</span>
              <span className={cn("font-mono text-[0.64rem] tracking-wider uppercase", done ? "text-teal-300" : "text-gold-300")}>{s.s}</span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

const PANELS: Record<TabKey, () => ReactNode> = {
  dashboard: Dashboard,
  requirements: Requirements,
  context: Context,
  epics: Epics,
  stories: Stories,
  tests: Tests,
  code: Code,
  review: Review,
  deploy: Deploy,
};

export function ProductDemo({ index = "03", id = "product" }: { index?: string; id?: string }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [userTook, setUserTook] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const winRef = useRef<HTMLDivElement>(null);
  const inView = useInView(winRef, { amount: 0.4 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (reduce || userTook || paused || !inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % TABS.length), 4200);
    return () => clearInterval(t);
  }, [reduce, userTook, paused, inView]);

  // Keep the active tab visible in the horizontally scrolling strip (mobile) without moving the page.
  useEffect(() => {
    const el = tabRefs.current[active];
    const strip = el?.parentElement;
    if (!el || !strip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const select = useCallback((i: number, focus = false) => {
    setUserTook(true);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = TABS.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  };

  const tab = TABS[active];
  const Panel = PANELS[tab.key];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative overflow-x-clip bg-ice section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid-light opacity-70 mask-fade-b" />
      <div className="container-x relative">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <SectionHeading
            id={`${id}-title`}
            tone="light"
            index={index}
            eyebrow="Inside the platform"
            title="One workspace from requirement to release."
            description="An illustrative walkthrough of the YottaBuilder pipeline. Explore each stage to see how work moves — and where humans stay in control."
          />
          <RevealOnScroll delay={0.2}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-slate-ink" aria-label="Colour legend">
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-2 w-2 rounded-full bg-electric" />
                AI work
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-2 w-2 rotate-45 bg-gold" />
                Human gate
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-2 w-2 rounded-full bg-teal" />
                Verified / shipped
              </li>
            </ul>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1} className="mt-12 sm:mt-14">
          <div
            ref={winRef}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="relative overflow-hidden rounded-lg bg-midnight shadow-[0_60px_120px_-40px_rgb(18_20_23/0.55),0_0_0_1px_rgb(18_20_23/0.9)]"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-line-dark bg-abyss/70 px-4 py-3">
              <div aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <p className="min-w-0 flex-1 truncate text-center font-mono text-[0.72rem] text-steel sm:text-left sm:pl-4">Project · Claims Portal (sample)</p>
              <span className="hidden font-mono text-[0.62rem] tracking-wider text-steel/70 uppercase sm:inline">illustrative</span>
            </div>

            <div className="grid md:grid-cols-[13rem_1fr]">
              {/* Tablist: vertical sidebar on md+, scrollable strip on mobile */}
              <div
                role="tablist"
                aria-label="Pipeline stages"
                onKeyDown={onKey}
                className="flex gap-1 overflow-x-auto border-b border-line-dark p-2 [scrollbar-width:none] md:flex-col md:overflow-visible md:border-r md:border-b-0 md:p-3"
              >
                {TABS.map((t, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={t.key}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      role="tab"
                      type="button"
                      id={`${uid}-tab-${t.key}`}
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(i)}
                      className={cn(
                        "relative flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2 text-left text-[0.82rem] whitespace-nowrap transition-colors duration-300",
                        on ? "text-white" : "text-steel hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      {on && <motion.span layoutId={`${uid}-tab-bg`} className="absolute inset-0 rounded-sm bg-electric/15 ring-1 ring-electric/40" transition={{ type: "spring", stiffness: 400, damping: 36 }} />}
                      <span className={cn("relative w-5 font-mono text-[0.62rem]", t.key === "review" ? "text-gold-300" : t.key === "deploy" ? "text-teal-300" : on ? "text-electric-300" : "text-steel/60")}>{t.glyph}</span>
                      <span className="relative">{t.label}</span>
                    </button>
                  );
                })}
                <div aria-hidden className="mt-auto hidden pt-6 md:block">
                  <div className="rounded-sm border border-line-dark p-3">
                    <p className="font-mono text-[0.6rem] tracking-wider text-steel/70 uppercase">Autoplay</p>
                    <p className="mt-1 text-[0.72rem] text-steel">{userTook || reduce ? "Manual" : paused ? "Paused" : "Cycling stages"}</p>
                  </div>
                </div>
              </div>

              <div
                id={`${uid}-panel`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-${tab.key}`}
                tabIndex={0}
                className="relative min-h-[27rem] p-4 outline-none sm:p-6"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab.key}
                    initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <Panel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Autoplay progress */}
            {!userTook && !reduce && (
              <div aria-hidden className="h-[2px] bg-white/5">
                <motion.div
                  key={`${active}-${paused}`}
                  className="h-full origin-left bg-electric"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused || !inView ? 0 : 1 }}
                  transition={{ duration: 4.2, ease: "linear" }}
                />
              </div>
            )}
          </div>
          <p className="mt-4 text-center text-[0.8rem] text-slate-ink">Illustrative interface with sample data — not customer results.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
