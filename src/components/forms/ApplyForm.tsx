"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { validateApplication, RESUME_TYPES, type Errors } from "@/lib/validation";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "phone" | "experience" | "notice" | "message" | "resume";

const FIELDS: { k: Exclude<Field, "resume" | "message">; label: string; type?: string; auto?: string; required?: boolean; inputMode?: "email" | "tel" }[] = [
  { k: "name", label: "Full name", auto: "name", required: true },
  { k: "email", label: "Email", type: "email", auto: "email", required: true, inputMode: "email" },
  { k: "phone", label: "Mobile number", type: "tel", auto: "tel", inputMode: "tel" },
  { k: "experience", label: "Experience (e.g. 2 years)", required: true },
  { k: "notice", label: "Notice period" },
];

export function ApplyForm({ role, slug }: { role: string; slug: string }) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [v, setV] = useState({ name: "", email: "", phone: "", experience: "", notice: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors<Field>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const validate = (next = v, f = file) => validateApplication({ ...next, resume: f ? { name: f.name, size: f.size } : null });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("submitting");
    setServerError("");
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => fd.set(k, val));
    fd.set("role", role);
    fd.set("slug", slug);
    fd.set("company_site", (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "");
    if (file) fd.set("resume", file);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) return setStatus("success");
      if (json.errors) setErrors(json.errors);
      setServerError(json.error ?? "Please check the highlighted fields.");
      setStatus("error");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-sm border border-line-light bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-slate-ink/60 focus:border-brand aria-[invalid=true]:border-[#d64545]";
  const err = (k: Field) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-[0.8rem] text-[#c13030]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div key="ok" role="status" aria-live="polite" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-teal/30 bg-teal/5 p-8 text-center">
          <p className="font-display text-xl font-bold text-ink">Application received.</p>
          <p className="mt-2 text-slate-ink">Thanks for applying for {role}. Our team reviews every application and will be in touch.</p>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${id}-hp`}>Company website</label>
            <input id={`${id}-hp`} name="company_site" tabIndex={-1} autoComplete="off" />
          </div>
          {FIELDS.map((f) => (
            <div key={f.k} className={f.k === "notice" ? "sm:col-span-2" : ""}>
              <label htmlFor={`${id}-${f.k}`} className="mb-1.5 block text-sm font-medium text-ink">
                {f.label}
                {f.required && <span className="text-[#c13030]"> *</span>}
              </label>
              <input
                id={`${id}-${f.k}`}
                name={f.k}
                type={f.type ?? "text"}
                inputMode={f.inputMode}
                autoComplete={f.auto}
                required={f.required}
                value={v[f.k]}
                onChange={(e) => {
                  const next = { ...v, [f.k]: e.target.value };
                  setV(next);
                  if (errors[f.k]) setErrors(validate(next));
                }}
                aria-invalid={Boolean(errors[f.k])}
                aria-describedby={errors[f.k] ? `${id}-${f.k}-err` : undefined}
                className={input}
              />
              {err(f.k)}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-resume`} className="mb-1.5 block text-sm font-medium text-ink">
              Resume <span className="text-[#c13030]">*</span> <span className="font-normal text-slate-ink">(PDF, DOC or DOCX, max 4 MB)</span>
            </label>
            <label
              htmlFor={`${id}-resume`}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-sm border border-dashed bg-white px-4 py-4 transition-colors hover:border-brand",
                errors.resume ? "border-[#d64545]" : "border-line-light",
              )}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-ice text-brand" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
                </svg>
              </span>
              <span className="min-w-0 text-sm">
                <span className="block truncate font-medium text-ink">{file ? file.name : "Choose a file"}</span>
                <span className="text-slate-ink">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or drop it here"}</span>
              </span>
            </label>
            <input
              ref={fileRef}
              id={`${id}-resume`}
              name="resume"
              type="file"
              accept={RESUME_TYPES.join(",")}
              className="sr-only"
              aria-invalid={Boolean(errors.resume)}
              aria-describedby={errors.resume ? `${id}-resume-err` : undefined}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setErrors(validate(v, f));
              }}
            />
            {err("resume")}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={4}
              value={v.message}
              onChange={(e) => setV({ ...v, message: e.target.value })}
              aria-invalid={Boolean(errors.message)}
              className={cn(input, "resize-y")}
            />
            {err("message")}
          </div>
          {serverError && (
            <p role="alert" className="rounded-sm border border-[#d64545]/40 bg-[#d64545]/5 px-3 py-2 text-sm text-[#a32626] sm:col-span-2">
              {serverError}
            </p>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-80 sm:w-auto"
            >
              {status === "submitting" ? (
                <>
                  <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting…
                </>
              ) : (
                "Submit application"
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
