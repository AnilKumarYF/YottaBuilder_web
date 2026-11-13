"use client";

import { useId, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { validateEarlyAccess, type Errors } from "@/lib/validation";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "message";
type Status = "idle" | "submitting" | "success" | "error";

export function EarlyAccessForm({ tone = "dark", onDone }: { tone?: "dark" | "light"; onDone?: () => void }) {
  const id = useId();
  const pathname = usePathname();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const dark = tone === "dark";

  const set = (k: Field, v: string) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validateEarlyAccess(next));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validateEarlyAccess(values);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("submitting");
    setServerError("");
    const honeypot = (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company_site: honeypot, page: pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerError(json.error ?? "Please check the highlighted fields.");
      setStatus("error");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  const inputCls = cn(
    "peer w-full rounded-sm border bg-transparent px-4 pt-6 pb-2.5 text-[0.95rem] outline-none transition-colors duration-300",
    dark ? "border-white/15 text-white focus:border-electric-300 placeholder:text-transparent" : "border-line-light bg-white text-ink focus:border-brand placeholder:text-transparent",
  );
  const labelCls = cn(
    "pointer-events-none absolute left-4 top-4 origin-left text-[0.95rem] transition-all duration-300",
    "peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:tracking-wide peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.7rem] peer-[:not(:placeholder-shown)]:tracking-wide",
    dark ? "text-steel peer-focus:text-electric-300" : "text-slate-ink peer-focus:text-brand",
  );
  const errCls = "mt-1.5 text-[0.8rem] text-[#ff8f8f]";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center" role="status" aria-live="polite">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-teal/40 bg-teal/10">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-teal" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <motion.path d="M5 12.5l4.2 4.2L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.15 }} />
            </svg>
          </div>
          <p className={cn("mt-5 font-display text-xl font-bold", dark ? "text-white" : "text-ink")}>You’re on the list.</p>
          <p className={cn("mt-2 text-sm", dark ? "text-steel" : "text-slate-ink")}>Thanks, {values.name.split(" ")[0]}. Our team will be in touch about early access.</p>
          {onDone && (
            <button type="button" onClick={onDone} className={cn("mt-6 text-sm font-semibold underline underline-offset-4", dark ? "text-white" : "text-brand")}>
              Close
            </button>
          )}
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -8 }} className="space-y-4" aria-describedby={serverError ? `${id}-server` : undefined}>
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${id}-hp`}>Company website</label>
            <input id={`${id}-hp`} name="company_site" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <div className="relative">
              <input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                placeholder="Full name"
                required
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={() => {
                  setTouched((t) => ({ ...t, name: true }));
                  setErrors(validateEarlyAccess(values));
                }}
                aria-invalid={Boolean(touched.name && errors.name)}
                aria-describedby={errors.name ? `${id}-name-err` : undefined}
                className={cn(inputCls, touched.name && errors.name && "border-[#ff8f8f]")}
              />
              <label htmlFor={`${id}-name`} className={labelCls}>
                Full name *
              </label>
            </div>
            {touched.name && errors.name && (
              <p id={`${id}-name-err`} className={errCls}>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Work email"
                required
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => {
                  setTouched((t) => ({ ...t, email: true }));
                  setErrors(validateEarlyAccess(values));
                }}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={errors.email ? `${id}-email-err` : undefined}
                className={cn(inputCls, touched.email && errors.email && "border-[#ff8f8f]")}
              />
              <label htmlFor={`${id}-email`} className={labelCls}>
                Email *
              </label>
            </div>
            {touched.email && errors.email && (
              <p id={`${id}-email-err`} className={errCls}>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                placeholder="Message"
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${id}-message-err` : undefined}
                className={cn(inputCls, "resize-none", errors.message && "border-[#ff8f8f]")}
              />
              <label htmlFor={`${id}-message`} className={labelCls}>
                What are you building? (optional)
              </label>
            </div>
            {errors.message && (
              <p id={`${id}-message-err`} className={errCls}>
                {errors.message}
              </p>
            )}
          </div>

          {serverError && (
            <p id={`${id}-server`} role="alert" className="rounded-sm border border-[#ff8f8f]/40 bg-[#ff8f8f]/10 px-3 py-2 text-sm text-[#ffb3b3]">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-sm bg-electric font-semibold text-ink transition-colors hover:bg-electric-300 disabled:cursor-progress disabled:opacity-80"
          >
            {status === "submitting" ? (
              <>
                <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </>
            ) : (
              "Request early access"
            )}
          </button>
          <p className={cn("text-center text-xs", dark ? "text-steel/80" : "text-slate-ink")}>
            Available for IT services teams and software consultancies first.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
