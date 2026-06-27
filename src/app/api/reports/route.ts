import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.REPORTES_API_KEY;
  if (!apiKey) {
    console.error("[reports] REPORTES_API_KEY is not set");
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      "https://cminds.base44.app/functions/publicReportsFeed?status=published",
      {
        headers: {
          "x-api-key": apiKey,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[reports] upstream", res.status, body);
      return NextResponse.json(
        { error: `Upstream error ${res.status}`, detail: body },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
