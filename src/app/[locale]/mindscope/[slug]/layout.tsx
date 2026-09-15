import type { Metadata } from "next";
import { toLocale, OG_LOCALES, type Locale } from "@/i18n/config";

const FEED_URL =
  "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed";

type Post = {
  slug: string;
  title: string;
  cover_image?: string;
  content?: string;
  published_date?: string;
  language?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function deriveDescription(content: string | undefined, locale: Locale): string {
  const fallback = locale === "es"
    ? "Lee lo más reciente de C Minds Mindscope®."
    : "Read the latest from C Minds Mindscope®.";
  if (!content) return fallback;

  const text = stripHtml(content);
  if (!text) return fallback;

  const LIMIT = 155;
  if (text.length <= LIMIT) return text;

  const truncated = text.slice(0, LIMIT);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${cut.trim()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);

  try {
    const res = await fetch(
      `${FEED_URL}?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    const posts: Post[] = Array.isArray(data)
      ? data
      : Array.isArray(data.posts)
        ? data.posts
        : data.post
          ? [data.post]
          : [];

    // Pick the post matching BOTH slug and the active locale.
    const post = posts.find((p) => p.slug === slug && p.language === locale);

    if (!post) {
      return { title: locale === "es" ? "Artículo — Mindscope®" : "Article — Mindscope®" };
    }

    // Does a version of this slug exist in the *other* language? Only then
    // do we emit an hreflang alternate for it.
    const hasEn = posts.some((p) => p.slug === slug && p.language === "en");
    const hasEs = posts.some((p) => p.slug === slug && p.language === "es");

    const description = deriveDescription(post.content, locale);
    const canonicalPath = `/${locale}/mindscope/${slug}`;
    const ogTitle = `${post.title} — Mindscope® | C Minds`;

    const languages: Record<string, string> = {};
    if (hasEn) languages.en = `/en/mindscope/${slug}`;
    if (hasEs) languages.es = `/es/mindscope/${slug}`;

    return {
      title: `${post.title} — Mindscope®`,
      description,
      alternates: {
        canonical: canonicalPath,
        ...(Object.keys(languages).length > 0 ? { languages } : {}),
      },
      openGraph: {
        type: "article",
        title: ogTitle,
        description,
        url: canonicalPath,
        siteName: "C Minds",
        locale: OG_LOCALES[locale],
        publishedTime: post.published_date,
        images: post.cover_image
          ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description,
        images: post.cover_image ? [post.cover_image] : undefined,
      },
    };
  } catch {
    return { title: locale === "es" ? "Artículo — Mindscope®" : "Article — Mindscope®" };
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
