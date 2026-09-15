import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";

/** Picks the best supported locale from the Accept-Language header. */
function negotiateLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q.split("=")[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  // Already locale-prefixed — nothing to do.
  if (isLocale(first)) return NextResponse.next();

  // Root: negotiate from the browser, remember the choice.
  if (pathname === "/") {
    const cookie = request.cookies.get("NEXT_LOCALE")?.value;
    const locale = isLocale(cookie) ? cookie : negotiateLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url, 307);
  }

  // Legacy un-prefixed URLs (/core, /mindscope/slug, …) — permanent redirect to /en
  // so existing inbound links and search rankings carry over.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Skip API routes, Next internals, and anything that looks like a static file.
  matcher: ["/((?!api|_next|.*\..*).*)"],
};

