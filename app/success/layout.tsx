import type { Metadata } from "next";

// Page de remerciement post-achat : atteinte après paiement, jamais depuis un moteur.
export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
