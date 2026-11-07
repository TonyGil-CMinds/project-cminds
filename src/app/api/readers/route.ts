import { NextResponse } from "next/server";
import { loadReaderIndex } from "@/components/reader3d/load";

/** Reportes del Archive que tienen lector 3D: { [reportId]: { slug, langs } }. */
export async function GET() {
  const readers = await loadReaderIndex();
  return NextResponse.json(readers, { headers: { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } });
}
