import { NextResponse, NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.REPORTES_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  try {
    const res = await fetch(
      `https://cminds.base44.app/functions/publicReportsFeed?id=${encodeURIComponent(id)}`,
      { headers: { "x-api-key": apiKey }, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
