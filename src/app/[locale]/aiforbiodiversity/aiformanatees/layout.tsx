import type { Metadata } from "next";
import type { ReactNode } from "react";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "AI for Manatees",
    description:
      "A Machine Learning Approach to better understand and protect manatees in Latin America and the Caribbean.",
  },
  es: {
    title: "AI for Manatees",
    description:
      "Un enfoque de machine learning para entender y proteger mejor a los manatíes en América Latina y el Caribe.",
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
      canonical: `/${l}/aiforbiodiversity/aiformanatees`,
      languages: {
        en: "/en/aiforbiodiversity/aiformanatees",
        es: "/es/aiforbiodiversity/aiformanatees",
        "x-default": "/en/aiforbiodiversity/aiformanatees",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/aiforbiodiversity/aiformanatees`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
