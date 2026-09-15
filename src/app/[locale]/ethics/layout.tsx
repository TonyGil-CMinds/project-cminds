import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Code of Ethics",
    description: "C Minds' Code of Ethics: our standards on legal compliance, confidentiality, harassment, health and safety, integrity, and anti-corruption.",
  },
  es: {
    title: "Código de Ética",
    description: "Código de Ética de C Minds: nuestros estándares de cumplimiento legal, confidencialidad, acoso, salud y seguridad, integridad y anticorrupción.",
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
      canonical: `/${l}/ethics`,
      languages: { en: "/en/ethics", es: "/es/ethics", "x-default": "/en/ethics" },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/ethics`, locale: OG_LOCALES[l] },
  };
}

export default function EthicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
