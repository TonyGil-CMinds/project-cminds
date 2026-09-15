import type { Metadata } from "next";
import type { ReactNode } from "react";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Vital Oceans",
    description:
      "Vital Oceans identifies, visualizes, and analyzes potential Marine Protected Areas through an interactive map, powering data-driven decisions for ocean conservation.",
  },
  es: {
    title: "Vital Oceans",
    description:
      "Vital Oceans identifica, visualiza y analiza posibles Áreas Marinas Protegidas a través de un mapa interactivo, impulsando decisiones basadas en datos para la conservación marina.",
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
      canonical: `/${l}/aiforbiodiversity/vitaloceans`,
      languages: {
        en: "/en/aiforbiodiversity/vitaloceans",
        es: "/es/aiforbiodiversity/vitaloceans",
        "x-default": "/en/aiforbiodiversity/vitaloceans",
      },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/aiforbiodiversity/vitaloceans`, locale: OG_LOCALES[l] },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
