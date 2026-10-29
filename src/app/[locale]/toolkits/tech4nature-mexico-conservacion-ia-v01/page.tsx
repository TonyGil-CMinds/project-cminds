import type { Metadata } from "next";
import { toLocale } from "@/i18n/config";
import { PAGES } from "./data";
import { HomePage } from "./_components/pages";
import { JsonLd, pageJsonLd, pageMetadata } from "./seo";

const HOME = PAGES[0];

export const metadata: Metadata = pageMetadata(HOME);

export default async function ToolkitHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={pageJsonLd(HOME)} />
      <HomePage page={HOME} locale={toLocale(locale)} />
    </>
  );
}
