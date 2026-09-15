import type { Metadata } from "next";
import { toLocale, OG_LOCALES } from "@/i18n/config";

const META = {
  en: {
    title: "Privacy Policy",
    description: "Read C Minds' privacy notice: what personal data we collect, how we use it, and your ARCO rights under Mexican data protection law.",
  },
  es: {
    title: "Aviso de Privacidad",
    description: "Consulta el aviso de privacidad de C Minds: qué datos personales recabamos, cómo los usamos y tus derechos ARCO conforme a la ley mexicana de protección de datos.",
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
      canonical: `/${l}/privacy`,
      languages: { en: "/en/privacy", es: "/es/privacy", "x-default": "/en/privacy" },
    },
    openGraph: { title: m.title, description: m.description, url: `/${l}/privacy`, locale: OG_LOCALES[l] },
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
