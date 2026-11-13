import { NextResponse } from "next/server";
import { ELEMENTOR_FORMS, submitElementorForm } from "@/lib/wp";
import { validateEarlyAccess } from "@/lib/validation";
import { clientKey, rateLimited } from "@/lib/rate-limit";
import { SITE_URL } from "@/content/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const data = { name: str("name").trim(), email: str("email").trim(), message: str("message").trim() };

  // Honeypot: bots fill hidden fields. Pretend success.
  if (str("company_site")) return NextResponse.json({ ok: true });
  if (rateLimited(`ea:${clientKey(req)}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const errors = validateEarlyAccess(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const f = ELEMENTOR_FORMS.earlyAccess;
  const result = await submitElementorForm({
    postId: f.postId,
    formId: f.formId,
    queriedId: f.queriedId,
    referrer: str("page") ? `${SITE_URL}${str("page").startsWith("/") ? str("page") : "/"}` : SITE_URL,
    fields: { [f.fields.name]: data.name, [f.fields.email]: data.email, [f.fields.message]: data.message },
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "We couldn’t submit your request right now. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
