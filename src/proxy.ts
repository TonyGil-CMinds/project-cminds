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

/** The visitor's saved language choice, else the browser's preference. */
function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  return isLocale(cookie) ? cookie : negotiateLocale(request.headers.get("accept-language"));
}

/**
 * Short shareable links → the page they stand for (without the locale).
 * Kept here rather than imported, so the proxy bundle stays small; the toolkit
 * target must match TOOLKIT_PATH in its data.ts.
 */
const SHORT_LINKS: Record<string, string> = {
  "/tech4nature-toolkit-v1": "/toolkits/tech4nature-mexico-conservacion-ia-v01",
  "/tech4nature-mexico-toolkit-v1": "/toolkits/tech4nature-mexico-conservacion-ia-v01",
};

/** Target for a short link, keeping any sub-path (/tech4nature-toolkit-v1/insignia). */
function shortLinkTarget(path: string): string | null {
  for (const [short, target] of Object.entries(SHORT_LINKS)) {
    if (path === short || path.startsWith(`${short}/`)) return target + path.slice(short.length);
  }
  return null;
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  const hasLocale = isLocale(first);

  // Short links work with or without a locale (/tech4nature-toolkit-v1, /es/tech4nature-toolkit-v1).
  // Temporary redirect, so a short link can later point somewhere else.
  const target = shortLinkTarget(hasLocale ? pathname.slice(first.length + 1) : pathname);
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = `/${hasLocale ? first : preferredLocale(request)}${target}`;
    url.search = search;
    return NextResponse.redirect(url, 307);
  }

  // Already locale-prefixed — nothing to do.
  if (hasLocale) return NextResponse.next();

  // Root: negotiate from the browser, remember the choice.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}`;
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
  // Skip API routes, Next internals, and anything with a file extension.
  // The backslash must survive into the regex, so it is escaped for the string
  // literal too: a single \. collapses to a bare dot, which turns the last
  // alternative into .*..* and silently excludes EVERY non-root path.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
