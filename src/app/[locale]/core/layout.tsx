import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Core",
    description:
      "Meet C Minds: the team, manifesto, and guiding principles behind our systemic innovation action tank for equitable prosperity and biodiversity conservation.",
  },
  es: {
    title: "Core",
    description:
      "Conoce a C Minds: el equipo, el manifiesto y los principios que guían a nuestro action tank de innovación sistémica por una prosperidad equitativa y la conservación de la biodiversidad.",
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
      canonical: `/${l}/core`,
      languages: { en: "/en/core", es: "/es/core", "x-default": "/en/core" },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/core`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
