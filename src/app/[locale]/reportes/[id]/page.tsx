import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReportDetail from "./ReportDetail";

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
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const report  = await fetchReport(id);
  if (!report) return { title: "Reporte | C Minds" };
  return {
    title:       `${report.title} | C Minds`,
    description: report.description,
    openGraph: {
      title:       report.title,
      description: report.description,
      images:      report.cover_image ? [{ url: report.cover_image }] : [],
      type:        "article",
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report  = await fetchReport(id);
  if (!report) notFound();
  return <ReportDetail report={report} />;
}
