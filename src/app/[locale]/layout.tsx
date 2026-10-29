import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import MobileMenu from "@/components/MobileMenu";
import SubscribeModalProvider from "@/components/SubscribeModalProvider";
import { LOCALES, LOCALE_TAGS, OG_LOCALES, isLocale, type Locale } from "@/i18n/config";

const satoshi = localFont({
  src: [
    {
      path: "../../../public/fonts/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://www.cminds.co")
);

const META = {
  en: {
    title: "C Minds — Systemic Innovation & Biodiversity Action Tank",
    template: "%s | C Minds",
    description:
      "C Minds is an action tank integrating technology, finance, business, and governance to drive equitable prosperity and biodiversity conservation.",
    ogTitle: "C Minds — A New Era Begins",
    ogDescription:
      "C Minds integrates technology, finance, business, and governance to drive equitable prosperity and biodiversity conservation.",
    ogAlt: "C Minds - A new era begins",
  },
  es: {
    title: "C Minds — Action Tank de Innovación Sistémica y Biodiversidad",
    template: "%s | C Minds",
    description:
      "C Minds es un action tank que integra tecnología, finanzas, negocios y gobernanza para impulsar la prosperidad equitativa y la conservación de la biodiversidad.",
    ogTitle: "C Minds — Comienza una nueva era",
    ogDescription:
      "C Minds integra tecnología, finanzas, negocios y gobernanza para impulsar la prosperidad equitativa y la conservación de la biodiversidad.",
    ogAlt: "C Minds - Comienza una nueva era",
  },
} satisfies Record<Locale, unknown>;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = META[locale];

  return {
    metadataBase: siteUrl,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/en",
      },
    },
    title: { default: m.title, template: m.template },
    description: m.description,
    openGraph: {
      type: "website",
      siteName: "C Minds",
      locale: OG_LOCALES[locale],
      url: `/${locale}`,
      title: m.ogTitle,
      description: m.ogDescription,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: m.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.description,
      images: [{ url: "/og-image.jpg", alt: m.ogAlt }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    // suppressHydrationWarning: the toolkit sets data-tk-* display preferences on <html> before hydrating.
    <html lang={LOCALE_TAGS[locale]} className={`${satoshi.variable} h-full antialiased`} suppressHydrationWarning>
      <body className={`${satoshi.className} min-h-full flex flex-col`}>
        <SubscribeModalProvider>
          <MobileMenu />
          {children}
        </SubscribeModalProvider>
      </body>
    </html>
  );
}
