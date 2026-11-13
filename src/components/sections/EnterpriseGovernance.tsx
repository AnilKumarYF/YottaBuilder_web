import { enterpriseControls } from "@/content/product";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll, Stagger, StaggerItem } from "@/components/ui/Reveal";

const icons: Record<string, React.ReactNode> = {
  rbac: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0111 0M16 7h5M16 11h5M18 15h3" />
    </>
  ),
  sso: (
    <>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H21M17 12v3M20 12v2" />
    </>
  ),
  audit: <path d="M7 3h8l4 4v14H7zM15 3v4h4M10 11h6M10 14.5h6M10 18h4" />,
  gates: (
    <>
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6M12 15v-2" />
    </>
  ),
  trace: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h6a3 3 0 010 6h-2a3 3 0 000 6h6" />
    </>
  ),
  oversight: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

/* Isometric plate: top rhombus + two visible side faces. */
function Plate({ cy, label, tone, delay }: { cy: number; label: string; tone: "brand" | "gold" | "teal"; delay: number }) {
  const cx = 210;
  const w = 300;
  const h = 150;
  const t = 14;
  const top = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  const left = `${cx - w / 2},${cy} ${cx},${cy + h / 2} ${cx},${cy + h / 2 + t} ${cx - w / 2},${cy + t}`;
  const right = `${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx},${cy + h / 2 + t} ${cx + w / 2},${cy + t}`;
  const stroke = tone === "gold" ? "#e8a33d" : tone === "teal" ? "#3dd68c" : "#0b3b3f";
  return (
    <g className="eg-plate" style={{ animationDelay: `${delay}s` }}>
      <polygon points={left} fill="#e4e4df" />
      <polygon points={right} fill="#d2d5da" />
      <polygon points={top} fill="#ffffff" stroke={stroke} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* inner rhombus */}
      <polygon
        points={`${cx},${cy - h / 2 + 22} ${cx + w / 2 - 44},${cy} ${cx},${cy + h / 2 - 22} ${cx - w / 2 + 44},${cy}`}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.25"
        strokeDasharray="3 5"
      />
      <text x={cx + w / 2 + 18} y={cy + 4} className="fill-ink font-mono" fontSize="11" letterSpacing="1.6">
        {label.toUpperCase()}
      </text>
      <line x1={cx + w / 2 + 2} y1={cy} x2={cx + w / 2 + 12} y2={cy} stroke={stroke} strokeOpacity="0.6" />
    </g>
  );
}

function ControlPlane() {
  return (
    <svg viewBox="0 0 440 470" className="h-auto w-full" role="img" aria-label="Illustration: three stacked control layers — access, approvals and audit">
      <style>{`
        .eg-plate { animation: eg-float 7s ease-in-out infinite; transform-box: fill-box; }
        .eg-scan { animation: eg-scan 5.5s cubic-bezier(.83,0,.17,1) infinite; }
        @keyframes eg-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
        @keyframes eg-scan { 0% { transform: translateY(0); opacity: 0 } 10% { opacity: .9 } 90% { opacity: .9 } 100% { transform: translateY(300px); opacity: 0 } }
      `}</style>
      {/* vertical spine */}
      <line x1="210" y1="60" x2="210" y2="420" stroke="#0b3b3f" strokeOpacity="0.18" strokeDasharray="2 5" />
      <Plate cy={350} label="Audit" tone="teal" delay={0.6} />
      <Plate cy={235} label="Approvals" tone="gold" delay={0.3} />
      <Plate cy={120} label="Access" tone="brand" delay={0} />

      {/* gold gate glyph on the approvals layer */}
      <g transform="translate(210 235)">
        <circle r="22" fill="#fdf6ea" stroke="#e8a33d" strokeWidth="1.4" />
        <rect x="-8" y="-3" width="16" height="12" rx="2" fill="#e8a33d" />
        <path d="M-5 -3v-4a5 5 0 0110 0v4" fill="none" stroke="#e8a33d" strokeWidth="2" />
      </g>
      {/* access key on top */}
      <g transform="translate(210 120)" stroke="#0b3b3f" strokeWidth="1.6" fill="none">
        <circle cx="-6" r="5" />
        <path d="M-1 0h12M7 0v4M10 0v3" />
      </g>
      {/* audit ticks */}
      <g transform="translate(186 343)" stroke="#3dd68c" strokeWidth="1.6" fill="none">
        <path d="M0 0h20M0 7h28M0 14h14" />
      </g>

      {/* scan line */}
      <g className="eg-scan">
        <line x1="40" y1="70" x2="380" y2="70" stroke="#22c3c9" strokeWidth="1.2" strokeOpacity="0.8" />
        <rect x="40" y="62" width="340" height="8" fill="#22c3c9" fillOpacity="0.08" />
      </g>
    </svg>
  );
}

