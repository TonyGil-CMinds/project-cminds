import type { Metadata } from "next";
import { toLocale } from "@/i18n/config";
import { getContent } from "./content";
import { HomePage } from "./_components/pages";
import { JsonLd, pageJsonLd, pageMetadata } from "./seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(getContent(locale).PAGES[0], locale);
}

export default async function ToolkitHome({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale);
  const home = getContent(locale).PAGES[0];
  return (
    <>
      <JsonLd data={pageJsonLd(home, locale)} />
      <HomePage page={home} locale={locale} />
    </>
  );
}
