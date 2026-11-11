import { NextResponse } from "next/server";
import { loadReaderIndex, loadStandaloneReaders } from "@/components/reader3d/load";

/**
 * Lectores 3D para The Archive:
 * - reports: { [reportId]: { slug, langs } } para los reportes de Base44 que tienen lector;
 * - standalone: publicaciones que solo existen como lector (sin descarga).
 */
export async function GET() {
  const [reports, standalone] = await Promise.all([loadReaderIndex(), loadStandaloneReaders()]);
  return NextResponse.json(
    { reports, standalone },
    { headers: { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } },
  );
}
