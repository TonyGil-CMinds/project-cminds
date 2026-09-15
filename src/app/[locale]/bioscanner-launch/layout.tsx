import type { Metadata } from "next";
import { toLocale, OG_LOCALES, type Locale } from "@/i18n/config";

const OG_IMAGE = "/bioscanner/og-image.png";

const META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "BioScanner BETA | Registro al Lanzamiento",
    description:
      "Únete al lanzamiento BETA de BioScanner y sé parte de las primeras pruebas de una plataforma de IA para la conservación del jaguar y sus territorios.",
  },
  en: {
    title: "BioScanner BETA | Launch Registration",
    description:
      "Join the BioScanner BETA launch and be part of the first tests of an AI platform for jaguar conservation and its territories.",
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
      canonical: `/${l}/bioscanner-launch`,
      languages: {
        en: "/en/bioscanner-launch",
        es: "/es/bioscanner-launch",
        "x-default": "/en/bioscanner-launch",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${l}/bioscanner-launch`,
      siteName: "C Minds",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: m.title }],
      type: "website",
      locale: OG_LOCALES[l],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function BioscannerLaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
