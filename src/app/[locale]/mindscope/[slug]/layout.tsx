import type { Metadata } from "next";

const FEED_URL =
  "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed";

type Post = {
  slug: string;
  title: string;
  cover_image?: string;
  content?: string;
  published_date?: string;
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

function deriveDescription(content?: string): string {
  const fallback = "Read the latest from C Minds Mindscope®.";
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${FEED_URL}?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    let post: Post | undefined = data.post;
    if (!post) {
      const posts: Post[] = Array.isArray(data) ? data : (data.posts ?? []);
      post = posts.find((p) => p.slug === slug);
    }

    if (!post) return { title: "Article — Mindscope®" };

    const description = deriveDescription(post.content);
    const canonicalPath = `/mindscope/${slug}`;
    const ogTitle = `${post.title} — Mindscope® | C Minds`;

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cminds.co"),
      title: `${post.title} — Mindscope®`,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: "article",
        title: ogTitle,
        description,
        url: canonicalPath,
        siteName: "C Minds",
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
    return { title: "Article — Mindscope®" };
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
