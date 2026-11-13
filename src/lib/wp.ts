import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Headless WordPress access. WordPress remains the CMS for blog posts and job
 * openings (category "Blog" / "JOBS") and the backend for Elementor Pro forms.
 */
export const WP_BASE = (process.env.WP_BASE_URL ?? "https://yottabuilder.ai").replace(/\/$/, "");
const REVALIDATE = 600;

export const CATEGORY = { blog: 26, jobs: 24 } as const;

/** Elementor Pro form identifiers, read from the live markup. */
export const ELEMENTOR_FORMS = {
  earlyAccess: {
    postId: "2282",
    formId: "51fe5f41",
    queriedId: "153",
    fields: { name: "name", email: "email", message: "field_8ecabc7" },
  },
  jobApplication: {
    postId: "2424",
    formId: "2970557",
    fields: {
      name: "name",
      email: "email",
      phone: "field_59b6396",
      experience: "field_a6755f5",
      notice: "field_25d8e24",
      resume: "field_52e4d9d",
      message: "field_25350f9",
    },
  },
} as const;

type RawPost = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  link: string;
  categories: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string; media_details?: { sizes?: Record<string, { source_url: string }> } }> };
};

export type Post = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  kind: "blog" | "job";
  title: string;
  excerpt: string;
  image: { src: string; alt: string } | null;
  html?: string;
};

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8230;|&hellip;|\[&hellip;\]/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function normalise(p: RawPost, withContent: boolean): Post {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;
  const src = sizes?.large?.source_url ?? sizes?.medium_large?.source_url ?? media?.source_url;
  const kind = p.categories.includes(CATEGORY.jobs) ? "job" : "blog";
  const title = decode(p.title.rendered);
  let excerpt = decode(p.excerpt.rendered);
  // Elementor jobs repeat the title + "Job Description Apply Now" at the start of the excerpt.
  if (kind === "job") excerpt = excerpt.replace(title, "").replace(/^\s*Job Description\s*Apply Now\s*/i, "").trim();
  return {
    id: p.id,
    slug: p.slug,
    date: p.date,
    modified: p.modified ?? p.date,
    kind,
    title,
    excerpt,
    image: src ? { src, alt: media?.alt_text || title } : null,
    html: withContent && p.content ? dropImage(cleanContent(p.content.rendered, title), src) : undefined,
  };
}

/** Elementor posts often repeat the featured image as the first content image. */
function dropImage(html: string, featured?: string) {
  if (!featured) return html;
  const base = (u: string) => u.split("/").pop()!.replace(/-\d+x\d+(?=\.)/, "").replace(/-scaled(?=\.)/, "").split(".")[0];
  const target = base(featured);
  return html.replace(/<img[^>]*src="([^"]+)"[^>]*>/, (m, src: string) => (base(src) === target ? "" : m));
}

