import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LangProvider } from "@/lib/LangContext";
import { CookieBanner } from "@/components/CookieBanner";
import { ConsentAwareAnalytics } from "@/components/ConsentAwareAnalytics";
import { AeviaWebchat } from "@/components/AeviaWebchat";
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
  metadataBase: new URL("https://launch.aevia.services"),
  title: {
    // 51 chars
    default: "Aevia Launch — Votre site web pro en 2 heures",
    template: "%s | Aevia Launch",
  },
  description:
    // 156 chars
    "Aevia Launch déploie votre site web professionnel responsive, sécurisé et optimisé pour le SEO avec connexion Google Search Console et Analytics native en 2h.",
  keywords: [
    "site web 2 heures",
    "création site web responsive",
    "AI website generator",
    "création site Google Search Console",
    "Aevia Launch",
    "AeviaLaunch",
    "Google Analytics 4 intégration",
    "website builder SEO",
    "Vercel deploy",
    "Next.js website",
    "site web automatisé",
    "création site rapide",
    "site freelance pro",
    "agence digitale responsive",
  ],
  authors: [{ name: "Aevia", url: "https://aevia.services" }],
  creator: "Aevia",
  publisher: "Aevia",
  icons: { icon: "/favicon.svg" },
  alternates: {
    canonical: "/",
    languages: {
      fr: "/?lang=fr",
      en: "/?lang=en",
      es: "/?lang=es",
      de: "/?lang=de",
      pt: "/?lang=pt",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "es_ES", "de_DE", "pt_PT"],
    url: "https://launch.aevia.services",
    siteName: "Aevia Launch",
    title: "Aevia Launch — Votre site web pro en 2 heures, responsive et sécurisé",
    description:
      "Déployez votre site web professionnel responsive et sécurisé en 2h. Intégration Google Search Console & Analytics native.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Aevia Launch — Création de sites web professionnels responsive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aevia_io",
    creator: "@aevia_io",
    title: "Aevia Launch — Votre site web pro en 2 heures",
    description:
      "Déployez votre site web professionnel responsive et sécurisé en 2h. Intégration Google Search Console & Analytics native.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Aevia Launch',
  alternateName: ['AeviaLaunch', 'Aevia Launch'],
  url: 'https://launch.aevia.services',
  applicationCategory: 'WebApplication',
  applicationSubCategory: 'Website Builder',
  operatingSystem: 'All',
  inLanguage: ['fr-FR', 'en-US', 'es-ES', 'de-DE', 'pt-PT'],
  description:
    'Création de site web professionnel. Remplissez un formulaire en 5 étapes, le site est livré responsive, sécurisé, optimisé SEO et déployé sur Vercel en 2h.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Essentiel',
      price: '599',
      priceCurrency: 'EUR',
      description: 'Site vitrine pro, livré en 2 à 4 heures.',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '899',
      priceCurrency: 'EUR',
      description: 'Site multi-sections animé, blog et analytics.',
    },
    {
      '@type': 'Offer',
      name: 'Premium',
      price: '1499',
      priceCurrency: 'EUR',
      description: 'E-commerce, 3D, intégration Stripe.',
    },
  ],
  provider: {
    '@type': 'Organization',
    name: 'Aevia',
    url: 'https://aevia.services',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aevia',
  url: 'https://aevia.services',
  logo: 'https://launch.aevia.services/favicon.svg',
  sameAs: [
    'https://aevia.services',
    'https://inbox.aevia.services',
    'https://security.aevia.services',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-semibold">Skip to main content</a>
        <LangProvider>
          <ConsentAwareAnalytics />
          {children}
          <CookieBanner />
          <AeviaWebchat />
        </LangProvider>
      </body>
    </html>
  );
}
