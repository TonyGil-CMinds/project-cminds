import type { Metadata } from "next";
import { toLocale, OG_LOCALES, type Locale } from "@/i18n/config";

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "A new era",
    description: "C Minds — Systemic Innovation & Biodiversity Action Tank. Explore our initiatives, publications, and mission.",
  },
  es: {
    title: "Una nueva era",
    description: "C Minds — Systemic Innovation & Biodiversity Action Tank. Conoce nuestras iniciativas, publicaciones y misión.",
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
      canonical: `/${l}/bio`,
      languages: { en: "/en/bio", es: "/es/bio", "x-default": "/en/bio" },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/bio`, locale: OG_LOCALES[l] },
  };
}

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
