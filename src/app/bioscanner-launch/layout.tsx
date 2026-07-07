import type { Metadata } from "next";

const TITLE = "BioScanner BETA | Registro al Lanzamiento";
const DESCRIPTION =
  "Únete al lanzamiento BETA de BioScanner y sé parte de las primeras pruebas de una plataforma de IA para la conservación del jaguar y sus territorios.";
const OG_IMAGE = "/bioscanner/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cminds.co"
  ),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/bioscanner-launch",
    siteName: "C Minds",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BioscannerLaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