const auditTrail = [
  { t: "14:02", ev: "gate:stories", who: "approved by J. Rivera", tone: "gold" },
  { t: "13:47", ev: "gen:tests", who: "model claude · 42 cases", tone: "blue" },
  { t: "13:31", ev: "gate:epics", who: "approved by A. Mehta", tone: "gold" },
  { t: "13:12", ev: "trace:REQ-118", who: "linked → STORY-204", tone: "teal" },
] as const;

export function EnterpriseGovernance({ index = "07" }: { index?: string }) {
  const title = "Built for controlled, traceable development.";
  return (
    <section aria-labelledby="governance-heading" className="relative overflow-hidden bg-ice">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid-light opacity-70 mask-fade-b" />
      <div className="container-x section-y relative">
        <SectionHeading
          id="governance-heading"
          tone="light"
          index={index}
          eyebrow="Enterprise governance"
          title={title}
          accent="traceable development."
          description="Every generation, review and approval is accountable — so engineering leaders can adopt AI without giving up control."
        />

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <RevealOnScroll className="relative">
            <div className="relative overflow-hidden rounded-md border border-line-light bg-white/70 p-6 sm:p-10">
              <ControlPlane />
            </div>
            <div className="relative -mt-10 ml-auto w-[92%] rounded-md border border-line-light bg-ink p-5 shadow-[0_30px_60px_-30px_rgb(10_11_13/0.6)] sm:-mt-14 sm:w-[80%]">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-steel">Sample audit trail</p>
                <span className="font-mono text-[0.65rem] text-steel/60">illustrative</span>
              </div>
              <ul className="mt-3 space-y-2 font-mono text-[0.75rem]">
                {auditTrail.map((r) => (
                  <li key={r.t + r.ev} className="flex flex-wrap gap-x-2 text-steel">
                    <span className="text-steel/60">{r.t}</span>
                    <span aria-hidden>·</span>
                    <span className={r.tone === "gold" ? "text-gold-300" : r.tone === "teal" ? "text-teal-300" : "text-electric-300"}>{r.ev}</span>
                    <span aria-hidden>·</span>
                    <span className="text-white/85">{r.who}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <Stagger as="ul" className="grid gap-px overflow-hidden rounded-md border border-line-light bg-line-light sm:grid-cols-2">
            {enterpriseControls.map((c, i) => (
              <StaggerItem as="li" key={c.key} className="group bg-white p-6 transition-colors duration-500 hover:bg-[#fbfbf9] sm:p-7">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      "grid h-11 w-11 place-items-center rounded-sm border transition-colors duration-500 " +
                      (c.key === "gates" || c.key === "oversight"
                        ? "border-gold/30 bg-gold/[0.07] text-gold group-hover:border-gold"
                        : "border-brand/20 bg-brand/[0.05] text-brand group-hover:border-brand")
                    }
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {icons[c.key]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-slate-ink/50">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-[1.05rem] font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-ink">{c.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
