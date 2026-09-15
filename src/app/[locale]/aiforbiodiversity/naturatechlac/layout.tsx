import type { Metadata } from "next";
import type { ReactNode } from "react";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "NaturaTech LAC",
    description:
      "NaturaTech LAC drives conservation through technology, innovation and biocultural knowledge across Latin America and the Caribbean.",
  },
  es: {
    title: "NaturaTech LAC",
    description:
      "NaturaTech LAC impulsa la conservación a través de la tecnología, la innovación y el conocimiento biocultural en América Latina y el Caribe.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = toLocale(locale);
  const m = META[l];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${l}/aiforbiodiversity/naturatechlac`,
      languages: {
        en: "/en/aiforbiodiversity/naturatechlac",
        es: "/es/aiforbiodiversity/naturatechlac",
        "x-default": "/en/aiforbiodiversity/naturatechlac",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/aiforbiodiversity/naturatechlac`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
