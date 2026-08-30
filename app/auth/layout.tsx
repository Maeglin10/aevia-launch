import type { Metadata } from "next";

// Retour d'authentification : aucune valeur en recherche.
export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
