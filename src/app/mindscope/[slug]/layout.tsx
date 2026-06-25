import type { Metadata } from "next";

const FEED_URL =
  "https://cminds.base44.app/api/apps/6925f38be89e0d268185fecc/functions/publicBlogFeed?limit=84";

type Post = {
  slug: string;
  title: string;
  cover_image?: string;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    const posts: Post[] = Array.isArray(data) ? data : (data.posts ?? []);
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) return { title: "Article — Mindscope®" };

    return {
      title: `${post.title} — Mindscope®`,
      openGraph: {
        title: `${post.title} — Mindscope® | C Minds`,
        images: post.cover_image
          ? [{ url: post.cover_image, alt: post.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} — Mindscope® | C Minds`,
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
