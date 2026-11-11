import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reader3D from "@/components/reader3d/Reader3D";
import { loadReaderManifest } from "@/components/reader3d/load";
import { localePath, toLocale } from "@/i18n/config";

type Params = Promise<{ locale: string; slug: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

const langOf = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Search }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = toLocale(locale);
  const manifest = await loadReaderManifest(slug, [langOf((await searchParams).lang), l, "en", "es"]);
  return {
    title: manifest ? manifest.title : "C Minds",
    description: manifest?.subtitle,
    // Fase 1: lector interno, sin indexar hasta integrarlo en el Archive.
    robots: { index: false, follow: false },
  };
}

export default async function ReaderPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { locale, slug } = await params;
  const l = toLocale(locale);
  const manifest = await loadReaderManifest(slug, [langOf((await searchParams).lang), l, "en", "es"]);
  if (!manifest) notFound();

  const src = manifest.source;
  // PDF original: por el Archive (mismo origen, descarga directa) o el enlace guardado en el manifest.
  const downloadHref = src
    ? `/api/download?reportId=${encodeURIComponent(src.reportId)}&lang=${encodeURIComponent(src.lang)}`
    : manifest.pdf && /^https?:\/\//.test(manifest.pdf)
      ? manifest.pdf
      : undefined;
  // Volver al mismo reporte en The Archive (los que solo existen como lector usan «reader:<slug>»).
  const backHref = localePath(l, `/mindscope?report=${encodeURIComponent(src ? src.reportId : `reader:${slug}`)}`);

  return <Reader3D manifest={manifest} locale={l} backHref={backHref} downloadHref={downloadHref} downloadName={`${manifest.title}.pdf`} />;
}
