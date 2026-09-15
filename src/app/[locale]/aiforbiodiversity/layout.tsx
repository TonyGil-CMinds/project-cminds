import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "AI for Biodiversity",
    description:
      "AI for Climate is a global initiative that explores the use of today's most advanced technologies to mitigate the risk of environmental crises in the world.",
  },
  es: {
    title: "AI for Biodiversity",
    description:
      "AI for Climate es una iniciativa global que explora el uso de las tecnologías más avanzadas de hoy para mitigar el riesgo de crisis ambientales en el mundo.",
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
    // A template here (rather than at the root) is what lets the four sub-pages
    // inherit the "| C Minds" suffix — the root template only reaches direct children.
    title: { default: m.title, template: "%s | C Minds" },
    description: m.description,
    alternates: {
      canonical: `/${l}/aiforbiodiversity`,
      languages: {
        en: "/en/aiforbiodiversity",
        es: "/es/aiforbiodiversity",
        "x-default": "/en/aiforbiodiversity",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/aiforbiodiversity`,
      locale: OG_LOCALES[l],
    },
  };
}

export default function AFBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
