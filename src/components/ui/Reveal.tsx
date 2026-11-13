"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode, ElementType } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts children into view once. Respects prefers-reduced-motion. */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as ElementType;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Stagger({ children, className, as = "div", amount = 0.15 }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol"; amount?: number }) {
  const reduce = useReducedMotion();
  const M = motion[as] as ElementType;
  return (
    <M className={className} variants={container} initial={reduce ? "show" : "hidden"} whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const M = motion[as] as ElementType;
  return (
    <M className={className} variants={staggerItem}>
      {children}
    </M>
  );
}

/**
 * Word-by-word masked headline reveal. Full text is exposed via aria-label for
 * assistive tech. Words contained in `accent` receive the gold gradient.
 */
export function TextReveal({
  text,
  className,
  as = "h2",
  delay = 0,
  accent,
  immediate = false,
  id,
}: {
  id?: string;
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  accent?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;
  const words = text.split(" ");
  const accentStart = accent ? text.indexOf(accent) : -1;
  const accentEnd = accentStart + (accent?.length ?? 0);
  let cursor = 0;
  const viewProps = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.35 } };
  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? "show" : "hidden"}
      {...viewProps}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => {
        const pos = cursor;
        cursor += w.length + 1;
        const isAccent = accentStart >= 0 && pos >= accentStart && pos < accentEnd;
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
            <motion.span
              className={"inline-block" + (isAccent ? " text-gradient-gold" : "")}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.95, ease: EASE } } }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
