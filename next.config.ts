import type { NextConfig } from "next";

// Content-Security-Policy is intentionally shipped as Report-Only (below), not
// enforcing. This app relies on GSAP, Three.js/WebGL, @react-three/fiber,
// @hashintel/refractive, heavy inline styles/<style> tags, data: URIs for
// fonts/images, and blob/data workers — an enforced strict CSP would break
// these. Report-Only lets violations be observed (via CSP report endpoints /
// browser devtools) without blocking anything. Once reports have been
// reviewed and the policy tightened to match actual app behavior, promote
// this to a real `Content-Security-Policy` header.
const cspReportOnly =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";

/**
 * Host of the Cloudflare R2 bucket that serves static media (see src/lib/assets.ts
 * and docs/r2-assets.md). next/image only optimizes remote images whose host is
 * listed in images.remotePatterns, so it is derived from the same variable.
 * Read at build time: changing NEXT_PUBLIC_ASSETS_URL requires a new deploy.
 */
function assetsRemotePattern(): { protocol: "https"; hostname: string; pathname: string } | null {
  const raw = process.env.NEXT_PUBLIC_ASSETS_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const base = url.pathname.replace(/\/+$/, "");
    return { protocol: "https", hostname: url.hostname, pathname: `${base}/**` };
  } catch {
    return null;
  }
}

const assetsPattern = assetsRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: assetsPattern ? [assetsPattern] : [],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspReportOnly,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
