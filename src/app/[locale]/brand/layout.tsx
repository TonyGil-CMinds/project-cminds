import type { Metadata } from "next";
import { toLocale, OG_LOCALES, type Locale } from "@/i18n/config";

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Brand Guidelines",
    description: "C Minds brand guidelines — logo usage, clearspace, partnership, and color usage.",
  },
  es: {
    title: "Guía de marca",
    description: "Guía de marca de C Minds — uso del logo, espacio libre, alianzas y uso de color.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = toLocale(locale);
  const m = META[l];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${l}/brand`,
      languages: { en: "/en/brand", es: "/es/brand", "x-default": "/en/brand" },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/brand`, locale: OG_LOCALES[l] },
  };
}

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
