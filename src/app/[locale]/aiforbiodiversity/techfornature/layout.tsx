import type { Metadata } from "next";
import type { ReactNode } from "react";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Tech4Nature México",
    description:
      "Tech4Nature México accelerates jaguar conservation in the Yucatán Peninsula with AI-powered camera trap and bioacoustic monitoring.",
  },
  es: {
    title: "Tech4Nature México",
    description:
      "Tech4Nature México acelera la conservación del jaguar en la península de Yucatán con monitoreo bioacústico y de cámaras trampa impulsado por IA.",
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
      canonical: `/${l}/aiforbiodiversity/techfornature`,
      languages: {
        en: "/en/aiforbiodiversity/techfornature",
        es: "/es/aiforbiodiversity/techfornature",
        "x-default": "/en/aiforbiodiversity/techfornature",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/aiforbiodiversity/techfornature`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
