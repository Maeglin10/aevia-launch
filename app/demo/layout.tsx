import type { Metadata } from "next";

// Bacs à sable de démonstration : contenu factice, tenu hors de l'index pour ne pas concurrencer les vraies pages.
export const metadata: Metadata = {
  title: "Démonstration",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
