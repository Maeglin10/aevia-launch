import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LangProvider } from "@/lib/LangContext";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aevia-launch.vercel.app"),
  title: {
    default: "AeviaLaunch — AI Website Generator, Live in 2 Hours",
    template: "%s | AeviaLaunch",
  },
  description:
    "AeviaLaunch generates your professional website with AI-powered copywriting and SEO. Fill a 5-step form, preview instantly, go live on Vercel in 2 hours. No design skills needed.",
  keywords: [
    "AI website generator",
    "website builder AI",
    "AeviaLaunch",
    "AI copywriting",
    "website in 2 hours",
    "Vercel deploy",
    "Next.js website",
    "automated website creation",
    "Valentin Milliand",
  ],
  authors: [{ name: "Valentin Milliand", url: "https://valentin-milliand.vercel.app" }],
  creator: "Valentin Milliand",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aevia-launch.vercel.app",
    siteName: "AeviaLaunch",
    title: "AeviaLaunch — AI Website Generator, Live in 2 Hours",
    description:
      "Generate your professional website with AI-powered copywriting. Preview instantly, deployed on Vercel in 2 hours.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "AeviaLaunch — AI Website Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeviaLaunch — AI Website Generator, Live in 2 Hours",
    description:
      "Generate your professional website with AI-powered copywriting. Preview instantly, deployed on Vercel in 2 hours.",
    images: ["/api/og"],
    creator: "@valentinmilliand",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aevia-launch.vercel.app",
  },
};

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AeviaLaunch',
  url: 'https://aevia-launch.vercel.app',
  applicationCategory: 'WebApplication',
  operatingSystem: 'All',
  description:
    'AI-powered website generator. Fill a 5-step form, AI writes your copy, we deploy your site on Vercel in 2 hours.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free preview, no credit card required.',
  },
  author: {
    '@type': 'Person',
    name: 'Valentin Milliand',
    url: 'https://valentin-milliand.vercel.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-semibold">Skip to main content</a>
        <LangProvider>
          {children}
          <CookieBanner />
        </LangProvider>
      </body>
    </html>
  );
}
