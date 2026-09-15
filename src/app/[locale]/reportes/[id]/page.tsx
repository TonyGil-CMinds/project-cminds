import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReportDetail from "./ReportDetail";
import { toLocale, OG_LOCALES } from "@/i18n/config";
import { copy } from "./copy";

interface RawReport {
  id:             string;
  title:          string;
  description:    string;
  cover_image:    string;
  published_date: string;
  category:       string;
  status:         string;
  files: Array<{
    language:    string;
    url:         string;
    file_name:   string;
    title:       string;
    description: string;
    cover_image: string;
  }>;
}

async function fetchReport(id: string): Promise<RawReport | null> {
  const apiKey = process.env.REPORTES_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://cminds.base44.app/functions/publicReportsFeed?id=${encodeURIComponent(id)}`,
      { headers: { "x-api-key": apiKey }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.reports ?? [])[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string; locale: string }> }
): Promise<Metadata> {
  const { id, locale } = await params;
  const l = toLocale(locale);
  const t = copy[l];
  const report  = await fetchReport(id);
  if (!report) return { title: t.fallbackTitle };
  return {
    title:       `${report.title} | C Minds`,
    description: report.description,
    alternates: {
      canonical: `/${l}/reportes/${id}`,
      languages: {
        en: `/en/reportes/${id}`,
        es: `/es/reportes/${id}`,
        "x-default": `/en/reportes/${id}`,
      },
    },
    openGraph: {
      title:       report.title,
      description: report.description,
      images:      report.cover_image ? [{ url: report.cover_image }] : [],
      type:        "article",
      url:         `/${l}/reportes/${id}`,
      locale:      OG_LOCALES[l],
    },
    twitter: {
      card:        "summary_large_image",
      title:       report.title,
      description: report.description,
      images:      report.cover_image ? [report.cover_image] : [],
    },
  };
}

export default async function Page(
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id } = await params;
  const report  = await fetchReport(id);
  if (!report) notFound();
  return <ReportDetail report={report} />;
}
