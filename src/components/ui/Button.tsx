"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { useEarlyAccess } from "@/components/layout/EarlyAccess";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  magnetic?: boolean;
  arrow?: boolean;
  className?: string;
};
type AsLink = Common & { href: string; external?: boolean; onClick?: never; earlyAccess?: never; type?: never };
type AsButton = Common & { href?: never; external?: never; onClick?: (e: MouseEvent<HTMLButtonElement>) => void; earlyAccess?: boolean; type?: "button" | "submit" };
export type ButtonProps = AsLink | AsButton;

const styles: Record<Variant, string> = {
  primary:
    "bg-electric text-ink shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_24px_-12px_rgb(34_195_201/0.6)] hover:bg-electric-300",
  secondary:
    "text-white border border-white/15 bg-white/[0.02] hover:border-white/35 hover:bg-white/[0.06]",
  ghost: "text-ink border border-line-light bg-white hover:border-brand/40 hover:text-brand",
  light: "bg-white text-ink hover:bg-ice shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]",
};

function Arrow() {
  return (
    <span aria-hidden className="relative inline-flex h-4 w-4 overflow-hidden">
      <svg viewBox="0 0 16 16" className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
      <svg viewBox="0 0 16 16" className="absolute inset-0 h-4 w-4 -translate-x-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </span>
  );
}

/** Primary interactive control. `earlyAccess` opens the early-access dialog. */
export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", magnetic = false, arrow = true, className } = props;
  const wrap = useRef<HTMLSpanElement>(null);
  const ea = useEarlyAccess();

  const onMove = (e: PointerEvent) => {
    if (!magnetic || e.pointerType !== "mouse" || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.32;
    wrap.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (wrap.current) wrap.current.style.transform = "translate3d(0,0,0)";
  };

  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-sm font-semibold tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-300 select-none",
    size === "lg" ? "h-13 px-6 text-[0.95rem]" : "h-11 px-5 text-sm",
    styles[variant],
    className,
  );

  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && <Arrow />}
    </>
  );

  let el: ReactNode;
  if ("href" in props && props.href) {
    el = props.external ? (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={props.href} className={cls}>
        {inner}
      </Link>
    );
  } else {
    const p = props as AsButton;
    el = (
      <button
        type={p.type ?? "button"}
        className={cls}
        aria-haspopup={p.earlyAccess ? "dialog" : undefined}
        onClick={(e) => {
          if (p.earlyAccess) ea.open(e.currentTarget);
          p.onClick?.(e);
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-flex transition-transform duration-500 ease-out-expo will-change-transform"
    >
      {el}
    </span>
  );
}