async function wpFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${WP_BASE}/wp-json/wp/v2/${path}`, { next: { revalidate: REVALIDATE }, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPosts(kind: "blog" | "job"): Promise<Post[] | null> {
  const cat = kind === "blog" ? CATEGORY.blog : CATEGORY.jobs;
  const raw = await wpFetch<RawPost[]>(`posts?categories=${cat}&per_page=50&_embed=wp:featuredmedia&_fields=id,slug,date,modified,link,categories,title,excerpt,_links,_embedded`);
  return raw ? raw.map((p) => normalise(p, false)) : null;
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const raw = await wpFetch<RawPost[]>(`posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`);
  return raw && raw[0] ? normalise(raw[0], true) : null;
}

/**
 * Elementor post bodies contain layout wrappers, "Apply Now" popup triggers and
 * related-post widgets. Keep only article semantics.
 */
/** Remove every <div> whose class matches `re`, including its balanced subtree. */
function removeDivBlocks(html: string, re: RegExp): string {
  let out = html;
  for (;;) {
    const open = [...out.matchAll(/<div\b[^>]*class="([^"]*)"[^>]*>/g)].find((m) => re.test(m[1]));
    if (!open || open.index === undefined) return out;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = open.index + open[0].length;
    let depth = 1;
    let end = out.length;
    for (let m = tag.exec(out); m; m = tag.exec(out)) {
      depth += m[0].startsWith("</") ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    out = out.slice(0, open.index) + out.slice(end);
  }
}

const CHROME_WIDGETS = /\belementor-widget-(?:posts|archive-posts|loop-grid|button|gum\w*|sidebar|wp-widget[\w-]*)(?:\s|$)/;

function cleanContent(html: string, title: string): string {
  let h = removeDivBlocks(html, CHROME_WIDGETS);
  h = sanitizeHtml(h, {
    allowedTags: ["div", "h2", "h3", "h4", "h5", "p", "ul", "ol", "li", "strong", "b", "em", "i", "a", "blockquote", "img", "figure", "figcaption", "br", "table", "thead", "tbody", "tr", "th", "td", "hr", "code", "pre"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: {
      h1: "h2",
      h5: "h4",
      h6: "h4",
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        if (href.startsWith("#elementor-action")) return { tagName: "span", attribs: {} };
        // Internal links to the WordPress host are re-pointed at this site.
        const local = href.replace(/^https?:\/\/(www\.)?yottabuilder\.ai/i, "");
        return { tagName, attribs: { href: local || "/", ...(attribs.title ? { title: attribs.title } : {}) } };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
    exclusiveFilter: (frame) => {
      const text = frame.text.trim();
      if (frame.tag === "a" && !text && !frame.mediaChildren.length) return true;
      if (frame.tag === "span" && /^apply now$/i.test(text)) return true;
      if (["p", "li", "h2", "h3", "h4"].includes(frame.tag) && !text && !frame.mediaChildren.length) return true;
      // Thumbnails from related-post widgets.
      if (frame.tag === "img" && /-150x150\./.test(frame.attribs.src ?? "")) return true;
      return false;
    },
  });
  // Remove a leading heading that just repeats the post title.
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  h = h.replace(/<\/?div[^>]*>/g, "");
  h = h.replace(new RegExp(`^\\s*<h[2-4]>\\s*${esc}\\s*</h[2-4]>`, "i"), "");
  h = h.replace(/^\s*<h[2-4]>\s*Job Description\s*<\/h[2-4]>/i, "");
  // Headings that only introduced the removed related-posts widgets.
  h = h.replace(/<h[2-4]>\s*(?:Job Openings|Recent Posts|Related Posts|Latest Posts)\s*<\/h[2-4]>/gi, "");
  return h.replace(/(\s*<br \/>\s*){2,}/g, "<br />").trim();
}

/** Submit a form to the existing Elementor Pro handler so WordPress notifications keep working. */
export async function submitElementorForm({
  postId,
  formId,
  queriedId,
  fields,
  files,
  referrer,
}: {
  postId: string;
  formId: string;
  queriedId?: string;
  fields: Record<string, string>;
  files?: Record<string, File>;
  referrer: string;
}): Promise<{ ok: boolean; message?: string }> {
  if (process.env.FORMS_DRY_RUN === "1") {
    console.info("[forms] dry run — not forwarded", { formId, fields: Object.keys(fields), files: Object.keys(files ?? {}) });
    return { ok: true };
  }
  const fd = new FormData();
  fd.set("action", "elementor_pro_forms_send_form");
  fd.set("post_id", postId);
  fd.set("form_id", formId);
  fd.set("referer_title", "YottaBuilder");
  if (queriedId) fd.set("queried_id", queriedId);
  fd.set("referrer", referrer);
  for (const [k, v] of Object.entries(fields)) fd.set(`form_fields[${k}]`, v);
  for (const [k, f] of Object.entries(files ?? {})) fd.set(`form_fields[${k}]`, f, f.name);
  try {
    const res = await fetch(`${WP_BASE}/wp-admin/admin-ajax.php`, { method: "POST", body: fd, cache: "no-store" });
    const json = (await res.json().catch(() => null)) as { success?: boolean; data?: { message?: string } } | null;
    return { ok: Boolean(res.ok && json?.success), message: json?.data?.message };
  } catch {
    return { ok: false };
  }
}
