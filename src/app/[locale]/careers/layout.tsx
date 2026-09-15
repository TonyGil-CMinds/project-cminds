import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Careers",
    description: "Join the C Minds team. Explore open positions, our culture, benefits, and the people behind our work for nature and technology.",
  },
  es: {
    title: "Vacantes",
    description: "Únete al equipo de C Minds. Conoce las vacantes abiertas, nuestra cultura, beneficios y a las personas detrás de nuestro trabajo por la naturaleza y la tecnología.",
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
      canonical: `/${l}/careers`,
      languages: { en: "/en/careers", es: "/es/careers", "x-default": "/en/careers" },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/careers`, locale: OG_LOCALES[l] },
  };
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
