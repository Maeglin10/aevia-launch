import type { Metadata } from "next";

// Page de travail interne sur les en-têtes de section.
export const metadata: Metadata = {
  title: "Laboratoire",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
