"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";

type Ctx = { open: (trigger?: HTMLElement | null) => void; close: () => void; isOpen: boolean };
const EarlyAccessCtx = createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });
export const useEarlyAccess = () => useContext(EarlyAccessCtx);

/** Hosts the site-wide "Get Early Access" dialog. Also opens on #early-access in the URL. */
export function EarlyAccessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const open = useCallback((t?: HTMLElement | null) => {
    trigger.current = t ?? (document.activeElement as HTMLElement | null);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === "#early-access") history.replaceState(null, "", window.location.pathname + window.location.search);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  useEffect(() => {
    const check = () => window.location.hash === "#early-access" && setOpen(true);
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.dataset.modal = "open";
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (window as unknown as { __lenis?: { stop: () => void } }).__lenis?.stop();
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("input:not([tabindex='-1'])")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button, a[href], input:not([tabindex='-1']), textarea")).filter((el) => !el.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      delete root.dataset.modal;
      document.body.style.overflow = prevOverflow;
      (window as unknown as { __lenis?: { start: () => void } }).__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <EarlyAccessCtx.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close early access dialog" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-abyss/80 backdrop-blur-md" />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ea-title"
              data-lenis-prevent
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="border-orbit relative max-h-[92dvh] w-full max-w-[34rem] overflow-y-auto rounded-t-xl bg-midnight p-6 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] sm:rounded-xl sm:p-9"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-iso-grid opacity-60" />
              <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-electric/30 blur-3xl" />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-sm text-steel transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <div className="relative">
                <p className="eyebrow text-electric-300">Early access</p>
                <h2 id="ea-title" className="mt-3 font-display text-[1.75rem] leading-tight font-bold tracking-[-0.02em] text-white">
                  Bring your requirements.
                  <br />
                  <span className="text-steel">We’ll show you the production app.</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-steel">Join the waitlist for early access to YottaBuilder.</p>
                <div className="mt-7">
                  <EarlyAccessForm onDone={close} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EarlyAccessCtx.Provider>
  );
}
