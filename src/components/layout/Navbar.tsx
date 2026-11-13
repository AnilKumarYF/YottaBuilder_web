"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, company } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useEarlyAccess } from "./EarlyAccess";
import { cn } from "@/lib/cn";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    const goingDown = y > last.current;
    setHidden(goingDown && y > 640 && !menuOpen);
    last.current = y;
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  const active = nav.find((n) => isActive(pathname, n.href))?.href ?? null;
  const indicator = hover ?? active;

  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded-sm bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || menuOpen ? "border-b border-line-dark bg-abyss/75 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent",
          )}
        >
          <nav aria-label="Primary" className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6">
            <Logo priority />

            <ul className="hidden items-center lg:flex" onPointerLeave={() => setHover(null)}>
              {nav.map((item) => {
                const on = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={on ? "page" : undefined}
                      onPointerEnter={() => setHover(item.href)}
                      onFocus={() => setHover(item.href)}
                      onBlur={() => setHover(null)}
                      className={cn("relative block px-3.5 py-2 text-[0.88rem] font-medium transition-colors duration-300 xl:px-4", on ? "text-white" : "text-steel hover:text-white")}
                    >
                      {item.label}
                      {indicator === item.href && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          className={cn("absolute inset-x-3.5 -bottom-0.5 h-px xl:inset-x-4", hover && hover !== active ? "bg-white/40" : "bg-electric")}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <Button earlyAccess magnetic size="md">
                  Get Early Access
                </Button>
              </div>
              <button
                type="button"
                className="relative grid h-11 w-11 place-items-center rounded-sm text-white lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span aria-hidden className={cn("absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-out-expo", menuOpen ? "rotate-45" : "-translate-y-[4px]")} />
                <span aria-hidden className={cn("absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-out-expo", menuOpen ? "-rotate-45" : "translate-y-[4px]")} />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileNav({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ea = useEarlyAccess();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          data-lenis-prevent
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-abyss pt-[var(--nav-h)] lg:hidden"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-iso-grid opacity-70" />
          <div aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <nav aria-label="Mobile" className="container-x relative flex flex-1 flex-col pt-6 pb-10">
            <ul className="space-y-1">
              {nav.map((item, i) => {
                const on = isActive(pathname, item.href);
                return (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={on ? "page" : undefined}
                      className="flex items-baseline gap-4 border-b border-line-dark py-4 font-display text-[1.75rem] font-bold tracking-[-0.02em] text-white"
                    >
                      <span className={cn("font-mono text-xs font-medium", on ? "text-electric-300" : "text-steel/60")}>0{i + 1}</span>
                      <span className={on ? "text-white" : "text-white/85"}>{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-auto pt-10">
              <button
                type="button"
                onClick={(e) => {
                  onClose();
                  ea.open(e.currentTarget);
                }}
                className="flex h-14 w-full items-center justify-center rounded-sm bg-electric font-semibold text-ink"
              >
                Get Early Access
              </button>
              <p className="mt-6 text-sm text-steel">
                <a href={company.phoneHref} className="hover:text-white">
                  {company.phone}
                </a>
                <span className="mx-2 text-steel/40">·</span>
                <a href={`mailto:${company.email}`} className="hover:text-white">
                  {company.email}
                </a>
              </p>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
