import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Mindscope®",
    description: "Explore C Minds' latest publications, research and insights on AI for good.",
  },
  es: {
    title: "Mindscope®",
    description: "Explora las publicaciones, investigaciones y reflexiones más recientes de C Minds sobre IA para el bien.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = toLocale(locale);
  const m = META[l];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${l}/mindscope`,
      languages: { en: "/en/mindscope", es: "/es/mindscope", "x-default": "/en/mindscope" },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/mindscope`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function MindScopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
