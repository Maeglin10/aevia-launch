import type { Metadata } from "next";

// Étape de paiement : rien à indexer, une page de tunnel dans les résultats n'aide personne.
export const metadata: Metadata = {
  title: "Paiement",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
