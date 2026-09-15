import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.cminds.co")
).replace(/\/$/, "");

const FEED_URL =
  "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed?limit=200";

/** Static routes, with the priority we want each to carry. */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/core", priority: 0.9, changeFrequency: "monthly" },
  { path: "/mindscope", priority: 0.9, changeFrequency: "daily" },
  { path: "/careers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/aiforbiodiversity", priority: 0.8, changeFrequency: "monthly" },
  { path: "/aiforbiodiversity/aiformanatees", priority: 0.6, changeFrequency: "monthly" },
  { path: "/aiforbiodiversity/naturatechlac", priority: 0.6, changeFrequency: "monthly" },
  { path: "/aiforbiodiversity/techfornature", priority: 0.6, changeFrequency: "monthly" },
  { path: "/aiforbiodiversity/vitaloceans", priority: 0.6, changeFrequency: "monthly" },
  { path: "/brand", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/ethics", priority: 0.3, changeFrequency: "yearly" },
];

/** hreflang alternates for one app-relative path. */
function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
    ),
  };
}

type FeedPost = { slug: string; language: string; published_date?: string };

async function fetchPosts(): Promise<FeedPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = LOCALES.flatMap((locale) =>
    ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: alternates(path),
    }))
  );

  const posts = await fetchPosts();
  const postEntries = posts
    .filter((p) => p.slug && LOCALES.includes(p.language as (typeof LOCALES)[number]))
    .map((p) => ({
      // Spanish slugs carry accents — percent-encode so the sitemap stays ASCII-safe.
      url: `${SITE_URL}/${p.language}/mindscope/${encodeURIComponent(p.slug)}`,
      lastModified: p.published_date ? new Date(p.published_date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...postEntries];
}
