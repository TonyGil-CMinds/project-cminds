import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toLocale, type Locale } from "@/i18n/config";
import { ACTIONS, PAGES, PAGE_BY_SLUG, TEMPLATES, type ToolkitPage } from "../data";
import {
  ActionPage,
  BibliotecaPage,
  CasoPage,
  ContextoPage,
  DiagnosticoPage,
  EjercicioPage,
  GestionPage,
  GlosarioPage,
  InsigniaPage,
  NoventaPage,
  PlantillasPage,
  TemplatePage,
} from "../_components/pages";
import { JsonLd, pageJsonLd, pageMetadata } from "../seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGE_BY_SLUG.get(slug);
  return page ? pageMetadata(page) : {};
}

function Content({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  switch (page.kind) {
    case "contexto":
      return <ContextoPage page={page} locale={locale} />;
    case "caso":
      return <CasoPage page={page} locale={locale} />;
    case "gestion":
      return <GestionPage page={page} locale={locale} />;
    case "diagnostico":
      return <DiagnosticoPage page={page} locale={locale} />;
    case "accion":
      return <ActionPage page={page} locale={locale} action={ACTIONS.find((a) => a.id === page.ref)!} />;
    case "noventa-dias":
      return <NoventaPage page={page} locale={locale} />;
    case "ejercicio":
      return <EjercicioPage page={page} locale={locale} />;
    case "plantillas":
      return <PlantillasPage page={page} locale={locale} />;
    case "plantilla":
      return <TemplatePage page={page} locale={locale} template={TEMPLATES.find((t) => t.id === page.ref)!} />;
    case "biblioteca":
      return <BibliotecaPage page={page} locale={locale} />;
    case "glosario":
      return <GlosarioPage page={page} locale={locale} />;
    case "insignia":
      return <InsigniaPage page={page} locale={locale} />;
    default:
      return null;
  }
}

export default async function ToolkitChapter({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = PAGE_BY_SLUG.get(slug);
  if (!page || !page.slug) notFound();
  return (
    <>
      <JsonLd data={pageJsonLd(page)} />
      <Content page={page} locale={toLocale(locale)} />
    </>
  );
}
