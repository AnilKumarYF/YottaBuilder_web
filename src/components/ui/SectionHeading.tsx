import { cn } from "@/lib/cn";
import { TextReveal, RevealOnScroll } from "./Reveal";

/** Section label + headline + lede. `index` renders an editorial "§ 04" marker. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  tone = "dark",
  align = "left",
  className,
  as = "h2",
  id,
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <RevealOnScroll y={12}>
        <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center", dark ? "text-steel" : "text-brand")}>
          {index && <span className={dark ? "text-white/45" : "text-ink/40"}>{index}</span>}
          <span aria-hidden className={cn("h-px w-8", dark ? "bg-steel/40" : "bg-brand/30")} />
          {eyebrow}
        </p>
      </RevealOnScroll>
      <TextReveal id={id} as={as} text={title} accent={accent} className={cn("display-lg mt-5 text-balance", dark ? "text-white" : "text-ink")} />
      {description && (
        <RevealOnScroll delay={0.15}>
          <p className={cn("lede mt-6 max-w-2xl text-pretty", align === "center" && "mx-auto", dark ? "text-steel" : "text-slate-ink")}>{description}</p>
        </RevealOnScroll>
      )}
    </div>
  );
}
