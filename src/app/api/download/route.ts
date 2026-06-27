import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: upstream.status });
    }

    const buffer   = await upstream.arrayBuffer();
    const rawName  = url.split("/").pop()?.split("?")[0] || "download";
    const filename = decodeURIComponent(rawName);
    const ext      = filename.split(".").pop()?.toLowerCase() || "";
    const EXT_TYPES: Record<string, string> = {
      pdf:  "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc:  "application/msword",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      png:  "image/png",
      jpg:  "image/jpeg",
      jpeg: "image/jpeg",
    };
    const contentType = EXT_TYPES[ext] ?? upstream.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}
