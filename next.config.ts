import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Disabled: React Compiler auto-memoizes prop-less template sub-components
  // that read the module-level `bp` (businessProfile) set during the page's
  // render, so they never re-rendered after the client session fetch and kept
  // showing demo data in production (worked in dev where the compiler is off).
  // Correctness does not depend on the compiler — it is a perf-only
  // optimization — so disabling it makes every template render real client
  // data. Re-enable only after refactoring templates to pass bp via props.
  reactCompiler: false,
  typescript: { ignoreBuildErrors: true },
  // Hide Next.js dev indicator (the small badge bottom-left in dev/preview builds)
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Pixabay sert ses images depuis son propre domaine, sans sous-domaine
      // d'images : sans ces deux lignes, `/_next/image` répond 400 et **une
      // photo proposée au client sur deux ne s'affiche jamais**.
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://inbox.aevia.services https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' https://js.stripe.com https://inbox.aevia.services https://www.googletagmanager.com";

    const connectSrc = isDev
      ? "connect-src 'self' ws: wss: https://api.anthropic.com https://js.stripe.com https://*.public.blob.vercel-storage.com https://skybot-inbox-production.up.railway.app https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net"
      : "connect-src 'self' https://api.anthropic.com https://js.stripe.com https://*.public.blob.vercel-storage.com https://skybot-inbox-production.up.railway.app https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://cdn.pixabay.com https://pixabay.com https://picsum.photos https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com https://www.transparenttextures.com",
              connectSrc,
              "frame-src 'self' https://js.stripe.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Template pages are embedded same-origin in an <iframe> by /preview/[sessionId] —
        // the blanket 'none' above blocks that, so allow same-origin framing here only.
        source: "/templates/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://cdn.pixabay.com https://pixabay.com https://picsum.photos https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com https://www.transparenttextures.com",
              connectSrc,
              "frame-src 'self' https://js.stripe.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry organization and project (set SENTRY_ORG + SENTRY_PROJECT env vars for source maps)
  silent: true,
  // Upload source maps only in CI/production builds to avoid slowing local dev
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },
  // Automatically tree-shake Sentry logger statements in production
  disableLogger: true,
  // Tunnels Sentry requests through /api/monitoring to avoid ad blockers
  tunnelRoute: "/api/monitoring",
});
