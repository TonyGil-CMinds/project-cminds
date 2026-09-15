import type { Metadata } from "next";
import NotFoundClient from "@/components/NotFoundClient";
import { common } from "@/i18n/common";
import { OG_LOCALES, toLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = toLocale(locale);
  const t = common[l].notFound;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false },
    alternates: {
      canonical: `/${l}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: `/${l}`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function NotFound() {
  return <NotFoundClient />;
}
