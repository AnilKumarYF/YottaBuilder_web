"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

/** Subtle 3D tilt + cursor spotlight. Mouse only; inert on touch and reduced motion. */
export function TiltCard({
  children,
  className,
  max = 6,
  spotlight = "rgb(34 195 201 / 0.14)",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  spotlight?: string | false;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    ref.current.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div style={{ perspective: "1100px" }} className="h-full">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "group relative h-full transition-transform duration-500 ease-out-expo [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
          className,
        )}
      >
        {spotlight && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), ${spotlight}, transparent 60%)` }}
          />
        )}
        {children}
      </div>
    </div>
  );
}
