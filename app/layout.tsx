import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LangProvider } from "@/lib/LangContext";
import { CookieBanner } from "@/components/CookieBanner";
import { ConsentAwareAnalytics } from "@/components/ConsentAwareAnalytics";
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
    "Aevia Launch génère votre site web pro avec IA : rédaction, design, SEO. Wizard 5 étapes, preview instantané, mise en ligne en 2h. Sans compétence design.",
  keywords: [
    "site web 2 heures",
    "générateur site IA",
    "AI website generator",
    "constructeur site web IA",
    "Aevia Launch",
    "AeviaLaunch",
    "AI copywriting",
    "website builder AI",
    "Vercel deploy",
    "Next.js website",
    "site web automatisé",
    "création site rapide",
    "site freelance pro",
    "agence digitale IA",
    "Valentin Milliand",
  ],
  authors: [{ name: "Valentin Milliand", url: "https://valentin-milliand.vercel.app" }],
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
    title: "Aevia Launch — Votre site web pro en 2 heures, généré par IA",
    description:
      "Générez votre site web professionnel avec IA. Prévisualisez instantanément, déployé sur Vercel en 2h.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Aevia Launch — Générateur de sites web par IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aevia_io",
    creator: "@aevia_io",
    title: "Aevia Launch — Votre site web pro en 2 heures",
    description:
      "Générez votre site web professionnel avec IA. Prévisualisez instantanément, déployé en 2h.",
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
  applicationSubCategory: 'AI Website Builder',
  operatingSystem: 'All',
  inLanguage: ['fr-FR', 'en-US', 'es-ES', 'de-DE', 'pt-PT'],
  description:
    'Générateur de site web par IA. Remplissez un formulaire en 5 étapes, l\'IA écrit vos textes, le site est déployé sur Vercel en 2h.',
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
  author: {
    '@type': 'Person',
    name: 'Valentin Milliand',
    url: 'https://valentin-milliand.vercel.app',
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
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
          <script
            async
            src="https://inbox.aevia.services/webchat/widget.js"
            data-widget-id="wid_2a6ea934ea6a6404d285e9fc93cb0707"
            data-api-url="https://skybot-inbox-production.up.railway.app/api/v1"
          />
        </LangProvider>
      </body>
    </html>
  );
}
