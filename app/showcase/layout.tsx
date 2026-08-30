import type { Metadata } from "next";

// Titre propre à cette page. Sans lui elle héritait du <title> du layout
// racine : sept pages publiques de Launch le partageaient, mesuré en prod.
export const metadata: Metadata = {
  title: "Réalisations — exemples de sites livrés par Aevia Launch",
  description:
    "Parcourez des sites générés par Aevia Launch : restaurants, artisans, cabinets, commerces. Chaque exemple est un site complet, pas une maquette.",
  alternates: { canonical: "https://launch.aevia.services/showcase" },
  openGraph: {
    title: "Réalisations — exemples de sites livrés par Aevia Launch",
    description:
      "Parcourez des sites générés par Aevia Launch : restaurants, artisans, cabinets, commerces. Chaque exemple est un site complet, pas une maquette.",
    url: "https://launch.aevia.services/showcase",
    images: ["/api/og"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
