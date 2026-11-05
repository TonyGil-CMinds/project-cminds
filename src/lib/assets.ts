/**
 * Public base URL for static media hosted on Cloudflare R2 (no trailing slash).
 * Objects keep the same path they have under /public, so
 * `/platforms/x/y.jpg` lives at `${ASSETS_URL}/platforms/x/y.jpg`.
 *
 * Empty (the default) → files are served from /public as before, so the site
 * keeps working until the bucket is populated. NEXT_PUBLIC_* values are inlined
 * at build time: changing it requires a new build/deploy.
 */
export const ASSETS_URL = (process.env.NEXT_PUBLIC_ASSETS_URL ?? "").trim().replace(/\/+$/, "");

/** URL of a media file given its path under /public (must start with "/"). */
export function asset(path: string): string {
  return `${ASSETS_URL}${path}`;
}

/** Absolute URL for metadata (Open Graph, JSON-LD): R2 URLs pass through, local paths get the site origin. */
export function absoluteUrl(url: string, siteUrl: string): string {
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url}`;
}
