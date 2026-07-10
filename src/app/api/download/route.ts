import { NextResponse, NextRequest } from "next/server";

interface ReportFile {
  language:    string;
  url:         string;
  file_name:   string;
  title:       string;
  description: string;
  cover_image: string;
}

interface RawReport {
  id:             string;
  title:          string;
  description:    string;
  cover_image:    string;
  published_date: string;
  files:          ReportFile[];
}

const ALLOWED_EXACT_HOSTS = new Set(["cminds.base44.app", "base44.com"]);
const ALLOWED_SUFFIXES    = [".base44.com", ".base44.app"];

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (ALLOWED_EXACT_HOSTS.has(host)) return true;
  return ALLOWED_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

function isPrivateOrLoopback(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^fc[0-9a-f]{2}:/i.test(host) || /^fd[0-9a-f]{2}:/i.test(host)) return true;
  if (/^fe[89ab][0-9a-f]:/i.test(host)) return true;
  return false;
}

function sanitizeFilename(pathname: string): string {
  const rawName = pathname.split("/").pop()?.split("?")[0] || "";
  let name = "";
  try { name = decodeURIComponent(rawName); } catch { name = rawName; }
  const cleaned = name.replace(/[^a-zA-Z0-9._ -]/g, "").trim().slice(0, 100);
  return cleaned || "download";
}

export async function GET(req: NextRequest) {
  const reportId = req.nextUrl.searchParams.get("reportId");
  const lang     = req.nextUrl.searchParams.get("lang");
  if (!reportId) return NextResponse.json({ error: "Missing reportId" }, { status: 400 });

  const apiKey = process.env.REPORTES_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  let report: RawReport;
  try {
    const res = await fetch(
      `https://cminds.base44.app/functions/publicReportsFeed?id=${encodeURIComponent(reportId)}`,
      { headers: { "x-api-key": apiKey }, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    report = await res.json();
  } catch {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 502 });
  }

  const files = report?.files ?? [];
  if (files.length === 0) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const file = (lang && files.find((f) => f.language?.toLowerCase() === lang.toLowerCase())) || files[0];
  if (!file?.url) return NextResponse.json({ error: "File not found" }, { status: 404 });

  let target: URL;
  try {
    target = new URL(file.url);
  } catch {
    return NextResponse.json({ error: "Invalid file url" }, { status: 400 });
  }

  if (target.protocol !== "https:") {
    return NextResponse.json({ error: "Invalid file url" }, { status: 400 });
  }
  if (!isAllowedHost(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }
  if (isPrivateOrLoopback(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 });
    }

    const buffer   = await upstream.arrayBuffer();
    const filename = sanitizeFilename(target.pathname);
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
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }
}
