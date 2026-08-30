import type { Metadata } from "next";

// Titre propre à cette page. Sans lui elle héritait du <title> du layout
// racine : sept pages publiques de Launch le partageaient, mesuré en prod.
export const metadata: Metadata = {
  title: "Tarifs — site web professionnel livré en 2 heures",
  description:
    "Trois formules Aevia Launch : site vitrine, site pro multi-pages et site sur-mesure. Domaine, hébergement, Search Console et Analytics inclus. Prix affichés, sans abonnement caché.",
  alternates: { canonical: "https://launch.aevia.services/pricing" },
  openGraph: {
    title: "Tarifs — site web professionnel livré en 2 heures",
    description:
      "Trois formules Aevia Launch : site vitrine, site pro multi-pages et site sur-mesure. Domaine, hébergement, Search Console et Analytics inclus. Prix affichés, sans abonnement caché.",
    url: "https://launch.aevia.services/pricing",
    images: ["/api/og"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
