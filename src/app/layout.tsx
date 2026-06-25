import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConstructionBanner from "../components/ConstructionBanner";
import MobileMenu from "../components/MobileMenu";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cminds.co"),
  title: {
    default: "C Minds | Action Tank",
    template: "%s | C Minds",
  },
  description:
    "C Minds is a systemic innovation action tank that integrates technological, financial, business, and governance frontiers to drive new logics and strategies aimed at equitable prosperity and biodiversity conservation.",
  openGraph: {
    type: "website",
    siteName: "C Minds",
    title: "C Minds | A New Era Begins",
    description:
      "C Minds is a systemic innovation action tank that integrates technological, financial, business, and governance frontiers to drive new logics and strategies aimed at equitable prosperity and biodiversity conservation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "C Minds — A new era begins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C Minds | A New Era Begins",
    description:
      "C Minds is a systemic innovation action tank that integrates technological, financial, business, and governance frontiers to drive new logics and strategies aimed at equitable prosperity and biodiversity conservation.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} h-full antialiased`}>
      <body className={`${satoshi.className} min-h-full flex flex-col`}>
        <MobileMenu />
        {children}
        <ConstructionBanner />
      </body>
    </html>
  );
}
