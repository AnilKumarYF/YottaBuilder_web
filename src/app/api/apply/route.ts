import { NextResponse } from "next/server";
import { ELEMENTOR_FORMS, submitElementorForm } from "@/lib/wp";
import { validateApplication } from "@/lib/validation";
import { clientKey, rateLimited } from "@/lib/rate-limit";
import { SITE_URL } from "@/content/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const str = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  if (str("company_site")) return NextResponse.json({ ok: true });
  if (rateLimited(`apply:${clientKey(req)}`, 4)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const resume = fd.get("resume");
  const file = resume instanceof File && resume.size > 0 ? resume : null;
  const data = {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    experience: str("experience"),
    notice: str("notice"),
    message: str("message"),
    role: str("role"),
  };
  const errors = validateApplication({ ...data, resume: file ? { name: file.name, size: file.size } : null });
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const f = ELEMENTOR_FORMS.jobApplication;
  const slug = str("slug").replace(/[^a-z0-9-]/gi, "");
  const result = await submitElementorForm({
    postId: f.postId,
    formId: f.formId,
    referrer: `${SITE_URL}/${slug}/`,
    fields: {
      [f.fields.name]: data.name,
      [f.fields.email]: data.email,
      [f.fields.phone]: data.phone,
      [f.fields.experience]: data.experience,
      [f.fields.notice]: data.notice,
      [f.fields.message]: data.role ? `Role: ${data.role}\n\n${data.message}` : data.message,
    },
    files: file ? { [f.fields.resume]: file } : undefined,
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "We couldn’t submit your application right now. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
