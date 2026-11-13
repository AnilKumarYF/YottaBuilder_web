"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Temporary review aid: flip between the two home page concepts.
 * Remove this component (and its two usages) once a design is chosen.
 */
const DESIGNS = [
  { href: "/", label: "A", name: "Cinematic" },
  { href: "/home-v2", label: "B", name: "Editorial" },
  { href: "/home-v3", label: "C", name: "3D AI" },
] as const;

export function DesignSwitcher() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Compare home page designs"
      className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-abyss/85 p-1 pl-4 text-xs text-steel shadow-[0_20px_50px_-15px_rgb(0_0_0/0.7)] backdrop-blur-xl"
    >
      <span className="mr-2 hidden font-mono tracking-wider uppercase sm:inline">Compare</span>
      {DESIGNS.map((d) => {
        const on = pathname === d.href;
        return (
          <Link
            key={d.href}
            href={d.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-4 font-medium transition-colors",
              on ? "bg-electric text-ink" : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <span className="font-mono">{d.label}</span>
            <span className="hidden whitespace-nowrap sm:inline">{d.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
