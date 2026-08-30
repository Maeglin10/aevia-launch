import type { Metadata } from "next";

// Page de travail interne sur les fonds vidéo.
export const metadata: Metadata = {
  title: "Laboratoire vidéo",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
