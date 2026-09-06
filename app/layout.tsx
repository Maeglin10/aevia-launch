import { LienEvitement } from "@/components/LienEvitement";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
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

// Aevia brand typography — free lookalikes for the (commercially restricted)
// Montaser Arabic / Helvetica Now Display specified in the brand manual.
// Named --font-inter / --font-space-grotesk (not the generic --font-body /
// --font-display) because several client templates under app/templates/
// already declare their own local `--font-body` / `--font-display` CSS
// variables (e.g. app/templates/premium.css, app/templates/impact-210) —
// reusing those names risks a real custom-property collision on shared
// routes. These variables are only ever consumed by the `.font-aevia-body`
// / `.font-aevia-display` utilities below, which are applied explicitly to
// Skylaunch's own chrome — never on <html>/<body>, and never referenced by
// app/templates/ code, so they stay fully inert everywhere else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://launch.aevia.services"),
  /*
    Validation Bing Webmaster Tools.
  
    Bing traite chaque sous-domaine comme un site distinct — contrairement à
    la propriété de domaine de Google, qui couvre les quatre d'un coup. La
    balise doit donc être servie par chacun d'eux.
  
    À NE PAS RETIRER après validation : Bing la revérifie périodiquement et
    dévalide le site si elle disparaît.
  
    Pourquoi Bing compte : son index alimente DuckDuckGo, Ecosia, Copilot et
    la recherche de ChatGPT — le chemin le plus court pour qu'un modèle de
    langue puisse lire et citer le site.
  */
  verification: { other: { "msvalidate.01": "681E06988B2667E24A211FA04F62AE24" } },
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
  // Référence au nœud canonique plutôt qu'une organisation redécrite : deux
  // descriptions voisines de la même entreprise se lisent comme deux entreprises.
  provider: { '@id': 'https://aevia.services/#organization' },
  publisher: { '@id': 'https://aevia.services/#organization' },
};

/*
  Le MÊME identifiant de nœud que celui déclaré par le Hub. Les quatre domaines
  décrivaient jusqu'ici quatre organisations anonymes qui se ressemblaient ; en
  partageant `@id`, ils décrivent une seule entité vue de quatre endroits, et
  les preuves portées par l'un valent pour tous.

  Pourquoi ça compte : « Aevia » est revendiqué par au moins sept entités, dont
  une filiale d'Eiffage. Une recherche sur le mot nu ne nous atteint pas. Ce
  sont le SIREN et les registres publics ci-dessous — pas nos propres
  sous-domaines, qui ne prouvent rien — qui permettent de nous distinguer.
*/
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://aevia.services/#organization',
  name: 'Aevia',
  legalName: 'VALENTIN MILLIAND (AEVIA WS)',
  alternateName: ['Aevia WS', 'Aevia Services', 'AeviaLaunch'],
  disambiguatingDescription:
    "Aevia (Aevia WS) est un éditeur de logiciels français indépendant fondé en 2019 à Bourg-en-Bresse par Valentin Milliand. Sans lien avec la société Aevia du groupe Eiffage, qui exerce dans l'énergie et les infrastructures.",
  url: 'https://aevia.services',
  logo: 'https://launch.aevia.services/favicon.svg',
  identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: '852546225' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bourg-en-Bresse',
    postalCode: '01000',
    addressRegion: 'Auvergne-Rhône-Alpes',
    addressCountry: 'FR',
  },
  email: 'valentinmilliand@aevia.services',
  sameAs: [
    // Corroborations tierces d'abord : ce sont elles qui lient « Aevia » au
    // SIREN 852546225 plutôt qu'à Eiffage.
    // La fiche d'établissement Google, validée. C'est la corroboration la plus
    // forte de la liste : Google y a attaché l'identifiant d'entité
    // /g/11zfhkfyr8, distinct de celui de la filiale d'Eiffage. Le site désigne
    // la fiche, la fiche désigne le site — la boucle est ce qui fait tenir
    // l'identité.
    'https://share.google/olhxyISOJZjAame0Q',
    'https://annuaire-entreprises.data.gouv.fr/entreprise/852546225',
    'https://www.pappers.fr/entreprise/852546225',
    'https://www.societe.com/societe/-852546225.html',
    'https://github.com/Maeglin10',
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
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
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
        {/*
          Le lien d'évitement au clavier. Son air ne lui vient qu'au focus : voir
          « .lien-evitement » dans globals.css, où la règle l'emporte sur la
          remise à zéro des soixante thèmes. Posé en style en ligne, l'espacement
          s'appliquait aussi au repos et gonflait la boîte du lien masqué.
        */}
        <LienEvitement />
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
