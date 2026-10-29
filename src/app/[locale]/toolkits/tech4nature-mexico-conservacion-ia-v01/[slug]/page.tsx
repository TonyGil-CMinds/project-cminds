import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { toLocale, type Locale } from "@/i18n/config";
import { LEGACY_SLUGS, PAGES, PAGE_BY_SLUG, STAGES, TEMPLATES, toolkitHref, type ToolkitPage } from "../data";
import {
  BioculturalPage,
  CajaPage,
  CasoPage,
  FuentesPage,
  GlosarioPage,
  InsigniaPage,
  PlantillasPage,
  PorQueImportaPage,
  PreguntasPage,
  StagePage,
  TemplatePage,
} from "../_components/pages";
import { JsonLd, pageJsonLd, pageMetadata } from "../seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...PAGES.filter((p) => p.slug).map((p) => ({ slug: p.slug })),
    // Capítulos de la versión 0.1: redirigen a la página que los sustituye.
    ...Object.keys(LEGACY_SLUGS).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGE_BY_SLUG.get(slug);
  return page ? pageMetadata(page) : { robots: { index: false } };
}

function Content({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  switch (page.kind) {
    case "por-que-importa":
      return <PorQueImportaPage page={page} locale={locale} />;
    case "caso":
      return <CasoPage page={page} locale={locale} />;
    case "biocultural":
      return <BioculturalPage page={page} locale={locale} />;
    case "etapa":
      return <StagePage page={page} locale={locale} stage={STAGES.find((s) => s.id === page.ref)!} />;
    case "preguntas":
      return <PreguntasPage page={page} locale={locale} />;
    case "caja":
      return <CajaPage page={page} locale={locale} />;
    case "glosario":
      return <GlosarioPage page={page} locale={locale} />;
    case "plantillas":
      return <PlantillasPage page={page} locale={locale} />;
    case "plantilla":
      return <TemplatePage page={page} locale={locale} template={TEMPLATES.find((t) => t.id === page.ref)!} />;
    case "fuentes":
      return <FuentesPage page={page} locale={locale} />;
    case "insignia":
      return <InsigniaPage page={page} locale={locale} />;
    default:
      return null;
  }
}

export default async function ToolkitChapter({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (slug in LEGACY_SLUGS) permanentRedirect(toolkitHref(toLocale(locale), LEGACY_SLUGS[slug]));
  const page = PAGE_BY_SLUG.get(slug);
  if (!page || !page.slug) notFound();
  return (
    <>
      <JsonLd data={pageJsonLd(page)} />
      <Content page={page} locale={toLocale(locale)} />
    </>
  );
}
