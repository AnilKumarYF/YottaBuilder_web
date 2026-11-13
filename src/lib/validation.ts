/** Shared client/server validation for the site's forms. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[0-9()#&+*\-=. ]{6,25}$/;
export const RESUME_MAX_BYTES = 4 * 1024 * 1024;
export const RESUME_TYPES = [".pdf", ".doc", ".docx"];

export type Errors<T extends string> = Partial<Record<T, string>>;

export function validateEarlyAccess(v: { name: string; email: string; message: string }) {
  const e: Errors<"name" | "email" | "message"> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  else if (v.name.length > 120) e.name = "Name is too long.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid work email.";
  if (v.message.length > 2000) e.message = "Please keep your message under 2,000 characters.";
  return e;
}

export function validateApplication(v: { name: string; email: string; phone: string; experience: string; notice: string; message: string; resume?: { name: string; size: number } | null }) {
  const e: Errors<"name" | "email" | "phone" | "experience" | "notice" | "message" | "resume"> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email.";
  if (v.phone && !PHONE_RE.test(v.phone.trim())) e.phone = "Only numbers and phone characters (+, -, (, ), #) are accepted.";
  if (!v.experience.trim()) e.experience = "Please tell us your experience (e.g. 2 years).";
  if (v.message.length > 3000) e.message = "Please keep your message under 3,000 characters.";
  if (!v.resume) e.resume = "Please attach your resume.";
  else if (!RESUME_TYPES.some((t) => v.resume!.name.toLowerCase().endsWith(t))) e.resume = "Resume must be a PDF, DOC or DOCX file.";
  else if (v.resume.size > RESUME_MAX_BYTES) e.resume = "Resume must be 4 MB or smaller.";
  return e;
}
