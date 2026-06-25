import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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
              "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com",
              connectSrc,
              "frame-src https://js.stripe.com",
              "frame-ancestors 'none'",
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
