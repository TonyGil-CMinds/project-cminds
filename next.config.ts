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
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";

const nextConfig: NextConfig = {
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
